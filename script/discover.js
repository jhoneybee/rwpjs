const { exec } = require("child_process");
const reactUIPackages = require('../packages/react-ui/package.json')

// 如果脚本存在于历史版本中,则不进行发布
exec('npm view @rwp/react-ui versions', (error, stdout) => {
    if (error) {
        throw error 
    }
    const versions = JSON.parse(stdout.replace(/'/g, '"'))
    if (versions.includes(reactUIPackages.version)) {
        throw new Error(`@rwp/react-ui version already exists. [${reactUIPackages.version}]`)
    }
})
