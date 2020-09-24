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

<code src="./demo/base-table.tsx" />

<code src="./demo/select-table.tsx" />

<code src="./demo/expandable-table.tsx" />




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
|rowKey| 用户唯一的rowKey| `string`|
|overlay | 右键菜单   | `React.ReactElement`&#124;`OverlayFunc`|
|onSort      | 排序触发的事件| `(sortColumns: SortColumn[]) => void;`| -
|onRowClick  | 表格的row的点击事件| `(rowIdx: number, row: T, column: CalculatedColumn<T>) => void;`
|onRowsUpdate| 用户更新表格触发的事件| ` <E extends RowsUpdateEvent>(event: E, onCommit: () => void) => Promise<boolean>;`
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
| getSelect        | 获取当前选中的数据    | `() => Set<T[keyof T]>`
| setSelect        | 设置选中的数据        | `(selects: Set<T[keyof T]>) => void`
| reload           | 重新装载表格         | `(param: Object) => void`
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