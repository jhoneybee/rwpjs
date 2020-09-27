/**
 * title: 自定义渲染选中框的Header
 * desc: 通过属性 `selectHeaderRenderer` 来自定义渲染 选中框的头部信息。例如如果想去掉，则直接 `return` 一个空的 `<div />`
 */
import React from 'react'
// eslint-disable-next-line import/no-unresolved
import { Table } from '@rwp/react-ui'
import { columns, loadData } from './common/user'

export default () => {
    return (
        <>
            <Table
                rowKey="$index"
                selectBox="multiple"
                selectHeaderRenderer={() => <div />}
                columns={columns}
                loadData={loadData}
            />
        </>
    )
}