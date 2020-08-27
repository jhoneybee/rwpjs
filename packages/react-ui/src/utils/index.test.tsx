import React, { useState } from 'react'
import { render, fireEvent } from '@testing-library/react'

import { classPrefix, toDoubleClick } from './index';

/**
 * 测试获className的前缀名称
 */
test('classPrefix', () => {
    expect(classPrefix).toBe('rwp')
})

/**
 * 测试单击转换为双击事件
 */
test('toDoubleClick', () => {
    const DivTestDoubleClick = () => {
        const [width, setWidth] = useState(200);
        return (
            <div
                style={{
                    width,
                    height: 200,
                }}
                onClick={() => {
                    toDoubleClick(() => {
                        setWidth(width + 200)
                    })
                }}
            />
        )
    }
    const { container } = render(<DivTestDoubleClick />)
    const divDom = container.querySelector('div')
    expect(divDom?.style.width).toEqual('200px')
    fireEvent.click(divDom!)
    fireEvent.click(divDom!)
    expect(divDom?.style.width).toEqual('400px')
    fireEvent.click(divDom!)
    fireEvent.click(divDom!)
    expect(divDom?.style.width).toEqual('600px')
})