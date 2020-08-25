import React from 'react'

import {
    RowRendererProps,
} from 'react-data-grid-temp'
import { RightOutlined, DownOutlined } from '@ant-design/icons'
import { ColumnProps, GroupRendererProps } from '../type'
import { DefaultRow } from './DefaultRow'
import { DropdownRow } from './DropdownRow'
import { OverlayFunc } from '../../interface'


import 'antd/es/table/style/index.less'
import { useStore } from '../store'



interface GroupRowProps {
    contextMenu?: React.ReactElement | OverlayFunc
    rowProps: RowRendererProps<any, unknown>
    columns: ColumnProps[]
    groupRenderer?: React.ComponentType<GroupRendererProps>
}

export const GroupRow = ({
    contextMenu,
    rowProps,
    columns,
    groupRenderer: GroupRenderer,
}: GroupRowProps) => {
    const { $id, $type, $title, $space } = rowProps.row
    const store = useStore()
    if ($type === 'GROUP') {
        let groupTitle = <h4 >{$title}</h4>
        if (GroupRenderer) {
            groupTitle = <GroupRenderer row={rowProps.row}/>
        }
        const Icon = store.expandedKeys.includes($id) ?  DownOutlined : RightOutlined
        return (
            <div
                className="rdg-row rdg-row-default-group"
                style={{ top: rowProps.top}}
            >
                <Icon
                    style={{
                        marginLeft: $space
                    }}
                    onClick={() => {
                        // 如果节点是展开的,则删除对应的数据
                        if(store.expandedKeys.includes($id)){
                            store.setExpandedKeys(store.expandedKeys.filter(ele => !ele.includes($id)))
                            return;
                        }
                        store.setExpandedKeys(store.expandedKeys.concat($id))
                        
                    }}
                />
                { groupTitle }
            </div>
        )
    }

    if (contextMenu) {
        return <DropdownRow columns={columns} contextMenu={contextMenu} rowProps={rowProps} />
    }

    return (
        <DefaultRow columns={columns} {...rowProps} />
    )
}
