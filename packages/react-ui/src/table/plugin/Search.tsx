// import React from 'react'
// import { UnControlled as CodeMirror } from 'react-codemirror2'
// import { classPrefix } from '../../utils'
// import { ColumnProps } from '../type'
// import './mode'
// import 'codemirror/addon/hint/show-hint'
// import 'codemirror/lib/codemirror.css'
// import 'codemirror/addon/hint/show-hint.css';
// import './style/index.less'

// interface Props {
//     // 列的信息
//     columns: ColumnProps[]
//     onPressEnter: (value: string) => void
//     onChange: (value: string) => void
// }

// export default ({
//     columns,
//     onPressEnter,
//     onChange,
// }: Props) => (
//     <CodeMirror
//         className={`${classPrefix}-table-plugin-search`}
//         options={{
//             mode: 'search/filtrex-x',
//             scrollbarStyle: 'null',
//             extraKeys: {
//                 'Alt-/': (editor: any) => {
//                     const options = {
//                         hint() {
//                           return {
//                             from: editor.getDoc().getCursor(),
//                             to: editor.getDoc().getCursor(),
//                             list: columns.map(col => col.title),
//                           }
//                         },
//                     };
//                     editor.showHint(options);
//                 },
//             },
//         }}

//         onBeforeChange={(editor, data, value) => {
//             const typedNewLine = data.origin === '+input' && typeof data.text === 'object' && data.text.join('') === '';
//             if (typedNewLine) {
//                 onPressEnter(value)
//                 return data.cancel();
//             }
//             onChange(value)
//             return null;
//         }}
//     />
// )
