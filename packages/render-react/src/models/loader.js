
const path = require('path')
const Routers = require('./routers')


/**
 * 
 *  满足以下任意规则的文件不会被注册为路由
 * 
 * - 以 . 或 _ 开头的文件或目录
 * - 以 d.ts 结尾的类型定义文件
 * - 以 test.ts、spec.ts、e2e.ts 结尾的测试文件（适用于 .js、.jsx 和 .tsx 文件）
 * - components 和 component 目录
 * - utils 和 util 目录
 * - 不是 .js、.jsx、.ts 或 .tsx 文件
 * - 文件内容不包含 JSX 元素
 */
function isFilter(filePath, type){
    if(type === 'file' && !/\.(ts|js)x?$/.test(filePath)){
        return true
    }

    if(/(components|component|util|utils)/g.test(filePath)){
        return true
    }

    if(/(\.test\.ts|\.spec\.ts|\.e2e\.ts|\.test\.js|\.spec\.js|\.e2e\.js|\.d\.ts)x?$/.test(filePath)){
        return true
    }

    if(/\/(\.|_).*/g.test(filePath)){
        return true
    }     
    return false
}

module.exports = function (source) {
    const routers = Routers.getDirFiles(path.join(process.cwd(),'src','pages'), function(element){
        const filePath = element.path.replace(path.join(process.cwd(),'src','pages'), '')

        if(isFilter(filePath.replace(path.join(process.cwd(),'src','pages'), '').replace(/\\/g,'/'), element.type)){
            return undefined
        }

        return  {
            path: filePath.replace(/\.[A-Za-z1-9]+$/g,'').replace(/\\/g,'/'),
            component: `require(${JSON.stringify(element.type === 'directory' ? path.join(element.path,'index.js') : element.path )}).default`,
            routes: element.childrens || []
        }
    })
    const code = source.replace(/\/\/\s*@RWP-TEMPLATE\s+ROUTES\s*/g,
    `const RWP = {}; RWP.routes = ${Routers.getRoutersText(routers)}; \r\n` )
    return code
}