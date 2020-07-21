---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Dropdown 下拉菜单
---

# Dropdown 下拉菜单


## API

属性说明如下：

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|arrow      |下拉框箭头是否显示|`boolean`|`false`	
|disabled   |菜单是否禁用|`boolean`|	-
|getPopupContainer|菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。|`function(triggerNode)`|`() => document.body`
|overlay|菜单|	`Menu | () => Menu`|	-
|overlayClassName|下拉根元素的类名称|`string`| 	-
|overlayStyle|下拉根元素的样式|`object`| -
|placement|菜单弹出位置: `bottomLeft` `bottomCenter` `bottomRight` `topLeft` `topCenter` `topRight`|`string`|	-
|trigger|触发下拉的行为, 移动端不支持 `hover`|	`Array`|`bottomLeft` | [`hover`]
|visible|菜单是否显示|`boolean`|-
|onVisibleChange|	菜单显示状态改变时调用,参数为 `visible`|`function(visible)`|-

overlay 菜单使用 Menu，还包括菜单项 Menu.Item，分割线 Menu.Divider。

> 注意: Menu.Item 必须设置唯一的 key 属性。
> Dropdown 下的 Menu 默认不可选中。如果需要菜单可选中，可以指定 `<Menu selectable>`


## Dropdown.Button

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----   
|disabled   |菜单是否禁用  |`boolean` |-
|icon       |右侧的 icon   |`ReactNode`|-
|overlay    |菜单          |`Menu`|-
|placement  |菜单弹出位置: `bottomLeft` `bottomCenter` `bottomRight` `topLeft` `topCenter` `topRight`|`string`|`bottomLeft`
|size       |按钮大小，和 `Button` 一致|`string`|`default`
|trigger    |触发下拉的行为|	`Array`|`[hover]`
|type       |按钮类型，和 `Button` 一致|`string`|`default`
|visible    |菜单是否显示|`boolean`| -
|onClick    |点击左侧按钮的回调，和 Button 一致|`function`| -
|onVisibleChange|菜单显示状态改变时调用，参数为 `visible`|`function`| -
|buttonsRender |自定义左右两个按钮| `([buttons: ReactNode[]]) => ReactNode`| -

> 更多详细信息查看 https://github.com/jhoneybee/rwpjs/blob/master/packages/react-ui/src/interface.ts