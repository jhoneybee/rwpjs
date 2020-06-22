import React from 'react'
import { Input as AntInput } from 'antd'
import { InputProps } from '../interface'

export const Input: any = React.forwardRef<AntInput>((props: InputProps, ref) => {
    const { onChange, ...restProps } = props
    return <AntInput ref={ref} {...restProps} onChange={e => {
        if (props.onChange) {
            props.onChange(e.target.value)
        }
    }}/>
})

Input.Password = AntInput.Password
Input.TextArea = AntInput.TextArea
Input.Search = AntInput.Search
Input.Group = AntInput.Group
