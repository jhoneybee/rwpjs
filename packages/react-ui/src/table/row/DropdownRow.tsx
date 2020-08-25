import React from 'react'
import {
    RowRendererProps,
} from 'react-data-grid-temp'
import { Dropdown } from 'antd'

import { ColumnProps } from '../type'
import { DefaultRow } from './DefaultRow'
import { OverlayFunc } from '../../interface'

type DropdownRowProps<T> = {
    contextMenu: React.ReactElement | OverlayFunc
    rowProps: RowRendererProps<any, unknown>
    columns: ColumnProps[]
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
