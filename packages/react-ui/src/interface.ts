import React from 'react'
import { EditorProps, DataGridHandle, Column, SortColumn, FormatterProps, CalculatedColumn, RowsUpdateEvent } from 'react-data-grid-temp'
import { LiteralUnion } from 'antd/lib/_util/type';
import { FormItemProps as AntFormItemProps, FormProps as AntFormProps } from 'antd/lib/form';
import { ButtonProps as AntButtonProps } from 'antd/lib/button';
import { GroupRendererProps } from './table/row/GroupRow';

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

export interface ColumnProps<T> {
    // 标题
    title: string
    // 字段名称
    name: string
    // 列的对其方式,默认left, 如果字符串格式为 xxx|xxx 第一个表示header第二个表示表格body的对其方式
    align?: 'left' | 'right' | 'center' | string
    // 列宽。如果未指定，则将根据网格宽度和其他列的指定宽度自动确定
    width?: number | string;
    // 最小列宽(px)
    minWidth?: number;
    // 最大列宽(px)。
    maxWidth?: number;
    // 启用单元格编辑。如果已设置且未指定编辑器属性，则将使用textinput作为单元格编辑器
    editable?: boolean | ((row: T) => boolean);
    // 启用列大小调整
    resizable?: boolean;
    // 启用列排序
    sortable?: boolean;
    // 将列排序顺序设置为降序，而不是在列第一次排序时升序
    sortDescendingFirst?: boolean;
    // 冻结列
    frozen?: boolean;
    // 格式化当前列的数据。返回一个 React.ComponentType 对象
    formatter?: React.ComponentType<FormatterProps<T, unknown>>;
    // 当前列的编辑器
    editor?:React.ComponentType<EditorProps<T[keyof T], T, unknown>>;
}


export interface FormProps extends AntFormProps{
    // 当前列的总数
    cols?: number
    // Form标签的宽度
    labelWidth?: number
}

export interface FormItemProps extends AntFormItemProps {
    // 是否换行
    br?: boolean
    // 跨列
    colSpan?: number
}

export declare type OverlayFunc = () => React.ReactElement;
export declare type TableFunc = (table: TableHandle<any>) => void;

// 表格的 Handle 事件
export interface TableHandle<T> extends DataGridHandle {
    /**
     * 获取当前右键的上下文
     */
    rightContext: () => { row: T, rowIdx: number, column: Column<T> }

    /**
     * 获取当前表格的数据源
     */
    getDataSource: () => T[]

    /**
     * 获取当前选择的数据
     */
    getSelect:() => Set<T[keyof T]>

    /**
     * 设置当前选中的数据
     */
    setSelect:(selects: Set<T[keyof T]>) => void

    /**
     * 更新表格数据
     */
    update: (change: (oldData: T) => T) => void

    /**
     * 重新装载表格数据
     * @param 表格请求数据的参数
     */
    reload: (param: Object) => void

    /**
     * 删除返回为true的数据
     */
    del: (filter: (ele: T) => boolean) => void

}

export interface TableProps<T> {
    // 表格列的信息
    columns: ColumnProps<T>[]

    /**
     * 装载数据
     * @param pageNo   当前页的序号
     * @param pageSize 当前页的页面显示数据大小
     * @param params   请求数据额外携带的参数
     * @returns 返回的总数,当前页的数据
     */
    loadData: (pageNo: number, pageSize: number, params: Object) => PromiseLike<{
        total: number, datas: T[]
    }>
    // 初始化页面的分页大小, 默认加载50条数据
    pageSize?: number
    // 装载数据的参数
    params?: Object
    // 是否初始化的时候自动装载数据, 默认为 true
    enableInitLoadData?: boolean
    // 启动复制和粘贴
    enableCellCopyPaste?: boolean
    // 启动下拉编辑
    enableCellDragAndDrop?: boolean
    // 启动选择框 multiple表示多选，默认为none表示无选择器
    selectBox?: 'multiple' | 'none'
    // 根据分组的列进行分组，参数为列的name字段
    groupColumn?: string[]
    // 表格分组的渲染
    groupRenderer?: React.ComponentType<GroupRendererProps>
    width?: number
    height?: number
    // 用户唯一的rowKey
    rowKey?: keyof T

    /**
     * 右键菜单
     */
    contextMenu?: React.ReactElement | OverlayFunc

    /**
     * 表格组件
     */
    table?: React.MutableRefObject<TableHandle<T> | null>

    /**
     * 排序时触发的事件
     */
    onSort?: (sortColumns: SortColumn[]) => void;

    /**
     * 行的点击事件
     */
    onRowClick?: (rowIdx: number, row: T, column: CalculatedColumn<T>) => void;

    /**
     * 用户更新表格Rows的事件
     */
    onRowsUpdate?: <E extends RowsUpdateEvent>(event: E, onCommit: () => void) => Promise<boolean>;
}
