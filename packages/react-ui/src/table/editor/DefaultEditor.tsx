import React, { useState, useRef, useImperativeHandle, useEffect } from 'react'
import { EditorProps } from 'react-data-grid-temp';

interface DefaultEditorProps {
    node: React.ReactNode
    extProps: EditorProps<any, any, unknown>
}

export const DefaultEditor = React.forwardRef((props: DefaultEditorProps, ref) => {
    const [value, setValue] = useState(props.extProps.value)
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({
        getValue: () => ({ [props.extProps.column.key]: value }),
        getInputNode: () => inputRef.current,
    }))

    useEffect(() => {
        if (inputRef.current && inputRef.current.focus) {
            inputRef.current.focus()
        }
    }, [])

    // @ts-ignore
    return <props.node
        row={props.extProps.row}
        column={props.extProps.column}
        ref={inputRef}
        style={{ height: props.extProps.height + 2 }}
        value={value}
        onChange={(changeValue: string) => setValue(changeValue)}
    />
})
