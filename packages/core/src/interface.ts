type ImportStyle = {
    libraryName: string 
    style: boolean | string
    libraryDirectory?: string
}

export interface Config {
    // 默认为web在浏览器中使用. see https://webpack.js.org/configuration/target/
    target: 'web' | 'webworker' | 'async-node' | 'node' | 'electron-main' | 'electron-renderer' | 'node-webkit' | string;
    // 扩展的按需加载 see https://github.com/ant-design/babel-plugin-import
    extraBabelStylePluginImport: ImportStyle[]
    // 扩展额外的
    extraBabelIncludes: RegExp[]
    // 开发服务器配置 see https://webpack.js.org/configuration/dev-server/
    devServer: {
        // 指定要使用的主机
        host?: string,
        // 使用http2来进行开发
        http2?: boolean,
        // 端口号
        port?: number,
        proxy?:{
            [key: string]: string
        }
    } 
}