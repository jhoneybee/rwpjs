const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const zlib = require('zlib');

const packageRoot = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
const options = process.argv.slice(2);
const option = name => {
    const index = options.indexOf(name);
    if (index === -1) return undefined;
    if (!options[index + 1] || options[index + 1].startsWith('--')) throw new Error(`${name} requires a path`);
    return path.resolve(options[index + 1]);
};
const sha256 = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value;

function readFiles(directory, prefix = '') {
    return Object.fromEntries(fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const name = prefix + entry.name;
        const fullPath = path.join(directory, entry.name);
        return entry.isDirectory() ? Object.entries(readFiles(fullPath, name + '/')) : [[name, fs.readFileSync(fullPath)]];
    }));
}

function get(url, limit) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, response => {
            if (response.statusCode !== 200) {
                response.resume();
                reject(new Error(`HTTP ${response.statusCode}: ${url}`));
                return;
            }
            const chunks = [];
            let bytes = 0;
            response.on('data', chunk => {
                bytes += chunk.length;
                if (bytes > limit) request.destroy(new Error(`Response exceeds ${limit} bytes`));
                else chunks.push(chunk);
            });
            response.on('end', () => resolve(Buffer.concat(chunks)));
            response.on('error', reject);
        });
        request.setTimeout(30000, () => request.destroy(new Error('npm download timed out')));
        request.on('error', reject);
    });
}

// Read regular files in memory; no package code or lifecycle scripts are executed.
function readTar(buffer) {
    const files = {};
    for (let offset = 0; offset + 512 <= buffer.length;) {
        const header = buffer.subarray(offset, offset + 512);
        if (header.every(byte => byte === 0)) break;
        const field = (start, length) => header.subarray(start, start + length).toString('utf8').split('\0')[0];
        const prefix = field(345, 155);
        const name = (prefix ? prefix + '/' : '') + field(0, 100);
        const size = parseInt(field(124, 12).trim(), 8) || 0;
        if (!Number.isSafeInteger(size) || size < 0 || offset + 512 + size > buffer.length) throw new Error('Invalid npm tar archive');
        const type = field(156, 1);
        if (type === '' || type === '0') {
            if (!name.startsWith('package/') || name.split('/').includes('..')) throw new Error(`Unexpected archive path: ${name}`);
            const relative = name.slice('package/'.length);
            if (files[relative]) throw new Error(`Duplicate archive file: ${relative}`);
            files[relative] = buffer.subarray(offset + 512, offset + 512 + size);
        }
        offset += 512 + Math.ceil(size / 512) * 512;
    }
    return files;
}

async function referenceFiles(reference) {
    if (reference) return { source: reference, files: readFiles(reference) };
    const registry = `https://registry.npmjs.org/${encodeURIComponent(manifest.name)}/${manifest.version}`;
    const metadata = JSON.parse((await get(registry, 1024 * 1024)).toString('utf8'));
    if (metadata.name !== manifest.name || metadata.version !== manifest.version) throw new Error('npm returned a different package/version');
    const tarballUrl = new URL(metadata.dist.tarball);
    if (tarballUrl.protocol !== 'https:' || tarballUrl.hostname !== 'registry.npmjs.org') throw new Error('Unexpected npm tarball origin');
    const tarball = await get(tarballUrl, 10 * 1024 * 1024);
    const integrity = 'sha512-' + crypto.createHash('sha512').update(tarball).digest('base64');
    if (integrity !== metadata.dist.integrity) throw new Error('npm tarball integrity mismatch');
    return { source: metadata.dist.tarball, integrity, files: readTar(zlib.gunzipSync(tarball)) };
}

async function main() {
    const reference = await referenceFiles(option('--reference'));
    const expectedManifest = JSON.parse(reference.files['package.json'].toString('utf8'));
    if (expectedManifest.name !== manifest.name || expectedManifest.version !== manifest.version) throw new Error('Reference package/version does not match the local manifest');
    const contractFields = ['name', 'version', 'main', 'module', 'typings', 'files', 'dependencies', 'peerDependencies'];
    const manifestDifferences = contractFields.filter(field => JSON.stringify(stable(manifest[field])) !== JSON.stringify(stable(expectedManifest[field])));
    const expected = Object.fromEntries(Object.entries(reference.files).filter(([name]) => name.startsWith('dist/')));
    const actual = readFiles(path.join(packageRoot, 'dist'), 'dist/');
    const names = [...new Set([...Object.keys(expected), ...Object.keys(actual)])].sort();
    const files = names.map(name => ({
        name,
        status: !expected[name] ? 'extra' : !actual[name] ? 'missing' : expected[name].equals(actual[name]) ? 'identical' : 'different',
        expectedBytes: expected[name]?.length,
        actualBytes: actual[name]?.length,
        expectedSha256: expected[name] && sha256(expected[name]),
        actualSha256: actual[name] && sha256(actual[name]),
    }));
    const differences = files.filter(file => file.status !== 'identical');
    const report = {
        package: `${manifest.name}@${manifest.version}`,
        reference: reference.source,
        integrity: reference.integrity,
        identical: differences.length === 0 && manifestDifferences.length === 0,
        expectedFiles: Object.keys(expected).length,
        actualFiles: Object.keys(actual).length,
        identicalFiles: files.length - differences.length,
        manifestDifferences,
        files,
    };
    const reportPath = option('--report');
    if (reportPath) {
        fs.mkdirSync(path.dirname(reportPath), { recursive: true });
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
    }
    console.log(`${report.package}: ${report.identicalFiles}/${report.expectedFiles} dist files are byte-identical`);
    for (const file of differences) console.log(`${file.status}: ${file.name}`);
    for (const field of manifestDifferences) console.log(`manifest differs: ${field}`);
    if (reportPath) console.log(`Report: ${reportPath}`);
    process.exitCode = report.identical ? 0 : 1;
}

main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
});
