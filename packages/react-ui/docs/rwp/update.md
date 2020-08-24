---
nav:
  title: 文档
  path: /introduce
group:
  path: /introduce
  title: RWP.JS
order: 3
---

# 更新日志 

`@rwp/react-ui` [![react-ui](https://img.shields.io/npm/v/@rwp/react-ui.svg?style=flat-square)](https://www.npmjs.com/package/@rwp/react-ui) 遵循 Semantic Versioning 2.0.0 语义化版本规范。

## 发布周期

 - 主版本号：含有破坏性更新和新特性，不在发布周期内。
 - 次版本号：每月发布一个带有新特性的向下兼容的版本。
 - 修订版本号：每日会进行日常 bugfix 更新。（如果有紧急的 bugfix，则任何时候都可发布）

### 1.10.1-alpha.0

- Table
    - 🆕 添加表格列的信息的隐藏和显示。
    - 🆕 添加表格列的拖拽改变列的顺序
    - 🆕 添加表格新增行的方法 `add` 
- Tree
    - 🆕 添加 `enableDirectoryTree` 属性,来启用内置的目录树。
    - 🐞 修复 `NodeDragEventParams` 以及 `Key` 的ts引入问题。
    - 🐞 修复 `checkedKeys` 属性中存在未关联的key会导致在开发环境中出现警告的问题。
- 🔥 新增对传统浏览器js开发方式的支持,可直接引用编译的js来使用组件
- 🔥 [更新到antd 依赖到 4.6.0](https://ant.design/changelog-cn#4.6.0)