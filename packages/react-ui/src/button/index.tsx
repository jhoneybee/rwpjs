import React, { useState, useEffect } from 'react'
import { Button as AntButton } from 'antd'
import { ButtonProps } from '../interface'

export const Button = (props: ButtonProps) => {
    const [disabled, setDisabled] = useState(false)
    useEffect(() => {
        if(props.disabled !== undefined){
            setDisabled(props.disabled)
        }
    } , [props.disabled])
    const { ...restProps } = props
    return (
        <AntButton
            {...restProps}
            disabled={disabled}
            onClick={() => {
                setDisabled(true)
                props.onClick?.()?.then(() => {
                    setDisabled(false)
                })
            }}
        />
    )
}

Button.defaultProps = {
    onClick: async () => {},
}
