---
nav:
  title: 组件
  path: /components
group:
  path: /components/input
  title: 数据录入
title: Form 表单组件
---

# Form 表单组件

## 代码演示


```tsx
/**
 * title: 简单的表单
 * desc: 一个简单的表单演示,尽管重复设置 key，和name 很繁琐，但是根据 https://zh-hans.reactjs.org/warnings/special-props.html 需要这样做
 */

import React from 'react'
import { Form, Input, Card} from '@rwp/react-ui'


export default () => {

    return (
      <Card>
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
          <Form.Item key="Field 8" name="Field 8" rowSpan={3}>
            <div style={{ height: 100, width: 160, marginLeft: 20,backgroundColor: '#999999'}} />
          </Form.Item>
          <Form.Item key="Field 9" name="Field 9" label="字段 9" br colSpan={4}>
            <Input />
          </Form.Item>
        </Form>
      </Card>
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

Form属性说明如下：

|属性            |说明	                                              |类型	                          |默认值
|-----          |------                                              |-----                          |-------
|cols           | 当前列的总数                                        | `number`                       | `5`
|labelWidth     | Form标签的宽度                                      | `number`                       | `60`
|onFinish       | 提交表单且数据验证成功后回调事件                      | `Function(values)`             |
|onFinishFailed | 提交表单且数据验证失败后回调事件                      | `Function({ values, errorFields, outOfDate })`|
|onFieldsChange | 字段更新时触发回调事件                               | `Function(changedFields, allFields)`
|onValuesChange | 字段值更新时触发回调事件                             | `Function(changedValues, allValues)`



## Form.Item

|属性          |说明	       |类型	     |默认值
|-----        |------       |-----      |-------
|label        | 标签的文本   | `string`  | - 
|name         | 字段名       | `string` | -
|rules        | 字段校验规则  | `Rule[]` | - 
|shouldUpdate | 自定义字段更新逻辑| `(prevValue, curValue) => boolean` | -
|validateFirst| 当某一规则校验不通过时，是否停止剩下的规则的校验 | `boolean` | `false`
|hidden       | 是否隐藏字段（依然会收集和校验字段） | `boolean`| `false`
|dependencies | 设置依赖字段  | `string[]`  | -

### dependencies
当字段间存在依赖关系时使用。如果一个字段设置了 `dependencies` 属性。那么它所依赖的字段更新时，该字段将自动触发更新与校验。一种常见的场景，就是注册用户表单的"密码"与"确认密码"字段。"确认密码"校验依赖于"密码"字段，设置 `dependencies` 后，“密码”字段更新会重新触发 "校验密码" 的校验逻辑。


## FormInstance 

|属性                    |说明	                  |类型	     |默认值
|-----                  |------                  |-----      |-------
|getFieldInstance       | 获取对应字段示例         | `(name: NamePath) => any`
|getFieldValue          | 获取对应字段名的值 |`(name: NamePath) => any`
|getFieldsValue         | 获取一组字段名对应的值，会按照对应结构返回| `(nameList?: NamePath[], filterFunc?: (meta: { touched: boolean, validating: boolean }) => boolean) => any`
|getFieldError          | 获取对应字段名的错误信息|`(name: NamePath) => string[]`
|getFieldsError         | 获取一组字段名对应的错误信息，返回为数组形式|`(nameList?: NamePath[]) => FieldError[]	`
|isFieldTouched         | 检查对应字段是否被用户操作过|`(name: NamePath) => boolean`
|isFieldsTouched        | 检查一组字段是否被用户操作过，`allTouched` 为 `true` 时检查是否所有字段都被操作过|`(nameList?: NamePath[], allTouched?: boolean) => boolean`
|isFieldValidating      | 检查一组字段是否正在校验|`(name: NamePath) => boolean`
|resetFields            | 重置一组字段到 `initialValues`|`(fields?: NamePath[]) => void`
|scrollToField          | 滚动到对应字段位置|`(name: NamePath, options: [ScrollOptions]) => void`
|setFields              | 设置一组字段状态|`(fields: FieldData[]) => void`
|setFieldsValue         | 设置表单的值|`(values) => void`
|submit                 | 提交表单，与点击 `submit` 按钮效果相同|`() => void`
|validateFields         | 触发表单验证|`(nameList?: NamePath[]) => Promise`

## Rule

|属性                    |说明	                  |类型	     |默认值
|-----                  |------                  |-----      |-------
|enum                   |是否匹配枚举中的值|	`any[]`
|len	                  |string 类型时为字符串长度;number 类型时为确定数字; array 类型时为数组长度|`number`
|max                    |必须设置 type:string 类型为字符串最大长度;number 类型时为最大值;array 类型时为数组最大长度|`number`
|message                |错误信息，不设置时会通过模板自动生成|`string`
|min                    |必须设置 type：string 类型为字符串最小长度；number 类型时为最小值；array 类型时为数组最小长度|`number`
|pattern                |正则表达式匹配|`RegExp`
|required               |是否为必选字段|`boolean`
|transform              |将字段值转换成目标值后进行校验|`(value) => any`
|type                   |类型，常见有 string \|number \|boolean \|url \| email。更多请参考此处|`string`
|validator              |自定义校验，接收 Promise 作为返回值。示例参考|`(rule, value) => Promise`
|whitespace             |如果字段仅包含空格则校验不通过| `boolean`

> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts