---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Collapse 折叠面板
---

# Collapse 折叠面板

可以折叠/展开的内容区域。


## 代码演示


```tsx
/**
 * title: 折叠面板
 * desc: 一个基础的折叠面板
 */

import React from 'react'
import { Collapse } from '@rwp/react-ui'

export default () => {
    return (
        <>
            <Collapse defaultActiveKey={['1']}>
                <Collapse.Panel header="This is panel header 1" key="1">
                <p> Day before yesterday I saw a rabbit, and yesterday a deer, and today, you.</p>
                </Collapse.Panel>
            </Collapse>
        </>
    )
}
```

## API

### Collapse

|属性        |说明	       |类型	   |默认值
|-----      |------       |-----   |-------
|activeKey  |当前激活 tab 面板的 key|| `string[]` \| `string` \| `number[]` \| `number` | 默认无，accordion 模式下默认第一个元素	
|defaultActiveKey|初始化选中面板的 key| `string[]` \| `string` \| `number[]` \| `number` | -
|bordered|带边框风格的折叠面板 | `boolean` | `true`
|accordion|手风琴模式         | `boolean`  | `false`
|onChange|切换面板的回调      | `function`  | -
|expandIcon|自定义切换图标    | `(panelProps) => ReactNode`| -
|expandIconPosition|设置图标位置 | `left` \| `right` | 
|destroyInactivePanel|销毁折叠隐藏的面板| `boolean` | `false`
|ghost|使折叠面板透明且无边框 | `boolean` | `false`

### Collapse.Panel

|属性        |说明	       |类型	   |默认值
|-----      |------       |-----   |-------
|disabled   |禁用后的面板展开与否将无法通过用户交互改变| `boolean` | `false`
|forceRender|被隐藏时是否渲染 DOM 结构 | `boolean` | `false`
|header     |面板头内容  | `string` \| `ReactNode` | -
|key        |对应 activeKey| `string` \| `number`| 	-
|showArrow  |是否展示当前面板上的箭头| `boolean` | `true`
|extra      |自定义渲染每个面板右上角的内容 | `ReactNode`| -


