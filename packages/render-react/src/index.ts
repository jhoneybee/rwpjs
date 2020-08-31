import { join } from 'path'
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync, utimesSync } from 'fs'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'

import { webpackTimefix } from './models/utils'
import { getRouteCode } from './models/router'

const copyFileTo = (source: string , targe: string) => {
    const txt = readFileSync(join(__dirname, 'template' , source)).toString()
    writeFileSync(join(process.cwd(), 'src', 'pages', '.rwp', targe), txt)
    utimesSync(
        join(process.cwd(), 'src', 'pages', '.rwp', targe),
        (Date.now() - 10 * 1000) / 1000, (Date.now() - 10 * 1000) / 1000);
}

const writeFile = (path: string, txt: string) => {
    writeFileSync(path, txt)
    utimesSync(
        path,
        (Date.now() - 10 * 1000) / 1000, (Date.now() - 10 * 1000) / 1000);
}

const writeRouteFile = () => {
    const code = getRouteCode()
    writeFile(join(process.cwd(), 'src', 'pages', '.rwp', 'routes.ts'), code)
}

/* eslint-disable no-shadow */
const compiler = (compiler) => {
    webpackTimefix(compiler)
    
    compiler.hooks.afterCompile.tapAsync("@rwp/render-react", (compilation, callback) => {
        compilation.contextDependencies.add(join(process.cwd(), 'src'));
        callback();
    });
    
    compiler.hooks.beforeCompile.tapAsync('@rwp/render-react', (_compilation, callback) => {
        copyFileTo(join('pages','rwp.tsx'), 'rwp.tsx')
        writeRouteFile()
        callback()
    })
    return compiler
}

// 初始化webpack相关的信息
export default ({ config }) => {
    const tempConfig = config
        
    tempConfig.plugins.push(
        new HtmlWebpackPlugin({
            hash: true,
            template: join(process.cwd(),'src','pages', 'document.ejs')
        }),
    )
    
    const rwpPage = join('src','pages','.rwp')
    
    if (!existsSync(rwpPage)) {
        mkdirSync(rwpPage)
    }

    copyFileSync(
        join(process.cwd(), 'node_modules', '@rwp', 'render-react', 'lib','template', 'pages', 'rwp.tsx'),
        join(process.cwd(),'src','pages','.rwp', 'rwp.tsx')
    )
    
    writeRouteFile()
    if(!existsSync(join('src','pages','document.ejs'))){
        if (!existsSync(join('src','pages'))) mkdirSync(join('src','pages'))
        copyFileSync(
            join(
                process.cwd(),
                'node_modules',
                '@rwp',
                'render-react',
                'lib',
                'template',
                'pages',
                'document.ejs'
            ),
            join(process.cwd(),'src','pages', 'document.ejs')
        )
    }
    if (!existsSync(join('src','layouts','index.tsx'))) {

        if (!existsSync(join('src','layouts'))) mkdirSync(join('src','layouts'))

        copyFileSync(
            join(
                process.cwd(),
                'node_modules',
                '@rwp',
                'render-react',
                'lib',
                'template',
                'layouts',
                'index.tsx'
            ),
            join(process.cwd(),'src','layouts', 'index.tsx')
        )
    }
    tempConfig.entry = join(process.cwd(),'src','pages','.rwp', 'rwp.tsx')
    // 设置对react-router-dom 的 BrowserRouter 的支持
    tempConfig.devServer.historyApiFallback = true
    return {
        config: tempConfig,
        compiler,
    }
}