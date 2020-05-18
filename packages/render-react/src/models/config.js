const fs = require('fs');
const path = require('path')
const Webpack = require('webpack')
const HtmlWebpackPlugin = require("html-webpack-plugin")

exports.default = function (config) {
    let ejsTemplate = path.join(process.cwd(), 'src', 'pages', 'document.ejs')
    if (!fs.existsSync(ejsTemplate)) {
        ejsTemplate = path.join(process.cwd(), 'src', 'pages', '.rwp', 'document.ejs')
    }
    // 预设webpack属性
    const webpackConfig = {
        mode: 'development',
        devtool: 'cheap-module-source-map',
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },
        context: process.cwd(),
        devServer: {
            ...(config.devServer || {})
        },
        entry: path.join(process.cwd(), 'src', 'pages', '.rwp', 'rwp.js'),
        output: {
            filename: 'rwp.js',
            path: path.join(process.cwd(), 'dist'),
        },
        module: {
            rules: [{
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
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                    plugins: [
                        '@babel/proposal-class-properties',
                        '@babel/proposal-object-rest-spread',
                        ["import", {
                            "libraryName": "antd",
                            "style": true,
                        }]
                    ]
                },
            },
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                hash: true,
                template: ejsTemplate
            }),
            new Webpack.DefinePlugin({
                // 系统的标题信息
                'RWP.title': JSON.stringify(config.title || '')
            })
        ]
    }
    return webpackConfig
}