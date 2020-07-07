---
nav:
  title: 文档
  path: /introduce
group:
  path: /introduce
  title: 基于 RWP.JS 来进行构建 
---

## 关于 RWP.JS

RWP.JS 是基于webpack进行一些预设值。

- typescript 的预设
- babel-loader 的一些预设
  - @babel/preset-env
  - @babel/preset-react
  - @babel/preset-typescript
  - @babel/plugin-transform-runtime
  - @babel/plugin-proposal-class-properties
  - @babel/plugin-proposal-object-rest-spread
- style-loader 的预设
- css-loader 的预设
- less-loader 的预设
- react-route 来进行路由控制 

相对于umijs而言, rwpjs 本身和umijs非常类似,甚至很多设计借鉴了umijs的设计。

> 除 `.css` 以外,其他加载器,默认不会编译 `node_modules` 下的所有文件。