import React from 'react'

declare const ButtonTypes: ["default", "primary", "ghost", "dashed", "link", "text"];
export declare type ButtonType = typeof ButtonTypes[number];
declare const ButtonShapes: ["circle", "circle-outline", "round"];
export declare type ButtonShape = typeof ButtonShapes[number];
declare const ButtonHTMLTypes: ["submit", "button", "reset"];
export declare type ButtonHTMLType = typeof ButtonHTMLTypes[number];
export declare type LegacyButtonType = ButtonType | 'danger';

export declare type SizeType = 'small' | 'middle' | 'large' | undefined;
declare const SizeContext: React.Context<SizeType>;

/**
 * 按钮的属性
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<any>, 'type' | 'onClick'> {
    // 设置按钮类型
    type?: ButtonType
    // 设置按钮的图标组件
    icon?: React.ReactNode
    // 设置按钮形状，可选值为 circle、 round 或者不设
    shape?: ButtonShape
    // 设置按钮大小
    size?: SizeType
    // 幽灵属性，使按钮背景透明
    ghost?: boolean
    // 设置危险按钮
    danger?: boolean
    // 将按钮宽度调整为其父宽度的选项
    block?: boolean
    // 按钮失效状态
    disabled?: boolean
    // 是否在点击的时候自动加载loading的状态, 默认为 true
    autoLoading?: boolean
    // 按钮的点击事件
    onClick?: () => Promise<void> | void
    // 装载状态
    loading?: boolean
}