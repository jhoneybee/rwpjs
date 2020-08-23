---
nav:
  title: 文档
  path: /introduce
group:
  path: /introduce
  title: RWP.JS
order: 0
---

# 快速开始

## 版本

- 最新版本: [![react-ui](https://img.shields.io/npm/v/@rwp/react-ui.svg?style=flat-square)](https://www.npmjs.com/package/@rwp/react-ui)

## 在浏览器中使用

在浏览器中使用 script 和 link 标签直接引入文件，并使用全局变量 `RWP`

我们在 npm 发布包内的 @rwp/react-ui/dist 目录下提供了 rwp.bundle.js 你也可以通过 [UNPKG](https://unpkg.com/browse/@rwp/react-ui/dist/) 进行下载。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
    <script src="./ui.bundle.js"></script>
    <title>Document</title>
</head>
<body>
    <div id='root'></div>
    <script>
        const e = React.createElement;
        const Button = e(RWP.Button,{
            children: '这是一个按钮'
        })
        ReactDOM.render(Button, document.querySelector('#root'))
    </script>
</body>
</html>
```

## 使用后端管理的模板


可以使用`pro-template`来快速创建项目 

```shell
git clone https://github.com/jhoneybee/pro-template.git
```

> 也可以直接打开 https://github.com/jhoneybee/pro-template 网页,然后点击 `Use this template`


