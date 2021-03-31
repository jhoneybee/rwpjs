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

<code src="./demo/simple.tsx" />

<code src="./demo/multiple.tsx" />

## 代码演示

|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|onChange  |图片改变的时候触发的事件|`(images: UploadImageType[]) => void`|-
|images    |要展现的图片 | `Image[]` | `[]`
|onUpload  |图片上传的事件| `(file: FileList) => Promise<UploadImageType[]>`| -
|style     |样式  | `CSSProperties` | -
|actionRender| 动作的按钮渲染| `ComponentType<{className: string, children: ReactNode}>` 
|multiple    | 是否是多选, `false` 表示单选    | `boolean` | `false`
|accept      | 设置可以上传的后缀 | `string` | -