---
nav:
  title: 组件
  path: /components
group:
  path: /components/display
  title: 数据展现
title: Table 表格
---

# Table 表格

展示和编辑行列数据。

## 代码演示

<code src="./demo/group-edit-table.tsx" />

<code src="./demo/base-table.tsx" />

<code src="./demo/select-table.tsx" />

<code src="./demo/expandable-table.tsx" />

<code src="./demo/select-table-custom-header.tsx" />

<code src="./demo/modal-table.tsx" />

## API

### Table 表格

| 参数      | 说明       | 类型     | 
| ---      | ---        | ---     | --- |
|mode      | 显示模式    |`'SIMPLE'` \| `'NORMAL'` | SIMPLE 表示简约模式 NORMAL表示正常模式
|columns   | 列的信息    | `ColumnProps[]`| -
|loadData  | 装载数据   |`(pageNo: number, pageSize: number, params: Object) => PromiseLike<{total: number, datas: T[]}>`
|pageSize  | 初始化页面的分页大小| `number` 
|params    | 装载数据的参数      | `Object` 
|enableInitLoadData| 是否初始化的时候自动装载数据 | `boolean` 
|enableCellCopyPaste| 启动复制和粘贴 | `boolean` | `true`
|enableCellDragAndDrop| 启动下拉编辑 | `boolean` | `true`
|selectBox      | 启动选择框 multiple 多选, single 单选, none不显示选择列   | `'multiple'` &#124; `single` &#124; `'none'` | `'none'`
|groupColumn    | 启动分组,根据列的name来进行分组     | `string[]` | `[]`
|groupRenderer        | 渲染分组行的的render, 可拦截重新填充值 | `React.ComponentType`| -
|selectRenderer      | 自定义选择框的 | `React.ComponentType`| -
|selectHeaderRenderer | 自定义选择框的头部信息 |  `React.ComponentType`| -
|rowKey| 用户唯一的rowKey| `string`|
|overlay | 右键菜单   | `React.ReactElement`&#124;`OverlayFunc`|
|onSort      | 排序触发的事件| `(sortColumns: SortColumn[]) => void;`| -
|onRowClick  | 表格的row的点击事件| `(rowIdx: number, row: T, column: CalculatedColumn<T>) => void;`
|onRowsUpdate| 用户更新表格触发的事件，调用 onCommit 提交本地修改 | `(event: RowsUpdateEvent, onCommit: () => Promise<Row[]>) => void \| Promise<void \| Row[]>`
|onColumnResize| 拖动列宽时触发，返回实际显示索引、像素宽度、当前列及全部业务列快照 | `(idx: number, width: number, column: TableColumnInfo, columns: TableColumnInfo[]) => void`
|onChangeColumn| 列顺序、显隐或业务列宽度变化时触发 | `(columns: ColumnProps[]) => void`
|onSelectedRowsChange| 用户改变行选择框的时候触发事件| `onSelectedRowsChange?: (selectedRows: Set<Row[keyof Row]>) => void`
|table       | 用来获取当前的表格进行数据操作 | `TableHandle`
|rowClass | 设置当前行的class名称 | `(row: T) => string` \| `undefined`;
|expandable | 设置可展开信息 | `Expandable` | -

### TableHandle 的方法

| 方法名称          | 说明          | 类型     
| ---              | ---            | ---   
| scrollToColumn   | 滚动到指定的列  | `(colIdx: number) => void`
| scrollToRow      | 滚动到指定的行  | `(rowIdx: number) => void`
| selectCell       | 选择指定的单元格| `(position: Position, openEditor?: boolean) => void`     
| rightContext     | 获取右键的上下文信息| `() => { row, rowIdx, column }` 
| update           | 更新表格的数据  | `(change: (oldData: T) => T) => void`
| getDataSource    | 获取当前表格的所有数据| `() => T[]`
| getColumns       | 获取全部业务列的完整配置和布局信息；可选择包含系统列 | `(options?: { includeSystem?: boolean }) => TableColumnInfo[]`
| getSelect        | 获取当前选中的数据    | `() => Set<T[keyof T]>`
| setSelect        | 设置选中的数据        | `(selects: Set<T[keyof T]>) => void`
| reload           | 重新装载表格，保留本地编辑字段和有效的分组展开状态 | `(param?: Object) => Promise<void>`
| del              | 删除返回为true的数据 | `(filter: (ele: T) => boolean) => void`
| add              | 新增表格一行数据     | `(rows: Row[], start: number) => void`

```ts
const Demo = () => {
    const table = React.useRef<TableHandle<T> | null>(null)
    return (
        <Table
            columns={...}
            table={table}
            loadData={...}
        /> 
    )
}
```

> 通过 `table.current` 来进行调用,获取子组件的一些方法

### Column 列

| 参数      | 说明       | 类型     | 
| ---      | ---        | ---     |
|title     | 标题       | `string`| 
|name      | 字段名称   | `string`|
|align     | 列的对其方式| `'left'` &#124; `'right'` &#124; `'center'` | `'left'`
|width     |  列宽。如果未指定，则将根据网格宽度和其他列的指定宽度自动确定 | `number`&#124;`string`
|minWidth   | 最小列宽(px) | `number`|
|maxWidth   | 最大列宽(px)。| `number`|
|editable   | 单元格编辑。| `editable?: boolean `&#124;` ((row: T) => boolean);`
|resizable  | 列的宽度调整 | `boolean`|
|sortable   | 列排序     | `boolean`|
|sortDescendingFirst | 将列排序顺序设置为降序 | `boolean`
|frozen | 冻结列 |`boolean`
|formatter|格式化当前列的数据 | `React.ComponentType<FormatterProps<T, unknown>>`
|editor | 单元格使用的编辑器| `React.ComponentType<EditorProps<T[keyof T], T, unknown>>`
|cellClass | 设置单元格的class| `string` \| `((row: T) => string);`
|editorOptions| 编辑器属性   | - | -
|headerRenderer | 自定义渲染文件头 | - | -

### editorOptions 编辑器属性

```js
{
  // 编辑器模式(内部使用)
  createPortal?: boolean;
  // 是否点击编辑
  editOnClick?: boolean;
  onCellKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
};
```

## FAQ 

#### 拖动列宽后如何获取最新的完整列配置？

使用 `onColumnResize` 获取即时结果，或随时调用 `table.current.getColumns()`。回调内调用 getter 也能同步得到本次拖动后的宽度，不需要等待重绘。

```tsx | pure
import React, { useRef } from 'react'
import { Table, TableHandle } from '@rwp/react-ui'

const table = useRef<TableHandle | null>(null);

<Table
    table={table}
    columns={columns}
    loadData={loadData}
    onColumnResize={(idx, width, column, allColumns) => {
        console.log(column.name, width, idx)
        console.log(allColumns) // 全部业务列，含隐藏列，按配置顺序排列
        console.log(table.current?.getColumns()) // 与 allColumns 一致
    }}
/>

// 包含选择列、展开列的布局快照：可见列按实际显示顺序，隐藏业务列放在末尾。
const layout = table.current?.getColumns({ includeSystem: true })
```

业务列保留原始配置中的标题、编辑器、formatter 及自定义字段，并附加以下信息：

| 字段 | 含义 |
| --- | --- |
| `name` / `key` | 业务字段名；系统列使用 `$select`、`$expandable` |
| `kind` | `data`、`selection`、`expandable` |
| `visible` | 是否参与当前显示布局 |
| `idx` | 底层实际显示索引，包含固定列重排及系统列；隐藏列为 `-1` |
| `width` | 可见列的实际像素宽度；隐藏列保留配置宽度或最近拖动后的受约束宽度 |
| `actualWidth` | 可见列的实际像素宽度；隐藏列为 `undefined` |
| `configuredWidth` | 当前配置值，尚未手动调整的百分比宽度仍保留百分比字符串 |
| `left` | 列在网格布局中的偏移；隐藏列为 `undefined` |

`getColumns()` 默认只返回业务列，按业务配置顺序排列。数组下标不等于显示索引，请用 `name`/`key` 匹配列。`includeSystem: true` 会额外返回系统列的布局信息；它们不会被误写到业务列配置中。`onColumnResize` 的 `width` 已应用 `minWidth`/`maxWidth` 约束；业务列变宽时也会触发 `onChangeColumn`，该回调仍返回 `ColumnProps[]`。

返回值是独立配置快照，修改它不会直接改变表格。百分比宽度、自适应宽度以及固定列排序使用底层网格的同一套计算规则；尺寸由网格容器的 ResizeObserver 更新。

#### 编辑后刷新会丢失输入吗？

刷新按钮和 `table.current.reload()` 都支持分组状态。刷新会按 `rowKey` 将本地修改的字段合并到新的 `loadData` 响应，其他字段使用服务端最新值；行编辑中的输入在普通重绘时也会保留。`getDataSource()` 可读取合并后的数据。刷新不会自动调用服务端保存接口。

请为 `rowKey` 使用稳定、唯一的业务标识，例如 `rowKey="id"`，并保持该标识不被编辑。`$index` 和未指定 `rowKey` 时的默认行序号，只适用于刷新前后顺序不变的数据。只会对新响应中标识匹配的行合并修改，不会把已过滤或已删除的行强行加入响应。

服务端返回与某个本地编辑字段相同的值时，该字段的本地覆盖会自动清除，后续刷新可以正常接收该字段的新值。默认单元格更新会提交到本地；自定义 `onRowsUpdate` 时，仍由业务代码在合适时机调用 `await onCommit()`，并自行完成服务端保存。

双击单元格后，可以按 Enter、Tab，或让输入框失焦提交本地修改；Esc 取消当前编辑。点击其他单元格或表格刷新按钮时，会先提交当前输入，再切换单元格或刷新数据。自定义编辑器需要将收到的 `onBlur` 和 `onKeyDown` 传给实际输入控件。

分组数据使用原始数据统一写回，重新分组后保留有效的展开状态。刷新失败时会保留数据和本地修改，并结束 loading；通过 `reload()` 调用的失败会继续返回给调用方处理。

#### 如何将单击事件转换为一个双击事件？

使用 `import { toDoubleClick } from '@rwp/react-ui'` 方法即可。


#### 如何控制表格标题和内容采用不同的方式对其?

列的 align 属性可以使用  `{align: 'left|center'}`  控制标题和内容的居中方式。

#### 如何在表格中定义一个可编辑的组件？ 

传一个`React.ComponentType<EditorProps<T[keyof T], T, unknown>>`, 会传给`props` 一个`value`, 和一个 `onChange`,还有一个`style`

例子: 

```ts
const EditorDatePicker = (props) => {
  return (
    <DatePicker
      showTime
      style={props.style}
      placeholder="选择日期"
      value={moment(props.value || 0)}
      onChange={(e) => {
        props.onChange(e.valueOf())
      }}
    />
  )
}

```
