# Webpack的React预设

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

### devServer 

- port 指定的端口号 (默认: 8000)
- host 默认为 127.0.0.1