import React from 'react'
import { Input as AntInput } from 'antd'
import { PasswordProps, SearchProps, GroupProps } from 'antd/lib/input'
import { InputProps } from '../interface'

interface InputType extends React.FC<InputProps>{
    Password: React.FunctionComponent<PasswordProps>
    TextArea: typeof AntInput.TextArea
    Search: React.FunctionComponent<SearchProps>
    Group: React.FunctionComponent<GroupProps>
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
