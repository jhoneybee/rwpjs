import React from 'react'
import {
    RowRendererProps,
    Row as RowRender,
} from 'react-data-grid-temp'
import { DropdownRow } from './DropdownRow'
import { GroupRow } from './GroupRow'
import { Row, TableProps } from '../type'

export const useRowRenderer = (
    rowProps: RowRendererProps<Row, unknown>,
    isDisableLoadData: boolean,
    {
        columns,
        overlay,
        groupRenderer,
    }: TableProps
) => {
    if (isDisableLoadData) {
        return (
            <GroupRow
                columns={columns}
                rowProps={rowProps}
                contextMenu={overlay}
                groupRenderer={groupRenderer}
            />
        )
    }

    if (overlay) {
        return (
            <DropdownRow
                columns={columns}
                rowProps={rowProps}
                contextMenu={overlay}
            />
        )
    }
    return <RowRender {...rowProps} />
}