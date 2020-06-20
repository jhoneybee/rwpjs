
export interface State<T> {
    rows: { total: number, datas: T[]}
    loading: boolean,
    pageNo: number
}

export type Action<T> = {
    type: 'SET_ADD_ROWS' | 'SET_LOADING',
    payload: any
}

export const initialState: State<any> = { rows: { total: 0, datas:[] }, loading: false, pageNo: 1 }

export function reducer<T>(state: State<T>, action: Action<T>) {
    switch (action.type) {
        case 'SET_ADD_ROWS':
            const realPayload = action.payload as {
                rows: { total: number, datas: T[]},
                loading: boolean
            } 
            const rows = {
                datas: realPayload.rows.datas ? state.rows.datas.concat(realPayload.rows.datas) : state.rows.datas,
                total: realPayload.rows.total
            }

            const pageNo = state.rows.datas.length > 0 ? state.pageNo + 1 : state.pageNo
            return { ...state, rows, loading: realPayload.loading, pageNo};
        case 'SET_LOADING': 
            return { ...state, loading: action.payload};
        default:
            throw new Error();
    }
}
