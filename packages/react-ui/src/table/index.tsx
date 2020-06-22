import React, { useEffect, useRef, useReducer, Dispatch, useImperativeHandle, useState, useContext, useMemo } from 'react'
import ReactDataGrid, { EditorProps, Cell, RowRendererProps, Row, DataGridHandle } from 'react-data-grid'
import { Spin, Dropdown } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { TableProps, OverlayFunc } from '../interface'
import { isPromise } from '../utils'
import { reducer, initialState, State, Action } from './reducer'
import { Input } from '../index'


import 'react-data-grid/dist/react-data-grid.css'
import './style/index.less'

interface IContextProps{
    state: State<any>;
    dispatch: Dispatch<Action<any>>;
}

const TableContext = React.createContext({} as IContextProps);

// 装载数据
const loadDataFun = async (
    pageSize: number,
    param: Object,
    loadData: (
        pageNo: number,
        pageSize: number,
        params: Object,
    ) => PromiseLike<{
        total: number, datas: any[]
    }> | { total: number, datas: any[]},
    dispatch: Dispatch<Action<any>>,
    state: State<any>,
) => {
    await dispatch({
        type: 'SET_LOADING',
        payload: {
            loading: true,
        },
    })
    const res = loadData(state.pageNo, pageSize, param)
    if (isPromise(res)) {
        const resp = await (res as PromiseLike<{ total: number, datas: any[]}>)
        await dispatch({
            type: 'SET_ADD_ROWS',
            payload: {
                rows: resp,
                loading: false,
            },
        })
    } else if (res) {
        await dispatch({
            type: 'SET_ADD_ROWS',
            payload: {
                rows: res as { total: number, datas: any[]},
                loading: false,
            },
        })
    }
}

interface CustomEditorProps{
    node: React.ReactNode
    extProps: EditorProps<any, any, unknown>
}

const CustomEditor = React.forwardRef((props: CustomEditorProps, ref) => {
    const [value, setValue] = useState(props.extProps.value)

    const inputRef = useRef<HTMLElement>(null);
    useImperativeHandle(ref, () => ({
        getValue: () => ({
            [props.extProps.column.key]: value,
        }),
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
        onBlur={() => props.extProps.onCommit()}
        value={value}
        onChange={(changeValue: string) => setValue(changeValue)}
    />
})


type DropdownRowProps<T> = {
    contextMenu: React.ReactElement | OverlayFunc
    rowProps: RowRendererProps<any, unknown>
}

// fix: forwardRef 一下，防止antd的Dropdown报错
const TempRow = React.forwardRef((props: RowRendererProps<any, unknown>) => {
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
    useEffect(() => {
        // 装载数据
        if (props.autoLoadData) {
            loadDataFun(props.pageSize!, props.params!, props.loadData, dispatch, state)
        }
    }, [])

    const gridRef = useRef<DataGridHandle>(null)

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
                        getValue: () => ({
                            [eProps.column.key]: domRef.current.getValue(),
                        }),
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
                        rows={state.rows.datas as T[]}
                        onScroll={e => {
                            const target = e.currentTarget
                            if (
                                target.scrollTop + target.clientHeight + 2 > target.scrollHeight
                                &&
                                state.rows.datas.length > 0
                            ) {
                                const rowLength = state.rows.datas.length
                                loadDataFun(
                                    props.pageSize!,
                                    props.params!,
                                    props.loadData,
                                    dispatch,
                                    state,
                                ).then(() => {
                                    gridRef.current!.scrollToRow(rowLength)
                                })
                            }
                        }}
                        enableCellAutoFocus
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
                            console.log(e)
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
        state.rows,
    ])
}

Table.defaultProps = {
    pageSize: 50,
    params: {},
    autoLoadData: true,
    enableCellCopyPaste: true,
    enableCellAutoFocus: true,
    enableCellDragAndDrop: true,
}
