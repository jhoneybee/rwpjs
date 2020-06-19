
export interface State<T> {
    rows: { total: number, datas: T[]}
    loading: boolean,
}

export type Action<T> = {
    type: 'SET_ADD_ROWS' | 'SET_LOADING',
    payload: any
}

export const initialState: State<any> = { rows: { total: 0, datas:[] }, loading: false }

export function reducer<T>(state: State<T>, action: Action<T>) {
    switch (action.type) {
        case 'SET_ADD_ROWS':
            console.log(action)
            const realPayload = action.payload as {
                rows: { total: number, datas: T[]},
                loading: boolean
            } 
            const rows = {
                datas: realPayload.rows.datas ? state.rows.datas.concat(realPayload.rows.datas) : state.rows.datas,
                total: realPayload.rows.total
            }
            return { ...state, rows, loading: realPayload.loading};
        case 'SET_LOADING': 
            return { ...state, loading: action.payload};
        default:
            throw new Error();
    }
}
