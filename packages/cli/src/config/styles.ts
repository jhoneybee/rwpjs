import * as Config from 'webpack-chain'

export const presetCss = (config: Config) => {
    config
    .module
    .rule('css')
    .test(/\.css$/)
    .use('style-loader')
    .loader('style-loader')
    .end()
    .use('css/loader')
    .loader('css-loader')
    .end()
    
}

export const presetLess = (config: Config) => {
    config
        .module
        .rule('less')
        .test(/\.less$/)
        .use('style-loader')
        .loader('style-loader')
        .end()
        .use('css/loader')
        .loader('css-loader')
        .end()
        .use('less/loader')
        .loader('less-loader')
        .options({
            lessOptions: {
                javascriptEnabled: true
            }
        })
        .end()
}
