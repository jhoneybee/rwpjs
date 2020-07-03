---
nav:
  title: Components
  path: /components
group:
  path: /components
  title: 组件
title: Table 表格
---

# Table 表格

展示和编辑行列数据。


## 代码演示

```tsx
/**
 * title: 简单的表格
 * desc: 包含了一千列的数据
 */

import React, { useState } from 'react'
import { Table, Input } from '@rwp/react-ui'
import { Menu, Button } from 'antd'

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
      align: 'center',
      editable: true,
      sortable: true,
      editor: Input
    })
  }
  return columns
}

export default () => {
    const table = React.useRef()
    const [sortDirection, setSortDirection] = useState<SortColumn[]>([]);
    return (
        <>
          <Button
            onClick={() => {
              table.current.update({
                'field1': '修改成功'
              }, (ele) => {
                return ele.field1 === '1-field0-0'
              })
            }}
          > 点击修改数据 </Button>
          <Button
            onClick={() => {
              table.current.reload({})
            }}
          > 重新装载数据 </Button>
          <Button
            onClick={() => {
              console.log(table.current.getSelect())
            }}
          > 获取表格选中的数据 </Button>
          <Table
            columns={getColumns()}
            contextMenu={()=>{
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
            table={table}
            enableSelectBox="multiple"
            rowKey='field0'
            onSort={(columnKey, direction) => {
              const newSortDirection = [];
              let existence = false;
              sortDirection.forEach(ele => {
                if (ele.columnKey === columnKey) {
                  existence = true;
                  newSortDirection.push({
                    sortDirection: direction,
                    columnKey
                  });
                } else {
                  newSortDirection.push({
                    sortDirection: ele.sortDirection,
                    columnKey: ele.columnKey
                  });
                }
              });
              if (!existence) {
                newSortDirection.push({
                  sortDirection: direction,
                  columnKey
                });
              }
              setSortDirection(newSortDirection);
            }}
            loadData={(pageNo , pageSize, params) => {  
              return new Promise((resolve) =>{
                const datas = []
                for(let i=0; i< 50 ; i++){
                  const data = {}
                  for(let z=0; z< 1000 ; z ++){
                    data[`field${z}`] = `${pageNo}-field${i}-${i}`;
                  }
                  datas.push(data)
                }
                setTimeout(() => {
                    resolve({
                        datas
                    })
                }, 1000);
              })
            }}
          /> 
        </>
    )
}
```

## API

### Table 表格

| 参数      | 说明       | 类型     | 
| ---      | ---        | ---     | --- |
|loadData  | 装载数据   |`(pageNo: number, pageSize: number, params: Object) => PromiseLike<{total: number, datas: T[]}>`
|pageSize  | 初始化页面的分页大小| `number` 
|params    | 装载数据的参数      | `Object` 
|enableInitLoadData| 是否初始化的时候自动装载数据 | `boolean` 
|enableCellCopyPaste| 启动复制和粘贴 | `boolean` | `true`
|enableCellDragAndDrop| 启动下拉编辑 | `boolean` | `true`
|width | 表格的宽度 | `number` |
|height| 表格的高度 | `number` |
|rowKey| 用户唯一的rowKey| `string`|
|contextMenu| 右键菜单   | `React.ReactElement`&#124;`OverlayFunc`|
|table       | 用来获取当前的表格进行数据操作 | `TableHandle`


### TableHandle 的方法

| 方法名称          | 说明          | 类型     
| ---              | ---            | ---   
| scrollToColumn   | 滚动到指定的列  | `(colIdx: number) => void`
| scrollToRow      | 滚动到指定的行  | `(rowIdx: number) => void`
| selectCell       | 选择指定的单元格| `(position: Position, openEditor?: boolean) => void`     
| rightContext     | 获取右键的上下文信息| `() => { row, rowIdx, column }` 
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
|width     |  列宽。如果未指定，则将根据网格宽度和其他列的指定宽度自动确定 | `number`&#124;`string`
|minWidth   | 最小列宽(px) | `number`|
|maxWidth   | 最大列宽(px)。| `number`|
|editable   | 启用单元格编辑。| `editable?: boolean `&#124;` ((row: T) => boolean);`
|resizable  | 启用列大小调整 | `boolean`|
|sortable   | 启用列排序     | `boolean`|
|sortDescendingFirst | 将列排序顺序设置为降序 | `boolean`
|frozen | 冻结列 |`boolean`
|editor | 单元格使用的编辑器| `React.ComponentType<EditorProps<T[keyof T], T, unknown>>`


> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts