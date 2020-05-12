/**
 * 处理 `rwp --dev` 命令的脚本
 */

const { getDependenciesRender } = require('./utils/project')

exports.default = function (){
    // 获取 render 的解析器
    const name = Object.keys(getDependenciesRender())[0]
    const render = require(name)

    if(typeof(render) !== 'function') {
        throw new Error(`renderer format error, it should be a function. [${name}]`)
    }

    // 执行render逻辑,初始化webpack或者其他的打包工具。根据package.json的渲染器来进行工作
    render()
}