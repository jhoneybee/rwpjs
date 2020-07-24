import { join } from 'path'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { Configuration } from 'webpack'
import * as TerserPlugin from 'terser-webpack-plugin';
import * as WebpackBar from 'webpackbar';

import { getProjectDir } from './utils'
import { Config } from '../interface'

const getTemplateConfig = (config: Config): Configuration => {
    const { extraBabelIncludes = []} = config
    const babelLoader = {
        loader: "babel-loader",
        options: {
            sourceType: 'unambiguous',
            presets: [
                ['@babel/preset-env',{
                    targets: 'defaults and not ie 11 and last 2 versions'
                }],
                '@babel/preset-react',
                '@babel/preset-typescript',
            ]
        },
    }

    return {
        resolve: {
            extensions: [".wasm", ".ts", ".tsx", ".mjs", ".cjs", ".js", ".json"],
        },
        devServer: config.devServer,
        context: getProjectDir(),
        output: {
            filename: 'rwp.bundle.js',
            publicPath: '/',
            path: join(getProjectDir(), 'dist')
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
            }, {
                test: /\.ts(x?)$/,
                include: [
                    /src/,
                    ...extraBabelIncludes
                ],
                use: [
                    babelLoader
                ]
            },
            ]
        },
        plugins: [new WebpackBar()]
    }
}

const getDevConfig = (config: Config) => {
    const template: Configuration = getTemplateConfig(config)
    template.mode = 'development'
    template.devtool = 'cheap-module-source-map'
    template.plugins = [new WebpackBar()]
    return template
}

const getBuildConfig = (config: Config) => {
    const template: Configuration = getTemplateConfig(config)
    template.mode = 'production'
    template.devtool = false
    // 添加压缩编译
    template.optimization = {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                sourceMap: false,
                extractComments: false,
            })
        ],
    }
    return template
}

const getAnalyzerConfig = (config: Config) => {
    const template = getDevConfig(config)
    template.plugins!.push(new BundleAnalyzerPlugin())
    return template
}


/**
 * 获取当前的config信息
 */
export default ({
    state,
    config
}: {
    config: Config,
    state: 'build' | 'dev' | 'watch' | 'analyzer'
}): Configuration => {
    if (state === 'build') return getBuildConfig(config)
    if (state === 'dev') return getDevConfig(config)
    if (state === 'watch') return getDevConfig(config)
    if (state === 'analyzer') return getAnalyzerConfig(config)
    throw new Error(`No corresponding state found. [${state}]`);
}
