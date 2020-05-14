/**
 * 获取当前路径下约定的字符串
 */
const fs = require('fs');
const path = require('path')

/**
 * 
 * 递归获取目录下的所有文件，以数组的方式进行返回
 * 
 * @param dir 要查找的文件路径
 * @param map 结果集进行转换
 */
exports.getDirFiles = function (dir, map) {
    const routers = []
    const pages = fs.readdirSync(dir);
    for (let i = 0; i < pages.length; i++) {
        const realPath = path.join(dir, pages[i])
        const stat = fs.statSync(realPath)
        const type = stat.isDirectory() ? 'directory' : 'file'
        if (stat.isDirectory()) {
            const route = map({
                path: realPath,
                type: type,
                childrens: exports.getDirFiles(realPath, map)
            })
            if (route) {
                routers.push(route)
            }
        } else {
            const route = map({
                path: realPath,
                type: type,
            })
            if (route) {
                routers.push(route)
            }
        }
    }
    return routers
}

/**
 *  path
 *  component
 *  routes
 */
exports.getRoutersText = function (routers) {
    let code = '['
    routers.forEach(function (router) {
        let obj = '{'
        Object.keys(router).forEach(function (key) {
            if (key === 'component') {
                obj += `${key}: ${router[key]},`
            } else if (key === 'routes') {
                if (router[key] && router[key].length > 0) {
                    obj += `${key}: ${exports.getRoutersText(router[key])}`
                }
            } else if (key === 'path') {
                obj += `${key}: ${JSON.stringify(router[key])},`
            }
        })
        obj += '},'
        code += obj
    })
    return code + ']'
}