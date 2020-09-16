# React 的构建工具，对Webpack的封装

## 项目结构介绍

```
src # 项目根目录
|-- .rwp # 项目自动生成的零时文件
|   |-- entry.tsx  # webpack的入口点
|   |-- routes.tsx # 当前的路由信息
|
|-- layouts # 布局文件
|   |-- index.tsx # 默认的布局文件
|
|-- pages # 约定路由
```

## 约定路由

所有路由信息，仅仅只支持一级路由，不支持嵌套路由。

例如pages目录如下: 

```
src
|-- ...
|
|-- pages
|   |-- index.route.tsx
|   |-- test.route.tsx
|   |-- directory
|       |-- directory1.route.tsx
```

那么对应的资源地址为

|资源地址 | 文件路径
|---     |---
|http://localhost:1996/ | src/pages/index.route.tsx
|http://localhost:1996/test |src/pages/test.route.tsx
|http://localhost:1996/directory/directory1 |src/pages/directory/directory1.route.tsx

> pages 目录下只有后缀为 `.route.tsx` 才会被解析为路由。