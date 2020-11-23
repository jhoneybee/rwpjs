/**
 * title: 在Modal中使用Form
 * desc: 一个在Modal中使用Form来进行表单或者其他操作
 */

import React, { useRef } from 'react'

// eslint-disable-next-line import/no-unresolved
import { Form, Input, Button, Modal } from '@rwp/react-ui'
// eslint-disable-next-line import/no-unresolved
import { ModalHandle } from '@rwp/react-ui/lib/modal/index'

import { FormInstance } from 'antd/lib/form'

export default () => {
    const form = useRef<FormInstance | null>(null)
    const modal = useRef<ModalHandle | null>(null)
    return (
        <>
            <Button
                onClick={async () => {
                    modal.current?.show()
                }}
            >
                触发显示Modal
            </Button>
            <br />
            <Modal
                width='80%'
                title='在Modal中使用Form'
                modal={modal}
            >
                <Form
                    form={form}
                    cols={5}
                    onValuesChange={(changedValues: any, allValues: any) => {
                        // eslint-disable-next-line no-console
                        console.log(changedValues)
                        // eslint-disable-next-line no-console
                        console.log(allValues)
                    }}
                >
                    <Form.Item key="Field 0" label="字段 0" rules={[{ required: true, message: 'Please input your username!' }]} >
                        <Input />
                    </Form.Item>
                    <Form.Item key="Field 1" label="字段 1" colSpan={2}>
                        <Input />
                    </Form.Item>
                    <Form.Item key="Field 2" label="非常长的字段2">
                        <Input />
                    </Form.Item>
                    <Form.Item key="Field 3" label="字段 3">
                        <Input />
                    </Form.Item>
                    <Form.Item key="Field 4" label="字段 4">
                        <Input />
                    </Form.Item>
                    <Form.Item key="Field 5" label="字段 5">
                        <Input />
                    </Form.Item>
                    <Form.Item key="Field 6" label="字段 6">
                        <Input />
                    </Form.Item>
                    <Form.Item key="Field 7" label="字段 7" rules={[{ required: true, message: 'Please input your username!' }]} labelWidth="104.6px">
                        <Input />
                    </Form.Item>
                    <Form.Item key="Field 8" rowSpan={3}>
                        <div style={{ height: 100, width: 160, marginLeft: 20, backgroundColor: '#999999' }} />
                    </Form.Item>
                    <Form.Item key="Field 9" label="字段 9" colSpan={4}>
                        <Input.TextArea maxLength={100} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}