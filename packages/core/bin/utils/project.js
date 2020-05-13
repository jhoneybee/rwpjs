/**
 * 获取项目文件下的package.json文件
 */
exports.getRootPackage = function (){
    return require(`${process.cwd()}/package.json`)
}

/**
 * 根据正则获取目录下package.json的依赖
 */
exports.getDependenciesFilter = function (regular, fn){
    const dependencies = fn()
    const plugin = {}
    // 过滤依赖信息，获取当前符合条件的依赖
    Object.keys(dependencies).forEach(function(key){
        if(regular.test(key)) {
            plugin[key] = dependencies[key]
        }
    })
    return plugin
}

/**
 * 获取当前文件夹下符合条件的依赖信息
 * @return 返回package.json中dependencies依赖，符合 `@rwp/plugin-*` 开头的依赖组件
 */
exports.getDependenciesPlugin = function (){
    return exports.getDependenciesFilter(/^@rwp\/plugin-*/i,function(){
        return exports.getRootPackage().dependencies
    })
}

/**
 * 获取当前文件夹下符合条件的依赖信息
 * @return 返回package.json中dependencies依赖，符合 `@rwp/render-*` 开头的依赖组件
 */
exports.getDependenciesRender = function (){
    const render = exports.getDependenciesFilter(/^@rwp\/render-*/i,function(){
        return exports.getRootPackage().dependencies
    })

    // 如果配置中,没有配置对应的render依赖,或者程序中配置了过多的render依赖则会抛出对应的错误信息。
    if(Object.keys(render).length !== 1) { 
        throw new Error(`only one renderer can be configured.  [${Object.keys(render).join(',')}]`)
    }
    return render
}