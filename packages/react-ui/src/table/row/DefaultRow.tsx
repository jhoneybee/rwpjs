import React, { useEffect } from 'react'
import {
    RowRendererProps,
    Row,
    Position,
} from 'react-data-grid-temp'

import { useStore } from '../store'
import { ColumnProps } from '../type'


interface DefaultRowProps extends RowRendererProps<any, unknown> {
    columns: ColumnProps[]
}

export const DefaultRow = ({
    row,
    rowIdx,
    eventBus,
    columns = [],
    ...restProps
}: DefaultRowProps) => {
    const store = useStore()
    useEffect(() => eventBus.subscribe('SELECT_CELL', (position: Position) => {
        if (rowIdx === position.rowIdx) {
            store.setContextMenu({
                row,
                rowIdx,
                column: columns[position.idx] as any,
            })
        }
    }));
    return (
        <Row
            row={row}
            rowIdx={rowIdx}
            eventBus={eventBus}
            {...restProps}
        />
    )
}
