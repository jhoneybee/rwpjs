---
nav:
  title: 组件
  path: /components
group:
  path: /components/input
  title: 数据录入
title: Upload 文件上传
---

# Upload 文件上传



## 代码演示

```jsx
/**
 * title: 图片墙
 * desc: 用来上传图片,已经展现一组图片。
 */

import React, { useState, useEffect } from 'react'
import { UploadPicturesWall } from '@rwp/react-ui'

export default () => {
    const [images, setImages] = useState([])
    
    useEffect(() => {
      setImages([{
        id: '1',
        url: 'https://user-images.githubusercontent.com/24241052/91524537-0b925f00-e932-11ea-8f8d-d037d9520059.jpg',
        fileName: '可爱的小姐姐'
      }])
    }, [])
    return (
        <UploadPicturesWall
            images={images}
            onChange={(images) => {
              console.log(images)
            }}
            onUpload={async (file) => {
              const reader = new FileReader();
              return new Promise(resolve => {
                reader.readAsDataURL(file);
                reader.onload = function () {
                  const { result } = this
                  // 模拟网络延迟
                  setTimeout(() => {
                    resolve({
                      id: `${new Date().getTime()}`,
                      name: `${new Date().getTime()}`,
                      url: result,
                      state: 'SUCCESS'
                    })
                  }, 1000)
                }
              })
            }}
        />
    )
}
```

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|onChange  |图片改变的时候触发的事件|`(images: Image[]) => void`|-
|images    |要展现的图片 | `Image[]` | `[]`
|onUpload  |图片上传的事件| `(file: File) => Promise<Image>`| -
|style     |样式  | `CSSProperties` | -
|actionRender| 动作的按钮渲染| `ComponentType<{className: string, children: ReactNode}>` 
