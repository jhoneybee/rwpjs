
// @ts-ignore
import * as CodeMirror from 'codemirror'

const keyword = [
    ['=', 'comparison'],
    ['>', 'comparison'],
    ['<', 'comparison'],
    ['~', 'comparison'],
    ['in', 'logic'],
    ['not in', 'logic'],
    ['or', 'logic'],
    ['and', 'logic'],
    ['not', 'logic'],
    ['?', 'logic'],
    [':', 'logic'],
    ['abs', 'function'],
    ['ceil', 'function'],
    ['floor', 'function'],
    ['log', 'function'],
    ['max', 'function'],
    ['min', 'function'],
    ['random', 'function'],
    ['round', 'function'],
    ['sqrt', 'function'],
]

CodeMirror.defineMode('search/filtrex-x', (_config: any) => ({
    token: (stream: any) => {
        if (stream.eatSpace()) { return null }
        stream.eatWhile(/[\\$\w\u4e00-\u9fa5]/)

        let color = null
        const value = stream.current()
        keyword.some(ele => {
            if (value === ele[0] && ele[1] === 'comparison') {
                color = 'qualifier'
                return true
            }
            if (value === ele[0] && ele[1] === 'logic') {
                color = 'def'
                return true
            }
            return false
        })
        stream.next()
        return color
    },
}))
