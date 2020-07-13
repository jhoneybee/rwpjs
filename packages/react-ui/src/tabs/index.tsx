import React from 'react'
import { Tabs as AntTabs } from 'antd'
import { TabsProps } from 'antd/lib/tabs'

export const Tabs = (props: TabsProps) => <AntTabs {...props}/>

Tabs.TabPane = AntTabs.TabPane
