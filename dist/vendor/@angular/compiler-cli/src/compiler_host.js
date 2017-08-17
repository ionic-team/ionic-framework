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
var tsc_wrapped_1 = require("@angular/tsc-wrapped");
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var EXT = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
var DTS = /\.d\.ts$/;
var NODE_MODULES = '/node_modules/';
var IS_GENERATED = /\.(ngfactory|ngstyle)$/;
var GENERATED_FILES = /\.ngfactory\.ts$|\.ngstyle\.ts$/;
var GENERATED_OR_DTS_FILES = /\.d\.ts$|\.ngfactory\.ts$|\.ngstyle\.ts$/;
var SHALLOW_IMPORT = /^((\w|-)+|(@(\w|-)+(\/(\w|-)+)+))$/;
var CompilerHost = (function () {
    function CompilerHost(program, options, context, collectorOptions) {
        var _this = this;
        this.program = program;
        this.options = options;
        this.context = context;
        this.metadataCollector = new tsc_wrapped_1.MetadataCollector();
        this.resolverCache = new Map();
        this.bundleIndexCache = new Map();
        this.bundleIndexNames = new Set();
        this.moduleFileNames = new Map();
        // normalize the path so that it never ends with '/'.
        this.basePath = path.normalize(path.join(this.options.basePath, '.')).replace(/\\/g, '/');
        this.genDir = path.normalize(path.join(this.options.genDir, '.')).replace(/\\/g, '/');
        var genPath = path.relative(this.basePath, this.genDir);
        this.isGenDirChildOfRootDir = genPath === '' || !genPath.startsWith('..');
        this.resolveModuleNameHost = Object.create(this.context);
        // When calling ts.resolveModuleName,
        // additional allow checks for .d.ts files to be done based on
        // checks for .ngsummary.json files,
        // so that our codegen depends on fewer inputs and requires to be called
        // less often.
        // This is needed as we use ts.resolveModuleName in reflector_host
        // and it should be able to resolve summary file names.
        this.resolveModuleNameHost.fileExists = function (fileName) {
            if (_this.context.fileExists(fileName)) {
                return true;
            }
            if (DTS.test(fileName)) {
                var base = fileName.substring(0, fileName.length - 5);
                return _this.context.fileExists(base + '.ngsummary.json');
            }
            return false;
        };
    }
    // We use absolute paths on disk as canonical.
    CompilerHost.prototype.getCanonicalFileName = function (fileName) { return fileName; };
    CompilerHost.prototype.moduleNameToFileName = function (m, containingFile) {
        var key = m + ':' + (containingFile || '');
        var result = this.moduleFileNames.get(key) || null;
        if (!result) {
            if (!containingFile || !containingFile.length) {
                if (m.indexOf('.') === 0) {
                    throw new Error('Resolution of relative paths requires a containing file.');
                }
                // Any containing file gives the same result for absolute imports
                containingFile = this.getCanonicalFileName(path.join(this.basePath, 'index.ts'));
            }
            m = m.replace(EXT, '');
            var resolved = ts.resolveModuleName(m, containingFile.replace(/\\/g, '/'), this.options, this.resolveModuleNameHost)
                .resolvedModule;
            result = resolved ? this.getCanonicalFileName(resolved.resolvedFileName) : null;
            this.moduleFileNames.set(key, result);
        }
        return result;
    };
    ;
    /**
     * We want a moduleId that will appear in import statements in the generated code.
     * These need to be in a form that system.js can load, so absolute file paths don't work.
     *
     * The `containingFile` is always in the `genDir`, where as the `importedFile` can be in
     * `genDir`, `node_module` or `basePath`.  The `importedFile` is either a generated file or
     * existing file.
     *
     *               | genDir   | node_module |  rootDir
     * --------------+----------+-------------+----------
     * generated     | relative |   relative  |   n/a
     * existing file |   n/a    |   absolute  |  relative(*)
     *
     * NOTE: (*) the relative path is computed depending on `isGenDirChildOfRootDir`.
     */
    CompilerHost.prototype.fileNameToModuleName = function (importedFile, containingFile) {
        // If a file does not yet exist (because we compile it later), we still need to
        // assume it exists it so that the `resolve` method works!
        if (!this.context.fileExists(importedFile)) {
            this.context.assumeFileExists(importedFile);
        }
        containingFile = this.rewriteGenDirPath(containingFile);
        var containingDir = path.dirname(containingFile);
        // drop extension
        importedFile = importedFile.replace(EXT, '');
        var nodeModulesIndex = importedFile.indexOf(NODE_MODULES);
        var importModule = nodeModulesIndex === -1 ?
            null :
            importedFile.substring(nodeModulesIndex + NODE_MODULES.length);
        var isGeneratedFile = IS_GENERATED.test(importedFile);
        if (isGeneratedFile) {
            // rewrite to genDir path
            if (importModule) {
                // it is generated, therefore we do a relative path to the factory
                return this.dotRelative(containingDir, this.genDir + NODE_MODULES + importModule);
            }
            else {
                // assume that import is also in `genDir`
                importedFile = this.rewriteGenDirPath(importedFile);
                return this.dotRelative(containingDir, importedFile);
            }
        }
        else {
            // user code import
            if (importModule) {
                return importModule;
            }
            else {
                if (!this.isGenDirChildOfRootDir) {
                    // assume that they are on top of each other.
                    importedFile = importedFile.replace(this.basePath, this.genDir);
                }
                if (SHALLOW_IMPORT.test(importedFile)) {
                    return importedFile;
                }
                return this.dotRelative(containingDir, importedFile);
            }
        }
    };
    CompilerHost.prototype.dotRelative = function (from, to) {
        var rPath = path.relative(from, to).replace(/\\/g, '/');
        return rPath.startsWith('.') ? rPath : './' + rPath;
    };
    /**
     * Moves the path into `genDir` folder while preserving the `node_modules` directory.
     */
    CompilerHost.prototype.rewriteGenDirPath = function (filepath) {
        var nodeModulesIndex = filepath.indexOf(NODE_MODULES);
        if (nodeModulesIndex !== -1) {
            // If we are in node_modulse, transplant them into `genDir`.
            return path.join(this.genDir, filepath.substring(nodeModulesIndex));
        }
        else {
            // pretend that containing file is on top of the `genDir` to normalize the paths.
            // we apply the `genDir` => `rootDir` delta through `rootDirPrefix` later.
            return filepath.replace(this.basePath, this.genDir);
        }
    };
    CompilerHost.prototype.getSourceFile = function (filePath) {
        var sf = this.program.getSourceFile(filePath);
        if (!sf) {
            if (this.context.fileExists(filePath)) {
                var sourceText = this.context.readFile(filePath);
                return ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
            }
            throw new Error("Source file " + filePath + " not present in program.");
        }
        return sf;
    };
    CompilerHost.prototype.getMetadataFor = function (filePath) {
        if (!this.context.fileExists(filePath)) {
            // If the file doesn't exists then we cannot return metadata for the file.
            // This will occur if the user refernced a declared module for which no file
            // exists for the module (i.e. jQuery or angularjs).
            return;
        }
        if (DTS.test(filePath)) {
            var metadataPath = filePath.replace(DTS, '.metadata.json');
            if (this.context.fileExists(metadataPath)) {
                return this.readMetadata(metadataPath, filePath);
            }
            else {
                // If there is a .d.ts file but no metadata file we need to produce a
                // v3 metadata from the .d.ts file as v3 includes the exports we need
                // to resolve symbols.
                return [this.upgradeVersion1Metadata({ '__symbolic': 'module', 'version': 1, 'metadata': {} }, filePath)];
            }
        }
        else {
            var sf = this.getSourceFile(filePath);
            var metadata = this.metadataCollector.getMetadata(sf);
            return metadata ? [metadata] : [];
        }
    };
    CompilerHost.prototype.readMetadata = function (filePath, dtsFilePath) {
        var metadatas = this.resolverCache.get(filePath);
        if (metadatas) {
            return metadatas;
        }
        try {
            var metadataOrMetadatas = JSON.parse(this.context.readFile(filePath));
            var metadatas_1 = metadataOrMetadatas ?
                (Array.isArray(metadataOrMetadatas) ? metadataOrMetadatas : [metadataOrMetadatas]) :
                [];
            var v1Metadata = metadatas_1.find(function (m) { return m.version === 1; });
            var v3Metadata = metadatas_1.find(function (m) { return m.version === 3; });
            if (!v3Metadata && v1Metadata) {
                metadatas_1.push(this.upgradeVersion1Metadata(v1Metadata, dtsFilePath));
            }
            this.resolverCache.set(filePath, metadatas_1);
            return metadatas_1;
        }
        catch (e) {
            console.error("Failed to read JSON file " + filePath);
            throw e;
        }
    };
    CompilerHost.prototype.upgradeVersion1Metadata = function (v1Metadata, dtsFilePath) {
        // patch up v1 to v3 by merging the metadata with metadata collected from the d.ts file
        // as the only difference between the versions is whether all exports are contained in
        // the metadata and the `extends` clause.
        var v3Metadata = { '__symbolic': 'module', 'version': 3, 'metadata': {} };
        if (v1Metadata.exports) {
            v3Metadata.exports = v1Metadata.exports;
        }
        for (var prop in v1Metadata.metadata) {
            v3Metadata.metadata[prop] = v1Metadata.metadata[prop];
        }
        var exports = this.metadataCollector.getMetadata(this.getSourceFile(dtsFilePath));
        if (exports) {
            for (var prop in exports.metadata) {
                if (!v3Metadata.metadata[prop]) {
                    v3Metadata.metadata[prop] = exports.metadata[prop];
                }
            }
            if (exports.exports) {
                v3Metadata.exports = exports.exports;
            }
        }
        return v3Metadata;
    };
    CompilerHost.prototype.loadResource = function (filePath) { return this.context.readResource(filePath); };
    CompilerHost.prototype.loadSummary = function (filePath) {
        if (this.context.fileExists(filePath)) {
            return this.context.readFile(filePath);
        }
        return null;
    };
    CompilerHost.prototype.getOutputFileName = function (sourceFilePath) {
        return sourceFilePath.replace(EXT, '') + '.d.ts';
    };
    CompilerHost.prototype.isSourceFile = function (filePath) {
        var excludeRegex = this.options.generateCodeForLibraries === false ? GENERATED_OR_DTS_FILES : GENERATED_FILES;
        if (excludeRegex.test(filePath)) {
            return false;
        }
        if (DTS.test(filePath)) {
            // Check for a bundle index.
            if (this.hasBundleIndex(filePath)) {
                var normalFilePath = path.normalize(filePath);
                return this.bundleIndexNames.has(normalFilePath);
            }
        }
        return true;
    };
    CompilerHost.prototype.calculateEmitPath = function (filePath) {
        // Write codegen in a directory structure matching the sources.
        var root = this.options.basePath;
        for (var _i = 0, _a = this.options.rootDirs || []; _i < _a.length; _i++) {
            var eachRootDir = _a[_i];
            if (this.options.trace) {
                console.error("Check if " + filePath + " is under rootDirs element " + eachRootDir);
            }
            if (path.relative(eachRootDir, filePath).indexOf('.') !== 0) {
                root = eachRootDir;
            }
        }
        // transplant the codegen path to be inside the `genDir`
        var relativePath = path.relative(root, filePath);
        while (relativePath.startsWith('..' + path.sep)) {
            // Strip out any `..` path such as: `../node_modules/@foo` as we want to put everything
            // into `genDir`.
            relativePath = relativePath.substr(3);
        }
        return path.join(this.options.genDir, relativePath);
    };
    CompilerHost.prototype.hasBundleIndex = function (filePath) {
        var _this = this;
        var checkBundleIndex = function (directory) {
            var result = _this.bundleIndexCache.get(directory);
            if (result == null) {
                if (path.basename(directory) == 'node_module') {
                    // Don't look outside the node_modules this package is installed in.
                    result = false;
                }
                else {
                    // A bundle index exists if the typings .d.ts file has a metadata.json that has an
                    // importAs.
                    try {
                        var packageFile = path.join(directory, 'package.json');
                        if (_this.context.fileExists(packageFile)) {
                            // Once we see a package.json file, assume false until it we find the bundle index.
                            result = false;
                            var packageContent = JSON.parse(_this.context.readFile(packageFile));
                            if (packageContent.typings) {
                                var typings = path.normalize(path.join(directory, packageContent.typings));
                                if (DTS.test(typings)) {
                                    var metadataFile = typings.replace(DTS, '.metadata.json');
                                    if (_this.context.fileExists(metadataFile)) {
                                        var metadata = JSON.parse(_this.context.readFile(metadataFile));
                                        if (metadata.importAs) {
                                            _this.bundleIndexNames.add(typings);
                                            result = true;
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            var parent_1 = path.dirname(directory);
                            if (parent_1 != directory) {
                                // Try the parent directory.
                                result = checkBundleIndex(parent_1);
                            }
                            else {
                                result = false;
                            }
                        }
                    }
                    catch (e) {
                        // If we encounter any errors assume we this isn't a bundle index.
                        result = false;
                    }
                }
                _this.bundleIndexCache.set(directory, result);
            }
            return result;
        };
        return checkBundleIndex(path.dirname(filePath));
    };
    return CompilerHost;
}());
exports.CompilerHost = CompilerHost;
var CompilerHostContextAdapter = (function () {
    function CompilerHostContextAdapter() {
        this.assumedExists = {};
    }
    CompilerHostContextAdapter.prototype.assumeFileExists = function (fileName) { this.assumedExists[fileName] = true; };
    return CompilerHostContextAdapter;
}());
exports.CompilerHostContextAdapter = CompilerHostContextAdapter;
var ModuleResolutionHostAdapter = (function (_super) {
    __extends(ModuleResolutionHostAdapter, _super);
    function ModuleResolutionHostAdapter(host) {
        var _this = _super.call(this) || this;
        _this.host = host;
        if (host.directoryExists) {
            _this.directoryExists = function (directoryName) { return host.directoryExists(directoryName); };
        }
        return _this;
    }
    ModuleResolutionHostAdapter.prototype.fileExists = function (fileName) {
        return this.assumedExists[fileName] || this.host.fileExists(fileName);
    };
    ModuleResolutionHostAdapter.prototype.readFile = function (fileName) { return this.host.readFile(fileName); };
    ModuleResolutionHostAdapter.prototype.readResource = function (s) {
        if (!this.host.fileExists(s)) {
            // TODO: We should really have a test for error cases like this!
            throw new Error("Compilation failed. Resource file not found: " + s);
        }
        return Promise.resolve(this.host.readFile(s));
    };
    return ModuleResolutionHostAdapter;
}(CompilerHostContextAdapter));
exports.ModuleResolutionHostAdapter = ModuleResolutionHostAdapter;
var NodeCompilerHostContext = (function (_super) {
    __extends(NodeCompilerHostContext, _super);
    function NodeCompilerHostContext() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NodeCompilerHostContext.prototype.fileExists = function (fileName) {
        return this.assumedExists[fileName] || fs.existsSync(fileName);
    };
    NodeCompilerHostContext.prototype.directoryExists = function (directoryName) {
        try {
            return fs.statSync(directoryName).isDirectory();
        }
        catch (e) {
            return false;
        }
    };
    NodeCompilerHostContext.prototype.readFile = function (fileName) { return fs.readFileSync(fileName, 'utf8'); };
    NodeCompilerHostContext.prototype.readResource = function (s) {
        if (!this.fileExists(s)) {
            // TODO: We should really have a test for error cases like this!
            throw new Error("Compilation failed. Resource file not found: " + s);
        }
        return Promise.resolve(this.readFile(s));
    };
    return NodeCompilerHostContext;
}(CompilerHostContextAdapter));
exports.NodeCompilerHostContext = NodeCompilerHostContext;
//# sourceMappingURL=compiler_host.js.map