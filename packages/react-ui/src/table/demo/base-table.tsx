/**
 * title: 基础表格
 * desc: 这是一个基础的表格,通过`props.columns`来设置列信息, `props.loadData` 来加载表格数据
 */
import React, { useRef } from 'react'
// eslint-disable-next-line import/no-unresolved
import { Table } from '@rwp/react-ui'
import { columns, loadData } from './common/user'

export default () => {
    const ref = useRef<HTMLDivElement>();
    return (
        <div
            style={{
                height: 500,
                overflow: 'scroll'
            }}
        >
            <Table
                ref={ref}
                columns={columns}
                loadData={loadData}
                getPopupContainer={(element: HTMLDivElement) => {
                    return element.parentElement!
                }}
                onChangeColumn={(data) => {
                    console.log(data)
                }}
            />
            <div
                style={{
                    marginTop: 500
                }}
            />
        </div>
    )
}
