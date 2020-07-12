import { join, sep } from 'path'
import { existsSync, statSync, readdirSync } from 'fs'

interface Router {
    path: string,
    layout?: string,
    routes: Router[]
}

const isIgnore = (name: string, isFile: boolean) => {
    // 只有文件名为 `/^[A-Za-z]+\.route\.tsx$/` 结尾的文件才会被注册为路由信息
    if (isFile && /^[A-Za-z]+\.route\.tsx$/.test(name)) return false
    // 默认全部为忽略
    return true
}

/**
 * 递归获取文件目录
 * @param 要获取文件目录的路径
 */
export const getRouter = (path: string) => {
    const reslut: Router[] = []
    const catalogues = readdirSync(path)
    catalogues.forEach(name => {
        // 绝对路径
        const realPath = join(path, name);
        // 相对路径
        const relativePath = realPath.replace(process.cwd(), '')
        const status = statSync(realPath)
        // 忽略掉 `.rwp` 目录
        if (relativePath === join(sep,'src', 'pages', '.rwp')) return
        // 如果有路由文件,则为路由文件
        let layout;
        if (existsSync(join(path, 'layout.tsx'))) {
            layout = join(relativePath, 'layout.tsx')
        }
        // 如果是目录
        if (status.isDirectory()) {
            reslut.push(
                ...getRouter(realPath)
            )
        
        } else {
            if (isIgnore(name, status.isFile())) return;
            // 否则就是文件
            reslut.push({
                path: realPath,
                layout,
                routes: []
            })
        }
    })
    return reslut
}

const discardSuffix = (path: string) => {
   if(path) return path.replace(/(\.(j|t)sx)$/, '')
   return path
}

const discardSuffixRoute = (path: string) => {
    if(path) return path.replace(/(\.route\.(j|t)sx)$/, '')
    return path
}

export const getRouterTxt = (routers) => {
    let code = '['
    routers.forEach((router) => {
        const path = router.path.replace(join(process.cwd(), 'src', 'pages'), '').split('\\').join('/')

        let obj = '{'
        obj += `component: React.lazy(() => import(${JSON.stringify(discardSuffix(router.path))})),`
        obj += `routes: ${getRouterTxt(router.routes)},`
        obj += `path: ${JSON.stringify(discardSuffixRoute(path))},`
        if(router.layout){
            obj += `layout: React.lazy(() => import(${JSON.stringify(discardSuffix(router.layout))}))`
        }
        obj += '},'
        code += obj
    })
    return `${code}]`
}

export const getRouteCode = () => {
    const routers = getRouter(join(process.cwd(),'src','pages'))
    const codeTxt = getRouterTxt(routers)
    return `import React from "react";\n export default ${codeTxt}`
}
