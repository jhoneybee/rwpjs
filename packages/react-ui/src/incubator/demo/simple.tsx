/**
 * title: 基础
 * desc: 基本的操作演示
 */

import React, { useRef, useState } from 'react'

// eslint-disable-next-line import/no-unresolved
import { Incubator, Button, Input } from '@rwp/react-ui'

// eslint-disable-next-line import/no-unresolved
import { IncubatorHandle } from '@rwp/react-ui/dist/incubator'

export default () => {
    const [url,setUrl] = useState<string>();
    const incubator = useRef<IncubatorHandle>(null);
    return (
        <>
            <Input value={url} placeholder="请输入WORD的访问地址..." onChange={(text) => { setUrl(text)}}/>
            <br />
            <br/>
            <Button
                onClick={() => {
                    incubator.current.openPreviewFile({
                        fileName: 'test.docx',
                        targetUrl: url
                    });
                }}
            > 编辑Word </Button>
            <Incubator incubator={incubator} downloadAddress="http://127.0.0.1:8000/"/>
        </>
    )
}