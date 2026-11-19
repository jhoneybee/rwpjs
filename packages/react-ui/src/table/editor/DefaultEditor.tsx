import React, { useState, useRef, useImperativeHandle, useEffect, RefObject } from 'react'
import { EditorProps, Column } from 'react-data-grid-temp';

interface CellEditorProps {
    ref?: RefObject<HTMLElement>,
    row: any,
    column: Column<any>
    style: React.CSSProperties
    value: any,
    onChange: (value: any) => void
    onBlur?: React.FocusEventHandler<HTMLElement>
    onKeyDown?: React.KeyboardEventHandler<HTMLElement>
}
interface DefaultEditorProps {
    // eslint-disable-next-line react/no-unused-prop-types
    node: React.FunctionComponent<CellEditorProps> | React.ComponentClass<CellEditorProps, any>
    extProps: EditorProps<any, any, unknown>
    rowKey?: string
    onValueChange?: (value: any) => void
}

export const DefaultEditor = React.forwardRef((props: DefaultEditorProps, ref) => {
    const [value, setValue] = useState(props.extProps.value)
    const valueRef = useRef(props.extProps.value)
    const blurHandled = useRef(false)
    const inputRef = useRef<HTMLElement>(null);
    const rowKey = props.extProps.row[props.rowKey || '$index']

    useImperativeHandle(ref, () => ({
        getValue: () => ({ [props.extProps.column.key]: valueRef.current }),
        getInputNode: () => inputRef.current,
    }))

    useEffect(() => {
        valueRef.current = props.extProps.value
        setValue(props.extProps.value)
    }, [props.extProps.value, rowKey, props.extProps.column.key])

    useEffect(() => { blurHandled.current = false }, [rowKey, props.extProps.column.key])

    useEffect(() => {
        if (inputRef.current && inputRef.current.focus) {
            inputRef.current.focus()
        }
    }, [])

    return (
        <props.node
            row={props.extProps.row}
            column={props.extProps.column}
            ref={inputRef}
            style={{ height: props.extProps.height }}
            value={value}
            onBlur={event => {
                if (props.onValueChange || blurHandled.current) return
                const container = event.currentTarget.closest('.rdg-editor-container')
                if (event.relatedTarget && container?.contains(event.relatedTarget)) return
                // Commit before a cell click unmounts the editor and clears its ref.
                blurHandled.current = true
                props.extProps.onCommit()
            }}
            onKeyDown={event => {
                if (event.key === 'Escape') blurHandled.current = true
            }}
            onChange={(changeValue: any) => {
                valueRef.current = changeValue
                setValue(changeValue)
                props.onValueChange?.(changeValue)
            }}
        />
    )
})
