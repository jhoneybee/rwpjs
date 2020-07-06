import React from 'react'

import {
    RowRendererProps,
} from 'react-data-grid-temp'

import { OverlayFunc } from '../../interface'
import { DefaultRow } from './DefaultRow'
import { DropdownRow } from './DropdownRow'


interface GroupRendererProps {
    row: any
}

interface GroupRowProps {
    contextMenu?: React.ReactElement | OverlayFunc
    rowProps: RowRendererProps<any, unknown>
    groupRenderer?: React.ComponentType<GroupRendererProps>
}

export const GroupRow = ({
    contextMenu,
    rowProps,
    groupRenderer: GroupRenderer,
}: GroupRowProps) => {
    if (rowProps.row.$type === 'group') {
        const { count, title } = rowProps.row

        let groupTitle = <h4>{title}({count})</h4>

        if (GroupRenderer) {
            groupTitle = <GroupRenderer row={rowProps.row}/>
        }

        return (
            <div
                className="rdg-row rdg-row-default-group"
                style={{ top: rowProps.top }}
            >
                { groupTitle }
            </div>
        )
    }

    if (contextMenu) {
        return <DropdownRow contextMenu={contextMenu} rowProps={rowProps} />
    }

    return (
        <DefaultRow {...rowProps} />
    )
}
