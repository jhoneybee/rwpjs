---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Badge 徽标数
---

# Badge 徽标数

图标右上角的圆形徽标数字。

## 代码演示

```tsx
/** 
 * title: 基本
 * desc: 简单的徽章展示，当 count 为 0 时，默认不显示，但是可以使用 showZero 修改为显示。
 */

import React from 'react'
import { Badge, Space } from '@rwp/react-ui'
import { ClockCircleOutlined } from '@ant-design/icons';

export default () => {
    const style = {
        width: 42,
        height: 42,
        borderRadius: 2,
        background: '#eee',
        display: 'inline-block',
        verticalAlign: 'middle',
    }
    return (
        <Space size={30}>
            <Badge count={5}>
            <a href="#" style={style} />
            </Badge>
            <Badge count={0} showZero>
            <a href="#" style={style} />
            </Badge>
            <Badge count={<ClockCircleOutlined style={{ color: '#f5222d' }} />}>
            <a href="#" style={style}  />
            </Badge>
        </Space>
    )
}
```
  

## API


| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
|color |自定义小圆点的颜色 | `string` | -
|count |展示的数字，大于 overflowCount 时显示为 `${overflowCount}+`，为 0 时隐藏| `ReactNode` | -
|dot   | 不展示数字，只有一个小红点| `boolean`	 | `false`
|offset | 设置状态点的位置偏移 | `[number, number]`| `-`
|overflowCount| 展示封顶的数字值| `number` | `99`
|showZero | 当数值为 0 时，是否展示 Badge| `boolean`| `false`
|status  | 设置 Badge 为状态点 | `success` \| `processing` \| `default` \| `error` \| `warning`| -
|text    | 在设置了 status 的前提下有效，设置状态点的文本| `string`| -
|title   | 设置鼠标放在状态点上时显示的文字 | `string`| -
