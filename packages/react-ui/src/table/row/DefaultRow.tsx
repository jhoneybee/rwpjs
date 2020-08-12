import React, { useContext, useEffect } from 'react'
import {
    RowRendererProps,
    Row,
    Position,
} from 'react-data-grid-temp'

import { TableContext } from '../index'
import { ColumnProps } from '../../interface'


interface DefaultRowProps extends RowRendererProps<any, unknown> {
    columns: ColumnProps<any>[]
}

export const DefaultRow = ({
    row,
    rowIdx,
    eventBus,
    columns = [],
    ...restProps
}: DefaultRowProps) => {
    const { dispatch } = useContext(TableContext)
    useEffect(() => eventBus.subscribe('SELECT_CELL', (position: Position) => {
        if (rowIdx === position.rowIdx) {
            dispatch({
                type: 'SET_CONTEXTMENU',
                payload: {
                    row,
                    rowIdx,
                    column: columns[position.idx] as any,
                },
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
