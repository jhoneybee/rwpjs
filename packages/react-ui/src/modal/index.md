---
nav:
  title: 组件
  path: /components
group:
  path: /components/base
  title: 基础组件
title: Modal 对话框
---

# Modal 对话框

## 代码演示


```tsx
/**
 * title: 基础
 * desc: 基本的对话框
 */

import React, { useRef } from 'react'
import { Button, Modal, Space } from '@rwp/react-ui'

export default () => {
    const modal = useRef(null)
    const modal2 = useRef(null)
    return (
        <Space>
            <Button
              onClick={async () => {
                modal.current.show()
              }}
            >
                显示不带maskd的对话框
            </Button>
            <Button
              onClick={async () => {
                modal2.current.show()
              }}
            >
                显示带maskd的对话框
            </Button>
            <Modal
              modal={modal}
              mask={false}
              maskClosable={false}
              onOk={async () => {
                // modal2.current.show()
                return true
              }}
              title="这是一个简单的对话框"
            >
               <p>这是一个内容一</p>
               <p>这是一个内容二</p>
               <p>这是一个内容三</p>
            </Modal>

             <Modal
              modal={modal2}
              title="这是第二个简单的对话框"
            >
               <p>这是一个内容一</p>
               <p>这是一个内容二</p>
               <p>这是一个内容三</p>
            </Modal>
        </Space>
    )
}
```


## API


|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|afterClose | Modal 完全关闭后的回调| `function`
|bodyStyle  | Modal body 样式 | `object`
|cancelText | 取消按钮文字  |`string` \| `ReactNode`
|centered   | 垂直居中展示 Modal| `boolean`
|closable   | 是否显示右上角的关闭按钮| `boolean`
|closeIcon  | 自定义关闭图标| `ReactNode`
|destroyOnClose| 关闭时销毁 Modal 里的子元素| `boolean`
|footer        | 底部内容，当不需要默认底部按钮时，可以设为 footer={null}| `string` \| `ReactNode`
|forceRender   | 强制渲染 Modal | `boolean`
|getContainer  | 指定 Modal 挂载的 HTML 节点, false 为挂载在当前 dom | `HTMLElement` \| `() => HTMLElement` \| `Selectors` \| `false`
|keyboard      | 是否支持键盘 esc 关闭 | `boolean`
|mask          | 是否展示遮罩 | `boolean`
|maskClosable  | 点击蒙层是否允许关闭| `boolean`
|maskStyle     | 遮罩样式 | `object`
|okText        | 确认按钮文字| `string` \| `ReactNode`	
|okType        | 确认按钮类型 | `string`
|okButtonProps | ok 按钮 props | `ButtonProps`
|cancelButtonProps| cancel 按钮 props| `ButtonProps`
|style | 可用于设置浮层的样式，调整浮层位置等| `CSSProperties`
|title | 标题 | `string` \| `ReactNode`	
|visible| 对话框是否可见 | `boolean`
|width | 宽度 | `string` \| `number`
|wrapClassName | 对话框外层容器的类名 | `string`
|zIndex  | 设置 Modal 的 z-index | `number`
|onCancel | 点击遮罩层或右上角叉或取消按钮的回调 | `function(e)`
|onOk | 点击确定回调 | `function(e)`
