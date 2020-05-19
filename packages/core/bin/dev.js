const fs= require("fs")

/**
 * 处理 `rwp --dev` 命令的脚本
 */
const { getDependenciesRender, getDependenciesPlugin } = require('./utils/project')


/**
 * 获取当前的配置文件信息
 *   
 *   - devServer
 *         - port 端口号，默认 3000
 *         - host 默认 0.0.0.0
 *   - devtool 用户配置 sourcemap 类型
 */
function getConfig(){
    const configFile = `${process.cwd()}/.rwp.js`
    if(fs.existsSync(configFile)){
        return require(configFile).default()
    }
    return {}
}

exports.default = function (param){
    // 获取 render 的解析器
    const name = Object.keys(getDependenciesRender())[0]
    const render = require(`${process.cwd()}/node_modules/${name}`)
    if(typeof(render.default) !== 'function') {
        throw new Error(`renderer format error, it should be a function. [${name}]`)
    }

    // 获取当前插件信息
    const plugins = {}
    Object.keys(getDependenciesPlugin()).forEach(function(key){
        plugins[key] = require(key)
    })
    // 执行render逻辑,初始化webpack或者其他的打包工具。根据package.json的渲染器来进行工作
    render.default({
        status: param,
        config: getConfig(),
        plugins
    })
}