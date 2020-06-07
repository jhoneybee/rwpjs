import * as fs from 'fs-extra'
import { join } from 'path'
import * as Webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'
import getWebpackConfig from './models/config'
import HookCompiler from './models/compiler'

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
export default ({ status, config, plugins }) => {
    
    if(status === 'dev' || status === 'analyzer'){
        // 初始化webpack编译
        initWebPack(getWebpackConfig(config, status)).then(function(compiler){
            const dirFile = join(process.cwd(),'src','pages','.rwp') 
            copy(join(__dirname,'template','temp'), dirFile)
            // 启动编译之前
            HookCompiler(compiler)
            // 初始化开发服务器
            initDevWebpackServer(compiler, getWebpackConfig(config, plugins).devServer)
        })
    }

    if(status === 'build'){
        // 初始化webpack编译
        initWebPack(getWebpackConfig(config, status)).then(function(compiler){
            compiler.run((err,stat) => {})
        })
    }

    if(status === 'watch'){
        initWebPack(getWebpackConfig(config, status)).then(function(compiler){
            compiler.watch({
                aggregateTimeout: 300,
                poll: undefined
            }, (err, stats) => {
            });
        })
    }
}