import React from 'react'
import { Column, RowsUpdateEvent } from 'react-data-grid-temp'
import { orderBy } from 'lodash'
import { toJS } from 'mobx'
import { Row } from './type'

export type ContextMenu = {
    row: Row,
    rowIdx: number,
    column: Column<any, unknown>
}

type GroupCache = {
    datas: Row[],
}

export function createStore() {
    const formatData = (datas: Row[]) => datas.map((ele, index) => ({
        ...ele,
        $index: index + 1,
    }))
    return {
        // 当前显示的数据
        datas: [] as Row[],
        // 缓存的分组数据
        groupCache: undefined as GroupCache | undefined,
        // 当前数据的总数
        total: 0,
        // 当前第几页
        pageNo: 1,
        // 选中的数据
        selectedRows: new Set<Row[keyof Row]>(),
        // 展开的数据
        groupExpanded: [] as string[],
        // loading的状态
        loading: false,
        // 分组列
        groupColumn: [] as string[],
        // 右键的上下文
        contextMenu: {} as ContextMenu,
        // 装载数据
        loadRows(rows: any[]) {
            this.datas = formatData(rows.concat(this.datas))
            this.pageNo += 1
        },
        setSelectedRows(keys: Set<Row[keyof Row]>) {
            this.selectedRows = keys
        },
        // 重新装载数据
        reloadRows(rows: any[]) {
            this.datas = formatData(rows)
            this.pageNo = 1
        },
        setGroupColumn(groupColumn: string[]) {
            this.groupColumn = groupColumn
        },
        setGroupExpanded(expand: string) {
            const index = this.groupExpanded.indexOf(expand)
            if (index !== -1) {
                this.groupExpanded.splice(index, 1)
            } else {
                this.groupExpanded.push(expand)
            }
            this.groupDataFun()
        },
        // 清除展开数据
        cleanGroupExpanded() {
            this.groupExpanded = []
            this.groupCache = undefined
        },
        // 设置总数
        setTotal(total: number) {
            this.total = total
        },
        // 设置loading
        setLoading(loading: boolean) {
            this.loading = loading
        },
        // 设置上下文
        setContextMenu(contextMenu: ContextMenu) {
            this.contextMenu = contextMenu
        },
        // 删除数据
        del(filter: (ele: Row) => boolean) {
            return new Promise<void>(resolve => {
                this.datas = this.datas.map(ele => ({
                    ...ele,
                    $state: filter(ele) ? 'DELETE' : ele.$state,
                }))
                resolve()
            })
        },
        // 更新数据
        update(change: (data: Row) => Row) {
            return new Promise<void>(resolve => {
                this.datas = this.datas.map(ele => ({
                    ...change(ele),
                    $state: 'UPDATE',
                }))
                resolve()
            })
        },
        /**
        * 装载分组数据
        */
        groupDataFun() {
            const self = this
            let datas = toJS(this.datas)
            if(!this.groupCache){
                this.groupCache = {
                    datas,
                }
            }else{
                datas = this.groupCache.datas
            }

            const groupDataOld = orderBy(
                datas,
                this.groupColumn,
                this.groupColumn.map(() => 'asc'),
            )
            const groupMap = new Map<string, Row[]>()
            groupDataOld.forEach((ele: any) => {
                let key = ''
                this.groupColumn!.forEach(group => {
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
                if ((self.groupExpanded as string[]).includes(key)) {
                    groupDatas = groupDatas.concat(data)
                }
            })
            this.reloadRows(groupDatas)
        },
        // 提交修改的信息
        commit(e: RowsUpdateEvent) {
            return new Promise<void>(resolve => {
                if (e.action === 'CELL_UPDATE' || e.action === 'COPY_PASTE') {
                    this.datas[e.toRow] = { ...this.datas[e.toRow], ...(e.updated as any) }
                }

                if (e.action === 'CELL_DRAG') {
                    const cells: number[] = []
                    for (let i = e.fromRow; i <= e.toRow; i += 1) {
                        cells.push(i)
                    }
                    this.datas.forEach((value, index) => {
                        if (cells.includes(index)) {
                            this.datas[index] = { ...this.datas[index], ...(e.updated as any) }
                        }
                    })
                }
                resolve()
            })
        }
    }
}

export type TableStore = ReturnType<typeof createStore>

export const StoreContext = React.createContext<TableStore | null>(null)

export const useStore = () => {
    const store = React.useContext(StoreContext)
    if (!store) {
        throw new Error('useStore must be used within a StoreProvider.')
    }
    return store
}