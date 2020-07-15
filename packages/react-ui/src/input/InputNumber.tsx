import React from 'react'
import { InputNumber as AntInputNumber } from 'antd'
import { InputNumberProps } from 'antd/lib/input-number'

export const InputNumber = (props: InputNumberProps & React.RefAttributes<unknown>) => (
    <AntInputNumber {...props}/>
)
