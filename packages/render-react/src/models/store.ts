import { join } from 'path'
import { statSync, readdirSync, readFileSync } from 'fs'
import { discardSuffix, discardSuffixStore } from './utils'

const isIgnore = (name: string, isFile: boolean) => {
    // 只有文件名为 `/^[A-Za-z]+\.route\.tsx$/` 结尾的文件才会被注册为路由信息
    if (isFile && /^[A-Za-z]+\.store\.ts$/.test(name)) return false
    // 默认全部为忽略
    return true
}

const getStore = (path: string, callback: (file: string) => void) => {
    const catalogues = readdirSync(path)
    catalogues.forEach(name => {
        // 绝对路径
        const realPath = join(path, name);
        const status = statSync(realPath)

        // 如果是目录
        if (status.isDirectory()) {
            getStore(realPath,callback)
        } else {
            if (isIgnore(name, status.isFile())) return;
            callback(realPath)
        }
    })
}

export const getStoreCode = () => {
    let importFile = ''
    let initStores = ''
    getStore(join(process.cwd(), 'src', 'models'), (file) => {
        const path = file.replace(join(process.cwd(), 'src', 'models'), '').split('\\').join('/')
        const name = discardSuffixStore(path).replace(/\//g,'')
        importFile += `import ${name} from '${discardSuffix(file)}' \n`
        initStores += `'${name}': new ${name}(),`
    })
    return `
import { createContext, useContext } from 'react'
${importFile}

const createStores = () => ({
    ${initStores}
}) 

export const stores = createStores();
export const Context = createContext(stores);
export const useStores = (namespace: string) => useContext(Context)[namespace]
`
}

