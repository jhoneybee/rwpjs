export interface State<T> {
    labelWidth: number
}

export type Action<T> = {
    type: 'SET_LABEL_WIDTH',
    payload: any
}

export function reducer<T>(state: State<T>, action: Action<T>) {
    if (action.type === 'SET_LABEL_WIDTH') {
        return { ...state, labelWidth: action.payload }
    }
    throw new Error(`No corresponding action found - type [${action.type}]`);
}
