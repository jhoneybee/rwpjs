---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: ConfigProvider 全局化配置
---

# ConfigProvider 全局化配置

## 代码演示

```tsx
/**
 * title: 基本用法
 * desc: 配置全局的语言
 */

import React from 'react'
import { DatePicker, ConfigProvider } from '@rwp/react-ui'
import zhCN from 'antd/es/locale/zh_CN';

export default () => {
    return (
         <ConfigProvider locale={zhCN}>
            <DatePicker style={{ margin: 8}}  />
            <DatePicker style={{ margin: 8}} picker="week" />
            <DatePicker style={{ margin: 8}} picker="month" />
            <DatePicker style={{ margin: 8}} picker="quarter" />
            <DatePicker style={{ margin: 8}} picker="year" />
        </ConfigProvider>
    )
}
```

## API

按钮的属性说明如下：

|属性        |说明	       |类型	     
|-----      |------       |-----     
|autoInsertSpaceInButton|设置为 false 时，移除按钮中 2 个汉字之间的空格| boolean
|componentSize|设置 antd 组件大小 | `small` \| `middle` \| `large`
|csp|设置 Content Security Policy 配置| `{ nonce: string }`
|form|设置 Form 组件的通用属性| `{ validateMessages?: ValidateMessages }`
|input|设置 Input 组件的通用属性| `{ autoComplete?: string }`
|renderEmpty| 自定义组件空状态| `function(componentName: string): ReactNode`
|getPopupContainer|弹出框（Select, Tooltip, Menu 等等）渲染父节点，默认渲染到 body 上。| `function(triggerNode)`
|getTargetContainer|配置 Affix、Anchor 滚动监听容器。| `() => HTMLElement`
|locale| 语言包配置，语言包可到 antd/es/locale 目录下寻找| `object`
|prefixCls|设置统一样式前缀。注意：这将不会应用由 antd 提供的默认样式| `string`
|pageHeader|统一设置 PageHeader 的 ghost，参考 PageHeader| `{ ghost: boolean }`
|direction |设置文本展示方向。| `ltr` \| `rtl`
|space	 | 设置 Space 的 size | 
|virtual | 	设置 false 时关闭虚拟滚动 | `boolean`
|dropdownMatchSelectWidth| 下拉菜单和选择器同宽。默认将设置 min-width，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动|`boolean` \| `number`

> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts