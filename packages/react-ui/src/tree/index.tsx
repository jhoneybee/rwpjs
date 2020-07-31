import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Tree as AntTree, Dropdown, Menu } from 'antd'
// eslint-disable-next-line import/no-extraneous-dependencies
import RcTree from 'rc-tree';
import { EventDataNode, TreeProps, DataNode } from 'antd/lib/tree';
import { MenuItemProps } from 'antd/lib/menu/MenuItem';


interface TreeHandle {

    // 重新加载表格信息
    reload: () => Promise<void>,

    // 滚动到指定的位置
    scrollTo: (key: string) => void

    // 更新节点数据
    update: (callback: (dataNode: EventDataNode) => EventDataNode) => void

    // 删除指定的节点,callback返回为true则删除此节点
    del: (callback: (dataNode: EventDataNode) => boolean) => void

}

interface OverlayMenu extends Omit<MenuItemProps, 'children'> {
    title: string | ReactNode
}

interface Props extends Omit<TreeProps,
    'loadData' |
    'treeData' |
    'checkedKeys' |
    'checkStrictly' |
    'expandedKeys' |
    'loadedKeys' |
    'selectedKeys' |
    'onDragEnd' |
    'onDragEnter' |
    'onDragLeave' |
    'onDragOver' |
    'onDragStart' |
    'onDrop' |
    'onLoad' |
    'onRightClick' |
    'defaultCheckedKeys' |
    'defaultExpandAll' |
    'defaultExpandedKeys' |
    'defaultExpandParent' |
    'defaultSelectedKeys'
    > {
    // 装载数据的信息
    loadData: (treeNode: EventDataNode | null) => Promise<EventDataNode[]>;
    overlay?: (treeNode: DataNode) => OverlayMenu[]
    tree?: React.MutableRefObject<TreeHandle | null>
}

// 筛选树节点信息
const filterTree = (treeNodes: DataNode[], callback: (treeNode: DataNode) => boolean) => {
    treeNodes.some(ele => {
        const result = callback(ele)
        if (result) return true
        if (ele.children && ele.children.length > 0) {
            filterTree(ele.children, callback)
        }
        return false
    })
}


export const Tree = (props: Props) => {
    // 当前的树节点信息
    const [treeNodes, setTreeNodes] = useState<EventDataNode[]>([])
    // 装载的节点信息
    const [loadedKeys, setLoadedKeys] = useState<(string | number)[]>([])
    // 展开指定的节点
    const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>([])

    const treeRef = useRef<RcTree>(null)
    useEffect(() => {
        if (props.tree) {
            const { tree } = props
            tree.current = {
                reload: async () => {
                    setLoadedKeys([])
                    const tempTreeNode = await props.loadData(null)
                    setTreeNodes(tempTreeNode)
                },
                scrollTo: (key: string) => {
                    if (treeRef.current) {
                        treeRef.current.scrollTo({
                            key,
                        })
                    }
                },
                update: callback => {
                    filterTree(treeNodes, treeNode => {
                        callback(treeNode as EventDataNode);
                        return false
                    })
                    setTreeNodes([...treeNodes])
                },
                del: (callback: (dataNode: EventDataNode) => boolean) => {
                    const loopsDel = (loopNodes: EventDataNode[]): EventDataNode[] => {
                        const resultNodes: EventDataNode[] = []
                        loopNodes.forEach(ele => {
                            if (callback(ele)) return
                            if (ele.children && ele.children.length > 0) {
                                const children: EventDataNode[] = ele.children as EventDataNode[]
                                resultNodes.push({
                                    ...ele,
                                    children: loopsDel(children),
                                })
                            } else {
                                resultNodes.push(ele)
                            }
                        })
                        return resultNodes
                    }
                    const tempTreeNode = loopsDel(treeNodes)
                    setTreeNodes(tempTreeNode)
                },
            }
        }

        // 初始化加载数据
        (async () => {
            const tempTreeNode = await props.loadData(null)
            setTreeNodes(tempTreeNode.map(chil => {
                let menuItem: ReactNode[] = []
                if (props.overlay) {
                    menuItem = props.overlay(chil).map(menu => {
                        const { title, ...restProps } = menu
                        return <Menu.Item {...restProps} >{title}</Menu.Item>
                    })
                }
                return {
                    ...chil,
                    title: (
                        <Dropdown
                            overlay={<Menu>{menuItem}</Menu>}
                            trigger={['contextMenu']}
                        >
                            <span>{chil.title}</span>
                        </Dropdown>
                    ),
                }
            }))
        })()
    }, [])

    return (
        <AntTree
            ref={treeRef}
            loadData={async treeNode => {
                loadedKeys.push(treeNode.key)
                const children = await props.loadData(treeNode)
                filterTree(treeNodes, ele => {
                    if (ele.key === treeNode.key) {
                        let menuItem: ReactNode[] = []
                        if (props.overlay) {
                            menuItem = props.overlay(ele).map(menu => {
                                const { title, ...restProps } = menu
                                return <Menu.Item {...restProps} >{title}</Menu.Item>
                            })
                        }
                        // eslint-disable-next-line no-param-reassign
                        ele.children = children.map(chil => ({
                            ...chil,
                            title: (
                                <Dropdown
                                    overlay={<Menu>{menuItem}</Menu>}
                                    trigger={['contextMenu']}
                                >
                                    <span>{chil.title}</span>
                                </Dropdown>
                            ),

                        }))
                        return true
                    }
                    return false
                })
                setTreeNodes([...treeNodes])
                setLoadedKeys([...loadedKeys])
            }}
            expandedKeys={expandedKeys}
            loadedKeys={loadedKeys}
            treeData={treeNodes}
            height={props.height}
            autoExpandParent={props.autoExpandParent}
            blockNode={props.blockNode}
            checkable={props.checkable}
            disabled={props.disabled}
            draggable={props.draggable}
            filterTreeNode={props.filterTreeNode}
            multiple={props.multiple}
            selectable={props.selectable}
            showIcon={props.showIcon}
            switcherIcon={props.switcherIcon}
            showLine={props.showLine}
            onCheck={props.onCheck}
            onExpand={(keys, info) => {
                setExpandedKeys(keys)
                if (props.onExpand) {
                    props.onExpand(keys, info)
                }
            }}
            icon={props.icon}
        />
    )
}
