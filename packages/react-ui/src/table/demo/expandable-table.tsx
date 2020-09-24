/**
 * title: 可展开表格
 * desc: "通过 `expandable` 来设置可展开数据 \n\n 通过表格的 `expandable` 来设置展开信息`expandable` 的结构体如下\n- `height` 展开的高度\n- `expandedRowClassName` 展开的clssName\n- `rowExpandable` 是否允许展开\n- `expandedRowRender` 自定义展开渲染内容"
 */
import React from 'react'
// eslint-disable-next-line import/no-unresolved
import { Table } from '@rwp/react-ui'
import { columns, loadData } from './common/user'

export default () => (
    <Table
        expandable={{
            expandedRowRender: () => {
                return <div> 前天看到了小兔，昨天是小鹿，今天是你 。</div>
            }
        }}
        columns={columns}
        loadData={loadData}
    />
)