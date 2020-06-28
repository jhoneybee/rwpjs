#!/usr/bin/env node

import * as Webpack from 'webpack'
import { join } from 'path'
import * as WebpackDevServer from 'webpack-dev-server'
import * as yargs from 'yargs'
import { getDependenciesRender } from './models/utils'
import getConfig from './models/config'

/**
 * 
 * 这是rwp (React Webpack) 中支持的cli 
 * 
 * rwp --dev 
 *          - 启动本地开发服务器进行项目的开发调试
 * rwp --build 
 *          - 编译构建web产物
 * rwp --analyzer
 *           - 分析当前项目的依赖信息
 * rwp --plugin 
 *          - 当前使用的插件
 * rwp --help 
 *          - 帮助信息
 * rwp --version
 *          - 当前的版本信息
 */
const argv = yargs.options({
    dev: { type: 'boolean', default: false },
    build: { type: 'boolean', default: false },
    plugin: { type: 'boolean', default: false },
    analyzer: { type: 'boolean', default: false },
    watch: { type: 'boolean', default: false },
}).argv

const configPath = join(process.cwd(), '.rwp.js')

const loadRender = (config: any, state: string) => {
    const name = Object.keys(getDependenciesRender())[0]
    const render = require(`${process.cwd()}/node_modules/${name}`)
    if(typeof(render.default) !== 'function') {
        throw new Error(`renderer format error, it should be a function. [${name}]`)
    }
    return render.default({ config , state})
}

if (argv.dev) {
    import(configPath).then((config) => {
        const compiler = Webpack(loadRender(getConfig({
            config,
            state: 'dev'
        }), 'dev'))
        const server = new WebpackDevServer(compiler, config.devServer);
        server.listen(Number.parseInt(config.devServer.port))
    })
}

if (argv.build) {
    import(configPath).then((config) => {
        const compiler = Webpack(loadRender(getConfig({
            config,
            state: 'build'
        }), 'dev'))
        compiler.run((err, stat) => { })
    })
}

if (argv.analyzer) {
    import(configPath).then((config) => {
        const compiler = Webpack(loadRender(getConfig({
            config,
            state: 'analyzer'
        }), 'dev'))
        const server = new WebpackDevServer(compiler, config.devServer);
        server.listen(Number.parseInt(config.devServer.port))
    })
}

if (argv.watch) {
    import(configPath).then((config) => {
        const compiler = Webpack(loadRender(getConfig({
            config,
            state: 'watch'
        }), 'watch'))
        compiler.watch({
            aggregateTimeout: 300,
            poll: undefined
        }, (err, stats) => {
        });
    })
}

// 当前使用的插件
if (argv.plugin) {
    const render = getDependenciesRender()
    console.log('+- render')
    Object.keys(render).forEach(key => {
        console.log(`+- ${key}@${render[key]}`)
    });
}

