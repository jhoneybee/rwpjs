# React UI 组件库

[![react-ui](https://img.shields.io/github/license/jhoneybee/rwpjs)](../../LICENSE) [![react-ui](https://img.shields.io/npm/v/@rwp/react-ui/canary)](https://www.npmjs.com/package/@rwp/react-ui) [![DeepScan grade](https://deepscan.io/api/teams/11762/projects/14701/branches/278834/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=11762&pid=14701&bid=278834)

## ✨ 特性

- 🌈 提炼自企业级中后台产品的交互语言和视觉风格。
- 📦 开箱即用的高质量 React 组件。
- 🛡 使用 TypeScript 开发，提供完整的类型定义文件。
- ⚙️ 高效的Form组件, 以及高效的表格组件
- 🌍 高性能组件库  

## 🖥 兼容环境

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" /><br/>IE / Edge | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /><br/>Firefox |<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /><br/>Chrome | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /><br/>Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" /><br/>iOS Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/samsung-internet/samsung-internet_48x48.png" alt="Samsung" width="24px" height="24px" /><br/>Samsung | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" /><br/>Opera |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| Edge| last 2 versions| last 2 versions| last 2 versions| last 2 version| last 2 versions| last 2 versions

## 📦 安装

```bash

npm install @rwp/react-ui --save
# or 
yarn add @rwp/react-ui
```

## 本地构建与发布包校验

在本目录使用 npm 锁文件安装并构建：

```bash
npm ci --ignore-scripts
npm run typecheck
npm run build
npm run verify:dist -- --report .artifacts/npm-parity.json
npm test -- --runInBand --watch=false
```

`verify:dist` 下载当前版本的 npm tarball，检查下载完整性，并逐字节比对全部 `dist/` 文件，同时检查版本、入口、运行依赖和 peerDependencies。任何缺失、多出或内容不同的文件都会使校验失败。离线时可用 `--reference /path/to/package` 指定包含 `package.json` 和 `dist/` 的已解包 npm 包。

当前源码基于 npm 1.36.16，包含本地表格编辑、刷新修复，以及列宽回调和列配置查询能力，因此严格的 `verify:dist` 预期会报告这些变更引入的差异。使用 `npm run typecheck`、`npm test -- --runInBand --watch=false` 和 `npm run build` 验证本地修改，产物比对用于核查与原发布包的具体差别。

构建固定了历史 Babel 生成器版本，并保留 CommonJS、ESM 两份产物；`module` 字段与 npm 1.36.16 一样指向 CommonJS。TypeScript 使用兼容 Windows 路径的过滤规则、CRLF 声明文件换行，并排除发布包不包含的 demo 声明。源码保持严格类型检查；`skipLibCheck` 用于跳过旧依赖自身的声明兼容性问题（包括 Ant Design 的模板字符串索引签名和 fast-ui 对 QRCode 的声明）。

文档站使用 dumi 1.0.34，其示例转换器依赖旧版 Babel 的默认导出形式。`@babel/plugin-transform-modules-commonjs` 和 `@babel/helper-module-transforms` 固定为 7.12.1，防止依赖升级后示例函数残留 `exports` 引用，导致页面出现 `exports is not defined`。`test/docs-demos.test.tsx` 通过实际 dumi 转换和渲染验证 Alert 文档示例及常见默认导出写法。
