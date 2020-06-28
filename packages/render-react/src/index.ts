import { join } from 'path'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'

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
        join(process.cwd(), 'node_modules', '@rwp', 'render-react', 'lib','template', 'rwp.tsx'),
        join(process.cwd(),'src','pages','.rwp', 'rwp.tsx')
    )

    if(!existsSync(join('src','pages','document.ejs'))){
        copyFileSync(
            join(process.cwd(), 'node_modules', '@rwp', 'render-react', 'lib','template', 'document.ejs'),
            join(process.cwd(),'src','pages', 'document.ejs')
        )
    }
    tempConfig.entry = join(process.cwd(),'src','pages','.rwp', 'rwp.tsx')
    return tempConfig
}