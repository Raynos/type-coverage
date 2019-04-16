"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typescript_1 = tslib_1.__importDefault(require("typescript"));
const path = tslib_1.__importStar(require("path"));
function collectDependencies(sourceFileInfos, allFiles) {
    const dependencies = [];
    for (const { sourceFile, file } of sourceFileInfos) {
        sourceFile.forEachChild(node => {
            let source;
            if (node.kind === typescript_1.default.SyntaxKind.ImportEqualsDeclaration) {
                source = node.name.text;
            }
            else if (node.kind === typescript_1.default.SyntaxKind.ImportDeclaration) {
                source = node.moduleSpecifier.text;
            }
            if (source
                && (source.startsWith('.') || source.startsWith('/'))
                && !source.endsWith('.json')
                && !source.endsWith('.node')) {
                const resolveResult = resolveImport(path.relative(process.cwd(), path.resolve(path.dirname(file), source)), allFiles);
                dependencies.push([file, resolveResult]);
            }
        });
    }
    return dependencies;
}
exports.collectDependencies = collectDependencies;
function resolveImport(moduleName, allFiles) {
    let resolveResult = moduleName + '.ts';
    if (allFiles.has(resolveResult)) {
        return resolveResult;
    }
    resolveResult = moduleName + '.tsx';
    if (allFiles.has(resolveResult)) {
        return resolveResult;
    }
    resolveResult = moduleName + '.d.ts';
    if (allFiles.has(resolveResult)) {
        return resolveResult;
    }
    resolveResult = path.resolve(moduleName, 'index.ts');
    if (allFiles.has(resolveResult)) {
        return resolveResult;
    }
    resolveResult = path.resolve(moduleName, 'index.tsx');
    if (allFiles.has(resolveResult)) {
        return resolveResult;
    }
    resolveResult = path.resolve(moduleName, 'index.d.ts');
    if (allFiles.has(resolveResult)) {
        return resolveResult;
    }
    return moduleName;
}
function clearCacheOfDependencies(sourceFileInfo, dependencies, sourceFileInfos) {
    for (const dependency of dependencies) {
        if (dependency[1] === sourceFileInfo.file) {
            const dependentSourceFileInfo = sourceFileInfos.find((s) => s.file === dependency[0]);
            if (dependentSourceFileInfo && dependentSourceFileInfo.cache) {
                dependentSourceFileInfo.cache = undefined;
                clearCacheOfDependencies(dependentSourceFileInfo, dependencies, sourceFileInfos);
            }
        }
    }
}
exports.clearCacheOfDependencies = clearCacheOfDependencies;
