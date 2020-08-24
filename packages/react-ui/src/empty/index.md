---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Empty 空状态
---

# Empty 空状态

空状态时的展示占位图

## 代码演示

```tsx
/** 
 * title: 无描述  
 * desc: 无描述展示。
 */

import React from 'react'
import { Empty } from '@rwp/react-ui'

export default () => {
    return (
        <Empty description={false} />
    )
}
```
  

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
|description| 自定义描述内容 | `string` \| `ReactNode`| 	-
|imageStyle | 图片样式 | `CSSProperties`| -
|image | 设置显示图片，为 string 时表示自定义图片地址。 |`string` \| `ReactNode` | `Empty.PRESENTED_IMAGE_DEFAULT`

## 内置图片

##### Empty.PRESENTED_IMAGE_SIMPLE

![img](https://user-images.githubusercontent.com/507615/54591679-b0ceb580-4a65-11e9-925c-ad15b4eae93d.png)

##### Empty.PRESENTED_IMAGE_DEFAULT

![img](https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png)