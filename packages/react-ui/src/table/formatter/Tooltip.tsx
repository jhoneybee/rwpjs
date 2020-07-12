import React, { createRef, useState, useEffect } from 'react'
import { Tooltip } from 'antd'
import './Tooltip.less'

interface Props {
    style: React.CSSProperties
    children: JSX.Element
}

export const TooltipFormatter = (props: Props) => {
    const ref = createRef<HTMLDivElement>()
    const [tooltip, setTooltip] = useState<boolean>(false)
    useEffect(() => {
        if (ref.current) {
            if (ref.current.clientWidth < ref.current.scrollWidth) {
                setTooltip(true)
            }
        }
    })

    let cell = (
        <div
            ref={ref}
            style={{
                ...props.style,
            }}
        >
            {props.children}
        </div>
    )
    if (tooltip) {
        cell = (
            <Tooltip placement="bottomLeft" title={props.children}>
                {cell}
            </Tooltip>
        )
    }
    return cell
}
