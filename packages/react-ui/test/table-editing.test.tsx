import React from 'react';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { Table } from '../src/table';
import { createStore } from '../src/table/store';
import { preFormatColumn } from '../src/table/column/PreFormatColumn';
import { GroupRow } from '../src/table/row/GroupRow';
import { StoreContext } from '../src/table/store';

let mockGridProps: any;
let mockStore: any;
let mockRenderEditors = false;

jest.mock('../src/index', () => {
    const React = require('react');
    return {
        Spin: ({ children }: any) => children,
        Input: React.forwardRef((props: any, ref: any) => <input ref={ref} value={props.value} onChange={event => props.onChange(event.target.value)} />),
        Checkbox: () => null,
    };
});
jest.mock('../src/table/row', () => ({ useRowRenderer: () => null }));
jest.mock('../src/table/plugin/Tools', () => ({ Tools: () => null }));
jest.mock('antd', () => ({ Pagination: () => null }));
jest.mock('@ant-design/icons', () => ({
    ReloadOutlined: ({ onClick }: any) => <button data-testid="refresh" onClick={onClick}>refresh</button>,
    DownOutlined: ({ onClick }: any) => <button data-testid="toggle-group" onClick={onClick}>collapse</button>,
    RightOutlined: ({ onClick }: any) => <button data-testid="toggle-group" onClick={onClick}>expand</button>,
}));
jest.mock('react-data-grid-temp', () => {
    const React = require('react');
    return {
        __esModule: true,
        default: React.forwardRef((props: any, ref: any) => {
            mockGridProps = props;
            mockStore = React.useContext(require('../src/table/store').StoreContext);
            React.useImperativeHandle(ref, () => ({ scrollToRow: jest.fn(), scrollToColumn: jest.fn(), selectCell: jest.fn() }));
            return <div data-testid="grid" data-loading={String(mockStore.loading)}>{props.rows.filter((row: any) => row.id).map((row: any) => (
                <div key={row.id}>
                    <span data-testid={`row-${row.id}`}>{row.quantity}</span>
                    {mockRenderEditors && props.columns.map((column: any) => {
                        const Formatter = column.formatter;
                        return Formatter ? <Formatter key={column.key} row={row} column={column} /> : null;
                    })}
                </div>
            ))}</div>;
        }),
    };
});

const originalRows = [{ id: 1, team: 'A', quantity: 5 }, { id: 2, team: 'B', quantity: 7 }];
const makeStore = (rows = originalRows, groupColumns = ['team']) => {
    const props: any = { columns: [], rowKey: 'id', loadData: async () => ({ datas: rows, total: rows.length }) };
    const store = createStore(props);
    store.reloadRows(rows);
    store.setGroupColumn(groupColumns);
    const root = store.groupDatas[0]?.$id;
    if (root) store.setExpandedKeys([root], root);
    return { store, props, root };
};
const mountTable = async (overrides: any = {}) => {
    const handle = React.createRef<any>();
    const loadData = jest.fn(async () => ({ datas: originalRows.map(row => ({ ...row })), total: 2 }));
    const props: any = { columns: [], table: handle, rowKey: 'id', groupColumn: [], loadData, onRowsUpdate: async (_event: any, commit: any) => { await commit(); }, ...overrides };
    const view = render(<Table {...props} />);
    await waitFor(() => expect(view.getByTestId('row-1').textContent).toBe('5'));
    await waitFor(() => expect(handle.current).toBeTruthy());
    return { handle, loadData, props, view };
};

afterEach(() => { cleanup(); jest.restoreAllMocks(); mockRenderEditors = false; });
test('grouped button and reload refresh remote fields while preserving edits and expanded groups', async () => {
    const { handle, loadData, props, view } = await mountTable();
    view.rerender(<Table {...props} groupColumn={['team']} />);
    const root = handle.current.getGroupDatas()[0].$id;
    act(() => handle.current.setExpandedKeys([root], root));
    await waitFor(() => expect(view.getByTestId('row-1').textContent).toBe('5'));
    const rowIndex = mockGridProps.rows.findIndex((row: any) => row.id === 1);
    await act(async () => { mockGridProps.onRowsUpdate({ action: 'CELL_UPDATE', toRow: rowIndex, fromRow: rowIndex, updated: { quantity: 9 } }); });
    expect(handle.current.getDataSource().find((row: any) => row.id === 1).quantity).toBe(9);
    const requestsBefore = loadData.mock.calls.length;
    loadData.mockImplementation(async () => ({ datas: originalRows.map(row => ({ ...row, status: 'fresh' })), total: 2 }));
    fireEvent.click(view.getByTestId('refresh'));
    await waitFor(() => expect(view.getByTestId('grid').getAttribute('data-loading')).toBe('false'));
    await act(async () => { await handle.current.reload({}); });
    expect(loadData).toHaveBeenCalledTimes(requestsBefore + 2);
    expect(view.getByTestId('row-1').textContent).toBe('9');
    expect(handle.current.getDataSource()[0].status).toBe('fresh');
    expect(handle.current.getExpandedKeys()).toEqual([root]);
});

test.each(['button', 'reload'])('ungrouped %s refresh preserves unsaved fields and updates other fields', async action => {
    const { handle, loadData, view } = await mountTable();
    await act(async () => { mockGridProps.onRowsUpdate({ action: 'CELL_UPDATE', toRow: 0, fromRow: 0, updated: { quantity: 9 } }); });
    expect(view.getByTestId('row-1').textContent).toBe('9');
    loadData.mockImplementationOnce(async () => ({ datas: originalRows.map(row => ({ ...row, status: 'fresh' })), total: 2 }));
    if (action === 'button') fireEvent.click(view.getByTestId('refresh'));
    else await act(async () => { await handle.current.reload({}); });
    await waitFor(() => expect(handle.current.getDataSource()[0].status).toBe('fresh'));
    expect(view.getByTestId('row-1').textContent).toBe('9');
    expect(loadData).toHaveBeenCalledTimes(2);
});

test('grouped update writes canonical rows and survives collapsing, regrouping, and refresh', async () => {
    const { store, root } = makeStore();
    await store.update(row => row.id === 1 ? { ...row, quantity: 9 } : row);
    expect(store.dataSource.find(row => row.id === 1)!.quantity).toBe(9);
    expect(store.datas.find(row => row.id === 1)!.quantity).toBe(9);
    store.setExpandedKeys([], root);
    store.setExpandedKeys([root], root);
    expect(store.dataSource.find(row => row.id === 1)!.quantity).toBe(9);
    store.setGroupColumn([]);
    expect(store.dataSource[0].quantity).toBe(9);
    store.setGroupColumn(['team']);
    store.setExpandedKeys([root], root);
    store.reloadRows(originalRows);
    expect(store.dataSource.find(row => row.id === 1)!.quantity).toBe(9);
});

test('grouped cell commit keeps group IDs and expanded rows stable', async () => {
    const { store, root } = makeStore();
    const rowIndex = store.dataSource.findIndex(row => row.id === 1);
    await store.commit({ action: 'CELL_UPDATE', toRow: rowIndex, fromRow: rowIndex, updated: { quantity: 9 } } as any);
    expect(store.datas.find(row => row.id === 1)!.quantity).toBe(9);
    store.setExpandedKeys([root], root);
    expect(store.dataSource.some(row => row.id === 1)).toBe(true);
    const newRoot = store.groupDatas[0].$id;
    expect(newRoot).toBe(root);
    store.setExpandedKeys([newRoot], newRoot);
    expect(store.dataSource.find(row => row.id === 1)!.quantity).toBe(9);
    expect(store.datas[0].$parent).toBeUndefined();
});

test('ROW editing accepts the first keystroke and preserves value, focus, and refs across column rebuilds', () => {
    const { store, props } = makeStore();
    const inputEditor = React.forwardRef<HTMLInputElement, any>((inputProps, ref) => <input data-testid="editor" ref={ref} value={inputProps.value} onChange={event => inputProps.onChange(event.target.value)} />);
    const column = { name: 'quantity', title: 'quantity', editable: true, editor: inputEditor };
    const tableProps = { ...props, columns: [column], selectBox: 'none', editorMode: { type: 'ROW', rowId: 1 } };
    store.columns = [column] as any;
    store.visibleColumns = ['quantity'];
    const row = store.dataSource.find(item => item.id === 1)!;
    const refs: any[] = [];
    const columns = preFormatColumn(store, tableProps, refs);
    const cellProps = { row, column: { key: 'quantity' } };
    const Cell: any = columns[0].formatter;
    const view = render(<Cell {...cellProps} />);
    const input = view.getByTestId('editor') as HTMLInputElement;
    fireEvent.change(view.getByTestId('editor'), { target: { value: '9' } });
    expect((view.getByTestId('editor') as HTMLInputElement).value).toBe('9');
    expect(refs[0].value.current.getValue()).toEqual({ quantity: '9' });
    expect(store.datas.find(item => item.id === 1)!.quantity).toBe('9');
    const rebuiltRefs: any[] = [];
    const rebuiltColumns = preFormatColumn(store, tableProps, rebuiltRefs);
    const RebuiltCell: any = rebuiltColumns[0].formatter;
    view.rerender(<RebuiltCell {...cellProps} />);
    expect(RebuiltCell).toBe(Cell);
    expect(view.getByTestId('editor')).toBe(input);
    expect(input.value).toBe('9');
    expect(document.activeElement).toBe(input);
    expect(rebuiltRefs[0].value.current.getValue()).toEqual({ quantity: '9' });
    store.reloadRows(originalRows);
    view.rerender(<RebuiltCell {...cellProps} row={store.dataSource.find(item => item.id === 1)} />);
    expect(input.value).toBe('9');
});

test('reloadRows refreshes group data and prunes obsolete expansion keys', () => {
    const { store, root } = makeStore();
    store.reloadRows(originalRows.map(row => ({ ...row, quantity: row.id === 1 ? 11 : row.quantity })));
    expect(store.datas.find(row => row.id === 1)!.quantity).toBe(11);
    expect(store.dataSource.find(row => row.id === 1)!.quantity).toBe(11);
    store.setExpandedKeys([root], root);
    expect(store.dataSource.find(row => row.id === 1)!.quantity).toBe(11);
    store.reloadRows([originalRows[1]]);
    expect(store.expandedKeys).toEqual([]);
    expect(store.groupDatas.some(row => row.$title === 'A')).toBe(false);
});

test('drafts follow stable rowKey values across server reordering', async () => {
    const { store } = makeStore();
    await store.update(row => row.id === 1 ? { ...row, quantity: 9 } : row);
    store.reloadRows([{ ...originalRows[1], quantity: 12 }, originalRows[0]]);
    expect(store.datas.map(row => [row.id, row.quantity])).toEqual([[2, 12], [1, 9]]);
});

test('only edited fields override server data, and server acknowledgement clears each field', async () => {
    const { store } = makeStore();
    await store.update(row => row.id === 1 ? { ...row, quantity: 9, note: 'local' } : row);
    store.reloadRows([{ ...originalRows[0], quantity: 9, note: 'old', status: 'fresh' }]);
    expect(store.datas[0]).toMatchObject({ quantity: 9, note: 'local', status: 'fresh' });
    store.reloadRows([{ ...originalRows[0], quantity: 11, note: 'old', status: 'newer' }]);
    expect(store.datas[0]).toMatchObject({ quantity: 11, note: 'local', status: 'newer' });
    store.reloadRows([{ ...originalRows[0], quantity: 12, note: 'local' }]);
    expect(store.rowEditData.size).toBe(0);
    store.reloadRows([{ ...originalRows[0], quantity: 13, note: 'server' }]);
    expect(store.datas[0]).toMatchObject({ quantity: 13, note: 'server' });
});

test('mutating update callbacks are tracked without passing synthetic group headers', async () => {
    const { store } = makeStore();
    const seen: number[] = [];
    await store.update(row => { seen.push(row.id); if (row.id === 1) row.quantity = 9; return row; });
    expect(seen).toEqual([1, 2]);
    store.reloadRows(originalRows);
    expect(store.datas[0].quantity).toBe(9);
});

test.each(['CELL_UPDATE', 'COPY_PASTE'])('%s retains edits after a refresh', async action => {
    const { store } = makeStore();
    const rowIndex = store.dataSource.findIndex(row => row.id === 1);
    await store.commit({ action, toRow: rowIndex, fromRow: rowIndex, updated: { quantity: 9 } } as any);
    store.reloadRows(originalRows);
    expect(store.datas[0].quantity).toBe(9);
    expect(store.dataSource.find(row => row.id === 1)!.quantity).toBe(9);
});

test('drag edits skip group headers and never write synthetic metadata to canonical rows', async () => {
    const { store } = makeStore();
    const roots = store.groupDatas.filter(row => row.$type === 'GROUP').map(row => row.$id);
    store.setExpandedKeys(roots, roots[1]);
    const updates = await store.commit({ action: 'CELL_DRAG', fromRow: 0, toRow: store.dataSource.length - 1, updated: { quantity: 9 } } as any);
    expect(updates.map(row => row.id)).toEqual([1, 2]);
    expect(Object.prototype.hasOwnProperty.call(store.datas, '-1')).toBe(false);
    expect(store.datas.every(row => row.quantity === 9 && row.$parent === undefined)).toBe(true);
    expect(store.expandedKeys).toEqual(roots);
    store.reloadRows(originalRows);
    expect(store.datas.map(row => row.quantity)).toEqual([9, 9]);
});

test('initial grouped loading renders the data when its async response arrives', async () => {
    const handle = React.createRef<any>();
    const view = render(<Table columns={[]} rowKey="id" table={handle} groupColumn={['team']} loadData={async () => ({ datas: originalRows, total: 2 })} />);
    await waitFor(() => expect(handle.current?.getGroupDatas().length).toBe(2));
    const root = handle.current.getGroupDatas()[0].$id;
    act(() => handle.current.setExpandedKeys([root], root));
    expect(view.getByTestId('row-1').textContent).toBe('5');
});

test('default onRowsUpdate commits locally when no custom save handler is supplied', async () => {
    const { handle } = await mountTable({ onRowsUpdate: undefined });
    await act(async () => { mockGridProps.onRowsUpdate({ action: 'CELL_UPDATE', toRow: 0, fromRow: 0, updated: { quantity: 9 } }); });
    await act(async () => { await handle.current.reload(); });
    expect(handle.current.getDataSource()[0].quantity).toBe(9);
});

test('custom save handlers still control whether a cell update is committed', async () => {
    const onRowsUpdate = jest.fn(async () => {});
    const { handle } = await mountTable({ onRowsUpdate });
    await act(async () => { mockGridProps.onRowsUpdate({ action: 'CELL_UPDATE', toRow: 0, fromRow: 0, updated: { quantity: 9 } }); });
    expect(onRowsUpdate).toHaveBeenCalledTimes(1);
    expect(handle.current.getDataSource()[0].quantity).toBe(5);
});

test('delayed commits target the original row even if refresh reorders rows first', async () => {
    let commit: () => Promise<any> = async () => {};
    const { handle, loadData } = await mountTable({ onRowsUpdate: async (_event: any, onCommit: any) => { commit = onCommit; } });
    await act(async () => { await mockGridProps.onRowsUpdate({ action: 'CELL_UPDATE', toRow: 0, fromRow: 0, updated: { quantity: 9 } }); });
    loadData.mockResolvedValueOnce({ datas: [originalRows[1], originalRows[0]], total: 2 });
    await act(async () => { await handle.current.reload(); });
    await act(async () => { await commit(); });
    expect(handle.current.getDataSource().map((row: any) => [row.id, row.quantity])).toEqual([[2, 7], [1, 9]]);
});

test('edits made while refresh is in flight survive the response', async () => {
    const { handle, loadData } = await mountTable();
    let respond: (value: any) => void = () => {};
    loadData.mockReturnValueOnce(new Promise(resolve => { respond = resolve; }));
    let pending: Promise<void> = Promise.resolve();
    act(() => { pending = handle.current.reload(); });
    await act(async () => { await handle.current.update((row: any) => row.id === 1 ? { ...row, quantity: 9 } : row); });
    await act(async () => { respond({ datas: originalRows.map(row => ({ ...row, status: 'fresh' })), total: 2 }); await pending; });
    expect(handle.current.getDataSource()[0]).toMatchObject({ quantity: 9, status: 'fresh' });
});

test('failed refresh clears loading and preserves data and edits', async () => {
    const { handle, loadData, view } = await mountTable();
    await act(async () => { await handle.current.update((row: any) => row.id === 1 ? { ...row, quantity: 9 } : row); });
    loadData.mockRejectedValueOnce(new Error('network failed'));
    await act(async () => { await expect(handle.current.reload()).rejects.toThrow('network failed'); });
    expect(view.getByTestId('grid').getAttribute('data-loading')).toBe('false');
    expect(handle.current.getDataSource()[0].quantity).toBe(9);
});

test('an older refresh response cannot overwrite a newer response', async () => {
    const { handle, loadData } = await mountTable();
    let olderResponse: (value: any) => void = () => {};
    let newerResponse: (value: any) => void = () => {};
    loadData.mockReturnValueOnce(new Promise(resolve => { olderResponse = resolve; }));
    loadData.mockReturnValueOnce(new Promise(resolve => { newerResponse = resolve; }));
    let older: Promise<void> = Promise.resolve();
    let newer: Promise<void> = Promise.resolve();
    act(() => { older = handle.current.reload(); newer = handle.current.reload(); });
    await act(async () => { newerResponse({ datas: [{ ...originalRows[0], quantity: 11 }], total: 1 }); await newer; });
    await act(async () => { olderResponse({ datas: originalRows, total: 2 }); await older; });
    expect(handle.current.getDataSource()[0].quantity).toBe(11);
    expect(handle.current.getDataSource().length).toBe(1);
});

test('nested groups keep stable encoded keys and require open ancestors', () => {
    const rows = [{ ...originalRows[0], team: 'A/B:C', region: 'x/y:z' }];
    const { store, root } = makeStore(rows, ['team', 'region']);
    const child = store.groupDatas.find(row => row.$type === 'GROUP' && row.$parent)!.$id;
    store.setExpandedKeys([root, child], child);
    expect(store.dataSource.some(row => row.id === 1)).toBe(true);
    store.reloadRows(rows);
    expect(store.expandedKeys).toEqual([root, child]);
    expect(store.dataSource.some(row => row.id === 1)).toBe(true);
    store.setExpandedKeys([child], child);
    expect(store.dataSource.some(row => row.id === 1)).toBe(false);
});

test('collapsing group A leaves group AA expanded', () => {
    const rows = [{ ...originalRows[0], team: 'A' }, { ...originalRows[1], team: 'AA' }];
    const { store } = makeStore(rows);
    const roots = store.groupDatas.filter(row => row.$type === 'GROUP').map(row => row.$id);
    store.setExpandedKeys(roots, roots[1]);
    const group = store.groupDatas.find(row => row.$title === 'A')!;
    const view = render(<StoreContext.Provider value={store}><GroupRow tableProps={{} as any} rowProps={{ row: group, top: 0 } as any} /></StoreContext.Provider>);
    fireEvent.click(view.getByTestId('toggle-group'));
    expect(store.expandedKeys).toEqual([roots[1]]);
});

test('numeric and string row keys stay distinct, including zero', async () => {
    const rows = [{ ...originalRows[0], id: 0 }, { ...originalRows[1], id: '0' as any }];
    const { store } = makeStore(rows);
    await store.update(row => row.id === 0 ? { ...row, quantity: 9 } : row);
    store.reloadRows(rows.slice().reverse());
    expect(store.datas.map(row => [row.id, row.quantity])).toEqual([['0', 7], [0, 9]]);
});

test('editing a grouping field keeps the edited row visible in its destination group', async () => {
    const { store } = makeStore();
    await store.update(row => row.id === 1 ? { ...row, team: 'B' } : row);
    expect(store.dataSource.find(row => row.id === 1)!.team).toBe('B');
    const group = store.dataSource.find(row => row.$type === 'GROUP')!;
    expect(group.$title).toBe('B');
    expect(store.expandedKeys).toContain(group.$id);
    store.reloadRows(originalRows);
    expect(store.dataSource.find(row => row.id === 1)!.team).toBe('B');
});

test('typing in a grouped ROW editor then clicking refresh preserves the input and refreshes other fields', async () => {
    mockRenderEditors = true;
    const inputEditor = React.forwardRef<HTMLInputElement, any>((props, ref) => <input data-testid="row-editor" ref={ref} value={props.value} onChange={event => props.onChange(event.target.value)} />);
    const { handle, loadData, props, view } = await mountTable({ columns: [{ name: 'quantity', title: 'quantity', editable: true, editor: inputEditor }], editorMode: { type: 'ROW', rowId: 1 } });
    view.rerender(<Table {...props} groupColumn={['team']} />);
    const root = handle.current.getGroupDatas()[0].$id;
    act(() => handle.current.setExpandedKeys([root], root));
    const input = view.getByTestId('row-editor') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '9' } });
    expect(handle.current.getDataSource()[0].quantity).toBe('9');
    expect(view.getByTestId('row-editor')).toBe(input);
    loadData.mockResolvedValueOnce({ datas: originalRows.map(row => ({ ...row, status: 'fresh' })), total: 2 });
    fireEvent.click(view.getByTestId('refresh'));
    await waitFor(() => expect(handle.current.getDataSource()[0].status).toBe('fresh'));
    expect(input.value).toBe('9');
    expect(view.getByTestId('row-editor')).toBe(input);
    expect(handle.current.getRowEditData()).toEqual([{ name: 'quantity', value: { quantity: '9' } }]);
    expect(handle.current.getExpandedKeys()).toEqual([root]);
});
