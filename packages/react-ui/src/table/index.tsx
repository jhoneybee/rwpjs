import React, {
    useEffect,
    useRef,
    useReducer,
    Dispatch,
    useImperativeHandle,
    useState,
    useMemo,
} from 'react'
import ReactDataGrid, {
    EditorProps,
    RowRendererProps,
    Row,
    DataGridHandle,
    Column,
    FormatterProps,
    HeaderRendererProps,
    SortColumn,

} from 'react-data-grid-temp'

import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { cloneDeep, isFunction } from 'lodash'
import { TableProps, TableHandle } from '../interface'
import { reducer, initialState, State, Action } from './reducer'
import { Input } from '../index'
import { MultipleSelectColumn } from './column/MultipleSelectColumn'
import { DefaultEditor } from './editor/DefaultEditor'
import { DropdownRow } from './row/DropdownRow'
import { GroupRow } from './row/GroupRow'

import 'react-data-grid-temp/dist/react-data-grid.css'
import './style/index.less'

interface IContextProps {
    state: State<any>;
    dispatch: Dispatch<Action<any>>;
}

export const TableContext = React.createContext({} as IContextProps);

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

    /**
     * 装载分组数据
     */
    const loadDataGroupFun = async (param: Object) => {
        const res = props.loadData(1, props.pageSize!, {
            ...props.params,
            ...param,
        })
        const resp = await (res as PromiseLike<{ total: number, datas: T[] }>)

        const respGrouMap = new Map<string, T[]>()

        resp.datas.forEach((ele: any) => {
            let key = ''
            props.enableGroupColumn!.forEach(groupColumn => {
                key += `${ele[groupColumn]},`
            })
            key = key.substr(0, key.length - 1)

            const value = respGrouMap.get(key)
            if (value) {
                value.push(ele)
            } else {
                respGrouMap.set(key, [ele])
            }
        })

        let groupDatas: any[] = []
        Array.from(respGrouMap.keys()).forEach(key => {
            const data = respGrouMap.get(key)!
            groupDatas.push({
                $type: 'group',
                title: key,
                count: data.length,
            })
            groupDatas = groupDatas.concat(data)
        })

        await dispatch({
            type: 'SET_RELOAD_ROWS',
            payload: {
                total: resp.total,
                datas: groupDatas,
            },
        })
        gridRef.current!.scrollToRow(0)
    }

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

    useEffect(() => {
        if (props.enableGroupColumn && props.enableGroupColumn.length > 0) {
            loadDataGroupFun(props.params!)
        } else if (props.enableGroupColumn && props.enableGroupColumn.length === 0) {
            reloadFun(props.params!)
        }
    }, [props.enableGroupColumn])


    const isEnableGroupColumn = () => props.enableGroupColumn && props.enableGroupColumn.length > 0

    const getColumns = () => {
        const columns: Column<T, unknown>[] = props.columns.map((element => {
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
                <div style={{ textAlign: bodyTextAlign }}>{
                    cellProps.row[cellProps.column.key]
                }</div>
            )
            if (formatter) {
                const Formatter = formatter
                format = (cellProps: FormatterProps) => (
                    <div style={{ textAlign: bodyTextAlign }}><Formatter {...cellProps} /></div>
                )
            }
            return {
                key: name,
                name: title,
                resizable: true,
                formatter: format,
                editable,
                headerRenderer: ({ column }: HeaderRendererProps<T, unknown>) => (
                    <div style={{ textAlign: headerTextAlign }}>{column.name}</div>
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
                        <DefaultEditor
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
                frozen: true,
                maxWidth: 35,
                formatter: MultipleSelectColumn,
            }
            columns.splice(0, 0, select)
        }

        return columns
    }
    useEffect(() => {
        if (table && gridRef.current) {
            const tempTable: TableHandle<any> = {
                scrollToColumn: gridRef.current.scrollToColumn,
                scrollToRow: gridRef.current.scrollToRow,
                selectCell: gridRef.current.selectCell,
                rightContext: () => ({
                    row: state.contextMenu!.row as T,
                    rowIdx: state.contextMenu!.rowIdx as number,
                    column: state.contextMenu!.column as Column<T>,
                }),
                getDataSource: () => cloneDeep(state.datas as T[]),
                getSelect: () => selectedRows,
                setSelect: (selects: Set<T[keyof T]>) => {
                    setSelectedRows(selects)
                },
                update: (record, filter) => {
                    const newData = (state.datas as T[]).map((ele: T) => {
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
                    // 如果是分组状态,禁止操作
                    if (isEnableGroupColumn()) return;
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
            if (isFunction(table)) {
                table(tempTable)
            } else {
                table.current = tempTable
            }
        }
    }, [state.contextMenu, state.datas, selectedRows])

    const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
         // 如果是分组状态,禁止操作
        if (isEnableGroupColumn()) return
        const target = e.currentTarget
        if (
            target.scrollTop + target.clientHeight + 2 > target.scrollHeight
            &&
            state.datas.length > 0
        ) {
            scrollTimeOut = setTimeout(() => {
                loadDataFun()
            }, 80);
        }
    }
    const [sortDirection, setSortDirection] = useState<SortColumn[]>([]);

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
                        sortDirection={sortDirection}
                        onSort={(columnKey, direction) => {
                            // 如果是分组状态,禁止操作
                            if (isEnableGroupColumn()) return
                            const newSortDirection = [];
                            let existence = false;
                            sortDirection.forEach(ele => {
                              if (ele.columnKey === columnKey) {
                                existence = true;
                                newSortDirection.push({
                                  sortDirection: direction,
                                  columnKey,
                                });
                              } else {
                                newSortDirection.push({
                                  sortDirection: ele.sortDirection,
                                  columnKey: ele.columnKey,
                                });
                              }
                            });
                            if (!existence) {
                              newSortDirection.push({
                                sortDirection: direction,
                                columnKey,
                              });
                            }
                            setSortDirection(newSortDirection);
                            if (props.onSort) {
                                props.onSort(newSortDirection)
                            }
                        }}
                        enableCellDragAndDrop={props.enableCellDragAndDrop}
                        selectedRows={selectedRows}
                        onSelectedRowsChange={setSelectedRows}
                        onRowClick={props.onRowClick}
                        rowRenderer={(rowProps: RowRendererProps<T, unknown>) => {
                            if (isEnableGroupColumn()) {
                                return (
                                    <GroupRow
                                        rowProps={rowProps}
                                        contextMenu={props.contextMenu}
                                    />
                                )
                            }

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
                        onRowsUpdate={e => {
                            const onCommit = () => {
                                dispatch({
                                    type: 'SET_OP_DATA',
                                    payload: e,
                                })
                            }
                            props.onRowsUpdate!(e, onCommit)
                        }}
                    />
                </Spin>
            </TableContext.Provider>
        ), [
        props.contextMenu,
        props.columns,
        props.enableCellCopyPaste,
        props.enableCellDragAndDrop,
        props.enableGroupColumn,
        state.loading,
        state.datas,
        selectedRows,
        sortDirection,
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
