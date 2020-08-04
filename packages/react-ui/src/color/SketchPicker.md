---
nav:
  title: 组件
  path: /components
group:
  path: /components/input
  title: 数据录入
title: SketchPicker 颜色选择器
---

# SketchPicker 颜色选择器

## 代码演示


```tsx
/**
 * title: 主要
 * desc: 一个简单的颜色选择器
 */

import React from 'react'
import { SketchPicker } from '@rwp/react-ui'

export default () => {
    return (
        <SketchPicker />
    )
}
```


## API

属性说明如下：

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|style      |css样式          |`Omit<CSSProperties, 'background'>` | -
|onChange   |改变颜色触发的事件|`onChange?: (value: RGBColor) => void` | -
|value      |当前颜色值        |`value?: RGBColor` | -
> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts