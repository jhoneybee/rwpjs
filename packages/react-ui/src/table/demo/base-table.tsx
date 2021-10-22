/**
 * title: 基础表格
 * desc: 这是一个基础的表格,通过`props.columns`来设置列信息, `props.loadData` 来加载表格数据
 */
import React, { useRef, useState } from 'react'
// eslint-disable-next-line import/no-unresolved
import { Button, Table } from '@rwp/react-ui'
import { columns, loadData } from './common/user'
import { TableHandle } from '../type';

export default () => {
    const ref = useRef<HTMLDivElement>();
    const [group,setGroup] = useState<string[]>()
    const table = useRef<TableHandle>();
    const [cols, setCols] = useState(columns)
    return (
        <div
            style={{
                height: 500,
                overflow: 'scroll'
            }}
        >   
            <Button
                onClick={() => {
                    setGroup(['dateBirth', 'username'])
                }}
            >
                点击分组
            </Button>
            <Button
                onClick={() => {
                    table.current?.setVisibleColumns([])
                }}
            >
                点击取消所有的列显示
            </Button>
            <Button
                onClick={() => {
                    cols.push({
                        name: `pageNo${Date.now()}`,
                        title: `测试数据${Date.now()}`,
                        editable: true
                    })
                    setCols([...cols])
                }}
            >
                新增列信息
            </Button>
            <Table
                ref={ref}
                columns={cols}
                table={table}
                groupColumn={group}
                groupRenderer={({ row }) => {
                    // console.log(JSON.parse(JSON.stringify(row)))
                    return JSON.stringify(row)
                }}
                loadData={loadData}
                getPopupContainer={(element: HTMLDivElement) => {
                    return element.parentElement!
                }}
            
                onBeforeGroupData={(data) => {
                    console.log(JSON.parse(JSON.stringify(data)), '----------')
                    return data
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
