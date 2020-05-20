# React的渲染组件

- typescript支持

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

### title 

网页标题

```
{
  title: '测试标题',
}
```

### devServer 

- port 指定的端口号 (默认: 8000)
- host 默认为 127.0.0.1

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