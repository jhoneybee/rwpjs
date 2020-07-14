import React from 'react'
import { Spin as AntSpin } from 'antd'
import { SpinProps } from 'antd/lib/spin'
import { LoadingOutlined } from '@ant-design/icons';

export const Spin = (props: SpinProps & { children: React.ReactNode }) => {
    const { indicator, ...restProps } = props
    let indicatorTemp = <LoadingOutlined style={{ fontSize: 24 }} spin />
    if (indicator) {
        indicatorTemp = indicator
    }
    return <AntSpin {...restProps} indicator={indicatorTemp}/>
}
