---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Alert 警告提示
---

# Alert 警告提示

## 代码演示


```tsx
/**
 * title: 基本
 * desc: 最简单的用法，适用于简短的警告提示。
 */

import React from 'react'
import { Alert } from '@rwp/react-ui'

export default () => {
    return (
        <>
            <Alert
                message="成功"
                description="这是一个成功类型的描述"
                type="success"
            />
            <br />
            <Alert
                message="信息"
                description="这是一个信息类型的描述"
                type="info"
            />
             <br />
            <Alert
                message="警告"
                description="这是一个警告类型的描述"
                type="warning"
            />
             <br />
            <Alert
                message="错误"
                description="这是一个错误类型的描述"
                type="error"
            />
        </>
    )
}
```


## API

属性说明如下：

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|afterClose |关闭动画结束后触发的回调函数 |	`() => void` | 	-
|banner     |是否用作顶部公告 | `boolean` | 	`false`
|closable   |默认不显示关闭按钮| `boolean`| 	-
|closeText  |自定义关闭按钮 | `string` \| `ReactNode`| 	-
|description|警告提示的辅助性文字介绍| `string` \| `ReactNode`| 	-
|icon       |自定义图标,`showIcon` 为 `true` 时有效| `ReactNode`| 	-
|message    |警告提示内容  |	`string` \| `ReactNode`| 	-
|showIcon   |是否显示辅助图标 | `boolean` | `false`,`banner` 模式下默认值为 `true`
|type       |指定警告提示的样式，有四种选择 `success`,`info`,`warning`,`error`| `string`|	`info`,`banner` 模式下默认值为 `warning`
|onClose    |关闭时触发的回调函数| `(e: MouseEvent) => void`| -

## Alert.ErrorBoundary

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|message    |自定义错误标题，如果未指定会展示原生报错信息|`ReactNode`|`{{ error }}`
|description|自定义错误内容，如果未指定会展示报错堆栈|`ReactNode`| `{{ error stack }}`	

> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts