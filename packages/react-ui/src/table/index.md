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

```jsx
/**
 * title: 简单的表格
 * desc: 包含了一千列的数据
 */

import React from 'react'
import { Table, Input } from '@rwp/react-ui'
import { Menu } from 'antd'

const getColumns = () => {
  const columns = []
  for(let i=0; i< 1000 ; i ++){
    columns.push({
      name: `field${i}`,
      title: `字段-${i}`,
      width: 120,
      editable: true,
      editor: Input
    })
  }
  return columns
}

export default () => {
    return (
        <>
          <Table
            columns={getColumns()}
            contextMenu={()=>{
              return (
                <Menu>
                  <Menu.Item key="1" onClick={()=>{}}>row</Menu.Item>
                  <Menu.Item key="2" onClick={()=>{}}>row index</Menu.Item>
                  <Menu.Item key="3" onClick={()=>{}}>column</Menu.Item>
                </Menu>
              )
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

| 参数      | 说明       | 类型     | 默认值 |
| ---      | ---        | ---     | --- |
|loadData  | 装载数据   |`(pageNo: number, pageSize: number, params: Object) => PromiseLike<{total: number, datas: T[]}>`| 无
|pageSize  | 初始化页面的分页大小| `number` | `50`
|params    | 装载数据的参数      | `Object` | `{}`
|enableInitLoadData| 是否初始化的时候自动装载数据 | `boolean` | `true`
|enableCellCopyPaste| 启动复制和粘贴 | `boolean` | `true`
|enableCellDragAndDrop| 启动下拉编辑 | `boolean` | `true`
|width | 表格的宽度 | `number` |
|height| 表格的高度 | `number` |
|rowKey| 用户唯一的rowKey| `string`|
|contextMenu| 右键菜单   | `React.ReactElement`&#124;`OverlayFunc`|
|onRowsUpdate| 更新数据触发的事件 | `onRowsUpdate?: (update: RowsUpdateEvent) => PromiseLike<boolean>`


### Column 列

| 参数      | 说明       | 类型     | 默认值 |
| ---      | ---        | ---     | --- |
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