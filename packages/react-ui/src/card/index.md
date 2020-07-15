---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Card 卡片
---

# Card 卡片

## 代码演示


```tsx
/**
 * title: 主要的卡片
 * desc: 一个主要颜色的卡片
 */

import React from 'react'
import { Card } from '@rwp/react-ui'

export default () => {
    return (
        <Card
            title="主要的卡片"
            type="primary"
        >
            <p>内容一</p>
            <p>内容二</p> 
            <p>内容三</p>
        </Card>
    )
}
```

```tsx
/**
 * title: 危险的卡片
 * desc: 危险信息的展现
 */

import React from 'react'
import { Card } from '@rwp/react-ui'

export default () => {
    return (
        <Card
            title="危险的卡片"
            type="danger"
        >
            <p>内容一</p>
            <p>内容二</p>
            <p>内容三</p>
        </Card>
    )
}
```

```tsx
/**
 * title: 经典的卡片
 * desc: 一个经典的卡片显示方式
 */

import React from 'react'
import { Card } from '@rwp/react-ui'

export default () => {
    return (
        <Card
            title="一个普通的Card"
        >
            <p>内容一</p>
            <p>内容二</p>
            <p>内容三</p>
        </Card>
    )
}
```

## API

属性说明如下：

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|actions |卡片操作组，位置在卡片底部| 	`Array<ReactNode>` | -
|activeTabKey|当前激活页签的 key | `string`| -
|headStyle|自定义标题区域样式| `CSSProperties`| -
|bodyStyle|内容区域自定义样式| `CSSProperties`| -
|bordered|是否有边框 | `boolean` |`true`
|cover|	卡片封面 | `ReactNode` | -
|defaultActiveTabKey|初始化选中页签的 key，如果没有设置 activeTabKey| `string` |`第一个页签`
|extra| 卡片右上角的操作区域| 	`string` \| `ReactNode` |	-
|hoverable| 鼠标移过时可浮起| `boolean` | `false`
|loading| 当卡片内容还在加载中时，可以用 loading 展示一个占位| `boolean`| `false`
|tabList| 	页签标题列表 | `Array<{key: string, tab: ReactNode}>` |	-
|tabBarExtraContent| tab bar 上额外的元素 | `ReactNode` |	-
|size | card 的尺寸 | `default` \| `small` | `default`
|title| 卡片标题 | `string` \| `ReactNode`|	-
|type| 卡片的类型 | `string`|	-
|onTabChange| 页签切换的回调| `(key) => void`|	-
|tabProps | Tabs |-|	-

## Card.Grid

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|className |网格容器类名   |`string`  |-
|hoverable |鼠标移过时可浮起|`boolean` | `true`
|style     |定义网格容器类名的样式|`CSSProperties`|-

## Card.Meta

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----   
|avatar     |头像/图标     |`ReactNode`|-
|className  |容器类名      |`string`|-
|description|描述内容      |`ReactNode`|-
|style      |定义容器类名的样式|`CSSProperties`|-
|title      |标题内容         |`ReactNode`|-

> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts