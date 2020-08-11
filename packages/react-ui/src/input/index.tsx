import React, { useState } from 'react'
import { Input as AntInput } from 'antd'
import { PasswordProps, SearchProps, GroupProps, TextAreaProps as AntTextAreaProps } from 'antd/lib/input'
import { InputProps as AntInputProps } from '../interface'
import { classPrefix } from '../utils'

import './style/index.less'

interface TextAreaProps extends AntTextAreaProps {

}
interface InputType extends React.FC<InputProps>{
    Password: React.FunctionComponent<PasswordProps>
    TextArea: React.FunctionComponent<TextAreaProps>
    Search: React.FunctionComponent<SearchProps>
    Group: React.FunctionComponent<GroupProps>
}

interface InputProps extends AntInputProps {
    bordered?: boolean
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

const textAreaClassPrefix = `${classPrefix}-text-area-footer`
const TextArea = (props: TextAreaProps) => {
    const { onChange, ...restProps } = props
    const [value, setValue] = useState<string>(props.value as string || '')

    let footer = (
        <div className={textAreaClassPrefix} style={restProps.style}>
            最多可输入 {props.maxLength} 字
        </div>
    )
    if (value.length > 0) {
        footer = (
            <div className={textAreaClassPrefix} style={restProps.style}>
                已输入<span>{value.length}</span>/{props.maxLength} 字
            </div>
        )
    }

    return (
        <>
            <AntInput.TextArea
                {...restProps}
                value={value}
                onChange={e => {
                    setValue(e.target.value)
                    if (onChange) {
                        onChange(e)
                    }
                }}
            />
            {props.maxLength ? footer : undefined}
        </>
    )
}
Input.TextArea = TextArea
Input.Search = AntInput.Search
Input.Group = AntInput.Group
