import React, { useContext } from 'react'
import {
    Cell,
    RowRendererProps,
    Row,
} from 'react-data-grid-temp'

import { TableContext } from '../index'

export const DefaultRow = React.forwardRef((props: RowRendererProps<any, unknown>, _ref) => {
    const { dispatch } = useContext(TableContext)
    return (
        <Row
            {...props}
            cellRenderer={cellProps => (
                <Cell
                    {...cellProps}
                    onContextMenu={e => {
                        e.preventDefault()
                        dispatch({
                            type: 'SET_CONTEXTMENU',
                            payload: {
                                row: props.row,
                                rowIdx: props.rowIdx,
                                column: cellProps.column,
                            },
                        })
                    }}
                />
            )}
        />
    )
})
