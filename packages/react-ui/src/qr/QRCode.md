---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: QRCode 二维码
---

# QRCode 二维码

## 代码演示


```tsx
/**
 * title: 常规
 * desc: 一个显示二维码的组件,可用手机扫描二维码 默认为120px 可通过style来进行设置宽高
 */

import React, { useState } from 'react'
import { QRCode, Input } from '@rwp/react-ui'

export default () => {
    const [value, setValue] = useState('')
    return (
        <>
            <Input
                onChange={(value) => {
                   setValue(value)
                }}
            />
            <QRCode
                value={value}
            />
        </>
    )
}
```


## API


|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|value       |二维码的内容 |`string`  |-
|style       |当前组件的样式| `CSSProperties`| -


> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts