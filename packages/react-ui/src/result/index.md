---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Result 结果
---

# Result 结果

## 代码演示


```tsx
/**
 * title: 403
 * desc: 无权限访问
 */

import React from 'react'
import { Result, Button } from '@rwp/react-ui'

export default () => {
    return (
        <Result
            status="403"
            title="403"
            subTitle="对不起,无权限访问此页面。"
            extra={<Button type="primary">返回首页</Button>}
        />
    )
}
```

```tsx
/**
 * title: 404
 * desc: 未找到此页面
 */

import React from 'react'
import { Result, Button } from '@rwp/react-ui'

export default () => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="对不起,未找到此页面。"
            extra={<Button type="primary">返回首页</Button>}
        />
    )
}
```

```tsx
/**
 * title: 500
 * desc: 服务器发生错误
 */

import React from 'react'
import { Result, Button } from '@rwp/react-ui'

export default () => {
    return (
        <Result
            status="500"
            title="500"
            subTitle="对不起,服务器发生错误。"
            extra={<Button type="primary">返回首页</Button>}
        />
    )
}
```

## API

属性说明如下：

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|title     |title 文字    |`ReactNode`| -
|subTitle  |subTitle 文字 |`ReactNode` | -
|status    |结果的状态，决定图标和颜色|`success` \| `error` \| `info` \| `warning` \| `404` \| `403` \| `500` | `info`
|icon      |自定义 icon | `ReactNode`| -
|extra     |操作区   |`ReactNode`| -

> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts