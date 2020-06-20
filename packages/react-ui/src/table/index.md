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
 * desc: 展示一个简单的表格来获取数据
 */

import React from 'react'
import { Table, Input } from '@rwp/react-ui'


export default () => {
    return (
        <>
          <Table
            columns={[{
              name: 'field1',
              title: '字段一',
              width: 120,
              editable: true,
              editor: Input
            },{
              name: 'field2',
              title: '字段二',
              width: 120,
              editable: false,
              editor: Input
            },{
              name: 'field3',
              title: '字段三',
              width: 120,
            },{
              name: 'field4',
              title: '字段四',
              width: 120,
            },{
              name: 'field5',
              title: '字段五',
              width: 120,
            },{
              name: 'field6',
              title: '字段六',
              width: 120,
            },{
              name: 'field7',
              title: '字段七',
              width: 120,
            },{
              name: 'field8',
              title: '字段八',
              width: 120,
            },{
              name: 'field9',
              title: '字段九',
              width: 120,
            },{
              name: 'field10',
              title: '字段十',
              width: 120,
            },{
              name: 'field11',
              title: '字段十一',
              width: 120,
            },{
              name: 'field12',
              title: '字段十二',
              width: 120,
            },{
              name: 'field13',
              title: '字段十三',
              width: 120,
            },{
              name: 'field14',
              title: '字段十四',
              width: 120,
            },{
              name: 'field15',
              title: '字段十五'
            }]}
            loadData={(pageNo , pageSize, params) => {  
              return new Promise((resolve) =>{
                const datas = []
                for(let i=0; i< 50 ; i++){
                    datas.push({
                        field1: `${pageNo}-name-${i}`,
                        field2: `${pageNo}-six-${i}`,
                        field3: `${pageNo}-six-${i}`,
                        field4: `${pageNo}-six-${i}`,
                        field5: `${pageNo}-six-${i}`,
                        field6: `${pageNo}-six-${i}`,
                        field7: `${pageNo}-six-${i}`,
                        field8: `${pageNo}-six-${i}`,
                        field9: `${pageNo}-six-${i}`,
                        field10: `${pageNo}-six-${i}`,
                        field11: `${pageNo}-six-${i}`,
                        field12: `${pageNo}-six-${i}`,
                        field13: `${pageNo}-six-${i}`,
                        field14: `${pageNo}-six-${i}`,
                        field15: `${pageNo}-six-${i}`,
                    })
                }
                console.log(datas)
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


```jsx
/**
 * title: 空数据表格
 * desc: 展示一个空的数据表格
 */

import React from 'react'
import { Table, Input } from '@rwp/react-ui'


export default () => {
    return (
        <>
          <Table
            columns={[{
              name: 'field1',
              title: '字段一',
              width: 120,
              editable: true,
              editor: Input
            },{
              name: 'field2',
              title: '字段二',
              width: 120,
              editable: false,
              editor: Input
            },{
              name: 'field3',
              title: '字段三',
              width: 120,
            },{
              name: 'field4',
              title: '字段四',
              width: 120,
            },{
              name: 'field5',
              title: '字段五',
              width: 120,
            },{
              name: 'field6',
              title: '字段六',
              width: 120,
            },{
              name: 'field7',
              title: '字段七',
              width: 120,
            },{
              name: 'field8',
              title: '字段八',
              width: 120,
            },{
              name: 'field9',
              title: '字段九',
              width: 120,
            },{
              name: 'field10',
              title: '字段十',
              width: 120,
            },{
              name: 'field11',
              title: '字段十一',
              width: 120,
            },{
              name: 'field12',
              title: '字段十二',
              width: 120,
            },{
              name: 'field13',
              title: '字段十三',
              width: 120,
            },{
              name: 'field14',
              title: '字段十四',
              width: 120,
            },{
              name: 'field15',
              title: '字段十五'
            }]}
            loadData={(pageNo , pageSize, params) => {  
              return new Promise((resolve) =>{
                const datas = []
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