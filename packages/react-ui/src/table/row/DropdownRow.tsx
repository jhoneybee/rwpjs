import React from 'react'
import {
    RowRendererProps,
} from 'react-data-grid-temp'
import { Dropdown } from 'antd'

import { OverlayFunc } from '../../interface'
import { DefaultRow } from './DefaultRow'

type DropdownRowProps<T> = {
    contextMenu: React.ReactElement | OverlayFunc
    rowProps: RowRendererProps<any, unknown>
}

export const DropdownRow = ({ rowProps, contextMenu }: DropdownRowProps<any>) => (
    <Dropdown
        overlay={contextMenu}
        trigger={['contextMenu']}
        getPopupContainer={(triggerNode: HTMLElement) => triggerNode!.parentElement!}
    >
        <DefaultRow {...rowProps} />
    </Dropdown>
)
