const fs = require('fs-extra')
const path = require('path')

async function copy(souce, targe){
    return await fs.copy(souce, targe)
}

exports.default = function (compiler){

    compiler.hooks.beforeCompile.tapAsync('@rwp/render-react-run',function(compilation, callback){

        copy(path.join(__dirname,'..','template'), path.join(process.cwd(),'src','pages','.rwp') ).then(function(){
            callback()
        })
    })
}