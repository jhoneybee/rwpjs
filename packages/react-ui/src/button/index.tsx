import React, { useState } from 'react'
import { Button as AntButton } from 'antd'
import { ButtonProps } from '../interface'
import { isPromise } from '../utils'

const Button = (props: ButtonProps) => {
    const [loading, setLoading] = useState(false)
    return (
        <AntButton
            {...props}
            loading={props.autoLoading? loading : props.loading}
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

export default Button