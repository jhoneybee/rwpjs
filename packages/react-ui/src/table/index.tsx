import React, {
    useEffect,
    useRef,
    useReducer,
    Dispatch,
    useImperativeHandle,
    useState,
    useContext,
    useMemo,
} from 'react'
import ReactDataGrid, {
    EditorProps,
    Cell,
    RowRendererProps,
    Row,
    DataGridHandle,
    Column,
    FormatterProps,
    HeaderRendererProps,

} from 'react-data-grid-temp'

import { Spin, Dropdown } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { cloneDeep } from 'lodash'
import { TableProps, OverlayFunc } from '../interface'
import { reducer, initialState, State, Action } from './reducer'
import { Input, Checkbox } from '../index'


import 'react-data-grid-temp/dist/react-data-grid.css'
import './style/index.less'

interface IContextProps {
    state: State<any>;
    dispatch: Dispatch<Action<any>>;
}

const TableContext = React.createContext({} as IContextProps);

interface CustomEditorProps {
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
        getPopupContainer={(triggerNode: HTMLElement) => triggerNode!.parentElement!}
    >
        <TempRow {...rowProps} />
    </Dropdown>
)

const MultipleSelectColumn = (props : FormatterProps<any, unknown>) => (
    <Checkbox
        checked={props.isRowSelected}
        onChange={e => {
            const { checked } = e.target
            props.onRowSelectionChange(checked, (e.nativeEvent as MouseEvent).shiftKey)
        }}
    />
)

export function Table<T>(props: TableProps<T>) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [selectedRows, setSelectedRows] = useState(() => new Set<T[keyof T]>());
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
        const resp = await (res as PromiseLike<{ total: number, datas: T[] }>)
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

    // 防止timeout内存溢出
    let scrollTimeOut: NodeJS.Timeout;
    useEffect(() => () => {
        if (scrollTimeOut) {
            clearTimeout(scrollTimeOut)
        }
    })

    useEffect(() => {
        // 装载数据
        if (enableInitLoadData) loadDataFun()
    }, [])


    const reloadFun = async (param: Object) => {
        await dispatch({
            type: 'SET_LOADING',
            payload: {
                loading: true,
            },
        })
        const res = props.loadData(1, props.pageSize!, {
            ...props.params,
            ...param,
        })
        const resp = await (res as PromiseLike<{ total: number, datas: T[] }>)
        await dispatch({
            type: 'SET_RELOAD_ROWS',
            payload: resp,
        })
        gridRef.current!.scrollToRow(0)
    }

    const getColumns = () => {
        const columns: Column<T, unknown>[] = props.columns.map((element => {
            const { name, title, editor, editable, formatter, align = 'left', ...restProps } = element
            const TempEditor = editable ? editor || Input : undefined
            let format = (cellProps: FormatterProps) => (
                <div style={{ textAlign: align }}>{
                    cellProps.row[cellProps.column.key]
                }</div>
            )
            if (formatter) {
                const Formatter = formatter
                format = (cellProps: FormatterProps) => (
                    <div style={{ textAlign: align }}><Formatter {...cellProps} /></div>
                )
            }
            return {
                key: name,
                name: title,
                resizable: true,
                formatter: format,
                editable,
                headerRenderer: ({ column }: HeaderRendererProps<T, unknown>) => (
                    <div style={{ textAlign: align }}>{column.name}</div>
                ),
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
                    return (
                        <CustomEditor
                            ref={domRef}
                            node={TempEditor}
                            extProps={eProps}
                        />
                    )
                }) as React.ComponentType<EditorProps<T[keyof T], T, unknown>> : undefined,
                ...restProps,
            }
        }))
        if (props.enableSelectBox === 'multiple') {
            const select: Column<T, unknown> = {
                key: '$select',
                name: '',
                maxWidth: 35,
                formatter: MultipleSelectColumn,
            }
            columns.splice(0, 0, select)
        }

        return columns
    }
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
                getDataSource: () => cloneDeep(state.datas),
                update: (record, filter) => {
                    const newData = state.datas.map((ele: any) => {
                        if (filter(ele)) {
                            return { ...ele, ...record }
                        }
                        return ele
                    })
                    dispatch({
                        type: 'SET_UPDATE_ROWS',
                        payload: newData,
                    })
                },
                reload: (param: Object) => {
                    reloadFun(param)
                },
                del: filter => {
                    const newData: T[] = []
                    state.datas.forEach((element: T) => {
                        if (!filter(element)) {
                            newData.push(element)
                        }
                    });
                    dispatch({
                        type: 'SET_UPDATE_ROWS',
                        payload: newData,
                    })
                },
            }
        }
    }, [state.contextMenu, state.datas])

    const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const target = e.currentTarget
        if (
            target.scrollTop + target.clientHeight + 2 > target.scrollHeight
            &&
            state.datas.length > 0
        ) {
            const rowLength = state.datas.length
            scrollTimeOut = setTimeout(() => {
                loadDataFun().then(() => {
                    if (gridRef.current) gridRef.current.scrollToRow(rowLength)
                })
            }, 80);
        }
    }

    return useMemo(() => (
            <TableContext.Provider value={{ dispatch, state }}>
                <Spin
                    spinning={state.loading}
                    indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                >
                    <ReactDataGrid
                        ref={gridRef}
                        width={props.width}
                        height={props.height}
                        columns={getColumns()}
                        rows={state.datas as T[]}
                        onScroll={onScroll}
                        enableCellAutoFocus
                        rowKey={props.rowKey}
                        enableCellCopyPaste={props.enableCellCopyPaste}
                        sortDirection={props.sortDirection}
                        enableCellDragAndDrop={props.enableCellDragAndDrop}
                        selectedRows={selectedRows}
                        onSelectedRowsChange={setSelectedRows}
                        rowRenderer={(rowProps: RowRendererProps<T, unknown>) => {
                            if (props.contextMenu) {
                                return (
                                    <DropdownRow
                                        rowProps={rowProps}
                                        contextMenu={props.contextMenu}
                                    />
                                )
                            }
                            return <Row {...rowProps} />
                        }}
                        onSort={props.onSort}
                        onRowsUpdate={e => {
                            dispatch({
                                type: 'SET_OP_DATA',
                                payload: e,
                            })
                        }}
                    />
                </Spin>
            </TableContext.Provider>
        ), [
        props.sortDirection,
        props.contextMenu,
        props.columns,
        props.enableCellCopyPaste,
        props.enableCellDragAndDrop,
        state.loading,
        state.datas,
        selectedRows,
    ])
}

Table.defaultProps = {
    pageSize: 50,
    params: {},
    sortDirection: [],
    enableInitLoadData: true,
    enableCellCopyPaste: false,
    enableCellAutoFocus: true,
    enableCellDragAndDrop: true,
    onRowsUpdate: async () => true,
    enableSelectBox: 'none',
    onSort: () => { },
}
