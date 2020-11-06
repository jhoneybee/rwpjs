import React, { useRef, useEffect, isValidElement } from 'react'
import { Form as AntForm } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormProps, FormItemProps } from '../interface'
import { isArray } from 'lodash'

export const Form = (props: FormProps) => {
    const { cols = 5, form: propsForm, children, ...restProps } = props
    const [form] = useForm()
    if (propsForm){
        propsForm.current = form
    }

    let isEnableLabelWidth = false;
    if (isArray(children)) {
        children.some(ele => {
            if (isValidElement(ele) && ele.props.labelWidth) {
                isEnableLabelWidth = true
                return true
            }
            return false
        })
    }else if (isValidElement(children)) {
        if (children.props.labelWidth) {
            isEnableLabelWidth = true
            return true
        }
    }

    const formRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
      if (formRef.current) {
        if (isEnableLabelWidth) {
            const antFormItems  = formRef.current.querySelectorAll('.ant-form-item')
            const itemLabels = formRef.current.querySelectorAll('.ant-form-item-label')
            const itemControls = formRef.current.querySelectorAll('.ant-form-item-control')

            itemLabels.forEach((formItemLabel, index) => {
                const labelWidth = antFormItems[index].getAttribute('data-label-width')
                if (labelWidth) {
                    formItemLabel.setAttribute('style', `width: ${labelWidth}`);
                    const className = formItemLabel.getAttribute('class')?.replace('ant-col', '')
                    formItemLabel.setAttribute('class', className!);
                }
            })

            
            itemControls.forEach((itemControl, index) => {
                const labelWidth = antFormItems[index].getAttribute('data-label-width')
                if (labelWidth) {
                    const className = itemControl.getAttribute('class')?.replace('ant-col', '')
                    itemControl.setAttribute('class', className!);
                }
            })
            
            antFormItems.forEach(items => {
                const labelWidth = items.getAttribute('data-label-width')
                if (labelWidth) {
                    const className = items.getAttribute('class')?.replace('ant-row', '')
                    items.setAttribute('class', className!);
                    const styles = items.getAttribute('style') || ''
                    items.setAttribute('style',styles.concat('display: flex;'))
                }
            })
        }
      }
    }, [formRef])


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
                gridRow: `auto / span ${rowSpanTemp}`
            }}
            data-label-width={labelWidth}
            {...restProps}
        />
    )
}
Form.Item = Item
