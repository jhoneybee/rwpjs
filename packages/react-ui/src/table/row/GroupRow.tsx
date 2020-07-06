import React from 'react'

import {
    RowRendererProps,
} from 'react-data-grid-temp'
import { Typography } from 'antd'

import { OverlayFunc } from '../../interface'
import { DefaultRow } from './DefaultRow'
import { DropdownRow } from './DropdownRow'

interface GroupRowProps {
    contextMenu?: React.ReactElement | OverlayFunc
    rowProps: RowRendererProps<any, unknown>
}

export const GroupRow = ({ contextMenu, rowProps }: GroupRowProps) => {
    if (rowProps.row.$type === 'group') {
        const { count, title } = rowProps.row
        return (
            <div
                className="rdg-row rdg-row-default-group"
                style={{ top: rowProps.top }}
            >
                <Typography.Title level={4}>{title}({count})</Typography.Title>
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
