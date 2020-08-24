---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Popconfirm 气泡确认框
---

# Popconfirm 气泡确认框

点击元素，弹出气泡式的确认框。

## 代码演示

```tsx
/** 
 * title: 无描述  
 * desc: 无描述展示。
 */

import React from 'react'
import { Popconfirm } from '@rwp/react-ui'

export default () => {
    return (
        <Popconfirm
            title="你确定要删除这个文件吗?"
            okText="是"
            cancelText="否"
        >
            <a href="#">删除</a>
        </Popconfirm>
    )
}
```
  

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
|cancelText|取消按钮文字|`string`| 取消
|okText|确认按钮文字|`string`| 确定
|okType|确认按钮类型|`string`| `primary`
|okButtonProps|ok 按钮 props|`ButtonProps`| -
|cancelButtonProps|cancel 按钮 props|`ButtonProps`|-
|title|确认框的描述|`string` \| `ReactNode` \| () => `ReactNode`|-
|onCancel|点击取消的回调| `function(e)`|-
|onConfirm|点击确认的回调| `function(e)`|-
|icon|自定义弹出气泡 Icon 图标| `ReactNode`| `<ExclamationCircle />`
|disabled|点击 Popconfirm 子元素是否弹出气泡确认框|	`boolean`|`false`

更多属性请参考 Tooltip。
