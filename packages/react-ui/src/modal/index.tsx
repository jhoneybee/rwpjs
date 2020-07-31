import React, { useState, useEffect, ReactNode } from 'react'
import { Modal as AntModal } from 'antd'
import { ModalProps } from 'antd/lib/modal'

interface ModalHandle {
    show: () => void
    hide: () => void
}

interface Props extends Omit<ModalProps,
    'visible'|
    'onOk' |
    'onCancel'|
    'confirmLoading'
>{
    onOk?: (e: React.MouseEvent<HTMLElement>) => Promise<boolean>
    onCancel?: (e: React.MouseEvent<HTMLElement>) => Promise<void>
    modal?: React.MutableRefObject<ModalHandle | null>
    children?: ReactNode
}

export const Modal = (props: Props) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (props.modal) {
            // eslint-disable-next-line no-param-reassign
            props.modal.current = {
                show: () => {
                    setVisible(true)
                },
                hide: () => {
                    setVisible(false)
                },
            }
        }
    }, [])
    return (
        <AntModal
            visible={visible}
            onOk={e => {
                if (props.onOk) {
                    setLoading(true)
                    props.onOk(e).then(result => {
                        if (result) {
                            setVisible(true)
                        }
                    }).finally(() => {
                        setLoading(true)
                    })
                } else {
                    setVisible(false)
                }
            }}
            confirmLoading={loading}
            onCancel={e => {
                if (props.onCancel) {
                    props.onCancel(e)
                }
                setVisible(false)
            }}
            bodyStyle={props.bodyStyle}
            cancelText={props.cancelText}
            centered={props.centered}
            closable={props.closable}
            closeIcon={props.closeIcon}
            destroyOnClose={props.destroyOnClose}
            footer={props.footer}
            forceRender={props.forceRender}
            getContainer={props.getContainer}
            keyboard={props.keyboard}
            mask={props.mask}
            maskClosable={props.maskClosable}
            maskStyle={props.maskStyle}
            okText={props.okText}
            okType={props.okType}
            okButtonProps={props.okButtonProps}
            cancelButtonProps={props.cancelButtonProps}
            style={props.style}
            title={props.title}
            width={props.width}
            wrapClassName={props.wrapClassName}
            zIndex={props.zIndex}
        >
            {props.children}
        </AntModal>
    )
}
