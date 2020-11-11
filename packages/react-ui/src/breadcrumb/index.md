---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Breadcrumb 面包屑
---

# Breadcrumb 面包屑

## 代码演示

<code src="./demo/simple.tsx" />

## API

### Descriptions

| 参数      | 说明        | 类型       | 默认值
|-------    |-----       |-----      |-------
|itemRender |自定义链接函数，和 react-router 配置使用| 	`(route, params, routes, paths) => ReactNode` | -
|params     |路由的参数 | `object` | -
|routes     |router 的路由栈信息 | `routes[]` | -
|separator  |分隔符自定义 | `ReactNode` | `/`


### Breadcrumb.Item

| 参数      | 说明                       | 类型       | 默认值
|-------    |-----                      |-----      |-------
|dropdownProps|弹出下拉菜单的自定义配置   |`Dropdown` | -
|href         |链接的目的地              |`string`| -
|overlay      |下拉菜单的内容            |`Menu` \| `() => Menu`| -
|onClick      |单击事件                  |`(e:MouseEvent) => void`| -

### Breadcrumb.Separator

| 参数      | 说明                       | 类型       | 默认值
|-------    |-----                      |-----      |-------
|children   |要显示的分隔符              |`ReactNode` | `/`

> 注意：在使用 `Breadcrumb.Separator` 时，其父组件的分隔符必须设置为 `separator=""`，否则会出现父组件默认的分隔符。


