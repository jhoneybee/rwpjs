---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Tooltip 文字提示
---

# Tooltip 文字提示

## 代码演示


```tsx
/**
 * title: 基本用法
 * desc: 一个简单的 loading 状态。
 */

import React from 'react'
import { Tooltip, Button } from '@rwp/react-ui'

const text = <span>prompt text</span>;

const buttonWidth = 70;

export default () => {
    return (
        <div>
            <div style={{ marginLeft: buttonWidth, whiteSpace: 'nowrap' }}>
            <Tooltip placement="topLeft" title={text}>
                <Button style={{ marginLeft: 10 }}>TL</Button>
            </Tooltip>
            <Tooltip placement="top" title={text}>
                <Button style={{ marginLeft: 10 }}>Top</Button>
            </Tooltip>
            <Tooltip placement="topRight" title={text}>
                <Button style={{ marginLeft: 10 }}>TR</Button>
            </Tooltip>
            </div>
            <div style={{ width: buttonWidth, float: 'left' }}>
            <Tooltip placement="leftTop" title={text}>
                <Button style={{ marginTop: 10 }}>LT</Button>
            </Tooltip>
            <Tooltip placement="left" title={text}>
                <Button style={{ marginTop: 10 }}>Left</Button>
            </Tooltip>
            <Tooltip placement="leftBottom" title={text}>
                <Button style={{ marginTop: 10 }}>LB</Button>
            </Tooltip>
            </div>
            <div style={{ width: buttonWidth, marginLeft: buttonWidth * 4 + 24 }}>
            <Tooltip placement="rightTop" title={text}>
                <Button style={{ marginTop: 10 }}>RT</Button>
            </Tooltip>
            <Tooltip placement="right" title={text}>
                <Button style={{ marginTop: 10 }}>Right</Button>
            </Tooltip>
            <Tooltip placement="rightBottom" title={text}>
                <Button style={{ marginTop: 10 }}>RB</Button>
            </Tooltip>
            </div>
            <div style={{ marginLeft: buttonWidth, clear: 'both', whiteSpace: 'nowrap' }}>
            <Tooltip placement="bottomLeft" title={text}>
                <Button style={{ marginLeft: 10 }}>BL</Button>
            </Tooltip>
            <Tooltip placement="bottom" title={text}>
                <Button style={{ marginLeft: 10 }}>Bottom</Button>
            </Tooltip>
            <Tooltip placement="bottomRight" title={text}>
                <Button style={{ marginLeft: 10 }}>BR</Button>
            </Tooltip>
            </div>
        </div>
    )
}
```

## API

属性说明如下:

|属性                |说明	       |类型	  |默认属性
|-----               |------       |-----     |-----    
|arrowPointAtCenter  |箭头是否指向目标元素中心| `boolean`| `false`	
|autoAdjustOverflow  |气泡被遮挡时自动调整位置 | `boolean`|`true`
|defaultVisible      |默认是否显隐  | `boolean` | `false`
|color               |背景颜色  |`string` | -
|getPopupContainer   |浮层渲染父节点，默认渲染到 body 上| `function(triggerNode)` | `() => document.body`
|mouseEnterDelay     |鼠标移入后延时多少才显示 Tooltip，单位：秒| `number` | 0.1
|mouseLeaveDelay     |鼠标移出后延时多少才隐藏 Tooltip，单位：秒 | `number`| 0.1
|overlayClassName    |卡片类名 | `string`  | -
|overlayStyle        |卡片样式 | `object`  | -
|placement           |气泡框位置，可选 top left right bottom topLeft topRight bottomLeft bottomRight leftTop leftBottom rightTop rightBottom | `string` | `top`
|trigger | 触发行为，可选 `hover` \| `focus` \| `click` \| contextMenu，可使用数组设置多个触发行为| `string` \| `string[]` | `hover`
|visible | 	用于手动控制浮层显隐 | `boolean` | `false`
|onVisibleChange | 显示隐藏的回调| `(visible) => void`| -
|align | 该值将合并到 placement 的配置中，设置参考 rc-tooltip| `object` | -
|destroyTooltipOnHide | 关闭后是否销毁 Tooltip，当 keepParent 为 false 时销毁父容器 | `boolean` \| `{ keepParent?: boolean }` |`false`

> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts