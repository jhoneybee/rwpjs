---
nav:
  title: 组件
  path: /components
group:
  path: /components/input
  title: 数据录入
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


## Checkbox.Group

|属性          |说明	       |类型	     |默认值
|-----        |------       |-----      |-------
|defaultValue |默认选中的选项 |`string[]`| []
|disabled     |整组失效      |`boolean`  | false
|name         |CheckboxGroup 下所有 `input[type="checkbox"]` 的 name 属性| string| -
|options      |指定可选项    |`string[]`&#124;`Option[]` | []
|value        |指定选中的选项|`string[]` | []
|onChange     |变化时回调函数	|`Function(checkedValue)` | -


## 方法

|名称        |描述	       
|-----      |------       
|blur()     |移除焦点	
|focus()    |获取焦点

> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts