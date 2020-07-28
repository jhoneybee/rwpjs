---
nav:
  title: 文档
  path: /introduce
group:
  path: /introduce/template
  title: 脚手架
order: 1
---

# 前端模板

## 项目结构

```
.
|-- config // 项目代码配置 
|   `-- proxy.js // webpack 反向代理设置
|-- package.json // 项目依赖
|-- src // 主项目src目录 
|   |-- app.tsx // 当前项目的一些常规设置
|   |-- components // 组件
|   |   `-- Authenticate // 权限信息
|   |       `-- index.tsx
|   |-- layouts // 布局信息
|   |   |-- BasicLayout.tsx // 主要的基本布局信息
|   |   `-- index.tsx // 布局索引
|   |-- pages
|   |   |-- document.ejs // ejs模板
|   |   |-- index.route.tsx // 首页路由
|   |   `-- neglect // 此目录会忽略主框架
|   |       `-- user
|   |           |-- login.route.tsx // 登入页面
|   |           `-- style
|   |               `-- index.less
|   |-- services // 请求后端的服务入口
|   |   |-- index.ts // 全局导出
|   |   `-- user.service.ts // 用户信息
|   `-- utils // 工具目录
|       |-- context.ts // 上下文获取
|       |-- icon.tsx  // icon映射
|       `-- request.ts // 请求后端的request工具
|-- tsconfig.json
|-- typings.d.ts
`-- yarn.lock 

```

## 请求的接口信息

### 关于用户的信息接口

| 请求地址    | 请求方法 | 描述
|------      |------    |--------
|/user/login | POST     | 登入系统
|/user/login/fingerprint| POST | 记住密码,采用浏览器指纹方式进行登入
|/user/menu  | GET      | 查询当前用户的菜单信息

> src/services/user.service.ts 
