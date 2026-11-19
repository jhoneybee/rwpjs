/**
 * title: 分组编辑与刷新
 * desc: 按部门或岗位分组，双击单元格编辑，回车或失焦提交后刷新。数据为本地模拟数据。
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Button, Space, Tag } from 'antd'
import { Table } from '@rwp/react-ui'
import { ColumnProps, Row, TableHandle } from '../type'

const employees = [
    { id: 'EMP001', name: '张三', department: '研发部', role: '前端', note: '负责管理后台' },
    { id: 'EMP002', name: '李四', department: '研发部', role: '后端', note: '负责数据接口' },
    { id: 'EMP003', name: '王五', department: '研发部', role: '前端', note: '负责组件维护' },
    { id: 'EMP004', name: '赵六', department: '产品部', role: '产品', note: '负责需求设计' },
    { id: 'EMP005', name: '小林', department: '产品部', role: '设计', note: '负责交互设计' },
    { id: 'EMP006', name: '小周', department: '运营部', role: '运营', note: '负责日常运营' },
]

const selectStyle: React.CSSProperties = {
    height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 2,
}

const countEmployees = (rows: Row[]): number => rows.reduce((total, row) => (
    total + (row.$type === 'GROUP' ? countEmployees(row.$children || []) : 1)
), 0)

const DepartmentEditor = React.forwardRef<any, {
    value?: string
    onChange?: (value: string) => void
    style?: React.CSSProperties
    onBlur?: React.FocusEventHandler<HTMLSelectElement>
    onKeyDown?: React.KeyboardEventHandler<HTMLSelectElement>
}>(({ value, onChange, style, onBlur, onKeyDown }, ref) => (
    <select
        ref={ref}
        aria-label="编辑部门"
        value={value}
        style={{ ...selectStyle, ...style, width: '100%' }}
        onChange={event => onChange?.(event.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
    >
        {['研发部', '产品部', '运营部'].map(department => (
            <option key={department} value={department}>{department}</option>
        ))}
    </select>
))

const columns: ColumnProps[] = [
    { name: 'id', title: '员工编号', width: 110, frozen: true },
    { name: 'name', title: '姓名（可编辑）', width: 150, editable: true },
    { name: 'department', title: '部门（可编辑）', width: 150, editable: true, editor: DepartmentEditor },
    { name: 'role', title: '岗位', width: 100 },
    { name: 'note', title: '备注（可编辑）', width: 230, editable: true },
    { name: 'serverVersion', title: '服务端版本', width: 125 },
    {
        name: 'editState', title: '编辑状态', width: 120,
        formatter: ({ row }) => <Tag color={row.$state ? 'orange' : 'green'}>{row.$state ? '本地已修改' : '未修改'}</Tag>,
    },
]

function GroupEditingExample({ onReset }: { onReset: () => void }) {
    const table = useRef<TableHandle | null>(null)
    const requestCount = useRef(0)
    const mounted = useRef(true)
    const expandedMode = useRef<string>()
    const [responseCount, setResponseCount] = useState(0)
    const [groupMode, setGroupMode] = useState('department')
    const [refreshing, setRefreshing] = useState(false)
    const [snapshot, setSnapshot] = useState<Row[] | null>(null)
    const [error, setError] = useState('')
    const groupColumns = React.useMemo(() => (
        groupMode === 'none' ? [] : groupMode.split(',')
    ), [groupMode])

    useEffect(() => () => { mounted.current = false }, [])

    // 每次请求返回原始姓名、部门和备注，只有版本号变化；由 Table 合并本地编辑。
    const loadData = useCallback(async () => {
        const version = ++requestCount.current
        await new Promise(resolve => setTimeout(resolve, 350))
        const datas = employees.map(employee => ({ ...employee, serverVersion: `v${version}` }))
        if (mounted.current) {
            setResponseCount(previous => Math.max(previous, version))
            setSnapshot(null)
        }
        return { datas, total: datas.length }
    }, [])

    const expandAll = useCallback(() => {
        const keys = new Set<string>()
        const collect = (rows: Row[]) => rows.forEach(row => {
            if (row.$type === 'GROUP') {
                keys.add(row.$id)
                collect(row.$children || [])
            }
        })
        collect(table.current?.getGroupDatas() || [])
        table.current?.setExpandedKeys(Array.from(keys), '')
    }, [])

    // 首次加载或切换分组时展开；普通刷新保留用户的展开、折叠状态。
    useEffect(() => {
        if (responseCount === 0 || expandedMode.current === groupMode) return
        const frame = requestAnimationFrame(() => {
            expandAll()
            expandedMode.current = groupMode
        })
        return () => cancelAnimationFrame(frame)
    }, [responseCount, groupMode, expandAll])

    const readData = () => setSnapshot((table.current?.getDataSource() || []).map(row => ({
        id: row.id, name: row.name, department: row.department, role: row.role,
        note: row.note, serverVersion: row.serverVersion,
    })))

    const refresh = async () => {
        setRefreshing(true)
        setError('')
        try {
            await table.current?.reload()
            if (mounted.current) readData()
        } catch (reason) {
            if (mounted.current) setError(reason instanceof Error ? reason.message : '刷新失败，请重试')
        } finally {
            if (mounted.current) setRefreshing(false)
        }
    }

    return (
        <section aria-label="分组单元格编辑演示" style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Alert
                type="info"
                showIcon
                message="双击姓名、部门或备注单元格开始编辑"
                description="编辑后按 Enter，或点击其他单元格提交本地修改，再刷新数据：输入的内容会保留，服务端版本会递增。修改部门后，该员工会移动到对应分组。Esc 可取消当前编辑。"
                style={{ marginBottom: 16 }}
            />
            <Space wrap style={{ marginBottom: 12 }}>
                <label>
                    分组方式：
                    <select aria-label="分组方式" value={groupMode} onChange={event => setGroupMode(event.target.value)} style={selectStyle}>
                        <option value="department">按部门分组</option>
                        <option value="department,role">按部门、岗位分组</option>
                        <option value="none">不分组</option>
                    </select>
                </label>
                <Button onClick={expandAll} disabled={groupMode === 'none' || responseCount === 0}>展开全部</Button>
                <Button onClick={() => table.current?.setExpandedKeys([], '')} disabled={groupMode === 'none' || responseCount === 0}>折叠全部</Button>
            </Space>
            <div style={{ height: 420 }}>
                <Table
                    table={table}
                    rowKey="id"
                    columns={columns}
                    groupColumn={groupColumns}
                    editorMode={{ type: 'CELL' }}
                    loadData={loadData}
                    groupRenderer={({ row }) => <strong>{row.$title}（{countEmployees(row.$children || [])} 人）</strong>}
                    pageOtherProps={{ showSizeChanger: false, showQuickJumper: false }}
                />
            </div>
            <Space wrap style={{ marginTop: 12 }}>
                <Button type="primary" loading={refreshing} onClick={refresh} disabled={responseCount === 0}>刷新数据（reload）</Button>
                <Button onClick={readData} disabled={responseCount === 0}>读取当前数据</Button>
                <Button onClick={onReset}>重置演示</Button>
                <Tag color="blue">服务端响应：{responseCount} 次</Tag>
            </Space>
            {error && <Alert type="error" message={error} style={{ marginTop: 12 }} />}
            {snapshot && (
                <div style={{ marginTop: 12 }}>
                    <strong>最近读取的数据快照</strong>
                    <pre aria-label="当前表格数据" style={{ marginTop: 8, padding: 12, maxHeight: 240, overflow: 'auto', background: '#f5f5f5' }}>
                        {JSON.stringify(snapshot, null, 2)}
                    </pre>
                </div>
            )}
            <p style={{ margin: '12px 0 0', color: '#666', fontSize: 12 }}>
                演示使用固定员工编号识别数据，本地编辑尚未保存到服务端。重置演示或刷新浏览器会清除本地修改。
            </p>
        </section>
    )
}

export default function GroupEditTableDemo() {
    const [instance, setInstance] = useState(0)
    return <GroupEditingExample key={instance} onReset={() => setInstance(value => value + 1)} />
}
