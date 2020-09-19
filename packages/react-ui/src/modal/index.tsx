import React, { useState, useEffect, ReactNode, useRef, Dispatch, useReducer } from 'react'
import { Modal as AntModal } from 'antd'
import classNames from 'classnames'
import { ModalProps } from 'antd/lib/modal'
import { classPrefix, isPromise } from '../utils'
import { State, Action, reducer } from './reducer'

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
    'width' |
    'getContainer'
    > {
    onOk?: (e: React.MouseEvent<HTMLElement>) => Promise<boolean> | boolean
    onCancel?: (e: React.MouseEvent<HTMLElement>) => Promise<void>
    modal?: React.MutableRefObject<ModalHandle | null>
    children?: ReactNode,
    width?: number ,
    getContainer?: () => HTMLElement
}

interface IContextProps {
    state: State;
    dispatch: Dispatch<Action>;
}

const ModalContext = React.createContext({} as IContextProps);

const getWidth = (width?: number | string) => {
    let widthNum = 520 

    if (typeof width === 'string') {
        if (/^\d+(\.?\d+)?%$/g.test(width)) {
            widthNum = document.body.offsetWidth * (Number.parseFloat(width) / 100)
        } else {
            widthNum = Number.parseFloat(width)
        }
    }
    return widthNum
}

export const Modal = (props: Props) => {

    const [width, setWidth] = useState<number>(getWidth(props.width))
    const [visible, setVisible] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [state, dispatch] = useReducer(reducer, {
        top: 100,
        left: (document.body.offsetWidth - getWidth(props.width)) / 2,
    });

    const mouseState = useRef<'UP' | 'DOWN'>('UP')

    useEffect(() => {
        setWidth(getWidth(props.width))
    }, [props.width])

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

    const left = useRef<number>(0)
    const top = useRef<number>(0)

    const previousX = useRef<number>(0)
    const previousY = useRef<number>(0)

    useEffect(() => {
        const onMouseMove = (e: MouseEvent): void => {
            const moveLeft = e.clientX - previousX.current
            const moveTop = e.clientY - previousY.current
            // 鼠标按下的时候修改当前的位置信息
            if (
                mouseState.current === 'DOWN'
            ) {
                dispatch({
                    type: 'SET_POSITION',
                    payload: {
                        left: moveLeft + left.current,
                        top: moveTop + top.current,
                    },
                })
            } else {
                previousX.current = e.clientX
                previousY.current = e.clientY
            }
        }
        document.body.addEventListener('mousemove', onMouseMove, { passive: true })
        return () => document.body.removeEventListener('mousemove', onMouseMove)
    }, [])


    useEffect(() => {
        const onMouseUp = (): void => {
            mouseState.current = 'UP'
        }
        document.body.addEventListener('mouseup', onMouseUp)
        return () => document.body.removeEventListener('mouseup', onMouseUp)
    }, [])

    return (
        <ModalContext.Provider
            value={{
                dispatch,
                state,
            }}
        >
            <AntModal
                visible={visible}
                className={classNames({
                    [`${classPrefix}-modal`]: true,
                    [props.className || '']: true,
                })}
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
                style={{
                    ...props.style,
                    left: state.left,
                    top: state.top,
                }}
                title={(
                    <div
                        // 鼠标按下
                        onMouseDown={() => {
                            mouseState.current = 'DOWN'
                            left.current = state.left
                            top.current = state.top
                        }}
                    >
                        {props.title}
                    </div>
                )}
                width={width}
                wrapClassName={classNames({
                    [`${classPrefix}-modal-mask-hide`]: props.mask === false,
                    [props.wrapClassName || '']: true,
                })}
                zIndex={props.zIndex}
            >
                {props.children}
            </AntModal>
        </ModalContext.Provider>
    )
}
