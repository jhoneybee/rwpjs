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
exports.getSrcRouter = async function (dir, map){
    const routers = []
    const pages = await fs.promises.readdir(dir); 
    for(let i=0; i<pages.length ;i++){
        const realPath = path.join(dir,pages[i])
        const stat = await fs.promises.stat(realPath)
        const type = stat.isDirectory() ? 'directory' : 'file'
        if(stat.isDirectory()){
            const route = map({
                path: realPath,
                type: type,
                childrens: await exports.getSrcRouter(realPath,map)
            })
            if(route){
                routers.push(route)
            }
        }else{
            const route = map({
                path: realPath,
                type: type,
            })
            if(route){
                routers.push(route)
            }
        }
    }
    return routers
}