import React, { useRef, useEffect, isValidElement } from 'react'
import { Form as AntForm } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import classNames from 'classnames'
import { isArray } from 'lodash'

import { FormProps, FormItemProps } from '../interface'
import { classPrefix } from '../utils'
import './style/index.less'


const classNameFixedWidth = `${classPrefix}-item-fixed-width`

export const Form = (props: FormProps) => {
    const { cols = 5, form: propsForm, children, ...restProps } = props
    const [form] = useForm()
    if (propsForm) {
        propsForm.current = form
    }

    const formRef = useRef<HTMLDivElement | null>(null);

    const changeFormItemDom = () => {
        if (formRef.current) {
            let isEnableLabelWidth = false;
            if (isArray(children)) {
                children.some(ele => {
                    if (isValidElement(ele) && ele.props.labelWidth) {
                        isEnableLabelWidth = true
                        return true
                    }
                    return false
                })
            } else if (isValidElement(children)) {
                if (children.props.labelWidth) {
                    isEnableLabelWidth = true
                }
            }

            if (isEnableLabelWidth) {
                const antFormItems = formRef.current.querySelectorAll('.ant-form-item')
                antFormItems.forEach(items => {
                    if (items.getAttribute('style')?.includes('--label-width')) {
                        const newClassName = items.getAttribute('class')?.replace('ant-row', '').replace(classNameFixedWidth, '')!
                        items.setAttribute('class', classNames({
                            [newClassName]: true,
                            [classNameFixedWidth]: true
                        }))
                    }
                })
            }
        }
    }
    
    useEffect(() => {
        changeFormItemDom()
    })

    return (
        <div ref={formRef}>
            <AntForm
                {...restProps}
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cols}, auto)`,
                    columnGap: 4,
                }}
                form={form}
            >
                {children}
            </AntForm>
        </div>
    )
}

const Item = (props: FormItemProps) => {
    const { colSpan, rowSpan, style, br, labelWidth, ...restProps } = props

    const cleanMarginBottom: React.CSSProperties = {}
    if (!props.name && !props.label) {
        cleanMarginBottom.marginBottom = 0
    }
    const colSpanTemp = colSpan === undefined ? 'auto' : colSpan
    const rowSpanTemp = rowSpan === undefined ? 'auto' : rowSpan
    let gridColumn;
    if (colSpan) gridColumn = `auto / span ${colSpanTemp}`
    if (br) gridColumn = '1/ auto'
    if (colSpan && br) gridColumn = `1/ span ${colSpanTemp}`

    return (
        <AntForm.Item
            style={{
                ...cleanMarginBottom,
                ...style,
                gridColumn,
                gridRow: `auto / span ${rowSpanTemp}`,
                '--label-width': labelWidth && `${labelWidth}`
            } as unknown as React.CSSProperties}
            {...restProps}
        />
    )
}
Form.Item = Item
