/**
 * title: 可选中表格
 * desc: 通过`props.selectBox`来设置选中模式, `multiple` 多选, `single` 单选, `none` 不显示选择列, **设置选中模式,则必须设置 `rowKey` **
 */
import React, { useEffect, useRef, useState } from 'react'
// eslint-disable-next-line import/no-unresolved
import { Table, Switch, Button } from '@rwp/react-ui'
import { columns, loadData } from './common/user'
import { TableHandle } from '../type'

export default () => {
    const [selectBox, setSelectBox] = useState<'multiple' | 'none' | 'single'>('multiple')

    const table = useRef<TableHandle>()

    useEffect(() => {
        setTimeout(() => {
            table.current?.setSelect(new Set([1,2,3,4,5]))
        }, 1000)

    }, [])

    return (
        <>
            <Switch
                checkedChildren="单选"
                unCheckedChildren="多选"
                onChange={(value: any) => {
                    if (value) {
                        setSelectBox('single')
                    } else {
                        setSelectBox('multiple')
                    }
                }}
            />

            <Button
                onClick={() => {
                    table.current?.reload({});
                }}
            >
                reload
            </Button>
            <br /> <br />
            <Table
                table={table}
                rowKey="$index"
                selectBox={selectBox}
                columns={columns}
                loadData={loadData}
            />
        </>
    )
}