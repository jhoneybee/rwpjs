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
| `@rwp/react-ui` | 金丝雀版本   | [![react-ui](https://img.shields.io/npm/v/@rwp/react-ui/canary)](https://www.npmjs.com/package/@rwp/react-ui)
| |stable 稳定版本      | [![react-ui](https://img.shields.io/npm/v/@rwp/react-ui/latest)](https://www.npmjs.com/package/@rwp/react-ui)

## 发布周期

 - 主版本号：含有破坏性更新和新特性，不在发布周期内。
 - 次版本号：每月发布一个带有新特性的向下兼容的版本。
 - 修订版本号：每周会进行日常 bugfix 更新。（如果有紧急的 bugfix，则任何时候都可发布）
 
## stable 稳定版本

### 1.1.0

- 🔥 Table 表格优化
- 🔥 Form 表单优化
- 🔥 Modal 弹出框优化


### 1.0.0

2020年9月8日，今天是我的生日，于是在生日这天，发布了1.0正式版本。这一年以来收获很多很多。也是第一次拥有了自己的开源项目。

在此时此刻，我定义以下准则，这是一辈子需要遵循的。

- 我都会一直维护这个项目，直到永远。(PS: 永远到底有多远？ 或许总有那么几件事情，是值自己以一辈子去做的事情。)
- 项目一直会是开源的。（PS: 开源和收费不会存在冲突，因为我所有的关于编程的一切，都是开源社区给的，所以我不会闭源此项目）
- 网页上，不会存在任何广告信息（PS: 因为我自己讨厌广告!!!!! 非常，非常，非常的讨厌。）

同样在此刻，我也许下了我自己的心愿。 

- 能够变的更加优秀，无论是自己的技术，还是自己的生活。
- 遇到一个值得付出一辈子的女孩纸。
- 日语，英语，以及画画，希望自己的这些业余爱好能够变的更好

> (*/ω＼*) 是不是有些小贪心了。 (/ω＼*)……… (/ω•＼*)

## canary 版本

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

<!--

### 1.22.2-alpha.0

- Table
  - 🐞 修复表格列显示问题

### 1.21.1-alpha.0

- Table
  - 🐞 修复表格列显示问题

### 1.21.0-alpha.0

- Table
  - 🆕 添加一个selectRenderer

### 1.20.5-alpha.0

- Table
  - 🐞 修复在reload的时候无法设置select的问题

### 1.20.4-alpha.0

- Modal
  - 🐞 修复数据类型如果是 `number` 类型,宽度不会生效的问题

### 1.20.3-alpha.0

- Tree
  - 🐞 修复不支持原生 `antd` 的 `checkStrictly` 属性

### 1.20.2-alpha.0

- Modal
  - 🐞修复弹出框不支持百分比的问题

### 1.20.1-alpha.0

- Modal
  - 🐞修复弹框移动问题

### 1.20.0-alpha.0

- Table
  - 🆕 添加支持单选功能

### 1.19.10-alpha.0

- Table
  - 🐞 修复Table的Tools工具栏列信息显示的问题
- 🆕 toDoubleClick 添加一个参数区分点击的载体
- Modal
  - 🐞 修复Modal移动的问题

### 1.19.9-alpha.0

- 🐞 修复版本发布的问题

### 1.19.8-alpha.0

- Modal
  - 🐞 修复可以移除可见区域外的问题
- Table
  - 🐞 修复Table加载数据的时候，先加载的数据会在前面
  - 🐞 修复Tools工具栏可能显示不全的问题


### 1.19.7-alpha.0

- Table
  - 🐞 修复Table执行reload的时候的页码不对的问题
  - 🐞 修复reload之后，重写滚到到底部的时候不执行

### 1.19.6-alpha.0

- 🐞 修复Table兼容性问题, 以及1.19.5出现的问题。

### 1.19.5-alpha.0

- 🐞 修复Table兼容性问题

### 1.19.4-alpha.0

- Modal
  - 🐞 修复Modal点击的时候的loading问题

### 1.19.3-alpha.0

- Table
  - 🔥 优化表格右边的列的信息展现。
- Modal
  - 🐞 修复Modal点击的时候未正常关闭的问题

### 1.19.2-alpha.0

2020-9-11

- Table
  - 🔥 修复表格展开的时候,同时删除这条数据会的问题

### 1.19.1-alpha.0

2020-9-10

- Table
  - 🔥 优化表格展开行的时候，效率问题，只会初始当前展开的
- Button
  - 🐞 优化异步回调的问题

### 1.19.0-alpha.0

2020-9-10

- Table
  - 🔥 优化表格展开行的时候，不覆盖对应的行信息
- Tree
  - 🐞 修复Tree右键,不会跟随滚动条滚动

### 1.18.9-alpha.0

2020-9-9

- Form 
  - 🐞 修复Form样式问题，用grid布局替代table布局

### 1.18.8-alpha.0

2020-9-9

- 优化样式引用问题

### 1.18.7-alpha.0

2020-9-9

- Tree
  - 🐞 导出Tree的props定义


### 1.18.6-alpha.0

2020-9-9

- Button
  - 🐞 修复按钮，在非Promise对象中，点击后会一直处于禁用状态
- 🆕 添加一个isPromise的方法
- 🗑 删除dumi的按需加载antd的样式
- 🗑 删除react-slick的依赖，此依赖项是多余的
- 🔥 优化一些网站的Demo

### 1.18.5-alpha.0

2020-9-8

- Tree
  - 🐞 修复 onDrop 的问题

### 1.18.4-alpha.0

- Tree
  - 🐞 修复 onDrop 在执行异步方法的时候preventDefault会失效 

### 1.18.3-alpha.0

- Table
  - 🐞 修复表格删除数据后，又会重新出现。

### 1.18.2-alpha.0

- Table
  - 🐞 修复表格在执行删除一条数据，之后在执行修改数据的时候，之前删除的数据状态会重新变成修改状态。

### 1.18.1-alpha.0

- Table
  - 🐞 修复在水平滚动条滚动的时候，无法进行展开的问题。

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
- 🔥 [更新到antd 依赖到 4.6.0](https://ant.design/changelog-cn#4.6.0) -->