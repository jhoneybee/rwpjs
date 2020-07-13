---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Tabs 标签页
---

# Tabs 标签页


```tsx
/**
 * title: 一个简单的Tabs
 * desc: 这里演示了一个简单的Tabs
 */

import React from 'react'
import { Tabs } from '@rwp/react-ui'

export default () => {
    return (
        <>
         <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Tab 1" key="1">
            面板一
          </Tabs.TabPane>
          <Tabs.TabPane tab="Tab 2" key="2">
            面板二
          </Tabs.TabPane>
          <Tabs.TabPane tab="Tab 3" key="3">
            面板三
          </Tabs.TabPane>
        </Tabs>
        </>
    )
}
```

## API

Tabs 属性说明如下：

|属性            |说明	                                              |类型	                          
|-----          |------                                              |-----                         
|addIcon        |	自定义添加按钮                                      |`ReactNode`
|activeKey      | 当前激活 tab 面板的 key                             |`string`
|animated       | 是否使用动画切换 Tabs                               |`boolean`
|renderTabBar   | 替换 TabBar,用于二次封装标签头                      |`(props: DefaultTabBarProps, DefaultTabBar: React.ComponentClass) => React.ReactElement`
|defaultActiveKey| 初始化选中面板的 key,如果没有设置 activeKey       |`string`
|hideAdd         | 是否隐藏加号图标,在 `type="editable-card"` 时有效  |`boolean`
|size            | 大小,提供 large default 和 small 三种大小          |`string`
|centered        | 标签居中展示                                      |`boolean`
|tabBarExtraContent|tab bar 上额外的元素                             |`ReactNode`
|tabBarGutter      | tabs 之间的间隙                                |`number`
|tabBarStyle       | tab bar 的样式对象                             |`object`
|tabPosition       | 页签位置，可选值有 `top` `right` `bottom` `left`|`string`
|type              | 页签的基本样式，可选 `line`,`card` `editable-card` 类型|`string`
|onChange          | 切换面板的回调                                   | `function(activeKey) {}`
|onEdit            | 新增和删除页签的回调，在 `type="editable-card"` 时有效| `(targetKey, action): void`
|onTabClick        | tab 被点击的回调                                    |`function(key: string, event: MouseEvent)`
|onTabScroll       | tab 滚动时触发                                      |
|keyboard          | 开启键盘切换功能                                    | `boolean`


## Tabs.TabPane

|属性          |说明	       |类型	     
|-----        |------       |-----     
|forceRender  | 被隐藏时是否渲染 DOM 结构 | `boolean`
|key          | 对应 activeKey           | `string`
|tab          | 选项卡头显示文字          | `string` \| `ReactNode`
|closeIcon    | 自定义关闭图标,在 `type="editable-card"`时有效| `ReactNode`

> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts