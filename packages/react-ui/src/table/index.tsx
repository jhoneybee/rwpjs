import React, { useEffect, useState, useRef, useReducer, Dispatch, useContext } from 'react'
import ReactDataGrid from 'react-data-grid'
import { Spin } from 'antd'
import { TableProps } from '../interface'
import { isPromise } from '../utils'
import { reducer, initialState, State, Action } from './reducer'

import 'react-data-grid/dist/react-data-grid.css'
import './style/index.less'

interface IContextProps{
    state: State<any>;
    dispatch: Dispatch<Action<any>>;
}

const TableContext = React.createContext({} as IContextProps);

// 装载数据
const loadData = async (
    pageNo: number,
    pageSize: number,
    param: Object,
    loadData: (pageNo: number , pageSize: number, params: Object) => PromiseLike<{ total: number, datas: any[]}> | { total: number, datas: any[]},
    dispatch: Dispatch<Action<any>>
) => {
    await dispatch({
        type: 'SET_LOADING',
        payload: {
            loading: true
        } 
    })
    const res = loadData(pageNo, pageSize, param)
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

function Table<T> (props: TableProps<T>){
    const [state, dispatch] = useReducer(reducer, initialState);

    // 计算当前页
    const pageNo = useRef(0)

    useEffect(() => {
        // 装载数据
        if(props.autoLoadData){
            loadData(++pageNo.current, props.pageSize!, props.params! ,props.loadData,dispatch)
        }
    },[])
    const columns = props.columns.map((element =>{
        const {name, title, ...restProps} = element
        return {
            key: name,
            name: title,
            resizable: true,
            ...restProps
        }
    }))

    return (
        <TableContext.Provider value={{ dispatch, state }}>
            <Spin
                spinning={state.loading}
            >
                <ReactDataGrid
                    columns={columns}
                    rows={state.rows.datas as T[]}
                    onScroll={(e) => {
                        const target = e.currentTarget
                        if(target.scrollTop + target.clientHeight + 2 > target.scrollHeight){
                            loadData(++pageNo.current , props.pageSize!,props.params!,props.loadData,dispatch)
                        }
                    }}
                />
            </Spin>
        </TableContext.Provider>
    )
}

Table.defaultProps = {
    pageSize: 50,
    params: {},
    autoLoadData: true
}

export default Table;
