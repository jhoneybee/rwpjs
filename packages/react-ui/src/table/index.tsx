import React, {
    useEffect,
    useRef,
    useReducer,
    Dispatch,
    useImperativeHandle,
    useState,
    useMemo,
    useCallback,
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

import { cloneDeep, orderBy, ceil } from 'lodash'
import { Progress } from 'antd'
import { compileExpression } from 'filtrex-x'
import { ReloadOutlined } from '@ant-design/icons'
import { TableProps, TableHandle } from '../interface'
import { reducer, initialState, State, Action } from './reducer'
import { Input, Spin, Checkbox } from '../index'
import { MultipleSelectColumn } from './column/MultipleSelectColumn'
import { DefaultEditor } from './editor/DefaultEditor'
import { DropdownRow } from './row/DropdownRow'
import { GroupRow } from './row/GroupRow'
import { classPrefix } from '../utils'
import Search from './plugin/Search'

import 'react-data-grid-temp/dist/react-data-grid.css'
import './style/index.less'

interface IContextProps {
    state: State<any>;
    dispatch: Dispatch<Action<any>>;
}

const tableClassPrefix = `${classPrefix}-table`

export const TableContext = React.createContext({} as IContextProps);

export function Table<T>(props: TableProps<T>) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [selectedRows, setSelectedRows] = useState(() => new Set<T[keyof T]>());
    const [gridRef, setGridRef] = useState<DataGridHandle | null>(null)
    const setRef = useCallback(node => {
        if (node !== null) {
            setGridRef(node);
        }
    }, []);

    // 查询的数据
    const beforeDatas = useRef<T[]>([])

    const { table, enableInitLoadData } = props

    // 防止timeout内存溢出
    let scrollTimeOut: NodeJS.Timeout;

    const updateDataSource = useRef<T[]>(state.datas as T[])

    // 旧的分组数据
    const oldGroupData = useRef<{
        datas: T[]
    } | null>(null)

    const clearGroup = () => {
        oldGroupData.current = null
    }
    /**
     * 装载分组数据
     */
    const groupDataFun = async () => {
        if (oldGroupData.current === null) {
            if (gridRef) {
                gridRef.scrollToRow(0)
            }
            oldGroupData.current = {
                datas: cloneDeep(state.datas) as T[],
            }
        }
        const { groupColumn = [] } = props
        const groupDataOld = orderBy(
            oldGroupData.current.datas,
            groupColumn,
            groupColumn.map(() => 'asc'),
        )
        const groupMap = new Map<string, T[]>()
        groupDataOld.forEach((ele: any) => {
            let key = ''
            props.groupColumn!.forEach(group => {
                key += `${ele[group]},`
            })
            key = key.substr(0, key.length - 1)

            const value = groupMap.get(key)
            if (value) {
                value.push(ele)
            } else {
                groupMap.set(key, [ele])
            }
        })
        let groupDatas: any[] = []
        Array.from(groupMap.keys()).forEach(key => {
            const data = groupMap.get(key)!
            groupDatas.push({
                $type: 'group',
                title: key,
                count: data.length,
            })
            if ((state.groupExpanded as string[]).includes(key)) {
                groupDatas = groupDatas.concat(data)
            }
        })
        await dispatch({
            type: 'SET_RELOAD_ROWS',
            payload: {
                total: state.total,
                datas: groupDatas,
            },
        })
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
        updateDataSource.current = resp.datas
        if (gridRef) {
            gridRef.scrollToRow(0)
        }
    }

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

    useEffect(() => () => {
        if (scrollTimeOut) {
            clearTimeout(scrollTimeOut)
        }
    })

    useEffect(() => {
        // 装载数据
        if (enableInitLoadData) loadDataFun()
    }, [])

    useEffect(() => {
        if (props.groupColumn && props.groupColumn.length > 0) {
            groupDataFun()
        } else if (props.groupColumn && props.groupColumn.length === 0) {
            if (oldGroupData.current) {
                const { datas } = oldGroupData.current
                dispatch({
                    type: 'SET_RELOAD_ROWS',
                    payload: {
                        total: state.total,
                        datas,
                    },
                })
                dispatch({
                    type: 'SET_GROUP_EXPANDED_CLEAN',
                })
                // 清除缓存数据 对应的groupDataFun方法使用缓存
                clearGroup()
            }
        }
    }, [props.groupColumn, state.groupExpanded])

    const isEnableGroupColumn = () => props.groupColumn && props.groupColumn.length > 0
    // 是否禁用加载数据
    const isDisableLoadData = () => {
        if (isEnableGroupColumn()) return true
        if (beforeDatas.current.length > 0) return true
        return false
    }

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
                            // @ts-ignore
                            node={TempEditor}
                            extProps={eProps}
                        />
                    )
                }) as React.ComponentType<EditorProps<T[keyof T], T, unknown>> : undefined,
                ...restProps,
            }
        }))
        if (props.selectBox === 'multiple') {
            const select: Column<T, unknown> = {
                key: '$select',
                name: '',
                frozen: true,
                maxWidth: 35,
                formatter: MultipleSelectColumn,
                headerRenderer: () => (
                    <Checkbox
                        checked={state.selectAll}
                        onChange={e => {
                            const selectKeys = new Set<T[keyof T]>()
                            if (e.target.checked) {
                                state.datas.forEach((ele: any) => {
                                    const value = ele[props.rowKey] as T[keyof T]
                                    selectKeys.add(value)
                                })
                            }
                            setSelectedRows(selectKeys)
                            dispatch({
                                type: 'SET_SELECT_ALL',
                                payload: e.target.checked,
                            })
                        }}
                    />
                ),
            }
            columns.splice(0, 0, select)
        }

        return columns
    }

    useEffect(() => {
        if (table && gridRef) {
            const tempTable: TableHandle<any> = {
                scrollToColumn: gridRef.scrollToColumn,
                scrollToRow: gridRef.scrollToRow,
                selectCell: gridRef.selectCell,
                rightContext: () => ({
                    row: state.contextMenu!.row as T,
                    rowIdx: state.contextMenu!.rowIdx as number,
                    column: state.contextMenu!.column as Column<T>,
                }),
                getDataSource: () => updateDataSource.current as any[],
                getSelect: () => selectedRows,
                setSelect: (selects: Set<T[keyof T]>) => {
                    setSelectedRows(selects)
                },
                update: change => {
                    const newData = (state.datas as T[]).map((ele: T) => change(ele) || ele)
                    updateDataSource.current = newData
                    dispatch({
                        type: 'SET_UPDATE_ROWS',
                        payload: newData,
                    })
                },
                reload: (param: Object) => {
                    // 如果是分组状态,禁止操作
                    if (isDisableLoadData()) return;
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
            table.current = tempTable
        }
    }, [state.contextMenu, state.datas, selectedRows, gridRef])

    const beforeScrollHeight = useRef<number>(0)
    const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const target = e.currentTarget
        // 如果是分组状态,禁止操作
        if (isDisableLoadData()) return
        if (
            // 判断是否滚动到底部
            target.scrollHeight - target.scrollTop <= target.clientHeight + 2
            &&
            // 判断数据大于0
            state.datas.length > 0
            &&
            beforeScrollHeight.current !== target.scrollHeight
        ) {
            scrollTimeOut = setTimeout(() => {
                loadDataFun()
            }, 200);
            beforeScrollHeight.current = target.scrollHeight
        }
    }
    const [sortDirection, setSortDirection] = useState<SortColumn[]>([]);

    const divRef = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState<number>(props.width || 0)
    useEffect(() => {
        const interval = setInterval(() => {
            if (divRef.current && !props.width) {
                setWidth(divRef.current.offsetWidth)
            }
        }, 400)
        return () => {
            clearInterval(interval)
        }
    }, [])

    return useMemo(() => {
        const rdg = (
            <>
                <ReactDataGrid
                    ref={setRef}
                    width={width}
                    height={props.height}
                    columns={getColumns()}
                    rows={state.datas as T[]}
                    onScroll={onScroll}
                    rowKey={props.rowKey}
                    enableCellCopyPaste={props.enableCellCopyPaste}
                    sortDirection={sortDirection}
                    onSort={(columnKey, direction) => {
                        // 如果是分组状态,禁止操作
                        if (isDisableLoadData()) return
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
                    onSelectedRowsChange={select => {
                        dispatch({
                            type: 'SET_SELECT_ALL',
                            payload: select.size === state.datas.length,
                        })
                        setSelectedRows(select)
                    }}
                    rowClass={props.rowClass}
                    onRowClick={props.onRowClick}
                    rowRenderer={(rowProps: RowRendererProps<T, unknown>) => {
                        if (isEnableGroupColumn()) {
                            return (
                                <GroupRow
                                    columns={props.columns}
                                    rowProps={rowProps}
                                    contextMenu={props.overlay}
                                    groupRenderer={props.groupRenderer}
                                />
                            )
                        }

                        if (props.overlay) {
                            return (
                                <DropdownRow
                                    columns={props.columns}
                                    rowProps={rowProps}
                                    contextMenu={props.overlay}
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
            </>
        )

        const percent = Number.parseInt(
            (ceil(state.datas.length / state.total, 2) * 100).toFixed(),
            10)

        const search = (
            <div
                className={`${tableClassPrefix}-footer`}
            >
                <Search
                    columns={props.columns}
                    onChange={async value => {
                        if (beforeDatas.current.length === 0) {
                            beforeDatas.current = cloneDeep(state.datas) as T[]
                        }
                        if (value === '' && beforeDatas.current.length !== 0) {
                            await dispatch({
                                type: 'SET_RELOAD_ROWS',
                                payload: {
                                    total: state.total,
                                    datas: beforeDatas.current,
                                },
                            })
                            beforeDatas.current = []
                        }
                    }}
                    onPressEnter={async value => {
                        if (value === '' && beforeDatas.current.length !== 0) {
                            await dispatch({
                                type: 'SET_RELOAD_ROWS',
                                payload: {
                                    total: state.total,
                                    datas: beforeDatas.current,
                                },
                            })
                            beforeDatas.current = []
                        } else {
                            try {
                                let realValue = value
                                props.columns.forEach(col => {
                                    realValue = realValue.replace(new RegExp(col.title, 'g'), col.name)
                                })
                                const filter = compileExpression(realValue)
                                if (filter) {
                                    let filterData = state.datas
                                    if (beforeDatas.current.length > 0) {
                                        filterData = beforeDatas.current
                                    }
                                    await dispatch({
                                        type: 'SET_RELOAD_ROWS',
                                        payload: {
                                            total: state.total,
                                            datas: filterData.filter(ele => (
                                                filter(ele) === 1
                                            )),
                                        },
                                    })
                                }
                                // eslint-disable-next-line no-empty
                            } catch (error) {
                            }
                        }
                    }}
                />
                <span>总数 {state.total} 条 / 已加载 </span>
                <Progress
                    style={{
                        width: 100,
                        marginRight: 10,
                    }}
                    percent={percent}
                />
                <ReloadOutlined
                    style={{
                        marginLeft: 0,
                        top: 2,
                        position: 'relative',
                    }}
                    onClick={() => {
                        reloadFun(props.params || {})
                    }}
                />
            </div>
        )
        return (
            <TableContext.Provider value={{ dispatch, state }}>
                <Spin
                    spinning={state.loading}
                >
                    <div
                        ref={divRef}
                        style={{
                            width: '100%',
                        }}
                    >
                        {width > 0 ? rdg : undefined}
                    </div>
                </Spin>
                {width > 0 ? search : undefined}
            </TableContext.Provider>
        )
    }, [
        props.overlay,
        props.columns,
        props.enableCellCopyPaste,
        props.enableCellDragAndDrop,
        props.groupColumn,
        props.rowClass,
        state.loading,
        state.datas,
        selectedRows,
        props.height,
        sortDirection,
        state.groupExpanded,
        width,
    ])
}

Table.defaultProps = {
    pageSize: 50,
    params: {},
    sortDirection: [],
    enableInitLoadData: true,
    enableCellCopyPaste: false,
    enableCellDragAndDrop: false,
    onRowsUpdate: async () => true,
    selectBox: 'none',
    height: 300,
    onSort: () => { },
}
