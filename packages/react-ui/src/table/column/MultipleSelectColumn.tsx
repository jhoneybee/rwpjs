
import React from 'react'
import { FormatterProps } from 'react-data-grid-temp'
import { Checkbox } from '../../index'

export const MultipleSelectColumn = (props : FormatterProps<any, unknown>) => (
    <Checkbox
        checked={props.isRowSelected}
        onClick={(e) => {
            e.stopPropagation();
        }}
        onChange={(e: { target: { checked: any }; nativeEvent: MouseEvent }) => {
            const { checked } = e.target
            props.onRowSelectionChange(checked, (e.nativeEvent as MouseEvent).shiftKey)
        }}
    />
)
