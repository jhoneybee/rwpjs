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

```jsx
/**
 * title: 简单的表格
 * desc: 包含了一千列的数据
 */

import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Table, Input, toDoubleClick, Row, Menu, Space, Button } from '@rwp/react-ui'


const getColumns = () => {
  const columns = [{
    name: '$index',
    title: '序号',
  }]
  for(let i=0; i< 1000 ; i ++){
    columns.push({
      name: `field${i}`,
      title: `字段-${i}`,
      width: 120,
      align: 'center|left',
      sortable: true,
      editable: true,
      editorOptions: {
        editOnClick: true
      },
      editor: Input
    })
  }
  return columns
}

const MyTable = () => {
    const table = React.useRef()
    const [groupField, setGroupField] = useState([])
    const [disable, setDisable] = useState(false)
    const [columns, setColumns] = useState(getColumns())

    return (
        <>
        <div
          style={{
            marginBottom: 4
          }}
        >
          <Space>
            <Button
              onClick={() => {
                const dataSource = table.current.getDataSource()
                console.log(dataSource)
              }}
            >
            点击保存数据
            </Button>
            <Button
              onClick={() => {
                table.current.update((ele) => {
                  if(ele.field1 === '1-field0-0'){
                    return { ...ele,  'field1': '修改成功'}
                  }
                  return ele
                })
              }}
            > 点击修改数据 </Button>
            <Button
              onClick={() => {
                table.current.update((ele) => {
                  if (ele.$index === 0){
                    return { ...ele, 'testfield0': '修改成功'}
                  }
                  return ele
                })
              }}
            > 点击修改不在列里面的数据 </Button>
            <Button
              disabled={disable}
              onClick={() => {
                table.current.reload({})
              }}
            > 重新装载数据 </Button>
            <Button
              onClick={() => {
                console.log(table.current.getSelect())
              }}
            > 获取表格选中的数据 </Button>
              <Button
              onClick={() => {
                if(disable){
                  setDisable(false)
                  setGroupField([])
                }else{
                  setGroupField(['field1','field2'])
                  setDisable(true)
                }
              }}
            > {disable ? '取消字段分组': '字段一分组'} </Button>
            <Button
              onClick={async () => {
                table.current.add([{
                  field0: '1231'
                }], 1)
              }}
            >
              新增数据
            </Button>
             <Button
              onClick={async () => {
                setColumns([])
              }}
            >
              清空列
            </Button>
            <Button
              onClick={async () => {
                const selects = table.current.getSelect()
                console.log(selects)
                table.current.del(ele => {
                  return selects.has(ele.field0)
                })
              }}
            >
              删除选中数据
            </Button>
          </Space>
        </div>
        <Table
            columns={columns}
            overlay={()=>{
              return (
                <Menu>
                  <Menu.Item
                    key="1"
                    onClick={()=>{
                        console.log(table.current.rightContext())
                    }}>
                        打印右键的上下文信息
                    </Menu.Item>
                </Menu>
              )
            }}
            expandable={{
              expandedRowRender: () => {
                return <div style={{height: 200}}> 这是一个可展开的节点数据</div>
              }
            }}
            onRowsUpdate={(e, onCommit) => {
              console.log(e, 'onRowsUpdate')
              onCommit()
            }}
            pageSize={500}
            table={table}
            // mode='SIMPLE'
            selectBox="multiple"
            rowKey='field0'
            groupColumn={groupField}
            onSort={ sortColumns => {
              console.log(sortColumns)
            }}
            onSelectedRowsChange={changes => {
              console.log(changes, 'onSelectedRowsChange')
            }}
            onRowClick={(rowIdx, row, column) => {
              toDoubleClick(() => {
                console.log('这是双击事件')
              })
            }}
            loadData={(pageNo , pageSize, params) => {  
              return new Promise((resolve) =>{
                const datas = []
                for(let i=0; i< 50 ; i++){
                  const data = {}
                  for(let z=0; z< 1000 ; z ++){
                    if(z === 1){
                      data[`field${z}`] = `${pageNo}-field${i%2}-${i%2}`;
                    }else{
                      data[`field${z}`] = `${pageNo}-field${i%5}-${i%5}`;
                    }
                  }
                  data.field0= `${pageNo}-field${i}-${i}`;
                  datas.push(data)
                }
                setTimeout(() => {
                    resolve({
                        datas,
                        total: 2000,
                    })
                }, 1000);
              })
            }}
          /> 
      </>
    )
}

export default MyTable;
```

```jsx
/**
 * title: 简约类型的表格
 * desc: 只有表格信息，没有其他
 */

import React, { useState } from 'react'
import { Table, Input} from '@rwp/react-ui'
import { Menu, Button, DatePicker } from 'antd'
import moment from 'moment'

export default () => {
    const table = React.useRef()
    return (
        <div
           style={{
            height: 400,
          }}
        >
          <Table
            columns={[{
              name: `field0`,
              title: `文本编辑器`,
              editable: true,
              editor: Input
            },{
              name: `date`,
              title: `日期编辑器`,
              editable: true,
              editor: (props) => {
                return (
                  <DatePicker
                    showTime
                    style={props.style}
                    placeholder="选择日期"
                    value={moment(props.value || 0)}
                    onChange={(e) => {
                      table.current.update((ele) => {
                        return { ...ele, 'field2': '修改成功', 'field3': '修改二' }
                      })
                      props.onChange(e.valueOf())
                    }}
                  />
                )
              }
            },{
              name: `field2`,
              title: `字段-2`,
            },{
              name: `field3`,
              title: `字段-3`,
            },{
              name: `field4`,
              title: `字段-4`,
            },{
              name: `field5`,
              title: `字段-5`,
            },{
              name: `field6`,
              title: `字段-6`,
            },{
              name: `field7`,
              title: `字段-7`,
            },{
              name: `field8`,
              title: `字段-8`,
            },{
              name: `field9`,
              title: `字段-9`,
            },{
              name: `field10`,
              title: `字段-10`,
            }]}
            table={table}
            onRowsUpdate={(e, onCommit) => {
              console.log(e, 'onRowsUpdate')
              console.log(table.current.getDataSource())
              onCommit()
            }}
            mode='SIMPLE'
            loadData={(pageNo , pageSize, params) => {  
              return new Promise((resolve) =>{
                const datas = []
                for(let i=0; i< 50 ; i++){
                  const data = {}
                  for(let z=0; z< 1000 ; z ++){
                    data[`field${z}`] = `${pageNo}-field${i}-${i}-这是一个超级超级超级长的内容来进行测试`;
                  }
                  datas.push(data)
                }
                setTimeout(() => {
                    resolve({
                        datas,
                        total: 2000,
                    })
                }, 1000);
              })
            }}
          /> 
        </div>
    )
}
```


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
|selectBox      | 启动选择框   | `'multiple'` &#124; `'none'` | `'none'`
|groupColumn    | 启动分组,根据列的name来进行分组     | `string[]` | `[]`
|groupRenderer        | 渲染分组行的的render, 可拦截重新填充值 | `React.ComponentType`| -
|rowKey| 用户唯一的rowKey| `string`|
|overlay | 右键菜单   | `React.ReactElement`&#124;`OverlayFunc`|
|onSort      | 排序触发的事件| `(sortColumns: SortColumn[]) => void;`| -
|onRowClick  | 表格的row的点击事件| `(rowIdx: number, row: T, column: CalculatedColumn<T>) => void;`
|onRowsUpdate| 用户更新表格触发的事件| ` <E extends RowsUpdateEvent>(event: E, onCommit: () => void) => Promise<boolean>;`
|onSelectedRowsChange| 用户改变行选择框的时候触发事件| `onSelectedRowsChange?: (selectedRows: Set<Row[keyof Row]>) => void`
|table       | 用来获取当前的表格进行数据操作 | `TableHandle`
|rowClass | 设置当前行的class名称 | `(row: T) => string` \| `undefined`;

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