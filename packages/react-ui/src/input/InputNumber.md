---
nav:
  title: 组件
  path: /components
group:
  path: /components/input
  title: 数据录入
title: InputNumber 数字输入框
---

# InputNumber 数字输入框

通过鼠标或键盘，输入范围内的数值。

## 代码演示

```tsx
/**
 * title: 基本
 * desc: 数字输入框。
 */

import React from 'react'
import { InputNumber } from '@rwp/react-ui'

export default () => {
    return (
        <>
          <InputNumber /> 
        </>
    )
}
```
  

## API


| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
|autoFocus| 自动获取焦点| `boolean`
|defaultValue| 初始值 | `number`
|disabled | 禁用 | `boolean`
|formatter| 指定输入框展示值的格式| `function(value): string`
|max | 最大值| `number`
|min | 最小值| `number`
|parser| 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用| `function(string): number`	
|precision| 数值精度| `number`
|decimalSeparator| 小数点| `string`
|size | 输入框大小| `large` \| `middle` \| `small`
|step | 每次改变步数，可以为小数| `number` \| `string`
|value| 当前值| `number`
|onChange| 变化回调| `Function(value: number)`
|onPressEnter| 按下回车的回调 | `function(e)`

## 方法

| 名称 | 说明 
| --- | ---
|blur() | 移除焦点
|focus()| 获取焦点