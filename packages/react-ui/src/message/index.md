---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Message 全局提示
---

# Message 全局提示

## 代码演示


```tsx
/**
 * title: 普通提示
 * desc: 普通的提示消息反馈
 */

import React from 'react'
import { message, Button } from '@rwp/react-ui'

export default () => {
    return (
        <Button
            onClick={async ()=>{
                await message.loading('正在加载数据', 3)
                message.info('加载数据成功')
            }}
        >
            点击提示消息
        </Button>
    )
}
```


## API

- message.success(content, [duration], onClose)
- message.error(content, [duration], onClose)
- message.info(content, [duration], onClose)
- message.warning(content, [duration], onClose)
- message.warn(content, [duration], onClose) // alias of warning
- message.loading(content, [duration], onClose)

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|content    |提示内容      |`string` \| `ReactNode` \| `config`
|duration   |自动关闭的延时，单位秒。设为 0 时不自动关闭|`number`
|onClose    |关闭时触发的回调函数|`function`

组件同时提供 promise 接口。

- message[level](content, [duration]).then(afterClose)
- message[level](content, [duration], onClose).then(afterClose)

> 其中message[level] 是组件已经提供的静态方法。then 接口返回值是 Promise。

也可以对象的形式传递参数：

- message.open(config)
- message.success(config)
- message.error(config)
- message.info(config)
- message.warning(config)
- message.warn(config) // alias of warning
- message.loading(config)

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|content    |提示内容      | `ReactNode` | -
|duration   |自动关闭的延时，单位秒。设为 0 时不自动关闭|`number`	| `3`
|onClose    |关闭时触发的回调函数 | `function`| -
|icon       |自定义图标          | `ReactNode`| -
|key        |当前提示的唯一标志  | `string` \| `number`| -
|className  |自定义 CSS class   | `string`| -
|style      |自定义内联样式     | `CSSProperties`| -

> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts