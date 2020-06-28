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
let state: 'dev' | 'build' | 'analyzer' | 'watch' = 'dev';

if(argv.dev) state = 'dev'
if(argv.build) state = 'build'
if(argv.analyzer) state = 'analyzer'
if(argv.watch) state = 'watch'

import(configPath).then((config) => {
    const wConfig = loadRender(getConfig({
        config,
        state,
    }),state)    
    const compiler = Webpack(wConfig)
    
    if (argv.dev || argv.analyzer) {
        const server = new WebpackDevServer(compiler, {
            host: '0.0.0.0'
        });
        server.listen(8000)
    }
    
    if (argv.build) {
        const compiler = Webpack(wConfig)
        compiler.run((err, stat) => { })
    }
    

    if (argv.watch) {
        compiler.watch({
            aggregateTimeout: 300,
            poll: undefined
        }, (err, stats) => {
        });
    }
    
    // 当前使用的插件
    if (argv.plugin) {
        const render = getDependenciesRender()
        console.log('+- render')
        Object.keys(render).forEach(key => {
            console.log(`+- ${key}@${render[key]}`)
        });
    }
})    

