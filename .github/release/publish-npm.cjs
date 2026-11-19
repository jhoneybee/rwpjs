const { execFileSync } = require('node:child_process');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const semver = require('semver');

const root = resolve(__dirname, '../..');
const registry = 'https://registry.npmjs.org';
const args = process.argv.slice(2);
const dryRun = args.length === 1 && args[0] === '--dry-run';

function git(args, capture = false) {
    return execFileSync('git', args, {
        cwd: root,
        encoding: 'utf8',
        stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
    });
}

function npm(directory, args) {
    execFileSync(process.execPath, [process.env.npm_execpath, ...args], {
        cwd: directory,
        stdio: 'inherit',
    });
}

async function isPublished(name, version) {
    const url = `${registry}/${encodeURIComponent(name)}/${encodeURIComponent(version)}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (response.status === 404) return false;
    if (response.ok && (await response.json()).version === version) return true;
    throw new Error(`Could not verify ${name}@${version} on npm (HTTP ${response.status}).`);
}

async function main() {
    if (args.length && !dryRun) throw new Error('Only --dry-run is supported.');
    const base = process.env.RELEASE_BASE_SHA;
    if (!/^[a-f0-9]{40}$/.test(base ?? '')) {
        throw new Error('RELEASE_BASE_SHA must be the commit SHA before the push.');
    }
    if (/^0+$/.test(base)) return;

    for (const workspace of ['packages/cli', 'packages/react-ui']) {
        const manifestPath = `${workspace}/package.json`;
        const { name, version } = JSON.parse(readFileSync(resolve(root, manifestPath), 'utf8'));
        const previous = JSON.parse(git(['show', `${base}:${manifestPath}`], true));
        if (previous.version === version) continue;
        if (!semver.gt(version, previous.version)) {
            throw new Error(`Refusing to publish ${name} at ${version} after ${previous.version}.`);
        }

        const gitTag = `${name}@${version}`;
        if (dryRun || !(await isPublished(name, version))) {
            const directory = resolve(root, workspace);
            if (workspace === 'packages/cli') {
                execFileSync('corepack', [
                    'yarn@1.22.22', 'install', '--ignore-scripts', '--non-interactive', '--registry', registry,
                ], { cwd: directory, stdio: 'inherit', shell: process.platform === 'win32' });
                // The legacy Webpack dependencies disagree in their declaration files.
                npm(directory, ['run', 'build', '--', '--skipLibCheck']);
            } else {
                npm(directory, ['ci', '--ignore-scripts', '--legacy-peer-deps', '--registry', registry]);
            }

            const prerelease = semver.prerelease(version);
            const channel = prerelease?.[0] ?? 'latest';
            const tag = typeof channel === 'string' && !semver.validRange(channel)
                && !(prerelease && channel === 'latest') ? channel : 'canary';
            npm(directory, [
                'publish', '--access', 'public', '--tag', tag, '--registry', registry,
                ...(dryRun ? ['--dry-run'] : []),
            ]);
        }

        if (!dryRun && !git(['tag', '--list', gitTag], true).trim()) {
            git(['tag', gitTag]);
            console.log(`New tag: ${gitTag}`);
        }
    }
}

main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
});
