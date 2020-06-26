import React, { useEffect, useRef, useReducer, Dispatch, useImperativeHandle, useState, useContext, useMemo } from 'react'
import ReactDataGrid, { EditorProps, Cell, RowRendererProps, Row, DataGridHandle, Column } from 'react-data-grid'
import { Spin, Dropdown } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { TableProps, OverlayFunc } from '../interface'
import { reducer, initialState, State, Action } from './reducer'
import { Input } from '../index'


import 'react-data-grid/dist/react-data-grid.css'
import './style/index.less'

interface IContextProps{
    state: State<any>;
    dispatch: Dispatch<Action<any>>;
}

const TableContext = React.createContext({} as IContextProps);

interface CustomEditorProps{
    node: React.ReactNode
    extProps: EditorProps<any, any, unknown>
}

const CustomEditor = React.forwardRef((props: CustomEditorProps, ref) => {
    const [value, setValue] = useState(props.extProps.value)
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({
        getValue: () => ({ [props.extProps.column.key]: value }),
        getInputNode: () => inputRef.current,
    }))

    useEffect(() => {
        if (inputRef.current && inputRef.current.focus) {
            inputRef.current.focus()
        }
    }, [])

    // @ts-ignore
    return <props.node
        ref={inputRef}
        style={{ height: props.extProps.height + 2 }}
        value={value}
        onChange={(changeValue: string) => setValue(changeValue)}
    />
})


type DropdownRowProps<T> = {
    contextMenu: React.ReactElement | OverlayFunc
    rowProps: RowRendererProps<any, unknown>
}

// fix: forwardRef 一下，防止antd的Dropdown报错
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TempRow = React.forwardRef((props: RowRendererProps<any, unknown>, ref) => {
    const { dispatch } = useContext(TableContext)
    return (
        <Row
            {...props}
            cellRenderer={cellProps => (
                <Cell
                    {...cellProps}
                    onContextMenu={e => {
                        e.preventDefault()
                        dispatch({
                            type: 'SET_CONTEXTMENU',
                            payload: {
                                row: props.row,
                                rowIdx: props.rowIdx,
                                column: cellProps.column,
                            },
                        })
                    }}
                />
            )}
        />
    )
})

const DropdownRow = ({ rowProps, contextMenu }: DropdownRowProps<any>) => (
    <Dropdown
        overlay={contextMenu}
        trigger={['contextMenu']}
        getPopupContainer={(triggerNode: HTMLElement) => triggerNode!.parentElement! }
    >
        <TempRow {...rowProps} />
    </Dropdown>
)

export function Table<T> (props: TableProps<T>) {
    const [state, dispatch] = useReducer(reducer, initialState);

    /**
     * 装载表格数据
     */
    const loadDataFun = async () => {
        await dispatch({
            type: 'SET_LOADING',
            payload: {
                loading: true,
            },
        })
        const res = props.loadData(state.pageNo, props.pageSize!, props.params!)
        const resp = await (res as PromiseLike<{ total: number, datas: T[]}>)
        await dispatch({
            type: 'SET_ADD_ROWS',
            payload: {
                rows: resp,
                loading: false,
            },
        })
    }
    const gridRef = useRef<DataGridHandle>(null)

    const { table, enableInitLoadData } = props
    useEffect(() => {
        // 装载数据
        if (enableInitLoadData) {
            loadDataFun()
        }
    }, [])

    useEffect(() => {
        if (table && gridRef.current) {
            table.current = {
                scrollToColumn: gridRef.current.scrollToColumn,
                scrollToRow: gridRef.current.scrollToRow,
                selectCell: gridRef.current.selectCell,
                rightContext: () => ({
                    row: state.contextMenu!.row as T,
                    rowIdx: state.contextMenu!.rowIdx as number,
                    column: state.contextMenu!.column as Column<T>,
                }),
            }
        }
    }, [state.contextMenu])

    return useMemo(() => {
        const columns = props.columns.map((element => {
            const { name, title, editor, editable, ...restProps } = element
            const TempEditor = editable ? editor || Input : undefined
            return {
                key: name,
                name: title,
                resizable: true,
                editor: TempEditor ? React.forwardRef((
                    eProps: EditorProps<T[keyof T], T, unknown>,
                    ref,
                ) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const domRef = useRef<any>(null);
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    useImperativeHandle(ref, () => ({
                        getValue: () => domRef.current.getValue(),
                        getInputNode: () => domRef.current.getInputNode(),
                    }))
                    return <CustomEditor ref={domRef} node={TempEditor} extProps={eProps}/>
                }) as React.ComponentType<EditorProps<T[keyof T], T, unknown>> : undefined,
                ...restProps,
            }
        }))
        return (
            <TableContext.Provider value={{ dispatch, state }}>
                <Spin
                    spinning={state.loading}
                    indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                >
                    <ReactDataGrid
                        ref={gridRef}
                        columns={columns}
                        rows={state.datas as T[]}
                        onScroll={e => {
                            const target = e.currentTarget
                            if (
                                target.scrollTop + target.clientHeight + 2 > target.scrollHeight
                                &&
                                state.datas.length > 0
                            ) {
                                const rowLength = state.datas.length
                                loadDataFun().then(() => {
                                    gridRef.current!.scrollToRow(rowLength)
                                })
                            }
                        }}
                        enableCellAutoFocus
                        width={props.width}
                        height={props.height}
                        enableCellCopyPaste={props.enableCellCopyPaste}
                        enableCellDragAndDrop={props.enableCellDragAndDrop}
                        rowRenderer={(rowProps: RowRendererProps<T, unknown>) => {
                            if (props.contextMenu) {
                                return (
                                    <DropdownRow
                                        rowProps={rowProps}
                                        contextMenu={props.contextMenu}
                                    />
                                )
                            }
                            return <Row {...rowProps}/>
                        }}
                        onRowsUpdate={e => {
                            dispatch({
                                type: 'SET_OP_DATA',
                                payload: e,
                            })
                        }}
                    />
                </Spin>
            </TableContext.Provider>
        )
    }, [
        props.contextMenu,
        props.columns,
        props.enableCellCopyPaste,
        props.enableCellDragAndDrop,
        state.loading,
        state.datas,
    ])
}

Table.defaultProps = {
    pageSize: 50,
    params: {},
    enableInitLoadData: true,
    enableCellCopyPaste: true,
    enableCellAutoFocus: true,
    enableCellDragAndDrop: true,
    onRowsUpdate: async () => true,
}
