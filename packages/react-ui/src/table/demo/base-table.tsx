/**
 * title: 基础表格
 * desc: 这是一个基础的表格,通过`props.columns`来设置列信息, `props.loadData` 来加载表格数据
 */
import React from 'react'
// eslint-disable-next-line import/no-unresolved
import { Table } from '@rwp/react-ui'
import { columns, loadData } from './common/user'

export default () => (
    <Table
        columns={columns}
        loadData={loadData}
    />
)