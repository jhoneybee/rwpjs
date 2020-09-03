import React, { useEffect, useRef } from 'react'
import {
    RowRendererProps,
    Row,
    Position,
} from 'react-data-grid-temp'
import classNames from 'classnames'

import { useStore } from '../store'
import { ColumnProps, TableProps } from '../type'
import { classPrefix } from '../../utils'

import './style/default-row.less'

interface DefaultRowProps extends RowRendererProps<any, unknown> {
    tableProps: TableProps
}

const tableClassPrefix = `${classPrefix}-table`

export const DefaultRow = ({
    row,
    rowIdx,
    eventBus,
    tableProps,
    ...restProps
}: DefaultRowProps) => {
    const store = useStore()
    let columns: ColumnProps[] = []
    if (tableProps && tableProps.columns){
        columns = tableProps.columns
    }

    useEffect(() => eventBus.subscribe('SELECT_CELL', (position: Position) => {
        if (rowIdx === position.rowIdx) {
            store.setContextMenu({
                row,
                rowIdx,
                column: columns[position.idx] as any,
            })
        }
    }));

    const rowRef = useRef<HTMLDivElement | null>(null)
    let expandable = null
    if(
        (tableProps?.expandable?.rowExpandable?.(row)
        ||
        (tableProps.expandable && tableProps.expandable.expandedRowRender)
        ) &&
        store.expandedRowNumber === rowIdx
    ){
        expandable = (
            <div
                className={classNames({
                    [`${tableClassPrefix}-expandable`]: true
                })}
                style={{
                    top: restProps.top + tableProps.rowHeight!,
                    width: rowRef.current?.clientWidth,
                }}
            >
                {tableProps.expandable?.expandedRowRender?.(row)}
            </div>
        )
    }

    return (
        <>
            <Row
                ref={rowRef}
                row={row}
                rowIdx={rowIdx}
                eventBus={eventBus}
                {...restProps}
            />
            {expandable}
        </>
    )
}
