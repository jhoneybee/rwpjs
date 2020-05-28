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


exports.getRoutersText = function (routers) {
    let code = '['
    routers.forEach(function (router) {
        let obj = '{'
        Object.keys(router).forEach(function (key) {
            if (key === 'component') {
                obj += `${key}: ${router[key]},`
            } else if (key === 'routes') {
                if (router[key] && router[key].length > 0) {
                    obj += `${key}: ${exports.getRoutersText(router[key])} `
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

exports.getRealRouters = function (){
    return exports.getDirFiles(path.join(process.cwd(),'src','pages'), function(element){
        const filePath = element.path.replace(path.join(process.cwd(),'src','pages'), '')
    
        if(isFilter(filePath.replace(path.join(process.cwd(),'src','pages'), '').replace(/\\/g,'/'), element.type)){
            return undefined
        }
        let url = filePath.replace(/\.[A-Za-z1-9]+$/g,'').replace(/\\/g,'/')
        // 将pages/index.js 转换为首页
        if(url === '/index'){
            url = '/'
        }
        return  {
            path: url,
            component: `React.lazy(() => import(${JSON.stringify(element.type === 'directory' ? path.join(element.path,'index.js') : element.path )}))`,
            routes: element.childrens || []
        }
    })
}

exports.getLayout = function(){
    if(fs.existsSync(path.join(process.cwd(), 'src', 'layouts', 'index.js'))){
        return path.join(process.cwd(), 'src', 'layouts', 'index.tsx')
    }

    if(fs.existsSync(path.join(process.cwd(), 'src', 'layouts', 'index.tsx'))){
        return path.join(process.cwd(), 'src', 'layouts', 'index.tsx')
    }
    return ''
}

exports.getLayoutCode = function(){
    const filePath = exports.getLayout()
    if(filePath === ''){
        return `
    return (
        <Router>
            <Suspense fallback={<Loading/>}>
                <Switch>
                    {RouteComponent(routes)}
                </Switch>
            </Suspense>
        </Router>
    )
`
    }
    return `
    const Layout = React.lazy(() => import(${filePath}));
    return (
        <Router>
            <Suspense fallback={<Loading/>}>
                <Layout>
                    <Switch>
                        {RouteComponent(routes)}
                    </Switch>
                </Layout>
            </Suspense>
        </Router>
    )
` 
}