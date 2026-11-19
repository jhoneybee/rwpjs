import { cloneDeepWith } from 'lodash'
import { Column } from 'react-data-grid-temp'
import { getColumnMetrics } from 'react-data-grid-temp/lib/utils/columnUtils'
import { ColumnProps, Row, TableColumnInfo, TableProps } from '../type'

export const selectionColumn: Column<Row> = {
    key: '$select', name: '', frozen: true, selectCell: false, maxWidth: 35,
}

export const expandableColumn: Column<Row> = {
    key: '$expandable', name: '', frozen: true, selectCell: false, maxWidth: 35,
}

type LayoutOptions = Pick<TableProps, 'selectBox' | 'expandable'>
const emptyFormatter = () => null

export const cloneColumnConfig = <T,>(value: T): T => cloneDeepWith(value, item => {
    // Preserve React element, memo and forwardRef identities in configuration snapshots.
    if (item && typeof item === 'object' && item.$$typeof) return item
    return undefined
})

export const calculateColumns = (
    columns: ColumnProps[],
    visibleColumns: string[] | null,
    options: LayoutOptions,
    columnWidths: ReadonlyMap<string, number>,
    viewportWidth: number,
) => {
    const rawColumns: Column<Row>[] = columns
        .filter(column => visibleColumns?.includes(column.name))
        .map(column => ({ resizable: true, ...column, key: column.name, name: column.title }))
    if (options.selectBox !== 'none') rawColumns.unshift({ ...selectionColumn })
    if (options.expandable?.expandedRowRender) rawColumns.unshift({ ...expandableColumn })

    // The pinned grid owns frozen-column ordering, width allocation and min/max clamping.
    return getColumnMetrics<Row, unknown>({
        rawColumns,
        columnWidths,
        viewportWidth,
        minColumnWidth: 80,
        defaultResizable: false,
        defaultSortable: false,
        defaultFormatter: emptyFormatter,
    }).columns
}

export const getColumnInfo = (
    columns: ColumnProps[],
    visibleColumns: string[] | null,
    options: LayoutOptions,
    columnWidths: ReadonlyMap<string, number>,
    viewportWidth: number,
    includeSystem = false,
): TableColumnInfo[] => {
    const calculated = calculateColumns(columns, visibleColumns, options, columnWidths, viewportWidth)
    const byKey = new Map(calculated.map(column => [column.key, column]))
    const data: TableColumnInfo[] = columns.map(column => {
        const actual = byKey.get(column.name)
        const resized = columnWidths.get(column.name)
        const hiddenWidth = resized === undefined ? column.width : Math.min(
            Math.max(resized, column.minWidth ?? 80), column.maxWidth ?? Infinity,
        )
        return {
            ...column,
            key: column.name,
            kind: 'data',
            visible: actual !== undefined,
            idx: actual?.idx ?? -1,
            left: actual?.left,
            configuredWidth: column.width,
            width: actual?.width ?? hiddenWidth,
            actualWidth: actual?.width,
            frozen: actual?.frozen ?? column.frozen ?? false,
            resizable: actual?.resizable ?? column.resizable ?? true,
            sortable: actual?.sortable ?? column.sortable ?? false,
        }
    })
    if (!includeSystem) return cloneColumnConfig(data)
    const system: TableColumnInfo[] = calculated
        .filter(column => column.key === selectionColumn.key || column.key === expandableColumn.key)
        .map(column => ({
            key: column.key,
            name: column.key,
            title: column.name,
            width: column.width,
            minWidth: column.minWidth,
            maxWidth: column.maxWidth,
            frozen: !!column.frozen,
            resizable: column.resizable,
            sortable: column.sortable,
            kind: column.key === selectionColumn.key ? 'selection' : 'expandable',
            visible: true,
            idx: column.idx,
            left: column.left,
            actualWidth: column.width,
        }))
    return cloneColumnConfig([...data, ...system].sort((a, b) => {
        if (!a.visible) return b.visible ? 1 : 0
        if (!b.visible) return -1
        return a.idx - b.idx
    }))
}
