# React的渲染组件

- typescript支持

## 路由信息

```
src
└─pages
    ├─.rwp
    └─demo
    | └─index.js
    └─index.js
```

- 所有在pages目录下的都为路由信息
- pages/index.js 表示首页
- pages/xxx/index.js  index.js 表示布局信息,其他文件按照约定路由信息执行



满足以下任意规则的文件不会被注册为路由

- 以 . 或 _ 开头的文件或目录
- 以 d.ts 结尾的类型定义文件
- 以 test.ts、spec.ts、e2e.ts 结尾的测试文件（适用于 .js、.jsx 和 .tsx 文件）
- components 和 component 目录
- utils 和 util 目录
- 不是 .js、.jsx、.ts 或 .tsx 文件
- 文件内容不包含 JSX 元素


## HTML 模板

### 修改默认模板

新建 src/pages/document.ejs  约定如果这个文件存在，会作为默认模板，比如

```
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title> title </title>
</head>
<body>  
  <div id="root"></div>
</body>
</html>
```

> `<div id="root"></div>` 表示React渲染的dom节点


## 配置信息

> 在目录下创建一个 `.rwp.js` 的文件格式如下

```js
exports.default = () => {
    // 返回的配置信息
    return {}
}
```

### alias

配置别名，对引用路径进行映射。

### target 

编译的目标

> 默认为web在浏览器中使用 https://webpack.js.org/configuration/target/

### title 

网页标题

```
{
  title: '测试标题',
}
```

### matter

物质的配置中心

```
{
  matter: 'https://127.0.0.1:8080/matter.json'
}
```

数据的格式如下

```
[{
    // 物质名称
    title: '',
    // 物质资源地址
    url: '',
    // 物质注册的路由
    route: ''
}]
```


> 用来加载物质的中心服务点

### devServer 

- port 指定的端口号 (默认: 8000)
- host 默认为 127.0.0.1

更多配置信息详见 https://webpack.js.org/configuration/dev-server/

### extraStylePluginImport

扩展的[按需加载](https://github.com/ant-design/babel-plugin-import)

```
{
  // 按需加载antd
  extraStylePluginImport: [{
      "libraryName": "antd",
      "style": true,
  }]
}
```

### extraBabelIncludes 

让Babel编译的路径(默认情况下指编译当前项目的`src`目录)

```
{
    extraBabelIncludes: [
        "node_modules/kotomi-ui"
    ]
}
```

### extraWebpack

扩展的webpack方法，会传入一个预设的webpack配置 
