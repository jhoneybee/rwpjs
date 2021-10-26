import React, { useState, useRef, useImperativeHandle, useEffect, RefObject } from 'react'
import { EditorProps, Column } from 'react-data-grid-temp';

interface CellEditorProps {
    ref?: RefObject<HTMLElement>,
    row: any,
    column: Column<any>
    style: React.CSSProperties
    value: any,
    onChange: (value: any) => void
}
interface DefaultEditorProps {
    // eslint-disable-next-line react/no-unused-prop-types
    node: React.FunctionComponent<CellEditorProps> | React.ComponentClass<CellEditorProps, any>
    extProps: EditorProps<any, any, unknown>
}

export const DefaultEditor = React.forwardRef((props: DefaultEditorProps, ref) => {
    const [value, setValue] = useState(props.extProps.value)
    const inputRef = useRef<HTMLElement>(null);
    const curentData = useRef<number>(Date.now())

    useImperativeHandle(ref, () => ({
        getValue: () => ({ [props.extProps.column.key]: value }),
        getInputNode: () => inputRef.current,
    }))

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
            onChange={(changeValue: string) => {
                if ((Date.now() - curentData.current) > 100) {
                    setValue(changeValue)
                }
            }}
        />
    )
})
