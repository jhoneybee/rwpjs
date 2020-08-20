import React, {
    useEffect,
    useRef,
    useState,
} from 'react'
import ReactDataGrid, {
    RowRendererProps,
    DataGridHandle,
    Column,
    SortColumn
} from 'react-data-grid-temp'

import { cloneDeep, ceil } from 'lodash'
import { Progress } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { observer, useLocalStore } from 'mobx-react-lite'
import { toJS } from 'mobx'
import { Spin } from '../index'
import { useRowRenderer } from './row'
import { usePreFormatColumn } from './column'
import { classPrefix } from '../utils'
import { StoreContext, createStore } from './store'
import {
    TableProps,
    Row,
    TableHandle,
} from './type'

import 'react-data-grid-temp/dist/react-data-grid.css'
import './style/index.less'


const tableClassPrefix = `${classPrefix}-table`

export const Table = observer<TableProps>((props: TableProps) => {
    const store = useLocalStore(createStore)

    const gridRef = useRef<DataGridHandle | null>(null)

    const { table, enableInitLoadData } = props

    // 防止timeout内存溢出
    let scrollTimeOut: NodeJS.Timeout;

    // 重新刷新数据,返回到第一行
    const reloadFun = async (param?: Object) => {
        store.setLoading(true)
        const res = props.loadData(1, props.pageSize!, {
            ...props.params,
            ...param || {},
        })
        const resp = await (res as PromiseLike<{ total: number, datas: Row[] }>)
        store.reloadRows(resp.datas)
        store.setTotal(resp.total)
        if (gridRef.current) {
            gridRef.current.scrollToRow(0)
        }
        store.setSelectedRows(new Set())
        store.setLoading(false)
    }

    /**
     * 装载表格数据
     */
    const loadDataFun = async () => {
        store.setLoading(true)
        const res = props.loadData(store.pageNo, props.pageSize!, props.params!)
        const resp = await (res as PromiseLike<{ total: number, datas: Row[] }>)
        store.loadRows(resp.datas)
        store.setTotal(resp.total)
        store.setLoading(false)
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
        store.setGroupColumn(props.groupColumn || [])
        
    }, [props.groupColumn])

    // 是否启用分组
    const isEnableGroupColumn = () => props.groupColumn && props.groupColumn.length > 0
    // 是否禁用加载数据
    const isDisableLoadData = () => {
        if (isEnableGroupColumn()) return true
        return false
    }

    const columns = usePreFormatColumn(props, store)

    if (table && gridRef.current) {
        const tempTable: TableHandle = {
            scrollToColumn: gridRef.current.scrollToColumn,
            scrollToRow: gridRef.current.scrollToRow,
            selectCell: gridRef.current.selectCell,
            commitChanges: gridRef.current.commitChanges,
            rightContext: () => ({
                row: store.contextMenu!.row as Row,
                rowIdx: store.contextMenu!.rowIdx as number,
                column: store.contextMenu!.column as Column<Row>,
            }),
            getDataSource: () => cloneDeep(store.datas as Row[]),
            getSelect: () => new Set<string>(toJS(store.selectedRows)),
            setSelect: (selects: Set<Row[keyof Row]>) => {
                store.setSelectedRows(selects)
            },
            update: change => store.update(change),
            reload: (param: Object) => {
                // 如果是分组状态,禁止操作
                if (isDisableLoadData()) return;
                reloadFun(param)
                
            },
            del: filter => {
                return store.del(filter)
            },
        }
        table.current = tempTable
    }

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
            store.datas.length > 0
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


    let rows: Row[] = store.datas
    if (props.groupColumn && props.groupColumn.length > 0){
        rows = store.groupDatas
    }
    const rdg = (
        <>
            <ReactDataGrid
                ref={gridRef}
                width={width}
                height={props.height}
                columns={columns}
                rows={rows}
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
                selectedRows={store.selectedRows}
                onSelectedRowsChange={select => {
                    store.setSelectedRows(select)
                }}
                rowClass={props.rowClass}
                onRowClick={props.onRowClick}
                rowRenderer={(rowProps: RowRendererProps<Row, unknown>) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    return useRowRenderer(rowProps, isDisableLoadData(), props)
                }}
                onRowsUpdate={e => {
                    const onCommit = () => {
                        store.commit(e)
                    }
                    props.onRowsUpdate!(e, onCommit)
                }}
            />
        </>
    )

    const percent = Number.parseInt(
        (ceil(store.datas.length / store.total, 2) * 100).toFixed(),
        10)

    const search = (
        <div
            className={`${tableClassPrefix}-footer`}
        >
            <span
                className={`${tableClassPrefix}-footer-total`}
            >
                {store.total}
            </span>
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
                    reloadFun()
                }}
            />
        </div>
    )
    return (
        <StoreContext.Provider value={store}>
            <Spin
                spinning={store.loading}
            >
                <div
                    ref={divRef}
                    style={{
                        width: '100%',
                        height: props.height,
                    }}
                >
                    {width > 0 ? rdg : undefined}
                </div>
            </Spin>
            {width > 0 ? search : undefined}
        </StoreContext.Provider>
    )
})

Table.defaultProps = {
    pageSize: 50,
    params: {},
    enableInitLoadData: true,
    enableCellCopyPaste: false,
    enableCellDragAndDrop: false,
    onRowsUpdate: async () => true,
    selectBox: 'none',
    height: 300,
    onSort: () => { },
}