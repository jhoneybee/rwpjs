import React, { useState, useEffect, useRef, CSSProperties } from 'react'
import { SketchPicker as RCSketchPicker, RGBColor } from 'react-color'
import { classPrefix } from '../utils'
import './style/index.less'

export interface SketchPickerProps {
    // css样式
    style?: Omit<CSSProperties, 'background'>
    // 改变颜色触发的事件
    onChange?: (value: RGBColor) => void
    // 当前颜色值
    value?: RGBColor
}

export const SketchPicker = (props: SketchPickerProps) => {
    const { width, ...restStyle } = props.style || {}
    const [color, setColor] = useState<RGBColor | undefined>(props.value)
    const [display, setDisplay] = useState<boolean>(false)
    let background;
    if (color) {
        background = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
    }
    const divRef = useRef<HTMLDivElement>(null)
    const isMouseOut = useRef<boolean>(false)
    useEffect(() => {
        if (display && divRef.current) {
            divRef.current.focus()
        }
    }, [display, isMouseOut.current])
    return (
        <>
            <div
                className={`${classPrefix}-sketch-picker`}
                onClick={() => { setDisplay(true) }}
                style={restStyle}
            >
                <div style={{ background, width }}/>
            </div>
            {
                display ? (
                    <div
                        ref={divRef}
                        tabIndex={-1}
                        onBlur={() => {
                            if (isMouseOut.current) {
                                setDisplay(false)
                            }
                        }}
                        onMouseOut={() => {
                            isMouseOut.current = true
                        }}
                        onMouseOver={() => {
                            isMouseOut.current = false
                        }}
                        onFocus={() => 0}
                        style={{
                            zIndex: 1000,
                            position: 'absolute',
                            width: 200,
                        }}
                    >
                        <RCSketchPicker
                            color={color}
                            onChange={changeColor => {
                                setColor(changeColor.rgb)
                                if (props.onChange) {
                                    props.onChange(changeColor.rgb)
                                }
                            }}
                        />
                    </div>
                ) : undefined
            }
        </>
    )
}
