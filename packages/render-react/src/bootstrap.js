const fs = require('fs-extra')
const path = require('path') 
const Webpack = require('webpack')
const WebpackDevServer = require("webpack-dev-server");
const HtmlWebpackPlugin = require("html-webpack-plugin")
const HookCompiler = require('./models/compiler')

function copy(souce, targe){
    return fs.copySync(souce, targe)
}

async function initWebPack(config) {
    // 预设webpack属性
    let webpackConfig = {
        mode: 'development',
        devtool: 'cheap-module-source-map',
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },
        context: process.cwd(),
        entry: path.join(process.cwd(),'src','pages','.rwp','rwp.js'),
        output: {
            filename: 'rwp.js',
            path: path.join(process.cwd(),'dist' ),
        },
        module: {
            rules: [
                {
                    loader: "babel-loader",
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                        plugins: ['@babel/proposal-class-properties', '@babel/proposal-object-rest-spread']
                    },
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                hash: true,
                template: path.join(process.cwd(),'src','pages','.rwp','document.ejs')
            }),
            new Webpack.DefinePlugin({
                // 系统的标题信息
                'RWP.title': JSON.stringify(config.title || '')
            })
        ]
    }

    return Webpack(webpackConfig)
}

function initDevWebpackServer(compiler, plugins, config) {
    // 添加devWebpackServer预设
    let devWebpackServerConfig = {
        host: config.devServer && config.devServer.host ? config.devServer.host : '127.0.0.1',
    }
    // 加载插件信息, 初始化webpack信息
    Object.keys(plugins).forEach(function (plugin) {
        const pluginConfig = plugin.default({
            webpackConfig,
            devWebpackServerConfig,
        })
        webpackConfig = pluginConfig.webpackConfig
        devWebpackServerConfig = pluginConfig.devWebpackServerConfig
    })

    // 初始化开发服务器
    const server = new WebpackDevServer(compiler, devWebpackServerConfig);
    if (config.devServer && config.devServer.port) {
        server.listen(Number.parseInt(config.devServer.port, 10))
    } else {
        server.listen(8000)
    }
}

// 初始化webpack相关的信息
exports.default = function ({ config, plugins }) {
 
    // 初始化webpack编译
    initWebPack(config).then(function(compiler){
        const dirFile = path.join(process.cwd(),'src','pages','.rwp') 
        copy(path.join(__dirname,'template'), dirFile)
        // 启动编译之前
        HookCompiler.default(compiler)
        // 初始化开发服务器
        initDevWebpackServer(compiler, plugins, config)
    })
}