import React from 'react';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { Table } from '../src/table';

jest.mock('../src/index', () => {
    const React = require('react');
    return {
        Spin: ({ children }: any) => children,
        Input: React.forwardRef((props: any, ref: any) => (
            <input ref={ref} aria-label="cell editor" value={props.value}
                onChange={event => props.onChange(event.target.value)}
                onBlur={props.onBlur} onKeyDown={props.onKeyDown} />
        )),
        Checkbox: () => null,
    };
});
jest.mock('../src/table/plugin/Tools', () => ({ Tools: () => null }));
jest.mock('antd', () => ({ Pagination: () => null }));
jest.mock('@ant-design/icons', () => ({
    ReloadOutlined: ({ onClick }: any) => <button onClick={onClick}>refresh</button>,
    DownOutlined: () => null,
    RightOutlined: () => null,
}));

const originalResizeObserver = (window as any).ResizeObserver;
beforeEach(() => {
    (window as any).ResizeObserver = class {
        callback: any;
        constructor(callback: any) { this.callback = callback; }
        observe() { this.callback([{ contentRect: { width: 800, height: 400 } }]); }
        disconnect() {}
    };
});
afterEach(() => { cleanup(); (window as any).ResizeObserver = originalResizeObserver; });

const mount = async (grouped: boolean, overrides: any = {}) => {
    const handle = React.createRef<any>();
    let version = 0;
    const loadData = jest.fn(async () => ({
        total: 2,
        datas: [
            { id: 'a', name: 'Alice', team: 'A', version: ++version },
            { id: 'b', name: 'Bob', team: 'A', version },
        ],
    }));
    const view = render(<Table table={handle} rowKey="id" groupColumn={grouped ? ['team'] : []}
        editorMode={{ type: 'CELL' }} columns={[
            { name: 'id', title: 'ID', width: 100 },
            { name: 'name', title: 'Name', width: 180, editable: true },
            { name: 'version', title: 'Version', width: 100 },
        ]} loadData={loadData} {...overrides} />);
    await waitFor(() => expect(handle.current?.getDataSource().length).toBe(2));
    if (grouped) act(() => handle.current.setExpandedKeys(handle.current.getGroupDatas().map((row: any) => row.$id), ''));
    await waitFor(() => expect(view.getByRole('gridcell', { name: 'Alice', exact: true })).toBeTruthy());
    return { view, handle };
};

const beginEdit = (view: ReturnType<typeof render>, value = 'Alice edited') => {
    fireEvent.doubleClick(view.getByRole('gridcell', { name: 'Alice', exact: true }));
    const input = view.getByRole('textbox', { name: 'cell editor' });
    fireEvent.change(input, { target: { value } });
    return input;
};

test.each([false, true])('clicking another cell commits the input and reload preserves it (grouped=%s)', async grouped => {
    const { view, handle } = await mount(grouped);
    const input = beginEdit(view);
    const target = view.getByRole('gridcell', { name: 'Bob', exact: true });
    fireEvent.blur(input, { relatedTarget: target });
    fireEvent.click(target);
    await waitFor(() => expect(handle.current.getDataSource()[0].name).toBe('Alice edited'));
    await act(async () => { await handle.current.reload(); });
    expect(handle.current.getDataSource()[0]).toMatchObject({ name: 'Alice edited', version: 2 });
});

test('clicking table refresh commits the active cell before loading new data', async () => {
    const { view, handle } = await mount(true);
    const input = beginEdit(view);
    const refresh = view.getByRole('button', { name: 'refresh' });
    fireEvent.blur(input, { relatedTarget: refresh });
    fireEvent.click(refresh);
    await waitFor(() => expect(handle.current.getDataSource()[0].version).toBe(2));
    expect(handle.current.getDataSource()[0].name).toBe('Alice edited');
});

test.each(['Enter', 'Tab'])('%s commits exactly once', async key => {
    const onRowsUpdate = jest.fn(async (_event: any, commit: any) => { await commit(); });
    const { view, handle } = await mount(true, { onRowsUpdate });
    const input = beginEdit(view);
    fireEvent.keyDown(input, { key });
    fireEvent.blur(input);
    await waitFor(() => expect(handle.current.getDataSource()[0].name).toBe('Alice edited'));
    expect(onRowsUpdate).toHaveBeenCalledTimes(1);
});

test('Escape cancels without committing on blur', async () => {
    const onRowsUpdate = jest.fn(async (_event: any, commit: any) => { await commit(); });
    const { view, handle } = await mount(true, { onRowsUpdate });
    const input = beginEdit(view);
    fireEvent.keyDown(input, { key: 'Escape' });
    fireEvent.blur(input);
    expect(handle.current.getDataSource()[0].name).toBe('Alice');
    expect(onRowsUpdate).not.toHaveBeenCalled();
});

test('blur still lets a custom save handler decide whether to commit', async () => {
    const onRowsUpdate = jest.fn();
    const { view, handle } = await mount(true, { onRowsUpdate });
    const input = beginEdit(view);
    const target = view.getByRole('gridcell', { name: 'Bob', exact: true });
    fireEvent.blur(input, { relatedTarget: target });
    fireEvent.click(target);
    await waitFor(() => expect(onRowsUpdate).toHaveBeenCalledTimes(1));
    expect(handle.current.getDataSource()[0].name).toBe('Alice');
});

test('leaving the input without clicking also commits', async () => {
    const { view, handle } = await mount(true);
    const input = beginEdit(view);
    fireEvent.blur(input, { relatedTarget: null });
    await waitFor(() => expect(handle.current.getDataSource()[0].name).toBe('Alice edited'));
});

test('moving focus within a compound editor keeps it open until focus leaves the editor', async () => {
    const onRowsUpdate = jest.fn(async (_event: any, commit: any) => { await commit(); });
    const CompoundEditor = React.forwardRef<any, any>((props, ref) => (
        <div>
            <input ref={ref} aria-label="cell editor" value={props.value}
                onChange={event => props.onChange(event.target.value)}
                onBlur={props.onBlur} onKeyDown={props.onKeyDown} />
            <button>inside editor</button>
        </div>
    ));
    const { view, handle } = await mount(true, {
        onRowsUpdate,
        columns: [{ name: 'name', title: 'Name', width: 180, editable: true, editor: CompoundEditor }],
    });
    const input = beginEdit(view);
    const internal = view.getByRole('button', { name: 'inside editor' });
    fireEvent.blur(input, { relatedTarget: internal });
    fireEvent.click(internal);
    expect(onRowsUpdate).not.toHaveBeenCalled();
    expect(view.getByRole('textbox', { name: 'cell editor' })).toBeTruthy();
    const target = view.getByRole('gridcell', { name: 'Bob', exact: true });
    fireEvent.blur(input, { relatedTarget: target });
    fireEvent.click(target);
    await waitFor(() => expect(handle.current.getDataSource()[0].name).toBe('Alice edited'));
    expect(onRowsUpdate).toHaveBeenCalledTimes(1);
});
