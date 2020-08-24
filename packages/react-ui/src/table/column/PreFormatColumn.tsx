import React, { useImperativeHandle, useRef } from 'react'
import {
    Column,
    FormatterProps,
    HeaderRendererProps,
    EditorProps,
} from 'react-data-grid-temp'
import { classPrefix } from '../../utils'
import { Input, Checkbox } from '../../index'
import { Row } from '../type'
import { DefaultEditor } from '../editor/DefaultEditor'
import { MultipleSelectColumn } from './MultipleSelectColumn'
import { TableStore } from '../store'

const tableClassPrefix = `${classPrefix}-table`

export const usePreFormatColumn = (store: TableStore,selectBox: string, rowKey: string) => {
    const columns: Column<Row, unknown>[] = store.columns
    .filter(column => store.visibleColumns?.includes(column.name))
    .map((element => {
        const { name, title, editor, editable, formatter, align = 'left', ...restProps } = element
        const TempEditor = editable ? editor || Input : undefined

        let bodyTextAlign: 'left' | 'right' | 'center' = 'left'
        let headerTextAlign: 'left' | 'right' | 'center' = 'left'
        const aligns = align.split('|');
        if (aligns.length >= 2) {
            headerTextAlign = aligns[0] as 'left' | 'right' | 'center'
            bodyTextAlign = aligns[1] as 'left' | 'right' | 'center'
        } else if (['left', 'right', 'center'].includes(align)) {
            bodyTextAlign = align as 'left' | 'right' | 'center'
            headerTextAlign = align as 'left' | 'right' | 'center'
        }

        let format = (cellProps: FormatterProps) => (
            <div
                className={`${tableClassPrefix}-cell`}
                style={{
                    textAlign: bodyTextAlign,
                }}>
                {cellProps.row[cellProps.column.key]}
            </div>
        )
        if (formatter) {
            const Formatter = formatter
            // 如果字符串不超过对应的长度,则使用默认的div
            format = (cellProps: FormatterProps) => (
                <div
                    className={`${tableClassPrefix}-cell`}
                    style={{
                        textAlign: bodyTextAlign,
                    }}>
                    {
                        cellProps.row.$type ? (
                            cellProps.row[cellProps.column.key]
                        ) : (
                            <Formatter {...cellProps} />
                        )}
                </div>
            )
        }
        return {
            key: name,
            name: title,
            resizable: true,
            formatter: format,
            editable,
            headerRenderer: ({ column }: HeaderRendererProps<Row, unknown>) => (
                <div style={{ textAlign: headerTextAlign }}>{column.name}</div>
            ),
            editor: TempEditor ? React.forwardRef((
                eProps: EditorProps<Row[keyof Row], Row, unknown>,
                ref,
            ) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const domRef = useRef<any>(null);
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useImperativeHandle(ref, () => ({
                    getValue: () => domRef.current.getValue(),
                    getInputNode: () => domRef.current.getInputNode(),
                }))
                return (
                    <DefaultEditor
                        ref={domRef}
                        // @ts-ignore
                        node={TempEditor}
                        extProps={eProps}
                    />
                )
            }) as React.ComponentType<EditorProps<Row[keyof Row], Row, unknown>> : undefined,
            ...restProps,
        }
    }))
    if (selectBox === 'multiple') {
        const select: Column<Row, unknown> = {
            key: '$select',
            name: '',
            frozen: true,
            maxWidth: 35,
            formatter: MultipleSelectColumn,
            headerRenderer: () => (
                <Checkbox
                    checked={(
                        store.selectedRows.size === store.datas.length
                        &&
                        store.datas.length !== 0
                    )}
                    onChange={e => {
                        const selectKeys = new Set<Row[keyof Row]>()
                        if (e.target.checked) {
                            store.datas.forEach((ele: any) => {
                                const value = ele[rowKey!] as Row[keyof Row]
                                selectKeys.add(value)
                            })
                        }
                        store.setSelectedRows(selectKeys)
                    }}
                />
            ),
        }
        columns.splice(0, 0, select)
    }
    return columns
}
