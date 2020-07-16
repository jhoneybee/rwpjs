import React, { CSSProperties } from 'react';
import { QRLine } from 'react-qrbtf-temp'


interface QRCodeProps{
    // 二维码内容
    value: string
    // 当前组件的样式
    style?: CSSProperties
}

export const QRCode = (props: QRCodeProps) => {
    const { style = { width: 120, height: 120 }, value = '' } = props
    // M L H Q 0 1 2 3
    return <QRLine value={value} posType="roundRect" direction="h-v" styles={{ svg: style }} level="Q"/>
}
