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

### 1.12.2-alpha.0

- 🆕 表格分组可以获取 `$column`,以及 `$level` 属性。

### 1.12.1-alpha.0

- 🐞 修复表格的 `GroupRendererProps` 的 `row`的 type 类型。

### 1.12.0-alpha.0

- 🆕 添加 `Empty` 空状态 组件
- 🆕 添加 `Popconfirm` 气泡确认框组件
- 🆕 添加 `Skeleton` 骨架屏组件

### 1.11.4-alpha.0

- Table
  - 🐞 修复表格分组的时候，没有正确显示分组信息。

### 1.11.3-alpha.0

- Table
  - 🆕 添加表格新增行的方法 `add(rows,start)` 扩展一个start,在哪一行插入,从零开始计数。

### 1.11.2-alpha.0

- 🔥 [更新到antd 依赖到 4.6.1](https://ant.design/changelog-cn#4.6.1)

### 1.11.0-alpha.0

- Table
  - 🆕 添加表格列的信息的隐藏和显示。
  - 🆕 添加表格列的拖拽改变列的顺序
  - 🆕 添加表格新增行的 `add`  方法 
- Tree
  - 🆕 添加 `enableDirectoryTree` 属性,来启用内置的目录树。
  - 🐞 修复 `NodeDragEventParams` 以及 `Key` 的ts引入问题。
  - 🐞 修复 `checkedKeys` 属性中存在未关联的key会导致在开发环境中出现警告的问题。
- 🔥 新增对传统浏览器js开发方式的支持,可直接引用编译的js来使用组件
- 🔥 [更新到antd 依赖到 4.6.0](https://ant.design/changelog-cn#4.6.0)