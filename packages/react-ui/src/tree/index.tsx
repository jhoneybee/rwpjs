import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Tree as AntTree, Dropdown, Menu } from 'antd'
// eslint-disable-next-line import/no-extraneous-dependencies
import RcTree from 'rc-tree';
import { EventDataNode, TreeProps, DataNode } from 'antd/lib/tree';
import { MenuItemProps } from 'antd/lib/menu/MenuItem';


interface TreeHandle {

    // 重新加载表格信息
    reload: (treeNode: EventDataNode) => Promise<void>,

    // 滚动到指定的位置
    scrollTo: (key: string) => void

    // 更新节点数据
    update: (callback: (dataNode: EventDataNode) => void) => void

    // 删除指定的节点,callback返回为true则删除此节点
    del: (callback: (dataNode: EventDataNode) => boolean) => void

    // 筛选节点,
    filter: (callback: () => Promise<EventDataNode[]>) => void
}

interface CustomEventDataNode extends EventDataNode{
    parent?: CustomEventDataNode
}

interface OverlayMenu extends Omit<MenuItemProps, 'children'> {
    title: string | ReactNode
}

interface Props extends Omit<TreeProps,
    'loadData' |
    'treeData' |
    'checkedKeys' |
    'checkStrictly' |
    'loadedKeys' |
    'onRightClick' |
    'defaultCheckedKeys' |
    'defaultExpandAll' |
    'defaultExpandedKeys' |
    'defaultExpandParent' |
    'defaultSelectedKeys' |
    'filterAntTreeNode'
    > {
    // 装载数据的信息
    loadData: (treeNode: EventDataNode | null) => Promise<EventDataNode[]>;
    overlay?: (treeNode: DataNode) => OverlayMenu[]
    tree?: React.MutableRefObject<TreeHandle | null>
    // 全部展开节点
    expandAll?: boolean
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
    const [treeNodes, setTreeNodes] = useState<CustomEventDataNode[]>([])
    // 装载的节点信息
    const [loadedKeys, setLoadedKeys] = useState<(string | number)[]>([])
    // 展开指定的节点
    const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>(props.expandedKeys || [])
    // 设置选中的节点
    const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>(props.selectedKeys || [])
    const treeRef = useRef<RcTree>(null)

    const reload = async () => {
        const tempTreeNode = await props.loadData(null)
        if (props.expandAll) {
            setExpandedKeys(expandedKeys.concat(tempTreeNode.map(ele => ele.key)))
        }
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
            reload: async (treeNode: CustomEventDataNode) => {
                let currentNode: CustomEventDataNode | undefined;
                const expandKey: (string | number)[] = []
                // 如果是最顶部的root节点
                if (treeNodes.some(node => node.key === treeNode.key)) {
                    reload()
                    setLoadedKeys([])
                    setExpandedKeys([])
                    return
                }
                await new Promise<void>(resolve => {
                    const findTreeNodeFun = (ele: DataNode) => {
                        const { children = [] } = ele
                        const some = (chil: DataNode) => {
                            if (chil.key === treeNode.key) {
                                currentNode = ele as CustomEventDataNode
                                props.loadData(ele as EventDataNode).then(nodeData => {
                                    // eslint-disable-next-line no-param-reassign
                                    ele.children = nodeData.map(node => {
                                        let menuItem: ReactNode[] = []
                                        if (props.overlay) {
                                            menuItem = props.overlay(node).map(menu => {
                                                const { title, ...restProps } = menu
                                                return (
                                                    <Menu.Item
                                                        {...restProps}
                                                    >
                                                        {title}
                                                    </Menu.Item>
                                                )
                                            })
                                        }
                                        return {
                                            ...node,
                                            parent: ele,
                                            title: (
                                                <Dropdown
                                                    overlay={<Menu>{menuItem}</Menu>}
                                                    trigger={['contextMenu']}
                                                >
                                                    <span>{node.title}</span>
                                                </Dropdown>
                                            ),
                                        }
                                    })
                                    resolve()
                                })
                                return true
                            }
                            return false
                        }
                        return children.some(some)
                    }
                    findTreeNode(treeNodes, findTreeNodeFun)
                })
                if (currentNode) {
                    const loops = (node: CustomEventDataNode) => {
                        if (node.parent) {
                            loops(node.parent)
                        }
                        expandKey.push(node.key)
                    }
                    loops(currentNode)
                }

                setExpandedKeys(expandKey)
                setLoadedKeys([])
                setTreeNodes([...treeNodes])
            },
            scrollTo: (key: string) => {
                if (treeRef.current) {
                    treeRef.current.scrollTo({
                        key,
                    })
                }
            },
            filter: async callback => {
                const nodes = await callback()
                const loadKeys: (string | number)[] = []
                findTreeNode(nodes, ele => {
                    loadKeys.push(ele.key)
                    return false;
                })
                setTreeNodes(nodes)
                setLoadedKeys(loadKeys)
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

    useEffect(() => {
        setExpandedKeys(props.expandedKeys as (string | number)[])
    }, [props.expandedKeys])

    useEffect(() => {
        setSelectedKeys(props.selectedKeys as (string | number)[])
    }, [props.selectedKeys])
    return (
        <AntTree
            ref={treeRef}
            loadData={async treeNode => {
                loadedKeys.push(treeNode.key)
                const children = await props.loadData(treeNode)
                if (props.expandAll) {
                    setExpandedKeys(expandedKeys.concat(children.map(ele => ele.key)))
                }
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
                                parent: ele,
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
            }}
            expandedKeys={expandedKeys}
            selectedKeys={selectedKeys}
            loadedKeys={loadedKeys}
            treeData={treeNodes}
            height={props.height}
            autoExpandParent={props.autoExpandParent}
            blockNode={props.blockNode}
            checkable={props.checkable}
            disabled={props.disabled}
            draggable={props.draggable}
            multiple={props.multiple}
            selectable={props.selectable}
            showIcon={props.showIcon}
            switcherIcon={props.switcherIcon}
            showLine={props.showLine}
            onSelect={(keys, info) => {
                setSelectedKeys(keys)
                if (props.onSelect) {
                    props.onSelect(keys, info)
                }
            }}
            onCheck={props.onCheck}
            onExpand={(keys, info) => {
                setExpandedKeys(keys)
                if (props.onExpand) {
                    props.onExpand(keys, info)
                }
            }}
            onActiveChange = {props.onActiveChange}
            onBlur = {props.onBlur}
            onLoad={props.onLoad}
            onClick={props.onClick}
            onDoubleClick={props.onDoubleClick}
            onFocus={props.onFocus}
            onKeyDown={props.onKeyDown}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
            // 开始拖拽的时候触发
            onDragStart={props.onDragStart}
            // 将元素拖到放置目标上时执行
            onDragOver={props.onDragOver}
            // 元素放入目标位置
            onDragEnter={props.onDragEnter}
            // 元素离开目标位置
            onDragLeave={props.onDragLeave}
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
