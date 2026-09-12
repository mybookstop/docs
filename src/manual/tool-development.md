# 开发 MyBooks 工具

MyBooks 的`系统管理`-`工具箱`是一套插件体系：每个工具是一个独立打包的小程序（Python 后端 +
可选的 HTML/JS 前端），以 iframe 方式运行在 MyBooks 内，通过标准化的 API 与主程序交互。你不需要
了解 MyBooks 核心代码，也不需要和主仓库共用一次发版节奏，就可以开发、打包、分发自己的工具。

本文介绍从零开始开发一个 MyBooks 工具的完整流程：环境准备、脚手架、后端 Core API、前端桥接、
打包发布，并以一个真实的翻译工具作为完整示例。

## 准备工作

MyBooks 官方提供了配套的脚手架 CLI —— **tools builder**，用来生成工具骨架、校验 `manifest.json`
格式、打包成可安装的 zip。

- 文档：<https://poxenstudio.github.io/tools_builder>
- 安装：

```bash
npm install -g mybooks-tools-builder
```

安装完成后会得到一个 `mytool` 命令，本文后续步骤都围绕它展开。

## 快速开始：生成一个工具骨架

```bash
mytool init my_tool --author "Your Name" --repo-url "https://github.com/you/my-mybooks-tool"
```

这会生成如下目录结构：

```
my_tool/
├── manifest.json
├── backend/
│   └── my_tool.py        # 继承 BaseTool 的工具类
└── frontend/              # 可选，纯静态 HTML/CSS/JS
    ├── index.html
    ├── lib/                # theme.css / i18n.js 等公共脚手架
    └── locales/            # 多语言文案
```

### manifest.json 关键字段

| 字段 | 说明 |
|---|---|
| `tool_id` | 唯一标识，小写字母/数字/下划线 |
| `name` / `description` | 展示名称与描述 |
| `revision` | 语义化版本号（x.y.z） |
| `author` / `repo_url` | 作者与源码仓库地址（**必填**，供审核与来源核实） |
| `core_api_version` | 声明要求的最低 Core API 版本 |
| `entry_backend` | 后端入口，格式为 `<module>.<ClassName>`，例如 `backend.my_tool.MyTool` |
| `entry_frontend` | 前端入口页面（不需要界面则可省略） |
| `api_routes` | 需要额外自定义 HTTP 接口时声明，如 `[{"path": "...", "handler": "..."}]` |
| `locales` / `default_locale` | 支持的语言与默认语言 |

### 常用命令

| 命令 | 说明 |
|---|---|
| `mytool init <tool_id>` | 生成工具骨架 |
| `mytool validate <path>` | 校验目录结构与 manifest 字段（支持目录或 zip） |
| `mytool build [dir]` | 校验并打包成 `dist/` 下的 zip，输出 SHA256 校验值 |
| `mytool bump <major\|minor\|patch>` | 按语义化版本规则升级 `manifest.json` 中的版本号 |

## 后端：Core API（`self.api.*`）

工具后端类继承 `BaseTool`，不直接访问 MyBooks 的内部对象（Calibre DB / SQLAlchemy session），
而是统一通过 `self.api` 这层稳定接口访问宿主能力，核心 API 版本演进也不会破坏已发布的工具。

- **`self.api.calibre`** —— 书库读写：`search_books()`、`get_metadata()`、`set_metadata()`、
  `import_book()`、`add_format()`、`delete_book()`、`all_book_ids()` 等。
- **`self.api.db`** —— 应用数据库（Item/Reader），只返回普通 dict，不暴露 ORM 对象：
  `get_item_by_book_id()`、`create_item()`、`get_reader()`。
- **`self.api.tasks`** —— 后台任务生命周期：`create_task()` → `update_progress()` → `complete_task()`，
  配合 `make_progress_callback()` 消除重复样板代码。
- **`self.api.messages`** —— 站内消息：`send_message(user_id, msg, status="info")`。
- **`self.api.storage`** —— 工具专属数据目录与持久化配置：`get_work_dir()`、`get_config()` /
  `set_config()`。
- **`self.api.settings`** —— 系统配置只读白名单：`get(key, default=None)`，只有白名单内的 key
  才会返回真实值。
- **`self.api.utils`** —— 常用文本/日期工具：`strip()`、`parse_date()`、
  `guess_title_author_from_filename()`。

所有方法都是同步调用；耗时操作请配合 `self.api.tasks` 做成后台任务，避免阻塞请求。

## 前端：MyBooksToolBridge

如果工具带界面，`frontend/index.html` 中引入桥接脚本即可获得与宿主交互的能力：

```html
<script src="/static/toolbox-bridge.js"></script>
```

- `MyBooksToolBridge.toolId` —— 当前工具 ID
- `MyBooksToolBridge.theme` / `MyBooksToolBridge.locale` —— 实时的主题与语言
- `MyBooksToolBridge.onThemeChange(fn)` / `onLocaleChange(fn)` —— 订阅主题/语言切换（宿主切换时
  不会重新加载 iframe，表单状态不丢失）
- `MyBooksToolBridge.fetch(path, options)` —— 调用工具自身的后端接口
  （`/api/toolbox/tool/{tool_id}/{path}` 的封装）
- `MyBooksToolBridge.notify(message, level)` —— 请求宿主弹出通知

多语言可以直接复用脚手架自带的 `frontend/lib/i18n.js`：`frontend/locales/manifest.json` 声明支持的
语言，`<code>.json` 存放对应文案，运行时按 `bridge.locale` 自动匹配最接近的语言。

## 打包与发布

```bash
mytool validate .
mytool build
```

`build` 会输出一个自包含的 zip（后端代码、前端静态资源、`manifest.json` 全部打包在内）。之后：

1. 推送代码到公开仓库（`repo_url` 指向的地址），供后续审核核对来源。
2. 在MyBooks `系统管理`-`系统设置`-`高级配置项`中打开工具的开发模式。
3. 在 MyBooks 管理后台的`系统管理`-`工具箱`中以开发者模式上传 zip 调试，或提交到官方工具商店
   等待上架。
4. 安装/更新后需要重启 MyBooks 服务，新工具才会真正生效。

系统设置中的相关配置项:
![Settings](images/toolbox_settings.png)


## 完整示例：EPUB 翻译工具

一个真实可参考的完整工具项目 —— 借助大语言模型翻译 EPUB 电子书：

- 仓库地址：<https://github.com/PoxenStudio/tool_epub_translator>

它展示了一个典型的外部工具项目结构：

```
tool_epub_translator/
├── manifest.json
├── backend/
│   ├── tool.py         # 主入口，编排各接口
│   ├── translation.py  # LLM 调用与翻译流程
│   ├── job_store.py     # 任务状态持久化
│   └── config.py / connection.py  # 配置与连通性校验
├── frontend/            # 配置、选书、进度展示的前端模块
└── scripts/
    └── build.sh          # 校验 + 打包脚本
```

可以从中参考：如何声明 `api_routes` 暴露自定义接口、如何用 `self.api.storage` 保存用户的 LLM
配置、如何用 `self.api.tasks` 跟踪一个跨页面刷新仍可续查进度的长任务，以及如何在书库选书与本地
上传两种输入间切换。

## 参考链接

- Tools Builder 文档：<https://poxenstudio.github.io/tools_builder>
- 示例项目 EPUB Translator：<https://github.com/PoxenStudio/tool_epub_translator>
- MyBooks 项目仓库：<https://github.com/poxenstudio/mybooks>
