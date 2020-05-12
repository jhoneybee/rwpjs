
exports.default = function (){
    // 预设webpack属性
    const webpackConfig = {
        mode: 'development',
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },
        module: {
            rules: [
                {
                    loader: "babel-loader",
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                        plugins: ['@babel/proposal-class-properties', '@babel/proposal-object-rest-spread']
                    },
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin()
        ]
    }
    const compiler = Webpack(webpackConfig)
    const server = new WebpackDevServer(compiler, {
        hot: true
    });
    server.listen(8000)
}

