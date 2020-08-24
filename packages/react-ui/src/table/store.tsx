import React from 'react'
import { Column, RowsUpdateEvent } from 'react-data-grid-temp'
import { groupBy, isEqual } from 'lodash'
import { generate } from 'shortid'
import { Row, GroupRowData, ColumnProps } from './type'
import { Key } from 'rc-tree/lib/interface'

export type ContextMenu = {
    row: Row,
    rowIdx: number,
    column: Column<any, unknown>
}


export function createStore() {
    const formatData = (datas: Row[]) => datas.map((ele, index) => ({
        ...ele,
        $index: index + 1,
    }))
    return {
        columns: [] as ColumnProps[],
        // 可见的列的信息
        visibleColumns: null as string[] | null,
        // 当前显示的数据
        datas: [] as Row[],
        // 分组数据
        groupDatas: [] as GroupRowData[] | Row[],
        cacheGroupDatas: undefined as GroupRowData[] | Row[] | undefined,
        // 当前数据的总数
        total: 0,
        // 当前第几页
        pageNo: 1,
        // 选中的数据
        selectedRows: new Set<Row[keyof Row]>(),
        // loading的状态
        loading: false,
        // 分组列
        groupColumn: [] as string[],
        // 展开的分组节点信息
        expandedKeys: [] as string[],
        // 右键的上下文
        contextMenu: {} as ContextMenu,
        // 装载数据
        loadRows(rows: any[]) {
            this.datas = formatData(rows.concat(this.datas))
            this.pageNo += 1
        },
        /**
         * 将两个节点进行交换
         * @param node 当前node节点
         * @param targeNode 交换的目标节点
         */
        switchColumns(node: Key, targeNode: Key){
            // const column = this.columns.find(ele => ele.name === node)
            // const targeColumn = this.columns.find(ele => ele.name === targeNode)
            let column: ColumnProps
            let columnIndex: number
            let targeColumn: ColumnProps
            let targeColumnIndex: number
            this.columns.forEach((value, index) => {
                if (value.name === node){
                    column = value 
                    columnIndex = index
                }
                if (value.name === targeNode){
                    targeColumn = value
                    targeColumnIndex = index
                }
            })
            this.columns.splice(columnIndex!, 1, targeColumn!)
            this.columns.splice(targeColumnIndex!, 1, column!)

        },
        setSelectedRows(keys: Set<Row[keyof Row]>) {
            this.selectedRows = keys
        },
        setExpandedKeys(keys: string[]) {
            this.expandedKeys = keys
            this.groupDatas = this.getGroupDatas()
        },
        // 重新装载数据
        reloadRows(rows: any[]) {
            this.datas = formatData(rows)
            this.pageNo = 1
        },
        getGroupDatas() {
            const { expandedKeys } = this
            const loops = (parent: any, datas: Row[], currentLevel: number) => {
                if (currentLevel >= this.groupColumn.length) {
                    return datas.map(ele => ({...ele, $parent: parent}));
                }
                const result: GroupRowData[] = []
                const groupData = groupBy(datas, this.groupColumn[currentLevel])
                Object.keys(groupData).forEach(key => {
                    const dataNode: GroupRowData = {
                        $id: parent === null ? 'root' : `${parent.$id}/${generate()}`,
                        $title: key,
                        $type: 'GROUP',
                        $parent: parent,
                        $space: (currentLevel + 1) * 20,
                    }
                    result.push({
                        ...dataNode,
                        $children: loops(dataNode, groupData[key], currentLevel + 1)
                    })
                })
                return result
            }
            let groupDatas = this.cacheGroupDatas;
            if (!groupDatas) {
                groupDatas = loops(null, this.datas, 0)
                this.cacheGroupDatas = groupDatas
            }
            const newData: Row[] = []

            const historyExpandedKeys: string[] = []
            const loopsGroupData = (loppsData: GroupRowData[] | Row[]) => {
                loppsData.forEach(ele => {
                    if (ele.$parent === null) {
                        newData.push(ele)
                    }
                    
                    if (ele.$parent && expandedKeys.includes(ele.$parent.$id)) {
                        historyExpandedKeys.push(ele.$parent.$id)
                        newData.push(ele)
                    }

                    if (isEqual(historyExpandedKeys, expandedKeys)){
                        return;
                    }

                    if (ele.$children && ele.$children.length > 0) {
                        loopsGroupData(ele.$children)
                    }

                })
            }
            loopsGroupData(groupDatas)
            return newData
        },
        setGroupColumn(groupColumn: string[]) {
            this.groupColumn = groupColumn
            // 没有分组信息,则不执行分组逻辑
            if (this.groupColumn.length === 0) {
                // 退出分组的时候，清空缓存，重新计算
                this.cacheGroupDatas = undefined
                this.expandedKeys = []
                return;
            }
            this.groupDatas = this.getGroupDatas()
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
                const datas = this.dataSource.map(ele => ({
                    ...ele,
                    $state: filter(ele) ? 'DELETE' : ele.$state,
                }))
                this.setDataSource(datas)
                resolve()
            })
        },
        // 新增数据
        add(rows: Row[]){
            const addRows: Row[] = rows.map(ele => ({ ...ele, $state: 'CREATE'}))
            this.dataSource.splice(0, 0, ...addRows)
        },
        // 更新数据
        update(change: (data: Row) => Row) {
            return new Promise<void>(resolve => {
                const datas = this.dataSource.map(ele => ({
                    ...change(ele),
                    $state: 'UPDATE',
                }))
                this.setDataSource(datas)
                resolve()
            })
        },
        // 提交修改的信息
        commit(e: RowsUpdateEvent) {
            return new Promise<void>(resolve => {
                const rows: Row[] = this.dataSource

                if (e.action === 'CELL_UPDATE' || e.action === 'COPY_PASTE') {
                    rows[e.toRow] = { ...rows[e.toRow], ...(e.updated as any) }
                }

                if (e.action === 'CELL_DRAG') {
                    const cells: number[] = []
                    for (let i = e.fromRow; i <= e.toRow; i += 1) {
                        cells.push(i)
                    }
                    rows.forEach((value, index) => {
                        if (cells.includes(index)) {
                            rows[index] = { ...rows[index], ...(e.updated as any) }
                        }
                    })
                }
                this.setDataSource(rows)
                resolve()
            })
        },
        get isGroup(){
            return this.groupColumn && this.groupColumn.length > 0
        },
        get dataSource(){
            const isGroup = this.groupColumn && this.groupColumn.length > 0
            return isGroup ? this.groupDatas : this.datas
        },
        setDataSource(datas: any[]){
            if(this.isGroup){
                this.groupDatas = datas
                return 
            }
            this.datas = datas
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