import React from 'react'
import {
    RowRendererProps,
} from 'react-data-grid-temp'
import { DropdownRow } from './DropdownRow'
import { DefaultRow } from './DefaultRow'
import { GroupRow } from './GroupRow'
import { Row, TableProps } from '../type'

export const useRowRenderer = (
    rowProps: RowRendererProps<Row, unknown>,
    isDisableLoadData: boolean,
    tableProps: TableProps,
) => {

    if (isDisableLoadData) {
        return (
            <GroupRow
                tableProps={tableProps}
                rowProps={rowProps}
                contextMenu={tableProps.overlay}
                groupRenderer={tableProps.groupRenderer}
            />
        )
    }

    if (tableProps.overlay) {
        return (
            <DropdownRow
                tableProps={tableProps}
                rowProps={rowProps}
                contextMenu={tableProps.overlay}
            />
        )
    }
    return <DefaultRow tableProps={tableProps} {...rowProps} />
}