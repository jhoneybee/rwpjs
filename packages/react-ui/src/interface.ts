import React, { ReactNode } from 'react'
import { LiteralUnion } from 'antd/lib/_util/type';
import { FormItemProps as AntFormItemProps, FormProps as AntFormProps } from 'antd/lib/form';
import { ButtonProps as AntButtonProps } from 'antd/lib/button';


declare const ButtonTypes: ['default', 'primary', 'ghost', 'dashed', 'link', 'text'];
export declare type ButtonType = typeof ButtonTypes[number];
declare const ButtonShapes: ['circle', 'circle-outline', 'round'];
export declare type ButtonShape = typeof ButtonShapes[number];
declare const ButtonHTMLTypes: ['submit', 'button', 'reset'];
export declare type ButtonHTMLType = typeof ButtonHTMLTypes[number];
export declare type LegacyButtonType = ButtonType | 'danger';

export declare type SizeType = 'small' | 'middle' | 'large' | undefined;
declare const SizeContext: React.Context<SizeType>;

// 导出Router的Props
export { RouteComponentProps } from 'react-router-dom'

/**
 * 按钮的属性
 */
export interface ButtonProps extends Omit<AntButtonProps, 'onClick'> {
    // 是否在点击的时候自动加载loading的状态, 默认为 true
    enableAutoLoading?: boolean
    // 按钮的点击事件
    onClick?: () => Promise<void>
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


export interface FormProps extends AntFormProps{
    // 当前列的总数
    cols?: number
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
