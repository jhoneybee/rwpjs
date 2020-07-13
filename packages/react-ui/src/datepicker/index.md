---
nav:
  title: 组件
  path: /components
group:
  path: /components
  title: 基础组件
title: DatePicker 日期选择框
---

# DatePicker 日期选择框

```tsx
/**
 * title: 一个简单的DatePicker
 * desc: 这里演示了一个简单的Tabs
 */

import React from 'react'
import { DatePicker, ConfigProvider } from '@rwp/react-ui'
import zhCN from 'antd/es/locale/zh_CN';

export default () => {
    return (
         <ConfigProvider locale={zhCN}>
            <DatePicker style={{ marginRight: 8}}  />
            <DatePicker style={{ marginRight: 8}} picker="week" />
            <DatePicker style={{ marginRight: 8}} picker="month" />
            <DatePicker style={{ marginRight: 8}} picker="quarter" />
            <DatePicker style={{ marginRight: 8}} picker="year" />
        </ConfigProvider>
    )
}
```
## 共同的 API

以下 API 为 DatePicker、YearPicker、MonthPicker、RangePicker, WeekPicker 共享的 API。

|属性            |说明	                                              |类型	                          
|-----          |------                                              |-----                         
|allowClear     |是否显示清除按钮                                     | `boolean`
|autoFocus      |自动获取焦点                                         | `boolean`
|className      |选择器 className                                     | `string`
|dateRender     |自定义日期单元格的内容                                | `function(currentDate: moment, today: moment) => React.ReactNode`
|disabled       |禁用                                                 | `boolean`
|disabledDate   |不可选择的日期                                        | `(currentDate: moment) => boolean`
|dropdownClassName|	额外的弹出日历 className                           | `string`
|getPopupContainer| 定义浮层的容器，默认为 body 上新建 div              | `function(trigger)`
|locale         | 国际化配置                                           | `object`
|mode           | 日期面板的状态                                         | `time` \| `date` \| `month` \| `year` \| `decade`
|open           | 控制弹层是否展开                                       | `boolean`
|picker         | 设置选择器类型                                         | `date` \| `week` \| `month` \| `quarter` \| `year`
|placeholder    | 输入框提示文字                                         | `string` | `[string, string]`	
|popupStyle     | 额外的弹出日历样式                                      | `CSSProperties`
|size           | 输入框大小, `large` 高度为 `40px`, `small` 为 `24px`, 默认是 `32px`| `large` \| `middle` \| `small`
|bordered       | 是否有边框                                              | `boolean`
|suffixIcon     | 自定义的选择框后缀图标                                   | `ReactNode`
|style          | 自定义输入框样式                                        | `CSSProperties`
|onOpenChange   | 弹出日历和关闭日历的回调                                 | `function(open)`
|onPanelChange  | 日历面板切换的回调                                       | `function(value, mode)`
|inputReadOnly  | 设置输入框为只读（避免在移动设备上打开虚拟键盘）           | `boolean`

## 共同的方法

|名称          |描述	     
|-----        |------      
|blur()       |移除焦点
|focus()      |获取焦点

### DatePicker

|属性            |说明	                                              |类型	                          
|-----          |------                                              |-----      
|defaultValue       |默认日期，如果开始时间或结束时间为 `null` 或者 `undefined`,日期范围将是一个开区间|`moment`
|defaultPickerValue |默认面板日期                                                                  |`moment`
|disabledTime       |不可选择的时间                                                                |`function(date)`
|format             |设置日期格式，为数组时支持多格式匹配，展示以第一个为准。配置参考 moment.js       |`string` \| `string[]`
|renderExtraFooter  |在面板中添加额外的页脚                                                         |`(mode) => React.ReactNode`
|showTime           |增加时间选择功能    |`Object`\| `boolean`
|showTime.defaultValue|设置用户选择日期时默认的时分秒，例子|`moment`
|showToday            |是否展示"今天"按钮|`boolean`
|value                |日期|`moment`
|onChange             |时间发生变化的回调|`function(date: moment, dateString: string)`
|onOk                 |点击确定按钮的回调|`function()`
|onPanelChange        |日期面板变化时的回调|`function(value, mode)`
|showNow              |当设定了 showTime 的时候，面板是否显示"此刻"按钮|`boolean`

### YearPicker

|属性            |说明	                                              |类型	                          
|-----          |------                                              |-----     
|defaultValue    |默认日期                 |`moment`
|defaultPickerValue|默认面板日期   | `moment`
|format |展示的日期格式，配置参考 moment.js| `string`
|renderExtraFooter|在面板中添加额外的页脚| `() => React.ReactNode`
|value | 日期 | `moment`
|onChange| 	时间发生变化的回调，发生在用户选择时间时| `function(date: moment, dateString: string)`

### MonthPicker

|属性            |说明	                                              |类型	                          
|-----          |------                                              |-----   
|defaultValue |默认日期|`moment`
|defaultPickerValue|默认面板日期|`moment`
|format|展示的日期格式，配置参考 moment.js|`string`
|monthCellRender|自定义的月份内容渲染方法| `function(date, locale): ReactNode`
|renderExtraFooter|	在面板中添加额外的页脚 | `() => React.ReactNode`
|value|日期 | `moment`
|onChange|	时间发生变化的回调，发生在用户选择时间时 | `function(date: moment, dateString: string)`

### WeekPicker

|属性            |说明	                                              |类型	                          
|-----          |------                                              |-----   
|defaultValue |默认日期|`moment`
|defaultPickerValue|默认面板日期|`moment`
|format|展示的日期格式，配置参考 moment.js|`string`
|value|日期|`moment`
|onChange|时间发生变化的回调，发生在用户选择时间时|`function(date: moment, dateString: string)`
|renderExtraFooter|在面板中添加额外的页脚|`(mode) => React.ReactNode`

### RangePicker

|属性            |说明	                                              |类型	                          
|-----          |------                                              |-----   
|allowEmpty|允许起始项部分为空|`[boolean, boolean]`
|dateRender|自定义日期单元格的内容|`function(currentDate: moment, today: moment, info: { range: start | end }) => React.ReactNode`
|defaultValue|默认日期|`moment[]`
|defaultPickerValue|默认面板日期|`moment[]`
|disabled|禁用起始项|`[boolean, boolean]`
|disabledTime|不可选择的时间|`function(dates: [moment, moment], partial)`
|format|展示的日期格式|`string`
|ranges|预设时间范围快捷选择|
|renderExtraFooter|在面板中添加额外的页脚|`() => React.ReactNode`
|separator|设置分隔符|`string`
|showTime|增加时间选择功能|`Object`\|`boolean`
|showTime.defaultValue|设置用户选择日期时默认的时分秒|`moment[]`
|value|日期|moment[]
|onCalendarChange|待选日期发生变化的回调|`function(dates: [moment, moment], dateStrings: [string, string])`
|onChange|日期范围发生变化的回调|`function(dates: [moment, moment], dateStrings: [string, string])`

> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts