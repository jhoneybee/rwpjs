import * as Config from 'webpack-chain'

export const presetBabelReact = (config: Config) => {
    config
        .module
        .rule('babel-react')
        .test(/\.ts(x?)$/)
        .use('babel-react/loader')
        .loader('babel-loader')
        .options({
            presets: [
                ['@babel/preset-env',{
                    targets: 'defaults and not ie 11 and last 2 versions'
                }],
                '@babel/preset-react',
                '@babel/preset-typescript',
            ]
        }).end()
}