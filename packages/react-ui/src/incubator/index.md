---
nav:
  title: 组件
  path: /components
group:
  path: /components/plug-in
  title: 插件
title: Incubator 预览/编辑 Office
---

# Incubator 预览/编辑 Office

`incubator` 是日本动画《魔法少女小圆》中角色, 中文名 '丘比', 日语 'キュウべえ', 它可以和普通的少女签订契约，在契约签订时可以实现少女一个愿望，魔法少女的能力可能是根据签订契约时许下的愿望而定。

自称“魔法的使者”，宛如吉祥物的四足步行动物。没有性别，以男性化的“僕（ぼく）”自称。真面目是孵化器，外星生命的终端。除了自己选定的人，无法被其他人看见，可透过心灵感应与特定对象沟通。基本上没有表情，除进食外皆不张口。能以实现任一愿望的代价，将少女的灵魂制成灵魂宝石。使命是交换魔法少女的“契约”，也负责回收悲叹之种。透过从旁说明、构筑多人心灵感应等方式，对魔法少女提供必要协助。

多个相同身体可同时存在，但个别个体不存在独立的观念，所有身体皆共享同一意识。

## 孵化者的图片如下

![QB](/img/qb.jpg)

> 一个卡哇伊的，来自外界的可爱生物~

## 代码演示

<code src="./demo/simple.tsx" />

## API


|属性            |说明	       |类型	  |默认属性
|-----           |------       |-----     |-----    
|downloadAddress |下载插件的地址 | string  | -
|incubator       |当前插件的方法 | IncubatorHandle


### IncubatorHandle 

|方法            |说明	       | 参数	  
|-----           |------      |------------
|openPreviewFile     |预览组件     | PreviewFileParams
|openEditorFile      |编辑组件     | EditorFileParams
