/**
 * title: 基础表格
 * desc: 这是一个基础的表格,通过`props.columns`来设置列信息, `props.loadData` 来加载表格数据
 */
import React, { useRef } from 'react'
// eslint-disable-next-line import/no-unresolved
import { Button, Table } from '@rwp/react-ui'
import { columns, loadData } from './common/user'
import { useState } from 'react';

export default () => {
    const ref = useRef<HTMLDivElement>();
    const [group,setGroup] = useState<string[]>()
    return (
        <div
            style={{
                height: 500,
                overflow: 'scroll'
            }}
        >   
            <Button
                onClick={() => {
                    setGroup(['dateBirth'])
                }}
            >
                点击分组
            </Button>
            <Table
                ref={ref}
                columns={columns}
                groupColumn={group}
                groupRenderer={({ row }) => {
                    console.log(JSON.parse(JSON.stringify(row)))
                    return JSON.stringify(row)
                }}
                loadData={loadData}
                getPopupContainer={(element: HTMLDivElement) => {
                    return element.parentElement!
                }}
                onRowsUpdate={(data, onCommit) => {
                    // console.log([...data])
                    onCommit().then((ele) => {
                        console.log(ele)
                    })
                }}
                onChangeColumn={(data) => {
                    debugger
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
