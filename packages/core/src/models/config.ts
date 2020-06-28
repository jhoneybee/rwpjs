import { join } from 'path'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { Configuration } from 'webpack'
import * as TerserPlugin from 'terser-webpack-plugin';
import * as WebpackBar from 'webpackbar';

import { defaultConfig } from './utils'
import { Config } from '../interface'
import { getProjectDir } from './utils'


const getTemplateConfig = (): Configuration => {
    return {
        resolve: {
            extensions: ['.ts', '.tsx'],
        },
        entry: join(process.cwd(), 'src', 'pages', '.rwp', 'rwp.tsx'),
        context: getProjectDir(),
        output: {
            filename: 'rwp.bundle.js',
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
            },{
                loader: "babel-loader",
                test: /\.(ts)x?$/,
                include: [
                    join(getProjectDir(), 'src'),
                ],
                options: {
                    sourceType: 'unambiguous',
                    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                    plugins: [
                        '@babel/plugin-transform-runtime',
                        '@babel/plugin-proposal-class-properties',
                        '@babel/plugin-proposal-object-rest-spread',
                    ]
                },
            },
            ]
        },
        plugins: [new WebpackBar()]
    }
}

const getBuildConfig = (config: Config) => {
    const template: Configuration = getTemplateConfig()
    template.mode = 'production'

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

    const babelLoader = template.module!.rules!.find(ele => ele.loader === 'babel-loader')
    // @ts-ignore
    const plugins = babelLoader!.options!.plugins

    // see https://github.com/ant-design/babel-plugin-import
    if (config.extraStylePluginImport && config.extraStylePluginImport.length > 0) {
        plugins.push(['import', ...config.extraStylePluginImport])
    }

    return template
}

const getAnalyzerConfig = (config: Config) => {
    const template = getDevConfig(config)
    template.plugins!.push(new BundleAnalyzerPlugin())
    return template
}

const getDevConfig = (config: Config) => {
    const template: Configuration = getTemplateConfig()
    template.mode = 'development'
    template.plugins = [new WebpackBar()]
    const babelLoader = template.module!.rules!.find(ele => ele.loader === 'babel-loader')
    // @ts-ignore
    const plugins = babelLoader!.options!.plugins

    // see https://github.com/ant-design/babel-plugin-import
    if (config.extraStylePluginImport && config.extraStylePluginImport.length > 0) {
        plugins.push(['import', ...config.extraStylePluginImport])
    }
    return template
}


/**
 * 获取当前的config信息
 */
export default ({
    config,
    state
}: {
    config: Config,
    state: 'build' | 'dev' | 'watch' | 'analyzer'
}): Configuration => {
    const tempConfig: Config = defaultConfig(config)
    if (state === 'build') return getBuildConfig(tempConfig)
    if (state === 'dev') return getDevConfig(tempConfig)
    if (state === 'watch') return getDevConfig(tempConfig)
    if (state === 'analyzer') return getAnalyzerConfig(tempConfig)
    throw new Error(`No corresponding state found. [${state}]`);
}
