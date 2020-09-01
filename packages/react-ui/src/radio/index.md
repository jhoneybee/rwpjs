---
nav:
  title: 组件
  path: /components
group:
  path: /components/input
  title: 数据录入
title: Radio 单选框
---

# Radio 单选框

## 代码演示


```tsx
/**
 * title: 基本
 * desc: 简单的单选框
 */

import React from 'react'
import { Radio } from '@rwp/react-ui'

export default () => {
    return (
        <Radio.Group defaultValue={1}>
            <Radio value={1}>A</Radio>
            <Radio value={2}>B</Radio>
            <Radio value={3}>C</Radio>
            <Radio value={4}>D</Radio>
      </Radio.Group>
    )
}
```


## API

## Radio/Radio.Button

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|autoFocus  |自动获取焦点   |`boolean`|`false`
|checked    |指定当前是否选中|`boolean`|`false`
|defaultChecked|初始是否选中|`boolean`|`false`
|disabled     |禁用 Radio   |`boolean`|`false`
|value        |根据 value 进行比较，判断是否选中| `any`| -

## RadioGroup

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|defaultValue|默认选中的值  |`any`    |-
|disabled    |禁选所有子单选器|`boolean`|`false`
|name        |	RadioGroup 下所有 input[type="radio"] 的 name 属性|`string`|-
|options     |以配置形式设置子元素|	`string[]` \| `Array<{ label: string value: string disabled?: boolean }>`|-
|size        |大小，只对按钮样式生效| `large` \| `middle` \| `small`	|-
|value       |用于设置当前选中的值 |`any`|-
|onChange    |选项变化时的回调函数 |`function(e:Event)`|-
|optionType  |	用于设置 Radio options 类型| 	`default` \| `button`| `default`
|buttonStyle |RadioButton 的风格样式，目前有描边和填色两种风格 | 	`outline` \| `solid`| `default`

## 方法

|名称        |说明	      
|-----      |------     
|blur()     | 移除焦点
|focus()    | 获取焦点