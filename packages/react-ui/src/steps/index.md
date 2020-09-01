---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Steps 步骤条
---

# Steps 步骤条

引导用户按照流程完成任务的导航条。

## 代码演示


```tsx
/**
 * title: 基础
 * desc: 基本的对话框
 */

import React, { useRef } from 'react'
import { Steps } from '@rwp/react-ui'

export default () => {
    return (
        <Steps current={1}>
            <Steps.Step title="完成" description="完成描述" />
            <Steps.Step title="进行中" subTitle="00:00:08" description="进行中描述" />
            <Steps.Step title="等待" description="等待描述" />
        </Steps>
    )
}
```


## API

Steps 整体步骤条。

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|className  |步骤条类名    |`string` | -
|type       |步骤条类型，有 `default` 和 `navigation` 两种|`string`|`default`
|current    |指定当前步骤，从 0 开始记数。在子 Step 元素中，可以通过 status 属性覆盖状态|`number`|`0`
|direction  |指定步骤条方向。目前支持水平（horizontal）和竖直（vertical）两种方向|`string`| `horizontal`
|labelPlacement|指定标签放置位置，默认水平放图标右侧，可选 vertical 放图标下方|`string` | `horizontal`
|progressDot |点状步骤条，可以设置为一个 function，labelPlacement 将强制为 vertical|`boolean` \| `(iconDot, {index, status, title, description}) => ReactNode` | `false`
|size |指定大小，目前支持普通（default）和迷你（small）|`string` | `default`
|status | 指定当前步骤的状态，可选 wait process finish error|`string`| `process`
|initial |起始序号，从 0 开始记数 |`number` | `0`
|onChange| 点击切换步骤时触发| `(current) => void` |-
|percent | 当前 process 步骤显示的进度条进度（只对基本类型的 Steps 生效） |`number`| -


Steps.Step 步骤条内的每一个步骤。

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----   
|description |步骤的详情描述，可选|`string` \| `ReactNode` |-
|icon        |步骤图标的类型，可选|`ReactNode`| -
|status      |指定状态。当不配置该属性时，会使用 Steps 的 current 来自动指定状态。可选：wait process finish error|`string`|`wait`
|title       |标题  | `string` \| `ReactNode`| -
|subTitle    |子标题 | `string` \| `ReactNode`|-
|disabled    |禁用点击| `boolean` | `false`
