/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var path = require("path");
var ts = require("typescript");
var compiler_host_1 = require("./compiler_host");
var EXT = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
var DTS = /\.d\.ts$/;
/**
 * This version of the AotCompilerHost expects that the program will be compiled
 * and executed with a "path mapped" directory structure, where generated files
 * are in a parallel tree with the sources, and imported using a `./` relative
 * import. This requires using TS `rootDirs` option and also teaching the module
 * loader what to do.
 */
var PathMappedCompilerHost = (function (_super) {
    __extends(PathMappedCompilerHost, _super);
    function PathMappedCompilerHost(program, options, context) {
        return _super.call(this, program, options, context) || this;
    }
    PathMappedCompilerHost.prototype.getCanonicalFileName = function (fileName) {
        if (!fileName)
            return fileName;
        // NB: the rootDirs should have been sorted longest-first
        for (var _i = 0, _a = this.options.rootDirs || []; _i < _a.length; _i++) {
            var dir = _a[_i];
            if (fileName.indexOf(dir) === 0) {
                fileName = fileName.substring(dir.length);
            }
        }
        return fileName;
    };
    PathMappedCompilerHost.prototype.moduleNameToFileName = function (m, containingFile) {
        if (!containingFile || !containingFile.length) {
            if (m.indexOf('.') === 0) {
                throw new Error('Resolution of relative paths requires a containing file.');
            }
            // Any containing file gives the same result for absolute imports
            containingFile = this.getCanonicalFileName(path.join(this.basePath, 'index.ts'));
        }
        for (var _i = 0, _a = this.options.rootDirs || ['']; _i < _a.length; _i++) {
            var root = _a[_i];
            var rootedContainingFile = path.join(root, containingFile);
            var resolved = ts.resolveModuleName(m, rootedContainingFile, this.options, this.context).resolvedModule;
            if (resolved) {
                if (this.options.traceResolution) {
                    console.error('resolve', m, containingFile, '=>', resolved.resolvedFileName);
                }
                return this.getCanonicalFileName(resolved.resolvedFileName);
            }
        }
        return null;
    };
    /**
     * We want a moduleId that will appear in import statements in the generated code.
     * These need to be in a form that system.js can load, so absolute file paths don't work.
     * Relativize the paths by checking candidate prefixes of the absolute path, to see if
     * they are resolvable by the moduleResolution strategy from the CompilerHost.
     */
    PathMappedCompilerHost.prototype.fileNameToModuleName = function (importedFile, containingFile) {
        var _this = this;
        if (this.options.traceResolution) {
            console.error('getImportPath from containingFile', containingFile, 'to importedFile', importedFile);
        }
        // If a file does not yet exist (because we compile it later), we still need to
        // assume it exists so that the `resolve` method works!
        if (!this.context.fileExists(importedFile)) {
            if (this.options.rootDirs && this.options.rootDirs.length > 0) {
                this.context.assumeFileExists(path.join(this.options.rootDirs[0], importedFile));
            }
            else {
                this.context.assumeFileExists(importedFile);
            }
        }
        var resolvable = function (candidate) {
            var resolved = _this.moduleNameToFileName(candidate, importedFile);
            return resolved && resolved.replace(EXT, '') === importedFile.replace(EXT, '');
        };
        var importModuleName = importedFile.replace(EXT, '');
        var parts = importModuleName.split(path.sep).filter(function (p) { return !!p; });
        var foundRelativeImport = undefined;
        for (var index = parts.length - 1; index >= 0; index--) {
            var candidate_1 = parts.slice(index, parts.length).join(path.sep);
            if (resolvable(candidate_1)) {
                return candidate_1;
            }
            candidate_1 = '.' + path.sep + candidate_1;
            if (resolvable(candidate_1)) {
                foundRelativeImport = candidate_1;
            }
        }
        if (foundRelativeImport)
            return foundRelativeImport;
        // Try a relative import
        var candidate = path.relative(path.dirname(containingFile), importModuleName);
        if (resolvable(candidate)) {
            return candidate;
        }
        throw new Error("Unable to find any resolvable import for " + importedFile + " relative to " + containingFile);
    };
    PathMappedCompilerHost.prototype.getMetadataFor = function (filePath) {
        for (var _i = 0, _a = this.options.rootDirs || []; _i < _a.length; _i++) {
            var root = _a[_i];
            var rootedPath = path.join(root, filePath);
            if (!this.context.fileExists(rootedPath)) {
                // If the file doesn't exists then we cannot return metadata for the file.
                // This will occur if the user refernced a declared module for which no file
                // exists for the module (i.e. jQuery or angularjs).
                continue;
            }
            if (DTS.test(rootedPath)) {
                var metadataPath = rootedPath.replace(DTS, '.metadata.json');
                if (this.context.fileExists(metadataPath)) {
                    return this.readMetadata(metadataPath, rootedPath);
                }
            }
            else {
                var sf = this.getSourceFile(rootedPath);
                sf.fileName = sf.fileName;
                var metadata = this.metadataCollector.getMetadata(sf);
                return metadata ? [metadata] : [];
            }
        }
        return null;
    };
    return PathMappedCompilerHost;
}(compiler_host_1.CompilerHost));
exports.PathMappedCompilerHost = PathMappedCompilerHost;
//# sourceMappingURL=path_mapped_compiler_host.js.map