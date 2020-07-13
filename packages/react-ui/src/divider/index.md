---
nav:
  title: 组件
  path: /components
group:
  path: /components/layout
  title: 布局组件
title: Divider 分割线
---

# Divider 分割线

## 代码演示


```tsx
/**
 * title: 水平分割线
 * desc: 默认为水平分割线，可在中间加入文字。
 */

import React from 'react'
import { Divider } from '@rwp/react-ui'

export default () => {
    return (
 <>
    <p>
        这是一段文本内容
    </p>
    <Divider />
    <p>
       这是一段文本内容
    </p>
    <Divider dashed />
    <p>
       这是一段文本内容
    </p>
  </>
    )
}
```

## API

按钮的属性说明如下：

|属性        |说明	       |类型	     |默认值
|-----      |------       |-----      |-------
|className  |分割线样式类   |`string`  | -
|dashed     |是否虚线       |`boolean` | false
|orientation|分割线标题的位置|`left` \| `right` \| `cente` | `center`
|style      |分割线样式对象  |`CSSProperties` | -
|type       |水平还是垂直类型|`horizontal` \| `vertical` | `horizontal`
|plain      |文字是否显示为普通正文样式| `boolean` | `false`