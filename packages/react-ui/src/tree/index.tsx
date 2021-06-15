import React, { useState, useEffect, useRef } from 'react';
import { Tree as AntTree, Dropdown } from 'antd'
import { uniqWith } from 'lodash'
// eslint-disable-next-line import/no-extraneous-dependencies
import RcTree from 'rc-tree';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Key } from 'rc-tree/lib/interface'
// eslint-disable-next-line import/no-extraneous-dependencies
import { NodeDragEventParams } from 'rc-tree/lib/contextTypes'
import { EventDataNode, TreeProps, DataNode } from 'antd/lib/tree';
import { OverlayFunc } from '../interface';
import { ConsoleSqlOutlined } from '@ant-design/icons';

const getPopupContainer = (container: HTMLElement) => {
    return container.parentNode?.parentNode?.parentNode?.parentNode?.parentElement!
}

export interface TreeHandle {

    // 重新加载表格信息
    reload: (treeNode?: EventDataNode) => Promise<void>,

    // 滚动到指定的位置
    scrollTo: (key: string) => void

    // 更新节点数据
    update: (callback: (dataNode: EventDataNode) => void) => void

    // 删除指定的节点,callback返回为true则删除此节点
    del: (callback: (dataNode: EventDataNode) => boolean) => void

    // 筛选节点,
    filter: (callback: () => Promise<EventDataNode[]>) => void

    /**
     * 获取当前右键的上下文
     */
    rightContext: () => EventDataNode | null
}

interface CustomEventDataNode extends EventDataNode{
    parent?: CustomEventDataNode
}


export interface Props extends Omit<TreeProps,
    'loadData' |
    'treeData' |
    'loadedKeys' |
    'defaultCheckedKeys' |
    'defaultExpandAll' |
    'defaultExpandedKeys' |
    'defaultExpandParent' |
    'defaultSelectedKeys' |
    'filterAntTreeNode'|
    'onDrop'
    > {
    // 装载数据的信息
    loadData: (treeNode: EventDataNode | null) => Promise<DataNode[]>;
    overlay?: React.ReactElement | OverlayFunc
    tree?: React.MutableRefObject<TreeHandle | null>
    // 采用文件目录的结构
    enableDirectoryTree?: boolean,
    // 全部展开节点
    expandAll?: boolean
    onDrop?: (info: NodeDragEventParams & {
        dragNode: EventDataNode;
        dragNodesKeys: Key[];
        dropPosition: number;
        dropToGap: boolean;
    }) => void | Promise<void>
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
    // 获取当前右键的节点
    const contextNode = useRef<EventDataNode | null>(null)
    // 设置选中的tree
    const [checkedKeys, setCheckedKeys] = useState<Key[] | {
        checked: Key[];
        halfChecked: Key[];
    }>([])

    const treeRef = useRef<RcTree>(null)

    const reload = async () => {
        const tempTreeNode = await props.loadData(null)
        if (props.expandAll) {
            setExpandedKeys(expandedKeys.concat(tempTreeNode.map(ele => ele.key)))
        }

        const joinExpandedKeys: Key[] = []
        tempTreeNode.forEach(ele => {
            if(props.expandedKeys?.includes(ele.key)){
                joinExpandedKeys.push(ele.key)
            }
        })
      

        setTreeNodes(tempTreeNode.map(ele => {
            const chil = ele as EventDataNode
            let { title } = chil
            if (props.overlay){
                title = (
                    <Dropdown
                        overlay={props.overlay}
                        trigger={['contextMenu']}
                        getPopupContainer={getPopupContainer}
                    >
                        <span>{chil.title}</span>
                    </Dropdown>
                )
            }
            return {
                ...chil,
                title,
            }
        }))
        setExpandedKeys(expandedKeys.concat(joinExpandedKeys))
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
            reload: async (treeNode?: CustomEventDataNode) => {
                let currentNode: CustomEventDataNode | undefined;
                const expandKey: (string | number)[] = []
                // 如果是最顶部的root节点
                if (treeNode === undefined || treeNodes.some(node => node.key === treeNode.key)) {
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
                                        let { title } = node
                                        if (props.overlay) {
                                            title = (
                                                <Dropdown
                                                    overlay={props.overlay}
                                                    getPopupContainer={getPopupContainer}
                                                    trigger={['contextMenu']}
                                                >
                                                    <span>{node.title}</span>
                                                </Dropdown>
                                            )
                                        }
                                        
                                        return {
                                            ...node,
                                            parent: ele,
                                            title,
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
                    callback(treeNode as EventDataNode);
                    let { title } = treeNode
                    if (props.overlay) {
                        title = (
                            <Dropdown
                                overlay={props.overlay}
                                trigger={['contextMenu']}
                                getPopupContainer={getPopupContainer}
                            >
                                <span>{treeNode.title}</span>
                            </Dropdown>
                        )
                    }
                    // eslint-disable-next-line no-param-reassign
                    treeNode.title = title
                    return false
                })
                setTreeNodes([...treeNodes])
            },
            del: (callback: (dataNode: EventDataNode) => boolean) => {
                setTreeNodes(filter(callback))
            },
            rightContext: () => contextNode.current,
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
        setSelectedKeys(props.selectedKeys || [])
    }, [props.selectedKeys])

    useEffect(() => {
        setCheckedKeys(props.checkedKeys || [])
    }, [props.checkedKeys])

    const TreeNode = props.enableDirectoryTree ? AntTree.DirectoryTree : AntTree
    return (
        <TreeNode
            ref={treeRef}
            style={props.style}
            loadData={async treeNode => {
                if (treeNode){
                    loadedKeys.push(treeNode.key)
                }
                const children = await props.loadData(treeNode)
                if (props.expandAll) {
                    setExpandedKeys(expandedKeys.concat(children.map(ele => ele.key)))
                }

                findTreeNode(treeNodes, ele => {
                    if (ele.key === treeNode.key) {
                        // eslint-disable-next-line no-param-reassign
                        ele.children = children.map(chil => {
                            let { title } = chil
                            if (props.overlay) {
                                title = (
                                    <Dropdown
                                        overlay={props.overlay}
                                        trigger={['contextMenu']}
                                        getPopupContainer={getPopupContainer}
                                    >
                                        <span>{chil.title}</span>
                                    </Dropdown>
                                )
                            }
                            return {
                                ...chil,
                                parent: ele,
                                title,
                            }
                        })
                    }
                    return false
                })
                setTreeNodes([...treeNodes])
                const joinExpandedKeys: Key[] = []
                children.forEach(ele => {
                    if(props.expandedKeys?.includes(ele.key)){
                        joinExpandedKeys.push(ele.key)
                    }
                })
                if(treeNode){
                    setExpandedKeys(uniqWith(expandedKeys.concat(joinExpandedKeys).concat(treeNode.key)))
                }else{
                    setExpandedKeys(expandedKeys.concat(joinExpandedKeys))
                }
      

            }}
            checkedKeys={checkedKeys}
            expandedKeys={expandedKeys}
            selectedKeys={selectedKeys}
            loadedKeys={loadedKeys}
            treeData={treeNodes}
            checkStrictly={props.checkStrictly}
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
            onCheck={(checked, info)=> {
                setCheckedKeys(checked)
                props.onCheck?.(checked,info)
            }}
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
            onRightClick={info => {
                contextNode.current = info.node
                if (props.onRightClick) {
                    props.onRightClick(info)
                }
            }}
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
                
                console.log('dropPosition', dropPosition)
                const loops = (loopsTreeNodes: DataNode[]): DataNode[] => {
                    const result: DataNode[] = []
                    loopsTreeNodes.forEach((ele, index) => {
                        const treeNode = { ...ele }
                        if (ele.children) {
                            treeNode.children = loops(ele.children)
                        }
                        if (treeNode.key === node.key) {
                            if (dropToGap) {
                                result.push(treeNode)
                                result.push(dragNode)
                            } else if (!dropToGap && dropPosition === 0) {
                                treeNode.children?.splice(0, 0, dragNode)
                                result.push(treeNode)
                            }else if (treeNode.children) {
                                treeNode.children.push(dragNode)
                                result.push(treeNode)
                            } else {
                                // eslint-disable-next-line no-param-reassign
                                treeNode.children = [dragNode]
                                result.push(treeNode)
                            }
                        } else if(treeNode.key !== dragNode.key){
                            result.push(treeNode)
                        }
                    })
                    return result
                }

                let preventDefault = false

                const commit = () => {
                    if (preventDefault) return
                    console.log('start:', new Date().getTime())
                    const data = loops(treeNodes)
                    setTreeNodes(data as EventDataNode[])
                    console.log('end:', new Date().getTime())
                }
                if (props.onDrop) {
                    const onDropResult = props.onDrop({
                        ...info,
                        event: {
                            ...info.event,
                            preventDefault: () => {
                                preventDefault = true
                            }
                        }
                    })
                    if (onDropResult && onDropResult.then) {
                        onDropResult.then(() => {
                            commit()
                        })
                    }
                } else {
                    commit()
                }
            }}
            icon={props.icon}
        />
    )
}
