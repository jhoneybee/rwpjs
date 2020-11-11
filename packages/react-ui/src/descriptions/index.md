---
nav:
  title: 组件
  path: /components
group:
  path: /components/display
  title: 数据展现
title: Descriptions 描述列表
---

# Descriptions 描述列表

## 代码演示

<code src="./demo/simple.tsx" />

## API

### Descriptions

| 参数      | 说明        | 类型       | 默认值
|-------    |-----       |-----      |-------
|bordered   |是否展示边框 |`boolean`  | `false`
|colon      |配置 `Descriptions.Item` 的 `colon` 的默认值|`boolean` | `true`
|column	      |一行的 `DescriptionItems` 数量，可以写成像素值或支持响应式的对象写法 `{ xs: 8, sm: 16, md: 24}`|`number` | `3`
|extra     |描述列表的操作区域，显示在右上方|`ReactNode` | -
|layout       |描述布局| `horizontal` \| `vertical` | `horizontal`
|size      |设置列表的大小。可以设置为 `middle`, `small`, 或不填(只有设置 `bordered={true}` 生效)| `default` \| `middle` \| `small`
|title      |描述列表的标题，显示在最顶部|  `ReactNode`


### Descriptions.Item

| 参数      | 说明        | 类型       | 默认值
|-------    |-----       |-----      |-------
|label      |内容的描述   |`ReactNode`| -
|span       |包含列的数量 |`number`   | `1`


