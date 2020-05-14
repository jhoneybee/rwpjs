const fs = require('fs-extra')
const path = require('path')

function copy(souce, targe){
    return fs.copySync(souce, targe)
}

const dirFile = path.join(process.cwd(),'src','pages','.rwp') 

exports.default = function (){
    copy(path.join(__dirname,'..','template'), dirFile)
}