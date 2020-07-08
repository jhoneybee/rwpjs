import React from 'react';
import { Form as AntForm } from 'antd';
import { FormProps, FormItemProps } from '../interface'

export const Form = (props: FormProps) => {
    const { cols = 5, style, ...restProps } = props
    const newStyle = style || {}
    return (
        <AntForm
            {...restProps}
            style={{
                ...newStyle,
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, auto)`,
                gridColumnGap: 8,
            }}
        />
    )
}

Form.Item = (props: FormItemProps) => {
    const { colSpan, style, br, ...restProps } = props
    let gridColumn;
    if (colSpan) gridColumn = `auto/ span ${colSpan}`
    if (br) gridColumn = '1/ auto'
    if (colSpan && br) gridColumn = `1/ span ${colSpan}`
    const newStyle = style || {}
    return (
        <AntForm.Item
            {...restProps}
            style={{ ...newStyle, gridColumn }}
        />
    )
}
