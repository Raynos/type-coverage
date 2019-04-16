"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const fs = tslib_1.__importStar(require("fs"));
const util_1 = require("util");
const crypto = tslib_1.__importStar(require("crypto"));
const readFileAsync = util_1.promisify(fs.readFile);
const writeFileAsync = util_1.promisify(fs.writeFile);
const mkdirAsync = util_1.promisify(fs.mkdir);
async function getFileHash(file, enableCache) {
    return enableCache ? calculateHash((await readFileAsync(file)).toString()) : '';
}
exports.getFileHash = getFileHash;
function calculateHash(str) {
    return crypto.createHash('sha1').update(str).digest('hex');
}
async function saveCache(typeCheckResult) {
    await mkdirIfmissing();
    await writeFileAsync(path.resolve(dirName, 'result.json'), JSON.stringify(typeCheckResult, null, 2));
}
exports.saveCache = saveCache;
const dirName = '.type-coverage';
function statAsync(p) {
    return new Promise((resolve) => {
        fs.stat(p, (err, stats) => {
            if (err) {
                resolve(undefined);
            }
            else {
                resolve(stats);
            }
        });
    });
}
async function mkdirIfmissing() {
    const stats = await statAsync(dirName);
    if (!stats) {
        await mkdirAsync(dirName);
    }
}
async function readCache(enableCache) {
    if (!enableCache) {
        return {
            cache: {}
        };
    }
    const filepath = path.resolve(dirName, 'result.json');
    const stats = await statAsync(filepath);
    if (stats && stats.isFile()) {
        const text = (await readFileAsync(filepath)).toString();
        const typeCheckResult = JSON.parse(text);
        if (typeCheckResult && Array.isArray(typeCheckResult.cache)) {
            typeCheckResult.cache = {};
        }
        return typeCheckResult;
    }
    return {
        cache: {}
    };
}
exports.readCache = readCache;
