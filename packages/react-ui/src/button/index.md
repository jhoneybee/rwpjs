---
nav:
  title: Components
  path: /components
group:
  path: /components
  title: 组件
title: Button 按钮
---

# Button 按钮

按钮用于开始一个即时操作。

以下是五种按钮的类型

- 主按钮: 用于主行动点，一个操作区域只能有一个主按钮。
- 默认按钮: 用于没有主次之分的一组行动点。
- 虚线按钮: 常用于添加操作。
- 文本按钮: 用于最次级的行动点。
- 链接按钮：用于作为外链的行动点。

以及四种状态属性。

- 加载中: 用于异步操作等待反馈的时候，也可以避免多次提交。
- 危险: 删除/移动/修改权限等危险操作，一般需要二次确认。
- 禁用: 行动点不可用的时候，一般需要文案解释。
- 幽灵: 用于背景色比较复杂的地方，常用在首页/产品页等展示场景。


## 代码演示


```tsx
/**
 * title: 按钮类型
 * desc: 按钮有四种类型：主按钮、次按钮、虚线按钮和链接按钮。主按钮在同一个操作区域最多出现一次。
 */

import React from 'react'
import { Button } from '@rwp/react-ui'

export default () => {
    return (
        <>
          <Button type="primary" style={{ marginRight: 8}} > 按钮(primary)</Button>
          <Button style={{ marginRight: 8}} >默认按钮类型</Button>
          <Button type="dashed" style={{ marginRight: 8}} > 按钮(dashed)</Button>
          <Button type="text" style={{ marginRight: 8}} >按钮(text)</Button>
          <Button type="link" style={{ marginRight: 8}} >按钮(link)</Button>
        </>
    )
}
```

```tsx
/**
 * title: 按钮的四种状态
 * desc: 演示按钮的四种状态，分别是 加载中，危险，禁用，幽灵
 */

import React from 'react'
import { Button } from '@rwp/react-ui'

export default () => {
    return (
        <>
          <br/><br/>
          <Button type="primary" style={{ marginRight: 8}} loading={true} autoLoading={false} > 按钮(primary)</Button>
          <Button style={{ marginRight: 8}} loading={true} autoLoading={false} >默认按钮类型</Button>
          <Button type="dashed" style={{ marginRight: 8}} loading={true} autoLoading={false}> 按钮(dashed)</Button>
          <Button type="text" style={{ marginRight: 8}} loading={true} autoLoading={false}>按钮(text)</Button>
          <Button type="link" style={{ marginRight: 8}} loading={true} autoLoading={false}>按钮(link)</Button>
          <br/><br/>
          <Button type="primary" style={{ marginRight: 8}} danger={true}> 按钮(primary)</Button>
          <Button style={{ marginRight: 8}} danger={true}>默认按钮类型</Button>
          <Button type="dashed" style={{ marginRight: 8}} danger={true}> 按钮(dashed)</Button>
          <Button type="text" style={{ marginRight: 8}} danger={true}>按钮(text)</Button>
          <Button type="link" style={{ marginRight: 8}} danger={true}>按钮(link)</Button>
          <br/><br/>
          <Button type="primary" style={{ marginRight: 8}} disabled={true}> 按钮(primary)</Button>
          <Button style={{ marginRight: 8}} disabled={true}>默认按钮类型</Button>
          <Button type="dashed" style={{ marginRight: 8}} disabled={true}> 按钮(dashed)</Button>
          <Button type="text" style={{ marginRight: 8}} disabled={true}>按钮(text)</Button>
          <Button type="link" style={{ marginRight: 8}} disabled={true}>按钮(link)</Button>
          <br/><br/>
          <Button type="primary" style={{ marginRight: 8}} ghost={true}> 按钮(primary)</Button>
          <Button style={{ marginRight: 8}} ghost={true}>默认按钮类型</Button>
          <Button type="dashed" style={{ marginRight: 8}} ghost={true}> 按钮(dashed)</Button>
          <Button type="text" style={{ marginRight: 8}} ghost={true}>按钮(text)</Button>
          <Button type="link" style={{ marginRight: 8}} ghost={true}>按钮(link)</Button>
        </>
    )
}
```

```tsx
/**
 * title: 执行异步方法
 * desc: 例如请求后端的时候，会执行一个异步方案，而且很耗时的时候默认是有loading进行状态显示，如果不需要可以通过`autoLoading`来取消
 */

import React from 'react'
import { Button } from '@rwp/react-ui'

export default () => {
    return (
        <>
          <Button
            type="primary"
            onClick={()=>{
              return new Promise((resolve)=>{
                setTimeout(() => {
                    resolve()
                }, 3000);
              })
            }}
          >
          加载3秒的延迟
          </Button>
        </>
    )
}
```
## API

通过设置 Button 的属性来产生不同的按钮样式，推荐顺序为：type -> shape -> size -> loading -> disabled。

按钮的属性说明如下：

|属性        |说明	       |类型	   |默认值
|-----      |------       |-----   |-------
|type       |设置按钮类型  |`default`&#124;`primary`&#124;`ghost`&#124;`dashed`&#124;`link`&#124;`text` |`default`
|icon       |设置按钮的图标组件|`React.ReactNode`| 
|shape      |设置按钮形状，可选值为 `circle`, `round` 或者不设| `circle`&#124;`round`&#124;`null` | `null`
|ghost      |幽灵属性，使按钮背景透明| `boolean` | `false`
|danger     |设置危险按钮   | `boolean` | `false`
|block      |将按钮宽度调整为其父宽度的选项 | `boolean` | `false`
|disabled   |按钮失效状态   | `boolean` | `false`
|onClick    |按钮点击事件   | `() => PromiseLike<void>` &#124; `void` | 
|enableAutoLoading|是否在点击的时候自动加载loading的状态| `boolean` | `true`
|loading    |装载状态        | `boolean` | `false`



> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts