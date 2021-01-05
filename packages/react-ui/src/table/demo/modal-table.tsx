/**
 * title: 表格放在弹出框中
 * desc: 将一个表格放在弹出中
 */
import React, { useRef } from 'react'
// eslint-disable-next-line import/no-unresolved
import { Table, Modal, Button } from '@rwp/react-ui'
import { editColumns as columns, loadData } from './common/user'
import { ModalHandle } from '@/modal'

export default () => {
    const modal = useRef<ModalHandle>(null) 
    return (
        <>
            <Button
                onClick={() => {
                    modal.current?.show()
                }}
            >
                点击显示弹出框
            </Button>
            <Modal
                modal={modal}
            >
                <Table
                    columns={columns}
                    loadData={loadData}
                />
            </Modal>
        </>
    )
} 