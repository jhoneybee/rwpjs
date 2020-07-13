---
nav:
  title: 组件
  path: /components
group:
  path: /components/layout
  title: 布局组件
title: Space 间距
---

# Space 间距

## 代码演示


```tsx
/**
 * title: 基础用法
 * desc: 相邻组件水平间距。
 */

import React from 'react'
import { Space, Button } from '@rwp/react-ui'

export default () => {
    return (
        <Space>
            Space
            <Button>按钮一</Button>
            <Button>按钮二</Button>
            <Button>按钮三</Button>
        </Space>
    )
}
```

## API

按钮的属性说明如下：

|属性        |说明	       |类型	     |默认值
|-----      |------       |-----      |-------
|align      |对齐方式      |`start` \| `end` \|`center` \|`baseline` | -
|direction  |间距方向	   |`vertical` \| `horizontal` | `horizontal`
|size       |间距大小      |`small` \| `middle` \| `large` \| `number`| `small`