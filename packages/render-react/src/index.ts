import * as HtmlWebpackPlugin from 'html-webpack-plugin'

// 初始化webpack相关的信息
export default ({ config }) => {
    const { plugins } = config
    plugins.push(
        new HtmlWebpackPlugin({
            hash: true,
            template: `${process.cwd()}/node_modules/@rwp/core/lib/template/document.ejs`
        }),
    )
    return config
}