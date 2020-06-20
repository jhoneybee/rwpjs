import React, { useEffect, useRef, useReducer, Dispatch, useContext, useImperativeHandle, useState } from 'react'
import ReactDataGrid, { EditorProps } from 'react-data-grid'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Empty } from 'antd'
import { TableProps } from '../interface'
import { isPromise } from '../utils'
import { reducer, initialState, State, Action } from './reducer'
import { Input } from '../index'

import 'react-data-grid/dist/react-data-grid.css'
import './style/index.less'

interface IContextProps{
    state: State<any>;
    dispatch: Dispatch<Action<any>>;
}

const TableContext = React.createContext({} as IContextProps);

// 装载数据
const loadData = async (
    pageSize: number,
    param: Object,
    loadData: (pageNo: number , pageSize: number, params: Object) => PromiseLike<{ total: number, datas: any[]}> | { total: number, datas: any[]},
    dispatch: Dispatch<Action<any>>,
    state: State<any>
) => {
    await dispatch({
        type: 'SET_LOADING',
        payload: {
            loading: true
        } 
    })
    const res = loadData(state.pageNo, pageSize, param)
    if(isPromise(res)){
        const resp = await (res as PromiseLike<{ total: number, datas: any[]}>)
        await dispatch({
            type: 'SET_ADD_ROWS',
            payload: {
                rows: resp,
                loading: false
            }
        })
    }else if(res){
        await dispatch({
            type: 'SET_ADD_ROWS',
            payload: {
                rows: res as { total: number, datas: any[]},
                loading: false
            } 
        })
    }
}

interface CustomEditorProps{
    node: React.ReactNode
    extProps: EditorProps<any, any, unknown>
}

const CustomEditor = React.forwardRef((props: CustomEditorProps, ref) => {
    const [value, setValue] = useState(props.extProps.value)

    const inputRef = useRef<HTMLElement>(null);
    useImperativeHandle(ref,() => ({
        getValue: () => ({
            [props.extProps.column.key]: value
        }),
        getInputNode: () => inputRef.current
    }))

    useEffect(()=>{
        if(inputRef.current && inputRef.current.focus){
            inputRef.current.focus()
        }
    }, [])

    //@ts-ignore
    return <props.node
        ref={inputRef}
        style={{ height: props.extProps.height + 2}}
        onBlur={() => props.extProps.onCommit()}
        value={value}
        onChange={(value: string)=> setValue(value)}
    />
})

export function Table<T> (props: TableProps<T>){
    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        // 装载数据
        if(props.autoLoadData){
            loadData(props.pageSize!, props.params! ,props.loadData,dispatch, state)
        }
    },[])
    const columns = props.columns.map((element =>{
        const {name, title, editor, editable ,...restProps} = element
        const TempEditor = editable ? editor || Input : undefined
        return {
            key: name,
            name: title,
            resizable: true,
            editor: TempEditor ? React.forwardRef((props: EditorProps<T[keyof T], T, unknown>, ref) =>{
                const domRef = useRef<any>(null);
                useImperativeHandle(ref,() => ({
                    getValue: () => ({
                        [props.column.key]: domRef.current.getValue()
                    }),
                    getInputNode: () => {
                        return domRef.current.getInputNode()
                    }
                }))
                return <CustomEditor ref={domRef} node={TempEditor} extProps={props}/>
            }) as React.ComponentType<EditorProps<T[keyof T], T, unknown>> : undefined,
            ...restProps
        }
    }))
    return (
        <TableContext.Provider value={{ dispatch, state }}>
            <Spin
                spinning={state.loading}
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            >
                <ReactDataGrid
                    columns={columns}
                    rows={state.rows.datas as T[]}
                    onScroll={(e) => {
                        const target = e.currentTarget
                        if(
                            target.scrollTop + target.clientHeight + 2 > target.scrollHeight
                            &&
                            state.rows.datas.length > 0
                        ){
                            loadData(props.pageSize!,props.params!,props.loadData,dispatch, state)
                        }
                        target.scrollTop = target.scrollTop 
                    }}
                    enableCellAutoFocus={props.enableCellAutoFocus}
                    enableCellCopyPaste={props.enableCellCopyPaste}
                    enableCellDragAndDrop={props.enableCellDragAndDrop}
                    onRowsUpdate={(e)=>{
                        console.log(e)
                    }}
                />
            </Spin>
        </TableContext.Provider>
    )
}

Table.defaultProps = {
    pageSize: 50,
    params: {},
    autoLoadData: true,
    enableCellCopyPaste: true,
    enableCellAutoFocus: true,
    enableCellDragAndDrop: true
}
