---
nav:
  title: 组件
  path: /components
group:
  path: /components/display
  title: 数据展现
title: Tree 树形控件
---

# Tree 树形控件

## 代码演示


```tsx
/**
 * title: 基础
 * desc: 简单的树结构, 可通过`tree.current.filter`来进行远程服务器数据筛选
 */

import React, { useRef, useState } from 'react'
import { Tree, Input, Menu } from '@rwp/react-ui'


let countReload = 0
export default () => {
    const rowKey = useRef<number>(0)
    const tree = useRef()
    const search = useRef<string>('')
    const [selectKeys, setSelectKeys] = useState<(number | string)[]>([])
    const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>([1])
    return (
        <>
            <Input.Search
                onSearch={(value) => {
                    search.current = value
                    rowKey.current = 0
                    tree.current.filter(() => {
                        return [{
                            title: `筛选 - 1 - ${countReload}`,
                            key:  1001,
                            children: []
                        },{
                            title: `筛选 - 2 - ${countReload}`,
                            key: 1002,
                            children: []
                        }]
                    })
                }}
            />
            <Tree
                height={250}
                loadData={(node) => {
                    return new Promise((re) => {
                        setTimeout(() => {
                            if(node === null){
                                re([{
                                    title: `标题 - 1 - ${countReload}`,
                                    key:  1,
                                },{
                                    title: `标题 - 2 - ${countReload}`,
                                    key: 2,
                                },{
                                    title: `标题 - 3 - ${countReload}`,
                                    key: 3,
                                },{
                                    title: `标题 - 4 - ${countReload}`,
                                    key: 4,
                                },{
                                    title: `标题 - 5 - ${countReload}`,
                                    key: 5,
                                },{
                                    title: `标题 - 6 - ${countReload}`,
                                    key: 6,
                                },{
                                    title: `标题 - 7 - ${countReload}`,
                                    key: 7,
                                },{
                                    title: `标题 - 8 - ${countReload}`,
                                    key: 8,
                                },{
                                    title: `标题 - 9 - ${countReload}`,
                                    key: 9,
                                },{
                                    title: `标题 - 10 - ${countReload}`,
                                    key: 910,
                                },{
                                    title: `标题 - 11 - ${countReload}`,
                                    key: 911,
                                },{
                                    title: `标题 - 12 - ${countReload}`,
                                    key: 912,
                                },{
                                    title: `标题 - 13 - ${countReload}`,
                                    key: 913,
                                },{
                                    title: `标题 - 14 - ${countReload}`,
                                    key: 914,
                                },{
                                    title: `标题 - 15 - ${countReload}`,
                                    key: 915,
                                }])
                                return; 
                            }
                            if(node.key === 1){
                                re([{
                                    title: `标题 - 11 - ${countReload}`,
                                    key:  11,
                                },{
                                    title: `标题 - 12 - ${countReload}`,
                                    key: 12,
                                },{
                                    title: `标题 - 13 - ${countReload}`,
                                    key: 13,
                                },{
                                    title: `标题 - 14 - ${countReload}`,
                                    key: 14,
                                }])
                                return;
                            }
                            if(node.key === 11 && countReload === 0){
                                re([{
                                    title: `标题 - 24 - ${countReload}`,
                                    key:  24,
                                    isLeaf: true,
                                },{
                                    title: `标题 - 23 - ${countReload}`,
                                    isLeaf: true,
                                    key: 23,
                                },{
                                    title: `标题 - 22 - ${countReload}`,
                                    isLeaf: true,
                                    key: 22,
                                },{
                                    title: `标题 - 21 - ${countReload}`,
                                    isLeaf: true,
                                    key: 21,
                                }])
                                return;
                            }
                            if(node.key  === 11){
                                re([{
                                    title: `标题 - 21 - ${countReload}`,
                                    isLeaf: true,
                                    key:  21,
                                },{
                                    title: `标题 - 22 - ${countReload}`,
                                    isLeaf: true,
                                    key: 22,
                                },{
                                    title: `标题 - 23 - ${countReload}`,
                                    isLeaf: true,
                                    key: 23,
                                },{
                                    title: `标题 - 24 - ${countReload}`,
                                    isLeaf: true,
                                    key: 24,
                                }])
                                return;
                            }
                            re([])
                        }, re.key === 1 ? 5000 : 1000 )
                    })
                    
                }}
                draggable
                checkable
                checkStrictly
                tree={tree}
                onDrop={(info) => {
                    return new Promise((re) => {
                        setTimeout(() => {
                            console.log(info.event.preventDefault)
                            re()
                        }, 1000)
                    })
                }}
                onSelect={(keys) => {
                    setSelectKeys(keys)
                }}
                onExpand={(keys) => {
                    setExpandedKeys(keys)
                }}
                expandedKeys={expandedKeys}
                selectedKeys={selectKeys}
                overlay={() => {
                    return (
                         <Menu>
                            <Menu.Item
                                key="1"
                                onClick={() => {
                                    const ele = tree.current.rightContext()
                                    tree.current.del((ele) => ele.key === treeNode.key)
                                }}
                            >
                                删除节点
                            </Menu.Item>
                            <Menu.Item
                                key="2"
                                onClick={() => {
                                    const treeNode = tree.current.rightContext()
                                    rowKey.current = 0
                                    countReload += 1
                                    tree.current.reload(treeNode)
                                }}
                            >
                                刷新节点
                            </Menu.Item>
                            <Menu.Item
                                key="3"
                                onClick={() => {
                                    const treeNode = tree.current.rightContext()
                                    tree.current.update(node => {
                                    if(treeNode.key === node.key){
                                        node.title = '这是更新后的标题'
                                    }
                                })
                                }}
                            >
                                更新节点
                            </Menu.Item>
                            <Menu.Item
                                key="4"
                                onClick={() => {
                                    const treeNode = tree.current.rightContext()
                                    setSelectKeys([treeNode.key])
                                }}
                            >
                                选中此节点
                            </Menu.Item>
                            <Menu.Item
                                key="5"
                                onClick={() => {
                                    const treeNode = tree.current.rightContext()
                                    setExpandedKeys(expandedKeys.concat(treeNode.key))
                                }}
                            >
                                展开此节点
                            </Menu.Item>
                            <Menu.Item
                                key="6"
                                onClick={(e) => {
                                    console.log(e.domEvent.preventDefault())
                                }}
                            >
                                测试
                            </Menu.Item>
                        </Menu>
                    )
                }}
            />
        </>
    )
}
```

## API

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|loadData   |装载数据的接口|`(treeNode: EventDataNode &#124; null) => Promise<EventDataNode[]>` | -
|style      |样式         |``
|tree       |当前tree | `React.MutableRefObject<TreeHandle &#124; null>` | -
|height|设置Tree的高度| `number`| -      
|checkStrictly| checkable 状态下节点选择完全受控（父子节点选中状态不再关联） | `boolean` | `false`
|expandedKeys| 展开的节点信息| `Key[]`| -
|selectedKeys| 选择的节点信息|  `Key[]`| - 
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
|onSelect| 点击树节点触发 | `function(selectedKeys, e:{selected: bool, selectedNodes, node, event})` |-
|icon|自定义树节点图标。 | `ReactNode` \| `(props) => ReactNode`
|onDragStart| 开始拖拽，可让对应的节点不可拖拽，通过`preventDefault`来取消默认行为 | `onDragStart?: (info: { event: React.MouseEvent; node: EventDataNode; }) => void;` | -
|onDragEnd | 用户完成拖动元素时发生 | `function({event, node})` | -
|onDragEnter | 当拖动的元素进入放置目标时发生 | `function({event, node, expandedKeys})`| -
|onDragLeave | 当拖动的元素离开放置目标时发生 | `function({event, node})`| -
|onDragOver  | 当拖动的元素超过放置目标时发生 | `function({event, node})`| -
|onDragStart | 当用户开始拖动元素时发生 | `function({event, node})` | -
|onDrop      | 在将拖动的元素放到放置目标上时发生 | `function({event, node, dragNode, dragNodesKeys})`| -

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

## TreeHandle

|方法                                    |说明	     
|-----                                  |------     
|`reload: () => Promise<void>`          | 重新加载表格信息
|`scrollTo: (key: string) => void`      | 滚动到指定的位置
|`update: (callback: (dataNode: EventDataNode) => void) => void` | 更新节点数据
|`del: (callback: (dataNode: EventDataNode) => boolean) => void` | 删除指定的节点,callback返回为true则删除此节点
|`filter: (callback: () => Promise<EventDataNode[]>) => void` | 筛选节点信息
