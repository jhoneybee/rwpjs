import React, { useEffect, useRef } from 'react'

import { Modal, ModalHandle } from '../modal'

let incubatorSocket = new WebSocket("ws://localhost:29580")

export interface PreviewFileParams {
    // 要预览的文件名
    fileName: string
    // 文件的下载地址
    targetUrl: string
    // 请求header信息
    targetHeaders: Object
}

export interface EditorFileParams extends PreviewFileParams{
    saveUrl: string
    saveHeaders: Object
}

export interface IncubatorHandle {
    openPreviewFile: (params: PreviewFileParams) => void
    openEditorFile: (params: EditorFileParams) => void
}

export interface IncubatorProps {

    /**
     * 可执行文件的下载地址
     */
    downloadAddress: string

    incubator: React.MutableRefObject<IncubatorHandle | null>
}

export const Incubator = ({
    downloadAddress,
    incubator
}: IncubatorProps) => {
    const modal = useRef<ModalHandle>(null)

    if (incubator) {
        // eslint-disable-next-line no-param-reassign
        incubator.current = {
            openPreviewFile: (params: PreviewFileParams) => {
                const ivParams = {
                    channel: '/api/file/preview',
                    params,
                }
                incubatorSocket.send(JSON.stringify(ivParams))
            },
            openEditorFile: (params: EditorFileParams) => {
                const ivParams = {
                    channel: '/api/file/editor',
                    params,
                }
                incubatorSocket.send(JSON.stringify(ivParams))
            }
        }
    }
    useEffect(() => {        
        // 如果没有连接上则提示用户下载插件
        if (incubatorSocket.readyState === incubatorSocket.CLOSED) {
            modal.current?.show();
            // 每4秒尝试重新连接
            const reconnect = setInterval(() => {
                if (incubatorSocket.readyState === incubatorSocket.CLOSED) {
                    incubatorSocket = new WebSocket("ws://localhost:29580")
                } else {
                    clearInterval(reconnect);
                }
            }, 4000)
        }
    }, [])

    return (
        <Modal
            modal={modal}
        >
            点击下载 RWP-Incubator 插件, 下载地址 <a href={downloadAddress}>{downloadAddress}</a>
        </Modal>
    )
}
