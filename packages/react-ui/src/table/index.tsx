import React, {
    useEffect,
    useRef,
    useState,
    ReactNode,
} from 'react'
import ReactDataGrid, {
    RowRendererProps,
    DataGridHandle,
    Column,
    SortColumn
} from 'react-data-grid-temp'

import { cloneDeep } from 'lodash'
import { Pagination } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { observer, useLocalStore } from 'mobx-react-lite'
import { toJS } from 'mobx'
import { Spin } from '../index'
import { useRowRenderer } from './row'
import { preFormatColumn } from './column'
import { classPrefix } from '../utils'
import { StoreContext, createStore } from './store'
import { Tools } from './plugin/Tools'

import {
    TableProps,
    Row,
    TableHandle,
} from './type'

import 'react-data-grid-temp/dist/react-data-grid.css'
import './style/index.less'


const tableClassPrefix = `${classPrefix}-table`

export const Table = observer<TableProps>((props: TableProps) => {
    const { pageSize: pageSizeTemp = 100, pageSizeOptions = ['50', '100', '500', '1000'] } = props

    const [pageSize, setPageSize] = useState<number>(pageSizeTemp)
    const store = useLocalStore(createStore, props)

    const gridRef = useRef<DataGridHandle | null>(null)
    const { table, enableInitLoadData } = props

    // 防止timeout内存溢出
    let scrollTimeOut: NodeJS.Timeout;

    // 重新刷新数据,返回到第一行
    const reloadFun = async (param?: Object) => {
        store.setLoading(true)
        const res = props.loadData(1, pageSize, {
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
    // const loadDataFun = async () => {
    //     store.setLoading(true)
    //     const pageNo = store.pageNo + 1
    //     const res = props.loadData(pageNo, pageSize, props.params!)
    //     const resp = await (res as PromiseLike<{ total: number, datas: Row[] }>)
    //     store.setTotal(resp.total)
    //     store.loadRows(resp.datas, pageNo)
    //     store.setLoading(false)
    // }


    useEffect(() => {
        return () => {
            if (scrollTimeOut) {
                clearTimeout(scrollTimeOut)
            }
        }
    })

    const currentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // 装载数据
        if (enableInitLoadData) reloadFun()

        const ele = props.getPopupContainer?.(currentRef.current!)

        ele?.addEventListener('scroll', () => {
            if (store.contextMenu.position && store.contextMenu.position.idx >= 0 && store.contextMenu.position.rowIdx >= 0) {
                gridRef.current?.selectCell(store.contextMenu.position, false)
            }
        })
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

    const refs: any[] = []
    const columns = preFormatColumn(
        store,
        props,
        refs,
    )

    const getRows = () => {
        let rows: Row[] = store.datas
        if (props.groupColumn && props.groupColumn.length > 0){
            rows = store.groupDatas
        }
        return rows
    }

    useEffect(() => {

        const noExist = props.columns.filter(ele => !store.columns.some((col) => col.name === ele.name))

        store.columns = props.columns

        if (store.visibleColumns === null || store.visibleColumns?.length === 0 || noExist.length > 0) {
            store.visibleColumns = props.columns.map(ele => ele.name)
        }

    }, [props.columns])

    if (table && gridRef.current) {
        const tempTable: TableHandle = {
            scrollToColumn: gridRef.current.scrollToColumn,
            scrollToRow: gridRef.current.scrollToRow,
            selectCell: gridRef.current.selectCell,
            rightContext: () => ({
                row: store.contextMenu!.row as Row,
                rowIdx: store.contextMenu!.rowIdx as number,
                column: store.contextMenu!.column as Column<Row>,
            }),
            setVisibleColumns: (visibleColumns: string[]) => {
                store.setVisibleColumns(visibleColumns)
            },
            getDataSource: () => cloneDeep(store.datas as Row[]),
            getSelect: () => {
                const selectedRowsData = toJS(store.selectedRows) as unknown as Array<Row[keyof Row]>
                const rowData = getRows()
                const filterData = selectedRowsData.filter(ele => rowData.some((row: Row[keyof Row]) => row[props.rowKey!] === ele ))
                return new Set<Row[keyof Row]>(filterData)
            },
            setSelect: (selects: Set<Row[keyof Row]>) => {
                store.setSelectedRows(selects)
            },
            update: change => store.update(change),
            reload: async (param: Object) => {
                // 如果是分组状态,禁止操作
                if (isDisableLoadData()) return;
                await reloadFun(param)
            },
            getRowEditData: () => {
                return refs.map((ele) => ({
                    name: ele.name,
                    value: ele.value.current?.getValue?.()
                }))
            },
            del: filter => store.del(filter),
            add: (rows, start) => store.add(rows, start)
        }
        table.current = tempTable
    }

    // const beforeScrollLeft = useRef<number>(0)
    // let isDisableScroll = false

    // const onScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    //     const target = e.currentTarget
    //     // 如果是分组状态,禁止操作
    //     if (isDisableLoadData()) return
    //     if (
    //         // 判断是否滚动到底部
    //         target.scrollHeight - target.scrollTop <= target.clientHeight + 2 &&
    //         // 判断数据大于0, 并且小于当前总数。
    //         store.datas.length > 0 &&
    //         store.datas.length < store.total &&
    //         target.scrollLeft === beforeScrollLeft.current &&
    //         !isDisableScroll
    //     ) {
    //         isDisableScroll = true
    //         scrollTimeOut = setTimeout(() => {
    //             loadDataFun().then(() => {
    //                 isDisableScroll = false
    //             })
    //         }, 200);
    //     }
    //     beforeScrollLeft.current = target.scrollLeft
    // }

    const [sortDirection, setSortDirection] = useState<SortColumn[]>([]);

    const rdg = (
        <>
            <ReactDataGrid
                ref={gridRef}
                columns={columns}
                rows={getRows()}
                // onScroll={onScroll}
                rowKey={props.rowKey}
                headerRowHeight={props.headerRowHeight}
                enableCellCopyPaste={props.enableCellCopyPaste}
                summaryRows={props.summaryRows}
                rowHeight={props.rowHeight}
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
                    // 如果是单选
                    if (props.selectBox === 'single') {
                        if (store.selectedRows.size > 0) {
                            const newKeys = new Set<any>([Array.from(select)[1]])
                            props.onSelectedRowsChange?.(newKeys)
                            store.setSelectedRows(newKeys)
                        } else {
                            props?.onSelectedRowsChange?.(select)
                            store.setSelectedRows(select)
                        }
                    }

                    // 如果是多选
                    if (props.selectBox === 'multiple') {
                        props?.onSelectedRowsChange?.(select)
                        store.setSelectedRows(select)
                    }
                }}
                rowClass={props.rowClass}
                onRowClick={props.onRowClick}
                rowRenderer={(rowProps: RowRendererProps<Row, unknown>) => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    return useRowRenderer(rowProps, isDisableLoadData(), props)
                }}
                onRowsUpdate={e => {
                    const onCommit = () => {
                        return store.commit(e)
                    }
                    props.onRowsUpdate!(e, onCommit)
                }}
            />
        </>
    )

    // const percent = Number.parseInt(
    //     (ceil(store.datas.length / store.total, 2) * 100).toFixed(),
    //     10)

    const footer = (
        <div
            className={`${tableClassPrefix}-footer`}
        >

            <span
                className={`${tableClassPrefix}-footer-total`}
            >
                {store.total}
            </span>
            <Pagination
                style={{
                    marginLeft: '.5rem'
                }}
                size="small"
                total={store.total}
                current={store.pageNo}
                disabled={isDisableLoadData()}
                pageSize={pageSize}
                pageSizeOptions={pageSizeOptions}
                showSizeChanger
                showQuickJumper
                onChange={async (page, size) => {
                    store.setLoading(true)
                    const pageNo = page
                    const res = props.loadData(pageNo, size!, props.params!)
                    const resp = await (res as PromiseLike<{ total: number, datas: Row[] }>)
                    store.setTotal(resp.total)
                    store.loadRows(resp.datas, pageNo)
                    store.setLoading(false)
                    if (gridRef.current) {
                        gridRef.current.scrollToRow(0)
                    }
                    setPageSize(size!)
                }}
                {...(props.pageOtherProps || {})}
            />
            <ReloadOutlined
                disabled
                style={{
                    marginLeft: 10,
                    marginRight: 20,
                    top: 2,
                    position: 'relative',
                    cursor: isDisableLoadData() ? 'not-allowed': 'pointer',
                    opacity: isDisableLoadData() ? 0.1 : 1,
                }}
                onClick={() => {
                    if(!isDisableLoadData()){
                        reloadFun()
                    }
                }}
            />
        </div>
    )

    const getPluginNode = (node: ReactNode) => {
        if(props.mode === 'SIMPLE') return undefined;
        return node
    }
    return (
        <div
            ref={currentRef}
            className={`${tableClassPrefix}-container`}
        >
            <StoreContext.Provider value={store}>
                <Spin
                    spinning={store.loading}
                    wrapperClassName={`${tableClassPrefix}-spin`}
                >
                    <div
                        className={`${tableClassPrefix}-content`}
                    >
                    {rdg}
                    {getPluginNode(<Tools renderPluginToolExt={props.renderPluginToolExt} renderPluginToolHeight={props.renderPluginToolHeight} />)}
                    </div>
                    {props.mode === 'HIDE-FOOTER' ?  null : getPluginNode(footer)}

                </Spin>
            </StoreContext.Provider>
        </div>
    )
})

Table.defaultProps = {
    // pageSize: 50,
    params: {},
    rowHeight: 35,
    enableInitLoadData: true,
    enableCellCopyPaste: true,
    enableCellDragAndDrop: false,
    onRowsUpdate: async () => {},
    selectBox: 'none',
    mode: 'NORMAL',
    onSort: () => { },
}
