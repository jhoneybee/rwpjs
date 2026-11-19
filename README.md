# RWP.JS

[![react-ui](https://img.shields.io/github/license/jhoneybee/rwpjs)](../../LICENSE) [![DeepScan grade](https://deepscan.io/api/teams/11762/projects/14701/branches/278834/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=11762&pid=14701&bid=278834)

![微信图片_20200924202254](https://user-images.githubusercontent.com/24241052/94144519-cd8e4980-fea3-11ea-96c6-5996538bcf18.png)

## 说明

RPW.JS 是一套 React 中 web网页开发的全栈解决方案。支持以下的内容

- 通过脚手架快速构建后端管理系统, 通过 `@rwp/cli` 提供 
- 40 + 的UI 组件, 通过 `@rwp/react-ui` 提供, 高性能组件,例如表格的虚拟滚动,以及无限滚动
- 微前端架构, 通过注册中心引入其他的前端模块(PS: 在开发中)

## 贡献指南

### 行为准则
我们有一份 [行为准则](./CODE_OF_CONDUCT.md)，希望所有的贡献者都能遵守，请花时间阅读一遍全文以确保你能明白哪些是可以做的，哪些是不可以做的。

### 透明的开发

我们所有的工作都会放在 GitHub 上。不管是核心团队的成员还是外部贡献者的 pull request 都需要经过同样流程的 review。

### 开发流程

在你 clone 了 rwpjs 的代码并且使用 npm install 安装完依赖后，你还可以运行下面几个常用的命令:

1. `npm start` 在本地运行 rwpjs 的网站。
2. `npm run lint:script` 检查代码风格
3. `npm run lint:fix` 修复代码风格
4. `npm test` 运行测试。(在运行测试前请确保 NODE_ENV 环境变量没有被设定，否则可能会引发一些问题)
5. `npm run build` 构建 rwpjs 到 dist 目录。

> 当前项目在 https://github.com/jhoneybee/rwpjs 中进行开发

### npm 发版

1. 在仓库根目录运行 `npm --prefix .github/release ci --ignore-scripts`，再运行 `node .github/release/node_modules/@changesets/cli/bin.js`。
2. 将生成的 changeset 随代码合入 `canary`。GitHub Actions 会创建或更新版本 PR，记录版本号和 changelog。
3. 合并版本 PR 后，Release 工作流只发布本次推送中版本号增加的包。npm 上已有的同版本会跳过上传。稳定版使用 `latest`，预发布版使用版本号中的渠道，例如 `alpha` 或 `canary`。

发版使用各包原有的构建脚本和 npm 打包配置。`@rwp/cli` 沿用 Yarn Classic 安装，发版时给 `npm run build` 传入 `--skipLibCheck`，跳过旧 Webpack 依赖间的声明冲突。`@rwp/react-ui` 使用包内的 npm 锁文件，由 `npm publish` 触发原有的 `prepublishOnly`。

首次发版前，将现有的 `packages/react-ui/package-lock.json` 纳入版本控制，在 GitHub 仓库配置具备相应 npm 包发布权限的 `NPM_TOKEN`，并允许 GitHub Actions 创建 pull requests。

## 文档地址

点击访问 [https://rwp.pub](https://rwp.pub) 来查看对应的文档说明。

## 附言

请注意, 使用此库应该是自由的, 而并非指的是价格, 我希望任何使用这个库的人,可以自己改变代码, 从中学习,与他人一起分享等等, 所以才采用此开源协议。

> Note that when we say "free" we mean freedom, not price. The goal of such freedom is that the people who use a given piece of software should be able to change it to fit their needs, learn from it, share it with their friends, etc. The GPL or LGPL licenses allows you those freedoms, so it is free software.

## 打赏

|微信 | 支付宝
|---- |-------
| <img src="https://rwp.pub/img/wechat.jpg" width="240" />|   <img src="https://rwp.pub/img/alipay.jpg" width="240" />

