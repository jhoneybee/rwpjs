import React, { useState } from 'react'
import { Button as AntButton } from 'antd'
import { ButtonProps } from '../interface'

export const Button = (props: ButtonProps & React.RefAttributes<HTMLElement>) => {
    const [loading, setLoading] = useState(false)
    const { enableAutoLoading, ...restProps } = props
    return (
        <AntButton
            {...restProps}
            loading={enableAutoLoading ? loading : props.loading}
            onClick={() => {
                setLoading(true)
                props.onClick!().then(() => {
                    setLoading(false)
                })
            }}
        />
    )
}

Button.defaultProps = {
    enableAutoLoading: true,
    onClick: async () => {},
}
