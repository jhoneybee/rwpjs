
export interface State {
    left: number,
    top: number
}

export declare type ActionType = 'SET_POSITION';


export type Action = {
    type: ActionType,
    payload: {
        left: number,
        top: number
    }
}

export function reducer(state: State, action: Action) {
    if (action.type === 'SET_POSITION') {
        return action.payload
    }
    throw new Error(`No corresponding action found - type [${action.type}]`);
}
