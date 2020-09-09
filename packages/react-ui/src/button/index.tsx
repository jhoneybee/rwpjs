import React, { useState, useEffect } from 'react'
import { Button as AntButton } from 'antd'
import { isFunction } from 'lodash'
import { isPromise } from '../utils'
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
                if(isPromise(props.onClick)){
                    setDisabled(true)
                    props.onClick?.()?.then(() => {
                        setDisabled(false)
                    })
                }else if(isFunction(props.onClick)){
                    setDisabled(true)
                    props.onClick?.()
                    setDisabled(false)
                }
            }}
        />
    )
}

Button.defaultProps = {
    onClick: async () => {},
}
