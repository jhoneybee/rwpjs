import React from 'react'
import { LiteralUnion } from 'antd/lib/_util/type';
import { FormItemProps as AntFormItemProps, FormProps as AntFormProps, FormInstance } from 'antd/lib/form';
import { ButtonProps as AntButtonProps } from 'antd/lib/button';


declare const ButtonTypes: ['default', 'primary', 'ghost', 'dashed', 'link', 'text'];
export declare type ButtonType = typeof ButtonTypes[number];
declare const ButtonShapes: ['circle', 'circle-outline', 'round'];
export declare type ButtonShape = typeof ButtonShapes[number];
declare const ButtonHTMLTypes: ['submit', 'button', 'reset'];
export declare type ButtonHTMLType = typeof ButtonHTMLTypes[number];
export declare type LegacyButtonType = ButtonType | 'danger';

export declare type SizeType = 'small' | 'middle' | 'large' | undefined;

export declare type OverlayFunc = () => React.ReactElement;

// 导出Router的Props
export { RouteComponentProps } from 'react-router-dom'

/**
 * 按钮的属性
 */
export interface ButtonProps extends Omit<AntButtonProps, 'onClick'> {
    // 按钮的点击事件
    onClick?: () => Promise<void> | void
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'type'| 'on' | 'onChange'> {
    prefixCls?: string;
    size?: SizeType;
    type?: LiteralUnion<'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week', string>;
    onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
    addonBefore?: React.ReactNode;
    addonAfter?: React.ReactNode;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    allowClear?: boolean;
    onChange?: (value: string) => void
}


export interface FormProps extends Omit<AntFormProps, 'form'>{
    // 当前列的总数
    cols?: number
    form?: React.MutableRefObject<FormInstance | null>
    children: JSX.Element[]
}

export interface FormItemProps extends AntFormItemProps {
    // 是否换行
    br?: boolean
    // 跨列
    colSpan?: number
    // 跨行
    rowSpan?: number
}
