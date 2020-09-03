import React from 'react'
import {
    RowRendererProps,
} from 'react-data-grid-temp'
import { Dropdown } from 'antd'

import { TableProps } from '../type'
import { DefaultRow } from './DefaultRow'
import { OverlayFunc } from '../../interface'

type DropdownRowProps<T> = {
    contextMenu: React.ReactElement | OverlayFunc
    rowProps: RowRendererProps<any, unknown>
    tableProps: TableProps
}

export const DropdownRow = ({
    rowProps,
    contextMenu,
    tableProps,
}: DropdownRowProps<any>) => (
    <Dropdown
        overlay={contextMenu}
        trigger={['contextMenu']}
        getPopupContainer={(triggerNode: HTMLElement) => triggerNode!.parentElement!}
    >
        <DefaultRow tableProps={tableProps} {...rowProps} />
    </Dropdown>
)
