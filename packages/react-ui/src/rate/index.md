---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Rate 评分
---

# Rate 评分

## 代码演示


```tsx
/**
 * title: 主要
 * desc: 简单的评分使用
 */

import React from 'react'
import { Rate } from '@rwp/react-ui'

export default () => {
    return (
        <Rate allowHalf defaultValue={2.5} />
    )
}
```


## API

属性说明如下：

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|allowClear |是否允许再次点击后清除|`boolean` |`true`
|allowHalf  |是否允许半选|`boolean` | `false`
|autoFocus  |自动获取焦点|`boolean` | `false`
|character  |自定义字符  |`ReactNode` \| `(RateProps) => ReactNode` | `<StarFilled />`
|className  |自定义样式类名|`string` | 	-
|count      |star 总数|`number` | 5
|defaultValue|默认值|`number`   | 0
|disabled    |只读，无法进行交互|`boolean` | `false`
|style       |自定义样式对象|`CSSProperties` | -
|tooltips    |自定义每项的提示信息|`string[]`| -
|value       |当前数，受控值|`number`| -
|onBlur      |失去焦点时的回调|	`function()`| -
|onChange    |选择时的回调 | `function(value: number)`| -
|onFocus     |获取焦点时的回调| `function()`| -
|onHoverChange|鼠标经过时数值变化的回调| `function(value: number)`| -
|onKeyDown   |按键回调 | `function(event)`| -


> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts