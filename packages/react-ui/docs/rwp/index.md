---
nav:
  title: 文档
  path: /introduce
group:
  path: /introduce
  title: 基于 RWP.JS 来进行构建 
---

## 简介说明

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

## RWP.JS 路由说明

```
src
└─pages
    ├─.rwp
    └─demo
    | └─demo.route.tsx
    └─hello.route.tsx
```

> 所有以 `*.route.tsx` 结尾的文件,才会自动注册为路由信息。

例如以上的两个文件夹，那么对应的路由信息则为

- /demo/demo
- /hello