type ImportStyle = {
    libraryName: string 
    style: boolean | string
    libraryDirectory?: string
}

export interface Config {
    // 默认为web在浏览器中使用. see https://webpack.js.org/configuration/target/
    target: 'web' | 'webworker' | 'async-node' | 'node' | 'electron-main' | 'electron-renderer' | 'node-webkit' | string;
    // 物料中心
    materiel?: string
    // 扩展的按需加载 see https://github.com/ant-design/babel-plugin-import
    extraStylePluginImport: ImportStyle[]

    // 开发服务器配置 see https://webpack.js.org/configuration/dev-server/
    devServer: any 
}