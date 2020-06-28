/**
 * 当前系统的配置信息
 */
export interface RWPConfiguration  {
    alias: any
    target: any
    title: string
    devServer: any
    extraStylePluginImport: any[]
    extraBabelIncludes: string[]
    extraWebpack: any
}