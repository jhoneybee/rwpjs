import React, { Dispatch, useReducer, useContext } from 'react';
import { Form as AntForm } from 'antd';
import { isString } from 'lodash'
import { FormProps, FormItemProps } from '../interface'
import { reducer, State, Action } from './reducer'

interface IContextProps {
    state: State<any>;
    dispatch: Dispatch<Action<any>>;
}
export const FormContext = React.createContext({} as IContextProps);

export const Form = (props: FormProps) => {
    const { cols = 5, style, labelWidth, children, ...restProps } = props
    const newStyle = style || {}
    const [state, dispatch] = useReducer(reducer, {
        labelWidth: labelWidth || 60,
    });
    return (
        <FormContext.Provider value={{ dispatch, state }}>
            <AntForm
                {...restProps}
                style={{
                    ...newStyle,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cols}, auto)`,
                    gridColumnGap: 8,
                }}
            >
                {children}
            </AntForm>
        </FormContext.Provider>
    )
}

const Item = (props: FormItemProps) => {
    const { colSpan, style, label, br, ...restProps } = props
    let gridColumn;
    if (colSpan) gridColumn = `auto/ span ${colSpan}`
    if (br) gridColumn = '1/ auto'
    if (colSpan && br) gridColumn = `1/ span ${colSpan}`
    const newStyle = style || {}
    const { state } = useContext(FormContext)
    const fixedWidthLabel = <span style={{ width: state.labelWidth }}>{label}</span>
    const cleanMarginBottom: React.CSSProperties = {}
    if (!props.name && !props.label) {
        cleanMarginBottom.marginBottom = 0
    }
    return (
        <AntForm.Item
            {...restProps}
            style={{ ...newStyle, gridColumn, ...cleanMarginBottom }}
            label={isString(label) ? fixedWidthLabel : label}
        />
    )
}
Form.Item = Item
