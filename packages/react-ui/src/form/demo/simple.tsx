/**
 * title: 简单的表单
 * desc: 一个简单的表单演示,尽管重复设置 key，和name 很繁琐，但是根据 https://zh-hans.reactjs.org/warnings/special-props.html 需要这样做
 */

import React, { useRef } from 'react'

// eslint-disable-next-line import/no-unresolved
import { Form, Input, Button } from '@rwp/react-ui'
import { FormInstance } from 'antd/lib/form'


export default () => {
    const form = useRef<FormInstance | null>(null)
    return (
        <>
            <Button
                onClick={async () => {
                    form.current?.validateFields().then(value => {
                        console.log(value)
                    })
                }}
            >
                触发校验
            </Button>
            <br />
            <Form
                form={form}
                cols={5}
                onValuesChange={(changedValues: any, allValues: any) => {
                    console.log(changedValues)
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
        </>
    )
}