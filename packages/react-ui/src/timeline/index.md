---
nav:
  title: 组件
  path: /components
group:
  path: /components/display
  title: 数据展现
title: Timeline 时间轴
---

# Timeline 时间轴

垂直展示的时间流信息。

```tsx
/** 
 * title: 基本  
 * desc: 一个简单的时间轴
 */

import React from 'react'
import { Timeline } from '@rwp/react-ui'

export default () => {

    return (
       <Timeline>
            <Timeline.Item>早上</Timeline.Item>
            <Timeline.Item>中午</Timeline.Item>
            <Timeline.Item>晚上</Timeline.Item>
        </Timeline>
    )
}
```

```tsx
/** 
 * title: 加载中  
 * desc: 加载的时间轴
 */

import React from 'react'
import { Timeline } from '@rwp/react-ui'

export default () => {

    return (
       <Timeline pending="加载中..." reverse={false}>
            <Timeline.Item>2020-10-1</Timeline.Item>
            <Timeline.Item>2020-10-2</Timeline.Item>
            <Timeline.Item>2020-10-3</Timeline.Item>
            <Timeline.Item>2020-10-4</Timeline.Item>
        </Timeline>
    )
}
```

## API

时间轴。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
|pending| 指定最后一个幽灵节点是否存在或内容 | `boolean` \| `string` \| `ReactNode` | `false`
|pendingDot| 当最后一个幽灵节点存在時，指定其时间图点 | `string` \| `ReactNode` | `<LoadingOutlined />`
|reverse| 节点排序 | `boolean`| `false`
|mode | 通过设置 `mode` 可以改变时间轴和内容的相对位置| `left` \| `alternate` \| `right` | -

## Timeline.Item

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
|color |指定圆圈颜色 `blue`, `red`, `green`, `gray` 或自定义的色值 | `string` |`blue`
|dot   | 自定义时间轴点 | `string` \| `ReactNode`| -
|position| 自定义节点位置| `left` \| `right`| -
|label   | 设置标签 | `ReactNode`| -
