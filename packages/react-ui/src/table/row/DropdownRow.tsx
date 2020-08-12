import React from 'react'
import {
    RowRendererProps,
} from 'react-data-grid-temp'
import { Dropdown } from 'antd'

import { OverlayFunc, ColumnProps } from '../../interface'
import { DefaultRow } from './DefaultRow'

type DropdownRowProps<T> = {
    contextMenu: React.ReactElement | OverlayFunc
    rowProps: RowRendererProps<any, unknown>
    columns: ColumnProps<any>[]
}

export const DropdownRow = ({ rowProps, contextMenu, columns }: DropdownRowProps<any>) => (
    <Dropdown
        overlay={contextMenu}
        trigger={['contextMenu']}
        getPopupContainer={(triggerNode: HTMLElement) => triggerNode!.parentElement!}
    >
        <DefaultRow columns={columns} {...rowProps} />
    </Dropdown>
)
