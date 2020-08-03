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
    update: (callback: (dataNode: EventDataNode) => void) => void

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
const findTreeNode = (treeNodes: DataNode[], callback: (treeNode: DataNode) => boolean) => {
    treeNodes.some(ele => {
        const result = callback(ele)
        if (result) return true
        if (ele.children && ele.children.length > 0) {
            findTreeNode(ele.children, callback)
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

    const reload = async () => {
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
    }

    const filter = (callback: (dataNode: EventDataNode) => boolean) => {
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
        return loopsDel(treeNodes)
    }

    if (props.tree) {
        const { tree } = props
        tree.current = {
            reload: async () => {
                setLoadedKeys([])
                reload()
            },
            scrollTo: (key: string) => {
                if (treeRef.current) {
                    treeRef.current.scrollTo({
                        key,
                    })
                }
            },
            update: callback => {
                findTreeNode(treeNodes, treeNode => {
                    let menuItem: ReactNode[] = []
                    if (props.overlay) {
                        menuItem = props.overlay(treeNode).map(menu => {
                            const { title, ...restProps } = menu
                            return <Menu.Item {...restProps} >{title}</Menu.Item>
                        })
                    }
                    callback(treeNode as EventDataNode);
                    // eslint-disable-next-line no-param-reassign
                    treeNode.title = (
                        <Dropdown
                            overlay={<Menu>{menuItem}</Menu>}
                            trigger={['contextMenu']}
                        >
                            <span>{treeNode.title}</span>
                        </Dropdown>
                    )
                    return false
                })
                setTreeNodes([...treeNodes])
            },
            del: (callback: (dataNode: EventDataNode) => boolean) => {
                setTreeNodes(filter(callback))
            },
        }
    }

    useEffect(() => {
        // 初始化加载数据
        reload()
    }, [])

    return (
        <AntTree
            ref={treeRef}
            loadData={async treeNode => {
                loadedKeys.push(treeNode.key)
                const children = await props.loadData(treeNode)
                findTreeNode(treeNodes, ele => {
                    if (ele.key === treeNode.key) {
                        // eslint-disable-next-line no-param-reassign
                        ele.children = children.map(chil => {
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
                        })
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

            // 开始拖拽的时候触发
            onDragStart={props.onDragStart}

            // 将元素拖到放置目标上时执行
            onDragOver={props.onDragOver}

            // 元素放入目标位置
            onDragEnter={props.onDragEnd}

            // 元素离开目标位置
            onDragLeave={props.onDragEnd}

            // 用户完成拖动元素时发生
            onDragEnd={props.onDragEnd}

            // 在将拖动的元素放到放置目标上时发生
            onDrop={info => {
                const {
                   // 目标节点
                   node,
                   // 拖拽节点
                   dragNode,

                   dropPosition,
                   dropToGap,
                } = info

                const filterTreeNodes = filter(ele => ele.key === dragNode.key)
                const loops = (loopsTreeNodes: DataNode[]): DataNode[] => {
                    const result: DataNode[] = []
                    loopsTreeNodes.forEach(ele => {
                        const treeNode = { ...ele }
                        if (ele.children) {
                            treeNode.children = loops(ele.children)
                        }
                        // eslint-disable-next-line no-empty
                        if (treeNode.key === node.key) {
                            if (dropToGap) {
                                const index = loopsTreeNodes.findIndex(
                                    element => element.key === node.key,
                                )
                                if (dropPosition < index) {
                                    result.push(dragNode)
                                    result.push(treeNode)
                                }
                                if (dropPosition > index) {
                                    result.push(treeNode)
                                    result.push(dragNode)
                                }
                            } else if (treeNode.children) {
                                treeNode.children.push(dragNode)
                                result.push(treeNode)
                            } else {
                                // eslint-disable-next-line no-param-reassign
                                treeNode.children = [dragNode]
                                result.push(treeNode)
                            }
                        } else {
                            result.push(treeNode)
                        }
                    })
                    return result
                }
                let preventDefault = false
                if (props.onDrop) {
                    // eslint-disable-next-line no-param-reassign
                    info.event.preventDefault = () => {
                        preventDefault = true
                    }
                }
                if (preventDefault) return

                setTreeNodes(loops(filterTreeNodes) as EventDataNode[])
            }}
            icon={props.icon}
        />
    )
}
