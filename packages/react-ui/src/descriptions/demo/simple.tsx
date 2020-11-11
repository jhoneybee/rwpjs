/**
 * title: 基本
 * desc: 简单的展示。
 */

import React from 'react'

// eslint-disable-next-line import/no-unresolved
import { Descriptions } from '@rwp/react-ui'

export default () => (
    <Descriptions title="User Info">
        <Descriptions.Item label="UserName">张尽</Descriptions.Item>
        <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
        <Descriptions.Item label="Live">武汉</Descriptions.Item>
        <Descriptions.Item label="Remark">空</Descriptions.Item>
        <Descriptions.Item label="Address">
            湖北省,武汉市
        </Descriptions.Item>
    </Descriptions>
)