import React from 'react'
import { Column, RowsUpdateEvent, Position } from 'react-data-grid-temp'
import { cloneDeep, groupBy, isEqual } from 'lodash'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Key } from 'rc-tree/lib/interface'
import { Row, GroupRowData, ColumnProps, TableProps } from './type'

const groupFields = new Set([
    '$index', '$state', '$parent', '$children', '$type', '$id',
    '$title', '$column', '$space', '$level',
])

export type ContextMenu = {
    row: Row,
    rowIdx: number,
    column: Column<any, unknown>
    openEditor: boolean,
    position: Position
}


export function createStore(props: TableProps) {
    const { onBeforeGroupData = (datas) => datas } = props
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
        // 行编辑数据
        rowEditData: new Map<unknown, Row>(),
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
            this.datas = this.mergeEdits(formatData(rows))
            this.pageNo = pageNo
            this.refreshGroups()
        },

        /**
         * 将两个节点进行交换
         * @param node 当前node节点
         * @param targeNode 交换的目标节点
         */
        switchColumns(node: Key, targeNode: Key){
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
            props.onChangeColumn?.(this.columns);
        },
        setSelectedRows(keys: Set<Row[keyof Row]>) {
            this.selectedRows = keys
        },
        setExpandedKeys(keys: string[], id: string) {
            this.expandedKeys = keys
            this.groupDatas = this.getGroupDatas(id)
        },
        // 重新装载数据
        reloadRows(rows: any[]) {
            this.loadRows(rows, 1)
        },
        getRowKey(row: Row) {
            return row[props.rowKey || '$index']
        },
        mergeEdits(rows: Row[]) {
            return rows.map(row => {
                const key = this.getRowKey(row)
                const edits = this.rowEditData.get(key)
                if (!edits) return row
                const pending: Row = {}
                Object.keys(edits).forEach(field => {
                    if (!isEqual(row[field], edits[field])) {
                        pending[field] = edits[field]
                    }
                })
                if (Object.keys(pending).length === 0) {
                    this.rowEditData.delete(key)
                    return row
                }
                this.rowEditData.set(key, pending)
                return { ...row, ...pending, $state: 'UPDATE' as const }
            })
        },
        recordEdit(before: Row, after: Row): Row {
            const key = this.getRowKey(before)
            const edits: Row = { ...this.rowEditData.get(key) }
            let changed = false
            const fields = new Set([...Object.keys(before), ...Object.keys(after)])
            fields.forEach(field => {
                if (!groupFields.has(field) && !isEqual(before[field], after[field])) {
                    edits[field] = cloneDeep(after[field])
                    changed = true
                }
            })
            if (!changed) return after
            this.rowEditData.set(key, edits)
            return { ...after, $state: before.$state === 'CREATE' ? 'CREATE' : 'UPDATE' }
        },
        editRow(row: Row, values: Row) {
            const index = this.datas.findIndex(data => this.getRowKey(data) === this.getRowKey(row))
            if (index < 0) return
            const before = this.datas[index]
            const updated = this.recordEdit(before, { ...before, ...values })
            this.datas = this.datas.map((data, rowIndex) => rowIndex === index ? updated : data)
            this.refreshGroups()
        },
        refreshGroups() {
            const visibleRows = new Set(this.groupDatas
                .filter(row => row.$type !== 'GROUP' && row.$type !== 'FILL')
                .map(row => this.getRowKey(row)))
            this.cacheGroupDatas = undefined
            if (this.isGroup) {
                this.groupDatas = this.getGroupDatas(undefined, visibleRows)
            }
        },
        getGroupDatas(id?: string, visibleRows?: Set<unknown>) {

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
                        $id: `${parent === null ? 'root' : parent.$id}/${encodeURIComponent(columnName)}:${encodeURIComponent(key)}`,
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
            const groupIds = new Set<string>()
            const retainedKeys = new Set(expandedKeys)
            const collectIds = (rows: Row[]) => rows.forEach(row => {
                if (row.$type === 'GROUP') {
                    groupIds.add(row.$id)
                    collectIds(row.$children || [])
                } else if (visibleRows?.has(this.getRowKey(row))) {
                    let parent = row.$parent
                    while (parent) {
                        retainedKeys.add(parent.$id)
                        parent = parent.$parent
                    }
                }
            })
            collectIds(groupDatas)
            this.expandedKeys = Array.from(retainedKeys).filter(key => groupIds.has(key))
            const expanded = new Set(this.expandedKeys)
            const newData: Row[] = []
            const loopsGroupData = (rows: Row[]) => rows.forEach(row => {
                newData.push(row)
                if (row.$type === 'GROUP' && expanded.has(row.$id)) {
                    const children = row.$id === id ? onBeforeGroupData(row.$children) : row.$children
                    loopsGroupData(children || [])
                }
            })

            loopsGroupData(onBeforeGroupData(groupDatas! as any[]))
            return newData
        },
        setGroupColumn(groupColumn: string[]) {
            if (isEqual(this.groupColumn, groupColumn)) return
            this.groupColumn = groupColumn.slice()
            this.cacheGroupDatas = undefined
            this.expandedKeys = []
            // 没有分组信息,则不执行分组逻辑
            if (this.groupColumn.length === 0) {
                // 退出分组的时候，清空缓存，重新计算
                this.cacheGroupDatas = undefined
                this.expandedKeys = []
                this.groupDatas = []
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
            this.setDataSource([...this.dataSource])
        },
        // 更新数据
        update(change: (data: Row) => Row) {
            return new Promise<void>(resolve => {
                const datas = this.datas.map(ele => {
                    if (ele.$type === 'FILL') return ele
                    const before = cloneDeep(ele)
                    const row = change(ele)
                    return this.recordEdit(before, row)
                })
                this.datas = datas
                this.refreshGroups()
                resolve()
            })
        },
        // 提交修改的信息
        commit(e: RowsUpdateEvent, sourceRows?: Row[]) {
            return new Promise<Row[]>(resolve => {
                const rows = sourceRows || this.dataSource.slice()
                const updates: Row[] = []
                const from = e.action === 'CELL_DRAG' ? e.fromRow : e.toRow
                const supported = ['CELL_UPDATE', 'COPY_PASTE', 'CELL_DRAG'].includes(e.action)
                if (supported) {
                    const datas = this.datas.slice()
                    for (let i = from; i <= e.toRow; i += 1) {
                        const row = rows[i]
                        if (!row || ['GROUP', 'FILL', 'EXPANDABLE'].includes(row.$type)) continue
                        const index = datas.findIndex(data => this.getRowKey(data) === this.getRowKey(row))
                        if (index < 0) continue
                        const before = datas[index]
                        const updated = this.recordEdit(before, { ...before, ...(e.updated as any) })
                        datas[index] = updated
                        updates.push({ ...updated })
                    }
                    this.datas = datas
                    this.refreshGroups()
                }
                resolve(updates)
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
        },
        setVisibleColumns(data: string[] | null) {
            this.visibleColumns = data
            props.onChangeColumn?.(this.columns.filter(ele => data?.includes(ele.name)));
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
