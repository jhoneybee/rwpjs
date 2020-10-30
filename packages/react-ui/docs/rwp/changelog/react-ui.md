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

### 1.2.0

- Table
  - 🐞 修复表格列拖拽的后不显示的问题
  - 🆕 添加一个selectHeaderRenderer属性,自定义表格的选中框的头部
  - 🐞 修复表格列工具栏列信息显示不全的问题
- Modal
  - 🐞 修复表格拖拽的问题,限制表格top不能拖拽出屏幕
  - 🐞 修复弹出框拖动的时候会突然移动一下的视觉效果
- 修复单击事件转换为双击事件的问题

### 1.1.0

- 日常代码优化


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

### 1.21.13-canary

- Form
  - 🆕 添加Form的 `labelWidth` 属性来固定label宽度

### 1.21.12-canary

- 修复utils里面的toDoubleClick的时间判断

## 1.21.11-canary

- 测试发布

## 1.21.10-canary

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