---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Menu 导航菜单
---

# Menu 导航菜单

```tsx
import React from 'react'
import { Menu } from '@rwp/react-ui'
import { MailOutlined, SettingOutlined, AppstoreOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

export default () => {
  return (
      <Menu
        style={{ width: 256 }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
        <SubMenu
          key="sub1"
          title={
            <span>
              <MailOutlined />
              <span>Navigation One</span>
            </span>
          }
        >
          <Menu.ItemGroup key="g1" title="Item 1">
            <Menu.Item key="1">Option 1</Menu.Item>
            <Menu.Item key="2">Option 2</Menu.Item>
          </Menu.ItemGroup>
          <Menu.ItemGroup key="g2" title="Item 2">
            <Menu.Item key="3">Option 3</Menu.Item>
            <Menu.Item key="4">Option 4</Menu.Item>
          </Menu.ItemGroup>
        </SubMenu>
        <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
          <Menu.Item key="5">Option 5</Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
          <SubMenu key="sub3" title="Submenu">
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item>
          </SubMenu>
        </SubMenu>
        <SubMenu
          key="sub4"
          title={
            <span>
              <SettingOutlined />
              <span>Navigation Three</span>
            </span>
          }
        >
          <Menu.Item key="9">Option 9</Menu.Item>
          <Menu.Item key="10">Option 10</Menu.Item>
          <Menu.Item key="11">Option 11</Menu.Item>
          <Menu.Item key="12">Option 12</Menu.Item>
        </SubMenu>
      </Menu>
  )
}

```

## API

属性说明如下：

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|defaultOpenKeys |初始展开的 SubMenu 菜单项 key 数组|`string[]` |-
|defaultSelectedKeys|初始选中的菜单项 key 数组|`string[]`|-
|forceSubMenuRender|在子菜单展示之前就渲染进 DOM|`boolean`|`false`
|inlineCollapsed|inline 时菜单是否收起状态|`boolean`| -
|inlineIndent|inline 模式的菜单缩进宽度|`number`| `24`	
|mode|菜单类型，现在支持垂直、水平、和内嵌模式三种|`vertical` \| `horizontal` \| `inline`|`vertical`
|multiple|是否允许多选|`boolean` | `false`
|openKeys|当前展开的 SubMenu 菜单项 key 数组|`string[]`| -
|selectable|是否允许选中|`boolean` | `true`
|selectedKeys|当前选中的菜单项 key 数组|`string[]` | -
|style|根节点样式|`CSSProperties`| -
|subMenuCloseDelay|用户鼠标离开子菜单后关闭延时，单位:秒|`number`| `0.1`
|subMenuOpenDelay|用户鼠标进入子菜单后开启延时，单位:秒|`number`| `0`
|theme|主题颜色|`light` \| `dark` | `light`
|onClick|点击 MenuItem 调用此函数|`function({ item, key, keyPath, domEvent })`| -
|onDeselect|取消选中时调用，仅在 multiple 生效|`function({ item, key, keyPath, selectedKeys, domEvent })`|-
|triggerSubMenuAction|SubMenu 展开/关闭的触发行为|`hover` \| `click` | -
|onOpenChange|SubMenu 展开/关闭的回调|	`function(openKeys: string[])`| `hover`| -
|onSelect|	被选中时调用| `function({ item, key, keyPath, selectedKeys, domEvent })`| -
|overflowedIndicator| 自定义 Menu 折叠时的图标 | `ReactNode`| -


## Menu.Item

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|disabled   |是否禁用       |`boolean`|`false`
|key        |item 的唯一标志|`string`|-
|title      |设置收缩时展示的悬浮标题|`string`|-
|icon       |菜单图标|`ReactNode`|-
|danger     |展示错误状态样式|`boolean`|`false`

> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts