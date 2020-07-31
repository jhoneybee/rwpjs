---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Tree 树形控件
---

# Tree 树形控件

## 代码演示


```tsx
/**
 * title: 基础
 * desc: 简单的树结构
 */

import React, { useRef } from 'react'
import { Tree } from '@rwp/react-ui'

export default () => {
    const rowKey = useRef<number>(0)
    return (
        <Tree
            loadData={(node) => {
                rowKey.current += 1
                return [{
                    title: `标题 - ${rowKey.current += 1}`,
                    key: rowKey.current += 1,
                    children: []
                },{
                    title: `标题 - ${rowKey.current += 1}`,
                    key: rowKey.current += 1,
                    children: []
                },{
                    title: `标题 - ${rowKey.current += 1}`,
                    key: rowKey.current += 1,
                    children: []
                },{
                    title: `标题 - ${rowKey.current += 1}`,
                    key: rowKey.current += 1,
                    children: []
                }]
            }}
            overlay={() => ([{
                title: '修改节点',
                key: '1'
            }])}
        />
    )
}
```


## API


|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|loadData   |装载数据的接口|`(treeNode: EventDataNode &#124; null) => Promise<EventDataNode[]>` | -
|tree       |当前tree | `React.MutableRefObject<TreeHandle | null>` | -
|height|设置Tree的高度| `number`| -         
|autoExpandParent|是否自动展开父节点| `boolean` | `true`
|blockNode|是否节点占据一行 | `boolean` | `false`
|checkable|节点前添加 Checkbox 复选框  | `boolean` | `false`
|disabled|将树禁用  | `boolean` | `false`
|draggable|设置节点可拖拽（IE>8） | `boolean` | `false`
|filterTreeNode|按需筛选树节点（高亮），返回 true| `function(node)` | -
|multiple|支持点选多个节点（节点本身）| `boolean` | `false`
|selectable|是否可选中 | `boolean` | `true`
|showIcon|是否展示 TreeNode title 前的图标，没有默认样式，如设置为 true，需要自行定义图标相关样式 | `boolean` | `false`
|switcherIcon|自定义树节点的展开/折叠图标| `ReactNode`
|showLine|是否展示连接线 | `boolean` \| `{showLeafIcon: boolean}` | `false`
|onCheck|点击复选框触发 | `function(checkedKeys, e:{checked: bool, checkedNodes, node, event, halfCheckedKeys})` |-
|onExpand|展开/收起节点时触发 | `function(expandedKeys, {expanded: bool, node})` | -
|icon|自定义树节点图标。 | `ReactNode` \| `(props) => ReactNode`

## TreeNode 

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|checkable|当树为 checkable 时，设置独立节点是否展示 Checkbox|`boolean`| -
|disableCheckbox|禁掉 checkbox|`boolean`|`false`
|disabled|禁掉响应|`boolean`|`false`
|icon|自定义图标。可接收组件，props 为当前节点 props|`ReactNode` \| `(props) => ReactNode`| -
|isLeaf| 设置为叶子节点(设置了loadData时有效)| `boolean` |`false`
|key| 被树的 (default)ExpandedKeys / (default)CheckedKeys /(default)SelectedKeys 属性所用。注意：整个树范围内的所有节点的 key 值不能重复！| `string` | (内部计算出的节点位置)
|selectable| 设置节点是否可被选中 | `boolean` | `true`
|title|标题 | `string` \| `ReactNode` | `---`

> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts