exports.default = () => ({
    title: '测试标题',
    extraStylePluginImport: [{
        "libraryName": "antd",
        "style": true,
    }],
    extraBabelIncludes: [
        "node_modules/kotomi-ui"
    ]
})