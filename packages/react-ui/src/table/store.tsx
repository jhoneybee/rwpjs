import React from 'react'
import { Column, RowsUpdateEvent } from 'react-data-grid-temp'
import { groupBy, isEqual } from 'lodash'
import { generate } from 'shortid'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Key } from 'rc-tree/lib/interface'
import { Row, GroupRowData, ColumnProps } from './type'

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
        // 展开的表格信息
        expandedRowNumber:  -1,
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
        loadRows(rows: any[], pageNo: number) {
            this.datas = formatData(this.datas.concat(rows))
            this.pageNo = pageNo
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
        setSelectedRows(keys: Set<Row[keyof Row]>, onSelectedRowsChange?: (selectedRows: Set<Row[keyof Row]>) => void) {
            onSelectedRowsChange?.(keys)
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
                const groupColumns = this.groupColumn
                if (currentLevel >= groupColumns.length) {
                    return datas.map(ele => ({...ele, $parent: parent}));
                }
                const result: GroupRowData[] = []
                const columnName = groupColumns[currentLevel]
                const groupData = groupBy(datas, columnName)
                Object.keys(groupData).forEach(key => {
                    const dataNode: GroupRowData = {
                        $id: parent === null ?  `root/${generate()}` : `${parent.$id}/${generate()}`,
                        $title: key,
                        $type: 'GROUP',
                        $parent: parent,
                        $column: columnName,
                        $space: (currentLevel + 1) * 20,
                        $level: currentLevel,
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
                const delIndex: number[] = []
                const datas: Row[] = this.dataSource.filter((ele, index) => {
                    const isDelete: boolean = filter(ele)
                    if (isDelete) {
                        delIndex.push(index)
                    }
                    return !isDelete
                })
                if (delIndex.includes(this.expandedRowNumber)) {
                    this.expandedRowNumber = -1
                    this.setDataSource(datas.filter(data => data.$type !== 'FILL'))
                }else {
                    this.setDataSource(datas)
                }
                
                resolve()
            })
        },
        // 新增数据
        add(rows: Row[], start?: number ){
            const addRows: Row[] = rows.map(ele => ({ ...ele, $state: 'CREATE'}))
            this.dataSource.splice(start || 0, 0, ...addRows)
        },
        // 更新数据
        update(change: (data: Row) => Row) {
            return new Promise<void>(resolve => {
                const datas = this.dataSource.map(ele => {
                    const row = change(ele)
                    if (isEqual(row, ele)) {
                        return ele
                    }
                    return {...row, $state: 'UPDATE'}
                })
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
            const data = isGroup ? this.groupDatas : this.datas
            return data
        },
        setDataSource(datas: any[]){
            if(this.isGroup){
                this.groupDatas = datas
                return 
            }
            this.datas = datas
        },
        setExpandedRowNumber(index: number, count: number) {
            const newDataSource = this.dataSource.filter(data => data.$type !== 'FILL')
            if (index !== -1){
                const fillData: Row[] = []
                // 获取要填充的数据
                for (let i = 0; i< count; i += 1) {
                    fillData.push({
                        $type: 'FILL'
                    })
                }
                newDataSource.splice(index + 1, 0, ...fillData)
            }
            // 填充对应的数据到data
            this.setDataSource(newDataSource)
            this.expandedRowNumber = index
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