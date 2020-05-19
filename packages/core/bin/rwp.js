#!/usr/bin/env node

const { program } = require('commander')
const packages = require('../package.json')
const { getDependenciesPlugin, getDependenciesRender } = require('./utils/project')

// 执行启动脚本
const devMain = require('./dev')
/**
 * 
 * 这是rwp (React Webpack) 中支持的cli 
 * 
 * rwp --dev 
 *          - 启动本地开发服务器进行项目的开发调试
 * rwp --build 
 *          - 编译构建web产物
 * rwp --generate
 *          - 内置的生成器,用来做一些代码的创建
 * rwp --plugin 
 *          - 当前使用的插件
 * rwp --help 
 *          - 帮助信息
 * rwp --version
 *          - 当前的版本信息
 */
program
    .option('-d, --dev', 'start local development server for project development and debugging')
    .option('-b, --build', 'compiling and building web products')
    .option('-g, --generate', 'built in generator to create some code')
    .option('-p, --plugin', 'plug in currently in use')
    .version(packages.version)
    .parse(process.argv);

/**
 * 启动本地开发服务器进行项目的开发调试
 */
if (program.dev) {
    devMain.default('dev')
    return;
}

// 编译构建web产物
if (program.build) {
    devMain.default('build')
    return;
}

// 内置的生成器,用来做一些代码的创建
if (program.generate) {
    return;
}

// 当前使用的插件
if (program.plugin) {
    const render = getDependenciesRender()
    const plugins = getDependenciesPlugin()
    console.log('+- render')
    Object.keys(render).forEach(key => {
        console.log(`+- ${key}@${plugin[key]}`)
    });
    console.log('+- plugins')
    Object.keys(plugins).forEach(key => {
        console.log(`+- ${key}@${plugin[key]}`)
    });
    return;
}





