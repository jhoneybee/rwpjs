---
nav:
  title: 组件
  path: /components
group:
  path: /components/layout
  title: 布局组件
title: Grid 布局
---

# Grid 布局


## 代码演示

```tsx
/**
 * title: 基础
 * desc: 基本的Grid布局
 */

import React from 'react'
import { ProLayout, Col, Row , Divider } from '@rwp/react-ui'

const style = { background: '#0092ff', padding: '8px 0', textAlign: 'center' };

export default () => {
    return (
          <>
            <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
            Horizontal
            </Divider>
            <Row gutter={16}>
            <Col  span={6}>
                <div style={style}>col-6</div>
            </Col>
            <Col  span={6}>
                <div style={style}>col-6</div>
            </Col>
            <Col  span={6}>
                <div style={style}>col-6</div>
            </Col>
            <Col span={6}>
                <div style={style}>col-6</div>
            </Col>
            </Row>
            <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
            Responsive
            </Divider>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col  span={6}>
                <div style={style}>col-6</div>
            </Col>
            <Col  span={6}>
                <div style={style}>col-6</div>
            </Col>
            <Col  span={6}>
                <div style={style}>col-6</div>
            </Col>
            <Col  span={6}>
                <div style={style}>col-6</div>
            </Col>
            </Row>
            <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
            Vertical
            </Divider>
            <Row gutter={[16, 24]}>
            <Col  span={6}>
                <div style={style}>col-6</div>
            </Col>
            <Col  span={6}>
                <div style={style}>col-6</div>
            </Col>
            <Col  span={6}>
                <div style={style}>col-6</div>
            </Col>
            <Col  span={6}>
                <div style={style}>col-6</div>
            </Col>
            <Col  span={6}>
                <div style={style}>col-6</div>
            </Col>
            <Col  span={6}>
                <div style={style}>col-6</div>
            </Col>
            <Col  span={6}>
                <div style={style}>col-6</div>
            </Col>
            <Col  span={6}>
                <div style={style}>col-6</div>
            </Col>
            </Row>
        </>
    )
}

```

## API

### Row


|属性        |说明	       |类型	     |默认值
|-----      |------       |-----      |-------
|align      |垂直对齐方式  |`top` \| `middle` \| `bottom` | `top`
|gutter     |栅格间隔，可以写成像素值或支持响应式的对象写法来设置水平间隔 { xs: 8, sm: 16, md: 24}。或者使用数组形式同时设置 [水平间距, 垂直间距]。|`number` \| `object` \| `array` | `0`
|justify    |水平排列方式    | `start` \| `end` \| `center` \| `space-around` \| `space-between` | `start`

### Col

|属性        |说明	       |类型	     |默认值
|-----      |------       |-----      |-------
|flex       |flex 布局属性 | `string` \| `number`| `0`
|offset     |栅格左侧的间隔格数，间隔内不可以有栅格|`number`| `0`
|order      |栅格顺序 |`number`| `0`
|pull       |栅格向左移动格数|`number`| `0`
|push       |栅格向右移动格数|`number` | `0`
|span       |栅格占位格数，为 0 时相当于 `display: none`|`number`| -
|xs         |屏幕 < 576px 响应式栅格，可为栅格数或一个包含其他属性的对象| `number` \| `object`| -
|sm         |屏幕 ≥ 576px 响应式栅格，可为栅格数或一个包含其他属性的对象| `number` \| `object`| -
|md         |屏幕 ≥ 768px 响应式栅格，可为栅格数或一个包含其他属性的对象| `number` \| `object`| -
|lg         |屏幕 ≥ 992px 响应式栅格，可为栅格数或一个包含其他属性的对象| `number` \| `object`| -
|xl         |屏幕 ≥ 1200px 响应式栅格，可为栅格数或一个包含其他属性的对象| `number` \| `object`| -
|xxl       |屏幕 ≥ 1600px 响应式栅格，可为栅格数或一个包含其他属性的对象  | `number` \| `object` | -

