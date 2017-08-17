/**
 * @license Angular v4.1.3
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/compiler'), require('@angular/core/testing')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/compiler', '@angular/core/testing'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.compiler = global.ng.compiler || {}, global.ng.compiler.testing = global.ng.compiler.testing || {}),global.ng.core,global.ng.compiler,global.ng.core.testing));
}(this, (function (exports,_angular_core,_angular_compiler,_angular_core_testing) { 'use strict';

var __extends = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * @license Angular v4.1.3
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var MockSchemaRegistry = (function () {
    function MockSchemaRegistry(existingProperties, attrPropMapping, existingElements, invalidProperties, invalidAttributes) {
        this.existingProperties = existingProperties;
        this.attrPropMapping = attrPropMapping;
        this.existingElements = existingElements;
        this.invalidProperties = invalidProperties;
        this.invalidAttributes = invalidAttributes;
    }
    MockSchemaRegistry.prototype.hasProperty = function (tagName, property, schemas) {
        var value = this.existingProperties[property];
        return value === void 0 ? true : value;
    };
    MockSchemaRegistry.prototype.hasElement = function (tagName, schemaMetas) {
        var value = this.existingElements[tagName.toLowerCase()];
        return value === void 0 ? true : value;
    };
    MockSchemaRegistry.prototype.allKnownElementNames = function () { return Object.keys(this.existingElements); };
    MockSchemaRegistry.prototype.securityContext = function (selector, property, isAttribute) {
        return _angular_core.SecurityContext.NONE;
    };
    MockSchemaRegistry.prototype.getMappedPropName = function (attrName) { return this.attrPropMapping[attrName] || attrName; };
    MockSchemaRegistry.prototype.getDefaultComponentElementName = function () { return 'ng-component'; };
    MockSchemaRegistry.prototype.validateProperty = function (name) {
        if (this.invalidProperties.indexOf(name) > -1) {
            return { error: true, msg: "Binding to property '" + name + "' is disallowed for security reasons" };
        }
        else {
            return { error: false };
        }
    };
    MockSchemaRegistry.prototype.validateAttribute = function (name) {
        if (this.invalidAttributes.indexOf(name) > -1) {
            return {
                error: true,
                msg: "Binding to attribute '" + name + "' is disallowed for security reasons"
            };
        }
        else {
            return { error: false };
        }
    };
    MockSchemaRegistry.prototype.normalizeAnimationStyleProperty = function (propName) { return propName; };
    MockSchemaRegistry.prototype.normalizeAnimationStyleValue = function (camelCaseProp, userProvidedProp, val) {
        return { error: null, value: val.toString() };
    };
    return MockSchemaRegistry;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * An implementation of {@link DirectiveResolver} that allows overriding
 * various properties of directives.
 */
var MockDirectiveResolver = (function (_super) {
    __extends(MockDirectiveResolver, _super);
    function MockDirectiveResolver(_injector) {
        var _this = _super.call(this) || this;
        _this._injector = _injector;
        _this._directives = new Map();
        _this._providerOverrides = new Map();
        _this._viewProviderOverrides = new Map();
        _this._views = new Map();
        _this._inlineTemplates = new Map();
        return _this;
    }
    Object.defineProperty(MockDirectiveResolver.prototype, "_compiler", {
        get: function () { return this._injector.get(_angular_core.Compiler); },
        enumerable: true,
        configurable: true
    });
    MockDirectiveResolver.prototype._clearCacheFor = function (component) { this._compiler.clearCacheFor(component); };
    MockDirectiveResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var metadata = this._directives.get(type) || null;
        if (!metadata) {
            metadata = _super.prototype.resolve.call(this, type, throwIfNotFound);
        }
        if (!metadata) {
            return null;
        }
        var providerOverrides = this._providerOverrides.get(type);
        var viewProviderOverrides = this._viewProviderOverrides.get(type);
        var providers = metadata.providers;
        if (providerOverrides != null) {
            var originalViewProviders = metadata.providers || [];
            providers = originalViewProviders.concat(providerOverrides);
        }
        if (metadata instanceof _angular_core.Component) {
            var viewProviders = metadata.viewProviders;
            if (viewProviderOverrides != null) {
                var originalViewProviders = metadata.viewProviders || [];
                viewProviders = originalViewProviders.concat(viewProviderOverrides);
            }
            var view = this._views.get(type) || metadata;
            var animations = view.animations;
            var templateUrl = view.templateUrl;
            var inlineTemplate = this._inlineTemplates.get(type);
            if (inlineTemplate) {
                templateUrl = undefined;
            }
            else {
                inlineTemplate = view.template;
            }
            return new _angular_core.Component({
                selector: metadata.selector,
                inputs: metadata.inputs,
                outputs: metadata.outputs,
                host: metadata.host,
                exportAs: metadata.exportAs,
                moduleId: metadata.moduleId,
                queries: metadata.queries,
                changeDetection: metadata.changeDetection,
                providers: providers,
                viewProviders: viewProviders,
                entryComponents: metadata.entryComponents,
                template: inlineTemplate,
                templateUrl: templateUrl,
                animations: animations,
                styles: view.styles,
                styleUrls: view.styleUrls,
                encapsulation: view.encapsulation,
                interpolation: view.interpolation
            });
        }
        return new _angular_core.Directive({
            selector: metadata.selector,
            inputs: metadata.inputs,
            outputs: metadata.outputs,
            host: metadata.host,
            providers: providers,
            exportAs: metadata.exportAs,
            queries: metadata.queries
        });
    };
    /**
     * Overrides the {@link Directive} for a directive.
     */
    MockDirectiveResolver.prototype.setDirective = function (type, metadata) {
        this._directives.set(type, metadata);
        this._clearCacheFor(type);
    };
    MockDirectiveResolver.prototype.setProvidersOverride = function (type, providers) {
        this._providerOverrides.set(type, providers);
        this._clearCacheFor(type);
    };
    MockDirectiveResolver.prototype.setViewProvidersOverride = function (type, viewProviders) {
        this._viewProviderOverrides.set(type, viewProviders);
        this._clearCacheFor(type);
    };
    /**
     * Overrides the {@link ViewMetadata} for a component.
     */
    MockDirectiveResolver.prototype.setView = function (component, view) {
        this._views.set(component, view);
        this._clearCacheFor(component);
    };
    /**
     * Overrides the inline template for a component - other configuration remains unchanged.
     */
    MockDirectiveResolver.prototype.setInlineTemplate = function (component, template) {
        this._inlineTemplates.set(component, template);
        this._clearCacheFor(component);
    };
    return MockDirectiveResolver;
}(_angular_compiler.DirectiveResolver));
MockDirectiveResolver.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
MockDirectiveResolver.ctorParameters = function () { return [
    { type: _angular_core.Injector, },
]; };
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var MockNgModuleResolver = (function (_super) {
    __extends(MockNgModuleResolver, _super);
    function MockNgModuleResolver(_injector) {
        var _this = _super.call(this) || this;
        _this._injector = _injector;
        _this._ngModules = new Map();
        return _this;
    }
    /**
     * Overrides the {@link NgModule} for a module.
     */
    MockNgModuleResolver.prototype.setNgModule = function (type, metadata) {
        this._ngModules.set(type, metadata);
        this._clearCacheFor(type);
    };
    /**
     * Returns the {@link NgModule} for a module:
     * - Set the {@link NgModule} to the overridden view when it exists or fallback to the
     * default
     * `NgModuleResolver`, see `setNgModule`.
     */
    MockNgModuleResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        return this._ngModules.get(type) || _super.prototype.resolve.call(this, type, throwIfNotFound);
    };
    Object.defineProperty(MockNgModuleResolver.prototype, "_compiler", {
        get: function () { return this._injector.get(_angular_core.Compiler); },
        enumerable: true,
        configurable: true
    });
    MockNgModuleResolver.prototype._clearCacheFor = function (component) { this._compiler.clearCacheFor(component); };
    return MockNgModuleResolver;
}(_angular_compiler.NgModuleResolver));
MockNgModuleResolver.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
MockNgModuleResolver.ctorParameters = function () { return [
    { type: _angular_core.Injector, },
]; };
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var MockPipeResolver = (function (_super) {
    __extends(MockPipeResolver, _super);
    function MockPipeResolver(_injector) {
        var _this = _super.call(this) || this;
        _this._injector = _injector;
        _this._pipes = new Map();
        return _this;
    }
    Object.defineProperty(MockPipeResolver.prototype, "_compiler", {
        get: function () { return this._injector.get(_angular_core.Compiler); },
        enumerable: true,
        configurable: true
    });
    MockPipeResolver.prototype._clearCacheFor = function (pipe) { this._compiler.clearCacheFor(pipe); };
    /**
     * Overrides the {@link Pipe} for a pipe.
     */
    MockPipeResolver.prototype.setPipe = function (type, metadata) {
        this._pipes.set(type, metadata);
        this._clearCacheFor(type);
    };
    /**
     * Returns the {@link Pipe} for a pipe:
     * - Set the {@link Pipe} to the overridden view when it exists or fallback to the
     * default
     * `PipeResolver`, see `setPipe`.
     */
    MockPipeResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var metadata = this._pipes.get(type);
        if (!metadata) {
            metadata = _super.prototype.resolve.call(this, type, throwIfNotFound);
        }
        return metadata;
    };
    return MockPipeResolver;
}(_angular_compiler.PipeResolver));
MockPipeResolver.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
MockPipeResolver.ctorParameters = function () { return [
    { type: _angular_core.Injector, },
]; };
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var _nextReferenceId = 0;
var MetadataOverrider = (function () {
    function MetadataOverrider() {
        this._references = new Map();
    }
    /**
     * Creates a new instance for the given metadata class
     * based on an old instance and overrides.
     */
    MetadataOverrider.prototype.overrideMetadata = function (metadataClass, oldMetadata, override) {
        var props = {};
        if (oldMetadata) {
            _valueProps(oldMetadata).forEach(function (prop) { return props[prop] = oldMetadata[prop]; });
        }
        if (override.set) {
            if (override.remove || override.add) {
                throw new Error("Cannot set and add/remove " + _angular_core.ɵstringify(metadataClass) + " at the same time!");
            }
            setMetadata(props, override.set);
        }
        if (override.remove) {
            removeMetadata(props, override.remove, this._references);
        }
        if (override.add) {
            addMetadata(props, override.add);
        }
        return new metadataClass(props);
    };
    return MetadataOverrider;
}());
function removeMetadata(metadata, remove, references) {
    var removeObjects = new Set();
    var _loop_1 = function (prop) {
        var removeValue = remove[prop];
        if (removeValue instanceof Array) {
            removeValue.forEach(function (value) { removeObjects.add(_propHashKey(prop, value, references)); });
        }
        else {
            removeObjects.add(_propHashKey(prop, removeValue, references));
        }
    };
    for (var prop in remove) {
        _loop_1(prop);
    }
    var _loop_2 = function (prop) {
        var propValue = metadata[prop];
        if (propValue instanceof Array) {
            metadata[prop] = propValue.filter(function (value) { return !removeObjects.has(_propHashKey(prop, value, references)); });
        }
        else {
            if (removeObjects.has(_propHashKey(prop, propValue, references))) {
                metadata[prop] = undefined;
            }
        }
    };
    for (var prop in metadata) {
        _loop_2(prop);
    }
}
function addMetadata(metadata, add) {
    for (var prop in add) {
        var addValue = add[prop];
        var propValue = metadata[prop];
        if (propValue != null && propValue instanceof Array) {
            metadata[prop] = propValue.concat(addValue);
        }
        else {
            metadata[prop] = addValue;
        }
    }
}
function setMetadata(metadata, set) {
    for (var prop in set) {
        metadata[prop] = set[prop];
    }
}
function _propHashKey(propName, propValue, references) {
    var replacer = function (key, value) {
        if (typeof value === 'function') {
            value = _serializeReference(value, references);
        }
        return value;
    };
    return propName + ":" + JSON.stringify(propValue, replacer);
}
function _serializeReference(ref, references) {
    var id = references.get(ref);
    if (!id) {
        id = "" + _angular_core.ɵstringify(ref) + _nextReferenceId++;
        references.set(ref, id);
    }
    return id;
}
function _valueProps(obj) {
    var props = [];
    // regular public props
    Object.keys(obj).forEach(function (prop) {
        if (!prop.startsWith('_')) {
            props.push(prop);
        }
    });
    // getters
    var proto = obj;
    while (proto = Object.getPrototypeOf(proto)) {
        Object.keys(proto).forEach(function (protoProp) {
            var desc = Object.getOwnPropertyDescriptor(proto, protoProp);
            if (!protoProp.startsWith('_') && desc && 'get' in desc) {
                props.push(protoProp);
            }
        });
    }
    return props;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point for all APIs of the compiler package.
 *
 * <div class="callout is-critical">
 *   <header>Unstable APIs</header>
 *   <p>
 *     All compiler apis are currently considered experimental and private!
 *   </p>
 *   <p>
 *     We expect the APIs in this package to keep on changing. Do not rely on them.
 *   </p>
 * </div>
 */
var TestingCompilerFactoryImpl = (function () {
    function TestingCompilerFactoryImpl(_compilerFactory) {
        this._compilerFactory = _compilerFactory;
    }
    TestingCompilerFactoryImpl.prototype.createTestingCompiler = function (options) {
        var compiler = this._compilerFactory.createCompiler(options);
        return new TestingCompilerImpl(compiler, compiler.injector.get(MockDirectiveResolver), compiler.injector.get(MockPipeResolver), compiler.injector.get(MockNgModuleResolver));
    };
    return TestingCompilerFactoryImpl;
}());
TestingCompilerFactoryImpl.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
TestingCompilerFactoryImpl.ctorParameters = function () { return [
    { type: _angular_core.CompilerFactory, },
]; };
var TestingCompilerImpl = (function () {
    function TestingCompilerImpl(_compiler, _directiveResolver, _pipeResolver, _moduleResolver) {
        this._compiler = _compiler;
        this._directiveResolver = _directiveResolver;
        this._pipeResolver = _pipeResolver;
        this._moduleResolver = _moduleResolver;
        this._overrider = new MetadataOverrider();
    }
    Object.defineProperty(TestingCompilerImpl.prototype, "injector", {
        get: function () { return this._compiler.injector; },
        enumerable: true,
        configurable: true
    });
    TestingCompilerImpl.prototype.compileModuleSync = function (moduleType) {
        return this._compiler.compileModuleSync(moduleType);
    };
    TestingCompilerImpl.prototype.compileModuleAsync = function (moduleType) {
        return this._compiler.compileModuleAsync(moduleType);
    };
    TestingCompilerImpl.prototype.compileModuleAndAllComponentsSync = function (moduleType) {
        return this._compiler.compileModuleAndAllComponentsSync(moduleType);
    };
    TestingCompilerImpl.prototype.compileModuleAndAllComponentsAsync = function (moduleType) {
        return this._compiler.compileModuleAndAllComponentsAsync(moduleType);
    };
    TestingCompilerImpl.prototype.getNgContentSelectors = function (component) {
        return this._compiler.getNgContentSelectors(component);
    };
    TestingCompilerImpl.prototype.overrideModule = function (ngModule, override) {
        var oldMetadata = this._moduleResolver.resolve(ngModule, false);
        this._moduleResolver.setNgModule(ngModule, this._overrider.overrideMetadata(_angular_core.NgModule, oldMetadata, override));
    };
    TestingCompilerImpl.prototype.overrideDirective = function (directive, override) {
        var oldMetadata = this._directiveResolver.resolve(directive, false);
        this._directiveResolver.setDirective(directive, this._overrider.overrideMetadata(_angular_core.Directive, oldMetadata, override));
    };
    TestingCompilerImpl.prototype.overrideComponent = function (component, override) {
        var oldMetadata = this._directiveResolver.resolve(component, false);
        this._directiveResolver.setDirective(component, this._overrider.overrideMetadata(_angular_core.Component, oldMetadata, override));
    };
    TestingCompilerImpl.prototype.overridePipe = function (pipe, override) {
        var oldMetadata = this._pipeResolver.resolve(pipe, false);
        this._pipeResolver.setPipe(pipe, this._overrider.overrideMetadata(_angular_core.Pipe, oldMetadata, override));
    };
    TestingCompilerImpl.prototype.clearCache = function () { this._compiler.clearCache(); };
    TestingCompilerImpl.prototype.clearCacheFor = function (type) { this._compiler.clearCacheFor(type); };
    return TestingCompilerImpl;
}());
/**
 * Platform for dynamic tests
 *
 * @experimental
 */
var platformCoreDynamicTesting = _angular_core.createPlatformFactory(_angular_compiler.platformCoreDynamic, 'coreDynamicTesting', [
    {
        provide: _angular_core.COMPILER_OPTIONS,
        useValue: {
            providers: [
                MockPipeResolver,
                { provide: _angular_compiler.PipeResolver, useExisting: MockPipeResolver },
                MockDirectiveResolver,
                { provide: _angular_compiler.DirectiveResolver, useExisting: MockDirectiveResolver },
                MockNgModuleResolver,
                { provide: _angular_compiler.NgModuleResolver, useExisting: MockNgModuleResolver },
            ]
        },
        multi: true
    },
    { provide: _angular_core_testing.ɵTestingCompilerFactory, useClass: TestingCompilerFactoryImpl }
]);

exports.TestingCompilerFactoryImpl = TestingCompilerFactoryImpl;
exports.TestingCompilerImpl = TestingCompilerImpl;
exports.platformCoreDynamicTesting = platformCoreDynamicTesting;
exports.MockSchemaRegistry = MockSchemaRegistry;
exports.MockDirectiveResolver = MockDirectiveResolver;
exports.MockNgModuleResolver = MockNgModuleResolver;
exports.MockPipeResolver = MockPipeResolver;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=compiler-testing.umd.js.map
