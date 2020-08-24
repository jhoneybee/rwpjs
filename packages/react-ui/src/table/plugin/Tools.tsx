import React, { useRef } from 'react'
import { MenuOutlined } from '@ant-design/icons'
import { useLocalStore, useObserver } from 'mobx-react-lite'
import { EventDataNode } from 'antd/lib/tree'
import { Tree } from '../../index'
import { classPrefix } from '../../utils'
import { useStore } from '../store'
import { TreeHandle } from '../../tree'

import './style/tools.less'

const tableClassPrefix = `${classPrefix}-table`

interface ToolsProps {
    height: number,
}

export const Tools = ({
    height,
}: ToolsProps) => {
    const store = useLocalStore(() => ({
        visible: false,
        activeKey: ''
    }))
    const tree = useRef<TreeHandle | null>(null)
    const globalStore = useStore()
    return useObserver(() => {
        const switchContent = () => {
            if (store.activeKey === 'column'){
                const loadData = async (node: EventDataNode | null) => {
                    if(node === null){
                        return globalStore.columns.map(column => ({
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
                            {/* <Input.Group>
                                <Select
                                    size="small"
                                    style={{
                                        width: '75%'
                                    }}
                                    defaultValue="default"
                                >
                                    <Select.Option value='default'>默认方案</Select.Option>
                                </Select>
                                <Button
                                    type="link"
                                    size="small"
                                >
                                    保存
                                </Button>
                            </Input.Group> */}
                            <Tree
                                tree={tree}
                                checkedKeys={globalStore.visibleColumns || []}
                                height={height - 30}
                                loadData={loadData}
                                onCheck={checked => {
                                    globalStore.visibleColumns = checked as string[]
                                }}
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
                            {/* <Space>
                                
                                <Button
                                    type="text"
                                    size="small"
                                >
                                    另存为新方案
                                </Button>
                                <Button
                                    type="link"
                                    size="small"
                                    danger
                                >
                                    删除方案
                                </Button>
                            </Space> */}
                        </div>
                        {/* <div
                            className={`${tableClassPrefix}-right-group`}
                        >
                        </div> */}
                    </>
                )
            }

            return undefined
        }
        return (
            <div
                className={`${tableClassPrefix}-right`}
                style={{
                    height,
                    width: 20,
                    overflow: 'visible'
                }}
            >
                <div
                    className={`${tableClassPrefix}-right-button`}
                    style={{
                        marginTop: 35,
                    }}
                >
                    <span
                        onClick={() => {
                            store.activeKey = 'column'
                            store.visible = !store.visible
                        }}
                    >
                        <MenuOutlined style={{ paddingRight: 3 , marginBottom: 8}} /> 列信息
                    </span>
                </div>
                {
                    store.visible ? (
                        <div
                            className={`${tableClassPrefix}-right-content`}
                            style={{
                                height,
                            }}
                        >
                            {switchContent()}
                        </div>
                    ) : undefined
                }
                
            </div>
        )
    }) 
}