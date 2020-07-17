
import { Config } from '../interface' 
/**
 * 获取项目的根目录
 */
export const getProjectDir = () => process.cwd()

/**
 * 获取当前项目的开发Dependencies目录
 */
export const getDependencies = async (regular: RegExp ) => {
    const { dependencies } = await import(`${process.cwd()}/package.json`)
    const plugin = {}
    // 过滤依赖信息，获取当前符合条件的依赖
    Object.keys(dependencies).forEach((key) => {
        if(regular.test(key)) {
            plugin[key] = dependencies[key]
        }
    })
    return plugin
}

/**
 * 获取当前文件夹下符合条件的依赖信息
 * @return 返回package.json中dependencies依赖，符合 `@rwp/render-*` 开头的依赖组件
 */
export const getDependenciesRender = async () => {
    const render =  await getDependencies(/^@rwp\/render-*/i)

    // 如果配置中,没有配置对应的render依赖,或者程序中配置了过多的render依赖则会抛出对应的错误信息。
    if(Object.keys(render).length !== 1) { 
        throw new Error(`only one renderer can be configured.  [${Object.keys(render).join(',')}]`)
    }
    return render
}

export const defaultConfig = (config: Config): Config => {
    const tempConfig = config
    
    /**
     * 默认的配置 
     */
    const defConfig = {
        target: 'web',
        devServer: {
            port: 8000,
            host: '127.0.0.1'
        }
    }

    if(config.target === undefined){
        tempConfig.target = defConfig.target
    }
    
    if(config.devServer === undefined){
        tempConfig.devServer = defConfig.devServer
    }

    if(config.devServer.port === undefined){
        tempConfig.devServer.port = defConfig.devServer.port
    }
    
    return tempConfig
}