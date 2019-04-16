"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const glob_1 = tslib_1.__importDefault(require("glob"));
function getTsConfigFilePath(project) {
    let configFilePath;
    let dirname;
    const projectStats = fs.statSync(project);
    if (projectStats.isDirectory()) {
        configFilePath = path.resolve(project, 'tsconfig.json');
        dirname = project;
    }
    else if (projectStats.isFile()) {
        configFilePath = project;
        dirname = path.dirname(project);
    }
    else {
        throw new Error("paramter '-p' should be a file or directory.");
    }
    return { configFilePath, dirname };
}
exports.getTsConfigFilePath = getTsConfigFilePath;
function getTsConfig(configFilePath, dirname) {
    const configResult = typescript_1.default.readConfigFile(configFilePath, p => fs.readFileSync(p).toString());
    const config = configResult.error ? {
        compilerOptions: {
            lib: [
                'dom',
                'es5',
                'es2015',
                'es2016',
                'es2017'
            ],
            allowSyntheticDefaultImports: true
        }
    } : configResult.config;
    if (config.extends) {
        const project = path.resolve(dirname, config.extends);
        const { configFilePath, dirname: extendsBasename } = getTsConfigFilePath(project);
        const extendsConfig = getTsConfig(configFilePath, extendsBasename);
        config.compilerOptions = { ...extendsConfig.compilerOptions, ...config.compilerOptions };
    }
    return config;
}
exports.getTsConfig = getTsConfig;
// tslint:disable-next-line:cognitive-complexity
async function getRootNames(config, dirname) {
    const include = config.include;
    const exclude = config.exclude || ['node_modules/**'];
    if (config.files) {
        return config.files.map(f => path.resolve(dirname, f));
    }
    if (include && Array.isArray(include) && include.length > 0) {
        const rules = [];
        for (const file of include) {
            const currentPath = path.resolve(dirname, file);
            const stats = await statAsync(currentPath);
            if (stats === undefined) {
                rules.push(currentPath);
            }
            else if (stats.isDirectory()) {
                rules.push(`${currentPath.endsWith('/') ? currentPath.substring(0, currentPath.length - 1) : currentPath}/**/*.{ts,tsx}`);
            }
            else if (stats.isFile()) {
                rules.push(currentPath);
            }
        }
        return globAsync(rules.length === 1 ? rules[0] : `{${rules.join(',')}}`, exclude, dirname);
    }
    const rootNames = await globAsync(`**/*.{ts,tsx}`, exclude, dirname);
    return rootNames.map((r) => path.resolve(process.cwd(), dirname, r));
}
exports.getRootNames = getRootNames;
function statAsync(file) {
    return new Promise((resolve, reject) => {
        fs.stat(file, (error, stats) => {
            if (error) {
                resolve(undefined);
            }
            else {
                resolve(stats);
            }
        });
    });
}
function globAsync(pattern, ignore, cwd) {
    return new Promise((resolve, reject) => {
        glob_1.default(pattern, { ignore, cwd }, (error, matches) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(matches);
            }
        });
    });
}
