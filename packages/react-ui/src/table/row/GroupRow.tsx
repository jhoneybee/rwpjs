import React, { useState, useContext } from 'react'

import {
    RowRendererProps,
} from 'react-data-grid-temp'
import classnames from 'classnames'

import { OverlayFunc, ColumnProps } from '../../interface'
import { DefaultRow } from './DefaultRow'
import { DropdownRow } from './DropdownRow'
import 'antd/es/table/style/index.less'
import { TableContext } from '../index'


export interface GroupRendererProps {
    row: any
}

interface GroupRowProps {
    contextMenu?: React.ReactElement | OverlayFunc
    rowProps: RowRendererProps<any, unknown>
    columns: ColumnProps<any>[]
    groupRenderer?: React.ComponentType<GroupRendererProps>
}

export const GroupRow = ({
    contextMenu,
    rowProps,
    columns,
    groupRenderer: GroupRenderer,
}: GroupRowProps) => {
    const { count, title } = rowProps.row
    const { dispatch, state } = useContext(TableContext)
    const [expand, setExpand] = useState<boolean>(state.groupExpanded.includes(title))
    if (rowProps.row.$type === 'group') {
        let groupTitle = <h4 >{title}({count})</h4>

        if (GroupRenderer) {
            groupTitle = <GroupRenderer row={rowProps.row}/>
        }

        return (
            <div
                className="rdg-row rdg-row-default-group"
                style={{ top: rowProps.top }}
            >
                <button
                    type="button"
                    aria-label="expand"
                    className={classnames({
                        'ant-table-row-expand-icon': true,
                        'ant-table-row-expand-icon-expanded': expand,
                        'ant-table-row-expand-icon-collapsed': !expand,
                    })}
                    onClick={() => {
                        setExpand(!expand)
                        dispatch({
                            type: 'SET_GROUP_EXPANDED',
                            payload: title,
                        })
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
