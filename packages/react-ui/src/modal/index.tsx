import React, { useState, useEffect, ReactNode, cloneElement } from 'react'
import { Modal as AntModal } from 'antd'
import classNames from 'classnames'
import { ModalProps } from 'antd/lib/modal'
import Draggable from 'react-draggable';
import { classPrefix, isPromise } from '../utils'

import './style/index.less'

export interface ModalHandle {
    show: () => void
    hide: () => void
}

interface Props extends Omit<ModalProps,
    'visible' |
    'onOk' |
    'onCancel' |
    'confirmLoading' |
    'getContainer'
    > {
    onOk?: (e: React.MouseEvent<HTMLElement>) => Promise<boolean> | boolean
    onCancel?: (e: React.MouseEvent<HTMLElement>) => Promise<void>
    modal?: React.MutableRefObject<ModalHandle | null>
    children?: ReactNode,
    getContainer?: () => HTMLElement
}

const DraggableContent = (props: any) => {
    const { content, onMouseEnter, onMouseLeave, onBlur, style = {} } = props
    const { children } = content.props
    const [disabled, setDisabled] = useState<boolean>(true)

    const getContent = () => {
        const newChildren: any[] = []
        children.map((element: any,index: number) => {
            let childrenProps: any = { key: index}
            if (index === 1) {
                childrenProps = {
                    key: 1,
                    style: {
                        cursor: 'move'
                    },
                    onMouseEnter: () => {
                        setDisabled(false)
                    },
                    onMouseLeave: () => {
                        setDisabled(true)
                    }
                }
            }
            if (element) {
                return cloneElement(element, childrenProps)
            }
            return undefined
        })

        return cloneElement(content,{
            children: newChildren,
            onBlur,
            onMouseEnter,
            onMouseLeave
        })
    }
    return (
        <Draggable
            disabled={disabled}
            bounds={{
                top: -style.top || -100
            }}
        >
            {getContent()}
        </Draggable>
    )
}

export const Modal = (props: Props) => {

    const [visible, setVisible] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [maskHide, setMaskHide] = useState<boolean>(false)

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
            className={classNames({
                [`${classPrefix}-modal`]: true,
                [props.className || '']: true,
            })}
            // @ts-ignore
            modalRender={modal => (
                <DraggableContent
                    content={modal}
                    style={props.style}
                    onMouseEnter={() => {
                        setMaskHide(false)
                    }}
                    onMouseLeave={() => {
                        setMaskHide(true)
                    }}
                />
            )}
            onOk={e => {
                if (props.onOk) {
                    setLoading(true)
                    const onOkThen = props.onOk!(e)
                    if (isPromise(onOkThen)) {
                        (onOkThen as Promise<boolean>).then(result => {
                            if (result) {
                                setVisible(false)
                            }
                            setLoading(false)
                        }).catch(() => {
                            setLoading(false)
                        })
                    } else {
                        if (onOkThen) {
                            setVisible(false)
                        }
                        setLoading(false)
                    }
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
            wrapClassName={classNames({
                [`${classPrefix}-modal-mask-hide`]: maskHide,
                [props.wrapClassName || '']: true,
            })}
            zIndex={props.zIndex}
        >
            {props.children}
        </AntModal>
    )
}
