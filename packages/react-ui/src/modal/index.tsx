import React, { useState, useEffect, ReactNode, useRef, Dispatch, useReducer } from 'react'
import { Modal as AntModal } from 'antd'
import classNames from 'classnames'
import { ModalProps } from 'antd/lib/modal'
import { classPrefix } from '../utils'
import './style/index.less'
import { State, Action, reducer } from './reducer'

interface ModalHandle {
    show: () => void
    hide: () => void
}

interface Props extends Omit<ModalProps,
    'visible'|
    'onOk' |
    'onCancel'|
    'confirmLoading'|
    'width' |
    'getContainer'
>{
    onOk?: (e: React.MouseEvent<HTMLElement>) => Promise<boolean>
    onCancel?: (e: React.MouseEvent<HTMLElement>) => Promise<void>
    modal?: React.MutableRefObject<ModalHandle | null>
    children?: ReactNode,
    width?: number,
    getContainer?: () => HTMLElement
}

interface IContextProps {
    state: State;
    dispatch: Dispatch<Action>;
}

const ModalContext = React.createContext({} as IContextProps);

export const Modal = (props: Props) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [state, dispatch] = useReducer(reducer, {
        top: 100,
        left: -1,
    });

    const mouseState = useRef<'UP' | 'DOWN'>('UP')

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

    const beforeClientX = useRef<number>(0)
    const beforeClientY = useRef<number>(0)

    useEffect(() => {
        const onMouseMove = (e: MouseEvent): void => {
            // 鼠标按下的时候修改当前的位置信息
            if (mouseState.current === 'DOWN') {
                const moveLeft = e.clientX - beforeClientX.current
                const moveTop = e.clientY - beforeClientY.current
                dispatch({
                    type: 'SET_POSITION',
                    payload: {
                        left: moveLeft + state.left,
                        top: moveTop + state.top,
                    },
                })
            }
        }
        window.addEventListener('mousemove', onMouseMove, { passive: true })
        return () => window.removeEventListener('mousemove', onMouseMove)
    }, [])


    useEffect(() => {
        const onMouseUp = (): void => {
            mouseState.current = 'UP'
        }
        window.addEventListener('mouseup', onMouseUp)
        return () => window.removeEventListener('mouseup', onMouseUp)
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
                        props.onOk(e).then(result => {
                            if (result) {
                                setVisible(true)
                            }
                            setLoading(false)
                        }).catch(() => {
                            setLoading(false)
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
                style={{
                    ...props.style,
                    left: state.left === -1 ? undefined : state.left,
                    top: state.top,
                }}
                title={(
                    <div
                        // 鼠标按下
                        onMouseDown={e => {
                            mouseState.current = 'DOWN'
                            if (beforeClientX.current === 0) {
                                beforeClientX.current = e.clientX
                            }
                            if (beforeClientY.current === 0) {
                                beforeClientY.current = e.clientY
                            }
                        }}
                    >
                        {props.title}
                    </div>
                )}
                width={props.width}
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
