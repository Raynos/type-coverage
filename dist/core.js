"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const path = tslib_1.__importStar(require("path"));
const tsconfig_1 = require("./tsconfig");
const checker_1 = require("./checker");
const dependencies_1 = require("./dependencies");
const ignore_1 = require("./ignore");
const cache_1 = require("./cache");
// tslint:disable-next-line:no-big-function cognitive-complexity
async function lint(project, detail, debug, files, oldProgram, strict = false, enableCache = false, ignoreCatch = false) {
    const { configFilePath, dirname } = tsconfig_1.getTsConfigFilePath(project);
    const config = tsconfig_1.getTsConfig(configFilePath, dirname);
    const { options: compilerOptions, errors } = typescript_1.default.convertCompilerOptionsFromJson(config.compilerOptions, dirname);
    if (errors && errors.length > 0) {
        throw errors;
    }
    const rootNames = await tsconfig_1.getRootNames(config, dirname);
    const program = typescript_1.default.createProgram(rootNames, compilerOptions, undefined, oldProgram);
    const checker = program.getTypeChecker();
    const allFiles = new Set();
    const sourceFileInfos = [];
    const typeCheckResult = await cache_1.readCache(enableCache);
    for (const sourceFile of program.getSourceFiles()) {
        let file = sourceFile.fileName;
        if (!file.includes('node_modules') && (!files || files.includes(file))) {
            file = path.relative(process.cwd(), file);
            allFiles.add(file);
            const hash = await cache_1.getFileHash(file, enableCache);
            const cache = typeCheckResult.cache[file];
            sourceFileInfos.push({
                file,
                sourceFile,
                hash,
                cache: cache && cache.hash === hash ? cache : undefined
            });
        }
    }
    if (enableCache) {
        const dependencies = dependencies_1.collectDependencies(sourceFileInfos, allFiles);
        for (const sourceFileInfo of sourceFileInfos) {
            if (!sourceFileInfo.cache) {
                dependencies_1.clearCacheOfDependencies(sourceFileInfo, dependencies, sourceFileInfos);
            }
        }
    }
    let correctCount = 0;
    let totalCount = 0;
    let anys = [];
    for (const { sourceFile, file, hash, cache } of sourceFileInfos) {
        if (cache) {
            correctCount += cache.correctCount;
            totalCount += cache.totalCount;
            anys.push(...cache.anys.map((a) => ({ file, ...a })));
            continue;
        }
        const ingoreMap = ignore_1.collectIgnoreMap(sourceFile, file);
        const context = {
            file,
            sourceFile,
            typeCheckResult: {
                correctCount: 0,
                totalCount: 0,
                anys: []
            },
            ignoreCatch,
            catchVariables: {},
            debug,
            detail,
            strict,
            checker,
            ingoreMap
        };
        sourceFile.forEachChild(node => {
            checker_1.checkNode(node, context);
        });
        correctCount += context.typeCheckResult.correctCount;
        totalCount += context.typeCheckResult.totalCount;
        anys.push(...context.typeCheckResult.anys.map((a) => ({ file, ...a })));
        if (enableCache) {
            const resultCache = typeCheckResult.cache[file];
            if (resultCache) {
                resultCache.hash = hash;
                resultCache.correctCount = context.typeCheckResult.correctCount;
                resultCache.totalCount = context.typeCheckResult.totalCount;
                resultCache.anys = context.typeCheckResult.anys;
            }
            else {
                typeCheckResult.cache[file] = {
                    hash,
                    ...context.typeCheckResult
                };
            }
        }
    }
    if (enableCache) {
        await cache_1.saveCache(typeCheckResult);
    }
    return { correctCount, totalCount, anys, program };
}
exports.lint = lint;
