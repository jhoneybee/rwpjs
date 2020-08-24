---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Skeleton 骨架屏
---

# Skeleton 骨架屏

在需要等待加载内容的位置提供一个占位图形组合。

## 代码演示

```tsx
/** 
 * title: 动画效果  
 * desc: 显示动画效果
 */

import React from 'react'
import { Skeleton } from '@rwp/react-ui'

export default () => {
    return (
        <Skeleton active />
    )
}
```
  

## API

### Skeleton

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
|active|是否展示动画效果|`boolean` | `false`
|avatar|是否显示头像占位图|`boolean` \| `SkeletonAvatarProps`|`false`
|loading|为 true 时，显示占位图。反之则直接展示子组件|`boolean`| -
|paragraph|是否显示段落占位图|`boolean` \| `SkeletonParagraphProps`| `true`
|title|是否显示标题占位图| `boolean` \| `SkeletonTitleProps`| `true`
|round|为 true 时，段落和标题显示圆角| `boolean` | `false`

### SkeletonAvatarProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
|active|是否展示动画效果，仅在单独使用头像骨架时生效|`boolean`| `false`
|size|设置头像占位图的大小|`number` \| `large` \| `small` \| `default`| -
|shape|	指定头像的形状 | `circle` \| `square` | -

### SkeletonTitleProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
|width | 设置标题占位图的宽度| `number` \| `string`| - 

### SkeletonParagraphProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
|rows|设置段落占位图的行数 |number | -
|width|设置段落占位图的宽度，若为数组时则为对应的每行宽度，反之则是最后一行的宽度|`number` \| `string` \| `Array`|-

### SkeletonButtonProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
|active|是否展示动画效果|`boolean`|`false`
|size |设置按钮的大小 |`large` \| `small` \| `default` | -
|shape |指定按钮的形状 | 	`circle` \| `round` \| `default`| -

### SkeletonInputProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
|active | 是否展示动画效果 |`boolean`|`false`
|size |设置输入框的大小 | `large` \| `small` \| `default`| -
