import React, { useState, useEffect, ReactNode } from 'react'
import AntModal, { ModalProps } from '@weblif/fast-ui/es/modal'
import classNames from 'classnames'
import { classPrefix } from '../utils'

import './style/index.less'

export interface ModalHandle {
    show: () => void
    hide: () => void
}

interface Props extends Omit<ModalProps,
    'visible' |
    'onOpenChange'
    > {
    modal?: React.MutableRefObject<ModalHandle | null>
    children?: ReactNode,
    getContainer?: () => HTMLElement
}

export const Modal = ({
    modal,
    className,
    wrapClassName,
    onOk,
    ...restProps
}: Props) => {

    const [visible, setVisible] = useState<boolean>(false)

    useEffect(() => {
        if (modal) {
            // eslint-disable-next-line no-param-reassign
            modal.current = {
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
            open={visible}
            onOpenChange={setVisible}
            className={classNames({
                [`${classPrefix}-modal`]: true,
                [className || '']: true,
            })}
            onOk={onOk}
            wrapClassName={classNames({
                // [`${classPrefix}-modal-mask-hide`]: maskHide,
                [wrapClassName || '']: true,
            })}
            {...restProps}
        />
    )
}
