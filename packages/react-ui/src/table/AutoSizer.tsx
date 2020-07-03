import React, { useEffect, useRef, useState, CSSProperties } from 'react'

type Size = {
    width: number,
    height: number,
}

type Props = {
    style?: CSSProperties
    children: (size: Size) => JSX.Element
}

export const AutoSizer = ({
    children,
    style = {},
}: Props) => {
    const ref = useRef<HTMLDivElement>(null)
    const [size, setSize] = useState<Size>()
    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect()
            setSize({
                width: rect.width,
                height: rect.height,
            })
        }
    }, [])
    return (
        <div
            ref={ref}
            style={{ width: '100%', height: '100%', ...style }}>
            {
                size !== undefined ? children(size) : undefined
            }
        </div>
    )
}
