import React, { ReactNode } from 'react';
import { Form as AntForm } from 'antd';
import { isArray, cloneDeep } from 'lodash'
import { useForm } from 'antd/lib/form/Form';
import { generate } from 'shortid'
import { FormProps, FormItemProps } from '../interface'

export const Form = (props: FormProps) => {
    const { cols = 5, form: propsForm, children, ...restProps } = props
    const [form] = useForm()
    if (propsForm){
        propsForm.current = form
    }
    const items: ReactNode[] = []
    if (isArray(children)) {
        const cells: ReactNode[] = []
        let count: number = 0
        children.forEach(item => {
            const { br, colSpan = 1, rowSpan } = item.props
            cells.push(
                <td
                    key={generate()}
                    colSpan={colSpan}
                    rowSpan={rowSpan}
                >
                    {item}
                </td>
            )
            count += colSpan
            if (count === cols || br) {
                items.push(<tr key={generate()}>{cloneDeep(cells)}</tr>)
                cells.splice(0)
                count = 0
            }
        })
    }

    const colsNode: ReactNode[] = []
    for (let i = 0; i < cols; i += 1) {
        colsNode.push(<th key={generate()} aria-label="th" style={{ width: `${Math.round(1 / cols * 10000) / 100.00}%` }} />)
    }
    return (
        <AntForm
            {...restProps}
            form={form}
        >
            <table
                style={{
                    borderCollapse: 'separate',
                    borderSpacing: '8px 0px',
                }}
            >
                <tbody>
                <tr>
                    <>
                        {colsNode}
                    </>
                </tr>
                {items}
                </tbody>
            </table>
        </AntForm>
    )
}

const Item = (props: FormItemProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { colSpan, rowSpan, style, br, ...restProps } = props

    const cleanMarginBottom: React.CSSProperties = {}
    if (!props.name && !props.label) {
        cleanMarginBottom.marginBottom = 0
    }
    return (
        <AntForm.Item
            style={{
                ...cleanMarginBottom,
                ...style,
            }}
            {...restProps}
        />
    )
}
Form.Item = Item
