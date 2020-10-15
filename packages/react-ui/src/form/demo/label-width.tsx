/**
 * title: 固定表单label宽度
 * desc: 用来固定表单的label的宽度
 */

import React, { useRef } from 'react'

// eslint-disable-next-line import/no-unresolved
import { Form, Input } from '@rwp/react-ui'
import { FormInstance } from 'antd/lib/form'


export default () => {
    const form = useRef<FormInstance | null>()
    return (
        <>
            <Form
                form={form}
                cols={1}
            >
                <Form.Item key="Field 0" label={<span style={{ width: 120}}>字段0</span>}  >
                    <Input />
                </Form.Item>
                <Form.Item key="Field 1" label={<span style={{ width: 120}}>字段---------1</span>}>
                    <Input />
                </Form.Item>
                <Form.Item key="Field 2" label={<span style={{ width: 120}}>字段---------2</span>} >
                    <Input />
                </Form.Item>
            </Form>
        </>
    )
}