import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { Menu } from 'antd'
import { Input } from '../index'
import { Table } from './index';
import { TableProps } from '../interface'

const getColumns = () => {
    const columns = []
    for (let i = 0; i < 6; i += 1) {
        columns.push({
            name: `field${i}`,
            title: `字段-${i}`,
            width: 120,
            editable: true,
            editor: Input,
        })
    }
    return columns
}

const getData = (pageNo: number, pageSize: number) => {
    const datas: any[] = []
    for (let i = 0; i < pageSize; i += 1) {
        datas.push({
            field0: `${pageNo}-cell-field0-${i}`,
            field1: `${pageNo}-cell-field1-${i}`,
            field2: `${pageNo}-cell-field2-${i}`,
            field3: `${pageNo}-cell-field3-${i}`,
            field4: `${pageNo}-cell-field4-${i}`,
            field5: `${pageNo}-cell-field5-${i}`,
            field6: `${pageNo}-cell-field6-${i}`,
            field7: `${pageNo}-cell-field7-${i}`,
        })
    }

    return { datas, total: 0 }
}

const rootPromiseProps: TableProps<any> = {
    columns: getColumns(),
    width: 500,
    height: 500,
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadData: async (pageNo, pageSize, params) => getData(pageNo, pageSize),
}

test('test table async load data.', async () => {
    const { findByText, container } = render(<Table<any> {...rootPromiseProps}/>)
    const fields = await findByText('1-cell-field0-0')
    fireEvent.dblClick(fields)
    expect(container).toMatchSnapshot()
})

test('test table editor.', async () => {
    const {
        findByText,
        findByDisplayValue,
        container,
    } = render(<Table<any> {...rootPromiseProps}/>)
    const fields = await findByText('1-cell-field0-0')
    await fireEvent.dblClick(fields)
    const editor = await findByDisplayValue('1-cell-field0-0')
    fireEvent.change(editor, { target: { value: 'change-1-cell-field0-0' } })
    fireEvent.blur(editor)
    expect(editor).toBeInstanceOf(Element)
    expect(container).toMatchSnapshot()
})

test('test table sync load data.', async () => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rootPromiseProps.loadData = (pageNo, pageSize, params) => getData(pageNo, pageSize)
    const { findByText, container } = render(<Table<any> {...rootPromiseProps}/>)
    await findByText('1-cell-field0-0')
    expect(container).toMatchSnapshot()
})

test('test table context menu.', async () => {
    rootPromiseProps.contextMenu = () => (
        <Menu>
            <Menu.Item key="1">row</Menu.Item>
            <Menu.Item key="2">row index</Menu.Item>
            <Menu.Item key="3">column</Menu.Item>
        </Menu>
    )
    const { findByText, container } = render(<Table<any> {...rootPromiseProps}/>)
    const cell0 = await findByText('1-cell-field0-0')
    await fireEvent.contextMenu(cell0)
    expect(container).toMatchSnapshot()
})

test('test table infinite scrolling.', async () => {
    const { findByText, container } = render(<Table<any> {...rootPromiseProps}/>)

    await findByText('1-cell-field0-0')
    await act(async() => {
        const dom = container.querySelector('.rdg')!
        await fireEvent.scroll(dom, {
            target: {
                scrollY: dom.scrollHeight + 20,
            },
        })
    })
    expect(container).toMatchSnapshot()
})
