/**
 * title: 基本
 * desc: 简单的展示。
 */

import React from 'react'

// eslint-disable-next-line import/no-unresolved
import { Breadcrumb } from '@rwp/react-ui'

export default () => (
    <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>
        <a href="">Application Center</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
        <a href="">Application List</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>An Application</Breadcrumb.Item>
    </Breadcrumb>
)