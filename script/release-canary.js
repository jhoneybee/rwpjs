const { execSync, exec } = require("child_process");
const { join } = require('path')
const { writeFileSync } = require('fs');


const reactUIPackages = require('../packages/react-ui/package.json')

exec('git log -p -1',(error, stdout) => {
    const commitText = stdout
    if (/release:\s+.*/.test(commitText)) {
        const release = /release:\s+.*/.exec(commitText)[0]
        const version = release.replace(/release:\s+/i, '').trim()
        reactUIPackages.version = version
        // 如果脚本存在于历史版本中,则不进行发布
        exec('npm view @rwp/react-ui versions', (error, stdout) => {
            if (error) {
                throw error 
            }
            const versions = JSON.parse(stdout.replace(/'/g, '"'))
            if (!versions.includes(reactUIPackages.version)) {
                writeFileSync(join(__dirname, '..', 'packages', 'react-ui', 'package.json'), JSON.stringify(reactUIPackages))
                execSync(`git commit -am '${version}'`)
            }
        })
    }

})
