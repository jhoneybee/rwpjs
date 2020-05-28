const fs = require('fs-extra')
const path = require('path') 
const Webpack = require('webpack')
const WebpackDevServer = require("webpack-dev-server");
const getWebpackConfig = require('./models/config')
const HookCompiler = require('./models/compiler')

function copy(souce, targe){
    return fs.copySync(souce, targe)
}

/**
 * 初始化webpack的信息
 */ 
async function initWebPack(config) {
    return Webpack(config)
}

function initDevWebpackServer(compiler, config) {
    // 初始化开发服务器
    const server = new WebpackDevServer(compiler, config);
    if (config.devServer && config.devServer.port) {
        server.listen(Number.parseInt(config.devServer.port, 10))
    } else {
        server.listen(8000)
    }
}

// 初始化webpack相关的信息
exports.default = function ({ status, config, plugins }) {
    
    if(status === 'dev' || status === 'analyzer'){
        // 初始化webpack编译
        initWebPack(getWebpackConfig.default(config, status)).then(function(compiler){
            const dirFile = path.join(process.cwd(),'src','pages','.rwp') 
            copy(path.join(__dirname,'template','temp'), dirFile)
            // 启动编译之前
            HookCompiler.default(compiler)
            // 初始化开发服务器
            initDevWebpackServer(compiler, getWebpackConfig.default(config).devServer)
        })
    }

    if(status === 'build'){
        // 初始化webpack编译
        initWebPack(getWebpackConfig.default(config, status)).then(function(compiler){
            compiler.run()
        })
    }

    if(status === 'watch'){
        initWebPack(getWebpackConfig.default(config, status)).then(function(compiler){
            compiler.watch({
                aggregateTimeout: 300,
                poll: undefined
            }, (err, stats) => {
            });
        })
    }
}