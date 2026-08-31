# MyBooks 文档

MyBooks 项目的 Markdown 文档，使用 VitePress 构建并发布到 GitHub Pages。

## 目录约定

`src` 下的目录对应站点路径。例如：

- `src/api/index.md` -> `https://mybookstop.github.io/docs/api/`
- `src/api/mybooks.md` -> `https://mybookstop.github.io/docs/api/mybooks`

图片可以在 Markdown 中使用相对路径引用，VitePress 会在构建时处理资源：

```markdown
![接口流程图](./images/request-flow.png)
```

## 本地开发

```bash
npm install
npm run docs:dev
```

## 构建和预览

```bash
npm run docs:build
npm run docs:preview
```

构建产物位于 `.vitepress/dist`。推送到 `main` 分支后，GitHub Actions 会自动构建并发布到 GitHub Pages。
