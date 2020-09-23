const { execSync } = require("child_process");
const { join } = require('path')
const { writeFileSync } = require('fs');

const PR_TITLE = process.env.PR_TITLE

console.log(PR_TITLE)
if (/release:\s+.*/.test(PR_TITLE)) {
    const version = PR_TITLE.replace(/release:\s+/i, '').trim()
    reactUIPackages.version = version
    writeFileSync(join(__dirname, '..', 'packages', 'react-ui', 'package.json'), JSON.stringify(reactUIPackages))
    execSync(`cd ./packages/react-ui/ && npm publish`)
    execSync(`git commit -m '${version}'`)
    execSync(`git push`)
}