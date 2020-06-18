import { readdirSync, statSync, existsSync }  from 'fs'

import { join } from 'path'

interface Stat {
    path: string 
    type: string 
    childrens?: Stat[]
}

/**
 * 
 * 递归获取目录下的所有文件，以数组的方式进行返回
 * 
 * @param dir 要查找的文件路径
 * @param map 结果集进行转换
 */
export const getDirFiles = (dir, map: (stat: Stat) => Object) => {
    const routers = []
    const pages = readdirSync(dir);
    for (let i = 0; i < pages.length; i++) {
        const realPath = join(dir, pages[i])
        const stat = statSync(realPath)
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
 * 
 * 根据路由信息,生成对应的代码
 * 
 * @param routers 
 */
export const getRoutersText = (routers) => {
    let code = '['
    routers.forEach((router) => {
        let obj = '{'
        Object.keys(router).forEach(function (key) {
            if (key === 'component') {
                obj += `${key}: ${router[key]},`
            } else if (key === 'routes') {
                if (router[key] && router[key].length > 0) {
                    obj += `${key}: ${getRoutersText(router[key])} `
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
 * 
 * @param filePath 文件路径
 * @param type 文件类型
 * @return true 表示过滤, false表示不过滤
 */

const isFilter = (path: string , type: string): boolean => {
    if(type === 'file' && !/\.(ts|js)x?$/.test(path)){
        return true
    }

    if(/(components|component|util|utils)/g.test(path)){
        return true
    }

    if(/(\.test\.ts|\.spec\.ts|\.e2e\.ts|\.test\.js|\.spec\.js|\.e2e\.js|\.d\.ts)x?$/.test(path)){
        return true
    }

    if(/\/(\.|_).*/g.test(path)){
        return true
    }     
    return false
}

/**
 * 预处理的路由信息
 */
interface PreRoute {
    // 路径信息
    path: string 
    // 组件的代码表达方式
    component: string 
    // 路由信息
    routes: PreRoute[]
}

/**
 * 获取预处路由信息
 */
export const getRealRouters = (): PreRoute[]  => {
    return getDirFiles(join(process.cwd(),'src','pages'), (element) => {
        const filePath = element.path.replace(join(process.cwd(),'src','pages'), '')
    
        if(isFilter(filePath.replace(join(process.cwd(),'src','pages'), '').replace(/\\/g,'/'), element.type)){
            return undefined
        }
        let url = filePath.replace(/\.[A-Za-z1-9]+$/g,'').replace(/\\/g,'/')

        // 将pages/index.js 转换为首页
        if(url === '/index'){
            url = '/'
        }

        return  {
            path: url,
            component: `React.lazy(() => import(${JSON.stringify(element.type === 'directory' ? join(element.path,'index.js') : element.path )}))`,
            routes: element.childrens || []
        }
    })
}

/**
 * 获取布局信息
 */
export const getLayout = () => {
    if(existsSync(join(process.cwd(), 'src', 'layouts', 'index.tsx'))){
        return join(process.cwd(), 'src', 'layouts', 'index.tsx')
    }

    if(existsSync(join(process.cwd(), 'src', 'layouts', 'index.js'))){
        return join(process.cwd(), 'src', 'layouts', 'index.tsx')
    }
    return ''
}

/**
 * 获取预处理的代码
 */
export const getLayoutCode = () => {
    const filePath = getLayout()
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