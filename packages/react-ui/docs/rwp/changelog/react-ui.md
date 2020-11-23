---
nav:
  title: 更新日志
  path: /changelog
  order: 0
group:
  path: /changelog
  title: 更新日志
---

# UI 更新日志

遵循 Semantic Versioning 2.0.0 语义化版本规范。

## 最新版本

|名称 | 描述               | 版本号
|----- |----                |------
| `@rwp/react-ui` | 金丝雀版本   | [![react-ui](https://img.shields.io/npm/v/@rwp/react-ui/latest)](https://www.npmjs.com/package/@rwp/react-ui)


## 发布周期

 - 主版本号：含有破坏性更新和新特性，不在发布周期内。
 - 次版本号：每月发布一个带有新特性的向下兼容的版本。
 - 修订版本号：每周会进行日常 bugfix 更新。（如果有紧急的 bugfix，则任何时候都可发布）
 

## canary 版本

### 1.24.0-canary

-  🆕 新增 incubator 插件,用来预览和编辑Office

### 1.23.0-canary

- 🆕 新增 Breadcrumb 面包屑组件
- 🆕 新增 Descriptions 描述组件

### 1.22.0-canary

- Upload
  - 添加 `UploadPicturesWall` 支持多选,和限制图片格式

### 1.21.17-canary

- Form
  - 🐞 修复一下代码问题

### 1.21.16-canary

- Form
  - 🐞 修复Form的固定宽度的问题


### 1.21.15-canary

- Form
  - 🐞 修复Form的子元素可能不是一个数组,仅仅只是一个单元素

### 1.21.14-canary

- Table
  - 🐞 修复表格工具栏, 右键收缩的问题

### 1.21.13-canary

- Form
  - 🆕 添加Form的 `labelWidth` 属性来固定label宽度

### 1.21.12-canary

- 修复utils里面的toDoubleClick的时间判断

### 1.21.11-canary

- 测试发布

### 1.21.10-canary

- 测试发布

### 1.21.9-canary

- Modal
  - 🐞 修复modal,未显示body,此问题是由于1.21.8-canary改动引起的

### 1.21.8-canary

- Modal
  - 🐞 修复modal强制渲染的时候会触发异常

### 1.21.7-canary

- Modal 
  - 🐞 修复表格拖拽的问题,限制表格top不能拖拽出屏幕
- Table
  - 🆕 添加一个selectHeaderRenderer属性,自定义表格的选中框的头部

### 1.21.6-canary

- Table
  - 🐞 修复表格列拖拽的后不显示的问题