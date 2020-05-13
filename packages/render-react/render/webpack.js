
const Webpack = require('webpack')
const WebpackDevServer = require("webpack-dev-server");
const HtmlWebpackPlugin = require("html-webpack-plugin")

exports.default = function ({config, plugins}){

    // 预设webpack属性
    let webpackConfig = {
        mode: 'development',
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },
        entry: {
            home: `${__dirname}/../src/entry.js`, 
        },
        output: {
            filename: 'rwp.js', 
            path: `${process.cwd()}/dist`,
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
                template: `${__dirname}/../src/document.ejs`
            })
        ]
    }

    // 添加devWebpackServer预设
    let devWebpackServerConfig = {
        hot: true,
        host: config.devServer && config.devServer.host ? config.devServer.host : '0.0.0.0'
    }

    // 加载插件信息, 初始化webpack信息
    Object.keys(plugins).forEach(function(plugin){
        const pluginConfig = plugin.default({
            webpackConfig,
            devWebpackServerConfig,
        })
        webpackConfig = pluginConfig.webpackConfig
        devWebpackServerConfig = pluginConfig.devWebpackServerConfig
    })

    const compiler = Webpack(webpackConfig)
    const server = new WebpackDevServer(compiler, devWebpackServerConfig);

    if(config.devServer && config.devServer.port){
        server.listen(Number.parseInt(config.devServer.port, 10))
    }else{
        server.listen(8000)
    }
}

