
const path = require('path')
const Routers = require('./routers')

const routers = Routers.getDirFiles(path.join(process.cwd(),'src','pages'), function(element){
    const filePath = element.path.replace(path.join(process.cwd(),'src','pages'), '')

    if(/.rwp/.test(filePath)){
        return undefined
    } 

    return  {
        path: '/hello',
        component: `require(${JSON.stringify(element.path)}).default`,
        routes: element.routes || []
    }
})

module.exports = function (source) {
    const code = source.replace(/\/\/\s*@RWP-TEMPLATE\s+ROUTES\s*/g,
    `const RWP = {}; RWP.routes = ${Routers.getRoutersText(routers)}; \r\n` )
    console.log(code)
    return code
}