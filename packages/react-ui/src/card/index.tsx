import React, { ReactNode } from 'react'
import { Card as AntCard } from 'antd'
import { CardProps as AntCardProps } from 'antd/lib/card'
import classNames from 'classnames'
import { Resizable } from 're-resizable'
import { classPrefix } from '../utils'
import './style/index.less'

export declare type CardType = 'primary' | 'danger' | 'default';

export interface CardProps extends Omit<AntCardProps, 'type'>{
    type?: CardType
    children?: ReactNode
}

export const Card = (props: CardProps) => {
    const { type = 'default', style, ...restProps } = props
    const classname = classNames({
        [`${classPrefix}-card-primary`]: type === 'primary',
        [`${classPrefix}-card-danger`]: type === 'danger',
        [`${classPrefix}-card-default`]: type === 'default',
    })
    const { width = '100%', height = '100%' } = style || {}

    return (
        <Resizable
            defaultSize={{
                width,
                height,
            }}
        >
            <AntCard
                className={classname}
                {...restProps}
            />
        </Resizable>
    )
}
Card.Grid = AntCard.Grid
Card.Meta = AntCard.Meta
