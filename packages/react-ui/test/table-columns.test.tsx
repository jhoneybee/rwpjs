import React from 'react';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { Table } from '../src/table';

let mockStore: any;
let viewportWidth = 800;
const observers = new Set<any>();
const previousResizeObserver = (window as any).ResizeObserver;

class TestResizeObserver {
    callback: any;
    constructor(callback: any) { this.callback = callback; }
    observe() {
        observers.add(this);
        this.callback([{ contentRect: { width: viewportWidth, height: 300 } }]);
    }
    disconnect() { observers.delete(this); }
}

jest.mock('../src/index', () => {
    const React = require('react');
    return {
        Spin: ({ children }: any) => children,
        Input: React.forwardRef((props: any, ref: any) => <input ref={ref} value={props.value} onChange={event => props.onChange(event.target.value)} />),
        Checkbox: () => <input type="checkbox" readOnly />,
    };
});
jest.mock('../src/table/row', () => ({ useRowRenderer: () => null }));
jest.mock('../src/table/plugin/Tools', () => ({
    Tools: () => { mockStore = require('../src/table/store').useStore(); return null; },
}));
jest.mock('antd', () => ({ Pagination: () => null }));
jest.mock('@ant-design/icons', () => ({ ReloadOutlined: () => null, DownOutlined: () => null, RightOutlined: () => null }));

beforeEach(() => { (window as any).ResizeObserver = TestResizeObserver; });
afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
    (window as any).ResizeObserver = previousResizeObserver;
    observers.clear();
    viewportWidth = 800;
});

const makeColumns = () => [
    { name: 'loose', title: 'Loose', width: 100 },
    { name: 'pin', title: 'Pinned', width: 120, frozen: true },
    { name: 'tail', title: 'Tail', width: 150 },
];

const mount = async (columns: any[] = makeColumns(), options: any = {}) => {
    const handle = React.createRef<any>();
    const props: any = { columns, rowKey: 'id', table: handle, enableInitLoadData: false, loadData: async () => ({ datas: [], total: 0 }), ...options };
    const view = render(<Table {...props} />);
    await waitFor(() => expect(handle.current?.getColumns().length).toBe(columns.length));
    return { handle, view, props };
};

const resize = (view: ReturnType<typeof render>, handle: any, key: string, width: number) => {
    const column = handle.current.getColumns().find((item: any) => item.key === key);
    const header = view.getByRole('columnheader', { name: column.title });
    const left = column.left;
    const rect = { left, right: left + column.actualWidth, width: column.actualWidth, top: 0, bottom: 35, height: 35, x: left, y: 0, toJSON: () => ({}) };
    jest.spyOn(header, 'getBoundingClientRect').mockReturnValue(rect);
    fireEvent.mouseDown(header, { button: 0, clientX: rect.right - 1 });
    fireEvent.mouseMove(window, { clientX: left + width - 1 });
    fireEvent.mouseUp(window);
    return header;
};

test('getColumns returns complete business configuration with actual frozen-column positions', async () => {
    const { handle, view } = await mount();
    const columns = handle.current.getColumns();
    expect(columns.map((column: any) => column.name)).toEqual(['loose', 'pin', 'tail']);
    expect(columns.map((column: any) => column.idx)).toEqual([1, 0, 2]);
    expect(columns.map((column: any) => column.left)).toEqual([120, 0, 220]);
    expect(columns.every((column: any) => column.visible && column.kind === 'data' && column.resizable)).toBe(true);
    expect(columns.map((column: any) => column.actualWidth)).toEqual([100, 120, 150]);
    expect(view.getAllByRole('columnheader').map(header => header.textContent)).toEqual(['Pinned', 'Loose', 'Tail']);
});

test.each([
    ['none', false, [], 1],
    ['multiple', false, ['$select'], 2],
    ['none', true, ['$expandable'], 2],
    ['multiple', true, ['$expandable', '$select'], 3],
])('native dragging maps the correct business column with selectBox=%s and expandable=%s', async (selectBox, expandable, keys, expectedIndex) => {
    const onColumnResize = jest.fn();
    const onChangeColumn = jest.fn();
    const columns = makeColumns();
    const { handle, view } = await mount(columns, { selectBox, expandable: expandable ? { expandedRowRender: () => <div /> } : undefined, onColumnResize, onChangeColumn });
    const all = handle.current.getColumns({ includeSystem: true });
    expect(all.map((column: any) => column.key)).toEqual([...(keys as string[]), 'pin', 'loose', 'tail']);
    expect(all.filter((column: any) => column.kind !== 'data').map((column: any) => column.width)).toEqual((keys as string[]).map(() => 35));
    const header = resize(view, handle, 'loose', 210);
    expect(header.style.width).toBe('210px');
    expect(handle.current.getColumns().map((column: any) => column.width)).toEqual([210, 120, 150]);
    const [idx, width, column, updated] = onColumnResize.mock.calls[0];
    expect(idx).toBe(expectedIndex);
    expect(width).toBe(210);
    expect(column).toEqual(handle.current.getColumns().find((item: any) => item.name === 'loose'));
    expect(column).toMatchObject({ name: 'loose', key: 'loose', kind: 'data', idx: expectedIndex, actualWidth: 210, configuredWidth: 210 });
    expect(updated).toEqual(handle.current.getColumns());
    expect(onChangeColumn.mock.calls[0][0].map((item: any) => [item.name, item.width])).toEqual([['loose', 210], ['pin', 120], ['tail', 150]]);
    expect(columns[0].width).toBe(100);
});

test('resizing a frozen column changes its width instead of the business column at its displayed index', async () => {
    const onColumnResize = jest.fn();
    const { handle, view } = await mount(makeColumns(), { selectBox: 'multiple', expandable: { expandedRowRender: () => null }, onColumnResize });
    resize(view, handle, 'pin', 195);
    expect(onColumnResize.mock.calls[0][0]).toBe(2);
    expect(onColumnResize.mock.calls[0][2].name).toBe('pin');
    expect(handle.current.getColumns().map((column: any) => [column.name, column.width])).toEqual([['loose', 100], ['pin', 195], ['tail', 150]]);
});

test('getColumns is up to date inside the resize callback, including a previously saved handle', async () => {
    let saved: any;
    let duringResize: any;
    const onColumnResize = jest.fn((_idx, _width, _column, columns) => { duringResize = saved.getColumns(); expect(duringResize).toEqual(columns); });
    const { handle, view } = await mount(makeColumns(), { onColumnResize });
    saved = handle.current;
    resize(view, handle, 'tail', 230);
    expect(duringResize.find((column: any) => column.name === 'tail').width).toBe(230);
    expect(saved.getColumns()).toEqual(handle.current.getColumns());
});

test('width constraints match the native grid and survive hiding and showing the column', async () => {
    const onColumnResize = jest.fn();
    const { handle, view } = await mount([{ name: 'value', title: 'Value', width: 100, minWidth: 90, maxWidth: 140 }], { onColumnResize });
    resize(view, handle, 'value', 10);
    expect(onColumnResize.mock.calls[0][1]).toBe(90);
    const header = resize(view, handle, 'value', 999);
    expect(onColumnResize.mock.calls[1][1]).toBe(140);
    expect(header.style.width).toBe('140px');
    act(() => handle.current.setVisibleColumns([]));
    expect(handle.current.getColumns()[0]).toMatchObject({ visible: false, idx: -1, width: 140 });
    expect(handle.current.getColumns()[0].actualWidth).toBeUndefined();
    act(() => handle.current.setVisibleColumns(['value']));
    expect(handle.current.getColumns()[0]).toMatchObject({ visible: true, idx: 0, width: 140, actualWidth: 140 });
    expect(view.getByRole('columnheader', { name: 'Value' }).style.width).toBe('140px');
});

test('hidden business columns remain in complete snapshots and do not shift resize mappings', async () => {
    const onColumnResize = jest.fn();
    const { handle, view } = await mount(makeColumns(), { selectBox: 'multiple', onColumnResize });
    act(() => handle.current.setVisibleColumns(['loose', 'tail']));
    expect(handle.current.getColumns().find((column: any) => column.name === 'pin')).toMatchObject({ visible: false, idx: -1, width: 120 });
    resize(view, handle, 'tail', 240);
    expect(onColumnResize.mock.calls[0][0]).toBe(2);
    expect(onColumnResize.mock.calls[0][2].name).toBe('tail');
    expect(handle.current.getColumns().map((column: any) => column.width)).toEqual([100, 120, 240]);
});

test('business reordering and new prop objects retain resized widths by key', async () => {
    const { handle, view, props } = await mount();
    resize(view, handle, 'loose', 220);
    act(() => mockStore.switchColumns('loose', 'tail'));
    expect(handle.current.getColumns().map((column: any) => column.name)).toEqual(['tail', 'pin', 'loose']);
    expect(handle.current.getColumns().find((column: any) => column.name === 'loose')).toMatchObject({ width: 220, idx: 2 });
    resize(view, handle, 'tail', 180);
    expect(handle.current.getColumns().find((column: any) => column.name === 'loose').width).toBe(220);
    view.rerender(<Table {...props} columns={makeColumns()} />);
    await waitFor(() => expect(handle.current.getColumns().map((column: any) => column.name)).toEqual(['loose', 'pin', 'tail']));
    expect(handle.current.getColumns().map((column: any) => column.width)).toEqual([220, 120, 180]);
    await act(async () => { await handle.current.reload(); });
    expect(handle.current.getColumns().map((column: any) => column.width)).toEqual([220, 120, 180]);
});

test('percentage and automatic widths follow real grid container changes', async () => {
    const { handle, view } = await mount([{ name: 'percent', title: 'Percent', width: '25%' }, { name: 'auto', title: 'Auto' }]);
    expect(handle.current.getColumns().map((column: any) => column.actualWidth)).toEqual([200, 600]);
    expect(view.getByRole('columnheader', { name: 'Percent' }).style.width).toBe('200px');
    act(() => {
        viewportWidth = 1000;
        observers.forEach(observer => observer.callback([{ contentRect: { width: viewportWidth, height: 300 } }]));
    });
    expect(handle.current.getColumns().map((column: any) => column.actualWidth)).toEqual([250, 750]);
    expect(handle.current.getColumns()[0].configuredWidth).toBe('25%');
    expect(view.getByRole('columnheader', { name: 'Auto' }).style.width).toBe('750px');
    resize(view, handle, 'percent', 310);
    expect(handle.current.getColumns().map((column: any) => column.actualWidth)).toEqual([310, 690]);
});

test('configuration snapshots are isolated while preserving React renderer identities', async () => {
    const editor = React.forwardRef<HTMLInputElement, any>((props, ref) => <input ref={ref} />);
    const { handle } = await mount([{ name: 'value', title: 'Value', width: 100, editor, metadata: { nested: { value: 1 } } }]);
    const first = handle.current.getColumns();
    const second = handle.current.getColumns();
    expect(first[0].editor).toBe(second[0].editor);
    first[0].width = 999;
    first[0].metadata.nested.value = 2;
    expect(handle.current.getColumns()[0]).toMatchObject({ width: 100, metadata: { nested: { value: 1 } } });
});

test('resize uses current callbacks after parent rerender and disconnects observers on unmount', async () => {
    const first = jest.fn();
    const second = jest.fn();
    const { handle, view, props } = await mount(makeColumns(), { onColumnResize: first });
    view.rerender(<Table {...props} onColumnResize={second} />);
    resize(view, handle, 'loose', 210);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    expect(observers.size).toBeGreaterThan(0);
    view.unmount();
    expect(observers.size).toBe(0);
});
