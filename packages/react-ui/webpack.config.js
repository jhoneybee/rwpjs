module.exports = {
    resolve: {
        extensions: [".wasm", ".ts", ".tsx", ".mjs", ".cjs", ".js", ".json"],
    },
    output: {
        filename: 'rwp.bundle.js',
        library: 'RWP',
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
        }, {
            test: /\.ts(x?)$/,
            include: [
                /src/,
            ],
            use: [
                {
                    loader: "babel-loader",
                    options: {
                        sourceType: 'unambiguous',
                        presets: [
                            ['@babel/preset-env', {
                                targets: 'defaults and not ie 11 and last 2 versions'
                            }],
                            '@babel/preset-react',
                            '@babel/preset-typescript',
                        ]
                    },
                }
            ]
        },
        ]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
};