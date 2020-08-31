---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Carousel 轮播
---

# Carousel 轮播


## 代码演示


```tsx
/**
 * title: 轮播
 * desc: 一个简单的轮播
 */

import React from 'react'
import { Carousel } from '@rwp/react-ui'

export default () => {
    const contentStyle = {
        height: '160px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
    };
    return (
        <>
          <Carousel
            arrows={true}
          >
            <div>
                <h3 style={contentStyle}>1</h3>
            </div>
            <div>
                <h3 style={contentStyle}>2</h3>
            </div>
            <div>
                <h3 style={contentStyle}>3</h3>
            </div>
            <div>
                <h3 style={contentStyle}>4</h3>
            </div>
          </Carousel>
        </>
    )
}
```


## API


|属性        |说明	       |类型	   |默认值
|-----      |------       |-----   |-------
|afterChange | 切换面板的回调| `function(current)`| -
|autoplay    | 是否自动切换  | `boolean` | `false`
|beforeChange| 切换面板的回调| `function(from, to)`| -
|dotPosition | 面板指示点位置，可选 `top` `bottom` `left` `right`| `string`| `bottom`
|dots        | 是否显示面板指示点，如果为 object 则同时可以指定 dotsClass 或者| `boolean` \| `{ className?: string }` | `true`
|easing      | 动画效果   | `string`| `linear`
|effect      | 动画效果函数| `scrollx` \| `fade` | `scrollx`


> 更多 API 可参考：https://react-slick.neostack.com/docs/api