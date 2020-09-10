import React, { useState, useEffect } from 'react'
import { Button as AntButton } from 'antd'
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
                if(props.onClick){
                    setDisabled(true)
                    const clickThen = props.onClick!() as Promise<void>
                    if (isPromise(clickThen)) {
                        clickThen.then(() => {
                            setDisabled(false)
                        })
                    }else {
                        setDisabled(false)
                    }
                }
            }}
        />
    )
}

Button.defaultProps = {
    onClick: async () => {},
}
