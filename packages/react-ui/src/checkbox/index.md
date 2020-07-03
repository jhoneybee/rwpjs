---
nav:
  title: Components
  path: /components
group:
  path: /components
  title: 组件
title: Checkbox 多选框
---

# Checkbox 多选框




## 代码演示


```tsx
/**
 * title: 简单的checkbox
 * desc: 一个简单的checkbok
 */

import React from 'react'
import { Checkbox } from '@rwp/react-ui'

export default () => {
    return (
        <>
          <Checkbox>Checkbox</Checkbox>
        </>
    )
}
```

## API

按钮的属性说明如下：

|属性        |说明	       |类型	     |默认值
|-----      |------       |-----      |-------
|autoFocus  |自动获取焦点  | `boolean` | `false`
|checked    |指定当前是否选中| `boolean`| `false`
|defaultChecked|初始是否选中 | `boolean`| `false`
|disabled      |失效状态     | `boolean`| `false`
|indeterminate |设置 indeterminate 状态，只负责样式控制| `boolean`| `false`
|onChange | 变化时回调函数 | `Function(e:Event)` | -

> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts