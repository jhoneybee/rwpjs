const fs = require('fs');
const path = require('path')
const Webpack = require('webpack')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function isBuild(status){
    return status === 'build'
}

function isAnalyzer(status){
    return status === 'analyzer'
}

exports.default = function (config, status) {
    let ejsTemplate = path.join(process.cwd(), 'src', 'pages', 'document.ejs')
    if (!fs.existsSync(ejsTemplate)) {
        ejsTemplate = path.join(process.cwd(), 'src', 'pages', '.rwp', 'document.ejs')
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
        new Webpack.DefinePlugin({
            // 系统的标题信息
            'RWP.title': JSON.stringify(config.title || '')
        }),
        new Webpack.DllPlugin({
            context: process.cwd(),
            path: '[name]_library',
            name: '[name]_[hash]'
        })
    ]

    if(isAnalyzer(status)){
        plugins.push(new BundleAnalyzerPlugin())
    }

    // 预设webpack属性
    const webpackConfig = {
        mode: isBuild(status) ? 'production' : 'development',
        devtool: 'cheap-module-source-map',
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },
        resolve:{
            alias: {
                'react': path.resolve(process.cwd(), 'node_modules', 'react'),
                'react-dom': path.resolve(process.cwd(), 'node_modules', 'react-dom'),
                ...(config.alias || {})
            },
        },
        context: process.cwd(),
        devServer: {
            ...(config.devServer || {})
        },
        entry: path.join(process.cwd(), 'src', 'pages', '.rwp', 'rwp.js'),
        output: {
            filename: 'rwp.js',
            path: path.join(process.cwd(), 'dist')
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
                    path.join(process.cwd(), 'src'),
                    ...(config.extraBabelIncludes || []).map(function(element){
                        return path.resolve(path.join(process.cwd(),element))
                    })
                ],
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                    plugins: [
                        '@babel/proposal-class-properties',
                        '@babel/proposal-object-rest-spread',
                        '@babel/plugin-transform-async-to-generator',
                        styleImport
                    ]
                },
            },
            ]
        },
        plugins,
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
    return webpackConfig
}