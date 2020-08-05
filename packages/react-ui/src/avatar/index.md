---
nav:
  title: 组件
  path: /components
group:
  path: /components/display
  title: 数据展现
title: Avatar 头像
---

# Avatar 头像

用来代表用户或事物，支持图片、图标或字符展示。

```tsx
/** 
 * title: 基本  
 * desc: 简单的头像展示
 */

import React from 'react'
import { Avatar, Space } from '@rwp/react-ui'
import { UserOutlined } from '@ant-design/icons';

export default () => {

    return (
        <Avatar size="small" icon={<UserOutlined />} />
    )
}
```

## API


| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
|icon  |设置头像的自定义图标|`ReactNode` |-
|shape |指定头像的形状|`circle` \| `square`| `circle`
|size  |设置头像的大小|`number` \| `large` \| `small` \| `default` | `default`
|src   |图片类头像的资源地址| `string` | 	-
|srcSet|设置图片类头像响应式资源地址| `string` | 	-
|alt   |图像无法显示时的替代文本| `string` | 	-
|onError|图片加载失败的事件，返回 false 会关闭组件默认的 fallback 行为|` () => boolean` | 	-
|gap|	字符类型距离左右两侧边界单位像素 | `number`	| 4