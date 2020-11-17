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

## 在 webpack 或者 create-react-app 中使用

```sh
npm install @rwp/react-ui
# 或者
yarn add @rwp/react-ui
```

直接采用以下方式使用即可

```ts
import { Button } from '@rwp/react-ui'
```


## 在浏览器中使用

在浏览器中使用 script 和 link 标签直接引入文件，并使用全局变量 `RWP`

我们在 npm 发布包内的 @rwp/react-ui/dist 目录下提供了 rwp.bundle.js 你也可以通过 [UNPKG](https://unpkg.com/browse/@rwp/react-ui/dist/) 进行下载。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script crossorigin src="https://unpkg.com/react@latest/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@latest/umd/react-dom.development.js"></script>
    <script crossorigin src="https://unpkg.com/@rwp/react-ui@latest/dist/rwp.bundle.js"></script>
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
