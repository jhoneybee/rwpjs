const { exec, execSync } = require("child_process");
const { join } = require('path')
const { writeFileSync } = require('fs');
const reactUIPackages = require('../packages/react-ui/package.json')

// 如果脚本存在于历史版本中,则不进行发布
exec('npm view @rwp/react-ui versions', (error, stdout) => {
    if (error) {
        throw error 
    }
    const versions = JSON.parse(stdout.replace(/'/g, '"'))
    if (!versions.includes(reactUIPackages.version)) {
        throw new Error(`@rwp/react-ui version already exists. [${reactUIPackages.version}]`)
    }

    const PR_TITLE = process.env.PR_TITLE
    if (/release:\s+.*/.test(PR_TITLE)) {
        const version = PR_TITLE.replace(/release:\s+/i, '').trim()
        reactUIPackages.version = version
        writeFileSync(join(__dirname, '..', 'packages', 'react-ui', 'package.json'), JSON.stringify(reactUIPackages))
        execSync(`git add --all`)
        execSync(`git commit -m '${version}'`)
        execSync(`git push`)
    }

})
