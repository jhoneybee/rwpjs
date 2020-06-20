import React, { useState } from 'react'
import { Button as AntButton } from 'antd'
import { ButtonProps } from '../interface'
import { isPromise } from '../utils'

export const Button = (props: ButtonProps) => {
    const [loading, setLoading] = useState(false)
    const { autoLoading , ...restProps } = props
    return (
        <AntButton
            {...restProps}
            loading={autoLoading? loading : props.loading}
            onClick={()=>{
                if(props.onClick){
                    setLoading(true)
                    const clickResult = props.onClick() 
                    if(isPromise(clickResult)){
                        (clickResult as Promise<void>).then(()=>{
                            setLoading(false)
                        })
                    }else{
                        setLoading(false)
                    }
                }
            }}
        />
    )
}

Button.defaultProps = {
    autoLoading: true
}