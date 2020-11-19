/**
 * title: 表单联动
 * desc: 通过一个字段改变另外一个字段的组件,基于`shouldUpdate`
 */

import React, { useRef } from 'react'

// eslint-disable-next-line import/no-unresolved
import { Form, Input } from '@rwp/react-ui'
import { FormInstance } from 'antd/lib/form'


export default () => {
    const form = useRef<FormInstance | null>(null)
    return (
        <>
            <Form
                form={form}
                cols={5}
                onValuesChange={(changedValues: any, allValues: any) => {
                    // eslint-disable-next-line no-console
                    console.log(form)
                    // eslint-disable-next-line no-console
                    console.log(changedValues)
                    // eslint-disable-next-line no-console
                    console.log(allValues)
                }}
            >
                <Form.Item key="Field 0" name="Field0" label="字段 0">
                    <Input placeholder="请输入任何字符" />
                </Form.Item>
                <Form.Item
                    key="Field 1"
                    shouldUpdate={(prevValues: any, curValues: any) => prevValues.Field0 !== curValues.Field0}
                >
                    {({ getFieldValue }: { getFieldValue: Function }) => {
                        const Field0 = getFieldValue('Field0') || '';
                        if (Field0 !== '') {
                            return (
                                <Form.Item name="checkbox" label="输入框二">
                                    <Input />
                                </Form.Item>
                            )
                        }
                        return (
                            <Form.Item name="input" label="输入框一">
                                <Input />
                            </Form.Item>
                        )
                    }}
                </Form.Item>
                <Form.Item key="Field 4" name="Field 4" label={<span>你好</span>}>
                    <Input />
                </Form.Item>
                <Form.Item key="Field 5" name="Field 5" label="字段 5">
                    <Input />
                </Form.Item>
                <Form.Item key="Field 6" name="Field 6" label="字段 6">
                    <Input />
                </Form.Item>
                <Form.Item key="Field 7" name="Field 7" label="字段 7">
                    <Input />
                </Form.Item>
                <Form.Item key="Field 8" name="Field 8" label="字段 8">
                    <Input />
                </Form.Item>
            </Form>
        </>
    )
}