import { ReactNode } from 'react'

import {
    DataGridHandle,
    Column,
    FormatterProps,
    EditorProps,
    SortColumn,
    CalculatedColumn,
    RowsUpdateEvent,
} from 'react-data-grid-temp';


export interface Row {
    $index?: number
    $state?: 'UPDATE' | 'DELETE' | 'CREATE'
    [propName: string]: any
}


export interface GroupRendererProps {
    row: GroupRowData | Row 
}

// 定义分组结构
export interface GroupRowData extends Row {
    // 唯一ID
    $id?: string,
    // 数据类型, GROUP 表示分组类型, ROW 表示行数据
    $type: 'GROUP' | 'ROW'
    // 当前展开节点的标题
    $title: ReactNode
    // 父节点信息
    $parent?: GroupRowData
    // 当前节点的间隔
    $space?: number
    // 当前的子节点信息
    $children?: GroupRowData[] | Row[]
}

export interface TableHandle extends DataGridHandle {
    /**
     * 获取当前右键的上下文
     */
    rightContext: () => { row: Row, rowIdx: number, column: Column<Row> }

    /**
     * 获取当前表格的数据源
     */
    getDataSource: () => Row[]

    /**
     * 获取当前选择的数据
     */
    getSelect:() => Set<Row[keyof Row]>

    /**
     * 设置当前选中的数据
     */
    setSelect:(selects: Set<Row[keyof Row]>) => void

    /**
     * 更新表格数据
     */
    update: (change: (oldData: Row) => Row) => Promise<void>

    /**
     * 重新装载表格数据
     * @param 表格请求数据的参数
     */
    reload: (param: Object) => void

    /**
     * 删除返回为true的数据
     */
    del: (filter: (ele: Row) => boolean) => Promise<void>

    /**
     * 新增数据
     */
    add: (rows: Row[], start?: number) => void

}

export interface ColumnProps {
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
    editable?: boolean | ((row: Row) => boolean);
    // 启用列大小调整
    resizable?: boolean;
    // 启用列排序
    sortable?: boolean;
    // 将列排序顺序设置为降序，而不是在列第一次排序时升序
    sortDescendingFirst?: boolean;
    // 冻结列
    frozen?: boolean;
    // 格式化当前列的数据。返回一个 React.ComponentType 对象
    formatter?: React.ComponentType<FormatterProps<Row, unknown>>;
    // 当前列的编辑器
    editor?:React.ComponentType<EditorProps<Row[keyof Row], Row, unknown>>;
    // 单元格的class
    cellClass?: string | ((row: Row) => string);
}

export declare type OverlayFunc = () => React.ReactElement;

export declare type TableFunc = (table: TableHandle) => void;

type LoadDataRespType = {
    total: number
    datas: Object[]
}

export interface TableProps {
    // 表格列的信息
    columns: ColumnProps[]

    /**
     * 装载数据
     * @param pageNo   当前页的序号
     * @param pageSize 当前页的页面显示数据大小
     * @param params   请求数据额外携带的参数
     * @returns 返回的总数,当前页的数据
     */
    loadData: (pageNo: number, pageSize: number, params: Object) => PromiseLike<LoadDataRespType>
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
    rowKey?: string
    /**
     * 右键菜单
     */
    overlay?: React.ReactElement | OverlayFunc

    /**
     * 表格组件
     */
    table?: React.MutableRefObject<TableHandle | null>

    /**
     * 排序时触发的事件
     */
    onSort?: (sortColumns: SortColumn[]) => void;

    /**
     * 行的点击事件
     */
    onRowClick?: (rowIdx: number, row: Row, column: CalculatedColumn<Row>) => void;

    /**
     * 当前行的class
     */
    rowClass?: (row: object) => string | undefined;

    /**
     * 用户更新表格Rows的事件
     */
    onRowsUpdate?: <E extends RowsUpdateEvent>(event: E, onCommit: () => void) => Promise<boolean>;
}
