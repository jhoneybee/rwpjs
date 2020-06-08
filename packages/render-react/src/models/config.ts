
import { existsSync } from 'fs'
import { join, resolve } from 'path'
import { DefinePlugin, Configuration } from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'


interface Config extends Configuration{
    devServer: {
        host: string,
        port: number,
        hot: boolean,
        inline: boolean,
        proxy: any
    }
}

function isBuild(status){
    return status === 'build'
}

function isAnalyzer(status){
    return status === 'analyzer'
}

function isWatch(status) {
    return status === 'watch'
}

export default (config, status) => {
    let ejsTemplate = join(process.cwd(), 'src', 'pages', 'document.ejs')
    if (!existsSync(ejsTemplate)) {
        ejsTemplate = join(__dirname, '..', 'template', 'document.ejs')
    }

    // 如果存在则初始化 babel-plugin-import
    let styleImport = []
    if(config.extraStylePluginImport){
        styleImport = ["import", ...(config.extraStylePluginImport || [])]
    }

    const plugins = [
        new HtmlWebpackPlugin({
            hash: true,
            template: ejsTemplate
        }),
        new DefinePlugin({
            // 系统的标题信息
            'RWP_TITLE': JSON.stringify(config.title || '')
        })
    ]

    if(isAnalyzer(status)){
        plugins.push(new BundleAnalyzerPlugin())
    }

    // 预设webpack属性
    const webpackConfig: Config = {
        mode: isBuild(status) ? 'production' : 'development',
        devtool: 'cheap-module-source-map',
        resolve:{
            extensions: ['.ts', '.tsx', '.js'],
            alias: {
                ...(config.alias || {})
            },
        },
        context: process.cwd(),
        
        devServer: {
            ...(config.devServer || {})
        },
        entry: join(process.cwd(), 'src', 'pages', '.rwp', 'rwp.js'),
        output: {
            filename: 'rwp.js',
            path: join(process.cwd(), 'dist')
        },
        module: {
            rules: [{
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }, {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'less-loader',
                    options: {
                        lessOptions: {
                            javascriptEnabled: true
                        }
                    }
                }]
            },
            {
                loader: "babel-loader",
                test: /\.(ts|js)x?$/,
                include: [
                    join(process.cwd(), 'src'),
                    ...(config.extraBabelIncludes || []).map(function(element){
                        return resolve(join(process.cwd(),element))
                    })
                ],
                options: {
                    sourceType: 'unambiguous',
                    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                    plugins: [
                        '@babel/plugin-transform-runtime',
                        '@babel/plugin-proposal-class-properties',
                        '@babel/plugin-proposal-object-rest-spread',
                        styleImport
                    ]
                },
            },
            ]
        },
        plugins,
    }

    if(config.target){
        webpackConfig.target = config.target
    }

    if(isWatch(status)){
        webpackConfig.watch = true
    }
 
    // 添加最小化压缩代码
    if(isBuild(status)){
        webpackConfig.optimization = {
            minimize: true,
            minimizer: [new TerserPlugin({
                sourceMap: false,
                extractComments: false,
            })],
        }
    }

    const hookWebpackConfig = config.extraWebpack || function (tempWebpack){ return tempWebpack};
    return hookWebpackConfig(webpackConfig)
}