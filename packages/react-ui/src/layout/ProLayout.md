---
nav:
  title: 组件
  path: /components
group:
  path: /components/layout
  title: 布局组件
title: ProLayout 主页面布局
---

# ProLayout 主页面布局

在 ProLayout 中我们抽象了三种布局方式，分别的 `side`,`top` 和 `mix` 。

## 代码演示

```tsx
/**
 * title: 基础用法
 * desc: 用于一般系统的主布局信息 可参照 https://preview.pro.ant.design/
 */

import React from 'react'
import { ProLayout } from '@rwp/react-ui'

export default () => {
    return (
        <div
            style={{
                height: 500
            }}
        >
            <ProLayout
                logo="https://user-images.githubusercontent.com/24241052/87794040-a6e6dd80-c878-11ea-88c0-431516e0bbfe.png"
                title="RWP.JS"
            />
        </div>
    )
}
```

## API

按钮的属性说明如下：

|属性        |说明	       |类型	     |默认值
|-----      |------       |-----      |-------
|pure|是否删除掉所有的自带界面|`boolean`
|title|layout 的 左上角 的 title|`ReactNode`
|logo|layout 的 左上角 logo 的 url|`ReactNode` \| `()=>ReactNode`
|loading|layout 的加载态|`boolean`
|menuHeaderRender|渲染 logo 和 title|`ReactNode` \| `(logo,title)=>ReactNode`
|onMenuHeaderClick|menu 菜单的头部点击事件|`(e: React.MouseEvent<HTMLDivElement>) => void`
|contentStyle|layout 的 内容区 style|`CSSProperties`
|layout|layout 的菜单模式,side：右侧导航，top：顶部导航 mix：混合模式|`'side'` \| `'top'` \| `'mix'`
|splitMenus|是否自动切分 menuData，只有 mix 模式会生效|`boolean`
|contentWidth|layout 的内容模式,Fluid：定宽 1200px，Fixed：自适应| `'Fluid'` \| `'Fixed'`
|navTheme|导航的主题|`'light'` \| `'dark'`
|fixedHeader|是否固定 header 到顶部| `boolean`
|fixSiderbar|是否固定导航| `boolean`
|breakpoint|触发响应式布局的断点| `Enum { 'xs', 'sm', 'md', 'lg', 'xl', 'xxl' }`
|menu|关于 menu 的配置，暂时只有 locale,locale 可以关闭 menu 的自带的全球化| `{ locale: boolean, defaultOpenAll: boolean }`
|iconfontUrl|使用 IconFont 的图标配置| `string`
|locale|当前 layout 的语言设置 | `'zh-CN'` \| `'zh-TW'` \| `'en-US'`
|settings|layout 的设置 |`Settings`
|siderWidth|侧边菜单宽度| `number`
|collapsed|控制菜单的收起和展开| `boolean`
|onCollapse|菜单的折叠收起事件| `(collapsed: boolean) => void`
|headerRender|自定义头的 render 方法| `(props: BasicLayoutProps) => ReactNode`
|itemRender|自定义面包屑的子节点,默认使用了 a 节点| (`route: Route, params: any, routes: Array<Route>, paths: Array<string>) => React.ReactNode`
|rightContentRender|自定义头右部的 render 方法| `(props: HeaderViewProps) => ReactNode`
|collapsedButtonRender|自定义 collapsed button 的方法| `(collapsed: boolean) => ReactNode`
|footerRender|自定义页脚的 render 方法| `(props: BasicLayoutProps) => ReactNode`
|pageTitleRender|自定义页面标题的显示方法| `(props: BasicLayoutProps) => ReactNode`
|menuRender|自定义菜单的 render 方法 | `(props: HeaderViewProps) => ReactNode`
|menuContentRender|菜单内容的 render 方法| `(props: HeaderViewProps) => ReactNode`
|menuItemRender|自定义菜单项的 render 方法| `(itemProps: MenuDataItem) => ReactNode`
