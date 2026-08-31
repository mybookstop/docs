# MyBooks: Personal Calibre WebServer
![GitHub stars](https://img.shields.io/github/stars/PoxenStudio/mybooks.svg?logo=github)

An enhanced personal books management webserver built on Calibre + Vue, beautiful and easy-to-use.

## 个人图书管理系统
本项目专注于个人及家庭私有电子书、实体书管理，以及多账号的阅读管理，不适用于站点搭建。后续目标是结合AI提供更多的扩展阅读内容，形成个人的知识库。
![Example](/intro/images/example.jpg)

本系统与电子书阅读器不同，主要功能在于对电子书的管理功能。阅读器可以灵活选择，欢迎使用与MyBooks深度绑定的[MyReader](https://github.com/PoxenStudio/myreader)。

**友情提醒：中国境内网站，个人是不允许进行在线出版的，维护公开的书籍网站是违法违规的行为！建议仅作为个人使用！**

### 项目介绍
从v3.45.0开始，此项目从PoxenStudio/Talebook改名为MyBooks, 避免与talebook/talebook混淆。

MyBooks特性包括:
* 支持WAP简版页面，供精简浏览器访问
* 支持监听导入目录并自动导入新书
* 通过工具箱提供丰富的书籍管理工具
* 支持提供Podcast服务，让书库变播客
* 支持以WebDAV连接及数据同步
* 支持推送到支持Wifi传书的设备及Kindle上
* 支持自定义分类
* 支持添加实体书
* 支持阅读管理
* 集成epub2audio将epub转换有声书，内置多个中文及英文声音。
* 更新Calibre 7.6，系统使用Ubuntu 24.04
* 支持中文搜索时，使用简繁体同时搜索
* 支持epub、azw3、pdf互转, 支持Word文档入库
* 支持将图书指定为私藏模式，仅有上传者可见
* UI风格美化 - 增加暗黑模式
* 支持切换不同图标，支持设置用户头像
* 阅读器支持颜色样式切换，字体切换(提供4个内置字体)


目前提供的能力如下：![architecture](/intro/images/architecture.png)

扩展工具：
* 在Chromium系列浏览器，包括Chrome和Edge中安装扩展，可以快速方便进行查询和电子书上传，详情见[MyBooks Browser Extension](https://github.com/poxenstudio/extensions)。
* 在AI工具，如OpenClaw、QClaw中集成[MyBooks Skill](https://clawhub.ai/poxenstudio/mybooks)[之前为Talebook Skill]。

### 关注项目
公众号```Talebook```

![Talebook](/intro/images/gongzhonghao_talebook.jpg)

## 项目首页
[PoxenStudio MyBooks](https://mybooks.top)

## 联系邮箱
📧 [poxenstudio@gmail.com](mailto:poxenstudio@gmail.com)
