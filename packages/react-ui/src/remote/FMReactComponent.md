---
nav:
  title: 组件
  path: /components
group:
  path: /components/display
  title: 数据展现
title: FMReactRomponent 远程组件
---

# Result 结果

## 代码演示


```tsx
/**
 * title: 远程加载组件
 * desc: 远程加载react 组件
 */

import React from 'react'
import { Result, Button, FMReactComponent} from '@rwp/react-ui'

export default () => {
    return (
        <FMReactComponent
            url="http://127.0.0.1:8001/fastpack.share.js"
            module="$Index"
            scope="testModule"
        />
    )
}
```


## API

属性说明如下：

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    

