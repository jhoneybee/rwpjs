import React, { useState, useEffect } from 'react'
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

export const Input = React.forwardRef<any>((props: InputProps, ref) => {
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
    const { onChange, value: propsValue = '', ...restProps } = props
    const [value, setValue] = useState<string>(propsValue as string)

    useEffect(() => {
        setValue(propsValue as string)
    }, [props.value])

    let footer = (
        <div className={textAreaClassPrefix} >
            <span className={`${textAreaClassPrefix}-text`}>最多可输入</span>
            <span> {props.maxLength} </span>
            <span className={`${textAreaClassPrefix}-text`}>字</span>
        </div>
    )
    if (value && value.length > 0) {
        footer = (
            <div className={textAreaClassPrefix} >
                <span className={`${textAreaClassPrefix}-text`}>已输入 </span>
                <span className={`${textAreaClassPrefix}-input-number`}>{value.length}</span>
                <span > / {props.maxLength}</span>
                <span className={`${textAreaClassPrefix}-text`}> 字</span>
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
