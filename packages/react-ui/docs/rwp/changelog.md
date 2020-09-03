---
nav:
  title: 更新日志
  path: /changelog
  order: 0
group:
  path: /changelog
---

# 更新日志 

遵循 Semantic Versioning 2.0.0 语义化版本规范。

## 最新版本

| 描述               | 版本号
|----                |------
|alpha 内部测试版本   | [![react-ui](https://img.shields.io/npm/v/@rwp/react-ui.svg?style=flat-square)](https://www.npmjs.com/package/@rwp/react-ui)
|rc 预发布版本        | 未发布
|stable 稳定版本      | 未发布


## 发布周期

 - 主版本号：含有破坏性更新和新特性，不在发布周期内。
 - 次版本号：每月发布一个带有新特性的向下兼容的版本。
 - 修订版本号：每周会进行日常 bugfix 更新。（如果有紧急的 bugfix，则任何时候都可发布）

### 1.18.0-alpha.0

- Table
  - 🆕 添加可展开行功能。
  - 🆕 添加单击编辑单元格。
  - 🆕 添加 列的 `selectCell`属性可控制单元格选中
  - 🗑  删除 `commitChanges`

### 1.17.3-alpha.0

- Table
  - 🆕 添加表格默认开启复制功能
  - 🐞 修复无法进行键盘导航的问题。

### 1.17.2-alpha.0

- Table
  - 🐞 修复右边列配置信息，未跟随表格列进行变化的。

### 1.17.1-alpha.0

- Table
  - 🐞 修复点击全选没有触发 `onSelectedRowsChange` 事件.

### 1.17.0-alpha.0

- 🆕 添加 Collapse 折叠面板

### 1.16.6-alpha.0

- Table
  - 🐞 修复表格在删除选中的数据，调用 `getSelect` 仍然可以获取到删除的key。

### 1.16.5-alpha.0

- Input
  - 🔥 优化 TextArea 的提示输入字符信息信息。
- Card
  - 🗑  移除默认Card主题前面的小标识。
- Form
  - 🔥 修复控制台警告
- Table
  - 🐞 修复表格在父组件没有高度的情况下不会给一个默认高度

### 1.16.4-alpha.0

- Button
  - 🔥 移除点击的 `loading` 的视觉效果,改为 `disabled` 提升视觉体验。
  - 🗑  移除 `enableAutoLoading` 的属性

### 1.16.3-alpha.0

- Upload
  - ⚡️ 优化 `UploadPicturesWall` 显示显示图片的速度。

### 1.16.2-alpha.0

- Tree
  - 🆕 添加 style 属性
  - ⚡️ 优化Tree拖拽的计算两个节点的效率问题
  - 🐞 修复tree拖拽的时候会同时消除两个相同的节点


### 1.16.1-alpha.0

- Table
  - 🐞 修复表格无法正确删除行的问题

### 1.16.0-alpha.0

- Carousel
  - 🆕 引入antd的Carousel
- Tree
  - 🐞 修复需要点击两次才能够展开的问题
- Upload
  - 🔥 采用轮播方式预览图片
- Form 
  - 🆕 添加一个 `form` 属性来获取form的实例对象

### 1.15.1-alpha.0

- Table
  - 🐞 修复一个自适应高度的loading问题。

### 1.15.0-alpha.0

- Upload
  - 🆕 添加一个`UploadPicturesWall` 图片墙展现组件。负责图片的上传和展示
- Tree
  - 🐞 修复设置了`expandedKeys` 但是没有正确进行展开的问题。
- Table
  - 🐞 修复一个自适应高度的问题

### 1.14.1-alpha.0

- Table
  - 🆕 添加 onSelectedRowsChange 事件,可获取用户点击select框获取改变的事件。


### 1.14.0-alpha.0

- Table
  - ⚡️ 提升表格初始化的加载速度。
  - 🆕 添加mode属性来设置表格的布局。以及对应的文档说明。
  - 🆕 添加 summaryRows 汇总行
  - 🆕 添加 rowHeight 来设置行高
  - 🆕 添加 headerRowHeight 来设置头部高度
  - 🔥 修改表格分组,分组行的样式。
  - 🔥 更新表格到 `7.0.0-canary.21`
  - 🗑  删除宽度，和高度，改为自适应宽高

### 1.13.1-alpha.0

- Table
  - 🐞 修复表格滚动的时候会重复加载数据。

### 1.13.0-alpha.0

- Tree
  - 🐞 修复Tree右键菜单,初始化之后就无法进行更改里面的属性
  - 🐞 修复右键的菜单点击其中一个后， 会触发节点左键的功能
- Table
  - 🐞 修复表格右下角刷新icon在禁用的时候未正确显示样式。

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