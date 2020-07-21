---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Typography 排版
---

# Typography 排版

文本的基本格式。

```tsx
/** 
 * title: 标题组件  
 * desc: 展示不同级别的标题。
 */

import React from 'react'
import { Typography } from '@rwp/react-ui'

const { Title } = Typography
export default () => {
    return (
        <>
            <Title>标题</Title>
            <Title level={2}>标题二</Title>
            <Title level={3}>标题三</Title>
            <Title level={4}>标题四</Title>
        </>
    )
}
```

```tsx
/** 
 * title: 文本与超链接组件  
 * desc: 内置不同样式的文本以及超链接组件。
 */

import React from 'react'
import { Typography, Space } from '@rwp/react-ui'

const { Text } = Typography
export default () => {
    return (
        <Space direction="vertical">
            <Text>文本</Text>
            <Text type="secondary">文本</Text>
            <Text type="warning">文本</Text>
            <Text type="danger">文本</Text>
            <Text disabled>文本</Text>
            <Text mark>文本</Text>
            <Text code>文本</Text>
            <Text keyboard>文本</Text>
            <Text underline>文本</Text>
            <Text delete>文本</Text>
            <Text strong>文本</Text>
            <Link href="https://github.com/jhoneybee" target="_blank">
                文本
            </Link>
        </Space>
    )
}
```

## API

时间轴。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
|code     |添加代码样式  |`boolean` | `false`
|copyable |是否可拷贝，为对象时可进行各种自定义|`boolean` \| `{ text: string, onCopy: function, icon: ReactNode, tooltips: [ReactNode, ReactNode] }` | `false`
|delete   |添加删除线样式 |`boolean` | `false`	
|disabled |禁用文本 |`boolean` | `false`
|editable |是否可编辑，为对象时可对编辑进行控制|`boolean` \| `{ editing: boolean, onStart: function, onChange: function(string) }`	| `false`
|ellipsis |设置自动溢出省略，需要设置元素宽度|`boolean` | `false`
|mark     |添加标记样式|`boolean` | `false`
|keyboard |添加键盘样式|`boolean` | `false`
|underline|添加下划线样式|`boolean` | `false`
|strong   |是否加粗|`boolean` | `false`
|type     |文本类型| `secondary` \| `warning` \| `danger`	|`false`

## Typography.Title

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
|code     |添加代码样式  |`boolean` | `false`
|copyable |是否可拷贝，为对象时可进行各种自定义|`boolean` \| `{ text: string, onCopy: function, icon: ReactNode, tooltips: [ReactNode, ReactNode] }`| `false`
|delete   |添加删除线样式| `boolean` | `false`
|disabled |禁用文本 | `boolean` | `false`
|editable |是否可编辑，为对象时可对编辑进行控制 | `boolean` \| `{ editing: boolean, onStart: function, onChange: function(string) }` | `false`
|ellipsis |自动溢出省略，为对象时可设置省略行数与是否可展开等|`boolean` \| `{ rows: number, expandable: boolean, onExpand: function(event), onEllipsis: function(ellipsis) }` | `false`
|level    |重要程度，相当于 `h1`,`h2`,`h3`,`h4`| `number: 1, 2, 3, 4` | `1`
|mark     |添加标记样式 |`boolean` | `false`
|underline|添加下划线样式|`boolean` | `false`
|onChange |当用户提交编辑内容时触发|`function(string)` | -
|type     |文本类型|`secondary` \| `warning` \| `danger`| -

## Typography.Paragraph

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
|code    |添加代码样式| `boolean` | `false`
|copyable|是否可拷贝，为对象时可进行各种自定义| `boolean` \| `{ text: string, onCopy: function, icon: ReactNode, tooltips: [ReactNode, ReactNode] }` | `false`
|delete  |添加删除线样式| `boolean` | `false`
|disabled|禁用文本| `boolean` | `false`
|editable|是否可编辑，为对象时可对编辑进行控制| `boolean` \| `{ editing: boolean, onStart: function, onChange: function(string) }`| `false`
|ellipsis|自动溢出省略，为对象时可设置省略行数、是否可展开、添加后缀等|`boolean` \| `{ rows: number, expandable: boolean, suffix: string, symbol: React.ReactNode, onExpand: function(event), onEllipsis: function(ellipsis) }`| `false`
|mark    |添加标记样式 | `boolean`| `false`
|underline|添加下划线样式| `boolean`| `false`
|onChange|当用户提交编辑内容时触发| `function(string)`| -
|strong|是否加粗 | `boolean` | `false`
|type|文本类型 | `secondary` \| `warning` \| `danger` | -