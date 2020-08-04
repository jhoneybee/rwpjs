---
nav:
  title: 组件
  path: /components
group:
  path: /components/input
  title: 数据录入
title: Switch 开关
---

# Switch 开关

## 代码演示


```tsx
/**
 * title: 基本
 * desc: 最简单的用法。
 */

import React from 'react'
import { Switch } from '@rwp/react-ui'

export default () => {
    return (
        <Switch />
    )
}
```
## API

属性说明如下：

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|autoFocus |组件自动获取焦点|`boolean` |`false`
|checked   |指定当前是否选中|`boolean` | `false`
|checkedChildren|选中时的内容|`string` \| `ReactNode`| -
|defaultChecked|初始是否选中|`boolean` | `false`
|disabled|是否禁用|`boolean` | `false`
|loading|加载中的开关|`boolean` | `false`
|size|开关大小，可选值: `default` `small`|`string` | `default`
|unCheckedChildren|	非选中时的内容|	`string` \| `ReactNode`
|onChange|变化时回调函数|`function(checked: boolean, event: Event)`
|onClick|点击时回调函数|`function(checked: boolean, event: Event)`
|className|Switch 器类名|`string`

## 方法 

|名称        |说明	       
|-----      |------    
|blur()     |移除焦点
|focus()    |获取焦点   

> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts