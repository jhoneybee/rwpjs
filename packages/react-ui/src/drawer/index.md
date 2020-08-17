---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Drawer 抽屉
---

# Drawer 抽屉

## 代码演示


```tsx
/**
 * title: 基础
 * desc: 基础的抽屉
 */

import React, { useState } from 'react'
import { Drawer, Button } from '@rwp/react-ui'

export default () => {
    const [visible, setVisible] = useState<boolean>(false)
    return (
        <>
        <Button
            type="primary"
            onClick={async () => {
                setVisible(true)
            }}
        >
            打开
        </Button>
        <Drawer
            title="基础的抽屉"
            placement="right"
            onClose={() => {
                setVisible(false)
            }}
            visible={visible}
        >
            <p>内容一</p>
            <p>内容二</p>
            <p>内容三</p>
        </Drawer>
        </>
    )
}
```

## API

按钮的属性说明如下：

|属性             |说明	       |类型	     |默认值
|-----           |------       |-----      |-------
|closable        |是否显示右上角的关闭按钮|`boolean`|`true`
|closeIcon       |自定义关闭图标|`ReactNode`|`<CloseOutlined />`
|destroyOnClose  |关闭时销毁 Drawer 里的子元素|`boolean`|`false`
|forceRender     |预渲染 Drawer 内元素|`boolean`|`false`
|getContainer    |指定 Drawer 挂载的 HTML 节点, false 为挂载在当前 dom|`HTMLElement` \| `() => HTMLElement` \| `Selectors` \| `false` | `body`
|maskClosable    |点击蒙层是否允许关闭|`boolean` |`true`
|mask            |是否展示遮罩|`boolean`|`true`
|maskStyle       |遮罩样式|`CSSProperties`|	`{}`
|style           |可用于设置 Drawer 最外层容器的样式，和 drawerStyle 的区别是作用节点包括 mask|`CSSProperties`|-
|drawerStyle     |用于设置 Drawer 弹出层的样式|`CSSProperties`|-
|headerStyle     |用于设置 Drawer 头部的样式|`CSSProperties`|-
|bodyStyle       |可用于设置 Drawer 内容部分的样式|`CSSProperties`|-
|title           |标题|`string` \| `ReactNode`|-
|visible         |Drawer 是否可见| `boolean`|-
|width           |宽度 | `string` \| `number` | `256`
|height          |高度, 在 placement 为 top 或 bottom 时使用|`string` \| `number` | `256`
|className       |对话框外层容器的类名| `string` | -
|zIndex          |设置 Drawer 的 z-index| `number`| `1000`
|placement       |抽屉的方向| `top` \| `right` \| `bottom` \| `left` | `right`
|onClose         |点击遮罩层或右上角叉或取消按钮的回调| `function(e)`| -
|afterVisibleChange| 切换抽屉时动画结束后的回调| `function(visible)`| -
|keyboard         |是否支持键盘 esc 关闭| `boolean` | `true`
|footer           |抽屉的页脚 | `ReactNode`| -
|footerStyle      |抽屉页脚部件的样式| `CSSProperties`| -
|push             |用于设置多层 Drawer 的推动行为| `boolean` | -