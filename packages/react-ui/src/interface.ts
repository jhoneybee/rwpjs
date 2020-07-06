import React from 'react'
import { EditorProps, DataGridHandle, Column, SortColumn, FormatterProps, CalculatedColumn, RowsUpdateEvent } from 'react-data-grid-temp'
import { LiteralUnion } from 'antd/lib/_util/type';

declare const ButtonTypes: ['default', 'primary', 'ghost', 'dashed', 'link', 'text'];
export declare type ButtonType = typeof ButtonTypes[number];
declare const ButtonShapes: ['circle', 'circle-outline', 'round'];
export declare type ButtonShape = typeof ButtonShapes[number];
declare const ButtonHTMLTypes: ['submit', 'button', 'reset'];
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
    enableAutoLoading?: boolean
    // 按钮的点击事件
    onClick?: () => Promise<void>
    // 装载状态
    loading?: boolean
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
    // 列的对其方式,默认left
    align?: 'left' | 'right' | 'center'
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

export declare type OverlayFunc = () => React.ReactElement;


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
     * 更新表格数据
     * @param record 要修改的数据
     * @param filter 指定条件查询对应的数据
     */
    update: (record: T, filter: (ele: T) => boolean) => void

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
    enableSelectBox?: 'multiple' | 'none'
    // 启动列的分组, 根据分组的列进行排序，参数为列的name字段
    enableGroupColumn?: string
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
