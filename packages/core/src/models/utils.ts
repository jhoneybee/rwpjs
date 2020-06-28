import { Config } from '../interface' 
/**
 * 获取项目的根目录
 */
export const getProjectDir = () => process.cwd()

/**
 * 获取当前项目的开发Dependencies目录
 */
export const getDependencies = (regular: RegExp ) => {
    const dependencies = require(`${process.cwd()}/package.json`).dependencies
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
export const getDependenciesRender = () => {
    const render = exports.getDependencies(/^@rwp\/render-*/i)

    // 如果配置中,没有配置对应的render依赖,或者程序中配置了过多的render依赖则会抛出对应的错误信息。
    if(Object.keys(render).length !== 1) { 
        throw new Error(`only one renderer can be configured.  [${Object.keys(render).join(',')}]`)
    }
    return render
}

export const defaultConfig = (config: Config): Config => {
    const defConfig = {
        target: 'web',
        extraStylePluginImport: [],
        devServer: {
            port: 8000
        }
    }

    if(config.target === undefined){
        config.target = defConfig.target
    }

    if(config.extraStylePluginImport === undefined){
        config.extraStylePluginImport = defConfig.extraStylePluginImport
    }
    
    if(config.devServer === undefined){
        config.devServer = defConfig.devServer
    }

    if(config.devServer.port === undefined){
        config.devServer.port = defConfig.devServer.port
    }

    return config
}