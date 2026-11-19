import React, { createRef, MutableRefObject } from 'react'
import {
    Column,
    FormatterProps,
    HeaderRendererProps,
    EditorProps,
} from 'react-data-grid-temp'
import { RightOutlined, DownOutlined } from '@ant-design/icons'

import { classPrefix } from '../../utils'
import { Input, Checkbox } from '../../index'
import { Row, TableProps } from '../type'
import { DefaultEditor } from '../editor/DefaultEditor'
import { MultipleSelectColumn } from './MultipleSelectColumn'
import { TableStore, useStore } from '../store'
import { selectionColumn, expandableColumn } from './layout'

const tableClassPrefix = `${classPrefix}-table`

const createColumnRenderer = (store: TableStore) => {
    const current = {
        node: undefined as React.ComponentType<any> | undefined,
        rowKey: '$index',
        rowEditing: false,
        render: (_props: FormatterProps): JSX.Element => <></>,
    }
    const Editor = React.forwardRef<any, EditorProps<any, any, unknown>>((props, ref) => (
        <DefaultEditor
            ref={ref}
            node={current.node!}
            extProps={props}
            rowKey={current.rowKey}
            onValueChange={current.rowEditing ? value => {
                store.editRow(props.row, { [props.column.key]: value })
            } : undefined}
        />
    ))
    const Formatter = (props: FormatterProps) => current.render(props)
    return { current, Editor, Formatter, ref: createRef<any>() }
}

const columnRenderers = new WeakMap<TableStore, Map<string, ReturnType<typeof createColumnRenderer>>>()

export const preFormatColumn = (
    store: TableStore,
    tableProps: TableProps,
    refs: {name: string, value: MutableRefObject<any>}[]
) => {
    let renderers = columnRenderers.get(store)
    if (!renderers) {
        renderers = new Map()
        columnRenderers.set(store, renderers)
    }
    const columns: Column<Row, unknown>[] = store.columns.filter(
        column => store.visibleColumns?.includes(column.name)
    ).map((element => {
        const { align: colAlign = 'left'} = element
        let bodyTextAlign: 'left' | 'right' | 'center' = 'left'
        let headerTextAlign: 'left' | 'right' | 'center' = 'left'
        const aligns = colAlign.split('|');
        if (aligns.length >= 2) {
            headerTextAlign = aligns[0] as 'left' | 'right' | 'center'
            bodyTextAlign = aligns[1] as 'left' | 'right' | 'center'
        } else if (['left', 'right', 'center'].includes(colAlign)) {
            bodyTextAlign = colAlign as 'left' | 'right' | 'center'
            headerTextAlign = colAlign as 'left' | 'right' | 'center'
        }
        const {
            name,
            title,
            editor,
            editable,
            formatter,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            align,
            headerRenderer = ({ column }: HeaderRendererProps<Row, unknown>) => (
                <div style={{ textAlign: headerTextAlign }}>{column.name}</div>
            ),
            formatter1,
            ...restProps
        } = element


        let renderer = renderers!.get(name)
        if (!renderer) {
            renderer = createColumnRenderer(store)
            renderers!.set(name, renderer)
        }
        renderer.current.node = editable ? editor || Input : undefined
        renderer.current.rowKey = tableProps.rowKey || '$index'
        renderer.current.rowEditing = tableProps.editorMode?.type === 'ROW'
        const Editor = renderer.current.node ? renderer.Editor : undefined

        const getFormat = () => {
            let format = (cellProps: FormatterProps) => (
                <div
                    className={`${tableClassPrefix}-cell`}
                    style={{
                        textAlign: bodyTextAlign,
                    }}>
                    {cellProps.row[cellProps.column.key]}
                </div>
            )
            const Formatter = formatter
            if (Formatter) {
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

            const colRef = renderer!.ref
            refs.push({
                name: element.name,
                value: colRef
            })
            if (tableProps.editorMode?.type === 'ROW' && Editor) {
                format = (cellProps: FormatterProps) => {
                    let tempFormatter = cellProps.row[cellProps.column.key]
                    if (Formatter != null) {
                        tempFormatter = <Formatter {...cellProps} />
                    }
                    return (
                        <div
                            className={`${tableClassPrefix}-cell`}
                            style={{
                                textAlign: bodyTextAlign,
                            }}>
                            {
                                cellProps.row[tableProps.rowKey!] !== tableProps.editorMode?.rowId ? (
                                    tempFormatter
                                ) : (
                                    <Editor
                                        ref={colRef}
                                        value={cellProps.row[cellProps.column.key]}
                                        column={cellProps.column}
                                        row={cellProps.row}
                                        height={29}
                                        onCommit={() => {
                                            const values = colRef.current?.getValue?.()
                                            if (values) store.editRow(cellProps.row, values)
                                        }}
                                        onCommitCancel={() => {
                                        }}
                                        onOverrideKeyDown={() => {
                                        }}
                                    />
                                )}
                        </div>
                    )
                }
                return format
            }

            return format
        }

        const getEditorCol = () => {
            if (tableProps.editorMode?.type === 'ROW') {
                return undefined
            }
            return Editor
        }

        renderer.current.render = getFormat()

        const tempCol = {
            key: name,
            name: title,
            resizable: true,
            formatter: renderer.Formatter,
            selectCell: tableProps.editorMode?.type !== 'ROW',
            editable: tableProps.editorMode?.type === 'ROW' ? false : editable,
            headerRenderer,
            editor: getEditorCol(),
            render: formatter1,
            ...restProps,
        }

        delete tempCol.render
        return tempCol
    }))
    if (tableProps.selectBox !== 'none') {
        const select: Column<Row, unknown> = {
            ...selectionColumn,
            formatter: tableProps.selectRenderer ?? MultipleSelectColumn,
            headerRenderer: tableProps.selectBox === 'multiple' ? () => {
                const SelectHeaderRenderer = tableProps.selectHeaderRenderer || Checkbox
                return (
                    <SelectHeaderRenderer
                        checked={(
                            store.selectedRows.size === store.datas.length
                            &&
                            store.datas.length !== 0
                        )}
                        onChange={e => {
                            const selectKeys = new Set<Row[keyof Row]>()
                            if (e.target.checked) {
                                store.datas.forEach((ele: any) => {
                                    const value = ele[tableProps.rowKey!] as Row[keyof Row]
                                    selectKeys.add(value)
                                })
                            }
                            tableProps?.onSelectedRowsChange?.(selectKeys)
                            store.setSelectedRows(selectKeys)
                        }}
                    />
                )
            } : () => {
                if (tableProps.selectHeaderRenderer ) {
                    const SelectHeaderRenderer = tableProps.selectHeaderRenderer
                    return <SelectHeaderRenderer />
                }
                return null
            },
        }
        columns.splice(0, 0, select)
    }

    if (tableProps.expandable?.expandedRowRender) {
        const expandable: Column<Row, unknown> = {
            ...expandableColumn,
            formatter: formatterProps => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const globalStore = useStore()
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const Icon = globalStore.expandedRowNumber === formatterProps.rowIdx ? DownOutlined : RightOutlined
                const nodeIcon = (
                    <Icon
                        style={{
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            // 要添加的条目数
                            const height = tableProps.expandable?.height || tableProps.rowHeight! * 6
                            const addRowCount = Math.ceil(height / tableProps.rowHeight!)
                            if (globalStore.expandedRowNumber === formatterProps.rowIdx ){
                                globalStore.setExpandedRowNumber(-1, addRowCount)
                            }else {
                                globalStore.setExpandedRowNumber(formatterProps.rowIdx, addRowCount)
                            }
                        }}
                    />
                )
                const isRowExpandable = tableProps.expandable?.rowExpandable?.(formatterProps.row)
                if (
                    isRowExpandable || isRowExpandable === undefined
                ){
                    return nodeIcon;
                }
                return null;
            }
        }
        columns.splice(0, 0, expandable)
    }
    return columns
}
