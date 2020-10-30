import React, { useRef, useEffect, ReactNode } from 'react'
import { MenuOutlined } from '@ant-design/icons'
import { useLocalStore, useObserver } from 'mobx-react-lite'
import { EventDataNode } from 'antd/lib/tree'
import { autorun, toJS } from 'mobx'
import { Tree } from '../../index'
import { classPrefix } from '../../utils'
import { useStore } from '../store'
import { TreeHandle } from '../../tree'

import './style/tools.less'

const tableClassPrefix = `${classPrefix}-table`

export const Tools = () => {
    const store = useLocalStore(() => ({
        visible: false,
        activeKey: '',
        treeHeight: 0,
        isFocus: false
    }))
    const tree = useRef<TreeHandle | null>(null)
    const divRef = useRef<HTMLDivElement | null>(null)
    const globalStore = useStore()
    const contentRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        tree.current?.reload()
    })

    useEffect(() => {
        autorun(() => {
            store.treeHeight = divRef.current!.clientHeight - 30
        })
    }, [store.visible])
    
    return useObserver(() => {
        const switchContent = () => {
            if (store.activeKey === 'column'){
                const loadData = async (node: EventDataNode | null) => {
                    if(node === null){
                        return (toJS(globalStore.columns) as any[]).map(column => ({
                            title: column.title,
                            key: column.name,
                            isLeaf: true,
                        }))
                    }
                    return []
                }

                return (
                    <>
                        <div
                            className={`${tableClassPrefix}-right-column`}
                        >
                            <h4>
                                列信息
                            </h4>
                            <Tree
                                tree={tree}
                                checkedKeys={globalStore.visibleColumns || []}
                                loadData={loadData}
                                onCheck={checked => {
                                    globalStore.visibleColumns = checked as string[]
                                }}
                                height={store.treeHeight}
                                draggable
                                onDrop={info => {
                                    // 如果是插入节点，则取消不进行任何操作
                                    if (!info.dropToGap) {
                                        info.event.preventDefault()
                                        return;
                                    }
                                    globalStore.switchColumns(info.node.key, info.dragNode.key)
                                }}
                                checkable
                            />
                        </div>
                    </>
                )
            }

            return undefined
        }

        let content: ReactNode

        if (store.visible) {
            content = (
                <div
                    className={`${tableClassPrefix}-right-content`}
                    tabIndex={-1}
                    ref={contentRef}
                    onBlur={() => {
                        store.visible = false
                        store.isFocus = false
                    }}
                    onFocus={() => {
                        store.isFocus = true
                    }}
                >
                    {switchContent()}
                </div>
            )
        }

        return (
            <>
                {content}
                <div
                    className={`${tableClassPrefix}-right`}
                    ref={divRef}
                    style={{
                        width: 20,
                        overflow: 'visible'
                    }}
                >
                    <div
                        className={`${tableClassPrefix}-right-button`}
                    >
                        <span
                            style={{
                                pointerEvents: store.isFocus ? 'none' : undefined
                            }}
                            onClick={() => {
                                store.activeKey = 'column'
                                store.visible = !store.visible
                            }}
                        >
                            <MenuOutlined style={{ paddingRight: 3}} />
                        </span>
                    </div>
                </div>
            </>
        )
    }) 
}