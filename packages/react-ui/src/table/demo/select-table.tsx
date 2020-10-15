/**
 * title: 可选中表格
 * desc: 通过`props.selectBox`来设置选中模式, `multiple` 多选, `single` 单选, `none` 不显示选择列, **设置选中模式,则必须设置 `rowKey` **
 */
import React, { useState } from 'react'
// eslint-disable-next-line import/no-unresolved
import { Table, Switch } from '@rwp/react-ui'
import { columns, loadData } from './common/user'

export default () => {
    const [selectBox, setSelectBox] = useState<'multiple' | 'none' | 'single'>('multiple')

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
            <br /> <br />
            <Table
                rowKey="$index"
                selectBox={selectBox}
                columns={columns}
                loadData={loadData}
            />
        </>
    )
}