
import { CalculatedColumn } from 'react-data-grid'

export interface State<T> {
    rows: { total: number, datas: T[]}
    contextMenu?: {
        row: T,
        rowIdx: number,
        column: CalculatedColumn<any, unknown>
    },
    loading: boolean,
    pageNo: number
}

export type Action<T> = {
    type: 'SET_ADD_ROWS' | 'SET_LOADING' | 'SET_CONTEXTMENU',
    payload: any
}

export const initialState: State<any> = {
    rows: { total: 0, datas: [] },
    loading: false,
    pageNo: 1,
}

export function reducer<T>(state: State<T>, action: Action<T>) {
    if (action.type === 'SET_ADD_ROWS') {
        const realPayload = action.payload as {
            rows: { total: number, datas: T[]},
            loading: boolean
        }
        const { rows: { datas, total } } = realPayload
        const rows = {
            datas: state.rows.datas.concat(datas),
            total,
        }

        const pageNo = state.rows.datas.length > 0 ? state.pageNo + 1 : state.pageNo
        return { ...state, rows, loading: realPayload.loading, pageNo };
    }
    if (action.type === 'SET_LOADING') {
        return { ...state, loading: action.payload };
    }
    if (action.type === 'SET_CONTEXTMENU') {
        return { ...state, contextMenu: action.payload }
    }
    throw new Error(`No corresponding action found - type [${action.type}]`);
}
