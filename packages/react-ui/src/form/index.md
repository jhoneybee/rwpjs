---
nav:
  title: 组件
  path: /components
group:
  path: /components
  title: 基础组件
title: Form 表单组件
---

# Form 表单组件

## 代码演示


```tsx
/**
 * title: 简单的表单
 * desc: 一个简单的表单演示
 */

import React from 'react'
import { Form, Input } from '@rwp/react-ui'


export default () => {

    return (
        <Form
            cols={5}
            onValuesChange={(changedValues, allValues) => {
              console.log(changedValues)
              console.log(allValues)
            }}
        >
          <Form.Item key="Field 0" name="Field 0" label="字段 0">
            <Input />
          </Form.Item>
          <Form.Item key="Field 1" name="Field 1" label="字段 1" colSpan={2}>
            <Input />
          </Form.Item>
          <Form.Item key="Field 2" name="Field 2" label="字段 2">
            <Input />
          </Form.Item>
          <Form.Item key="Field 3" name="Field 3" label="字段 3">
            <Input />
          </Form.Item>
          <Form.Item key="Field 4" name="Field 4" label="字段 4">
            <Input />
          </Form.Item>
          <Form.Item key="Field 5" name="Field 5" label="字段 5">
            <Input />
          </Form.Item>
          <Form.Item key="Field 6" name="Field 6" label="字段 6">
            <Input />
          </Form.Item>
          <Form.Item key="Field 7" name="Field 7" label="字段 7">
            <Input />
          </Form.Item>
          <Form.Item key="Field 8" name="Field 8" label="字段 8">
            <Input />
          </Form.Item>
          <Form.Item key="Field 9" name="Field 9" label="字段 9" br colSpan={5}>
            <Input />
          </Form.Item>
        </Form>
    )
}
```

```tsx
/**
 * title: 表单联动
 * desc: 通过一个字段改变另外一个字段的组件,基于`shouldUpdate`
 */

import React from 'react'
import { Form, Input, Checkbox } from '@rwp/react-ui'


export default () => {
    return (
        <Form
            cols={5}
            onValuesChange={(changedValues, allValues) => {
              console.log(changedValues)
              console.log(allValues)
            }}
        >
          <Form.Item key="Field 0"  name="Field0" label="字段 0">
            <Input placeholder="请输入任何字符" />
          </Form.Item>
          <Form.Item
            key="Field 1"
            shouldUpdate={(prevValues, curValues) => prevValues.Field0 !== curValues.Field0}
          >
            {({ getFieldValue  }) => {
                  const Field0 = getFieldValue('Field0') || '';
                  if(Field0 !== ''){
                      return  (
                        <Form.Item name="checkbox" label="输入框二">
                            <Input />
                        </Form.Item>
                      )
                  }
                  return  (
                        <Form.Item name="input" label="输入框一">
                            <Input />
                        </Form.Item>
                    )
            }}
          </Form.Item>
           <Form.Item key="Field 4" name="Field 4" label={<span>你好</span>}>
            <Input />
          </Form.Item>
          <Form.Item key="Field 5" name="Field 5" label="字段 5">
            <Input />
          </Form.Item>
          <Form.Item key="Field 6" name="Field 6" label="字段 6">
            <Input />
          </Form.Item>
          <Form.Item key="Field 7" name="Field 7" label="字段 7">
            <Input />
          </Form.Item>
          <Form.Item key="Field 8" name="Field 8" label="字段 8">
            <Input />
          </Form.Item>
        </Form>
    )
}
```

## API

按钮的属性说明如下：

|属性        |说明	       |类型	     |默认值
|-----      |------       |-----      |-------
|autoFocus  |自动获取焦点  | `boolean` | `false`
|checked    |指定当前是否选中| `boolean`| `false`
|defaultChecked|初始是否选中 | `boolean`| `false`
|disabled      |失效状态     | `boolean`| `false`
|indeterminate |设置 indeterminate 状态，只负责样式控制| `boolean`| `false`
|onChange | 变化时回调函数 | `Function(e:Event)` | -


## Checkbox.Group

|属性          |说明	       |类型	     |默认值
|-----        |------       |-----      |-------
|defaultValue |默认选中的选项 |`string[]`| []
|disabled     |整组失效      |`boolean`  | false
|name         |CheckboxGroup 下所有 `input[type="checkbox"]` 的 name 属性| string| -
|options      |指定可选项    |`string[]`&#124;`Option[]` | []
|value        |指定选中的选项|`string[]` | []
|onChange     |变化时回调函数	|`Function(checkedValue)` | -


## 方法

|名称        |描述	       
|-----      |------       
|blur()     |移除焦点	
|focus()    |获取焦点

> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts