import React from 'react'
import { Input as AntInput } from 'antd'
import { InputProps } from '../interface'

interface InputType extends React.FC<InputProps>{
    Password: React.FunctionComponent
    TextArea: typeof AntInput.TextArea
    Search: React.FunctionComponent
    Group: React.FunctionComponent
}

export const Input = React.forwardRef<AntInput>((props: InputProps, ref) => {
    const { onChange, ...restProps } = props
    return <AntInput ref={ref} {...restProps} onChange={e => {
        if (onChange) {
            onChange(e.target.value)
        }
    } } />
}) as unknown as InputType

Input.Password = AntInput.Password
Input.TextArea = AntInput.TextArea
Input.Search = AntInput.Search
Input.Group = AntInput.Group
