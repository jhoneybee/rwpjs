---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Tag 标签
---

# Tag 标签

## 代码演示


```tsx
/**
 * title: 基本
 * desc: 最简单的用法。
 */

import React from 'react'
import { Tag, Divider } from '@rwp/react-ui'

export default () => {
    return (
        <>
            <Divider orientation="left">Presets</Divider>
            <div>
                <Tag color="magenta">magenta</Tag>
                <Tag color="red">red</Tag>
                <Tag color="volcano">volcano</Tag>
                <Tag color="orange">orange</Tag>
                <Tag color="gold">gold</Tag>
                <Tag color="lime">lime</Tag>
                <Tag color="green">green</Tag>
                <Tag color="cyan">cyan</Tag>
                <Tag color="blue">blue</Tag>
                <Tag color="geekblue">geekblue</Tag>
                <Tag color="purple">purple</Tag>
            </div>
            <Divider orientation="left">Custom</Divider>
            <div>
                <Tag color="#f50">#f50</Tag>
                <Tag color="#2db7f5">#2db7f5</Tag>
                <Tag color="#87d068">#87d068</Tag>
                <Tag color="#108ee9">#108ee9</Tag>
            </div>
        </>
    )
}
```

```tsx
/**
 * title: 可选择标签
 * desc: 可通过 CheckableTag 实现类似 Checkbox 的效果，点击切换选中效果。
 */

import React, { useState } from 'react'
import { Tag, Divider } from '@rwp/react-ui'

export default () => {
    const [checked, setChecked] = useState<boolean>(true)
    return (
        <>
            <Tag.CheckableTag
                checked={checked}
                onChange={() => {
                    setChecked(!checked)
                }}
            >
                CheckableTag
            </Tag.CheckableTag>
        </>
    )
}
```

## API

属性说明如下：

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|closable   |标签是否可以关闭|`boolean`|`false`
|color      |标签色 | `string`  | - 
|closeIcon  |自定义关闭按钮	| `ReactNode`| -
|onClose    |关闭时的回调 | `(e) => void`| -
|visible    |是否显示标签 | `boolean`| `true`
|icon       |设置图标     | `ReactNode`| -


## Tag.CheckableTag

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----   
|checked    |设置标签的选中状态| `boolean`| `false`
|onChange   |点击标签时触发的回调| `(checked) => void`| -

> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts