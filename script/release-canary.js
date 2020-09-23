const { execSync, exec } = require("child_process");
const { join } = require('path')
const { writeFileSync } = require('fs');

const PR_TITLE = process.env.PR_TITLE

const reactUIPackages = require('../packages/react-ui/package.json')

console.log(PR_TITLE)
if (/release:\s+.*/.test(PR_TITLE)) {
    const version = PR_TITLE.replace(/release:\s+/i, '').trim()
    reactUIPackages.version = version
    // 如果脚本存在于历史版本中,则不进行发布
    exec('npm view @rwp/react-ui versions', (error, stdout) => {
        if (error) {
            throw error 
        }
        const versions = JSON.parse(stdout.replace(/'/g, '"'))
        if (!versions.includes(reactUIPackages.version)) {
            writeFileSync(join(__dirname, '..', 'packages', 'react-ui', 'package.json'), JSON.stringify(reactUIPackages))
            execSync(`cd ./packages/react-ui/ && npm publish`)
            execSync(`git commit -m '${version}'`)
            execSync(`git push`)
            execSync('cd packages/react-ui && npm install && npm publish --access public --tag canary')
        }
    })
}