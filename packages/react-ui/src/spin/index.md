---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Spin 加载中
---

# Spin 加载中

## 代码演示


```tsx
/**
 * title: 基本用法
 * desc: 一个简单的 loading 状态。
 */

import React from 'react'
import { Spin } from '@rwp/react-ui'

export default () => {
    return (
        <Spin />
    )
}
```

## API

属性说明如下：

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|delay     |延迟显示加载效果的时间（防止闪烁）|`number (毫秒)`| -
|indicator |加载指示符 |`ReactNode`| -
|size      |组件大小，可选值为 `small` `default` `large`|`string`|`default`
|spinning  |是否为加载中状态|`boolean`|`true`
|tip       |当作为包裹元素时，可以自定义描述文案|`string`| -
|wrapperClassName|包装器的类属性|`string`| -

> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts