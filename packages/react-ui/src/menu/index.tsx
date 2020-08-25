/**
 * 导航菜单
 */

import React, { FunctionComponent, FC } from 'react'
import { Menu as AntMenu } from 'antd'
import { DividerProps } from 'rc-menu/es/Divider'
import { MenuItemGroupProps } from 'rc-menu/es/MenuItemGroup'
import { MenuProps } from 'antd/es/menu'
import { MenuItemProps } from 'antd/es/menu/MenuItem'
import { SubMenuProps } from 'antd/es/menu/SubMenu'


interface MenuType extends FC<MenuProps>{
    Item: FunctionComponent<MenuItemProps>
    SubMenu: FunctionComponent<SubMenuProps>
    ItemGroup: FunctionComponent<MenuItemGroupProps>
    Divider: FunctionComponent<DividerProps>
}

export const Menu = ((props: MenuProps) => <AntMenu {...props} />) as unknown as MenuType

Menu.Item = (props: MenuItemProps) => (
    <AntMenu.Item
        {...props}
        onClick={info => {
            info.domEvent.stopPropagation()
            props.onClick?.(info)
        }}
    />
)

const { Divider, SubMenu, ItemGroup } = AntMenu

Menu.Divider = (props: DividerProps) => <Divider {...props} />
Menu.SubMenu = (props: SubMenuProps) => <SubMenu {...props} />
Menu.ItemGroup = (props: MenuItemGroupProps) => <ItemGroup {...props} />