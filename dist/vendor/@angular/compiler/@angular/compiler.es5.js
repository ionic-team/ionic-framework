var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * @license Angular v4.1.3
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */
import { ANALYZE_FOR_ENTRY_COMPONENTS, Attribute, COMPILER_OPTIONS, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, ChangeDetectorRef, Compiler, CompilerFactory, Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, ContentChild, ContentChildren, Directive, ElementRef, Host, HostBinding, HostListener, Inject, Injectable, InjectionToken, Injector, Input, LOCALE_ID, MissingTranslationStrategy, ModuleWithComponentFactories, NO_ERRORS_SCHEMA, NgModule, NgModuleFactory, NgModuleRef, Optional, Output, PACKAGE_ROOT_URL, PLATFORM_INITIALIZER, Pipe, Query, QueryList, ReflectiveInjector, Renderer, SecurityContext, Self, SkipSelf, TRANSLATIONS, TRANSLATIONS_FORMAT, TemplateRef, Type, Version, ViewChild, ViewChildren, ViewContainerRef, ViewEncapsulation, animate, createPlatformFactory, group, isDevMode, keyframes, platformCore, resolveForwardRef, sequence, state, style, transition, trigger, ɵCodegenComponentFactoryResolver, ɵConsole, ɵEMPTY_ARRAY, ɵEMPTY_MAP, ɵERROR_COMPONENT_TYPE, ɵLIFECYCLE_HOOKS_VALUES, ɵLifecycleHooks, ɵNgModuleInjector, ɵReflectionCapabilities, ɵReflector, ɵReflectorReader, ɵand, ɵccf, ɵcrt, ɵdid, ɵeld, ɵelementEventFullName, ɵgetComponentViewDefinitionFactory, ɵinlineInterpolate, ɵinterpolate, ɵncd, ɵnov, ɵpad, ɵpid, ɵpod, ɵppd, ɵprd, ɵqud, ɵreflector, ɵregisterModuleFactory, ɵstringify, ɵted, ɵunv, ɵvid } from '@angular/core';
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
 * Entry point for all public APIs of the common package.
 */
/**
 * \@stable
 */
var VERSION = new Version('4.1.3');
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A segment of text within the template.
 */
var TextAst = (function () {
    /**
     * @param {?} value
     * @param {?} ngContentIndex
     * @param {?} sourceSpan
     */
    function TextAst(value, ngContentIndex, sourceSpan) {
        this.value = value;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    TextAst.prototype.visit = function (visitor, context) { return visitor.visitText(this, context); };
    return TextAst;
}());
/**
 * A bound expression within the text of a template.
 */
var BoundTextAst = (function () {
    /**
     * @param {?} value
     * @param {?} ngContentIndex
     * @param {?} sourceSpan
     */
    function BoundTextAst(value, ngContentIndex, sourceSpan) {
        this.value = value;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    BoundTextAst.prototype.visit = function (visitor, context) {
        return visitor.visitBoundText(this, context);
    };
    return BoundTextAst;
}());
/**
 * A plain attribute on an element.
 */
var AttrAst = (function () {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     */
    function AttrAst(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    AttrAst.prototype.visit = function (visitor, context) { return visitor.visitAttr(this, context); };
    return AttrAst;
}());
/**
 * A binding for an element property (e.g. `[property]="expression"`) or an animation trigger (e.g.
 * `[\@trigger]="stateExp"`)
 */
var BoundElementPropertyAst = (function () {
    /**
     * @param {?} name
     * @param {?} type
     * @param {?} securityContext
     * @param {?} value
     * @param {?} unit
     * @param {?} sourceSpan
     */
    function BoundElementPropertyAst(name, type, securityContext, value, unit, sourceSpan) {
        this.name = name;
        this.type = type;
        this.securityContext = securityContext;
        this.value = value;
        this.unit = unit;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    BoundElementPropertyAst.prototype.visit = function (visitor, context) {
        return visitor.visitElementProperty(this, context);
    };
    Object.defineProperty(BoundElementPropertyAst.prototype, "isAnimation", {
        /**
         * @return {?}
         */
        get: function () { return this.type === PropertyBindingType.Animation; },
        enumerable: true,
        configurable: true
    });
    return BoundElementPropertyAst;
}());
/**
 * A binding for an element event (e.g. `(event)="handler()"`) or an animation trigger event (e.g.
 * `(\@trigger.phase)="callback($event)"`).
 */
var BoundEventAst = (function () {
    /**
     * @param {?} name
     * @param {?} target
     * @param {?} phase
     * @param {?} handler
     * @param {?} sourceSpan
     */
    function BoundEventAst(name, target, phase, handler, sourceSpan) {
        this.name = name;
        this.target = target;
        this.phase = phase;
        this.handler = handler;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} name
     * @param {?} target
     * @param {?} phase
     * @return {?}
     */
    BoundEventAst.calcFullName = function (name, target, phase) {
        if (target) {
            return target + ":" + name;
        }
        else if (phase) {
            return "@" + name + "." + phase;
        }
        else {
            return name;
        }
    };
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    BoundEventAst.prototype.visit = function (visitor, context) {
        return visitor.visitEvent(this, context);
    };
    Object.defineProperty(BoundEventAst.prototype, "fullName", {
        /**
         * @return {?}
         */
        get: function () { return BoundEventAst.calcFullName(this.name, this.target, this.phase); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BoundEventAst.prototype, "isAnimation", {
        /**
         * @return {?}
         */
        get: function () { return !!this.phase; },
        enumerable: true,
        configurable: true
    });
    return BoundEventAst;
}());
/**
 * A reference declaration on an element (e.g. `let someName="expression"`).
 */
var ReferenceAst = (function () {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     */
    function ReferenceAst(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ReferenceAst.prototype.visit = function (visitor, context) {
        return visitor.visitReference(this, context);
    };
    return ReferenceAst;
}());
/**
 * A variable declaration on a <ng-template> (e.g. `var-someName="someLocalName"`).
 */
var VariableAst = (function () {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     */
    function VariableAst(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    VariableAst.prototype.visit = function (visitor, context) {
        return visitor.visitVariable(this, context);
    };
    return VariableAst;
}());
/**
 * An element declaration in a template.
 */
var ElementAst = (function () {
    /**
     * @param {?} name
     * @param {?} attrs
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} references
     * @param {?} directives
     * @param {?} providers
     * @param {?} hasViewContainer
     * @param {?} queryMatches
     * @param {?} children
     * @param {?} ngContentIndex
     * @param {?} sourceSpan
     * @param {?} endSourceSpan
     */
    function ElementAst(name, attrs, inputs, outputs, references, directives, providers, hasViewContainer, queryMatches, children, ngContentIndex, sourceSpan, endSourceSpan) {
        this.name = name;
        this.attrs = attrs;
        this.inputs = inputs;
        this.outputs = outputs;
        this.references = references;
        this.directives = directives;
        this.providers = providers;
        this.hasViewContainer = hasViewContainer;
        this.queryMatches = queryMatches;
        this.children = children;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
        this.endSourceSpan = endSourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ElementAst.prototype.visit = function (visitor, context) {
        return visitor.visitElement(this, context);
    };
    return ElementAst;
}());
/**
 * A `<ng-template>` element included in an Angular template.
 */
var EmbeddedTemplateAst = (function () {
    /**
     * @param {?} attrs
     * @param {?} outputs
     * @param {?} references
     * @param {?} variables
     * @param {?} directives
     * @param {?} providers
     * @param {?} hasViewContainer
     * @param {?} queryMatches
     * @param {?} children
     * @param {?} ngContentIndex
     * @param {?} sourceSpan
     */
    function EmbeddedTemplateAst(attrs, outputs, references, variables, directives, providers, hasViewContainer, queryMatches, children, ngContentIndex, sourceSpan) {
        this.attrs = attrs;
        this.outputs = outputs;
        this.references = references;
        this.variables = variables;
        this.directives = directives;
        this.providers = providers;
        this.hasViewContainer = hasViewContainer;
        this.queryMatches = queryMatches;
        this.children = children;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    EmbeddedTemplateAst.prototype.visit = function (visitor, context) {
        return visitor.visitEmbeddedTemplate(this, context);
    };
    return EmbeddedTemplateAst;
}());
/**
 * A directive property with a bound value (e.g. `*ngIf="condition").
 */
var BoundDirectivePropertyAst = (function () {
    /**
     * @param {?} directiveName
     * @param {?} templateName
     * @param {?} value
     * @param {?} sourceSpan
     */
    function BoundDirectivePropertyAst(directiveName, templateName, value, sourceSpan) {
        this.directiveName = directiveName;
        this.templateName = templateName;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    BoundDirectivePropertyAst.prototype.visit = function (visitor, context) {
        return visitor.visitDirectiveProperty(this, context);
    };
    return BoundDirectivePropertyAst;
}());
/**
 * A directive declared on an element.
 */
var DirectiveAst = (function () {
    /**
     * @param {?} directive
     * @param {?} inputs
     * @param {?} hostProperties
     * @param {?} hostEvents
     * @param {?} contentQueryStartId
     * @param {?} sourceSpan
     */
    function DirectiveAst(directive, inputs, hostProperties, hostEvents, contentQueryStartId, sourceSpan) {
        this.directive = directive;
        this.inputs = inputs;
        this.hostProperties = hostProperties;
        this.hostEvents = hostEvents;
        this.contentQueryStartId = contentQueryStartId;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    DirectiveAst.prototype.visit = function (visitor, context) {
        return visitor.visitDirective(this, context);
    };
    return DirectiveAst;
}());
/**
 * A provider declared on an element
 */
var ProviderAst = (function () {
    /**
     * @param {?} token
     * @param {?} multiProvider
     * @param {?} eager
     * @param {?} providers
     * @param {?} providerType
     * @param {?} lifecycleHooks
     * @param {?} sourceSpan
     */
    function ProviderAst(token, multiProvider, eager, providers, providerType, lifecycleHooks, sourceSpan) {
        this.token = token;
        this.multiProvider = multiProvider;
        this.eager = eager;
        this.providers = providers;
        this.providerType = providerType;
        this.lifecycleHooks = lifecycleHooks;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ProviderAst.prototype.visit = function (visitor, context) {
        // No visit method in the visitor for now...
        return null;
    };
    return ProviderAst;
}());
var ProviderAstType = {};
ProviderAstType.PublicService = 0;
ProviderAstType.PrivateService = 1;
ProviderAstType.Component = 2;
ProviderAstType.Directive = 3;
ProviderAstType.Builtin = 4;
ProviderAstType[ProviderAstType.PublicService] = "PublicService";
ProviderAstType[ProviderAstType.PrivateService] = "PrivateService";
ProviderAstType[ProviderAstType.Component] = "Component";
ProviderAstType[ProviderAstType.Directive] = "Directive";
ProviderAstType[ProviderAstType.Builtin] = "Builtin";
/**
 * Position where content is to be projected (instance of `<ng-content>` in a template).
 */
var NgContentAst = (function () {
    /**
     * @param {?} index
     * @param {?} ngContentIndex
     * @param {?} sourceSpan
     */
    function NgContentAst(index, ngContentIndex, sourceSpan) {
        this.index = index;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    NgContentAst.prototype.visit = function (visitor, context) {
        return visitor.visitNgContent(this, context);
    };
    return NgContentAst;
}());
var PropertyBindingType = {};
PropertyBindingType.Property = 0;
PropertyBindingType.Attribute = 1;
PropertyBindingType.Class = 2;
PropertyBindingType.Style = 3;
PropertyBindingType.Animation = 4;
PropertyBindingType[PropertyBindingType.Property] = "Property";
PropertyBindingType[PropertyBindingType.Attribute] = "Attribute";
PropertyBindingType[PropertyBindingType.Class] = "Class";
PropertyBindingType[PropertyBindingType.Style] = "Style";
PropertyBindingType[PropertyBindingType.Animation] = "Animation";
/**
 * Visit every node in a list of {\@link TemplateAst}s with the given {\@link TemplateAstVisitor}.
 * @param {?} visitor
 * @param {?} asts
 * @param {?=} context
 * @return {?}
 */
function templateVisitAll(visitor, asts, context) {
    if (context === void 0) { context = null; }
    var /** @type {?} */ result = [];
    var /** @type {?} */ visit = visitor.visit ?
        function (ast) { return ((visitor.visit))(ast, context) || ast.visit(visitor, context); } :
        function (ast) { return ast.visit(visitor, context); };
    asts.forEach(function (ast) {
        var /** @type {?} */ astResult = visit(ast);
        if (astResult) {
            result.push(astResult);
        }
    });
    return result;
}
/**
 * A token representing the a reference to a static type.
 *
 * This token is unique for a filePath and name and can be used as a hash table key.
 */
var StaticSymbol = (function () {
    /**
     * @param {?} filePath
     * @param {?} name
     * @param {?} members
     */
    function StaticSymbol(filePath, name, members) {
        this.filePath = filePath;
        this.name = name;
        this.members = members;
    }
    /**
     * @return {?}
     */
    StaticSymbol.prototype.assertNoMembers = function () {
        if (this.members.length) {
            throw new Error("Illegal state: symbol without members expected, but got " + JSON.stringify(this) + ".");
        }
    };
    return StaticSymbol;
}());
/**
 * A cache of static symbol used by the StaticReflector to return the same symbol for the
 * same symbol values.
 */
var StaticSymbolCache = (function () {
    function StaticSymbolCache() {
        this.cache = new Map();
    }
    /**
     * @param {?} declarationFile
     * @param {?} name
     * @param {?=} members
     * @return {?}
     */
    StaticSymbolCache.prototype.get = function (declarationFile, name, members) {
        members = members || [];
        var /** @type {?} */ memberSuffix = members.length ? "." + members.join('.') : '';
        var /** @type {?} */ key = "\"" + declarationFile + "\"." + name + memberSuffix;
        var /** @type {?} */ result = this.cache.get(key);
        if (!result) {
            result = new StaticSymbol(declarationFile, name, members);
            this.cache.set(key, result);
        }
        return result;
    };
    return StaticSymbolCache;
}());
var TagContentType = {};
TagContentType.RAW_TEXT = 0;
TagContentType.ESCAPABLE_RAW_TEXT = 1;
TagContentType.PARSABLE_DATA = 2;
TagContentType[TagContentType.RAW_TEXT] = "RAW_TEXT";
TagContentType[TagContentType.ESCAPABLE_RAW_TEXT] = "ESCAPABLE_RAW_TEXT";
TagContentType[TagContentType.PARSABLE_DATA] = "PARSABLE_DATA";
/**
 * @param {?} elementName
 * @return {?}
 */
function splitNsName(elementName) {
    if (elementName[0] != ':') {
        return [null, elementName];
    }
    var /** @type {?} */ colonIndex = elementName.indexOf(':', 1);
    if (colonIndex == -1) {
        throw new Error("Unsupported format \"" + elementName + "\" expecting \":namespace:name\"");
    }
    return [elementName.slice(1, colonIndex), elementName.slice(colonIndex + 1)];
}
/**
 * @param {?} tagName
 * @return {?}
 */
function isNgContainer(tagName) {
    return splitNsName(tagName)[1] === 'ng-container';
}
/**
 * @param {?} tagName
 * @return {?}
 */
function isNgContent(tagName) {
    return splitNsName(tagName)[1] === 'ng-content';
}
/**
 * @param {?} tagName
 * @return {?}
 */
function isNgTemplate(tagName) {
    return splitNsName(tagName)[1] === 'ng-template';
}
/**
 * @param {?} fullName
 * @return {?}
 */
function getNsPrefix(fullName) {
    return fullName === null ? null : splitNsName(fullName)[0];
}
/**
 * @param {?} prefix
 * @param {?} localName
 * @return {?}
 */
function mergeNsAndName(prefix, localName) {
    return prefix ? ":" + prefix + ":" + localName : localName;
}
// see http://www.w3.org/TR/html51/syntax.html#named-character-references
// see https://html.spec.whatwg.org/multipage/entities.json
// This list is not exhaustive to keep the compiler footprint low.
// The `&#123;` / `&#x1ab;` syntax should be used when the named character reference does not
// exist.
var NAMED_ENTITIES = {
    'Aacute': '\u00C1',
    'aacute': '\u00E1',
    'Acirc': '\u00C2',
    'acirc': '\u00E2',
    'acute': '\u00B4',
    'AElig': '\u00C6',
    'aelig': '\u00E6',
    'Agrave': '\u00C0',
    'agrave': '\u00E0',
    'alefsym': '\u2135',
    'Alpha': '\u0391',
    'alpha': '\u03B1',
    'amp': '&',
    'and': '\u2227',
    'ang': '\u2220',
    'apos': '\u0027',
    'Aring': '\u00C5',
    'aring': '\u00E5',
    'asymp': '\u2248',
    'Atilde': '\u00C3',
    'atilde': '\u00E3',
    'Auml': '\u00C4',
    'auml': '\u00E4',
    'bdquo': '\u201E',
    'Beta': '\u0392',
    'beta': '\u03B2',
    'brvbar': '\u00A6',
    'bull': '\u2022',
    'cap': '\u2229',
    'Ccedil': '\u00C7',
    'ccedil': '\u00E7',
    'cedil': '\u00B8',
    'cent': '\u00A2',
    'Chi': '\u03A7',
    'chi': '\u03C7',
    'circ': '\u02C6',
    'clubs': '\u2663',
    'cong': '\u2245',
    'copy': '\u00A9',
    'crarr': '\u21B5',
    'cup': '\u222A',
    'curren': '\u00A4',
    'dagger': '\u2020',
    'Dagger': '\u2021',
    'darr': '\u2193',
    'dArr': '\u21D3',
    'deg': '\u00B0',
    'Delta': '\u0394',
    'delta': '\u03B4',
    'diams': '\u2666',
    'divide': '\u00F7',
    'Eacute': '\u00C9',
    'eacute': '\u00E9',
    'Ecirc': '\u00CA',
    'ecirc': '\u00EA',
    'Egrave': '\u00C8',
    'egrave': '\u00E8',
    'empty': '\u2205',
    'emsp': '\u2003',
    'ensp': '\u2002',
    'Epsilon': '\u0395',
    'epsilon': '\u03B5',
    'equiv': '\u2261',
    'Eta': '\u0397',
    'eta': '\u03B7',
    'ETH': '\u00D0',
    'eth': '\u00F0',
    'Euml': '\u00CB',
    'euml': '\u00EB',
    'euro': '\u20AC',
    'exist': '\u2203',
    'fnof': '\u0192',
    'forall': '\u2200',
    'frac12': '\u00BD',
    'frac14': '\u00BC',
    'frac34': '\u00BE',
    'frasl': '\u2044',
    'Gamma': '\u0393',
    'gamma': '\u03B3',
    'ge': '\u2265',
    'gt': '>',
    'harr': '\u2194',
    'hArr': '\u21D4',
    'hearts': '\u2665',
    'hellip': '\u2026',
    'Iacute': '\u00CD',
    'iacute': '\u00ED',
    'Icirc': '\u00CE',
    'icirc': '\u00EE',
    'iexcl': '\u00A1',
    'Igrave': '\u00CC',
    'igrave': '\u00EC',
    'image': '\u2111',
    'infin': '\u221E',
    'int': '\u222B',
    'Iota': '\u0399',
    'iota': '\u03B9',
    'iquest': '\u00BF',
    'isin': '\u2208',
    'Iuml': '\u00CF',
    'iuml': '\u00EF',
    'Kappa': '\u039A',
    'kappa': '\u03BA',
    'Lambda': '\u039B',
    'lambda': '\u03BB',
    'lang': '\u27E8',
    'laquo': '\u00AB',
    'larr': '\u2190',
    'lArr': '\u21D0',
    'lceil': '\u2308',
    'ldquo': '\u201C',
    'le': '\u2264',
    'lfloor': '\u230A',
    'lowast': '\u2217',
    'loz': '\u25CA',
    'lrm': '\u200E',
    'lsaquo': '\u2039',
    'lsquo': '\u2018',
    'lt': '<',
    'macr': '\u00AF',
    'mdash': '\u2014',
    'micro': '\u00B5',
    'middot': '\u00B7',
    'minus': '\u2212',
    'Mu': '\u039C',
    'mu': '\u03BC',
    'nabla': '\u2207',
    'nbsp': '\u00A0',
    'ndash': '\u2013',
    'ne': '\u2260',
    'ni': '\u220B',
    'not': '\u00AC',
    'notin': '\u2209',
    'nsub': '\u2284',
    'Ntilde': '\u00D1',
    'ntilde': '\u00F1',
    'Nu': '\u039D',
    'nu': '\u03BD',
    'Oacute': '\u00D3',
    'oacute': '\u00F3',
    'Ocirc': '\u00D4',
    'ocirc': '\u00F4',
    'OElig': '\u0152',
    'oelig': '\u0153',
    'Ograve': '\u00D2',
    'ograve': '\u00F2',
    'oline': '\u203E',
    'Omega': '\u03A9',
    'omega': '\u03C9',
    'Omicron': '\u039F',
    'omicron': '\u03BF',
    'oplus': '\u2295',
    'or': '\u2228',
    'ordf': '\u00AA',
    'ordm': '\u00BA',
    'Oslash': '\u00D8',
    'oslash': '\u00F8',
    'Otilde': '\u00D5',
    'otilde': '\u00F5',
    'otimes': '\u2297',
    'Ouml': '\u00D6',
    'ouml': '\u00F6',
    'para': '\u00B6',
    'permil': '\u2030',
    'perp': '\u22A5',
    'Phi': '\u03A6',
    'phi': '\u03C6',
    'Pi': '\u03A0',
    'pi': '\u03C0',
    'piv': '\u03D6',
    'plusmn': '\u00B1',
    'pound': '\u00A3',
    'prime': '\u2032',
    'Prime': '\u2033',
    'prod': '\u220F',
    'prop': '\u221D',
    'Psi': '\u03A8',
    'psi': '\u03C8',
    'quot': '\u0022',
    'radic': '\u221A',
    'rang': '\u27E9',
    'raquo': '\u00BB',
    'rarr': '\u2192',
    'rArr': '\u21D2',
    'rceil': '\u2309',
    'rdquo': '\u201D',
    'real': '\u211C',
    'reg': '\u00AE',
    'rfloor': '\u230B',
    'Rho': '\u03A1',
    'rho': '\u03C1',
    'rlm': '\u200F',
    'rsaquo': '\u203A',
    'rsquo': '\u2019',
    'sbquo': '\u201A',
    'Scaron': '\u0160',
    'scaron': '\u0161',
    'sdot': '\u22C5',
    'sect': '\u00A7',
    'shy': '\u00AD',
    'Sigma': '\u03A3',
    'sigma': '\u03C3',
    'sigmaf': '\u03C2',
    'sim': '\u223C',
    'spades': '\u2660',
    'sub': '\u2282',
    'sube': '\u2286',
    'sum': '\u2211',
    'sup': '\u2283',
    'sup1': '\u00B9',
    'sup2': '\u00B2',
    'sup3': '\u00B3',
    'supe': '\u2287',
    'szlig': '\u00DF',
    'Tau': '\u03A4',
    'tau': '\u03C4',
    'there4': '\u2234',
    'Theta': '\u0398',
    'theta': '\u03B8',
    'thetasym': '\u03D1',
    'thinsp': '\u2009',
    'THORN': '\u00DE',
    'thorn': '\u00FE',
    'tilde': '\u02DC',
    'times': '\u00D7',
    'trade': '\u2122',
    'Uacute': '\u00DA',
    'uacute': '\u00FA',
    'uarr': '\u2191',
    'uArr': '\u21D1',
    'Ucirc': '\u00DB',
    'ucirc': '\u00FB',
    'Ugrave': '\u00D9',
    'ugrave': '\u00F9',
    'uml': '\u00A8',
    'upsih': '\u03D2',
    'Upsilon': '\u03A5',
    'upsilon': '\u03C5',
    'Uuml': '\u00DC',
    'uuml': '\u00FC',
    'weierp': '\u2118',
    'Xi': '\u039E',
    'xi': '\u03BE',
    'Yacute': '\u00DD',
    'yacute': '\u00FD',
    'yen': '\u00A5',
    'yuml': '\u00FF',
    'Yuml': '\u0178',
    'Zeta': '\u0396',
    'zeta': '\u03B6',
    'zwj': '\u200D',
    'zwnj': '\u200C',
};
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var HtmlTagDefinition = (function () {
    /**
     * @param {?=} __0
     */
    function HtmlTagDefinition(_a) {
        var _b = _a === void 0 ? {} : _a, closedByChildren = _b.closedByChildren, requiredParents = _b.requiredParents, implicitNamespacePrefix = _b.implicitNamespacePrefix, _c = _b.contentType, contentType = _c === void 0 ? TagContentType.PARSABLE_DATA : _c, _d = _b.closedByParent, closedByParent = _d === void 0 ? false : _d, _e = _b.isVoid, isVoid = _e === void 0 ? false : _e, _f = _b.ignoreFirstLf, ignoreFirstLf = _f === void 0 ? false : _f;
        var _this = this;
        this.closedByChildren = {};
        this.closedByParent = false;
        this.canSelfClose = false;
        if (closedByChildren && closedByChildren.length > 0) {
            closedByChildren.forEach(function (tagName) { return _this.closedByChildren[tagName] = true; });
        }
        this.isVoid = isVoid;
        this.closedByParent = closedByParent || isVoid;
        if (requiredParents && requiredParents.length > 0) {
            this.requiredParents = {};
            // The first parent is the list is automatically when none of the listed parents are present
            this.parentToAdd = requiredParents[0];
            requiredParents.forEach(function (tagName) { return _this.requiredParents[tagName] = true; });
        }
        this.implicitNamespacePrefix = implicitNamespacePrefix || null;
        this.contentType = contentType;
        this.ignoreFirstLf = ignoreFirstLf;
    }
    /**
     * @param {?} currentParent
     * @return {?}
     */
    HtmlTagDefinition.prototype.requireExtraParent = function (currentParent) {
        if (!this.requiredParents) {
            return false;
        }
        if (!currentParent) {
            return true;
        }
        var /** @type {?} */ lcParent = currentParent.toLowerCase();
        var /** @type {?} */ isParentTemplate = lcParent === 'template' || currentParent === 'ng-template';
        return !isParentTemplate && this.requiredParents[lcParent] != true;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    HtmlTagDefinition.prototype.isClosedByChild = function (name) {
        return this.isVoid || name.toLowerCase() in this.closedByChildren;
    };
    return HtmlTagDefinition;
}());
// see http://www.w3.org/TR/html51/syntax.html#optional-tags
// This implementation does not fully conform to the HTML5 spec.
var TAG_DEFINITIONS = {
    'base': new HtmlTagDefinition({ isVoid: true }),
    'meta': new HtmlTagDefinition({ isVoid: true }),
    'area': new HtmlTagDefinition({ isVoid: true }),
    'embed': new HtmlTagDefinition({ isVoid: true }),
    'link': new HtmlTagDefinition({ isVoid: true }),
    'img': new HtmlTagDefinition({ isVoid: true }),
    'input': new HtmlTagDefinition({ isVoid: true }),
    'param': new HtmlTagDefinition({ isVoid: true }),
    'hr': new HtmlTagDefinition({ isVoid: true }),
    'br': new HtmlTagDefinition({ isVoid: true }),
    'source': new HtmlTagDefinition({ isVoid: true }),
    'track': new HtmlTagDefinition({ isVoid: true }),
    'wbr': new HtmlTagDefinition({ isVoid: true }),
    'p': new HtmlTagDefinition({
        closedByChildren: [
            'address', 'article', 'aside', 'blockquote', 'div', 'dl', 'fieldset', 'footer', 'form',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr',
            'main', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul'
        ],
        closedByParent: true
    }),
    'thead': new HtmlTagDefinition({ closedByChildren: ['tbody', 'tfoot'] }),
    'tbody': new HtmlTagDefinition({ closedByChildren: ['tbody', 'tfoot'], closedByParent: true }),
    'tfoot': new HtmlTagDefinition({ closedByChildren: ['tbody'], closedByParent: true }),
    'tr': new HtmlTagDefinition({
        closedByChildren: ['tr'],
        requiredParents: ['tbody', 'tfoot', 'thead'],
        closedByParent: true
    }),
    'td': new HtmlTagDefinition({ closedByChildren: ['td', 'th'], closedByParent: true }),
    'th': new HtmlTagDefinition({ closedByChildren: ['td', 'th'], closedByParent: true }),
    'col': new HtmlTagDefinition({ requiredParents: ['colgroup'], isVoid: true }),
    'svg': new HtmlTagDefinition({ implicitNamespacePrefix: 'svg' }),
    'math': new HtmlTagDefinition({ implicitNamespacePrefix: 'math' }),
    'li': new HtmlTagDefinition({ closedByChildren: ['li'], closedByParent: true }),
    'dt': new HtmlTagDefinition({ closedByChildren: ['dt', 'dd'] }),
    'dd': new HtmlTagDefinition({ closedByChildren: ['dt', 'dd'], closedByParent: true }),
    'rb': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
    'rt': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
    'rtc': new HtmlTagDefinition({ closedByChildren: ['rb', 'rtc', 'rp'], closedByParent: true }),
    'rp': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
    'optgroup': new HtmlTagDefinition({ closedByChildren: ['optgroup'], closedByParent: true }),
    'option': new HtmlTagDefinition({ closedByChildren: ['option', 'optgroup'], closedByParent: true }),
    'pre': new HtmlTagDefinition({ ignoreFirstLf: true }),
    'listing': new HtmlTagDefinition({ ignoreFirstLf: true }),
    'style': new HtmlTagDefinition({ contentType: TagContentType.RAW_TEXT }),
    'script': new HtmlTagDefinition({ contentType: TagContentType.RAW_TEXT }),
    'title': new HtmlTagDefinition({ contentType: TagContentType.ESCAPABLE_RAW_TEXT }),
    'textarea': new HtmlTagDefinition({ contentType: TagContentType.ESCAPABLE_RAW_TEXT, ignoreFirstLf: true }),
};
var _DEFAULT_TAG_DEFINITION = new HtmlTagDefinition();
/**
 * @param {?} tagName
 * @return {?}
 */
function getHtmlTagDefinition(tagName) {
    return TAG_DEFINITIONS[tagName.toLowerCase()] || _DEFAULT_TAG_DEFINITION;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var _SELECTOR_REGEXP = new RegExp('(\\:not\\()|' +
    '([-\\w]+)|' +
    '(?:\\.([-\\w]+))|' +
    // "-" should appear first in the regexp below as FF31 parses "[.-\w]" as a range
    '(?:\\[([-.\\w*]+)(?:=([\"\']?)([^\\]\"\']*)\\5)?\\])|' +
    // "[name="value"]",
    // "[name='value']"
    '(\\))|' +
    '(\\s*,\\s*)', // ","
'g');
/**
 * A css selector contains an element name,
 * css classes and attribute/value pairs with the purpose
 * of selecting subsets out of them.
 */
var CssSelector = (function () {
    function CssSelector() {
        this.element = null;
        this.classNames = [];
        this.attrs = [];
        this.notSelectors = [];
    }
    /**
     * @param {?} selector
     * @return {?}
     */
    CssSelector.parse = function (selector) {
        var /** @type {?} */ results = [];
        var /** @type {?} */ _addResult = function (res, cssSel) {
            if (cssSel.notSelectors.length > 0 && !cssSel.element && cssSel.classNames.length == 0 &&
                cssSel.attrs.length == 0) {
                cssSel.element = '*';
            }
            res.push(cssSel);
        };
        var /** @type {?} */ cssSelector = new CssSelector();
        var /** @type {?} */ match;
        var /** @type {?} */ current = cssSelector;
        var /** @type {?} */ inNot = false;
        _SELECTOR_REGEXP.lastIndex = 0;
        while (match = _SELECTOR_REGEXP.exec(selector)) {
            if (match[1]) {
                if (inNot) {
                    throw new Error('Nesting :not is not allowed in a selector');
                }
                inNot = true;
                current = new CssSelector();
                cssSelector.notSelectors.push(current);
            }
            if (match[2]) {
                current.setElement(match[2]);
            }
            if (match[3]) {
                current.addClassName(match[3]);
            }
            if (match[4]) {
                current.addAttribute(match[4], match[6]);
            }
            if (match[7]) {
                inNot = false;
                current = cssSelector;
            }
            if (match[8]) {
                if (inNot) {
                    throw new Error('Multiple selectors in :not are not supported');
                }
                _addResult(results, cssSelector);
                cssSelector = current = new CssSelector();
            }
        }
        _addResult(results, cssSelector);
        return results;
    };
    /**
     * @return {?}
     */
    CssSelector.prototype.isElementSelector = function () {
        return this.hasElementSelector() && this.classNames.length == 0 && this.attrs.length == 0 &&
            this.notSelectors.length === 0;
    };
    /**
     * @return {?}
     */
    CssSelector.prototype.hasElementSelector = function () { return !!this.element; };
    /**
     * @param {?=} element
     * @return {?}
     */
    CssSelector.prototype.setElement = function (element) {
        if (element === void 0) { element = null; }
        this.element = element;
    };
    /**
     * Gets a template string for an element that matches the selector.
     * @return {?}
     */
    CssSelector.prototype.getMatchingElementTemplate = function () {
        var /** @type {?} */ tagName = this.element || 'div';
        var /** @type {?} */ classAttr = this.classNames.length > 0 ? " class=\"" + this.classNames.join(' ') + "\"" : '';
        var /** @type {?} */ attrs = '';
        for (var /** @type {?} */ i = 0; i < this.attrs.length; i += 2) {
            var /** @type {?} */ attrName = this.attrs[i];
            var /** @type {?} */ attrValue = this.attrs[i + 1] !== '' ? "=\"" + this.attrs[i + 1] + "\"" : '';
            attrs += " " + attrName + attrValue;
        }
        return getHtmlTagDefinition(tagName).isVoid ? "<" + tagName + classAttr + attrs + "/>" :
            "<" + tagName + classAttr + attrs + "></" + tagName + ">";
    };
    /**
     * @param {?} name
     * @param {?=} value
     * @return {?}
     */
    CssSelector.prototype.addAttribute = function (name, value) {
        if (value === void 0) { value = ''; }
        this.attrs.push(name, value && value.toLowerCase() || '');
    };
    /**
     * @param {?} name
     * @return {?}
     */
    CssSelector.prototype.addClassName = function (name) { this.classNames.push(name.toLowerCase()); };
    /**
     * @return {?}
     */
    CssSelector.prototype.toString = function () {
        var /** @type {?} */ res = this.element || '';
        if (this.classNames) {
            this.classNames.forEach(function (klass) { return res += "." + klass; });
        }
        if (this.attrs) {
            for (var /** @type {?} */ i = 0; i < this.attrs.length; i += 2) {
                var /** @type {?} */ name = this.attrs[i];
                var /** @type {?} */ value = this.attrs[i + 1];
                res += "[" + name + (value ? '=' + value : '') + "]";
            }
        }
        this.notSelectors.forEach(function (notSelector) { return res += ":not(" + notSelector + ")"; });
        return res;
    };
    return CssSelector;
}());
/**
 * Reads a list of CssSelectors and allows to calculate which ones
 * are contained in a given CssSelector.
 */
var SelectorMatcher = (function () {
    function SelectorMatcher() {
        this._elementMap = new Map();
        this._elementPartialMap = new Map();
        this._classMap = new Map();
        this._classPartialMap = new Map();
        this._attrValueMap = new Map();
        this._attrValuePartialMap = new Map();
        this._listContexts = [];
    }
    /**
     * @param {?} notSelectors
     * @return {?}
     */
    SelectorMatcher.createNotMatcher = function (notSelectors) {
        var /** @type {?} */ notMatcher = new SelectorMatcher();
        notMatcher.addSelectables(notSelectors, null);
        return notMatcher;
    };
    /**
     * @param {?} cssSelectors
     * @param {?=} callbackCtxt
     * @return {?}
     */
    SelectorMatcher.prototype.addSelectables = function (cssSelectors, callbackCtxt) {
        var /** @type {?} */ listContext = ((null));
        if (cssSelectors.length > 1) {
            listContext = new SelectorListContext(cssSelectors);
            this._listContexts.push(listContext);
        }
        for (var /** @type {?} */ i = 0; i < cssSelectors.length; i++) {
            this._addSelectable(cssSelectors[i], callbackCtxt, listContext);
        }
    };
    /**
     * Add an object that can be found later on by calling `match`.
     * @param {?} cssSelector A css selector
     * @param {?} callbackCtxt An opaque object that will be given to the callback of the `match` function
     * @param {?} listContext
     * @return {?}
     */
    SelectorMatcher.prototype._addSelectable = function (cssSelector, callbackCtxt, listContext) {
        var /** @type {?} */ matcher = this;
        var /** @type {?} */ element = cssSelector.element;
        var /** @type {?} */ classNames = cssSelector.classNames;
        var /** @type {?} */ attrs = cssSelector.attrs;
        var /** @type {?} */ selectable = new SelectorContext(cssSelector, callbackCtxt, listContext);
        if (element) {
            var /** @type {?} */ isTerminal = attrs.length === 0 && classNames.length === 0;
            if (isTerminal) {
                this._addTerminal(matcher._elementMap, element, selectable);
            }
            else {
                matcher = this._addPartial(matcher._elementPartialMap, element);
            }
        }
        if (classNames) {
            for (var /** @type {?} */ i = 0; i < classNames.length; i++) {
                var /** @type {?} */ isTerminal = attrs.length === 0 && i === classNames.length - 1;
                var /** @type {?} */ className = classNames[i];
                if (isTerminal) {
                    this._addTerminal(matcher._classMap, className, selectable);
                }
                else {
                    matcher = this._addPartial(matcher._classPartialMap, className);
                }
            }
        }
        if (attrs) {
            for (var /** @type {?} */ i = 0; i < attrs.length; i += 2) {
                var /** @type {?} */ isTerminal = i === attrs.length - 2;
                var /** @type {?} */ name = attrs[i];
                var /** @type {?} */ value = attrs[i + 1];
                if (isTerminal) {
                    var /** @type {?} */ terminalMap = matcher._attrValueMap;
                    var /** @type {?} */ terminalValuesMap = terminalMap.get(name);
                    if (!terminalValuesMap) {
                        terminalValuesMap = new Map();
                        terminalMap.set(name, terminalValuesMap);
                    }
                    this._addTerminal(terminalValuesMap, value, selectable);
                }
                else {
                    var /** @type {?} */ partialMap = matcher._attrValuePartialMap;
                    var /** @type {?} */ partialValuesMap = partialMap.get(name);
                    if (!partialValuesMap) {
                        partialValuesMap = new Map();
                        partialMap.set(name, partialValuesMap);
                    }
                    matcher = this._addPartial(partialValuesMap, value);
                }
            }
        }
    };
    /**
     * @param {?} map
     * @param {?} name
     * @param {?} selectable
     * @return {?}
     */
    SelectorMatcher.prototype._addTerminal = function (map, name, selectable) {
        var /** @type {?} */ terminalList = map.get(name);
        if (!terminalList) {
            terminalList = [];
            map.set(name, terminalList);
        }
        terminalList.push(selectable);
    };
    /**
     * @param {?} map
     * @param {?} name
     * @return {?}
     */
    SelectorMatcher.prototype._addPartial = function (map, name) {
        var /** @type {?} */ matcher = map.get(name);
        if (!matcher) {
            matcher = new SelectorMatcher();
            map.set(name, matcher);
        }
        return matcher;
    };
    /**
     * Find the objects that have been added via `addSelectable`
     * whose css selector is contained in the given css selector.
     * @param {?} cssSelector A css selector
     * @param {?} matchedCallback This callback will be called with the object handed into `addSelectable`
     * @return {?} boolean true if a match was found
     */
    SelectorMatcher.prototype.match = function (cssSelector, matchedCallback) {
        var /** @type {?} */ result = false;
        var /** @type {?} */ element = ((cssSelector.element));
        var /** @type {?} */ classNames = cssSelector.classNames;
        var /** @type {?} */ attrs = cssSelector.attrs;
        for (var /** @type {?} */ i = 0; i < this._listContexts.length; i++) {
            this._listContexts[i].alreadyMatched = false;
        }
        result = this._matchTerminal(this._elementMap, element, cssSelector, matchedCallback) || result;
        result = this._matchPartial(this._elementPartialMap, element, cssSelector, matchedCallback) ||
            result;
        if (classNames) {
            for (var /** @type {?} */ i = 0; i < classNames.length; i++) {
                var /** @type {?} */ className = classNames[i];
                result =
                    this._matchTerminal(this._classMap, className, cssSelector, matchedCallback) || result;
                result =
                    this._matchPartial(this._classPartialMap, className, cssSelector, matchedCallback) ||
                        result;
            }
        }
        if (attrs) {
            for (var /** @type {?} */ i = 0; i < attrs.length; i += 2) {
                var /** @type {?} */ name = attrs[i];
                var /** @type {?} */ value = attrs[i + 1];
                var /** @type {?} */ terminalValuesMap = ((this._attrValueMap.get(name)));
                if (value) {
                    result =
                        this._matchTerminal(terminalValuesMap, '', cssSelector, matchedCallback) || result;
                }
                result =
                    this._matchTerminal(terminalValuesMap, value, cssSelector, matchedCallback) || result;
                var /** @type {?} */ partialValuesMap = ((this._attrValuePartialMap.get(name)));
                if (value) {
                    result = this._matchPartial(partialValuesMap, '', cssSelector, matchedCallback) || result;
                }
                result =
                    this._matchPartial(partialValuesMap, value, cssSelector, matchedCallback) || result;
            }
        }
        return result;
    };
    /**
     * \@internal
     * @param {?} map
     * @param {?} name
     * @param {?} cssSelector
     * @param {?} matchedCallback
     * @return {?}
     */
    SelectorMatcher.prototype._matchTerminal = function (map, name, cssSelector, matchedCallback) {
        if (!map || typeof name !== 'string') {
            return false;
        }
        var /** @type {?} */ selectables = map.get(name) || [];
        var /** @type {?} */ starSelectables = ((map.get('*')));
        if (starSelectables) {
            selectables = selectables.concat(starSelectables);
        }
        if (selectables.length === 0) {
            return false;
        }
        var /** @type {?} */ selectable;
        var /** @type {?} */ result = false;
        for (var /** @type {?} */ i = 0; i < selectables.length; i++) {
            selectable = selectables[i];
            result = selectable.finalize(cssSelector, matchedCallback) || result;
        }
        return result;
    };
    /**
     * \@internal
     * @param {?} map
     * @param {?} name
     * @param {?} cssSelector
     * @param {?} matchedCallback
     * @return {?}
     */
    SelectorMatcher.prototype._matchPartial = function (map, name, cssSelector, matchedCallback) {
        if (!map || typeof name !== 'string') {
            return false;
        }
        var /** @type {?} */ nestedSelector = map.get(name);
        if (!nestedSelector) {
            return false;
        }
        // TODO(perf): get rid of recursion and measure again
        // TODO(perf): don't pass the whole selector into the recursion,
        // but only the not processed parts
        return nestedSelector.match(cssSelector, matchedCallback);
    };
    return SelectorMatcher;
}());
var SelectorListContext = (function () {
    /**
     * @param {?} selectors
     */
    function SelectorListContext(selectors) {
        this.selectors = selectors;
        this.alreadyMatched = false;
    }
    return SelectorListContext;
}());
var SelectorContext = (function () {
    /**
     * @param {?} selector
     * @param {?} cbContext
     * @param {?} listContext
     */
    function SelectorContext(selector, cbContext, listContext) {
        this.selector = selector;
        this.cbContext = cbContext;
        this.listContext = listContext;
        this.notSelectors = selector.notSelectors;
    }
    /**
     * @param {?} cssSelector
     * @param {?} callback
     * @return {?}
     */
    SelectorContext.prototype.finalize = function (cssSelector, callback) {
        var /** @type {?} */ result = true;
        if (this.notSelectors.length > 0 && (!this.listContext || !this.listContext.alreadyMatched)) {
            var /** @type {?} */ notMatcher = SelectorMatcher.createNotMatcher(this.notSelectors);
            result = !notMatcher.match(cssSelector, null);
        }
        if (result && callback && (!this.listContext || !this.listContext.alreadyMatched)) {
            if (this.listContext) {
                this.listContext.alreadyMatched = true;
            }
            callback(this.selector, this.cbContext);
        }
        return result;
    };
    return SelectorContext;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var MODULE_SUFFIX = '';
var DASH_CASE_REGEXP = /-+([a-z0-9])/g;
/**
 * @param {?} input
 * @return {?}
 */
/**
 * @param {?} input
 * @return {?}
 */
function dashCaseToCamelCase(input) {
    return input.replace(DASH_CASE_REGEXP, function () {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
        }
        return m[1].toUpperCase();
    });
}
/**
 * @param {?} input
 * @param {?} defaultValues
 * @return {?}
 */
function splitAtColon(input, defaultValues) {
    return _splitAt(input, ':', defaultValues);
}
/**
 * @param {?} input
 * @param {?} defaultValues
 * @return {?}
 */
function splitAtPeriod(input, defaultValues) {
    return _splitAt(input, '.', defaultValues);
}
/**
 * @param {?} input
 * @param {?} character
 * @param {?} defaultValues
 * @return {?}
 */
function _splitAt(input, character, defaultValues) {
    var /** @type {?} */ characterIndex = input.indexOf(character);
    if (characterIndex == -1)
        return defaultValues;
    return [input.slice(0, characterIndex).trim(), input.slice(characterIndex + 1).trim()];
}
/**
 * @param {?} value
 * @param {?} visitor
 * @param {?} context
 * @return {?}
 */
function visitValue(value, visitor, context) {
    if (Array.isArray(value)) {
        return visitor.visitArray(/** @type {?} */ (value), context);
    }
    if (isStrictStringMap(value)) {
        return visitor.visitStringMap(/** @type {?} */ (value), context);
    }
    if (value == null || typeof value == 'string' || typeof value == 'number' ||
        typeof value == 'boolean') {
        return visitor.visitPrimitive(value, context);
    }
    return visitor.visitOther(value, context);
}
/**
 * @param {?} val
 * @return {?}
 */
function isDefined(val) {
    return val !== null && val !== undefined;
}
/**
 * @template T
 * @param {?} val
 * @return {?}
 */
function noUndefined(val) {
    return val === undefined ? ((null)) : val;
}
var ValueTransformer = (function () {
    function ValueTransformer() {
    }
    /**
     * @param {?} arr
     * @param {?} context
     * @return {?}
     */
    ValueTransformer.prototype.visitArray = function (arr, context) {
        var _this = this;
        return arr.map(function (value) { return visitValue(value, _this, context); });
    };
    /**
     * @param {?} map
     * @param {?} context
     * @return {?}
     */
    ValueTransformer.prototype.visitStringMap = function (map, context) {
        var _this = this;
        var /** @type {?} */ result = {};
        Object.keys(map).forEach(function (key) { result[key] = visitValue(map[key], _this, context); });
        return result;
    };
    /**
     * @param {?} value
     * @param {?} context
     * @return {?}
     */
    ValueTransformer.prototype.visitPrimitive = function (value, context) { return value; };
    /**
     * @param {?} value
     * @param {?} context
     * @return {?}
     */
    ValueTransformer.prototype.visitOther = function (value, context) { return value; };
    return ValueTransformer;
}());
var SyncAsyncResult = (function () {
    /**
     * @param {?} syncResult
     * @param {?=} asyncResult
     */
    function SyncAsyncResult(syncResult, asyncResult) {
        if (asyncResult === void 0) { asyncResult = null; }
        this.syncResult = syncResult;
        this.asyncResult = asyncResult;
        if (!asyncResult) {
            this.asyncResult = Promise.resolve(syncResult);
        }
    }
    return SyncAsyncResult;
}());
/**
 * @param {?} msg
 * @return {?}
 */
function syntaxError(msg) {
    var /** @type {?} */ error = Error(msg);
    ((error))[ERROR_SYNTAX_ERROR] = true;
    return error;
}
var ERROR_SYNTAX_ERROR = 'ngSyntaxError';
/**
 * @param {?} error
 * @return {?}
 */
function isSyntaxError(error) {
    return ((error))[ERROR_SYNTAX_ERROR];
}
/**
 * @param {?} s
 * @return {?}
 */
function escapeRegExp(s) {
    return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}
var STRING_MAP_PROTO = Object.getPrototypeOf({});
/**
 * @param {?} obj
 * @return {?}
 */
function isStrictStringMap(obj) {
    return typeof obj === 'object' && obj !== null && Object.getPrototypeOf(obj) === STRING_MAP_PROTO;
}
/**
 * @param {?} str
 * @return {?}
 */
function utf8Encode(str) {
    var /** @type {?} */ encoded = '';
    for (var /** @type {?} */ index = 0; index < str.length; index++) {
        var /** @type {?} */ codePoint = str.charCodeAt(index);
        // decode surrogate
        // see https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        if (codePoint >= 0xd800 && codePoint <= 0xdbff && str.length > (index + 1)) {
            var /** @type {?} */ low = str.charCodeAt(index + 1);
            if (low >= 0xdc00 && low <= 0xdfff) {
                index++;
                codePoint = ((codePoint - 0xd800) << 10) + low - 0xdc00 + 0x10000;
            }
        }
        if (codePoint <= 0x7f) {
            encoded += String.fromCharCode(codePoint);
        }
        else if (codePoint <= 0x7ff) {
            encoded += String.fromCharCode(((codePoint >> 6) & 0x1F) | 0xc0, (codePoint & 0x3f) | 0x80);
        }
        else if (codePoint <= 0xffff) {
            encoded += String.fromCharCode((codePoint >> 12) | 0xe0, ((codePoint >> 6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80);
        }
        else if (codePoint <= 0x1fffff) {
            encoded += String.fromCharCode(((codePoint >> 18) & 0x07) | 0xf0, ((codePoint >> 12) & 0x3f) | 0x80, ((codePoint >> 6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80);
        }
    }
    return encoded;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// group 0: "[prop] or (event) or @trigger"
// group 1: "prop" from "[prop]"
// group 2: "event" from "(event)"
// group 3: "@trigger" from "@trigger"
var HOST_REG_EXP = /^(?:(?:\[([^\]]+)\])|(?:\(([^\)]+)\)))|(\@[-\w]+)$/;
var CompileAnimationEntryMetadata = (function () {
    /**
     * @param {?=} name
     * @param {?=} definitions
     */
    function CompileAnimationEntryMetadata(name, definitions) {
        if (name === void 0) { name = null; }
        if (definitions === void 0) { definitions = null; }
        this.name = name;
        this.definitions = definitions;
    }
    return CompileAnimationEntryMetadata;
}());
/**
 * @abstract
 */
var CompileAnimationStateMetadata = (function () {
    function CompileAnimationStateMetadata() {
    }
    return CompileAnimationStateMetadata;
}());
var CompileAnimationStateDeclarationMetadata = (function (_super) {
    __extends(CompileAnimationStateDeclarationMetadata, _super);
    /**
     * @param {?} stateNameExpr
     * @param {?} styles
     */
    function CompileAnimationStateDeclarationMetadata(stateNameExpr, styles) {
        var _this = _super.call(this) || this;
        _this.stateNameExpr = stateNameExpr;
        _this.styles = styles;
        return _this;
    }
    return CompileAnimationStateDeclarationMetadata;
}(CompileAnimationStateMetadata));
var CompileAnimationStateTransitionMetadata = (function (_super) {
    __extends(CompileAnimationStateTransitionMetadata, _super);
    /**
     * @param {?} stateChangeExpr
     * @param {?} steps
     */
    function CompileAnimationStateTransitionMetadata(stateChangeExpr, steps) {
        var _this = _super.call(this) || this;
        _this.stateChangeExpr = stateChangeExpr;
        _this.steps = steps;
        return _this;
    }
    return CompileAnimationStateTransitionMetadata;
}(CompileAnimationStateMetadata));
/**
 * @abstract
 */
var CompileAnimationMetadata = (function () {
    function CompileAnimationMetadata() {
    }
    return CompileAnimationMetadata;
}());
var CompileAnimationKeyframesSequenceMetadata = (function (_super) {
    __extends(CompileAnimationKeyframesSequenceMetadata, _super);
    /**
     * @param {?=} steps
     */
    function CompileAnimationKeyframesSequenceMetadata(steps) {
        if (steps === void 0) { steps = []; }
        var _this = _super.call(this) || this;
        _this.steps = steps;
        return _this;
    }
    return CompileAnimationKeyframesSequenceMetadata;
}(CompileAnimationMetadata));
var CompileAnimationStyleMetadata = (function (_super) {
    __extends(CompileAnimationStyleMetadata, _super);
    /**
     * @param {?} offset
     * @param {?=} styles
     */
    function CompileAnimationStyleMetadata(offset, styles) {
        if (styles === void 0) { styles = null; }
        var _this = _super.call(this) || this;
        _this.offset = offset;
        _this.styles = styles;
        return _this;
    }
    return CompileAnimationStyleMetadata;
}(CompileAnimationMetadata));
var CompileAnimationAnimateMetadata = (function (_super) {
    __extends(CompileAnimationAnimateMetadata, _super);
    /**
     * @param {?=} timings
     * @param {?=} styles
     */
    function CompileAnimationAnimateMetadata(timings, styles) {
        if (timings === void 0) { timings = 0; }
        if (styles === void 0) { styles = null; }
        var _this = _super.call(this) || this;
        _this.timings = timings;
        _this.styles = styles;
        return _this;
    }
    return CompileAnimationAnimateMetadata;
}(CompileAnimationMetadata));
/**
 * @abstract
 */
var CompileAnimationWithStepsMetadata = (function (_super) {
    __extends(CompileAnimationWithStepsMetadata, _super);
    /**
     * @param {?=} steps
     */
    function CompileAnimationWithStepsMetadata(steps) {
        if (steps === void 0) { steps = null; }
        var _this = _super.call(this) || this;
        _this.steps = steps;
        return _this;
    }
    return CompileAnimationWithStepsMetadata;
}(CompileAnimationMetadata));
var CompileAnimationSequenceMetadata = (function (_super) {
    __extends(CompileAnimationSequenceMetadata, _super);
    /**
     * @param {?=} steps
     */
    function CompileAnimationSequenceMetadata(steps) {
        if (steps === void 0) { steps = null; }
        return _super.call(this, steps) || this;
    }
    return CompileAnimationSequenceMetadata;
}(CompileAnimationWithStepsMetadata));
var CompileAnimationGroupMetadata = (function (_super) {
    __extends(CompileAnimationGroupMetadata, _super);
    /**
     * @param {?=} steps
     */
    function CompileAnimationGroupMetadata(steps) {
        if (steps === void 0) { steps = null; }
        return _super.call(this, steps) || this;
    }
    return CompileAnimationGroupMetadata;
}(CompileAnimationWithStepsMetadata));
/**
 * @param {?} name
 * @return {?}
 */
function _sanitizeIdentifier(name) {
    return name.replace(/\W/g, '_');
}
var _anonymousTypeIndex = 0;
/**
 * @param {?} compileIdentifier
 * @return {?}
 */
function identifierName(compileIdentifier) {
    if (!compileIdentifier || !compileIdentifier.reference) {
        return null;
    }
    var /** @type {?} */ ref = compileIdentifier.reference;
    if (ref instanceof StaticSymbol) {
        return ref.name;
    }
    if (ref['__anonymousType']) {
        return ref['__anonymousType'];
    }
    var /** @type {?} */ identifier = ɵstringify(ref);
    if (identifier.indexOf('(') >= 0) {
        // case: anonymous functions!
        identifier = "anonymous_" + _anonymousTypeIndex++;
        ref['__anonymousType'] = identifier;
    }
    else {
        identifier = _sanitizeIdentifier(identifier);
    }
    return identifier;
}
/**
 * @param {?} compileIdentifier
 * @return {?}
 */
function identifierModuleUrl(compileIdentifier) {
    var /** @type {?} */ ref = compileIdentifier.reference;
    if (ref instanceof StaticSymbol) {
        return ref.filePath;
    }
    return ɵreflector.importUri(ref);
}
/**
 * @param {?} compType
 * @param {?} embeddedTemplateIndex
 * @return {?}
 */
function viewClassName(compType, embeddedTemplateIndex) {
    return "View_" + identifierName({ reference: compType }) + "_" + embeddedTemplateIndex;
}
/**
 * @param {?} compType
 * @return {?}
 */
function rendererTypeName(compType) {
    return "RenderType_" + identifierName({ reference: compType });
}
/**
 * @param {?} compType
 * @return {?}
 */
function hostViewClassName(compType) {
    return "HostView_" + identifierName({ reference: compType });
}
/**
 * @param {?} dirType
 * @return {?}
 */
function dirWrapperClassName(dirType) {
    return "Wrapper_" + identifierName({ reference: dirType });
}
/**
 * @param {?} compType
 * @return {?}
 */
function componentFactoryName(compType) {
    return identifierName({ reference: compType }) + "NgFactory";
}
var CompileSummaryKind = {};
CompileSummaryKind.Pipe = 0;
CompileSummaryKind.Directive = 1;
CompileSummaryKind.NgModule = 2;
CompileSummaryKind.Injectable = 3;
CompileSummaryKind[CompileSummaryKind.Pipe] = "Pipe";
CompileSummaryKind[CompileSummaryKind.Directive] = "Directive";
CompileSummaryKind[CompileSummaryKind.NgModule] = "NgModule";
CompileSummaryKind[CompileSummaryKind.Injectable] = "Injectable";
/**
 * @param {?} token
 * @return {?}
 */
function tokenName(token) {
    return token.value != null ? _sanitizeIdentifier(token.value) : identifierName(token.identifier);
}
/**
 * @param {?} token
 * @return {?}
 */
function tokenReference(token) {
    if (token.identifier != null) {
        return token.identifier.reference;
    }
    else {
        return token.value;
    }
}
/**
 * Metadata about a stylesheet
 */
var CompileStylesheetMetadata = (function () {
    /**
     * @param {?=} __0
     */
    function CompileStylesheetMetadata(_a) {
        var _b = _a === void 0 ? {} : _a, moduleUrl = _b.moduleUrl, styles = _b.styles, styleUrls = _b.styleUrls;
        this.moduleUrl = moduleUrl || null;
        this.styles = _normalizeArray(styles);
        this.styleUrls = _normalizeArray(styleUrls);
    }
    return CompileStylesheetMetadata;
}());
/**
 * Metadata regarding compilation of a template.
 */
var CompileTemplateMetadata = (function () {
    /**
     * @param {?} __0
     */
    function CompileTemplateMetadata(_a) {
        var encapsulation = _a.encapsulation, template = _a.template, templateUrl = _a.templateUrl, styles = _a.styles, styleUrls = _a.styleUrls, externalStylesheets = _a.externalStylesheets, animations = _a.animations, ngContentSelectors = _a.ngContentSelectors, interpolation = _a.interpolation, isInline = _a.isInline;
        this.encapsulation = encapsulation;
        this.template = template;
        this.templateUrl = templateUrl;
        this.styles = _normalizeArray(styles);
        this.styleUrls = _normalizeArray(styleUrls);
        this.externalStylesheets = _normalizeArray(externalStylesheets);
        this.animations = animations ? flatten(animations) : [];
        this.ngContentSelectors = ngContentSelectors || [];
        if (interpolation && interpolation.length != 2) {
            throw new Error("'interpolation' should have a start and an end symbol.");
        }
        this.interpolation = interpolation;
        this.isInline = isInline;
    }
    /**
     * @return {?}
     */
    CompileTemplateMetadata.prototype.toSummary = function () {
        return {
            animations: this.animations.map(function (anim) { return anim.name; }),
            ngContentSelectors: this.ngContentSelectors,
            encapsulation: this.encapsulation,
        };
    };
    return CompileTemplateMetadata;
}());
/**
 * Metadata regarding compilation of a directive.
 */
var CompileDirectiveMetadata = (function () {
    /**
     * @param {?} __0
     */
    function CompileDirectiveMetadata(_a) {
        var isHost = _a.isHost, type = _a.type, isComponent = _a.isComponent, selector = _a.selector, exportAs = _a.exportAs, changeDetection = _a.changeDetection, inputs = _a.inputs, outputs = _a.outputs, hostListeners = _a.hostListeners, hostProperties = _a.hostProperties, hostAttributes = _a.hostAttributes, providers = _a.providers, viewProviders = _a.viewProviders, queries = _a.queries, viewQueries = _a.viewQueries, entryComponents = _a.entryComponents, template = _a.template, componentViewType = _a.componentViewType, rendererType = _a.rendererType, componentFactory = _a.componentFactory;
        this.isHost = !!isHost;
        this.type = type;
        this.isComponent = isComponent;
        this.selector = selector;
        this.exportAs = exportAs;
        this.changeDetection = changeDetection;
        this.inputs = inputs;
        this.outputs = outputs;
        this.hostListeners = hostListeners;
        this.hostProperties = hostProperties;
        this.hostAttributes = hostAttributes;
        this.providers = _normalizeArray(providers);
        this.viewProviders = _normalizeArray(viewProviders);
        this.queries = _normalizeArray(queries);
        this.viewQueries = _normalizeArray(viewQueries);
        this.entryComponents = _normalizeArray(entryComponents);
        this.template = template;
        this.componentViewType = componentViewType;
        this.rendererType = rendererType;
        this.componentFactory = componentFactory;
    }
    /**
     * @param {?} __0
     * @return {?}
     */
    CompileDirectiveMetadata.create = function (_a) {
        var isHost = _a.isHost, type = _a.type, isComponent = _a.isComponent, selector = _a.selector, exportAs = _a.exportAs, changeDetection = _a.changeDetection, inputs = _a.inputs, outputs = _a.outputs, host = _a.host, providers = _a.providers, viewProviders = _a.viewProviders, queries = _a.queries, viewQueries = _a.viewQueries, entryComponents = _a.entryComponents, template = _a.template, componentViewType = _a.componentViewType, rendererType = _a.rendererType, componentFactory = _a.componentFactory;
        var /** @type {?} */ hostListeners = {};
        var /** @type {?} */ hostProperties = {};
        var /** @type {?} */ hostAttributes = {};
        if (host != null) {
            Object.keys(host).forEach(function (key) {
                var /** @type {?} */ value = host[key];
                var /** @type {?} */ matches = key.match(HOST_REG_EXP);
                if (matches === null) {
                    hostAttributes[key] = value;
                }
                else if (matches[1] != null) {
                    hostProperties[matches[1]] = value;
                }
                else if (matches[2] != null) {
                    hostListeners[matches[2]] = value;
                }
            });
        }
        var /** @type {?} */ inputsMap = {};
        if (inputs != null) {
            inputs.forEach(function (bindConfig) {
                // canonical syntax: `dirProp: elProp`
                // if there is no `:`, use dirProp = elProp
                var /** @type {?} */ parts = splitAtColon(bindConfig, [bindConfig, bindConfig]);
                inputsMap[parts[0]] = parts[1];
            });
        }
        var /** @type {?} */ outputsMap = {};
        if (outputs != null) {
            outputs.forEach(function (bindConfig) {
                // canonical syntax: `dirProp: elProp`
                // if there is no `:`, use dirProp = elProp
                var /** @type {?} */ parts = splitAtColon(bindConfig, [bindConfig, bindConfig]);
                outputsMap[parts[0]] = parts[1];
            });
        }
        return new CompileDirectiveMetadata({
            isHost: isHost,
            type: type,
            isComponent: !!isComponent, selector: selector, exportAs: exportAs, changeDetection: changeDetection,
            inputs: inputsMap,
            outputs: outputsMap,
            hostListeners: hostListeners,
            hostProperties: hostProperties,
            hostAttributes: hostAttributes,
            providers: providers,
            viewProviders: viewProviders,
            queries: queries,
            viewQueries: viewQueries,
            entryComponents: entryComponents,
            template: template,
            componentViewType: componentViewType,
            rendererType: rendererType,
            componentFactory: componentFactory,
        });
    };
    /**
     * @return {?}
     */
    CompileDirectiveMetadata.prototype.toSummary = function () {
        return {
            summaryKind: CompileSummaryKind.Directive,
            type: this.type,
            isComponent: this.isComponent,
            selector: this.selector,
            exportAs: this.exportAs,
            inputs: this.inputs,
            outputs: this.outputs,
            hostListeners: this.hostListeners,
            hostProperties: this.hostProperties,
            hostAttributes: this.hostAttributes,
            providers: this.providers,
            viewProviders: this.viewProviders,
            queries: this.queries,
            viewQueries: this.viewQueries,
            entryComponents: this.entryComponents,
            changeDetection: this.changeDetection,
            template: this.template && this.template.toSummary(),
            componentViewType: this.componentViewType,
            rendererType: this.rendererType,
            componentFactory: this.componentFactory
        };
    };
    return CompileDirectiveMetadata;
}());
/**
 * Construct {\@link CompileDirectiveMetadata} from {\@link ComponentTypeMetadata} and a selector.
 * @param {?} hostTypeReference
 * @param {?} compMeta
 * @param {?} hostViewType
 * @return {?}
 */
function createHostComponentMeta(hostTypeReference, compMeta, hostViewType) {
    var /** @type {?} */ template = CssSelector.parse(/** @type {?} */ ((compMeta.selector)))[0].getMatchingElementTemplate();
    return CompileDirectiveMetadata.create({
        isHost: true,
        type: { reference: hostTypeReference, diDeps: [], lifecycleHooks: [] },
        template: new CompileTemplateMetadata({
            encapsulation: ViewEncapsulation.None,
            template: template,
            templateUrl: '',
            styles: [],
            styleUrls: [],
            ngContentSelectors: [],
            animations: [],
            isInline: true,
            externalStylesheets: [],
            interpolation: null
        }),
        exportAs: null,
        changeDetection: ChangeDetectionStrategy.Default,
        inputs: [],
        outputs: [],
        host: {},
        isComponent: true,
        selector: '*',
        providers: [],
        viewProviders: [],
        queries: [],
        viewQueries: [],
        componentViewType: hostViewType,
        rendererType: { id: '__Host__', encapsulation: ViewEncapsulation.None, styles: [], data: {} },
        entryComponents: [],
        componentFactory: null
    });
}
var CompilePipeMetadata = (function () {
    /**
     * @param {?} __0
     */
    function CompilePipeMetadata(_a) {
        var type = _a.type, name = _a.name, pure = _a.pure;
        this.type = type;
        this.name = name;
        this.pure = !!pure;
    }
    /**
     * @return {?}
     */
    CompilePipeMetadata.prototype.toSummary = function () {
        return {
            summaryKind: CompileSummaryKind.Pipe,
            type: this.type,
            name: this.name,
            pure: this.pure
        };
    };
    return CompilePipeMetadata;
}());
/**
 * Metadata regarding compilation of a module.
 */
var CompileNgModuleMetadata = (function () {
    /**
     * @param {?} __0
     */
    function CompileNgModuleMetadata(_a) {
        var type = _a.type, providers = _a.providers, declaredDirectives = _a.declaredDirectives, exportedDirectives = _a.exportedDirectives, declaredPipes = _a.declaredPipes, exportedPipes = _a.exportedPipes, entryComponents = _a.entryComponents, bootstrapComponents = _a.bootstrapComponents, importedModules = _a.importedModules, exportedModules = _a.exportedModules, schemas = _a.schemas, transitiveModule = _a.transitiveModule, id = _a.id;
        this.type = type || null;
        this.declaredDirectives = _normalizeArray(declaredDirectives);
        this.exportedDirectives = _normalizeArray(exportedDirectives);
        this.declaredPipes = _normalizeArray(declaredPipes);
        this.exportedPipes = _normalizeArray(exportedPipes);
        this.providers = _normalizeArray(providers);
        this.entryComponents = _normalizeArray(entryComponents);
        this.bootstrapComponents = _normalizeArray(bootstrapComponents);
        this.importedModules = _normalizeArray(importedModules);
        this.exportedModules = _normalizeArray(exportedModules);
        this.schemas = _normalizeArray(schemas);
        this.id = id || null;
        this.transitiveModule = transitiveModule || null;
    }
    /**
     * @return {?}
     */
    CompileNgModuleMetadata.prototype.toSummary = function () {
        var /** @type {?} */ module = ((this.transitiveModule));
        return {
            summaryKind: CompileSummaryKind.NgModule,
            type: this.type,
            entryComponents: module.entryComponents,
            providers: module.providers,
            modules: module.modules,
            exportedDirectives: module.exportedDirectives,
            exportedPipes: module.exportedPipes
        };
    };
    return CompileNgModuleMetadata;
}());
var TransitiveCompileNgModuleMetadata = (function () {
    function TransitiveCompileNgModuleMetadata() {
        this.directivesSet = new Set();
        this.directives = [];
        this.exportedDirectivesSet = new Set();
        this.exportedDirectives = [];
        this.pipesSet = new Set();
        this.pipes = [];
        this.exportedPipesSet = new Set();
        this.exportedPipes = [];
        this.modulesSet = new Set();
        this.modules = [];
        this.entryComponentsSet = new Set();
        this.entryComponents = [];
        this.providers = [];
    }
    /**
     * @param {?} provider
     * @param {?} module
     * @return {?}
     */
    TransitiveCompileNgModuleMetadata.prototype.addProvider = function (provider, module) {
        this.providers.push({ provider: provider, module: module });
    };
    /**
     * @param {?} id
     * @return {?}
     */
    TransitiveCompileNgModuleMetadata.prototype.addDirective = function (id) {
        if (!this.directivesSet.has(id.reference)) {
            this.directivesSet.add(id.reference);
            this.directives.push(id);
        }
    };
    /**
     * @param {?} id
     * @return {?}
     */
    TransitiveCompileNgModuleMetadata.prototype.addExportedDirective = function (id) {
        if (!this.exportedDirectivesSet.has(id.reference)) {
            this.exportedDirectivesSet.add(id.reference);
            this.exportedDirectives.push(id);
        }
    };
    /**
     * @param {?} id
     * @return {?}
     */
    TransitiveCompileNgModuleMetadata.prototype.addPipe = function (id) {
        if (!this.pipesSet.has(id.reference)) {
            this.pipesSet.add(id.reference);
            this.pipes.push(id);
        }
    };
    /**
     * @param {?} id
     * @return {?}
     */
    TransitiveCompileNgModuleMetadata.prototype.addExportedPipe = function (id) {
        if (!this.exportedPipesSet.has(id.reference)) {
            this.exportedPipesSet.add(id.reference);
            this.exportedPipes.push(id);
        }
    };
    /**
     * @param {?} id
     * @return {?}
     */
    TransitiveCompileNgModuleMetadata.prototype.addModule = function (id) {
        if (!this.modulesSet.has(id.reference)) {
            this.modulesSet.add(id.reference);
            this.modules.push(id);
        }
    };
    /**
     * @param {?} ec
     * @return {?}
     */
    TransitiveCompileNgModuleMetadata.prototype.addEntryComponent = function (ec) {
        if (!this.entryComponentsSet.has(ec.componentType)) {
            this.entryComponentsSet.add(ec.componentType);
            this.entryComponents.push(ec);
        }
    };
    return TransitiveCompileNgModuleMetadata;
}());
/**
 * @param {?} obj
 * @return {?}
 */
function _normalizeArray(obj) {
    return obj || [];
}
var ProviderMeta = (function () {
    /**
     * @param {?} token
     * @param {?} __1
     */
    function ProviderMeta(token, _a) {
        var useClass = _a.useClass, useValue = _a.useValue, useExisting = _a.useExisting, useFactory = _a.useFactory, deps = _a.deps, multi = _a.multi;
        this.token = token;
        this.useClass = useClass || null;
        this.useValue = useValue;
        this.useExisting = useExisting;
        this.useFactory = useFactory || null;
        this.dependencies = deps || null;
        this.multi = !!multi;
    }
    return ProviderMeta;
}());
/**
 * @template T
 * @param {?} list
 * @return {?}
 */
function flatten(list) {
    return list.reduce(function (flat, item) {
        var /** @type {?} */ flatItem = Array.isArray(item) ? flatten(item) : item;
        return ((flat)).concat(flatItem);
    }, []);
}
/**
 * @param {?} url
 * @return {?}
 */
function sourceUrl(url) {
    // Note: We need 3 "/" so that ng shows up as a separate domain
    // in the chrome dev tools.
    return url.replace(/(\w+:\/\/[\w:-]+)?(\/+)?/, 'ng:///');
}
/**
 * @param {?} ngModuleType
 * @param {?} compMeta
 * @param {?} templateMeta
 * @return {?}
 */
function templateSourceUrl(ngModuleType, compMeta, templateMeta) {
    var /** @type {?} */ url;
    if (templateMeta.isInline) {
        if (compMeta.type.reference instanceof StaticSymbol) {
            // Note: a .ts file might contain multiple components with inline templates,
            // so we need to give them unique urls, as these will be used for sourcemaps.
            url = compMeta.type.reference.filePath + "." + compMeta.type.reference.name + ".html";
        }
        else {
            url = identifierName(ngModuleType) + "/" + identifierName(compMeta.type) + ".html";
        }
    }
    else {
        url = ((templateMeta.templateUrl));
    }
    // always prepend ng:// to make angular resources easy to find and not clobber
    // user resources.
    return sourceUrl(url);
}
/**
 * @param {?} meta
 * @param {?} id
 * @return {?}
 */
function sharedStylesheetJitUrl(meta, id) {
    var /** @type {?} */ pathParts = ((meta.moduleUrl)).split(/\/\\/g);
    var /** @type {?} */ baseName = pathParts[pathParts.length - 1];
    return sourceUrl("css/" + id + baseName + ".ngstyle.js");
}
/**
 * @param {?} moduleMeta
 * @return {?}
 */
function ngModuleJitUrl(moduleMeta) {
    return sourceUrl(identifierName(moduleMeta.type) + "/module.ngfactory.js");
}
/**
 * @param {?} ngModuleType
 * @param {?} compMeta
 * @return {?}
 */
function templateJitUrl(ngModuleType, compMeta) {
    return sourceUrl(identifierName(ngModuleType) + "/" + identifierName(compMeta.type) + ".ngfactory.js");
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var CompilerConfig = (function () {
    /**
     * @param {?=} __0
     */
    function CompilerConfig(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.defaultEncapsulation, defaultEncapsulation = _c === void 0 ? ViewEncapsulation.Emulated : _c, _d = _b.useJit, useJit = _d === void 0 ? true : _d, missingTranslation = _b.missingTranslation, enableLegacyTemplate = _b.enableLegacyTemplate;
        this.defaultEncapsulation = defaultEncapsulation;
        this.useJit = !!useJit;
        this.missingTranslation = missingTranslation || null;
        this.enableLegacyTemplate = enableLegacyTemplate !== false;
    }
    return CompilerConfig;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var ParserError = (function () {
    /**
     * @param {?} message
     * @param {?} input
     * @param {?} errLocation
     * @param {?=} ctxLocation
     */
    function ParserError(message, input, errLocation, ctxLocation) {
        this.input = input;
        this.errLocation = errLocation;
        this.ctxLocation = ctxLocation;
        this.message = "Parser Error: " + message + " " + errLocation + " [" + input + "] in " + ctxLocation;
    }
    return ParserError;
}());
var ParseSpan = (function () {
    /**
     * @param {?} start
     * @param {?} end
     */
    function ParseSpan(start, end) {
        this.start = start;
        this.end = end;
    }
    return ParseSpan;
}());
var AST = (function () {
    /**
     * @param {?} span
     */
    function AST(span) {
        this.span = span;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    AST.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return null;
    };
    /**
     * @return {?}
     */
    AST.prototype.toString = function () { return 'AST'; };
    return AST;
}());
/**
 * Represents a quoted expression of the form:
 *
 * quote = prefix `:` uninterpretedExpression
 * prefix = identifier
 * uninterpretedExpression = arbitrary string
 *
 * A quoted expression is meant to be pre-processed by an AST transformer that
 * converts it into another AST that no longer contains quoted expressions.
 * It is meant to allow third-party developers to extend Angular template
 * expression language. The `uninterpretedExpression` part of the quote is
 * therefore not interpreted by the Angular's own expression parser.
 */
var Quote = (function (_super) {
    __extends(Quote, _super);
    /**
     * @param {?} span
     * @param {?} prefix
     * @param {?} uninterpretedExpression
     * @param {?} location
     */
    function Quote(span, prefix, uninterpretedExpression, location) {
        var _this = _super.call(this, span) || this;
        _this.prefix = prefix;
        _this.uninterpretedExpression = uninterpretedExpression;
        _this.location = location;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    Quote.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitQuote(this, context);
    };
    /**
     * @return {?}
     */
    Quote.prototype.toString = function () { return 'Quote'; };
    return Quote;
}(AST));
var EmptyExpr = (function (_super) {
    __extends(EmptyExpr, _super);
    function EmptyExpr() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    EmptyExpr.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        // do nothing
    };
    return EmptyExpr;
}(AST));
var ImplicitReceiver = (function (_super) {
    __extends(ImplicitReceiver, _super);
    function ImplicitReceiver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    ImplicitReceiver.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitImplicitReceiver(this, context);
    };
    return ImplicitReceiver;
}(AST));
/**
 * Multiple expressions separated by a semicolon.
 */
var Chain = (function (_super) {
    __extends(Chain, _super);
    /**
     * @param {?} span
     * @param {?} expressions
     */
    function Chain(span, expressions) {
        var _this = _super.call(this, span) || this;
        _this.expressions = expressions;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    Chain.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitChain(this, context);
    };
    return Chain;
}(AST));
var Conditional = (function (_super) {
    __extends(Conditional, _super);
    /**
     * @param {?} span
     * @param {?} condition
     * @param {?} trueExp
     * @param {?} falseExp
     */
    function Conditional(span, condition, trueExp, falseExp) {
        var _this = _super.call(this, span) || this;
        _this.condition = condition;
        _this.trueExp = trueExp;
        _this.falseExp = falseExp;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    Conditional.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitConditional(this, context);
    };
    return Conditional;
}(AST));
var PropertyRead = (function (_super) {
    __extends(PropertyRead, _super);
    /**
     * @param {?} span
     * @param {?} receiver
     * @param {?} name
     */
    function PropertyRead(span, receiver, name) {
        var _this = _super.call(this, span) || this;
        _this.receiver = receiver;
        _this.name = name;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    PropertyRead.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitPropertyRead(this, context);
    };
    return PropertyRead;
}(AST));
var PropertyWrite = (function (_super) {
    __extends(PropertyWrite, _super);
    /**
     * @param {?} span
     * @param {?} receiver
     * @param {?} name
     * @param {?} value
     */
    function PropertyWrite(span, receiver, name, value) {
        var _this = _super.call(this, span) || this;
        _this.receiver = receiver;
        _this.name = name;
        _this.value = value;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    PropertyWrite.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitPropertyWrite(this, context);
    };
    return PropertyWrite;
}(AST));
var SafePropertyRead = (function (_super) {
    __extends(SafePropertyRead, _super);
    /**
     * @param {?} span
     * @param {?} receiver
     * @param {?} name
     */
    function SafePropertyRead(span, receiver, name) {
        var _this = _super.call(this, span) || this;
        _this.receiver = receiver;
        _this.name = name;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    SafePropertyRead.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitSafePropertyRead(this, context);
    };
    return SafePropertyRead;
}(AST));
var KeyedRead = (function (_super) {
    __extends(KeyedRead, _super);
    /**
     * @param {?} span
     * @param {?} obj
     * @param {?} key
     */
    function KeyedRead(span, obj, key) {
        var _this = _super.call(this, span) || this;
        _this.obj = obj;
        _this.key = key;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    KeyedRead.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitKeyedRead(this, context);
    };
    return KeyedRead;
}(AST));
var KeyedWrite = (function (_super) {
    __extends(KeyedWrite, _super);
    /**
     * @param {?} span
     * @param {?} obj
     * @param {?} key
     * @param {?} value
     */
    function KeyedWrite(span, obj, key, value) {
        var _this = _super.call(this, span) || this;
        _this.obj = obj;
        _this.key = key;
        _this.value = value;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    KeyedWrite.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitKeyedWrite(this, context);
    };
    return KeyedWrite;
}(AST));
var BindingPipe = (function (_super) {
    __extends(BindingPipe, _super);
    /**
     * @param {?} span
     * @param {?} exp
     * @param {?} name
     * @param {?} args
     */
    function BindingPipe(span, exp, name, args) {
        var _this = _super.call(this, span) || this;
        _this.exp = exp;
        _this.name = name;
        _this.args = args;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    BindingPipe.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitPipe(this, context);
    };
    return BindingPipe;
}(AST));
var LiteralPrimitive = (function (_super) {
    __extends(LiteralPrimitive, _super);
    /**
     * @param {?} span
     * @param {?} value
     */
    function LiteralPrimitive(span, value) {
        var _this = _super.call(this, span) || this;
        _this.value = value;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    LiteralPrimitive.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitLiteralPrimitive(this, context);
    };
    return LiteralPrimitive;
}(AST));
var LiteralArray = (function (_super) {
    __extends(LiteralArray, _super);
    /**
     * @param {?} span
     * @param {?} expressions
     */
    function LiteralArray(span, expressions) {
        var _this = _super.call(this, span) || this;
        _this.expressions = expressions;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    LiteralArray.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitLiteralArray(this, context);
    };
    return LiteralArray;
}(AST));
var LiteralMap = (function (_super) {
    __extends(LiteralMap, _super);
    /**
     * @param {?} span
     * @param {?} keys
     * @param {?} values
     */
    function LiteralMap(span, keys, values) {
        var _this = _super.call(this, span) || this;
        _this.keys = keys;
        _this.values = values;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    LiteralMap.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitLiteralMap(this, context);
    };
    return LiteralMap;
}(AST));
var Interpolation = (function (_super) {
    __extends(Interpolation, _super);
    /**
     * @param {?} span
     * @param {?} strings
     * @param {?} expressions
     */
    function Interpolation(span, strings, expressions) {
        var _this = _super.call(this, span) || this;
        _this.strings = strings;
        _this.expressions = expressions;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    Interpolation.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitInterpolation(this, context);
    };
    return Interpolation;
}(AST));
var Binary = (function (_super) {
    __extends(Binary, _super);
    /**
     * @param {?} span
     * @param {?} operation
     * @param {?} left
     * @param {?} right
     */
    function Binary(span, operation, left, right) {
        var _this = _super.call(this, span) || this;
        _this.operation = operation;
        _this.left = left;
        _this.right = right;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    Binary.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitBinary(this, context);
    };
    return Binary;
}(AST));
var PrefixNot = (function (_super) {
    __extends(PrefixNot, _super);
    /**
     * @param {?} span
     * @param {?} expression
     */
    function PrefixNot(span, expression) {
        var _this = _super.call(this, span) || this;
        _this.expression = expression;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    PrefixNot.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitPrefixNot(this, context);
    };
    return PrefixNot;
}(AST));
var MethodCall = (function (_super) {
    __extends(MethodCall, _super);
    /**
     * @param {?} span
     * @param {?} receiver
     * @param {?} name
     * @param {?} args
     */
    function MethodCall(span, receiver, name, args) {
        var _this = _super.call(this, span) || this;
        _this.receiver = receiver;
        _this.name = name;
        _this.args = args;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    MethodCall.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitMethodCall(this, context);
    };
    return MethodCall;
}(AST));
var SafeMethodCall = (function (_super) {
    __extends(SafeMethodCall, _super);
    /**
     * @param {?} span
     * @param {?} receiver
     * @param {?} name
     * @param {?} args
     */
    function SafeMethodCall(span, receiver, name, args) {
        var _this = _super.call(this, span) || this;
        _this.receiver = receiver;
        _this.name = name;
        _this.args = args;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    SafeMethodCall.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitSafeMethodCall(this, context);
    };
    return SafeMethodCall;
}(AST));
var FunctionCall = (function (_super) {
    __extends(FunctionCall, _super);
    /**
     * @param {?} span
     * @param {?} target
     * @param {?} args
     */
    function FunctionCall(span, target, args) {
        var _this = _super.call(this, span) || this;
        _this.target = target;
        _this.args = args;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    FunctionCall.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return visitor.visitFunctionCall(this, context);
    };
    return FunctionCall;
}(AST));
var ASTWithSource = (function (_super) {
    __extends(ASTWithSource, _super);
    /**
     * @param {?} ast
     * @param {?} source
     * @param {?} location
     * @param {?} errors
     */
    function ASTWithSource(ast, source, location, errors) {
        var _this = _super.call(this, new ParseSpan(0, source == null ? 0 : source.length)) || this;
        _this.ast = ast;
        _this.source = source;
        _this.location = location;
        _this.errors = errors;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    ASTWithSource.prototype.visit = function (visitor, context) {
        if (context === void 0) { context = null; }
        return this.ast.visit(visitor, context);
    };
    /**
     * @return {?}
     */
    ASTWithSource.prototype.toString = function () { return this.source + " in " + this.location; };
    return ASTWithSource;
}(AST));
var TemplateBinding = (function () {
    /**
     * @param {?} span
     * @param {?} key
     * @param {?} keyIsVar
     * @param {?} name
     * @param {?} expression
     */
    function TemplateBinding(span, key, keyIsVar, name, expression) {
        this.span = span;
        this.key = key;
        this.keyIsVar = keyIsVar;
        this.name = name;
        this.expression = expression;
    }
    return TemplateBinding;
}());
var RecursiveAstVisitor = (function () {
    function RecursiveAstVisitor() {
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitBinary = function (ast, context) {
        ast.left.visit(this);
        ast.right.visit(this);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitChain = function (ast, context) { return this.visitAll(ast.expressions, context); };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitConditional = function (ast, context) {
        ast.condition.visit(this);
        ast.trueExp.visit(this);
        ast.falseExp.visit(this);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitPipe = function (ast, context) {
        ast.exp.visit(this);
        this.visitAll(ast.args, context);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitFunctionCall = function (ast, context) {
        ((ast.target)).visit(this);
        this.visitAll(ast.args, context);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitImplicitReceiver = function (ast, context) { return null; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitInterpolation = function (ast, context) {
        return this.visitAll(ast.expressions, context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitKeyedRead = function (ast, context) {
        ast.obj.visit(this);
        ast.key.visit(this);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitKeyedWrite = function (ast, context) {
        ast.obj.visit(this);
        ast.key.visit(this);
        ast.value.visit(this);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitLiteralArray = function (ast, context) {
        return this.visitAll(ast.expressions, context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitLiteralMap = function (ast, context) { return this.visitAll(ast.values, context); };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitLiteralPrimitive = function (ast, context) { return null; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitMethodCall = function (ast, context) {
        ast.receiver.visit(this);
        return this.visitAll(ast.args, context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitPrefixNot = function (ast, context) {
        ast.expression.visit(this);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitPropertyRead = function (ast, context) {
        ast.receiver.visit(this);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitPropertyWrite = function (ast, context) {
        ast.receiver.visit(this);
        ast.value.visit(this);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitSafePropertyRead = function (ast, context) {
        ast.receiver.visit(this);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitSafeMethodCall = function (ast, context) {
        ast.receiver.visit(this);
        return this.visitAll(ast.args, context);
    };
    /**
     * @param {?} asts
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitAll = function (asts, context) {
        var _this = this;
        asts.forEach(function (ast) { return ast.visit(_this, context); });
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor.prototype.visitQuote = function (ast, context) { return null; };
    return RecursiveAstVisitor;
}());
var AstTransformer = (function () {
    function AstTransformer() {
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitImplicitReceiver = function (ast, context) { return ast; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitInterpolation = function (ast, context) {
        return new Interpolation(ast.span, ast.strings, this.visitAll(ast.expressions));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitLiteralPrimitive = function (ast, context) {
        return new LiteralPrimitive(ast.span, ast.value);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitPropertyRead = function (ast, context) {
        return new PropertyRead(ast.span, ast.receiver.visit(this), ast.name);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitPropertyWrite = function (ast, context) {
        return new PropertyWrite(ast.span, ast.receiver.visit(this), ast.name, ast.value.visit(this));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitSafePropertyRead = function (ast, context) {
        return new SafePropertyRead(ast.span, ast.receiver.visit(this), ast.name);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitMethodCall = function (ast, context) {
        return new MethodCall(ast.span, ast.receiver.visit(this), ast.name, this.visitAll(ast.args));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitSafeMethodCall = function (ast, context) {
        return new SafeMethodCall(ast.span, ast.receiver.visit(this), ast.name, this.visitAll(ast.args));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitFunctionCall = function (ast, context) {
        return new FunctionCall(ast.span, /** @type {?} */ ((ast.target)).visit(this), this.visitAll(ast.args));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitLiteralArray = function (ast, context) {
        return new LiteralArray(ast.span, this.visitAll(ast.expressions));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitLiteralMap = function (ast, context) {
        return new LiteralMap(ast.span, ast.keys, this.visitAll(ast.values));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitBinary = function (ast, context) {
        return new Binary(ast.span, ast.operation, ast.left.visit(this), ast.right.visit(this));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitPrefixNot = function (ast, context) {
        return new PrefixNot(ast.span, ast.expression.visit(this));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitConditional = function (ast, context) {
        return new Conditional(ast.span, ast.condition.visit(this), ast.trueExp.visit(this), ast.falseExp.visit(this));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitPipe = function (ast, context) {
        return new BindingPipe(ast.span, ast.exp.visit(this), ast.name, this.visitAll(ast.args));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitKeyedRead = function (ast, context) {
        return new KeyedRead(ast.span, ast.obj.visit(this), ast.key.visit(this));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitKeyedWrite = function (ast, context) {
        return new KeyedWrite(ast.span, ast.obj.visit(this), ast.key.visit(this), ast.value.visit(this));
    };
    /**
     * @param {?} asts
     * @return {?}
     */
    AstTransformer.prototype.visitAll = function (asts) {
        var /** @type {?} */ res = new Array(asts.length);
        for (var /** @type {?} */ i = 0; i < asts.length; ++i) {
            res[i] = asts[i].visit(this);
        }
        return res;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitChain = function (ast, context) {
        return new Chain(ast.span, this.visitAll(ast.expressions));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer.prototype.visitQuote = function (ast, context) {
        return new Quote(ast.span, ast.prefix, ast.uninterpretedExpression, ast.location);
    };
    return AstTransformer;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var $EOF = 0;
var $TAB = 9;
var $LF = 10;
var $VTAB = 11;
var $FF = 12;
var $CR = 13;
var $SPACE = 32;
var $BANG = 33;
var $DQ = 34;
var $HASH = 35;
var $$ = 36;
var $PERCENT = 37;
var $AMPERSAND = 38;
var $SQ = 39;
var $LPAREN = 40;
var $RPAREN = 41;
var $STAR = 42;
var $PLUS = 43;
var $COMMA = 44;
var $MINUS = 45;
var $PERIOD = 46;
var $SLASH = 47;
var $COLON = 58;
var $SEMICOLON = 59;
var $LT = 60;
var $EQ = 61;
var $GT = 62;
var $QUESTION = 63;
var $0 = 48;
var $9 = 57;
var $A = 65;
var $E = 69;
var $F = 70;
var $X = 88;
var $Z = 90;
var $LBRACKET = 91;
var $BACKSLASH = 92;
var $RBRACKET = 93;
var $CARET = 94;
var $_ = 95;
var $a = 97;
var $e = 101;
var $f = 102;
var $n = 110;
var $r = 114;
var $t = 116;
var $u = 117;
var $v = 118;
var $x = 120;
var $z = 122;
var $LBRACE = 123;
var $BAR = 124;
var $RBRACE = 125;
var $NBSP = 160;
var $BT = 96;
/**
 * @param {?} code
 * @return {?}
 */
function isWhitespace(code) {
    return (code >= $TAB && code <= $SPACE) || (code == $NBSP);
}
/**
 * @param {?} code
 * @return {?}
 */
function isDigit(code) {
    return $0 <= code && code <= $9;
}
/**
 * @param {?} code
 * @return {?}
 */
function isAsciiLetter(code) {
    return code >= $a && code <= $z || code >= $A && code <= $Z;
}
/**
 * @param {?} code
 * @return {?}
 */
function isAsciiHexDigit(code) {
    return code >= $a && code <= $f || code >= $A && code <= $F || isDigit(code);
}
/**
 * A replacement for \@Injectable to be used in the compiler, so that
 * we don't try to evaluate the metadata in the compiler during AoT.
 * This decorator is enough to make the compiler work with the ReflectiveInjector though.
 * \@Annotation
 * @return {?}
 */
function CompilerInjectable() {
    return function (x) { return x; };
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @param {?} identifier
 * @param {?} value
 * @return {?}
 */
function assertArrayOfStrings(identifier, value) {
    if (!isDevMode() || value == null) {
        return;
    }
    if (!Array.isArray(value)) {
        throw new Error("Expected '" + identifier + "' to be an array of strings.");
    }
    for (var /** @type {?} */ i = 0; i < value.length; i += 1) {
        if (typeof value[i] !== 'string') {
            throw new Error("Expected '" + identifier + "' to be an array of strings.");
        }
    }
}
var INTERPOLATION_BLACKLIST_REGEXPS = [
    /^\s*$/,
    /[<>]/,
    /^[{}]$/,
    /&(#|[a-z])/i,
    /^\/\//,
];
/**
 * @param {?} identifier
 * @param {?} value
 * @return {?}
 */
function assertInterpolationSymbols(identifier, value) {
    if (value != null && !(Array.isArray(value) && value.length == 2)) {
        throw new Error("Expected '" + identifier + "' to be an array, [start, end].");
    }
    else if (isDevMode() && value != null) {
        var /** @type {?} */ start_1 = (value[0]);
        var /** @type {?} */ end_1 = (value[1]);
        // black list checking
        INTERPOLATION_BLACKLIST_REGEXPS.forEach(function (regexp) {
            if (regexp.test(start_1) || regexp.test(end_1)) {
                throw new Error("['" + start_1 + "', '" + end_1 + "'] contains unusable interpolation symbol.");
            }
        });
    }
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var InterpolationConfig = (function () {
    /**
     * @param {?} start
     * @param {?} end
     */
    function InterpolationConfig(start, end) {
        this.start = start;
        this.end = end;
    }
    /**
     * @param {?} markers
     * @return {?}
     */
    InterpolationConfig.fromArray = function (markers) {
        if (!markers) {
            return DEFAULT_INTERPOLATION_CONFIG;
        }
        assertInterpolationSymbols('interpolation', markers);
        return new InterpolationConfig(markers[0], markers[1]);
    };
    ;
    return InterpolationConfig;
}());
var DEFAULT_INTERPOLATION_CONFIG = new InterpolationConfig('{{', '}}');
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var TokenType = {};
TokenType.Character = 0;
TokenType.Identifier = 1;
TokenType.Keyword = 2;
TokenType.String = 3;
TokenType.Operator = 4;
TokenType.Number = 5;
TokenType.Error = 6;
TokenType[TokenType.Character] = "Character";
TokenType[TokenType.Identifier] = "Identifier";
TokenType[TokenType.Keyword] = "Keyword";
TokenType[TokenType.String] = "String";
TokenType[TokenType.Operator] = "Operator";
TokenType[TokenType.Number] = "Number";
TokenType[TokenType.Error] = "Error";
var KEYWORDS = ['var', 'let', 'as', 'null', 'undefined', 'true', 'false', 'if', 'else', 'this'];
var Lexer = (function () {
    function Lexer() {
    }
    /**
     * @param {?} text
     * @return {?}
     */
    Lexer.prototype.tokenize = function (text) {
        var /** @type {?} */ scanner = new _Scanner(text);
        var /** @type {?} */ tokens = [];
        var /** @type {?} */ token = scanner.scanToken();
        while (token != null) {
            tokens.push(token);
            token = scanner.scanToken();
        }
        return tokens;
    };
    return Lexer;
}());
Lexer.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
Lexer.ctorParameters = function () { return []; };
var Token = (function () {
    /**
     * @param {?} index
     * @param {?} type
     * @param {?} numValue
     * @param {?} strValue
     */
    function Token(index, type, numValue, strValue) {
        this.index = index;
        this.type = type;
        this.numValue = numValue;
        this.strValue = strValue;
    }
    /**
     * @param {?} code
     * @return {?}
     */
    Token.prototype.isCharacter = function (code) {
        return this.type == TokenType.Character && this.numValue == code;
    };
    /**
     * @return {?}
     */
    Token.prototype.isNumber = function () { return this.type == TokenType.Number; };
    /**
     * @return {?}
     */
    Token.prototype.isString = function () { return this.type == TokenType.String; };
    /**
     * @param {?} operater
     * @return {?}
     */
    Token.prototype.isOperator = function (operater) {
        return this.type == TokenType.Operator && this.strValue == operater;
    };
    /**
     * @return {?}
     */
    Token.prototype.isIdentifier = function () { return this.type == TokenType.Identifier; };
    /**
     * @return {?}
     */
    Token.prototype.isKeyword = function () { return this.type == TokenType.Keyword; };
    /**
     * @return {?}
     */
    Token.prototype.isKeywordLet = function () { return this.type == TokenType.Keyword && this.strValue == 'let'; };
    /**
     * @return {?}
     */
    Token.prototype.isKeywordAs = function () { return this.type == TokenType.Keyword && this.strValue == 'as'; };
    /**
     * @return {?}
     */
    Token.prototype.isKeywordNull = function () { return this.type == TokenType.Keyword && this.strValue == 'null'; };
    /**
     * @return {?}
     */
    Token.prototype.isKeywordUndefined = function () {
        return this.type == TokenType.Keyword && this.strValue == 'undefined';
    };
    /**
     * @return {?}
     */
    Token.prototype.isKeywordTrue = function () { return this.type == TokenType.Keyword && this.strValue == 'true'; };
    /**
     * @return {?}
     */
    Token.prototype.isKeywordFalse = function () { return this.type == TokenType.Keyword && this.strValue == 'false'; };
    /**
     * @return {?}
     */
    Token.prototype.isKeywordThis = function () { return this.type == TokenType.Keyword && this.strValue == 'this'; };
    /**
     * @return {?}
     */
    Token.prototype.isError = function () { return this.type == TokenType.Error; };
    /**
     * @return {?}
     */
    Token.prototype.toNumber = function () { return this.type == TokenType.Number ? this.numValue : -1; };
    /**
     * @return {?}
     */
    Token.prototype.toString = function () {
        switch (this.type) {
            case TokenType.Character:
            case TokenType.Identifier:
            case TokenType.Keyword:
            case TokenType.Operator:
            case TokenType.String:
            case TokenType.Error:
                return this.strValue;
            case TokenType.Number:
                return this.numValue.toString();
            default:
                return null;
        }
    };
    return Token;
}());
/**
 * @param {?} index
 * @param {?} code
 * @return {?}
 */
function newCharacterToken(index, code) {
    return new Token(index, TokenType.Character, code, String.fromCharCode(code));
}
/**
 * @param {?} index
 * @param {?} text
 * @return {?}
 */
function newIdentifierToken(index, text) {
    return new Token(index, TokenType.Identifier, 0, text);
}
/**
 * @param {?} index
 * @param {?} text
 * @return {?}
 */
function newKeywordToken(index, text) {
    return new Token(index, TokenType.Keyword, 0, text);
}
/**
 * @param {?} index
 * @param {?} text
 * @return {?}
 */
function newOperatorToken(index, text) {
    return new Token(index, TokenType.Operator, 0, text);
}
/**
 * @param {?} index
 * @param {?} text
 * @return {?}
 */
function newStringToken(index, text) {
    return new Token(index, TokenType.String, 0, text);
}
/**
 * @param {?} index
 * @param {?} n
 * @return {?}
 */
function newNumberToken(index, n) {
    return new Token(index, TokenType.Number, n, '');
}
/**
 * @param {?} index
 * @param {?} message
 * @return {?}
 */
function newErrorToken(index, message) {
    return new Token(index, TokenType.Error, 0, message);
}
var EOF = new Token(-1, TokenType.Character, 0, '');
var _Scanner = (function () {
    /**
     * @param {?} input
     */
    function _Scanner(input) {
        this.input = input;
        this.peek = 0;
        this.index = -1;
        this.length = input.length;
        this.advance();
    }
    /**
     * @return {?}
     */
    _Scanner.prototype.advance = function () {
        this.peek = ++this.index >= this.length ? $EOF : this.input.charCodeAt(this.index);
    };
    /**
     * @return {?}
     */
    _Scanner.prototype.scanToken = function () {
        var /** @type {?} */ input = this.input, /** @type {?} */ length = this.length;
        var /** @type {?} */ peek = this.peek, /** @type {?} */ index = this.index;
        // Skip whitespace.
        while (peek <= $SPACE) {
            if (++index >= length) {
                peek = $EOF;
                break;
            }
            else {
                peek = input.charCodeAt(index);
            }
        }
        this.peek = peek;
        this.index = index;
        if (index >= length) {
            return null;
        }
        // Handle identifiers and numbers.
        if (isIdentifierStart(peek))
            return this.scanIdentifier();
        if (isDigit(peek))
            return this.scanNumber(index);
        var /** @type {?} */ start = index;
        switch (peek) {
            case $PERIOD:
                this.advance();
                return isDigit(this.peek) ? this.scanNumber(start) :
                    newCharacterToken(start, $PERIOD);
            case $LPAREN:
            case $RPAREN:
            case $LBRACE:
            case $RBRACE:
            case $LBRACKET:
            case $RBRACKET:
            case $COMMA:
            case $COLON:
            case $SEMICOLON:
                return this.scanCharacter(start, peek);
            case $SQ:
            case $DQ:
                return this.scanString();
            case $HASH:
            case $PLUS:
            case $MINUS:
            case $STAR:
            case $SLASH:
            case $PERCENT:
            case $CARET:
                return this.scanOperator(start, String.fromCharCode(peek));
            case $QUESTION:
                return this.scanComplexOperator(start, '?', $PERIOD, '.');
            case $LT:
            case $GT:
                return this.scanComplexOperator(start, String.fromCharCode(peek), $EQ, '=');
            case $BANG:
            case $EQ:
                return this.scanComplexOperator(start, String.fromCharCode(peek), $EQ, '=', $EQ, '=');
            case $AMPERSAND:
                return this.scanComplexOperator(start, '&', $AMPERSAND, '&');
            case $BAR:
                return this.scanComplexOperator(start, '|', $BAR, '|');
            case $NBSP:
                while (isWhitespace(this.peek))
                    this.advance();
                return this.scanToken();
        }
        this.advance();
        return this.error("Unexpected character [" + String.fromCharCode(peek) + "]", 0);
    };
    /**
     * @param {?} start
     * @param {?} code
     * @return {?}
     */
    _Scanner.prototype.scanCharacter = function (start, code) {
        this.advance();
        return newCharacterToken(start, code);
    };
    /**
     * @param {?} start
     * @param {?} str
     * @return {?}
     */
    _Scanner.prototype.scanOperator = function (start, str) {
        this.advance();
        return newOperatorToken(start, str);
    };
    /**
     * Tokenize a 2/3 char long operator
     *
     * @param {?} start start index in the expression
     * @param {?} one first symbol (always part of the operator)
     * @param {?} twoCode code point for the second symbol
     * @param {?} two second symbol (part of the operator when the second code point matches)
     * @param {?=} threeCode code point for the third symbol
     * @param {?=} three third symbol (part of the operator when provided and matches source expression)
     * @return {?}
     */
    _Scanner.prototype.scanComplexOperator = function (start, one, twoCode, two, threeCode, three) {
        this.advance();
        var /** @type {?} */ str = one;
        if (this.peek == twoCode) {
            this.advance();
            str += two;
        }
        if (threeCode != null && this.peek == threeCode) {
            this.advance();
            str += three;
        }
        return newOperatorToken(start, str);
    };
    /**
     * @return {?}
     */
    _Scanner.prototype.scanIdentifier = function () {
        var /** @type {?} */ start = this.index;
        this.advance();
        while (isIdentifierPart(this.peek))
            this.advance();
        var /** @type {?} */ str = this.input.substring(start, this.index);
        return KEYWORDS.indexOf(str) > -1 ? newKeywordToken(start, str) :
            newIdentifierToken(start, str);
    };
    /**
     * @param {?} start
     * @return {?}
     */
    _Scanner.prototype.scanNumber = function (start) {
        var /** @type {?} */ simple = (this.index === start);
        this.advance(); // Skip initial digit.
        while (true) {
            if (isDigit(this.peek)) {
            }
            else if (this.peek == $PERIOD) {
                simple = false;
            }
            else if (isExponentStart(this.peek)) {
                this.advance();
                if (isExponentSign(this.peek))
                    this.advance();
                if (!isDigit(this.peek))
                    return this.error('Invalid exponent', -1);
                simple = false;
            }
            else {
                break;
            }
            this.advance();
        }
        var /** @type {?} */ str = this.input.substring(start, this.index);
        var /** @type {?} */ value = simple ? parseIntAutoRadix(str) : parseFloat(str);
        return newNumberToken(start, value);
    };
    /**
     * @return {?}
     */
    _Scanner.prototype.scanString = function () {
        var /** @type {?} */ start = this.index;
        var /** @type {?} */ quote = this.peek;
        this.advance(); // Skip initial quote.
        var /** @type {?} */ buffer = '';
        var /** @type {?} */ marker = this.index;
        var /** @type {?} */ input = this.input;
        while (this.peek != quote) {
            if (this.peek == $BACKSLASH) {
                buffer += input.substring(marker, this.index);
                this.advance();
                var /** @type {?} */ unescapedCode = void 0;
                // Workaround for TS2.1-introduced type strictness
                this.peek = this.peek;
                if (this.peek == $u) {
                    // 4 character hex code for unicode character.
                    var /** @type {?} */ hex = input.substring(this.index + 1, this.index + 5);
                    if (/^[0-9a-f]+$/i.test(hex)) {
                        unescapedCode = parseInt(hex, 16);
                    }
                    else {
                        return this.error("Invalid unicode escape [\\u" + hex + "]", 0);
                    }
                    for (var /** @type {?} */ i = 0; i < 5; i++) {
                        this.advance();
                    }
                }
                else {
                    unescapedCode = unescape(this.peek);
                    this.advance();
                }
                buffer += String.fromCharCode(unescapedCode);
                marker = this.index;
            }
            else if (this.peek == $EOF) {
                return this.error('Unterminated quote', 0);
            }
            else {
                this.advance();
            }
        }
        var /** @type {?} */ last = input.substring(marker, this.index);
        this.advance(); // Skip terminating quote.
        return newStringToken(start, buffer + last);
    };
    /**
     * @param {?} message
     * @param {?} offset
     * @return {?}
     */
    _Scanner.prototype.error = function (message, offset) {
        var /** @type {?} */ position = this.index + offset;
        return newErrorToken(position, "Lexer Error: " + message + " at column " + position + " in expression [" + this.input + "]");
    };
    return _Scanner;
}());
/**
 * @param {?} code
 * @return {?}
 */
function isIdentifierStart(code) {
    return ($a <= code && code <= $z) || ($A <= code && code <= $Z) ||
        (code == $_) || (code == $$);
}
/**
 * @param {?} input
 * @return {?}
 */
function isIdentifier(input) {
    if (input.length == 0)
        return false;
    var /** @type {?} */ scanner = new _Scanner(input);
    if (!isIdentifierStart(scanner.peek))
        return false;
    scanner.advance();
    while (scanner.peek !== $EOF) {
        if (!isIdentifierPart(scanner.peek))
            return false;
        scanner.advance();
    }
    return true;
}
/**
 * @param {?} code
 * @return {?}
 */
function isIdentifierPart(code) {
    return isAsciiLetter(code) || isDigit(code) || (code == $_) ||
        (code == $$);
}
/**
 * @param {?} code
 * @return {?}
 */
function isExponentStart(code) {
    return code == $e || code == $E;
}
/**
 * @param {?} code
 * @return {?}
 */
function isExponentSign(code) {
    return code == $MINUS || code == $PLUS;
}
/**
 * @param {?} code
 * @return {?}
 */
function isQuote(code) {
    return code === $SQ || code === $DQ || code === $BT;
}
/**
 * @param {?} code
 * @return {?}
 */
function unescape(code) {
    switch (code) {
        case $n:
            return $LF;
        case $f:
            return $FF;
        case $r:
            return $CR;
        case $t:
            return $TAB;
        case $v:
            return $VTAB;
        default:
            return code;
    }
}
/**
 * @param {?} text
 * @return {?}
 */
function parseIntAutoRadix(text) {
    var /** @type {?} */ result = parseInt(text);
    if (isNaN(result)) {
        throw new Error('Invalid integer literal when parsing ' + text);
    }
    return result;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var SplitInterpolation = (function () {
    /**
     * @param {?} strings
     * @param {?} expressions
     * @param {?} offsets
     */
    function SplitInterpolation(strings, expressions, offsets) {
        this.strings = strings;
        this.expressions = expressions;
        this.offsets = offsets;
    }
    return SplitInterpolation;
}());
var TemplateBindingParseResult = (function () {
    /**
     * @param {?} templateBindings
     * @param {?} warnings
     * @param {?} errors
     */
    function TemplateBindingParseResult(templateBindings, warnings, errors) {
        this.templateBindings = templateBindings;
        this.warnings = warnings;
        this.errors = errors;
    }
    return TemplateBindingParseResult;
}());
/**
 * @param {?} config
 * @return {?}
 */
function _createInterpolateRegExp(config) {
    var /** @type {?} */ pattern = escapeRegExp(config.start) + '([\\s\\S]*?)' + escapeRegExp(config.end);
    return new RegExp(pattern, 'g');
}
var Parser = (function () {
    /**
     * @param {?} _lexer
     */
    function Parser(_lexer) {
        this._lexer = _lexer;
        this.errors = [];
    }
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    Parser.prototype.parseAction = function (input, location, interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        this._checkNoInterpolation(input, location, interpolationConfig);
        var /** @type {?} */ sourceToLex = this._stripComments(input);
        var /** @type {?} */ tokens = this._lexer.tokenize(this._stripComments(input));
        var /** @type {?} */ ast = new _ParseAST(input, location, tokens, sourceToLex.length, true, this.errors, input.length - sourceToLex.length)
            .parseChain();
        return new ASTWithSource(ast, input, location, this.errors);
    };
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    Parser.prototype.parseBinding = function (input, location, interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        var /** @type {?} */ ast = this._parseBindingAst(input, location, interpolationConfig);
        return new ASTWithSource(ast, input, location, this.errors);
    };
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    Parser.prototype.parseSimpleBinding = function (input, location, interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        var /** @type {?} */ ast = this._parseBindingAst(input, location, interpolationConfig);
        var /** @type {?} */ errors = SimpleExpressionChecker.check(ast);
        if (errors.length > 0) {
            this._reportError("Host binding expression cannot contain " + errors.join(' '), input, location);
        }
        return new ASTWithSource(ast, input, location, this.errors);
    };
    /**
     * @param {?} message
     * @param {?} input
     * @param {?} errLocation
     * @param {?=} ctxLocation
     * @return {?}
     */
    Parser.prototype._reportError = function (message, input, errLocation, ctxLocation) {
        this.errors.push(new ParserError(message, input, errLocation, ctxLocation));
    };
    /**
     * @param {?} input
     * @param {?} location
     * @param {?} interpolationConfig
     * @return {?}
     */
    Parser.prototype._parseBindingAst = function (input, location, interpolationConfig) {
        // Quotes expressions use 3rd-party expression language. We don't want to use
        // our lexer or parser for that, so we check for that ahead of time.
        var /** @type {?} */ quote = this._parseQuote(input, location);
        if (quote != null) {
            return quote;
        }
        this._checkNoInterpolation(input, location, interpolationConfig);
        var /** @type {?} */ sourceToLex = this._stripComments(input);
        var /** @type {?} */ tokens = this._lexer.tokenize(sourceToLex);
        return new _ParseAST(input, location, tokens, sourceToLex.length, false, this.errors, input.length - sourceToLex.length)
            .parseChain();
    };
    /**
     * @param {?} input
     * @param {?} location
     * @return {?}
     */
    Parser.prototype._parseQuote = function (input, location) {
        if (input == null)
            return null;
        var /** @type {?} */ prefixSeparatorIndex = input.indexOf(':');
        if (prefixSeparatorIndex == -1)
            return null;
        var /** @type {?} */ prefix = input.substring(0, prefixSeparatorIndex).trim();
        if (!isIdentifier(prefix))
            return null;
        var /** @type {?} */ uninterpretedExpression = input.substring(prefixSeparatorIndex + 1);
        return new Quote(new ParseSpan(0, input.length), prefix, uninterpretedExpression, location);
    };
    /**
     * @param {?} prefixToken
     * @param {?} input
     * @param {?} location
     * @return {?}
     */
    Parser.prototype.parseTemplateBindings = function (prefixToken, input, location) {
        var /** @type {?} */ tokens = this._lexer.tokenize(input);
        if (prefixToken) {
            // Prefix the tokens with the tokens from prefixToken but have them take no space (0 index).
            var /** @type {?} */ prefixTokens = this._lexer.tokenize(prefixToken).map(function (t) {
                t.index = 0;
                return t;
            });
            tokens.unshift.apply(tokens, prefixTokens);
        }
        return new _ParseAST(input, location, tokens, input.length, false, this.errors, 0)
            .parseTemplateBindings();
    };
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    Parser.prototype.parseInterpolation = function (input, location, interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        var /** @type {?} */ split = this.splitInterpolation(input, location, interpolationConfig);
        if (split == null)
            return null;
        var /** @type {?} */ expressions = [];
        for (var /** @type {?} */ i = 0; i < split.expressions.length; ++i) {
            var /** @type {?} */ expressionText = split.expressions[i];
            var /** @type {?} */ sourceToLex = this._stripComments(expressionText);
            var /** @type {?} */ tokens = this._lexer.tokenize(this._stripComments(split.expressions[i]));
            var /** @type {?} */ ast = new _ParseAST(input, location, tokens, sourceToLex.length, false, this.errors, split.offsets[i] + (expressionText.length - sourceToLex.length))
                .parseChain();
            expressions.push(ast);
        }
        return new ASTWithSource(new Interpolation(new ParseSpan(0, input == null ? 0 : input.length), split.strings, expressions), input, location, this.errors);
    };
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    Parser.prototype.splitInterpolation = function (input, location, interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        var /** @type {?} */ regexp = _createInterpolateRegExp(interpolationConfig);
        var /** @type {?} */ parts = input.split(regexp);
        if (parts.length <= 1) {
            return null;
        }
        var /** @type {?} */ strings = [];
        var /** @type {?} */ expressions = [];
        var /** @type {?} */ offsets = [];
        var /** @type {?} */ offset = 0;
        for (var /** @type {?} */ i = 0; i < parts.length; i++) {
            var /** @type {?} */ part = parts[i];
            if (i % 2 === 0) {
                // fixed string
                strings.push(part);
                offset += part.length;
            }
            else if (part.trim().length > 0) {
                offset += interpolationConfig.start.length;
                expressions.push(part);
                offsets.push(offset);
                offset += part.length + interpolationConfig.end.length;
            }
            else {
                this._reportError('Blank expressions are not allowed in interpolated strings', input, "at column " + this._findInterpolationErrorColumn(parts, i, interpolationConfig) + " in", location);
                expressions.push('$implict');
                offsets.push(offset);
            }
        }
        return new SplitInterpolation(strings, expressions, offsets);
    };
    /**
     * @param {?} input
     * @param {?} location
     * @return {?}
     */
    Parser.prototype.wrapLiteralPrimitive = function (input, location) {
        return new ASTWithSource(new LiteralPrimitive(new ParseSpan(0, input == null ? 0 : input.length), input), input, location, this.errors);
    };
    /**
     * @param {?} input
     * @return {?}
     */
    Parser.prototype._stripComments = function (input) {
        var /** @type {?} */ i = this._commentStart(input);
        return i != null ? input.substring(0, i).trim() : input;
    };
    /**
     * @param {?} input
     * @return {?}
     */
    Parser.prototype._commentStart = function (input) {
        var /** @type {?} */ outerQuote = null;
        for (var /** @type {?} */ i = 0; i < input.length - 1; i++) {
            var /** @type {?} */ char = input.charCodeAt(i);
            var /** @type {?} */ nextChar = input.charCodeAt(i + 1);
            if (char === $SLASH && nextChar == $SLASH && outerQuote == null)
                return i;
            if (outerQuote === char) {
                outerQuote = null;
            }
            else if (outerQuote == null && isQuote(char)) {
                outerQuote = char;
            }
        }
        return null;
    };
    /**
     * @param {?} input
     * @param {?} location
     * @param {?} interpolationConfig
     * @return {?}
     */
    Parser.prototype._checkNoInterpolation = function (input, location, interpolationConfig) {
        var /** @type {?} */ regexp = _createInterpolateRegExp(interpolationConfig);
        var /** @type {?} */ parts = input.split(regexp);
        if (parts.length > 1) {
            this._reportError("Got interpolation (" + interpolationConfig.start + interpolationConfig.end + ") where expression was expected", input, "at column " + this._findInterpolationErrorColumn(parts, 1, interpolationConfig) + " in", location);
        }
    };
    /**
     * @param {?} parts
     * @param {?} partInErrIdx
     * @param {?} interpolationConfig
     * @return {?}
     */
    Parser.prototype._findInterpolationErrorColumn = function (parts, partInErrIdx, interpolationConfig) {
        var /** @type {?} */ errLocation = '';
        for (var /** @type {?} */ j = 0; j < partInErrIdx; j++) {
            errLocation += j % 2 === 0 ?
                parts[j] :
                "" + interpolationConfig.start + parts[j] + interpolationConfig.end;
        }
        return errLocation.length;
    };
    return Parser;
}());
Parser.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
Parser.ctorParameters = function () { return [
    { type: Lexer, },
]; };
var _ParseAST = (function () {
    /**
     * @param {?} input
     * @param {?} location
     * @param {?} tokens
     * @param {?} inputLength
     * @param {?} parseAction
     * @param {?} errors
     * @param {?} offset
     */
    function _ParseAST(input, location, tokens, inputLength, parseAction, errors, offset) {
        this.input = input;
        this.location = location;
        this.tokens = tokens;
        this.inputLength = inputLength;
        this.parseAction = parseAction;
        this.errors = errors;
        this.offset = offset;
        this.rparensExpected = 0;
        this.rbracketsExpected = 0;
        this.rbracesExpected = 0;
        this.index = 0;
    }
    /**
     * @param {?} offset
     * @return {?}
     */
    _ParseAST.prototype.peek = function (offset) {
        var /** @type {?} */ i = this.index + offset;
        return i < this.tokens.length ? this.tokens[i] : EOF;
    };
    Object.defineProperty(_ParseAST.prototype, "next", {
        /**
         * @return {?}
         */
        get: function () { return this.peek(0); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_ParseAST.prototype, "inputIndex", {
        /**
         * @return {?}
         */
        get: function () {
            return (this.index < this.tokens.length) ? this.next.index + this.offset :
                this.inputLength + this.offset;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} start
     * @return {?}
     */
    _ParseAST.prototype.span = function (start) { return new ParseSpan(start, this.inputIndex); };
    /**
     * @return {?}
     */
    _ParseAST.prototype.advance = function () { this.index++; };
    /**
     * @param {?} code
     * @return {?}
     */
    _ParseAST.prototype.optionalCharacter = function (code) {
        if (this.next.isCharacter(code)) {
            this.advance();
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.peekKeywordLet = function () { return this.next.isKeywordLet(); };
    /**
     * @return {?}
     */
    _ParseAST.prototype.peekKeywordAs = function () { return this.next.isKeywordAs(); };
    /**
     * @param {?} code
     * @return {?}
     */
    _ParseAST.prototype.expectCharacter = function (code) {
        if (this.optionalCharacter(code))
            return;
        this.error("Missing expected " + String.fromCharCode(code));
    };
    /**
     * @param {?} op
     * @return {?}
     */
    _ParseAST.prototype.optionalOperator = function (op) {
        if (this.next.isOperator(op)) {
            this.advance();
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * @param {?} operator
     * @return {?}
     */
    _ParseAST.prototype.expectOperator = function (operator) {
        if (this.optionalOperator(operator))
            return;
        this.error("Missing expected operator " + operator);
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.expectIdentifierOrKeyword = function () {
        var /** @type {?} */ n = this.next;
        if (!n.isIdentifier() && !n.isKeyword()) {
            this.error("Unexpected token " + n + ", expected identifier or keyword");
            return '';
        }
        this.advance();
        return n.toString();
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.expectIdentifierOrKeywordOrString = function () {
        var /** @type {?} */ n = this.next;
        if (!n.isIdentifier() && !n.isKeyword() && !n.isString()) {
            this.error("Unexpected token " + n + ", expected identifier, keyword, or string");
            return '';
        }
        this.advance();
        return n.toString();
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseChain = function () {
        var /** @type {?} */ exprs = [];
        var /** @type {?} */ start = this.inputIndex;
        while (this.index < this.tokens.length) {
            var /** @type {?} */ expr = this.parsePipe();
            exprs.push(expr);
            if (this.optionalCharacter($SEMICOLON)) {
                if (!this.parseAction) {
                    this.error('Binding expression cannot contain chained expression');
                }
                while (this.optionalCharacter($SEMICOLON)) {
                } // read all semicolons
            }
            else if (this.index < this.tokens.length) {
                this.error("Unexpected token '" + this.next + "'");
            }
        }
        if (exprs.length == 0)
            return new EmptyExpr(this.span(start));
        if (exprs.length == 1)
            return exprs[0];
        return new Chain(this.span(start), exprs);
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parsePipe = function () {
        var /** @type {?} */ result = this.parseExpression();
        if (this.optionalOperator('|')) {
            if (this.parseAction) {
                this.error('Cannot have a pipe in an action expression');
            }
            do {
                var /** @type {?} */ name = ((this.expectIdentifierOrKeyword()));
                var /** @type {?} */ args = [];
                while (this.optionalCharacter($COLON)) {
                    args.push(this.parseExpression());
                }
                result = new BindingPipe(this.span(result.span.start), result, name, args);
            } while (this.optionalOperator('|'));
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseExpression = function () { return this.parseConditional(); };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseConditional = function () {
        var /** @type {?} */ start = this.inputIndex;
        var /** @type {?} */ result = this.parseLogicalOr();
        if (this.optionalOperator('?')) {
            var /** @type {?} */ yes = this.parsePipe();
            var /** @type {?} */ no = void 0;
            if (!this.optionalCharacter($COLON)) {
                var /** @type {?} */ end = this.inputIndex;
                var /** @type {?} */ expression = this.input.substring(start, end);
                this.error("Conditional expression " + expression + " requires all 3 expressions");
                no = new EmptyExpr(this.span(start));
            }
            else {
                no = this.parsePipe();
            }
            return new Conditional(this.span(start), result, yes, no);
        }
        else {
            return result;
        }
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseLogicalOr = function () {
        // '||'
        var /** @type {?} */ result = this.parseLogicalAnd();
        while (this.optionalOperator('||')) {
            var /** @type {?} */ right = this.parseLogicalAnd();
            result = new Binary(this.span(result.span.start), '||', result, right);
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseLogicalAnd = function () {
        // '&&'
        var /** @type {?} */ result = this.parseEquality();
        while (this.optionalOperator('&&')) {
            var /** @type {?} */ right = this.parseEquality();
            result = new Binary(this.span(result.span.start), '&&', result, right);
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseEquality = function () {
        // '==','!=','===','!=='
        var /** @type {?} */ result = this.parseRelational();
        while (this.next.type == TokenType.Operator) {
            var /** @type {?} */ operator = this.next.strValue;
            switch (operator) {
                case '==':
                case '===':
                case '!=':
                case '!==':
                    this.advance();
                    var /** @type {?} */ right = this.parseRelational();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseRelational = function () {
        // '<', '>', '<=', '>='
        var /** @type {?} */ result = this.parseAdditive();
        while (this.next.type == TokenType.Operator) {
            var /** @type {?} */ operator = this.next.strValue;
            switch (operator) {
                case '<':
                case '>':
                case '<=':
                case '>=':
                    this.advance();
                    var /** @type {?} */ right = this.parseAdditive();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseAdditive = function () {
        // '+', '-'
        var /** @type {?} */ result = this.parseMultiplicative();
        while (this.next.type == TokenType.Operator) {
            var /** @type {?} */ operator = this.next.strValue;
            switch (operator) {
                case '+':
                case '-':
                    this.advance();
                    var /** @type {?} */ right = this.parseMultiplicative();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseMultiplicative = function () {
        // '*', '%', '/'
        var /** @type {?} */ result = this.parsePrefix();
        while (this.next.type == TokenType.Operator) {
            var /** @type {?} */ operator = this.next.strValue;
            switch (operator) {
                case '*':
                case '%':
                case '/':
                    this.advance();
                    var /** @type {?} */ right = this.parsePrefix();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parsePrefix = function () {
        if (this.next.type == TokenType.Operator) {
            var /** @type {?} */ start = this.inputIndex;
            var /** @type {?} */ operator = this.next.strValue;
            var /** @type {?} */ result = void 0;
            switch (operator) {
                case '+':
                    this.advance();
                    return this.parsePrefix();
                case '-':
                    this.advance();
                    result = this.parsePrefix();
                    return new Binary(this.span(start), operator, new LiteralPrimitive(new ParseSpan(start, start), 0), result);
                case '!':
                    this.advance();
                    result = this.parsePrefix();
                    return new PrefixNot(this.span(start), result);
            }
        }
        return this.parseCallChain();
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseCallChain = function () {
        var /** @type {?} */ result = this.parsePrimary();
        while (true) {
            if (this.optionalCharacter($PERIOD)) {
                result = this.parseAccessMemberOrMethodCall(result, false);
            }
            else if (this.optionalOperator('?.')) {
                result = this.parseAccessMemberOrMethodCall(result, true);
            }
            else if (this.optionalCharacter($LBRACKET)) {
                this.rbracketsExpected++;
                var /** @type {?} */ key = this.parsePipe();
                this.rbracketsExpected--;
                this.expectCharacter($RBRACKET);
                if (this.optionalOperator('=')) {
                    var /** @type {?} */ value = this.parseConditional();
                    result = new KeyedWrite(this.span(result.span.start), result, key, value);
                }
                else {
                    result = new KeyedRead(this.span(result.span.start), result, key);
                }
            }
            else if (this.optionalCharacter($LPAREN)) {
                this.rparensExpected++;
                var /** @type {?} */ args = this.parseCallArguments();
                this.rparensExpected--;
                this.expectCharacter($RPAREN);
                result = new FunctionCall(this.span(result.span.start), result, args);
            }
            else {
                return result;
            }
        }
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parsePrimary = function () {
        var /** @type {?} */ start = this.inputIndex;
        if (this.optionalCharacter($LPAREN)) {
            this.rparensExpected++;
            var /** @type {?} */ result = this.parsePipe();
            this.rparensExpected--;
            this.expectCharacter($RPAREN);
            return result;
        }
        else if (this.next.isKeywordNull()) {
            this.advance();
            return new LiteralPrimitive(this.span(start), null);
        }
        else if (this.next.isKeywordUndefined()) {
            this.advance();
            return new LiteralPrimitive(this.span(start), void 0);
        }
        else if (this.next.isKeywordTrue()) {
            this.advance();
            return new LiteralPrimitive(this.span(start), true);
        }
        else if (this.next.isKeywordFalse()) {
            this.advance();
            return new LiteralPrimitive(this.span(start), false);
        }
        else if (this.next.isKeywordThis()) {
            this.advance();
            return new ImplicitReceiver(this.span(start));
        }
        else if (this.optionalCharacter($LBRACKET)) {
            this.rbracketsExpected++;
            var /** @type {?} */ elements = this.parseExpressionList($RBRACKET);
            this.rbracketsExpected--;
            this.expectCharacter($RBRACKET);
            return new LiteralArray(this.span(start), elements);
        }
        else if (this.next.isCharacter($LBRACE)) {
            return this.parseLiteralMap();
        }
        else if (this.next.isIdentifier()) {
            return this.parseAccessMemberOrMethodCall(new ImplicitReceiver(this.span(start)), false);
        }
        else if (this.next.isNumber()) {
            var /** @type {?} */ value = this.next.toNumber();
            this.advance();
            return new LiteralPrimitive(this.span(start), value);
        }
        else if (this.next.isString()) {
            var /** @type {?} */ literalValue = this.next.toString();
            this.advance();
            return new LiteralPrimitive(this.span(start), literalValue);
        }
        else if (this.index >= this.tokens.length) {
            this.error("Unexpected end of expression: " + this.input);
            return new EmptyExpr(this.span(start));
        }
        else {
            this.error("Unexpected token " + this.next);
            return new EmptyExpr(this.span(start));
        }
    };
    /**
     * @param {?} terminator
     * @return {?}
     */
    _ParseAST.prototype.parseExpressionList = function (terminator) {
        var /** @type {?} */ result = [];
        if (!this.next.isCharacter(terminator)) {
            do {
                result.push(this.parsePipe());
            } while (this.optionalCharacter($COMMA));
        }
        return result;
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseLiteralMap = function () {
        var /** @type {?} */ keys = [];
        var /** @type {?} */ values = [];
        var /** @type {?} */ start = this.inputIndex;
        this.expectCharacter($LBRACE);
        if (!this.optionalCharacter($RBRACE)) {
            this.rbracesExpected++;
            do {
                var /** @type {?} */ key = ((this.expectIdentifierOrKeywordOrString()));
                keys.push(key);
                this.expectCharacter($COLON);
                values.push(this.parsePipe());
            } while (this.optionalCharacter($COMMA));
            this.rbracesExpected--;
            this.expectCharacter($RBRACE);
        }
        return new LiteralMap(this.span(start), keys, values);
    };
    /**
     * @param {?} receiver
     * @param {?=} isSafe
     * @return {?}
     */
    _ParseAST.prototype.parseAccessMemberOrMethodCall = function (receiver, isSafe) {
        if (isSafe === void 0) { isSafe = false; }
        var /** @type {?} */ start = receiver.span.start;
        var /** @type {?} */ id = ((this.expectIdentifierOrKeyword()));
        if (this.optionalCharacter($LPAREN)) {
            this.rparensExpected++;
            var /** @type {?} */ args = this.parseCallArguments();
            this.expectCharacter($RPAREN);
            this.rparensExpected--;
            var /** @type {?} */ span = this.span(start);
            return isSafe ? new SafeMethodCall(span, receiver, id, args) :
                new MethodCall(span, receiver, id, args);
        }
        else {
            if (isSafe) {
                if (this.optionalOperator('=')) {
                    this.error('The \'?.\' operator cannot be used in the assignment');
                    return new EmptyExpr(this.span(start));
                }
                else {
                    return new SafePropertyRead(this.span(start), receiver, id);
                }
            }
            else {
                if (this.optionalOperator('=')) {
                    if (!this.parseAction) {
                        this.error('Bindings cannot contain assignments');
                        return new EmptyExpr(this.span(start));
                    }
                    var /** @type {?} */ value = this.parseConditional();
                    return new PropertyWrite(this.span(start), receiver, id, value);
                }
                else {
                    return new PropertyRead(this.span(start), receiver, id);
                }
            }
        }
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseCallArguments = function () {
        if (this.next.isCharacter($RPAREN))
            return [];
        var /** @type {?} */ positionals = [];
        do {
            positionals.push(this.parsePipe());
        } while (this.optionalCharacter($COMMA));
        return (positionals);
    };
    /**
     * An identifier, a keyword, a string with an optional `-` inbetween.
     * @return {?}
     */
    _ParseAST.prototype.expectTemplateBindingKey = function () {
        var /** @type {?} */ result = '';
        var /** @type {?} */ operatorFound = false;
        do {
            result += this.expectIdentifierOrKeywordOrString();
            operatorFound = this.optionalOperator('-');
            if (operatorFound) {
                result += '-';
            }
        } while (operatorFound);
        return result.toString();
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.parseTemplateBindings = function () {
        var /** @type {?} */ bindings = [];
        var /** @type {?} */ prefix = ((null));
        var /** @type {?} */ warnings = [];
        while (this.index < this.tokens.length) {
            var /** @type {?} */ start = this.inputIndex;
            var /** @type {?} */ keyIsVar = this.peekKeywordLet();
            if (keyIsVar) {
                this.advance();
            }
            var /** @type {?} */ rawKey = this.expectTemplateBindingKey();
            var /** @type {?} */ key = rawKey;
            if (!keyIsVar) {
                if (prefix == null) {
                    prefix = key;
                }
                else {
                    key = prefix + key[0].toUpperCase() + key.substring(1);
                }
            }
            this.optionalCharacter($COLON);
            var /** @type {?} */ name = ((null));
            var /** @type {?} */ expression = ((null));
            if (keyIsVar) {
                if (this.optionalOperator('=')) {
                    name = this.expectTemplateBindingKey();
                }
                else {
                    name = '\$implicit';
                }
            }
            else if (this.peekKeywordAs()) {
                var /** @type {?} */ letStart = this.inputIndex;
                this.advance(); // consume `as`
                name = rawKey;
                key = this.expectTemplateBindingKey(); // read local var name
                keyIsVar = true;
            }
            else if (this.next !== EOF && !this.peekKeywordLet()) {
                var /** @type {?} */ start_2 = this.inputIndex;
                var /** @type {?} */ ast = this.parsePipe();
                var /** @type {?} */ source = this.input.substring(start_2 - this.offset, this.inputIndex - this.offset);
                expression = new ASTWithSource(ast, source, this.location, this.errors);
            }
            bindings.push(new TemplateBinding(this.span(start), key, keyIsVar, name, expression));
            if (this.peekKeywordAs() && !keyIsVar) {
                var /** @type {?} */ letStart = this.inputIndex;
                this.advance(); // consume `as`
                var /** @type {?} */ letName = this.expectTemplateBindingKey(); // read local var name
                bindings.push(new TemplateBinding(this.span(letStart), letName, true, key, /** @type {?} */ ((null))));
            }
            if (!this.optionalCharacter($SEMICOLON)) {
                this.optionalCharacter($COMMA);
            }
        }
        return new TemplateBindingParseResult(bindings, warnings, this.errors);
    };
    /**
     * @param {?} message
     * @param {?=} index
     * @return {?}
     */
    _ParseAST.prototype.error = function (message, index) {
        if (index === void 0) { index = null; }
        this.errors.push(new ParserError(message, this.input, this.locationText(index), this.location));
        this.skip();
    };
    /**
     * @param {?=} index
     * @return {?}
     */
    _ParseAST.prototype.locationText = function (index) {
        if (index === void 0) { index = null; }
        if (index == null)
            index = this.index;
        return (index < this.tokens.length) ? "at column " + (this.tokens[index].index + 1) + " in" :
            "at the end of the expression";
    };
    /**
     * @return {?}
     */
    _ParseAST.prototype.skip = function () {
        var /** @type {?} */ n = this.next;
        while (this.index < this.tokens.length && !n.isCharacter($SEMICOLON) &&
            (this.rparensExpected <= 0 || !n.isCharacter($RPAREN)) &&
            (this.rbracesExpected <= 0 || !n.isCharacter($RBRACE)) &&
            (this.rbracketsExpected <= 0 || !n.isCharacter($RBRACKET))) {
            if (this.next.isError()) {
                this.errors.push(new ParserError(/** @type {?} */ ((this.next.toString())), this.input, this.locationText(), this.location));
            }
            this.advance();
            n = this.next;
        }
    };
    return _ParseAST;
}());
var SimpleExpressionChecker = (function () {
    function SimpleExpressionChecker() {
        this.errors = [];
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    SimpleExpressionChecker.check = function (ast) {
        var /** @type {?} */ s = new SimpleExpressionChecker();
        ast.visit(s);
        return s.errors;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitImplicitReceiver = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitInterpolation = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitLiteralPrimitive = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitPropertyRead = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitPropertyWrite = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitSafePropertyRead = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitMethodCall = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitSafeMethodCall = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitFunctionCall = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitLiteralArray = function (ast, context) { this.visitAll(ast.expressions); };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitLiteralMap = function (ast, context) { this.visitAll(ast.values); };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitBinary = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitPrefixNot = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitConditional = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitPipe = function (ast, context) { this.errors.push('pipes'); };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitKeyedRead = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitKeyedWrite = function (ast, context) { };
    /**
     * @param {?} asts
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitAll = function (asts) {
        var _this = this;
        return asts.map(function (node) { return node.visit(_this); });
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitChain = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    SimpleExpressionChecker.prototype.visitQuote = function (ast, context) { };
    return SimpleExpressionChecker;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var ParseLocation = (function () {
    /**
     * @param {?} file
     * @param {?} offset
     * @param {?} line
     * @param {?} col
     */
    function ParseLocation(file, offset, line, col) {
        this.file = file;
        this.offset = offset;
        this.line = line;
        this.col = col;
    }
    /**
     * @return {?}
     */
    ParseLocation.prototype.toString = function () {
        return this.offset != null ? this.file.url + "@" + this.line + ":" + this.col : this.file.url;
    };
    /**
     * @param {?} delta
     * @return {?}
     */
    ParseLocation.prototype.moveBy = function (delta) {
        var /** @type {?} */ source = this.file.content;
        var /** @type {?} */ len = source.length;
        var /** @type {?} */ offset = this.offset;
        var /** @type {?} */ line = this.line;
        var /** @type {?} */ col = this.col;
        while (offset > 0 && delta < 0) {
            offset--;
            delta++;
            var /** @type {?} */ ch = source.charCodeAt(offset);
            if (ch == $LF) {
                line--;
                var /** @type {?} */ priorLine = source.substr(0, offset - 1).lastIndexOf(String.fromCharCode($LF));
                col = priorLine > 0 ? offset - priorLine : offset;
            }
            else {
                col--;
            }
        }
        while (offset < len && delta > 0) {
            var /** @type {?} */ ch = source.charCodeAt(offset);
            offset++;
            delta--;
            if (ch == $LF) {
                line++;
                col = 0;
            }
            else {
                col++;
            }
        }
        return new ParseLocation(this.file, offset, line, col);
    };
    /**
     * @param {?} maxChars
     * @param {?} maxLines
     * @return {?}
     */
    ParseLocation.prototype.getContext = function (maxChars, maxLines) {
        var /** @type {?} */ content = this.file.content;
        var /** @type {?} */ startOffset = this.offset;
        if (startOffset != null) {
            if (startOffset > content.length - 1) {
                startOffset = content.length - 1;
            }
            var /** @type {?} */ endOffset = startOffset;
            var /** @type {?} */ ctxChars = 0;
            var /** @type {?} */ ctxLines = 0;
            while (ctxChars < maxChars && startOffset > 0) {
                startOffset--;
                ctxChars++;
                if (content[startOffset] == '\n') {
                    if (++ctxLines == maxLines) {
                        break;
                    }
                }
            }
            ctxChars = 0;
            ctxLines = 0;
            while (ctxChars < maxChars && endOffset < content.length - 1) {
                endOffset++;
                ctxChars++;
                if (content[endOffset] == '\n') {
                    if (++ctxLines == maxLines) {
                        break;
                    }
                }
            }
            return {
                before: content.substring(startOffset, this.offset),
                after: content.substring(this.offset, endOffset + 1),
            };
        }
        return null;
    };
    return ParseLocation;
}());
var ParseSourceFile = (function () {
    /**
     * @param {?} content
     * @param {?} url
     */
    function ParseSourceFile(content, url) {
        this.content = content;
        this.url = url;
    }
    return ParseSourceFile;
}());
var ParseSourceSpan = (function () {
    /**
     * @param {?} start
     * @param {?} end
     * @param {?=} details
     */
    function ParseSourceSpan(start, end, details) {
        if (details === void 0) { details = null; }
        this.start = start;
        this.end = end;
        this.details = details;
    }
    /**
     * @return {?}
     */
    ParseSourceSpan.prototype.toString = function () {
        return this.start.file.content.substring(this.start.offset, this.end.offset);
    };
    return ParseSourceSpan;
}());
var ParseErrorLevel = {};
ParseErrorLevel.WARNING = 0;
ParseErrorLevel.ERROR = 1;
ParseErrorLevel[ParseErrorLevel.WARNING] = "WARNING";
ParseErrorLevel[ParseErrorLevel.ERROR] = "ERROR";
var ParseError = (function () {
    /**
     * @param {?} span
     * @param {?} msg
     * @param {?=} level
     */
    function ParseError(span, msg, level) {
        if (level === void 0) { level = ParseErrorLevel.ERROR; }
        this.span = span;
        this.msg = msg;
        this.level = level;
    }
    /**
     * @return {?}
     */
    ParseError.prototype.toString = function () {
        var /** @type {?} */ ctx = this.span.start.getContext(100, 3);
        var /** @type {?} */ contextStr = ctx ? " (\"" + ctx.before + "[" + ParseErrorLevel[this.level] + " ->]" + ctx.after + "\")" : '';
        var /** @type {?} */ details = this.span.details ? ", " + this.span.details : '';
        return "" + this.msg + contextStr + ": " + this.span.start + details;
    };
    return ParseError;
}());
/**
 * @param {?} kind
 * @param {?} type
 * @return {?}
 */
function typeSourceSpan(kind, type) {
    var /** @type {?} */ moduleUrl = identifierModuleUrl(type);
    var /** @type {?} */ sourceFileName = moduleUrl != null ? "in " + kind + " " + identifierName(type) + " in " + moduleUrl :
        "in " + kind + " " + identifierName(type);
    var /** @type {?} */ sourceFile = new ParseSourceFile('', sourceFileName);
    return new ParseSourceSpan(new ParseLocation(sourceFile, -1, -1, -1), new ParseLocation(sourceFile, -1, -1, -1));
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var Text = (function () {
    /**
     * @param {?} value
     * @param {?} sourceSpan
     */
    function Text(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Text.prototype.visit = function (visitor, context) { return visitor.visitText(this, context); };
    return Text;
}());
var Expansion = (function () {
    /**
     * @param {?} switchValue
     * @param {?} type
     * @param {?} cases
     * @param {?} sourceSpan
     * @param {?} switchValueSourceSpan
     */
    function Expansion(switchValue, type, cases, sourceSpan, switchValueSourceSpan) {
        this.switchValue = switchValue;
        this.type = type;
        this.cases = cases;
        this.sourceSpan = sourceSpan;
        this.switchValueSourceSpan = switchValueSourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Expansion.prototype.visit = function (visitor, context) { return visitor.visitExpansion(this, context); };
    return Expansion;
}());
var ExpansionCase = (function () {
    /**
     * @param {?} value
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} valueSourceSpan
     * @param {?} expSourceSpan
     */
    function ExpansionCase(value, expression, sourceSpan, valueSourceSpan, expSourceSpan) {
        this.value = value;
        this.expression = expression;
        this.sourceSpan = sourceSpan;
        this.valueSourceSpan = valueSourceSpan;
        this.expSourceSpan = expSourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ExpansionCase.prototype.visit = function (visitor, context) { return visitor.visitExpansionCase(this, context); };
    return ExpansionCase;
}());
var Attribute$1 = (function () {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?=} valueSpan
     */
    function Attribute$1(name, value, sourceSpan, valueSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
        this.valueSpan = valueSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Attribute$1.prototype.visit = function (visitor, context) { return visitor.visitAttribute(this, context); };
    return Attribute$1;
}());
var Element = (function () {
    /**
     * @param {?} name
     * @param {?} attrs
     * @param {?} children
     * @param {?} sourceSpan
     * @param {?=} startSourceSpan
     * @param {?=} endSourceSpan
     */
    function Element(name, attrs, children, sourceSpan, startSourceSpan, endSourceSpan) {
        if (startSourceSpan === void 0) { startSourceSpan = null; }
        if (endSourceSpan === void 0) { endSourceSpan = null; }
        this.name = name;
        this.attrs = attrs;
        this.children = children;
        this.sourceSpan = sourceSpan;
        this.startSourceSpan = startSourceSpan;
        this.endSourceSpan = endSourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Element.prototype.visit = function (visitor, context) { return visitor.visitElement(this, context); };
    return Element;
}());
var Comment = (function () {
    /**
     * @param {?} value
     * @param {?} sourceSpan
     */
    function Comment(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Comment.prototype.visit = function (visitor, context) { return visitor.visitComment(this, context); };
    return Comment;
}());
/**
 * @param {?} visitor
 * @param {?} nodes
 * @param {?=} context
 * @return {?}
 */
function visitAll(visitor, nodes, context) {
    if (context === void 0) { context = null; }
    var /** @type {?} */ result = [];
    var /** @type {?} */ visit = visitor.visit ?
        function (ast) { return ((visitor.visit))(ast, context) || ast.visit(visitor, context); } :
        function (ast) { return ast.visit(visitor, context); };
    nodes.forEach(function (ast) {
        var /** @type {?} */ astResult = visit(ast);
        if (astResult) {
            result.push(astResult);
        }
    });
    return result;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var TokenType$1 = {};
TokenType$1.TAG_OPEN_START = 0;
TokenType$1.TAG_OPEN_END = 1;
TokenType$1.TAG_OPEN_END_VOID = 2;
TokenType$1.TAG_CLOSE = 3;
TokenType$1.TEXT = 4;
TokenType$1.ESCAPABLE_RAW_TEXT = 5;
TokenType$1.RAW_TEXT = 6;
TokenType$1.COMMENT_START = 7;
TokenType$1.COMMENT_END = 8;
TokenType$1.CDATA_START = 9;
TokenType$1.CDATA_END = 10;
TokenType$1.ATTR_NAME = 11;
TokenType$1.ATTR_VALUE = 12;
TokenType$1.DOC_TYPE = 13;
TokenType$1.EXPANSION_FORM_START = 14;
TokenType$1.EXPANSION_CASE_VALUE = 15;
TokenType$1.EXPANSION_CASE_EXP_START = 16;
TokenType$1.EXPANSION_CASE_EXP_END = 17;
TokenType$1.EXPANSION_FORM_END = 18;
TokenType$1.EOF = 19;
TokenType$1[TokenType$1.TAG_OPEN_START] = "TAG_OPEN_START";
TokenType$1[TokenType$1.TAG_OPEN_END] = "TAG_OPEN_END";
TokenType$1[TokenType$1.TAG_OPEN_END_VOID] = "TAG_OPEN_END_VOID";
TokenType$1[TokenType$1.TAG_CLOSE] = "TAG_CLOSE";
TokenType$1[TokenType$1.TEXT] = "TEXT";
TokenType$1[TokenType$1.ESCAPABLE_RAW_TEXT] = "ESCAPABLE_RAW_TEXT";
TokenType$1[TokenType$1.RAW_TEXT] = "RAW_TEXT";
TokenType$1[TokenType$1.COMMENT_START] = "COMMENT_START";
TokenType$1[TokenType$1.COMMENT_END] = "COMMENT_END";
TokenType$1[TokenType$1.CDATA_START] = "CDATA_START";
TokenType$1[TokenType$1.CDATA_END] = "CDATA_END";
TokenType$1[TokenType$1.ATTR_NAME] = "ATTR_NAME";
TokenType$1[TokenType$1.ATTR_VALUE] = "ATTR_VALUE";
TokenType$1[TokenType$1.DOC_TYPE] = "DOC_TYPE";
TokenType$1[TokenType$1.EXPANSION_FORM_START] = "EXPANSION_FORM_START";
TokenType$1[TokenType$1.EXPANSION_CASE_VALUE] = "EXPANSION_CASE_VALUE";
TokenType$1[TokenType$1.EXPANSION_CASE_EXP_START] = "EXPANSION_CASE_EXP_START";
TokenType$1[TokenType$1.EXPANSION_CASE_EXP_END] = "EXPANSION_CASE_EXP_END";
TokenType$1[TokenType$1.EXPANSION_FORM_END] = "EXPANSION_FORM_END";
TokenType$1[TokenType$1.EOF] = "EOF";
var Token$1 = (function () {
    /**
     * @param {?} type
     * @param {?} parts
     * @param {?} sourceSpan
     */
    function Token$1(type, parts, sourceSpan) {
        this.type = type;
        this.parts = parts;
        this.sourceSpan = sourceSpan;
    }
    return Token$1;
}());
var TokenError = (function (_super) {
    __extends(TokenError, _super);
    /**
     * @param {?} errorMsg
     * @param {?} tokenType
     * @param {?} span
     */
    function TokenError(errorMsg, tokenType, span) {
        var _this = _super.call(this, span, errorMsg) || this;
        _this.tokenType = tokenType;
        return _this;
    }
    return TokenError;
}(ParseError));
var TokenizeResult = (function () {
    /**
     * @param {?} tokens
     * @param {?} errors
     */
    function TokenizeResult(tokens, errors) {
        this.tokens = tokens;
        this.errors = errors;
    }
    return TokenizeResult;
}());
/**
 * @param {?} source
 * @param {?} url
 * @param {?} getTagDefinition
 * @param {?=} tokenizeExpansionForms
 * @param {?=} interpolationConfig
 * @return {?}
 */
function tokenize(source, url, getTagDefinition, tokenizeExpansionForms, interpolationConfig) {
    if (tokenizeExpansionForms === void 0) { tokenizeExpansionForms = false; }
    if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
    return new _Tokenizer(new ParseSourceFile(source, url), getTagDefinition, tokenizeExpansionForms, interpolationConfig)
        .tokenize();
}
var _CR_OR_CRLF_REGEXP = /\r\n?/g;
/**
 * @param {?} charCode
 * @return {?}
 */
function _unexpectedCharacterErrorMsg(charCode) {
    var /** @type {?} */ char = charCode === $EOF ? 'EOF' : String.fromCharCode(charCode);
    return "Unexpected character \"" + char + "\"";
}
/**
 * @param {?} entitySrc
 * @return {?}
 */
function _unknownEntityErrorMsg(entitySrc) {
    return "Unknown entity \"" + entitySrc + "\" - use the \"&#<decimal>;\" or  \"&#x<hex>;\" syntax";
}
var _ControlFlowError = (function () {
    /**
     * @param {?} error
     */
    function _ControlFlowError(error) {
        this.error = error;
    }
    return _ControlFlowError;
}());
var _Tokenizer = (function () {
    /**
     * @param {?} _file The html source
     * @param {?} _getTagDefinition
     * @param {?} _tokenizeIcu Whether to tokenize ICU messages (considered as text nodes when false)
     * @param {?=} _interpolationConfig
     */
    function _Tokenizer(_file, _getTagDefinition, _tokenizeIcu, _interpolationConfig) {
        if (_interpolationConfig === void 0) { _interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        this._file = _file;
        this._getTagDefinition = _getTagDefinition;
        this._tokenizeIcu = _tokenizeIcu;
        this._interpolationConfig = _interpolationConfig;
        this._peek = -1;
        this._nextPeek = -1;
        this._index = -1;
        this._line = 0;
        this._column = -1;
        this._expansionCaseStack = [];
        this._inInterpolation = false;
        this.tokens = [];
        this.errors = [];
        this._input = _file.content;
        this._length = _file.content.length;
        this._advance();
    }
    /**
     * @param {?} content
     * @return {?}
     */
    _Tokenizer.prototype._processCarriageReturns = function (content) {
        // http://www.w3.org/TR/html5/syntax.html#preprocessing-the-input-stream
        // In order to keep the original position in the source, we can not
        // pre-process it.
        // Instead CRs are processed right before instantiating the tokens.
        return content.replace(_CR_OR_CRLF_REGEXP, '\n');
    };
    /**
     * @return {?}
     */
    _Tokenizer.prototype.tokenize = function () {
        while (this._peek !== $EOF) {
            var /** @type {?} */ start = this._getLocation();
            try {
                if (this._attemptCharCode($LT)) {
                    if (this._attemptCharCode($BANG)) {
                        if (this._attemptCharCode($LBRACKET)) {
                            this._consumeCdata(start);
                        }
                        else if (this._attemptCharCode($MINUS)) {
                            this._consumeComment(start);
                        }
                        else {
                            this._consumeDocType(start);
                        }
                    }
                    else if (this._attemptCharCode($SLASH)) {
                        this._consumeTagClose(start);
                    }
                    else {
                        this._consumeTagOpen(start);
                    }
                }
                else if (!(this._tokenizeIcu && this._tokenizeExpansionForm())) {
                    this._consumeText();
                }
            }
            catch (e) {
                if (e instanceof _ControlFlowError) {
                    this.errors.push(e.error);
                }
                else {
                    throw e;
                }
            }
        }
        this._beginToken(TokenType$1.EOF);
        this._endToken([]);
        return new TokenizeResult(mergeTextTokens(this.tokens), this.errors);
    };
    /**
     * \@internal
     * @return {?}
     */
    _Tokenizer.prototype._tokenizeExpansionForm = function () {
        if (isExpansionFormStart(this._input, this._index, this._interpolationConfig)) {
            this._consumeExpansionFormStart();
            return true;
        }
        if (isExpansionCaseStart(this._peek) && this._isInExpansionForm()) {
            this._consumeExpansionCaseStart();
            return true;
        }
        if (this._peek === $RBRACE) {
            if (this._isInExpansionCase()) {
                this._consumeExpansionCaseEnd();
                return true;
            }
            if (this._isInExpansionForm()) {
                this._consumeExpansionFormEnd();
                return true;
            }
        }
        return false;
    };
    /**
     * @return {?}
     */
    _Tokenizer.prototype._getLocation = function () {
        return new ParseLocation(this._file, this._index, this._line, this._column);
    };
    /**
     * @param {?=} start
     * @param {?=} end
     * @return {?}
     */
    _Tokenizer.prototype._getSpan = function (start, end) {
        if (start === void 0) { start = this._getLocation(); }
        if (end === void 0) { end = this._getLocation(); }
        return new ParseSourceSpan(start, end);
    };
    /**
     * @param {?} type
     * @param {?=} start
     * @return {?}
     */
    _Tokenizer.prototype._beginToken = function (type, start) {
        if (start === void 0) { start = this._getLocation(); }
        this._currentTokenStart = start;
        this._currentTokenType = type;
    };
    /**
     * @param {?} parts
     * @param {?=} end
     * @return {?}
     */
    _Tokenizer.prototype._endToken = function (parts, end) {
        if (end === void 0) { end = this._getLocation(); }
        var /** @type {?} */ token = new Token$1(this._currentTokenType, parts, new ParseSourceSpan(this._currentTokenStart, end));
        this.tokens.push(token);
        this._currentTokenStart = ((null));
        this._currentTokenType = ((null));
        return token;
    };
    /**
     * @param {?} msg
     * @param {?} span
     * @return {?}
     */
    _Tokenizer.prototype._createError = function (msg, span) {
        if (this._isInExpansionForm()) {
            msg += " (Do you have an unescaped \"{\" in your template? Use \"{{ '{' }}\") to escape it.)";
        }
        var /** @type {?} */ error = new TokenError(msg, this._currentTokenType, span);
        this._currentTokenStart = ((null));
        this._currentTokenType = ((null));
        return new _ControlFlowError(error);
    };
    /**
     * @return {?}
     */
    _Tokenizer.prototype._advance = function () {
        if (this._index >= this._length) {
            throw this._createError(_unexpectedCharacterErrorMsg($EOF), this._getSpan());
        }
        if (this._peek === $LF) {
            this._line++;
            this._column = 0;
        }
        else if (this._peek !== $LF && this._peek !== $CR) {
            this._column++;
        }
        this._index++;
        this._peek = this._index >= this._length ? $EOF : this._input.charCodeAt(this._index);
        this._nextPeek =
            this._index + 1 >= this._length ? $EOF : this._input.charCodeAt(this._index + 1);
    };
    /**
     * @param {?} charCode
     * @return {?}
     */
    _Tokenizer.prototype._attemptCharCode = function (charCode) {
        if (this._peek === charCode) {
            this._advance();
            return true;
        }
        return false;
    };
    /**
     * @param {?} charCode
     * @return {?}
     */
    _Tokenizer.prototype._attemptCharCodeCaseInsensitive = function (charCode) {
        if (compareCharCodeCaseInsensitive(this._peek, charCode)) {
            this._advance();
            return true;
        }
        return false;
    };
    /**
     * @param {?} charCode
     * @return {?}
     */
    _Tokenizer.prototype._requireCharCode = function (charCode) {
        var /** @type {?} */ location = this._getLocation();
        if (!this._attemptCharCode(charCode)) {
            throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan(location, location));
        }
    };
    /**
     * @param {?} chars
     * @return {?}
     */
    _Tokenizer.prototype._attemptStr = function (chars) {
        var /** @type {?} */ len = chars.length;
        if (this._index + len > this._length) {
            return false;
        }
        var /** @type {?} */ initialPosition = this._savePosition();
        for (var /** @type {?} */ i = 0; i < len; i++) {
            if (!this._attemptCharCode(chars.charCodeAt(i))) {
                // If attempting to parse the string fails, we want to reset the parser
                // to where it was before the attempt
                this._restorePosition(initialPosition);
                return false;
            }
        }
        return true;
    };
    /**
     * @param {?} chars
     * @return {?}
     */
    _Tokenizer.prototype._attemptStrCaseInsensitive = function (chars) {
        for (var /** @type {?} */ i = 0; i < chars.length; i++) {
            if (!this._attemptCharCodeCaseInsensitive(chars.charCodeAt(i))) {
                return false;
            }
        }
        return true;
    };
    /**
     * @param {?} chars
     * @return {?}
     */
    _Tokenizer.prototype._requireStr = function (chars) {
        var /** @type {?} */ location = this._getLocation();
        if (!this._attemptStr(chars)) {
            throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan(location));
        }
    };
    /**
     * @param {?} predicate
     * @return {?}
     */
    _Tokenizer.prototype._attemptCharCodeUntilFn = function (predicate) {
        while (!predicate(this._peek)) {
            this._advance();
        }
    };
    /**
     * @param {?} predicate
     * @param {?} len
     * @return {?}
     */
    _Tokenizer.prototype._requireCharCodeUntilFn = function (predicate, len) {
        var /** @type {?} */ start = this._getLocation();
        this._attemptCharCodeUntilFn(predicate);
        if (this._index - start.offset < len) {
            throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan(start, start));
        }
    };
    /**
     * @param {?} char
     * @return {?}
     */
    _Tokenizer.prototype._attemptUntilChar = function (char) {
        while (this._peek !== char) {
            this._advance();
        }
    };
    /**
     * @param {?} decodeEntities
     * @return {?}
     */
    _Tokenizer.prototype._readChar = function (decodeEntities) {
        if (decodeEntities && this._peek === $AMPERSAND) {
            return this._decodeEntity();
        }
        else {
            var /** @type {?} */ index = this._index;
            this._advance();
            return this._input[index];
        }
    };
    /**
     * @return {?}
     */
    _Tokenizer.prototype._decodeEntity = function () {
        var /** @type {?} */ start = this._getLocation();
        this._advance();
        if (this._attemptCharCode($HASH)) {
            var /** @type {?} */ isHex = this._attemptCharCode($x) || this._attemptCharCode($X);
            var /** @type {?} */ numberStart = this._getLocation().offset;
            this._attemptCharCodeUntilFn(isDigitEntityEnd);
            if (this._peek != $SEMICOLON) {
                throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan());
            }
            this._advance();
            var /** @type {?} */ strNum = this._input.substring(numberStart, this._index - 1);
            try {
                var /** @type {?} */ charCode = parseInt(strNum, isHex ? 16 : 10);
                return String.fromCharCode(charCode);
            }
            catch (e) {
                var /** @type {?} */ entity = this._input.substring(start.offset + 1, this._index - 1);
                throw this._createError(_unknownEntityErrorMsg(entity), this._getSpan(start));
            }
        }
        else {
            var /** @type {?} */ startPosition = this._savePosition();
            this._attemptCharCodeUntilFn(isNamedEntityEnd);
            if (this._peek != $SEMICOLON) {
                this._restorePosition(startPosition);
                return '&';
            }
            this._advance();
            var /** @type {?} */ name = this._input.substring(start.offset + 1, this._index - 1);
            var /** @type {?} */ char = NAMED_ENTITIES[name];
            if (!char) {
                throw this._createError(_unknownEntityErrorMsg(name), this._getSpan(start));
            }
            return char;
        }
    };
    /**
     * @param {?} decodeEntities
     * @param {?} firstCharOfEnd
     * @param {?} attemptEndRest
     * @return {?}
     */
    _Tokenizer.prototype._consumeRawText = function (decodeEntities, firstCharOfEnd, attemptEndRest) {
        var /** @type {?} */ tagCloseStart;
        var /** @type {?} */ textStart = this._getLocation();
        this._beginToken(decodeEntities ? TokenType$1.ESCAPABLE_RAW_TEXT : TokenType$1.RAW_TEXT, textStart);
        var /** @type {?} */ parts = [];
        while (true) {
            tagCloseStart = this._getLocation();
            if (this._attemptCharCode(firstCharOfEnd) && attemptEndRest()) {
                break;
            }
            if (this._index > tagCloseStart.offset) {
                // add the characters consumed by the previous if statement to the output
                parts.push(this._input.substring(tagCloseStart.offset, this._index));
            }
            while (this._peek !== firstCharOfEnd) {
                parts.push(this._readChar(decodeEntities));
            }
        }
        return this._endToken([this._processCarriageReturns(parts.join(''))], tagCloseStart);
    };
    /**
     * @param {?} start
     * @return {?}
     */
    _Tokenizer.prototype._consumeComment = function (start) {
        var _this = this;
        this._beginToken(TokenType$1.COMMENT_START, start);
        this._requireCharCode($MINUS);
        this._endToken([]);
        var /** @type {?} */ textToken = this._consumeRawText(false, $MINUS, function () { return _this._attemptStr('->'); });
        this._beginToken(TokenType$1.COMMENT_END, textToken.sourceSpan.end);
        this._endToken([]);
    };
    /**
     * @param {?} start
     * @return {?}
     */
    _Tokenizer.prototype._consumeCdata = function (start) {
        var _this = this;
        this._beginToken(TokenType$1.CDATA_START, start);
        this._requireStr('CDATA[');
        this._endToken([]);
        var /** @type {?} */ textToken = this._consumeRawText(false, $RBRACKET, function () { return _this._attemptStr(']>'); });
        this._beginToken(TokenType$1.CDATA_END, textToken.sourceSpan.end);
        this._endToken([]);
    };
    /**
     * @param {?} start
     * @return {?}
     */
    _Tokenizer.prototype._consumeDocType = function (start) {
        this._beginToken(TokenType$1.DOC_TYPE, start);
        this._attemptUntilChar($GT);
        this._advance();
        this._endToken([this._input.substring(start.offset + 2, this._index - 1)]);
    };
    /**
     * @return {?}
     */
    _Tokenizer.prototype._consumePrefixAndName = function () {
        var /** @type {?} */ nameOrPrefixStart = this._index;
        var /** @type {?} */ prefix = ((null));
        while (this._peek !== $COLON && !isPrefixEnd(this._peek)) {
            this._advance();
        }
        var /** @type {?} */ nameStart;
        if (this._peek === $COLON) {
            this._advance();
            prefix = this._input.substring(nameOrPrefixStart, this._index - 1);
            nameStart = this._index;
        }
        else {
            nameStart = nameOrPrefixStart;
        }
        this._requireCharCodeUntilFn(isNameEnd, this._index === nameStart ? 1 : 0);
        var /** @type {?} */ name = this._input.substring(nameStart, this._index);
        return [prefix, name];
    };
    /**
     * @param {?} start
     * @return {?}
     */
    _Tokenizer.prototype._consumeTagOpen = function (start) {
        var /** @type {?} */ savedPos = this._savePosition();
        var /** @type {?} */ tagName;
        var /** @type {?} */ lowercaseTagName;
        try {
            if (!isAsciiLetter(this._peek)) {
                throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan());
            }
            var /** @type {?} */ nameStart = this._index;
            this._consumeTagOpenStart(start);
            tagName = this._input.substring(nameStart, this._index);
            lowercaseTagName = tagName.toLowerCase();
            this._attemptCharCodeUntilFn(isNotWhitespace);
            while (this._peek !== $SLASH && this._peek !== $GT) {
                this._consumeAttributeName();
                this._attemptCharCodeUntilFn(isNotWhitespace);
                if (this._attemptCharCode($EQ)) {
                    this._attemptCharCodeUntilFn(isNotWhitespace);
                    this._consumeAttributeValue();
                }
                this._attemptCharCodeUntilFn(isNotWhitespace);
            }
            this._consumeTagOpenEnd();
        }
        catch (e) {
            if (e instanceof _ControlFlowError) {
                // When the start tag is invalid, assume we want a "<"
                this._restorePosition(savedPos);
                // Back to back text tokens are merged at the end
                this._beginToken(TokenType$1.TEXT, start);
                this._endToken(['<']);
                return;
            }
            throw e;
        }
        var /** @type {?} */ contentTokenType = this._getTagDefinition(tagName).contentType;
        if (contentTokenType === TagContentType.RAW_TEXT) {
            this._consumeRawTextWithTagClose(lowercaseTagName, false);
        }
        else if (contentTokenType === TagContentType.ESCAPABLE_RAW_TEXT) {
            this._consumeRawTextWithTagClose(lowercaseTagName, true);
        }
    };
    /**
     * @param {?} lowercaseTagName
     * @param {?} decodeEntities
     * @return {?}
     */
    _Tokenizer.prototype._consumeRawTextWithTagClose = function (lowercaseTagName, decodeEntities) {
        var _this = this;
        var /** @type {?} */ textToken = this._consumeRawText(decodeEntities, $LT, function () {
            if (!_this._attemptCharCode($SLASH))
                return false;
            _this._attemptCharCodeUntilFn(isNotWhitespace);
            if (!_this._attemptStrCaseInsensitive(lowercaseTagName))
                return false;
            _this._attemptCharCodeUntilFn(isNotWhitespace);
            return _this._attemptCharCode($GT);
        });
        this._beginToken(TokenType$1.TAG_CLOSE, textToken.sourceSpan.end);
        this._endToken([/** @type {?} */ ((null)), lowercaseTagName]);
    };
    /**
     * @param {?} start
     * @return {?}
     */
    _Tokenizer.prototype._consumeTagOpenStart = function (start) {
        this._beginToken(TokenType$1.TAG_OPEN_START, start);
        var /** @type {?} */ parts = this._consumePrefixAndName();
        this._endToken(parts);
    };
    /**
     * @return {?}
     */
    _Tokenizer.prototype._consumeAttributeName = function () {
        this._beginToken(TokenType$1.ATTR_NAME);
        var /** @type {?} */ prefixAndName = this._consumePrefixAndName();
        this._endToken(prefixAndName);
    };
    /**
     * @return {?}
     */
    _Tokenizer.prototype._consumeAttributeValue = function () {
        this._beginToken(TokenType$1.ATTR_VALUE);
        var /** @type {?} */ value;
        if (this._peek === $SQ || this._peek === $DQ) {
            var /** @type {?} */ quoteChar = this._peek;
            this._advance();
            var /** @type {?} */ parts = [];
            while (this._peek !== quoteChar) {
                parts.push(this._readChar(true));
            }
            value = parts.join('');
            this._advance();
        }
        else {
            var /** @type {?} */ valueStart = this._index;
            this._requireCharCodeUntilFn(isNameEnd, 1);
            value = this._input.substring(valueStart, this._index);
        }
        this._endToken([this._processCarriageReturns(value)]);
    };
    /**
     * @return {?}
     */
    _Tokenizer.prototype._consumeTagOpenEnd = function () {
        var /** @type {?} */ tokenType = this._attemptCharCode($SLASH) ? TokenType$1.TAG_OPEN_END_VOID : TokenType$1.TAG_OPEN_END;
        this._beginToken(tokenType);
        this._requireCharCode($GT);
        this._endToken([]);
    };
    /**
     * @param {?} start
     * @return {?}
     */
    _Tokenizer.prototype._consumeTagClose = function (start) {
        this._beginToken(TokenType$1.TAG_CLOSE, start);
        this._attemptCharCodeUntilFn(isNotWhitespace);
        var /** @type {?} */ prefixAndName = this._consumePrefixAndName();
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._requireCharCode($GT);
        this._endToken(prefixAndName);
    };
    /**
     * @return {?}
     */
    _Tokenizer.prototype._consumeExpansionFormStart = function () {
        this._beginToken(TokenType$1.EXPANSION_FORM_START, this._getLocation());
        this._requireCharCode($LBRACE);
        this._endToken([]);
        this._expansionCaseStack.push(TokenType$1.EXPANSION_FORM_START);
        this._beginToken(TokenType$1.RAW_TEXT, this._getLocation());
        var /** @type {?} */ condition = this._readUntil($COMMA);
        this._endToken([condition], this._getLocation());
        this._requireCharCode($COMMA);
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._beginToken(TokenType$1.RAW_TEXT, this._getLocation());
        var /** @type {?} */ type = this._readUntil($COMMA);
        this._endToken([type], this._getLocation());
        this._requireCharCode($COMMA);
        this._attemptCharCodeUntilFn(isNotWhitespace);
    };
    /**
     * @return {?}
     */
    _Tokenizer.prototype._consumeExpansionCaseStart = function () {
        this._beginToken(TokenType$1.EXPANSION_CASE_VALUE, this._getLocation());
        var /** @type {?} */ value = this._readUntil($LBRACE).trim();
        this._endToken([value], this._getLocation());
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._beginToken(TokenType$1.EXPANSION_CASE_EXP_START, this._getLocation());
        this._requireCharCode($LBRACE);
        this._endToken([], this._getLocation());
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._expansionCaseStack.push(TokenType$1.EXPANSION_CASE_EXP_START);
    };
    /**
     * @return {?}
     */
    _Tokenizer.prototype._consumeExpansionCaseEnd = function () {
        this._beginToken(TokenType$1.EXPANSION_CASE_EXP_END, this._getLocation());
        this._requireCharCode($RBRACE);
        this._endToken([], this._getLocation());
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._expansionCaseStack.pop();
    };
    /**
     * @return {?}
     */
    _Tokenizer.prototype._consumeExpansionFormEnd = function () {
        this._beginToken(TokenType$1.EXPANSION_FORM_END, this._getLocation());
        this._requireCharCode($RBRACE);
        this._endToken([]);
        this._expansionCaseStack.pop();
    };
    /**
     * @return {?}
     */
    _Tokenizer.prototype._consumeText = function () {
        var /** @type {?} */ start = this._getLocation();
        this._beginToken(TokenType$1.TEXT, start);
        var /** @type {?} */ parts = [];
        do {
            if (this._interpolationConfig && this._attemptStr(this._interpolationConfig.start)) {
                parts.push(this._interpolationConfig.start);
                this._inInterpolation = true;
            }
            else if (this._interpolationConfig && this._inInterpolation &&
                this._attemptStr(this._interpolationConfig.end)) {
                parts.push(this._interpolationConfig.end);
                this._inInterpolation = false;
            }
            else {
                parts.push(this._readChar(true));
            }
        } while (!this._isTextEnd());
        this._endToken([this._processCarriageReturns(parts.join(''))]);
    };
    /**
     * @return {?}
     */
    _Tokenizer.prototype._isTextEnd = function () {
        if (this._peek === $LT || this._peek === $EOF) {
            return true;
        }
        if (this._tokenizeIcu && !this._inInterpolation) {
            if (isExpansionFormStart(this._input, this._index, this._interpolationConfig)) {
                // start of an expansion form
                return true;
            }
            if (this._peek === $RBRACE && this._isInExpansionCase()) {
                // end of and expansion case
                return true;
            }
        }
        return false;
    };
    /**
     * @return {?}
     */
    _Tokenizer.prototype._savePosition = function () {
        return [this._peek, this._index, this._column, this._line, this.tokens.length];
    };
    /**
     * @param {?} char
     * @return {?}
     */
    _Tokenizer.prototype._readUntil = function (char) {
        var /** @type {?} */ start = this._index;
        this._attemptUntilChar(char);
        return this._input.substring(start, this._index);
    };
    /**
     * @param {?} position
     * @return {?}
     */
    _Tokenizer.prototype._restorePosition = function (position) {
        this._peek = position[0];
        this._index = position[1];
        this._column = position[2];
        this._line = position[3];
        var /** @type {?} */ nbTokens = position[4];
        if (nbTokens < this.tokens.length) {
            // remove any extra tokens
            this.tokens = this.tokens.slice(0, nbTokens);
        }
    };
    /**
     * @return {?}
     */
    _Tokenizer.prototype._isInExpansionCase = function () {
        return this._expansionCaseStack.length > 0 &&
            this._expansionCaseStack[this._expansionCaseStack.length - 1] ===
                TokenType$1.EXPANSION_CASE_EXP_START;
    };
    /**
     * @return {?}
     */
    _Tokenizer.prototype._isInExpansionForm = function () {
        return this._expansionCaseStack.length > 0 &&
            this._expansionCaseStack[this._expansionCaseStack.length - 1] ===
                TokenType$1.EXPANSION_FORM_START;
    };
    return _Tokenizer;
}());
/**
 * @param {?} code
 * @return {?}
 */
function isNotWhitespace(code) {
    return !isWhitespace(code) || code === $EOF;
}
/**
 * @param {?} code
 * @return {?}
 */
function isNameEnd(code) {
    return isWhitespace(code) || code === $GT || code === $SLASH ||
        code === $SQ || code === $DQ || code === $EQ;
}
/**
 * @param {?} code
 * @return {?}
 */
function isPrefixEnd(code) {
    return (code < $a || $z < code) && (code < $A || $Z < code) &&
        (code < $0 || code > $9);
}
/**
 * @param {?} code
 * @return {?}
 */
function isDigitEntityEnd(code) {
    return code == $SEMICOLON || code == $EOF || !isAsciiHexDigit(code);
}
/**
 * @param {?} code
 * @return {?}
 */
function isNamedEntityEnd(code) {
    return code == $SEMICOLON || code == $EOF || !isAsciiLetter(code);
}
/**
 * @param {?} input
 * @param {?} offset
 * @param {?} interpolationConfig
 * @return {?}
 */
function isExpansionFormStart(input, offset, interpolationConfig) {
    var /** @type {?} */ isInterpolationStart = interpolationConfig ? input.indexOf(interpolationConfig.start, offset) == offset : false;
    return input.charCodeAt(offset) == $LBRACE && !isInterpolationStart;
}
/**
 * @param {?} peek
 * @return {?}
 */
function isExpansionCaseStart(peek) {
    return peek === $EQ || isAsciiLetter(peek);
}
/**
 * @param {?} code1
 * @param {?} code2
 * @return {?}
 */
function compareCharCodeCaseInsensitive(code1, code2) {
    return toUpperCaseCharCode(code1) == toUpperCaseCharCode(code2);
}
/**
 * @param {?} code
 * @return {?}
 */
function toUpperCaseCharCode(code) {
    return code >= $a && code <= $z ? code - $a + $A : code;
}
/**
 * @param {?} srcTokens
 * @return {?}
 */
function mergeTextTokens(srcTokens) {
    var /** @type {?} */ dstTokens = [];
    var /** @type {?} */ lastDstToken = undefined;
    for (var /** @type {?} */ i = 0; i < srcTokens.length; i++) {
        var /** @type {?} */ token = srcTokens[i];
        if (lastDstToken && lastDstToken.type == TokenType$1.TEXT && token.type == TokenType$1.TEXT) {
            lastDstToken.parts[0] += token.parts[0];
            lastDstToken.sourceSpan.end = token.sourceSpan.end;
        }
        else {
            lastDstToken = token;
            dstTokens.push(lastDstToken);
        }
    }
    return dstTokens;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var TreeError = (function (_super) {
    __extends(TreeError, _super);
    /**
     * @param {?} elementName
     * @param {?} span
     * @param {?} msg
     */
    function TreeError(elementName, span, msg) {
        var _this = _super.call(this, span, msg) || this;
        _this.elementName = elementName;
        return _this;
    }
    /**
     * @param {?} elementName
     * @param {?} span
     * @param {?} msg
     * @return {?}
     */
    TreeError.create = function (elementName, span, msg) {
        return new TreeError(elementName, span, msg);
    };
    return TreeError;
}(ParseError));
var ParseTreeResult = (function () {
    /**
     * @param {?} rootNodes
     * @param {?} errors
     */
    function ParseTreeResult(rootNodes, errors) {
        this.rootNodes = rootNodes;
        this.errors = errors;
    }
    return ParseTreeResult;
}());
var Parser$1 = (function () {
    /**
     * @param {?} getTagDefinition
     */
    function Parser$1(getTagDefinition) {
        this.getTagDefinition = getTagDefinition;
    }
    /**
     * @param {?} source
     * @param {?} url
     * @param {?=} parseExpansionForms
     * @param {?=} interpolationConfig
     * @return {?}
     */
    Parser$1.prototype.parse = function (source, url, parseExpansionForms, interpolationConfig) {
        if (parseExpansionForms === void 0) { parseExpansionForms = false; }
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        var /** @type {?} */ tokensAndErrors = tokenize(source, url, this.getTagDefinition, parseExpansionForms, interpolationConfig);
        var /** @type {?} */ treeAndErrors = new _TreeBuilder(tokensAndErrors.tokens, this.getTagDefinition).build();
        return new ParseTreeResult(treeAndErrors.rootNodes, ((tokensAndErrors.errors)).concat(treeAndErrors.errors));
    };
    return Parser$1;
}());
var _TreeBuilder = (function () {
    /**
     * @param {?} tokens
     * @param {?} getTagDefinition
     */
    function _TreeBuilder(tokens, getTagDefinition) {
        this.tokens = tokens;
        this.getTagDefinition = getTagDefinition;
        this._index = -1;
        this._rootNodes = [];
        this._errors = [];
        this._elementStack = [];
        this._advance();
    }
    /**
     * @return {?}
     */
    _TreeBuilder.prototype.build = function () {
        while (this._peek.type !== TokenType$1.EOF) {
            if (this._peek.type === TokenType$1.TAG_OPEN_START) {
                this._consumeStartTag(this._advance());
            }
            else if (this._peek.type === TokenType$1.TAG_CLOSE) {
                this._consumeEndTag(this._advance());
            }
            else if (this._peek.type === TokenType$1.CDATA_START) {
                this._closeVoidElement();
                this._consumeCdata(this._advance());
            }
            else if (this._peek.type === TokenType$1.COMMENT_START) {
                this._closeVoidElement();
                this._consumeComment(this._advance());
            }
            else if (this._peek.type === TokenType$1.TEXT || this._peek.type === TokenType$1.RAW_TEXT ||
                this._peek.type === TokenType$1.ESCAPABLE_RAW_TEXT) {
                this._closeVoidElement();
                this._consumeText(this._advance());
            }
            else if (this._peek.type === TokenType$1.EXPANSION_FORM_START) {
                this._consumeExpansion(this._advance());
            }
            else {
                // Skip all other tokens...
                this._advance();
            }
        }
        return new ParseTreeResult(this._rootNodes, this._errors);
    };
    /**
     * @return {?}
     */
    _TreeBuilder.prototype._advance = function () {
        var /** @type {?} */ prev = this._peek;
        if (this._index < this.tokens.length - 1) {
            // Note: there is always an EOF token at the end
            this._index++;
        }
        this._peek = this.tokens[this._index];
        return prev;
    };
    /**
     * @param {?} type
     * @return {?}
     */
    _TreeBuilder.prototype._advanceIf = function (type) {
        if (this._peek.type === type) {
            return this._advance();
        }
        return null;
    };
    /**
     * @param {?} startToken
     * @return {?}
     */
    _TreeBuilder.prototype._consumeCdata = function (startToken) {
        this._consumeText(this._advance());
        this._advanceIf(TokenType$1.CDATA_END);
    };
    /**
     * @param {?} token
     * @return {?}
     */
    _TreeBuilder.prototype._consumeComment = function (token) {
        var /** @type {?} */ text = this._advanceIf(TokenType$1.RAW_TEXT);
        this._advanceIf(TokenType$1.COMMENT_END);
        var /** @type {?} */ value = text != null ? text.parts[0].trim() : null;
        this._addToParent(new Comment(value, token.sourceSpan));
    };
    /**
     * @param {?} token
     * @return {?}
     */
    _TreeBuilder.prototype._consumeExpansion = function (token) {
        var /** @type {?} */ switchValue = this._advance();
        var /** @type {?} */ type = this._advance();
        var /** @type {?} */ cases = [];
        // read =
        while (this._peek.type === TokenType$1.EXPANSION_CASE_VALUE) {
            var /** @type {?} */ expCase = this._parseExpansionCase();
            if (!expCase)
                return; // error
            cases.push(expCase);
        }
        // read the final }
        if (this._peek.type !== TokenType$1.EXPANSION_FORM_END) {
            this._errors.push(TreeError.create(null, this._peek.sourceSpan, "Invalid ICU message. Missing '}'."));
            return;
        }
        var /** @type {?} */ sourceSpan = new ParseSourceSpan(token.sourceSpan.start, this._peek.sourceSpan.end);
        this._addToParent(new Expansion(switchValue.parts[0], type.parts[0], cases, sourceSpan, switchValue.sourceSpan));
        this._advance();
    };
    /**
     * @return {?}
     */
    _TreeBuilder.prototype._parseExpansionCase = function () {
        var /** @type {?} */ value = this._advance();
        // read {
        if (this._peek.type !== TokenType$1.EXPANSION_CASE_EXP_START) {
            this._errors.push(TreeError.create(null, this._peek.sourceSpan, "Invalid ICU message. Missing '{'."));
            return null;
        }
        // read until }
        var /** @type {?} */ start = this._advance();
        var /** @type {?} */ exp = this._collectExpansionExpTokens(start);
        if (!exp)
            return null;
        var /** @type {?} */ end = this._advance();
        exp.push(new Token$1(TokenType$1.EOF, [], end.sourceSpan));
        // parse everything in between { and }
        var /** @type {?} */ parsedExp = new _TreeBuilder(exp, this.getTagDefinition).build();
        if (parsedExp.errors.length > 0) {
            this._errors = this._errors.concat(/** @type {?} */ (parsedExp.errors));
            return null;
        }
        var /** @type {?} */ sourceSpan = new ParseSourceSpan(value.sourceSpan.start, end.sourceSpan.end);
        var /** @type {?} */ expSourceSpan = new ParseSourceSpan(start.sourceSpan.start, end.sourceSpan.end);
        return new ExpansionCase(value.parts[0], parsedExp.rootNodes, sourceSpan, value.sourceSpan, expSourceSpan);
    };
    /**
     * @param {?} start
     * @return {?}
     */
    _TreeBuilder.prototype._collectExpansionExpTokens = function (start) {
        var /** @type {?} */ exp = [];
        var /** @type {?} */ expansionFormStack = [TokenType$1.EXPANSION_CASE_EXP_START];
        while (true) {
            if (this._peek.type === TokenType$1.EXPANSION_FORM_START ||
                this._peek.type === TokenType$1.EXPANSION_CASE_EXP_START) {
                expansionFormStack.push(this._peek.type);
            }
            if (this._peek.type === TokenType$1.EXPANSION_CASE_EXP_END) {
                if (lastOnStack(expansionFormStack, TokenType$1.EXPANSION_CASE_EXP_START)) {
                    expansionFormStack.pop();
                    if (expansionFormStack.length == 0)
                        return exp;
                }
                else {
                    this._errors.push(TreeError.create(null, start.sourceSpan, "Invalid ICU message. Missing '}'."));
                    return null;
                }
            }
            if (this._peek.type === TokenType$1.EXPANSION_FORM_END) {
                if (lastOnStack(expansionFormStack, TokenType$1.EXPANSION_FORM_START)) {
                    expansionFormStack.pop();
                }
                else {
                    this._errors.push(TreeError.create(null, start.sourceSpan, "Invalid ICU message. Missing '}'."));
                    return null;
                }
            }
            if (this._peek.type === TokenType$1.EOF) {
                this._errors.push(TreeError.create(null, start.sourceSpan, "Invalid ICU message. Missing '}'."));
                return null;
            }
            exp.push(this._advance());
        }
    };
    /**
     * @param {?} token
     * @return {?}
     */
    _TreeBuilder.prototype._consumeText = function (token) {
        var /** @type {?} */ text = token.parts[0];
        if (text.length > 0 && text[0] == '\n') {
            var /** @type {?} */ parent = this._getParentElement();
            if (parent != null && parent.children.length == 0 &&
                this.getTagDefinition(parent.name).ignoreFirstLf) {
                text = text.substring(1);
            }
        }
        if (text.length > 0) {
            this._addToParent(new Text(text, token.sourceSpan));
        }
    };
    /**
     * @return {?}
     */
    _TreeBuilder.prototype._closeVoidElement = function () {
        if (this._elementStack.length > 0) {
            var /** @type {?} */ el = this._elementStack[this._elementStack.length - 1];
            if (this.getTagDefinition(el.name).isVoid) {
                this._elementStack.pop();
            }
        }
    };
    /**
     * @param {?} startTagToken
     * @return {?}
     */
    _TreeBuilder.prototype._consumeStartTag = function (startTagToken) {
        var /** @type {?} */ prefix = startTagToken.parts[0];
        var /** @type {?} */ name = startTagToken.parts[1];
        var /** @type {?} */ attrs = [];
        while (this._peek.type === TokenType$1.ATTR_NAME) {
            attrs.push(this._consumeAttr(this._advance()));
        }
        var /** @type {?} */ fullName = this._getElementFullName(prefix, name, this._getParentElement());
        var /** @type {?} */ selfClosing = false;
        // Note: There could have been a tokenizer error
        // so that we don't get a token for the end tag...
        if (this._peek.type === TokenType$1.TAG_OPEN_END_VOID) {
            this._advance();
            selfClosing = true;
            var /** @type {?} */ tagDef = this.getTagDefinition(fullName);
            if (!(tagDef.canSelfClose || getNsPrefix(fullName) !== null || tagDef.isVoid)) {
                this._errors.push(TreeError.create(fullName, startTagToken.sourceSpan, "Only void and foreign elements can be self closed \"" + startTagToken.parts[1] + "\""));
            }
        }
        else if (this._peek.type === TokenType$1.TAG_OPEN_END) {
            this._advance();
            selfClosing = false;
        }
        var /** @type {?} */ end = this._peek.sourceSpan.start;
        var /** @type {?} */ span = new ParseSourceSpan(startTagToken.sourceSpan.start, end);
        var /** @type {?} */ el = new Element(fullName, attrs, [], span, span, undefined);
        this._pushElement(el);
        if (selfClosing) {
            this._popElement(fullName);
            el.endSourceSpan = span;
        }
    };
    /**
     * @param {?} el
     * @return {?}
     */
    _TreeBuilder.prototype._pushElement = function (el) {
        if (this._elementStack.length > 0) {
            var /** @type {?} */ parentEl = this._elementStack[this._elementStack.length - 1];
            if (this.getTagDefinition(parentEl.name).isClosedByChild(el.name)) {
                this._elementStack.pop();
            }
        }
        var /** @type {?} */ tagDef = this.getTagDefinition(el.name);
        var _a = this._getParentElementSkippingContainers(), parent = _a.parent, container = _a.container;
        if (parent && tagDef.requireExtraParent(parent.name)) {
            var /** @type {?} */ newParent = new Element(tagDef.parentToAdd, [], [], el.sourceSpan, el.startSourceSpan, el.endSourceSpan);
            this._insertBeforeContainer(parent, container, newParent);
        }
        this._addToParent(el);
        this._elementStack.push(el);
    };
    /**
     * @param {?} endTagToken
     * @return {?}
     */
    _TreeBuilder.prototype._consumeEndTag = function (endTagToken) {
        var /** @type {?} */ fullName = this._getElementFullName(endTagToken.parts[0], endTagToken.parts[1], this._getParentElement());
        if (this._getParentElement()) {
            ((this._getParentElement())).endSourceSpan = endTagToken.sourceSpan;
        }
        if (this.getTagDefinition(fullName).isVoid) {
            this._errors.push(TreeError.create(fullName, endTagToken.sourceSpan, "Void elements do not have end tags \"" + endTagToken.parts[1] + "\""));
        }
        else if (!this._popElement(fullName)) {
            var /** @type {?} */ errMsg = "Unexpected closing tag \"" + fullName + "\". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags";
            this._errors.push(TreeError.create(fullName, endTagToken.sourceSpan, errMsg));
        }
    };
    /**
     * @param {?} fullName
     * @return {?}
     */
    _TreeBuilder.prototype._popElement = function (fullName) {
        for (var /** @type {?} */ stackIndex = this._elementStack.length - 1; stackIndex >= 0; stackIndex--) {
            var /** @type {?} */ el = this._elementStack[stackIndex];
            if (el.name == fullName) {
                this._elementStack.splice(stackIndex, this._elementStack.length - stackIndex);
                return true;
            }
            if (!this.getTagDefinition(el.name).closedByParent) {
                return false;
            }
        }
        return false;
    };
    /**
     * @param {?} attrName
     * @return {?}
     */
    _TreeBuilder.prototype._consumeAttr = function (attrName) {
        var /** @type {?} */ fullName = mergeNsAndName(attrName.parts[0], attrName.parts[1]);
        var /** @type {?} */ end = attrName.sourceSpan.end;
        var /** @type {?} */ value = '';
        var /** @type {?} */ valueSpan = ((undefined));
        if (this._peek.type === TokenType$1.ATTR_VALUE) {
            var /** @type {?} */ valueToken = this._advance();
            value = valueToken.parts[0];
            end = valueToken.sourceSpan.end;
            valueSpan = valueToken.sourceSpan;
        }
        return new Attribute$1(fullName, value, new ParseSourceSpan(attrName.sourceSpan.start, end), valueSpan);
    };
    /**
     * @return {?}
     */
    _TreeBuilder.prototype._getParentElement = function () {
        return this._elementStack.length > 0 ? this._elementStack[this._elementStack.length - 1] : null;
    };
    /**
     * Returns the parent in the DOM and the container.
     *
     * `<ng-container>` elements are skipped as they are not rendered as DOM element.
     * @return {?}
     */
    _TreeBuilder.prototype._getParentElementSkippingContainers = function () {
        var /** @type {?} */ container = null;
        for (var /** @type {?} */ i = this._elementStack.length - 1; i >= 0; i--) {
            if (!isNgContainer(this._elementStack[i].name)) {
                return { parent: this._elementStack[i], container: container };
            }
            container = this._elementStack[i];
        }
        return { parent: this._elementStack[this._elementStack.length - 1], container: container };
    };
    /**
     * @param {?} node
     * @return {?}
     */
    _TreeBuilder.prototype._addToParent = function (node) {
        var /** @type {?} */ parent = this._getParentElement();
        if (parent != null) {
            parent.children.push(node);
        }
        else {
            this._rootNodes.push(node);
        }
    };
    /**
     * Insert a node between the parent and the container.
     * When no container is given, the node is appended as a child of the parent.
     * Also updates the element stack accordingly.
     *
     * \@internal
     * @param {?} parent
     * @param {?} container
     * @param {?} node
     * @return {?}
     */
    _TreeBuilder.prototype._insertBeforeContainer = function (parent, container, node) {
        if (!container) {
            this._addToParent(node);
            this._elementStack.push(node);
        }
        else {
            if (parent) {
                // replace the container with the new node in the children
                var /** @type {?} */ index = parent.children.indexOf(container);
                parent.children[index] = node;
            }
            else {
                this._rootNodes.push(node);
            }
            node.children.push(container);
            this._elementStack.splice(this._elementStack.indexOf(container), 0, node);
        }
    };
    /**
     * @param {?} prefix
     * @param {?} localName
     * @param {?} parentElement
     * @return {?}
     */
    _TreeBuilder.prototype._getElementFullName = function (prefix, localName, parentElement) {
        if (prefix == null) {
            prefix = ((this.getTagDefinition(localName).implicitNamespacePrefix));
            if (prefix == null && parentElement != null) {
                prefix = getNsPrefix(parentElement.name);
            }
        }
        return mergeNsAndName(prefix, localName);
    };
    return _TreeBuilder;
}());
/**
 * @param {?} stack
 * @param {?} element
 * @return {?}
 */
function lastOnStack(stack, element) {
    return stack.length > 0 && stack[stack.length - 1] === element;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var Message = (function () {
    /**
     * @param {?} nodes message AST
     * @param {?} placeholders maps placeholder names to static content
     * @param {?} placeholderToMessage maps placeholder names to messages (used for nested ICU messages)
     * @param {?} meaning
     * @param {?} description
     * @param {?} id
     */
    function Message(nodes, placeholders, placeholderToMessage, meaning, description, id) {
        this.nodes = nodes;
        this.placeholders = placeholders;
        this.placeholderToMessage = placeholderToMessage;
        this.meaning = meaning;
        this.description = description;
        this.id = id;
        if (nodes.length) {
            this.sources = [{
                    filePath: nodes[0].sourceSpan.start.file.url,
                    startLine: nodes[0].sourceSpan.start.line + 1,
                    startCol: nodes[0].sourceSpan.start.col + 1,
                    endLine: nodes[nodes.length - 1].sourceSpan.end.line + 1,
                    endCol: nodes[0].sourceSpan.start.col + 1
                }];
        }
        else {
            this.sources = [];
        }
    }
    return Message;
}());
var Text$1 = (function () {
    /**
     * @param {?} value
     * @param {?} sourceSpan
     */
    function Text$1(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    Text$1.prototype.visit = function (visitor, context) { return visitor.visitText(this, context); };
    return Text$1;
}());
var Container = (function () {
    /**
     * @param {?} children
     * @param {?} sourceSpan
     */
    function Container(children, sourceSpan) {
        this.children = children;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    Container.prototype.visit = function (visitor, context) { return visitor.visitContainer(this, context); };
    return Container;
}());
var Icu = (function () {
    /**
     * @param {?} expression
     * @param {?} type
     * @param {?} cases
     * @param {?} sourceSpan
     */
    function Icu(expression, type, cases, sourceSpan) {
        this.expression = expression;
        this.type = type;
        this.cases = cases;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    Icu.prototype.visit = function (visitor, context) { return visitor.visitIcu(this, context); };
    return Icu;
}());
var TagPlaceholder = (function () {
    /**
     * @param {?} tag
     * @param {?} attrs
     * @param {?} startName
     * @param {?} closeName
     * @param {?} children
     * @param {?} isVoid
     * @param {?} sourceSpan
     */
    function TagPlaceholder(tag, attrs, startName, closeName, children, isVoid, sourceSpan) {
        this.tag = tag;
        this.attrs = attrs;
        this.startName = startName;
        this.closeName = closeName;
        this.children = children;
        this.isVoid = isVoid;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    TagPlaceholder.prototype.visit = function (visitor, context) { return visitor.visitTagPlaceholder(this, context); };
    return TagPlaceholder;
}());
var Placeholder = (function () {
    /**
     * @param {?} value
     * @param {?} name
     * @param {?} sourceSpan
     */
    function Placeholder(value, name, sourceSpan) {
        this.value = value;
        this.name = name;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    Placeholder.prototype.visit = function (visitor, context) { return visitor.visitPlaceholder(this, context); };
    return Placeholder;
}());
var IcuPlaceholder = (function () {
    /**
     * @param {?} value
     * @param {?} name
     * @param {?} sourceSpan
     */
    function IcuPlaceholder(value, name, sourceSpan) {
        this.value = value;
        this.name = name;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    IcuPlaceholder.prototype.visit = function (visitor, context) { return visitor.visitIcuPlaceholder(this, context); };
    return IcuPlaceholder;
}());
var CloneVisitor = (function () {
    function CloneVisitor() {
    }
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    CloneVisitor.prototype.visitText = function (text, context) { return new Text$1(text.value, text.sourceSpan); };
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    CloneVisitor.prototype.visitContainer = function (container, context) {
        var _this = this;
        var /** @type {?} */ children = container.children.map(function (n) { return n.visit(_this, context); });
        return new Container(children, container.sourceSpan);
    };
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    CloneVisitor.prototype.visitIcu = function (icu, context) {
        var _this = this;
        var /** @type {?} */ cases = {};
        Object.keys(icu.cases).forEach(function (key) { return cases[key] = icu.cases[key].visit(_this, context); });
        var /** @type {?} */ msg = new Icu(icu.expression, icu.type, cases, icu.sourceSpan);
        msg.expressionPlaceholder = icu.expressionPlaceholder;
        return msg;
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    CloneVisitor.prototype.visitTagPlaceholder = function (ph, context) {
        var _this = this;
        var /** @type {?} */ children = ph.children.map(function (n) { return n.visit(_this, context); });
        return new TagPlaceholder(ph.tag, ph.attrs, ph.startName, ph.closeName, children, ph.isVoid, ph.sourceSpan);
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    CloneVisitor.prototype.visitPlaceholder = function (ph, context) {
        return new Placeholder(ph.value, ph.name, ph.sourceSpan);
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    CloneVisitor.prototype.visitIcuPlaceholder = function (ph, context) {
        return new IcuPlaceholder(ph.value, ph.name, ph.sourceSpan);
    };
    return CloneVisitor;
}());
var RecurseVisitor = (function () {
    function RecurseVisitor() {
    }
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    RecurseVisitor.prototype.visitText = function (text, context) { };
    ;
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    RecurseVisitor.prototype.visitContainer = function (container, context) {
        var _this = this;
        container.children.forEach(function (child) { return child.visit(_this); });
    };
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    RecurseVisitor.prototype.visitIcu = function (icu, context) {
        var _this = this;
        Object.keys(icu.cases).forEach(function (k) { icu.cases[k].visit(_this); });
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    RecurseVisitor.prototype.visitTagPlaceholder = function (ph, context) {
        var _this = this;
        ph.children.forEach(function (child) { return child.visit(_this); });
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    RecurseVisitor.prototype.visitPlaceholder = function (ph, context) { };
    ;
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    RecurseVisitor.prototype.visitIcuPlaceholder = function (ph, context) { };
    ;
    return RecurseVisitor;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var TAG_TO_PLACEHOLDER_NAMES = {
    'A': 'LINK',
    'B': 'BOLD_TEXT',
    'BR': 'LINE_BREAK',
    'EM': 'EMPHASISED_TEXT',
    'H1': 'HEADING_LEVEL1',
    'H2': 'HEADING_LEVEL2',
    'H3': 'HEADING_LEVEL3',
    'H4': 'HEADING_LEVEL4',
    'H5': 'HEADING_LEVEL5',
    'H6': 'HEADING_LEVEL6',
    'HR': 'HORIZONTAL_RULE',
    'I': 'ITALIC_TEXT',
    'LI': 'LIST_ITEM',
    'LINK': 'MEDIA_LINK',
    'OL': 'ORDERED_LIST',
    'P': 'PARAGRAPH',
    'Q': 'QUOTATION',
    'S': 'STRIKETHROUGH_TEXT',
    'SMALL': 'SMALL_TEXT',
    'SUB': 'SUBSTRIPT',
    'SUP': 'SUPERSCRIPT',
    'TBODY': 'TABLE_BODY',
    'TD': 'TABLE_CELL',
    'TFOOT': 'TABLE_FOOTER',
    'TH': 'TABLE_HEADER_CELL',
    'THEAD': 'TABLE_HEADER',
    'TR': 'TABLE_ROW',
    'TT': 'MONOSPACED_TEXT',
    'U': 'UNDERLINED_TEXT',
    'UL': 'UNORDERED_LIST',
};
/**
 * Creates unique names for placeholder with different content.
 *
 * Returns the same placeholder name when the content is identical.
 *
 * \@internal
 */
var PlaceholderRegistry = (function () {
    function PlaceholderRegistry() {
        this._placeHolderNameCounts = {};
        this._signatureToName = {};
    }
    /**
     * @param {?} tag
     * @param {?} attrs
     * @param {?} isVoid
     * @return {?}
     */
    PlaceholderRegistry.prototype.getStartTagPlaceholderName = function (tag, attrs, isVoid) {
        var /** @type {?} */ signature = this._hashTag(tag, attrs, isVoid);
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        var /** @type {?} */ upperTag = tag.toUpperCase();
        var /** @type {?} */ baseName = TAG_TO_PLACEHOLDER_NAMES[upperTag] || "TAG_" + upperTag;
        var /** @type {?} */ name = this._generateUniqueName(isVoid ? baseName : "START_" + baseName);
        this._signatureToName[signature] = name;
        return name;
    };
    /**
     * @param {?} tag
     * @return {?}
     */
    PlaceholderRegistry.prototype.getCloseTagPlaceholderName = function (tag) {
        var /** @type {?} */ signature = this._hashClosingTag(tag);
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        var /** @type {?} */ upperTag = tag.toUpperCase();
        var /** @type {?} */ baseName = TAG_TO_PLACEHOLDER_NAMES[upperTag] || "TAG_" + upperTag;
        var /** @type {?} */ name = this._generateUniqueName("CLOSE_" + baseName);
        this._signatureToName[signature] = name;
        return name;
    };
    /**
     * @param {?} name
     * @param {?} content
     * @return {?}
     */
    PlaceholderRegistry.prototype.getPlaceholderName = function (name, content) {
        var /** @type {?} */ upperName = name.toUpperCase();
        var /** @type {?} */ signature = "PH: " + upperName + "=" + content;
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        var /** @type {?} */ uniqueName = this._generateUniqueName(upperName);
        this._signatureToName[signature] = uniqueName;
        return uniqueName;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    PlaceholderRegistry.prototype.getUniquePlaceholder = function (name) {
        return this._generateUniqueName(name.toUpperCase());
    };
    /**
     * @param {?} tag
     * @param {?} attrs
     * @param {?} isVoid
     * @return {?}
     */
    PlaceholderRegistry.prototype._hashTag = function (tag, attrs, isVoid) {
        var /** @type {?} */ start = "<" + tag;
        var /** @type {?} */ strAttrs = Object.keys(attrs).sort().map(function (name) { return " " + name + "=" + attrs[name]; }).join('');
        var /** @type {?} */ end = isVoid ? '/>' : "></" + tag + ">";
        return start + strAttrs + end;
    };
    /**
     * @param {?} tag
     * @return {?}
     */
    PlaceholderRegistry.prototype._hashClosingTag = function (tag) { return this._hashTag("/" + tag, {}, false); };
    /**
     * @param {?} base
     * @return {?}
     */
    PlaceholderRegistry.prototype._generateUniqueName = function (base) {
        var /** @type {?} */ seen = this._placeHolderNameCounts.hasOwnProperty(base);
        if (!seen) {
            this._placeHolderNameCounts[base] = 1;
            return base;
        }
        var /** @type {?} */ id = this._placeHolderNameCounts[base];
        this._placeHolderNameCounts[base] = id + 1;
        return base + "_" + id;
    };
    return PlaceholderRegistry;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var _expParser = new Parser(new Lexer());
/**
 * Returns a function converting html nodes to an i18n Message given an interpolationConfig
 * @param {?} interpolationConfig
 * @return {?}
 */
function createI18nMessageFactory(interpolationConfig) {
    var /** @type {?} */ visitor = new _I18nVisitor(_expParser, interpolationConfig);
    return function (nodes, meaning, description, id) { return visitor.toI18nMessage(nodes, meaning, description, id); };
}
var _I18nVisitor = (function () {
    /**
     * @param {?} _expressionParser
     * @param {?} _interpolationConfig
     */
    function _I18nVisitor(_expressionParser, _interpolationConfig) {
        this._expressionParser = _expressionParser;
        this._interpolationConfig = _interpolationConfig;
    }
    /**
     * @param {?} nodes
     * @param {?} meaning
     * @param {?} description
     * @param {?} id
     * @return {?}
     */
    _I18nVisitor.prototype.toI18nMessage = function (nodes, meaning, description, id) {
        this._isIcu = nodes.length == 1 && nodes[0] instanceof Expansion;
        this._icuDepth = 0;
        this._placeholderRegistry = new PlaceholderRegistry();
        this._placeholderToContent = {};
        this._placeholderToMessage = {};
        var /** @type {?} */ i18nodes = visitAll(this, nodes, {});
        return new Message(i18nodes, this._placeholderToContent, this._placeholderToMessage, meaning, description, id);
    };
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    _I18nVisitor.prototype.visitElement = function (el, context) {
        var /** @type {?} */ children = visitAll(this, el.children);
        var /** @type {?} */ attrs = {};
        el.attrs.forEach(function (attr) {
            // Do not visit the attributes, translatable ones are top-level ASTs
            attrs[attr.name] = attr.value;
        });
        var /** @type {?} */ isVoid = getHtmlTagDefinition(el.name).isVoid;
        var /** @type {?} */ startPhName = this._placeholderRegistry.getStartTagPlaceholderName(el.name, attrs, isVoid);
        this._placeholderToContent[startPhName] = ((el.sourceSpan)).toString();
        var /** @type {?} */ closePhName = '';
        if (!isVoid) {
            closePhName = this._placeholderRegistry.getCloseTagPlaceholderName(el.name);
            this._placeholderToContent[closePhName] = "</" + el.name + ">";
        }
        return new TagPlaceholder(el.name, attrs, startPhName, closePhName, children, isVoid, /** @type {?} */ ((el.sourceSpan)));
    };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    _I18nVisitor.prototype.visitAttribute = function (attribute, context) {
        return this._visitTextWithInterpolation(attribute.value, attribute.sourceSpan);
    };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    _I18nVisitor.prototype.visitText = function (text, context) {
        return this._visitTextWithInterpolation(text.value, /** @type {?} */ ((text.sourceSpan)));
    };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    _I18nVisitor.prototype.visitComment = function (comment, context) { return null; };
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    _I18nVisitor.prototype.visitExpansion = function (icu, context) {
        var _this = this;
        this._icuDepth++;
        var /** @type {?} */ i18nIcuCases = {};
        var /** @type {?} */ i18nIcu = new Icu(icu.switchValue, icu.type, i18nIcuCases, icu.sourceSpan);
        icu.cases.forEach(function (caze) {
            i18nIcuCases[caze.value] = new Container(caze.expression.map(function (node) { return node.visit(_this, {}); }), caze.expSourceSpan);
        });
        this._icuDepth--;
        if (this._isIcu || this._icuDepth > 0) {
            // Returns an ICU node when:
            // - the message (vs a part of the message) is an ICU message, or
            // - the ICU message is nested.
            var /** @type {?} */ expPh = this._placeholderRegistry.getUniquePlaceholder("VAR_" + icu.type);
            i18nIcu.expressionPlaceholder = expPh;
            this._placeholderToContent[expPh] = icu.switchValue;
            return i18nIcu;
        }
        // Else returns a placeholder
        // ICU placeholders should not be replaced with their original content but with the their
        // translations. We need to create a new visitor (they are not re-entrant) to compute the
        // message id.
        // TODO(vicb): add a html.Node -> i18n.Message cache to avoid having to re-create the msg
        var /** @type {?} */ phName = this._placeholderRegistry.getPlaceholderName('ICU', icu.sourceSpan.toString());
        var /** @type {?} */ visitor = new _I18nVisitor(this._expressionParser, this._interpolationConfig);
        this._placeholderToMessage[phName] = visitor.toI18nMessage([icu], '', '', '');
        return new IcuPlaceholder(i18nIcu, phName, icu.sourceSpan);
    };
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    _I18nVisitor.prototype.visitExpansionCase = function (icuCase, context) {
        throw new Error('Unreachable code');
    };
    /**
     * @param {?} text
     * @param {?} sourceSpan
     * @return {?}
     */
    _I18nVisitor.prototype._visitTextWithInterpolation = function (text, sourceSpan) {
        var /** @type {?} */ splitInterpolation = this._expressionParser.splitInterpolation(text, sourceSpan.start.toString(), this._interpolationConfig);
        if (!splitInterpolation) {
            // No expression, return a single text
            return new Text$1(text, sourceSpan);
        }
        // Return a group of text + expressions
        var /** @type {?} */ nodes = [];
        var /** @type {?} */ container = new Container(nodes, sourceSpan);
        var _a = this._interpolationConfig, sDelimiter = _a.start, eDelimiter = _a.end;
        for (var /** @type {?} */ i = 0; i < splitInterpolation.strings.length - 1; i++) {
            var /** @type {?} */ expression = splitInterpolation.expressions[i];
            var /** @type {?} */ baseName = _extractPlaceholderName(expression) || 'INTERPOLATION';
            var /** @type {?} */ phName = this._placeholderRegistry.getPlaceholderName(baseName, expression);
            if (splitInterpolation.strings[i].length) {
                // No need to add empty strings
                nodes.push(new Text$1(splitInterpolation.strings[i], sourceSpan));
            }
            nodes.push(new Placeholder(expression, phName, sourceSpan));
            this._placeholderToContent[phName] = sDelimiter + expression + eDelimiter;
        }
        // The last index contains no expression
        var /** @type {?} */ lastStringIdx = splitInterpolation.strings.length - 1;
        if (splitInterpolation.strings[lastStringIdx].length) {
            nodes.push(new Text$1(splitInterpolation.strings[lastStringIdx], sourceSpan));
        }
        return container;
    };
    return _I18nVisitor;
}());
var _CUSTOM_PH_EXP = /\/\/[\s\S]*i18n[\s\S]*\([\s\S]*ph[\s\S]*=[\s\S]*("|')([\s\S]*?)\1[\s\S]*\)/g;
/**
 * @param {?} input
 * @return {?}
 */
function _extractPlaceholderName(input) {
    return input.split(_CUSTOM_PH_EXP)[2];
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * An i18n error.
 */
var I18nError = (function (_super) {
    __extends(I18nError, _super);
    /**
     * @param {?} span
     * @param {?} msg
     */
    function I18nError(span, msg) {
        return _super.call(this, span, msg) || this;
    }
    return I18nError;
}(ParseError));
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var _I18N_ATTR = 'i18n';
var _I18N_ATTR_PREFIX = 'i18n-';
var _I18N_COMMENT_PREFIX_REGEXP = /^i18n:?/;
var MEANING_SEPARATOR = '|';
var ID_SEPARATOR = '@@';
/**
 * Extract translatable messages from an html AST
 * @param {?} nodes
 * @param {?} interpolationConfig
 * @param {?} implicitTags
 * @param {?} implicitAttrs
 * @return {?}
 */
function extractMessages(nodes, interpolationConfig, implicitTags, implicitAttrs) {
    var /** @type {?} */ visitor = new _Visitor(implicitTags, implicitAttrs);
    return visitor.extract(nodes, interpolationConfig);
}
/**
 * @param {?} nodes
 * @param {?} translations
 * @param {?} interpolationConfig
 * @param {?} implicitTags
 * @param {?} implicitAttrs
 * @return {?}
 */
function mergeTranslations(nodes, translations, interpolationConfig, implicitTags, implicitAttrs) {
    var /** @type {?} */ visitor = new _Visitor(implicitTags, implicitAttrs);
    return visitor.merge(nodes, translations, interpolationConfig);
}
var ExtractionResult = (function () {
    /**
     * @param {?} messages
     * @param {?} errors
     */
    function ExtractionResult(messages, errors) {
        this.messages = messages;
        this.errors = errors;
    }
    return ExtractionResult;
}());
var _VisitorMode = {};
_VisitorMode.Extract = 0;
_VisitorMode.Merge = 1;
_VisitorMode[_VisitorMode.Extract] = "Extract";
_VisitorMode[_VisitorMode.Merge] = "Merge";
/**
 * This Visitor is used:
 * 1. to extract all the translatable strings from an html AST (see `extract()`),
 * 2. to replace the translatable strings with the actual translations (see `merge()`)
 *
 * \@internal
 */
var _Visitor = (function () {
    /**
     * @param {?} _implicitTags
     * @param {?} _implicitAttrs
     */
    function _Visitor(_implicitTags, _implicitAttrs) {
        this._implicitTags = _implicitTags;
        this._implicitAttrs = _implicitAttrs;
    }
    /**
     * Extracts the messages from the tree
     * @param {?} nodes
     * @param {?} interpolationConfig
     * @return {?}
     */
    _Visitor.prototype.extract = function (nodes, interpolationConfig) {
        var _this = this;
        this._init(_VisitorMode.Extract, interpolationConfig);
        nodes.forEach(function (node) { return node.visit(_this, null); });
        if (this._inI18nBlock) {
            this._reportError(nodes[nodes.length - 1], 'Unclosed block');
        }
        return new ExtractionResult(this._messages, this._errors);
    };
    /**
     * Returns a tree where all translatable nodes are translated
     * @param {?} nodes
     * @param {?} translations
     * @param {?} interpolationConfig
     * @return {?}
     */
    _Visitor.prototype.merge = function (nodes, translations, interpolationConfig) {
        this._init(_VisitorMode.Merge, interpolationConfig);
        this._translations = translations;
        // Construct a single fake root element
        var /** @type {?} */ wrapper = new Element('wrapper', [], nodes, /** @type {?} */ ((undefined)), undefined, undefined);
        var /** @type {?} */ translatedNode = wrapper.visit(this, null);
        if (this._inI18nBlock) {
            this._reportError(nodes[nodes.length - 1], 'Unclosed block');
        }
        return new ParseTreeResult(translatedNode.children, this._errors);
    };
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    _Visitor.prototype.visitExpansionCase = function (icuCase, context) {
        // Parse cases for translatable html attributes
        var /** @type {?} */ expression = visitAll(this, icuCase.expression, context);
        if (this._mode === _VisitorMode.Merge) {
            return new ExpansionCase(icuCase.value, expression, icuCase.sourceSpan, icuCase.valueSourceSpan, icuCase.expSourceSpan);
        }
    };
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    _Visitor.prototype.visitExpansion = function (icu, context) {
        this._mayBeAddBlockChildren(icu);
        var /** @type {?} */ wasInIcu = this._inIcu;
        if (!this._inIcu) {
            // nested ICU messages should not be extracted but top-level translated as a whole
            if (this._isInTranslatableSection) {
                this._addMessage([icu]);
            }
            this._inIcu = true;
        }
        var /** @type {?} */ cases = visitAll(this, icu.cases, context);
        if (this._mode === _VisitorMode.Merge) {
            icu = new Expansion(icu.switchValue, icu.type, cases, icu.sourceSpan, icu.switchValueSourceSpan);
        }
        this._inIcu = wasInIcu;
        return icu;
    };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    _Visitor.prototype.visitComment = function (comment, context) {
        var /** @type {?} */ isOpening = _isOpeningComment(comment);
        if (isOpening && this._isInTranslatableSection) {
            this._reportError(comment, 'Could not start a block inside a translatable section');
            return;
        }
        var /** @type {?} */ isClosing = _isClosingComment(comment);
        if (isClosing && !this._inI18nBlock) {
            this._reportError(comment, 'Trying to close an unopened block');
            return;
        }
        if (!this._inI18nNode && !this._inIcu) {
            if (!this._inI18nBlock) {
                if (isOpening) {
                    this._inI18nBlock = true;
                    this._blockStartDepth = this._depth;
                    this._blockChildren = [];
                    this._blockMeaningAndDesc = ((comment.value)).replace(_I18N_COMMENT_PREFIX_REGEXP, '').trim();
                    this._openTranslatableSection(comment);
                }
            }
            else {
                if (isClosing) {
                    if (this._depth == this._blockStartDepth) {
                        this._closeTranslatableSection(comment, this._blockChildren);
                        this._inI18nBlock = false;
                        var /** @type {?} */ message = ((this._addMessage(this._blockChildren, this._blockMeaningAndDesc)));
                        // merge attributes in sections
                        var /** @type {?} */ nodes = this._translateMessage(comment, message);
                        return visitAll(this, nodes);
                    }
                    else {
                        this._reportError(comment, 'I18N blocks should not cross element boundaries');
                        return;
                    }
                }
            }
        }
    };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    _Visitor.prototype.visitText = function (text, context) {
        if (this._isInTranslatableSection) {
            this._mayBeAddBlockChildren(text);
        }
        return text;
    };
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    _Visitor.prototype.visitElement = function (el, context) {
        var _this = this;
        this._mayBeAddBlockChildren(el);
        this._depth++;
        var /** @type {?} */ wasInI18nNode = this._inI18nNode;
        var /** @type {?} */ wasInImplicitNode = this._inImplicitNode;
        var /** @type {?} */ childNodes = [];
        var /** @type {?} */ translatedChildNodes = ((undefined));
        // Extract:
        // - top level nodes with the (implicit) "i18n" attribute if not already in a section
        // - ICU messages
        var /** @type {?} */ i18nAttr = _getI18nAttr(el);
        var /** @type {?} */ i18nMeta = i18nAttr ? i18nAttr.value : '';
        var /** @type {?} */ isImplicit = this._implicitTags.some(function (tag) { return el.name === tag; }) && !this._inIcu &&
            !this._isInTranslatableSection;
        var /** @type {?} */ isTopLevelImplicit = !wasInImplicitNode && isImplicit;
        this._inImplicitNode = wasInImplicitNode || isImplicit;
        if (!this._isInTranslatableSection && !this._inIcu) {
            if (i18nAttr || isTopLevelImplicit) {
                this._inI18nNode = true;
                var /** @type {?} */ message = ((this._addMessage(el.children, i18nMeta)));
                translatedChildNodes = this._translateMessage(el, message);
            }
            if (this._mode == _VisitorMode.Extract) {
                var /** @type {?} */ isTranslatable = i18nAttr || isTopLevelImplicit;
                if (isTranslatable)
                    this._openTranslatableSection(el);
                visitAll(this, el.children);
                if (isTranslatable)
                    this._closeTranslatableSection(el, el.children);
            }
        }
        else {
            if (i18nAttr || isTopLevelImplicit) {
                this._reportError(el, 'Could not mark an element as translatable inside a translatable section');
            }
            if (this._mode == _VisitorMode.Extract) {
                // Descend into child nodes for extraction
                visitAll(this, el.children);
            }
        }
        if (this._mode === _VisitorMode.Merge) {
            var /** @type {?} */ visitNodes = translatedChildNodes || el.children;
            visitNodes.forEach(function (child) {
                var /** @type {?} */ visited = child.visit(_this, context);
                if (visited && !_this._isInTranslatableSection) {
                    // Do not add the children from translatable sections (= i18n blocks here)
                    // They will be added later in this loop when the block closes (i.e. on `<!-- /i18n -->`)
                    childNodes = childNodes.concat(visited);
                }
            });
        }
        this._visitAttributesOf(el);
        this._depth--;
        this._inI18nNode = wasInI18nNode;
        this._inImplicitNode = wasInImplicitNode;
        if (this._mode === _VisitorMode.Merge) {
            var /** @type {?} */ translatedAttrs = this._translateAttributes(el);
            return new Element(el.name, translatedAttrs, childNodes, el.sourceSpan, el.startSourceSpan, el.endSourceSpan);
        }
        return null;
    };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    _Visitor.prototype.visitAttribute = function (attribute, context) {
        throw new Error('unreachable code');
    };
    /**
     * @param {?} mode
     * @param {?} interpolationConfig
     * @return {?}
     */
    _Visitor.prototype._init = function (mode, interpolationConfig) {
        this._mode = mode;
        this._inI18nBlock = false;
        this._inI18nNode = false;
        this._depth = 0;
        this._inIcu = false;
        this._msgCountAtSectionStart = undefined;
        this._errors = [];
        this._messages = [];
        this._inImplicitNode = false;
        this._createI18nMessage = createI18nMessageFactory(interpolationConfig);
    };
    /**
     * @param {?} el
     * @return {?}
     */
    _Visitor.prototype._visitAttributesOf = function (el) {
        var _this = this;
        var /** @type {?} */ explicitAttrNameToValue = {};
        var /** @type {?} */ implicitAttrNames = this._implicitAttrs[el.name] || [];
        el.attrs.filter(function (attr) { return attr.name.startsWith(_I18N_ATTR_PREFIX); })
            .forEach(function (attr) { return explicitAttrNameToValue[attr.name.slice(_I18N_ATTR_PREFIX.length)] =
            attr.value; });
        el.attrs.forEach(function (attr) {
            if (attr.name in explicitAttrNameToValue) {
                _this._addMessage([attr], explicitAttrNameToValue[attr.name]);
            }
            else if (implicitAttrNames.some(function (name) { return attr.name === name; })) {
                _this._addMessage([attr]);
            }
        });
    };
    /**
     * @param {?} ast
     * @param {?=} msgMeta
     * @return {?}
     */
    _Visitor.prototype._addMessage = function (ast, msgMeta) {
        if (ast.length == 0 ||
            ast.length == 1 && ast[0] instanceof Attribute$1 && !((ast[0])).value) {
            // Do not create empty messages
            return null;
        }
        var _a = _parseMessageMeta(msgMeta), meaning = _a.meaning, description = _a.description, id = _a.id;
        var /** @type {?} */ message = this._createI18nMessage(ast, meaning, description, id);
        this._messages.push(message);
        return message;
    };
    /**
     * @param {?} el
     * @param {?} message
     * @return {?}
     */
    _Visitor.prototype._translateMessage = function (el, message) {
        if (message && this._mode === _VisitorMode.Merge) {
            var /** @type {?} */ nodes = this._translations.get(message);
            if (nodes) {
                return nodes;
            }
            this._reportError(el, "Translation unavailable for message id=\"" + this._translations.digest(message) + "\"");
        }
        return [];
    };
    /**
     * @param {?} el
     * @return {?}
     */
    _Visitor.prototype._translateAttributes = function (el) {
        var _this = this;
        var /** @type {?} */ attributes = el.attrs;
        var /** @type {?} */ i18nParsedMessageMeta = {};
        attributes.forEach(function (attr) {
            if (attr.name.startsWith(_I18N_ATTR_PREFIX)) {
                i18nParsedMessageMeta[attr.name.slice(_I18N_ATTR_PREFIX.length)] =
                    _parseMessageMeta(attr.value);
            }
        });
        var /** @type {?} */ translatedAttributes = [];
        attributes.forEach(function (attr) {
            if (attr.name === _I18N_ATTR || attr.name.startsWith(_I18N_ATTR_PREFIX)) {
                // strip i18n specific attributes
                return;
            }
            if (attr.value && attr.value != '' && i18nParsedMessageMeta.hasOwnProperty(attr.name)) {
                var _a = i18nParsedMessageMeta[attr.name], meaning = _a.meaning, description = _a.description, id = _a.id;
                var /** @type {?} */ message = _this._createI18nMessage([attr], meaning, description, id);
                var /** @type {?} */ nodes = _this._translations.get(message);
                if (nodes) {
                    if (nodes.length == 0) {
                        translatedAttributes.push(new Attribute$1(attr.name, '', attr.sourceSpan));
                    }
                    else if (nodes[0] instanceof Text) {
                        var /** @type {?} */ value = ((nodes[0])).value;
                        translatedAttributes.push(new Attribute$1(attr.name, value, attr.sourceSpan));
                    }
                    else {
                        _this._reportError(el, "Unexpected translation for attribute \"" + attr.name + "\" (id=\"" + (id || _this._translations.digest(message)) + "\")");
                    }
                }
                else {
                    _this._reportError(el, "Translation unavailable for attribute \"" + attr.name + "\" (id=\"" + (id || _this._translations.digest(message)) + "\")");
                }
            }
            else {
                translatedAttributes.push(attr);
            }
        });
        return translatedAttributes;
    };
    /**
     * Add the node as a child of the block when:
     * - we are in a block,
     * - we are not inside a ICU message (those are handled separately),
     * - the node is a "direct child" of the block
     * @param {?} node
     * @return {?}
     */
    _Visitor.prototype._mayBeAddBlockChildren = function (node) {
        if (this._inI18nBlock && !this._inIcu && this._depth == this._blockStartDepth) {
            this._blockChildren.push(node);
        }
    };
    /**
     * Marks the start of a section, see `_closeTranslatableSection`
     * @param {?} node
     * @return {?}
     */
    _Visitor.prototype._openTranslatableSection = function (node) {
        if (this._isInTranslatableSection) {
            this._reportError(node, 'Unexpected section start');
        }
        else {
            this._msgCountAtSectionStart = this._messages.length;
        }
    };
    Object.defineProperty(_Visitor.prototype, "_isInTranslatableSection", {
        /**
         * A translatable section could be:
         * - the content of translatable element,
         * - nodes between `<!-- i18n -->` and `<!-- /i18n -->` comments
         * @return {?}
         */
        get: function () {
            return this._msgCountAtSectionStart !== void 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Terminates a section.
     *
     * If a section has only one significant children (comments not significant) then we should not
     * keep the message from this children:
     *
     * `<p i18n="meaning|description">{ICU message}</p>` would produce two messages:
     * - one for the <p> content with meaning and description,
     * - another one for the ICU message.
     *
     * In this case the last message is discarded as it contains less information (the AST is
     * otherwise identical).
     *
     * Note that we should still keep messages extracted from attributes inside the section (ie in the
     * ICU message here)
     * @param {?} node
     * @param {?} directChildren
     * @return {?}
     */
    _Visitor.prototype._closeTranslatableSection = function (node, directChildren) {
        if (!this._isInTranslatableSection) {
            this._reportError(node, 'Unexpected section end');
            return;
        }
        var /** @type {?} */ startIndex = this._msgCountAtSectionStart;
        var /** @type {?} */ significantChildren = directChildren.reduce(function (count, node) { return count + (node instanceof Comment ? 0 : 1); }, 0);
        if (significantChildren == 1) {
            for (var /** @type {?} */ i = this._messages.length - 1; i >= startIndex; i--) {
                var /** @type {?} */ ast = this._messages[i].nodes;
                if (!(ast.length == 1 && ast[0] instanceof Text$1)) {
                    this._messages.splice(i, 1);
                    break;
                }
            }
        }
        this._msgCountAtSectionStart = undefined;
    };
    /**
     * @param {?} node
     * @param {?} msg
     * @return {?}
     */
    _Visitor.prototype._reportError = function (node, msg) {
        this._errors.push(new I18nError(/** @type {?} */ ((node.sourceSpan)), msg));
    };
    return _Visitor;
}());
/**
 * @param {?} n
 * @return {?}
 */
function _isOpeningComment(n) {
    return !!(n instanceof Comment && n.value && n.value.startsWith('i18n'));
}
/**
 * @param {?} n
 * @return {?}
 */
function _isClosingComment(n) {
    return !!(n instanceof Comment && n.value && n.value === '/i18n');
}
/**
 * @param {?} p
 * @return {?}
 */
function _getI18nAttr(p) {
    return p.attrs.find(function (attr) { return attr.name === _I18N_ATTR; }) || null;
}
/**
 * @param {?=} i18n
 * @return {?}
 */
function _parseMessageMeta(i18n) {
    if (!i18n)
        return { meaning: '', description: '', id: '' };
    var /** @type {?} */ idIndex = i18n.indexOf(ID_SEPARATOR);
    var /** @type {?} */ descIndex = i18n.indexOf(MEANING_SEPARATOR);
    var _a = (idIndex > -1) ? [i18n.slice(0, idIndex), i18n.slice(idIndex + 2)] : [i18n, ''], meaningAndDesc = _a[0], id = _a[1];
    var _b = (descIndex > -1) ?
        [meaningAndDesc.slice(0, descIndex), meaningAndDesc.slice(descIndex + 1)] :
        ['', meaningAndDesc], meaning = _b[0], description = _b[1];
    return { meaning: meaning, description: description, id: id };
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var XmlTagDefinition = (function () {
    function XmlTagDefinition() {
        this.closedByParent = false;
        this.contentType = TagContentType.PARSABLE_DATA;
        this.isVoid = false;
        this.ignoreFirstLf = false;
        this.canSelfClose = true;
    }
    /**
     * @param {?} currentParent
     * @return {?}
     */
    XmlTagDefinition.prototype.requireExtraParent = function (currentParent) { return false; };
    /**
     * @param {?} name
     * @return {?}
     */
    XmlTagDefinition.prototype.isClosedByChild = function (name) { return false; };
    return XmlTagDefinition;
}());
var _TAG_DEFINITION = new XmlTagDefinition();
/**
 * @param {?} tagName
 * @return {?}
 */
function getXmlTagDefinition(tagName) {
    return _TAG_DEFINITION;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var XmlParser = (function (_super) {
    __extends(XmlParser, _super);
    function XmlParser() {
        return _super.call(this, getXmlTagDefinition) || this;
    }
    /**
     * @param {?} source
     * @param {?} url
     * @param {?=} parseExpansionForms
     * @return {?}
     */
    XmlParser.prototype.parse = function (source, url, parseExpansionForms) {
        if (parseExpansionForms === void 0) { parseExpansionForms = false; }
        return _super.prototype.parse.call(this, source, url, parseExpansionForms);
    };
    return XmlParser;
}(Parser$1));
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @param {?} message
 * @return {?}
 */
function digest(message) {
    return message.id || sha1(serializeNodes(message.nodes).join('') + ("[" + message.meaning + "]"));
}
/**
 * @param {?} message
 * @return {?}
 */
function decimalDigest(message) {
    if (message.id) {
        return message.id;
    }
    var /** @type {?} */ visitor = new _SerializerIgnoreIcuExpVisitor();
    var /** @type {?} */ parts = message.nodes.map(function (a) { return a.visit(visitor, null); });
    return computeMsgId(parts.join(''), message.meaning);
}
/**
 * Serialize the i18n ast to something xml-like in order to generate an UID.
 *
 * The visitor is also used in the i18n parser tests
 *
 * \@internal
 */
var _SerializerVisitor = (function () {
    function _SerializerVisitor() {
    }
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    _SerializerVisitor.prototype.visitText = function (text, context) { return text.value; };
    /**
     * @param {?} container
     * @param {?} context
     * @return {?}
     */
    _SerializerVisitor.prototype.visitContainer = function (container, context) {
        var _this = this;
        return "[" + container.children.map(function (child) { return child.visit(_this); }).join(', ') + "]";
    };
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    _SerializerVisitor.prototype.visitIcu = function (icu, context) {
        var _this = this;
        var /** @type {?} */ strCases = Object.keys(icu.cases).map(function (k) { return k + " {" + icu.cases[k].visit(_this) + "}"; });
        return "{" + icu.expression + ", " + icu.type + ", " + strCases.join(', ') + "}";
    };
    /**
     * @param {?} ph
     * @param {?} context
     * @return {?}
     */
    _SerializerVisitor.prototype.visitTagPlaceholder = function (ph, context) {
        var _this = this;
        return ph.isVoid ?
            "<ph tag name=\"" + ph.startName + "\"/>" :
            "<ph tag name=\"" + ph.startName + "\">" + ph.children.map(function (child) { return child.visit(_this); }).join(', ') + "</ph name=\"" + ph.closeName + "\">";
    };
    /**
     * @param {?} ph
     * @param {?} context
     * @return {?}
     */
    _SerializerVisitor.prototype.visitPlaceholder = function (ph, context) {
        return ph.value ? "<ph name=\"" + ph.name + "\">" + ph.value + "</ph>" : "<ph name=\"" + ph.name + "\"/>";
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    _SerializerVisitor.prototype.visitIcuPlaceholder = function (ph, context) {
        return "<ph icu name=\"" + ph.name + "\">" + ph.value.visit(this) + "</ph>";
    };
    return _SerializerVisitor;
}());
var serializerVisitor = new _SerializerVisitor();
/**
 * @param {?} nodes
 * @return {?}
 */
function serializeNodes(nodes) {
    return nodes.map(function (a) { return a.visit(serializerVisitor, null); });
}
/**
 * Serialize the i18n ast to something xml-like in order to generate an UID.
 *
 * Ignore the ICU expressions so that message IDs stays identical if only the expression changes.
 *
 * \@internal
 */
var _SerializerIgnoreIcuExpVisitor = (function (_super) {
    __extends(_SerializerIgnoreIcuExpVisitor, _super);
    function _SerializerIgnoreIcuExpVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    _SerializerIgnoreIcuExpVisitor.prototype.visitIcu = function (icu, context) {
        var _this = this;
        var /** @type {?} */ strCases = Object.keys(icu.cases).map(function (k) { return k + " {" + icu.cases[k].visit(_this) + "}"; });
        // Do not take the expression into account
        return "{" + icu.type + ", " + strCases.join(', ') + "}";
    };
    return _SerializerIgnoreIcuExpVisitor;
}(_SerializerVisitor));
/**
 * Compute the SHA1 of the given string
 *
 * see http://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf
 *
 * WARNING: this function has not been designed not tested with security in mind.
 *          DO NOT USE IT IN A SECURITY SENSITIVE CONTEXT.
 * @param {?} str
 * @return {?}
 */
function sha1(str) {
    var /** @type {?} */ utf8 = utf8Encode(str);
    var /** @type {?} */ words32 = stringToWords32(utf8, Endian.Big);
    var /** @type {?} */ len = utf8.length * 8;
    var /** @type {?} */ w = new Array(80);
    var _a = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0], a = _a[0], b = _a[1], c = _a[2], d = _a[3], e = _a[4];
    words32[len >> 5] |= 0x80 << (24 - len % 32);
    words32[((len + 64 >> 9) << 4) + 15] = len;
    for (var /** @type {?} */ i = 0; i < words32.length; i += 16) {
        var _b = [a, b, c, d, e], h0 = _b[0], h1 = _b[1], h2 = _b[2], h3 = _b[3], h4 = _b[4];
        for (var /** @type {?} */ j = 0; j < 80; j++) {
            if (j < 16) {
                w[j] = words32[i + j];
            }
            else {
                w[j] = rol32(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            }
            var _c = fk(j, b, c, d), f = _c[0], k = _c[1];
            var /** @type {?} */ temp = [rol32(a, 5), f, e, k, w[j]].reduce(add32);
            _d = [d, c, rol32(b, 30), a, temp], e = _d[0], d = _d[1], c = _d[2], b = _d[3], a = _d[4];
        }
        _e = [add32(a, h0), add32(b, h1), add32(c, h2), add32(d, h3), add32(e, h4)], a = _e[0], b = _e[1], c = _e[2], d = _e[3], e = _e[4];
    }
    return byteStringToHexString(words32ToByteString([a, b, c, d, e]));
    var _d, _e;
}
/**
 * @param {?} index
 * @param {?} b
 * @param {?} c
 * @param {?} d
 * @return {?}
 */
function fk(index, b, c, d) {
    if (index < 20) {
        return [(b & c) | (~b & d), 0x5a827999];
    }
    if (index < 40) {
        return [b ^ c ^ d, 0x6ed9eba1];
    }
    if (index < 60) {
        return [(b & c) | (b & d) | (c & d), 0x8f1bbcdc];
    }
    return [b ^ c ^ d, 0xca62c1d6];
}
/**
 * Compute the fingerprint of the given string
 *
 * The output is 64 bit number encoded as a decimal string
 *
 * based on:
 * https://github.com/google/closure-compiler/blob/master/src/com/google/javascript/jscomp/GoogleJsMessageIdGenerator.java
 * @param {?} str
 * @return {?}
 */
function fingerprint(str) {
    var /** @type {?} */ utf8 = utf8Encode(str);
    var _a = [hash32(utf8, 0), hash32(utf8, 102072)], hi = _a[0], lo = _a[1];
    if (hi == 0 && (lo == 0 || lo == 1)) {
        hi = hi ^ 0x130f9bef;
        lo = lo ^ -0x6b5f56d8;
    }
    return [hi, lo];
}
/**
 * @param {?} msg
 * @param {?} meaning
 * @return {?}
 */
function computeMsgId(msg, meaning) {
    var _a = fingerprint(msg), hi = _a[0], lo = _a[1];
    if (meaning) {
        var _b = fingerprint(meaning), him = _b[0], lom = _b[1];
        _c = add64(rol64([hi, lo], 1), [him, lom]), hi = _c[0], lo = _c[1];
    }
    return byteStringToDecString(words32ToByteString([hi & 0x7fffffff, lo]));
    var _c;
}
/**
 * @param {?} str
 * @param {?} c
 * @return {?}
 */
function hash32(str, c) {
    var _a = [0x9e3779b9, 0x9e3779b9], a = _a[0], b = _a[1];
    var /** @type {?} */ i;
    var /** @type {?} */ len = str.length;
    for (i = 0; i + 12 <= len; i += 12) {
        a = add32(a, wordAt(str, i, Endian.Little));
        b = add32(b, wordAt(str, i + 4, Endian.Little));
        c = add32(c, wordAt(str, i + 8, Endian.Little));
        _b = mix([a, b, c]), a = _b[0], b = _b[1], c = _b[2];
    }
    a = add32(a, wordAt(str, i, Endian.Little));
    b = add32(b, wordAt(str, i + 4, Endian.Little));
    // the first byte of c is reserved for the length
    c = add32(c, len);
    c = add32(c, wordAt(str, i + 8, Endian.Little) << 8);
    return mix([a, b, c])[2];
    var _b;
}
/**
 * @param {?} __0
 * @return {?}
 */
function mix(_a) {
    var a = _a[0], b = _a[1], c = _a[2];
    a = sub32(a, b);
    a = sub32(a, c);
    a ^= c >>> 13;
    b = sub32(b, c);
    b = sub32(b, a);
    b ^= a << 8;
    c = sub32(c, a);
    c = sub32(c, b);
    c ^= b >>> 13;
    a = sub32(a, b);
    a = sub32(a, c);
    a ^= c >>> 12;
    b = sub32(b, c);
    b = sub32(b, a);
    b ^= a << 16;
    c = sub32(c, a);
    c = sub32(c, b);
    c ^= b >>> 5;
    a = sub32(a, b);
    a = sub32(a, c);
    a ^= c >>> 3;
    b = sub32(b, c);
    b = sub32(b, a);
    b ^= a << 10;
    c = sub32(c, a);
    c = sub32(c, b);
    c ^= b >>> 15;
    return [a, b, c];
}
var Endian = {};
Endian.Little = 0;
Endian.Big = 1;
Endian[Endian.Little] = "Little";
Endian[Endian.Big] = "Big";
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function add32(a, b) {
    return add32to64(a, b)[1];
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function add32to64(a, b) {
    var /** @type {?} */ low = (a & 0xffff) + (b & 0xffff);
    var /** @type {?} */ high = (a >>> 16) + (b >>> 16) + (low >>> 16);
    return [high >>> 16, (high << 16) | (low & 0xffff)];
}
/**
 * @param {?} __0
 * @param {?} __1
 * @return {?}
 */
function add64(_a, _b) {
    var ah = _a[0], al = _a[1];
    var bh = _b[0], bl = _b[1];
    var _c = add32to64(al, bl), carry = _c[0], l = _c[1];
    var /** @type {?} */ h = add32(add32(ah, bh), carry);
    return [h, l];
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function sub32(a, b) {
    var /** @type {?} */ low = (a & 0xffff) - (b & 0xffff);
    var /** @type {?} */ high = (a >> 16) - (b >> 16) + (low >> 16);
    return (high << 16) | (low & 0xffff);
}
/**
 * @param {?} a
 * @param {?} count
 * @return {?}
 */
function rol32(a, count) {
    return (a << count) | (a >>> (32 - count));
}
/**
 * @param {?} __0
 * @param {?} count
 * @return {?}
 */
function rol64(_a, count) {
    var hi = _a[0], lo = _a[1];
    var /** @type {?} */ h = (hi << count) | (lo >>> (32 - count));
    var /** @type {?} */ l = (lo << count) | (hi >>> (32 - count));
    return [h, l];
}
/**
 * @param {?} str
 * @param {?} endian
 * @return {?}
 */
function stringToWords32(str, endian) {
    var /** @type {?} */ words32 = Array((str.length + 3) >>> 2);
    for (var /** @type {?} */ i = 0; i < words32.length; i++) {
        words32[i] = wordAt(str, i * 4, endian);
    }
    return words32;
}
/**
 * @param {?} str
 * @param {?} index
 * @return {?}
 */
function byteAt(str, index) {
    return index >= str.length ? 0 : str.charCodeAt(index) & 0xff;
}
/**
 * @param {?} str
 * @param {?} index
 * @param {?} endian
 * @return {?}
 */
function wordAt(str, index, endian) {
    var /** @type {?} */ word = 0;
    if (endian === Endian.Big) {
        for (var /** @type {?} */ i = 0; i < 4; i++) {
            word += byteAt(str, index + i) << (24 - 8 * i);
        }
    }
    else {
        for (var /** @type {?} */ i = 0; i < 4; i++) {
            word += byteAt(str, index + i) << 8 * i;
        }
    }
    return word;
}
/**
 * @param {?} words32
 * @return {?}
 */
function words32ToByteString(words32) {
    return words32.reduce(function (str, word) { return str + word32ToByteString(word); }, '');
}
/**
 * @param {?} word
 * @return {?}
 */
function word32ToByteString(word) {
    var /** @type {?} */ str = '';
    for (var /** @type {?} */ i = 0; i < 4; i++) {
        str += String.fromCharCode((word >>> 8 * (3 - i)) & 0xff);
    }
    return str;
}
/**
 * @param {?} str
 * @return {?}
 */
function byteStringToHexString(str) {
    var /** @type {?} */ hex = '';
    for (var /** @type {?} */ i = 0; i < str.length; i++) {
        var /** @type {?} */ b = byteAt(str, i);
        hex += (b >>> 4).toString(16) + (b & 0x0f).toString(16);
    }
    return hex.toLowerCase();
}
/**
 * @param {?} str
 * @return {?}
 */
function byteStringToDecString(str) {
    var /** @type {?} */ decimal = '';
    var /** @type {?} */ toThePower = '1';
    for (var /** @type {?} */ i = str.length - 1; i >= 0; i--) {
        decimal = addBigInt(decimal, numberTimesBigInt(byteAt(str, i), toThePower));
        toThePower = numberTimesBigInt(256, toThePower);
    }
    return decimal.split('').reverse().join('');
}
/**
 * @param {?} x
 * @param {?} y
 * @return {?}
 */
function addBigInt(x, y) {
    var /** @type {?} */ sum = '';
    var /** @type {?} */ len = Math.max(x.length, y.length);
    for (var /** @type {?} */ i = 0, /** @type {?} */ carry = 0; i < len || carry; i++) {
        var /** @type {?} */ tmpSum = carry + +(x[i] || 0) + +(y[i] || 0);
        if (tmpSum >= 10) {
            carry = 1;
            sum += tmpSum - 10;
        }
        else {
            carry = 0;
            sum += tmpSum;
        }
    }
    return sum;
}
/**
 * @param {?} num
 * @param {?} b
 * @return {?}
 */
function numberTimesBigInt(num, b) {
    var /** @type {?} */ product = '';
    var /** @type {?} */ bToThePower = b;
    for (; num !== 0; num = num >>> 1) {
        if (num & 1)
            product = addBigInt(product, bToThePower);
        bToThePower = addBigInt(bToThePower, bToThePower);
    }
    return product;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @abstract
 */
var Serializer = (function () {
    function Serializer() {
    }
    /**
     * @abstract
     * @param {?} messages
     * @param {?} locale
     * @return {?}
     */
    Serializer.prototype.write = function (messages, locale) { };
    /**
     * @abstract
     * @param {?} content
     * @param {?} url
     * @return {?}
     */
    Serializer.prototype.load = function (content, url) { };
    /**
     * @abstract
     * @param {?} message
     * @return {?}
     */
    Serializer.prototype.digest = function (message) { };
    /**
     * @param {?} message
     * @return {?}
     */
    Serializer.prototype.createNameMapper = function (message) { return null; };
    return Serializer;
}());
/**
 * A simple mapper that take a function to transform an internal name to a public name
 */
var SimplePlaceholderMapper = (function (_super) {
    __extends(SimplePlaceholderMapper, _super);
    /**
     * @param {?} message
     * @param {?} mapName
     */
    function SimplePlaceholderMapper(message, mapName) {
        var _this = _super.call(this) || this;
        _this.mapName = mapName;
        _this.internalToPublic = {};
        _this.publicToNextId = {};
        _this.publicToInternal = {};
        message.nodes.forEach(function (node) { return node.visit(_this); });
        return _this;
    }
    /**
     * @param {?} internalName
     * @return {?}
     */
    SimplePlaceholderMapper.prototype.toPublicName = function (internalName) {
        return this.internalToPublic.hasOwnProperty(internalName) ?
            this.internalToPublic[internalName] :
            null;
    };
    /**
     * @param {?} publicName
     * @return {?}
     */
    SimplePlaceholderMapper.prototype.toInternalName = function (publicName) {
        return this.publicToInternal.hasOwnProperty(publicName) ? this.publicToInternal[publicName] :
            null;
    };
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    SimplePlaceholderMapper.prototype.visitText = function (text, context) { return null; };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    SimplePlaceholderMapper.prototype.visitTagPlaceholder = function (ph, context) {
        this.visitPlaceholderName(ph.startName);
        _super.prototype.visitTagPlaceholder.call(this, ph, context);
        this.visitPlaceholderName(ph.closeName);
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    SimplePlaceholderMapper.prototype.visitPlaceholder = function (ph, context) { this.visitPlaceholderName(ph.name); };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    SimplePlaceholderMapper.prototype.visitIcuPlaceholder = function (ph, context) {
        this.visitPlaceholderName(ph.name);
    };
    /**
     * @param {?} internalName
     * @return {?}
     */
    SimplePlaceholderMapper.prototype.visitPlaceholderName = function (internalName) {
        if (!internalName || this.internalToPublic.hasOwnProperty(internalName)) {
            return;
        }
        var /** @type {?} */ publicName = this.mapName(internalName);
        if (this.publicToInternal.hasOwnProperty(publicName)) {
            // Create a new XMB when it has already been used
            var /** @type {?} */ nextId = this.publicToNextId[publicName];
            this.publicToNextId[publicName] = nextId + 1;
            publicName = publicName + "_" + nextId;
        }
        else {
            this.publicToNextId[publicName] = 1;
        }
        this.internalToPublic[internalName] = publicName;
        this.publicToInternal[publicName] = internalName;
    };
    return SimplePlaceholderMapper;
}(RecurseVisitor));
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var _Visitor$1 = (function () {
    function _Visitor$1() {
    }
    /**
     * @param {?} tag
     * @return {?}
     */
    _Visitor$1.prototype.visitTag = function (tag) {
        var _this = this;
        var /** @type {?} */ strAttrs = this._serializeAttributes(tag.attrs);
        if (tag.children.length == 0) {
            return "<" + tag.name + strAttrs + "/>";
        }
        var /** @type {?} */ strChildren = tag.children.map(function (node) { return node.visit(_this); });
        return "<" + tag.name + strAttrs + ">" + strChildren.join('') + "</" + tag.name + ">";
    };
    /**
     * @param {?} text
     * @return {?}
     */
    _Visitor$1.prototype.visitText = function (text) { return text.value; };
    /**
     * @param {?} decl
     * @return {?}
     */
    _Visitor$1.prototype.visitDeclaration = function (decl) {
        return "<?xml" + this._serializeAttributes(decl.attrs) + " ?>";
    };
    /**
     * @param {?} attrs
     * @return {?}
     */
    _Visitor$1.prototype._serializeAttributes = function (attrs) {
        var /** @type {?} */ strAttrs = Object.keys(attrs).map(function (name) { return name + "=\"" + attrs[name] + "\""; }).join(' ');
        return strAttrs.length > 0 ? ' ' + strAttrs : '';
    };
    /**
     * @param {?} doctype
     * @return {?}
     */
    _Visitor$1.prototype.visitDoctype = function (doctype) {
        return "<!DOCTYPE " + doctype.rootTag + " [\n" + doctype.dtd + "\n]>";
    };
    return _Visitor$1;
}());
var _visitor = new _Visitor$1();
/**
 * @param {?} nodes
 * @return {?}
 */
function serialize(nodes) {
    return nodes.map(function (node) { return node.visit(_visitor); }).join('');
}
var Declaration = (function () {
    /**
     * @param {?} unescapedAttrs
     */
    function Declaration(unescapedAttrs) {
        var _this = this;
        this.attrs = {};
        Object.keys(unescapedAttrs).forEach(function (k) {
            _this.attrs[k] = _escapeXml(unescapedAttrs[k]);
        });
    }
    /**
     * @param {?} visitor
     * @return {?}
     */
    Declaration.prototype.visit = function (visitor) { return visitor.visitDeclaration(this); };
    return Declaration;
}());
var Doctype = (function () {
    /**
     * @param {?} rootTag
     * @param {?} dtd
     */
    function Doctype(rootTag, dtd) {
        this.rootTag = rootTag;
        this.dtd = dtd;
    }
    ;
    /**
     * @param {?} visitor
     * @return {?}
     */
    Doctype.prototype.visit = function (visitor) { return visitor.visitDoctype(this); };
    return Doctype;
}());
var Tag = (function () {
    /**
     * @param {?} name
     * @param {?=} unescapedAttrs
     * @param {?=} children
     */
    function Tag(name, unescapedAttrs, children) {
        if (unescapedAttrs === void 0) { unescapedAttrs = {}; }
        if (children === void 0) { children = []; }
        var _this = this;
        this.name = name;
        this.children = children;
        this.attrs = {};
        Object.keys(unescapedAttrs).forEach(function (k) {
            _this.attrs[k] = _escapeXml(unescapedAttrs[k]);
        });
    }
    /**
     * @param {?} visitor
     * @return {?}
     */
    Tag.prototype.visit = function (visitor) { return visitor.visitTag(this); };
    return Tag;
}());
var Text$2 = (function () {
    /**
     * @param {?} unescapedValue
     */
    function Text$2(unescapedValue) {
        this.value = _escapeXml(unescapedValue);
    }
    ;
    /**
     * @param {?} visitor
     * @return {?}
     */
    Text$2.prototype.visit = function (visitor) { return visitor.visitText(this); };
    return Text$2;
}());
var CR = (function (_super) {
    __extends(CR, _super);
    /**
     * @param {?=} ws
     */
    function CR(ws) {
        if (ws === void 0) { ws = 0; }
        return _super.call(this, "\n" + new Array(ws + 1).join(' ')) || this;
    }
    return CR;
}(Text$2));
var _ESCAPED_CHARS = [
    [/&/g, '&amp;'],
    [/"/g, '&quot;'],
    [/'/g, '&apos;'],
    [/</g, '&lt;'],
    [/>/g, '&gt;'],
];
/**
 * @param {?} text
 * @return {?}
 */
function _escapeXml(text) {
    return _ESCAPED_CHARS.reduce(function (text, entry) { return text.replace(entry[0], entry[1]); }, text);
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var _VERSION = '1.2';
var _XMLNS = 'urn:oasis:names:tc:xliff:document:1.2';
// TODO(vicb): make this a param (s/_/-/)
var _DEFAULT_SOURCE_LANG = 'en';
var _PLACEHOLDER_TAG = 'x';
var _FILE_TAG = 'file';
var _SOURCE_TAG = 'source';
var _TARGET_TAG = 'target';
var _UNIT_TAG = 'trans-unit';
var _CONTEXT_GROUP_TAG = 'context-group';
var _CONTEXT_TAG = 'context';
var Xliff = (function (_super) {
    __extends(Xliff, _super);
    function Xliff() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} messages
     * @param {?} locale
     * @return {?}
     */
    Xliff.prototype.write = function (messages, locale) {
        var /** @type {?} */ visitor = new _WriteVisitor();
        var /** @type {?} */ transUnits = [];
        messages.forEach(function (message) {
            var /** @type {?} */ contextTags = [];
            message.sources.forEach(function (source) {
                var /** @type {?} */ contextGroupTag = new Tag(_CONTEXT_GROUP_TAG, { purpose: 'location' });
                contextGroupTag.children.push(new CR(10), new Tag(_CONTEXT_TAG, { 'context-type': 'sourcefile' }, [new Text$2(source.filePath)]), new CR(10), new Tag(_CONTEXT_TAG, { 'context-type': 'linenumber' }, [new Text$2("" + source.startLine)]), new CR(8));
                contextTags.push(new CR(8), contextGroupTag);
            });
            var /** @type {?} */ transUnit = new Tag(_UNIT_TAG, { id: message.id, datatype: 'html' });
            (_a = transUnit.children).push.apply(_a, [new CR(8), new Tag(_SOURCE_TAG, {}, visitor.serialize(message.nodes)), new CR(8), new Tag(_TARGET_TAG)].concat(contextTags));
            if (message.description) {
                transUnit.children.push(new CR(8), new Tag('note', { priority: '1', from: 'description' }, [new Text$2(message.description)]));
            }
            if (message.meaning) {
                transUnit.children.push(new CR(8), new Tag('note', { priority: '1', from: 'meaning' }, [new Text$2(message.meaning)]));
            }
            transUnit.children.push(new CR(6));
            transUnits.push(new CR(6), transUnit);
            var _a;
        });
        var /** @type {?} */ body = new Tag('body', {}, transUnits.concat([new CR(4)]));
        var /** @type {?} */ file = new Tag('file', {
            'source-language': locale || _DEFAULT_SOURCE_LANG,
            datatype: 'plaintext',
            original: 'ng2.template',
        }, [new CR(4), body, new CR(2)]);
        var /** @type {?} */ xliff = new Tag('xliff', { version: _VERSION, xmlns: _XMLNS }, [new CR(2), file, new CR()]);
        return serialize([
            new Declaration({ version: '1.0', encoding: 'UTF-8' }), new CR(), xliff, new CR()
        ]);
    };
    /**
     * @param {?} content
     * @param {?} url
     * @return {?}
     */
    Xliff.prototype.load = function (content, url) {
        // xliff to xml nodes
        var /** @type {?} */ xliffParser = new XliffParser();
        var _a = xliffParser.parse(content, url), locale = _a.locale, msgIdToHtml = _a.msgIdToHtml, errors = _a.errors;
        // xml nodes to i18n nodes
        var /** @type {?} */ i18nNodesByMsgId = {};
        var /** @type {?} */ converter = new XmlToI18n();
        Object.keys(msgIdToHtml).forEach(function (msgId) {
            var _a = converter.convert(msgIdToHtml[msgId], url), i18nNodes = _a.i18nNodes, e = _a.errors;
            errors.push.apply(errors, e);
            i18nNodesByMsgId[msgId] = i18nNodes;
        });
        if (errors.length) {
            throw new Error("xliff parse errors:\n" + errors.join('\n'));
        }
        return { locale: /** @type {?} */ ((locale)), i18nNodesByMsgId: i18nNodesByMsgId };
    };
    /**
     * @param {?} message
     * @return {?}
     */
    Xliff.prototype.digest = function (message) { return digest(message); };
    return Xliff;
}(Serializer));
var _WriteVisitor = (function () {
    function _WriteVisitor() {
    }
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    _WriteVisitor.prototype.visitText = function (text, context) { return [new Text$2(text.value)]; };
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    _WriteVisitor.prototype.visitContainer = function (container, context) {
        var _this = this;
        var /** @type {?} */ nodes = [];
        container.children.forEach(function (node) { return nodes.push.apply(nodes, node.visit(_this)); });
        return nodes;
    };
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    _WriteVisitor.prototype.visitIcu = function (icu, context) {
        var _this = this;
        var /** @type {?} */ nodes = [new Text$2("{" + icu.expressionPlaceholder + ", " + icu.type + ", ")];
        Object.keys(icu.cases).forEach(function (c) {
            nodes.push.apply(nodes, [new Text$2(c + " {")].concat(icu.cases[c].visit(_this), [new Text$2("} ")]));
        });
        nodes.push(new Text$2("}"));
        return nodes;
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    _WriteVisitor.prototype.visitTagPlaceholder = function (ph, context) {
        var /** @type {?} */ ctype = getCtypeForTag(ph.tag);
        var /** @type {?} */ startTagPh = new Tag(_PLACEHOLDER_TAG, { id: ph.startName, ctype: ctype });
        if (ph.isVoid) {
            // void tags have no children nor closing tags
            return [startTagPh];
        }
        var /** @type {?} */ closeTagPh = new Tag(_PLACEHOLDER_TAG, { id: ph.closeName, ctype: ctype });
        return [startTagPh].concat(this.serialize(ph.children), [closeTagPh]);
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    _WriteVisitor.prototype.visitPlaceholder = function (ph, context) {
        return [new Tag(_PLACEHOLDER_TAG, { id: ph.name })];
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    _WriteVisitor.prototype.visitIcuPlaceholder = function (ph, context) {
        return [new Tag(_PLACEHOLDER_TAG, { id: ph.name })];
    };
    /**
     * @param {?} nodes
     * @return {?}
     */
    _WriteVisitor.prototype.serialize = function (nodes) {
        var _this = this;
        return [].concat.apply([], nodes.map(function (node) { return node.visit(_this); }));
    };
    return _WriteVisitor;
}());
var XliffParser = (function () {
    function XliffParser() {
        this._locale = null;
    }
    /**
     * @param {?} xliff
     * @param {?} url
     * @return {?}
     */
    XliffParser.prototype.parse = function (xliff, url) {
        this._unitMlString = null;
        this._msgIdToHtml = {};
        var /** @type {?} */ xml = new XmlParser().parse(xliff, url, false);
        this._errors = xml.errors;
        visitAll(this, xml.rootNodes, null);
        return {
            msgIdToHtml: this._msgIdToHtml,
            errors: this._errors,
            locale: this._locale,
        };
    };
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    XliffParser.prototype.visitElement = function (element, context) {
        switch (element.name) {
            case _UNIT_TAG:
                this._unitMlString = ((null));
                var /** @type {?} */ idAttr = element.attrs.find(function (attr) { return attr.name === 'id'; });
                if (!idAttr) {
                    this._addError(element, "<" + _UNIT_TAG + "> misses the \"id\" attribute");
                }
                else {
                    var /** @type {?} */ id = idAttr.value;
                    if (this._msgIdToHtml.hasOwnProperty(id)) {
                        this._addError(element, "Duplicated translations for msg " + id);
                    }
                    else {
                        visitAll(this, element.children, null);
                        if (typeof this._unitMlString === 'string') {
                            this._msgIdToHtml[id] = this._unitMlString;
                        }
                        else {
                            this._addError(element, "Message " + id + " misses a translation");
                        }
                    }
                }
                break;
            case _SOURCE_TAG:
                // ignore source message
                break;
            case _TARGET_TAG:
                var /** @type {?} */ innerTextStart = ((element.startSourceSpan)).end.offset;
                var /** @type {?} */ innerTextEnd = ((element.endSourceSpan)).start.offset;
                var /** @type {?} */ content = ((element.startSourceSpan)).start.file.content;
                var /** @type {?} */ innerText = content.slice(innerTextStart, innerTextEnd);
                this._unitMlString = innerText;
                break;
            case _FILE_TAG:
                var /** @type {?} */ localeAttr = element.attrs.find(function (attr) { return attr.name === 'target-language'; });
                if (localeAttr) {
                    this._locale = localeAttr.value;
                }
                visitAll(this, element.children, null);
                break;
            default:
                // TODO(vicb): assert file structure, xliff version
                // For now only recurse on unhandled nodes
                visitAll(this, element.children, null);
        }
    };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    XliffParser.prototype.visitAttribute = function (attribute, context) { };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    XliffParser.prototype.visitText = function (text, context) { };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    XliffParser.prototype.visitComment = function (comment, context) { };
    /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    XliffParser.prototype.visitExpansion = function (expansion, context) { };
    /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    XliffParser.prototype.visitExpansionCase = function (expansionCase, context) { };
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    XliffParser.prototype._addError = function (node, message) {
        this._errors.push(new I18nError(/** @type {?} */ ((node.sourceSpan)), message));
    };
    return XliffParser;
}());
var XmlToI18n = (function () {
    function XmlToI18n() {
    }
    /**
     * @param {?} message
     * @param {?} url
     * @return {?}
     */
    XmlToI18n.prototype.convert = function (message, url) {
        var /** @type {?} */ xmlIcu = new XmlParser().parse(message, url, true);
        this._errors = xmlIcu.errors;
        var /** @type {?} */ i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length == 0 ?
            [] :
            visitAll(this, xmlIcu.rootNodes);
        return {
            i18nNodes: i18nNodes,
            errors: this._errors,
        };
    };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitText = function (text, context) { return new Text$1(text.value, /** @type {?} */ ((text.sourceSpan))); };
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitElement = function (el, context) {
        if (el.name === _PLACEHOLDER_TAG) {
            var /** @type {?} */ nameAttr = el.attrs.find(function (attr) { return attr.name === 'id'; });
            if (nameAttr) {
                return new Placeholder('', nameAttr.value, /** @type {?} */ ((el.sourceSpan)));
            }
            this._addError(el, "<" + _PLACEHOLDER_TAG + "> misses the \"id\" attribute");
        }
        else {
            this._addError(el, "Unexpected tag");
        }
        return null;
    };
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitExpansion = function (icu, context) {
        var /** @type {?} */ caseMap = {};
        visitAll(this, icu.cases).forEach(function (c) {
            caseMap[c.value] = new Container(c.nodes, icu.sourceSpan);
        });
        return new Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
    };
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitExpansionCase = function (icuCase, context) {
        return {
            value: icuCase.value,
            nodes: visitAll(this, icuCase.expression),
        };
    };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitComment = function (comment, context) { };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitAttribute = function (attribute, context) { };
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    XmlToI18n.prototype._addError = function (node, message) {
        this._errors.push(new I18nError(/** @type {?} */ ((node.sourceSpan)), message));
    };
    return XmlToI18n;
}());
/**
 * @param {?} tag
 * @return {?}
 */
function getCtypeForTag(tag) {
    switch (tag.toLowerCase()) {
        case 'br':
            return 'lb';
        case 'img':
            return 'image';
        default:
            return "x-" + tag;
    }
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var _VERSION$1 = '2.0';
var _XMLNS$1 = 'urn:oasis:names:tc:xliff:document:2.0';
// TODO(vicb): make this a param (s/_/-/)
var _DEFAULT_SOURCE_LANG$1 = 'en';
var _PLACEHOLDER_TAG$1 = 'ph';
var _PLACEHOLDER_SPANNING_TAG = 'pc';
var _XLIFF_TAG = 'xliff';
var _SOURCE_TAG$1 = 'source';
var _TARGET_TAG$1 = 'target';
var _UNIT_TAG$1 = 'unit';
var Xliff2 = (function (_super) {
    __extends(Xliff2, _super);
    function Xliff2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} messages
     * @param {?} locale
     * @return {?}
     */
    Xliff2.prototype.write = function (messages, locale) {
        var /** @type {?} */ visitor = new _WriteVisitor$1();
        var /** @type {?} */ units = [];
        messages.forEach(function (message) {
            var /** @type {?} */ unit = new Tag(_UNIT_TAG$1, { id: message.id });
            if (message.description || message.meaning) {
                var /** @type {?} */ notes = new Tag('notes');
                if (message.description) {
                    notes.children.push(new CR(8), new Tag('note', { category: 'description' }, [new Text$2(message.description)]));
                }
                if (message.meaning) {
                    notes.children.push(new CR(8), new Tag('note', { category: 'meaning' }, [new Text$2(message.meaning)]));
                }
                notes.children.push(new CR(6));
                unit.children.push(new CR(6), notes);
            }
            var /** @type {?} */ segment = new Tag('segment');
            segment.children.push(new CR(8), new Tag(_SOURCE_TAG$1, {}, visitor.serialize(message.nodes)), new CR(6));
            unit.children.push(new CR(6), segment, new CR(4));
            units.push(new CR(4), unit);
        });
        var /** @type {?} */ file = new Tag('file', { 'original': 'ng.template', id: 'ngi18n' }, units.concat([new CR(2)]));
        var /** @type {?} */ xliff = new Tag(_XLIFF_TAG, { version: _VERSION$1, xmlns: _XMLNS$1, srcLang: locale || _DEFAULT_SOURCE_LANG$1 }, [new CR(2), file, new CR()]);
        return serialize([
            new Declaration({ version: '1.0', encoding: 'UTF-8' }), new CR(), xliff, new CR()
        ]);
    };
    /**
     * @param {?} content
     * @param {?} url
     * @return {?}
     */
    Xliff2.prototype.load = function (content, url) {
        // xliff to xml nodes
        var /** @type {?} */ xliff2Parser = new Xliff2Parser();
        var _a = xliff2Parser.parse(content, url), locale = _a.locale, msgIdToHtml = _a.msgIdToHtml, errors = _a.errors;
        // xml nodes to i18n nodes
        var /** @type {?} */ i18nNodesByMsgId = {};
        var /** @type {?} */ converter = new XmlToI18n$1();
        Object.keys(msgIdToHtml).forEach(function (msgId) {
            var _a = converter.convert(msgIdToHtml[msgId], url), i18nNodes = _a.i18nNodes, e = _a.errors;
            errors.push.apply(errors, e);
            i18nNodesByMsgId[msgId] = i18nNodes;
        });
        if (errors.length) {
            throw new Error("xliff2 parse errors:\n" + errors.join('\n'));
        }
        return { locale: /** @type {?} */ ((locale)), i18nNodesByMsgId: i18nNodesByMsgId };
    };
    /**
     * @param {?} message
     * @return {?}
     */
    Xliff2.prototype.digest = function (message) { return decimalDigest(message); };
    return Xliff2;
}(Serializer));
var _WriteVisitor$1 = (function () {
    function _WriteVisitor$1() {
    }
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    _WriteVisitor$1.prototype.visitText = function (text, context) { return [new Text$2(text.value)]; };
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    _WriteVisitor$1.prototype.visitContainer = function (container, context) {
        var _this = this;
        var /** @type {?} */ nodes = [];
        container.children.forEach(function (node) { return nodes.push.apply(nodes, node.visit(_this)); });
        return nodes;
    };
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    _WriteVisitor$1.prototype.visitIcu = function (icu, context) {
        var _this = this;
        var /** @type {?} */ nodes = [new Text$2("{" + icu.expressionPlaceholder + ", " + icu.type + ", ")];
        Object.keys(icu.cases).forEach(function (c) {
            nodes.push.apply(nodes, [new Text$2(c + " {")].concat(icu.cases[c].visit(_this), [new Text$2("} ")]));
        });
        nodes.push(new Text$2("}"));
        return nodes;
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    _WriteVisitor$1.prototype.visitTagPlaceholder = function (ph, context) {
        var _this = this;
        var /** @type {?} */ type = getTypeForTag(ph.tag);
        if (ph.isVoid) {
            var /** @type {?} */ tagPh = new Tag(_PLACEHOLDER_TAG$1, {
                id: (this._nextPlaceholderId++).toString(),
                equiv: ph.startName,
                type: type,
                disp: "<" + ph.tag + "/>",
            });
            return [tagPh];
        }
        var /** @type {?} */ tagPc = new Tag(_PLACEHOLDER_SPANNING_TAG, {
            id: (this._nextPlaceholderId++).toString(),
            equivStart: ph.startName,
            equivEnd: ph.closeName,
            type: type,
            dispStart: "<" + ph.tag + ">",
            dispEnd: "</" + ph.tag + ">",
        });
        var /** @type {?} */ nodes = [].concat.apply([], ph.children.map(function (node) { return node.visit(_this); }));
        if (nodes.length) {
            nodes.forEach(function (node) { return tagPc.children.push(node); });
        }
        else {
            tagPc.children.push(new Text$2(''));
        }
        return [tagPc];
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    _WriteVisitor$1.prototype.visitPlaceholder = function (ph, context) {
        return [new Tag(_PLACEHOLDER_TAG$1, {
                id: (this._nextPlaceholderId++).toString(),
                equiv: ph.name,
                disp: "{{" + ph.value + "}}",
            })];
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    _WriteVisitor$1.prototype.visitIcuPlaceholder = function (ph, context) {
        return [new Tag(_PLACEHOLDER_TAG$1, { id: (this._nextPlaceholderId++).toString() })];
    };
    /**
     * @param {?} nodes
     * @return {?}
     */
    _WriteVisitor$1.prototype.serialize = function (nodes) {
        var _this = this;
        this._nextPlaceholderId = 0;
        return [].concat.apply([], nodes.map(function (node) { return node.visit(_this); }));
    };
    return _WriteVisitor$1;
}());
var Xliff2Parser = (function () {
    function Xliff2Parser() {
        this._locale = null;
    }
    /**
     * @param {?} xliff
     * @param {?} url
     * @return {?}
     */
    Xliff2Parser.prototype.parse = function (xliff, url) {
        this._unitMlString = null;
        this._msgIdToHtml = {};
        var /** @type {?} */ xml = new XmlParser().parse(xliff, url, false);
        this._errors = xml.errors;
        visitAll(this, xml.rootNodes, null);
        return {
            msgIdToHtml: this._msgIdToHtml,
            errors: this._errors,
            locale: this._locale,
        };
    };
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    Xliff2Parser.prototype.visitElement = function (element, context) {
        switch (element.name) {
            case _UNIT_TAG$1:
                this._unitMlString = null;
                var /** @type {?} */ idAttr = element.attrs.find(function (attr) { return attr.name === 'id'; });
                if (!idAttr) {
                    this._addError(element, "<" + _UNIT_TAG$1 + "> misses the \"id\" attribute");
                }
                else {
                    var /** @type {?} */ id = idAttr.value;
                    if (this._msgIdToHtml.hasOwnProperty(id)) {
                        this._addError(element, "Duplicated translations for msg " + id);
                    }
                    else {
                        visitAll(this, element.children, null);
                        if (typeof this._unitMlString === 'string') {
                            this._msgIdToHtml[id] = this._unitMlString;
                        }
                        else {
                            this._addError(element, "Message " + id + " misses a translation");
                        }
                    }
                }
                break;
            case _SOURCE_TAG$1:
                // ignore source message
                break;
            case _TARGET_TAG$1:
                var /** @type {?} */ innerTextStart = ((element.startSourceSpan)).end.offset;
                var /** @type {?} */ innerTextEnd = ((element.endSourceSpan)).start.offset;
                var /** @type {?} */ content = ((element.startSourceSpan)).start.file.content;
                var /** @type {?} */ innerText = content.slice(innerTextStart, innerTextEnd);
                this._unitMlString = innerText;
                break;
            case _XLIFF_TAG:
                var /** @type {?} */ localeAttr = element.attrs.find(function (attr) { return attr.name === 'trgLang'; });
                if (localeAttr) {
                    this._locale = localeAttr.value;
                }
                var /** @type {?} */ versionAttr = element.attrs.find(function (attr) { return attr.name === 'version'; });
                if (versionAttr) {
                    var /** @type {?} */ version = versionAttr.value;
                    if (version !== '2.0') {
                        this._addError(element, "The XLIFF file version " + version + " is not compatible with XLIFF 2.0 serializer");
                    }
                    else {
                        visitAll(this, element.children, null);
                    }
                }
                break;
            default:
                visitAll(this, element.children, null);
        }
    };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    Xliff2Parser.prototype.visitAttribute = function (attribute, context) { };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    Xliff2Parser.prototype.visitText = function (text, context) { };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    Xliff2Parser.prototype.visitComment = function (comment, context) { };
    /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    Xliff2Parser.prototype.visitExpansion = function (expansion, context) { };
    /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    Xliff2Parser.prototype.visitExpansionCase = function (expansionCase, context) { };
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    Xliff2Parser.prototype._addError = function (node, message) {
        this._errors.push(new I18nError(node.sourceSpan, message));
    };
    return Xliff2Parser;
}());
var XmlToI18n$1 = (function () {
    function XmlToI18n$1() {
    }
    /**
     * @param {?} message
     * @param {?} url
     * @return {?}
     */
    XmlToI18n$1.prototype.convert = function (message, url) {
        var /** @type {?} */ xmlIcu = new XmlParser().parse(message, url, true);
        this._errors = xmlIcu.errors;
        var /** @type {?} */ i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length == 0 ?
            [] : [].concat.apply([], visitAll(this, xmlIcu.rootNodes));
        return {
            i18nNodes: i18nNodes,
            errors: this._errors,
        };
    };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    XmlToI18n$1.prototype.visitText = function (text, context) { return new Text$1(text.value, text.sourceSpan); };
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    XmlToI18n$1.prototype.visitElement = function (el, context) {
        var _this = this;
        switch (el.name) {
            case _PLACEHOLDER_TAG$1:
                var /** @type {?} */ nameAttr = el.attrs.find(function (attr) { return attr.name === 'equiv'; });
                if (nameAttr) {
                    return [new Placeholder('', nameAttr.value, el.sourceSpan)];
                }
                this._addError(el, "<" + _PLACEHOLDER_TAG$1 + "> misses the \"equiv\" attribute");
                break;
            case _PLACEHOLDER_SPANNING_TAG:
                var /** @type {?} */ startAttr = el.attrs.find(function (attr) { return attr.name === 'equivStart'; });
                var /** @type {?} */ endAttr = el.attrs.find(function (attr) { return attr.name === 'equivEnd'; });
                if (!startAttr) {
                    this._addError(el, "<" + _PLACEHOLDER_TAG$1 + "> misses the \"equivStart\" attribute");
                }
                else if (!endAttr) {
                    this._addError(el, "<" + _PLACEHOLDER_TAG$1 + "> misses the \"equivEnd\" attribute");
                }
                else {
                    var /** @type {?} */ startId = startAttr.value;
                    var /** @type {?} */ endId = endAttr.value;
                    var /** @type {?} */ nodes = [];
                    return nodes.concat.apply(nodes, [new Placeholder('', startId, el.sourceSpan)].concat(el.children.map(function (node) { return node.visit(_this, null); }), [new Placeholder('', endId, el.sourceSpan)]));
                }
                break;
            default:
                this._addError(el, "Unexpected tag");
        }
        return null;
    };
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    XmlToI18n$1.prototype.visitExpansion = function (icu, context) {
        var /** @type {?} */ caseMap = {};
        visitAll(this, icu.cases).forEach(function (c) {
            caseMap[c.value] = new Container(c.nodes, icu.sourceSpan);
        });
        return new Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
    };
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    XmlToI18n$1.prototype.visitExpansionCase = function (icuCase, context) {
        return {
            value: icuCase.value,
            nodes: [].concat.apply([], visitAll(this, icuCase.expression)),
        };
    };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    XmlToI18n$1.prototype.visitComment = function (comment, context) { };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    XmlToI18n$1.prototype.visitAttribute = function (attribute, context) { };
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    XmlToI18n$1.prototype._addError = function (node, message) {
        this._errors.push(new I18nError(node.sourceSpan, message));
    };
    return XmlToI18n$1;
}());
/**
 * @param {?} tag
 * @return {?}
 */
function getTypeForTag(tag) {
    switch (tag.toLowerCase()) {
        case 'br':
        case 'b':
        case 'i':
        case 'u':
            return 'fmt';
        case 'img':
            return 'image';
        case 'a':
            return 'link';
        default:
            return 'other';
    }
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var _MESSAGES_TAG = 'messagebundle';
var _MESSAGE_TAG = 'msg';
var _PLACEHOLDER_TAG$2 = 'ph';
var _EXEMPLE_TAG = 'ex';
var _SOURCE_TAG$2 = 'source';
var _DOCTYPE = "<!ELEMENT messagebundle (msg)*>\n<!ATTLIST messagebundle class CDATA #IMPLIED>\n\n<!ELEMENT msg (#PCDATA|ph|source)*>\n<!ATTLIST msg id CDATA #IMPLIED>\n<!ATTLIST msg seq CDATA #IMPLIED>\n<!ATTLIST msg name CDATA #IMPLIED>\n<!ATTLIST msg desc CDATA #IMPLIED>\n<!ATTLIST msg meaning CDATA #IMPLIED>\n<!ATTLIST msg obsolete (obsolete) #IMPLIED>\n<!ATTLIST msg xml:space (default|preserve) \"default\">\n<!ATTLIST msg is_hidden CDATA #IMPLIED>\n\n<!ELEMENT source (#PCDATA)>\n\n<!ELEMENT ph (#PCDATA|ex)*>\n<!ATTLIST ph name CDATA #REQUIRED>\n\n<!ELEMENT ex (#PCDATA)>";
var Xmb = (function (_super) {
    __extends(Xmb, _super);
    function Xmb() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} messages
     * @param {?} locale
     * @return {?}
     */
    Xmb.prototype.write = function (messages, locale) {
        var /** @type {?} */ exampleVisitor = new ExampleVisitor();
        var /** @type {?} */ visitor = new _Visitor$2();
        var /** @type {?} */ rootNode = new Tag(_MESSAGES_TAG);
        messages.forEach(function (message) {
            var /** @type {?} */ attrs = { id: message.id };
            if (message.description) {
                attrs['desc'] = message.description;
            }
            if (message.meaning) {
                attrs['meaning'] = message.meaning;
            }
            var /** @type {?} */ sourceTags = [];
            message.sources.forEach(function (source) {
                sourceTags.push(new Tag(_SOURCE_TAG$2, {}, [
                    new Text$2(source.filePath + ":" + source.startLine + (source.endLine !== source.startLine ? ',' + source.endLine : ''))
                ]));
            });
            rootNode.children.push(new CR(2), new Tag(_MESSAGE_TAG, attrs, sourceTags.concat(visitor.serialize(message.nodes))));
        });
        rootNode.children.push(new CR());
        return serialize([
            new Declaration({ version: '1.0', encoding: 'UTF-8' }),
            new CR(),
            new Doctype(_MESSAGES_TAG, _DOCTYPE),
            new CR(),
            exampleVisitor.addDefaultExamples(rootNode),
            new CR(),
        ]);
    };
    /**
     * @param {?} content
     * @param {?} url
     * @return {?}
     */
    Xmb.prototype.load = function (content, url) {
        throw new Error('Unsupported');
    };
    /**
     * @param {?} message
     * @return {?}
     */
    Xmb.prototype.digest = function (message) { return digest$1(message); };
    /**
     * @param {?} message
     * @return {?}
     */
    Xmb.prototype.createNameMapper = function (message) {
        return new SimplePlaceholderMapper(message, toPublicName);
    };
    return Xmb;
}(Serializer));
var _Visitor$2 = (function () {
    function _Visitor$2() {
    }
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    _Visitor$2.prototype.visitText = function (text, context) { return [new Text$2(text.value)]; };
    /**
     * @param {?} container
     * @param {?} context
     * @return {?}
     */
    _Visitor$2.prototype.visitContainer = function (container, context) {
        var _this = this;
        var /** @type {?} */ nodes = [];
        container.children.forEach(function (node) { return nodes.push.apply(nodes, node.visit(_this)); });
        return nodes;
    };
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    _Visitor$2.prototype.visitIcu = function (icu, context) {
        var _this = this;
        var /** @type {?} */ nodes = [new Text$2("{" + icu.expressionPlaceholder + ", " + icu.type + ", ")];
        Object.keys(icu.cases).forEach(function (c) {
            nodes.push.apply(nodes, [new Text$2(c + " {")].concat(icu.cases[c].visit(_this), [new Text$2("} ")]));
        });
        nodes.push(new Text$2("}"));
        return nodes;
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    _Visitor$2.prototype.visitTagPlaceholder = function (ph, context) {
        var /** @type {?} */ startEx = new Tag(_EXEMPLE_TAG, {}, [new Text$2("<" + ph.tag + ">")]);
        var /** @type {?} */ startTagPh = new Tag(_PLACEHOLDER_TAG$2, { name: ph.startName }, [startEx]);
        if (ph.isVoid) {
            // void tags have no children nor closing tags
            return [startTagPh];
        }
        var /** @type {?} */ closeEx = new Tag(_EXEMPLE_TAG, {}, [new Text$2("</" + ph.tag + ">")]);
        var /** @type {?} */ closeTagPh = new Tag(_PLACEHOLDER_TAG$2, { name: ph.closeName }, [closeEx]);
        return [startTagPh].concat(this.serialize(ph.children), [closeTagPh]);
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    _Visitor$2.prototype.visitPlaceholder = function (ph, context) {
        return [new Tag(_PLACEHOLDER_TAG$2, { name: ph.name })];
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    _Visitor$2.prototype.visitIcuPlaceholder = function (ph, context) {
        return [new Tag(_PLACEHOLDER_TAG$2, { name: ph.name })];
    };
    /**
     * @param {?} nodes
     * @return {?}
     */
    _Visitor$2.prototype.serialize = function (nodes) {
        var _this = this;
        return [].concat.apply([], nodes.map(function (node) { return node.visit(_this); }));
    };
    return _Visitor$2;
}());
/**
 * @param {?} message
 * @return {?}
 */
function digest$1(message) {
    return decimalDigest(message);
}
var ExampleVisitor = (function () {
    function ExampleVisitor() {
    }
    /**
     * @param {?} node
     * @return {?}
     */
    ExampleVisitor.prototype.addDefaultExamples = function (node) {
        node.visit(this);
        return node;
    };
    /**
     * @param {?} tag
     * @return {?}
     */
    ExampleVisitor.prototype.visitTag = function (tag) {
        var _this = this;
        if (tag.name === _PLACEHOLDER_TAG$2) {
            if (!tag.children || tag.children.length == 0) {
                var /** @type {?} */ exText = new Text$2(tag.attrs['name'] || '...');
                tag.children = [new Tag(_EXEMPLE_TAG, {}, [exText])];
            }
        }
        else if (tag.children) {
            tag.children.forEach(function (node) { return node.visit(_this); });
        }
    };
    /**
     * @param {?} text
     * @return {?}
     */
    ExampleVisitor.prototype.visitText = function (text) { };
    /**
     * @param {?} decl
     * @return {?}
     */
    ExampleVisitor.prototype.visitDeclaration = function (decl) { };
    /**
     * @param {?} doctype
     * @return {?}
     */
    ExampleVisitor.prototype.visitDoctype = function (doctype) { };
    return ExampleVisitor;
}());
/**
 * @param {?} internalName
 * @return {?}
 */
function toPublicName(internalName) {
    return internalName.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var _TRANSLATIONS_TAG = 'translationbundle';
var _TRANSLATION_TAG = 'translation';
var _PLACEHOLDER_TAG$3 = 'ph';
var Xtb = (function (_super) {
    __extends(Xtb, _super);
    function Xtb() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} messages
     * @param {?} locale
     * @return {?}
     */
    Xtb.prototype.write = function (messages, locale) { throw new Error('Unsupported'); };
    /**
     * @param {?} content
     * @param {?} url
     * @return {?}
     */
    Xtb.prototype.load = function (content, url) {
        // xtb to xml nodes
        var /** @type {?} */ xtbParser = new XtbParser();
        var _a = xtbParser.parse(content, url), locale = _a.locale, msgIdToHtml = _a.msgIdToHtml, errors = _a.errors;
        // xml nodes to i18n nodes
        var /** @type {?} */ i18nNodesByMsgId = {};
        var /** @type {?} */ converter = new XmlToI18n$2();
        // Because we should be able to load xtb files that rely on features not supported by angular,
        // we need to delay the conversion of html to i18n nodes so that non angular messages are not
        // converted
        Object.keys(msgIdToHtml).forEach(function (msgId) {
            var /** @type {?} */ valueFn = function () {
                var _a = converter.convert(msgIdToHtml[msgId], url), i18nNodes = _a.i18nNodes, errors = _a.errors;
                if (errors.length) {
                    throw new Error("xtb parse errors:\n" + errors.join('\n'));
                }
                return i18nNodes;
            };
            createLazyProperty(i18nNodesByMsgId, msgId, valueFn);
        });
        if (errors.length) {
            throw new Error("xtb parse errors:\n" + errors.join('\n'));
        }
        return { locale: /** @type {?} */ ((locale)), i18nNodesByMsgId: i18nNodesByMsgId };
    };
    /**
     * @param {?} message
     * @return {?}
     */
    Xtb.prototype.digest = function (message) { return digest$1(message); };
    /**
     * @param {?} message
     * @return {?}
     */
    Xtb.prototype.createNameMapper = function (message) {
        return new SimplePlaceholderMapper(message, toPublicName);
    };
    return Xtb;
}(Serializer));
/**
 * @param {?} messages
 * @param {?} id
 * @param {?} valueFn
 * @return {?}
 */
function createLazyProperty(messages, id, valueFn) {
    Object.defineProperty(messages, id, {
        configurable: true,
        enumerable: true,
        get: function () {
            var /** @type {?} */ value = valueFn();
            Object.defineProperty(messages, id, { enumerable: true, value: value });
            return value;
        },
        set: function (_) { throw new Error('Could not overwrite an XTB translation'); },
    });
}
var XtbParser = (function () {
    function XtbParser() {
        this._locale = null;
    }
    /**
     * @param {?} xtb
     * @param {?} url
     * @return {?}
     */
    XtbParser.prototype.parse = function (xtb, url) {
        this._bundleDepth = 0;
        this._msgIdToHtml = {};
        // We can not parse the ICU messages at this point as some messages might not originate
        // from Angular that could not be lex'd.
        var /** @type {?} */ xml = new XmlParser().parse(xtb, url, false);
        this._errors = xml.errors;
        visitAll(this, xml.rootNodes);
        return {
            msgIdToHtml: this._msgIdToHtml,
            errors: this._errors,
            locale: this._locale,
        };
    };
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    XtbParser.prototype.visitElement = function (element, context) {
        switch (element.name) {
            case _TRANSLATIONS_TAG:
                this._bundleDepth++;
                if (this._bundleDepth > 1) {
                    this._addError(element, "<" + _TRANSLATIONS_TAG + "> elements can not be nested");
                }
                var /** @type {?} */ langAttr = element.attrs.find(function (attr) { return attr.name === 'lang'; });
                if (langAttr) {
                    this._locale = langAttr.value;
                }
                visitAll(this, element.children, null);
                this._bundleDepth--;
                break;
            case _TRANSLATION_TAG:
                var /** @type {?} */ idAttr = element.attrs.find(function (attr) { return attr.name === 'id'; });
                if (!idAttr) {
                    this._addError(element, "<" + _TRANSLATION_TAG + "> misses the \"id\" attribute");
                }
                else {
                    var /** @type {?} */ id = idAttr.value;
                    if (this._msgIdToHtml.hasOwnProperty(id)) {
                        this._addError(element, "Duplicated translations for msg " + id);
                    }
                    else {
                        var /** @type {?} */ innerTextStart = ((element.startSourceSpan)).end.offset;
                        var /** @type {?} */ innerTextEnd = ((element.endSourceSpan)).start.offset;
                        var /** @type {?} */ content = ((element.startSourceSpan)).start.file.content;
                        var /** @type {?} */ innerText = content.slice(/** @type {?} */ ((innerTextStart)), /** @type {?} */ ((innerTextEnd)));
                        this._msgIdToHtml[id] = innerText;
                    }
                }
                break;
            default:
                this._addError(element, 'Unexpected tag');
        }
    };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    XtbParser.prototype.visitAttribute = function (attribute, context) { };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    XtbParser.prototype.visitText = function (text, context) { };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    XtbParser.prototype.visitComment = function (comment, context) { };
    /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    XtbParser.prototype.visitExpansion = function (expansion, context) { };
    /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    XtbParser.prototype.visitExpansionCase = function (expansionCase, context) { };
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    XtbParser.prototype._addError = function (node, message) {
        this._errors.push(new I18nError(/** @type {?} */ ((node.sourceSpan)), message));
    };
    return XtbParser;
}());
var XmlToI18n$2 = (function () {
    function XmlToI18n$2() {
    }
    /**
     * @param {?} message
     * @param {?} url
     * @return {?}
     */
    XmlToI18n$2.prototype.convert = function (message, url) {
        var /** @type {?} */ xmlIcu = new XmlParser().parse(message, url, true);
        this._errors = xmlIcu.errors;
        var /** @type {?} */ i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length == 0 ?
            [] :
            visitAll(this, xmlIcu.rootNodes);
        return {
            i18nNodes: i18nNodes,
            errors: this._errors,
        };
    };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    XmlToI18n$2.prototype.visitText = function (text, context) { return new Text$1(text.value, /** @type {?} */ ((text.sourceSpan))); };
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    XmlToI18n$2.prototype.visitExpansion = function (icu, context) {
        var /** @type {?} */ caseMap = {};
        visitAll(this, icu.cases).forEach(function (c) {
            caseMap[c.value] = new Container(c.nodes, icu.sourceSpan);
        });
        return new Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
    };
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    XmlToI18n$2.prototype.visitExpansionCase = function (icuCase, context) {
        return {
            value: icuCase.value,
            nodes: visitAll(this, icuCase.expression),
        };
    };
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    XmlToI18n$2.prototype.visitElement = function (el, context) {
        if (el.name === _PLACEHOLDER_TAG$3) {
            var /** @type {?} */ nameAttr = el.attrs.find(function (attr) { return attr.name === 'name'; });
            if (nameAttr) {
                return new Placeholder('', nameAttr.value, /** @type {?} */ ((el.sourceSpan)));
            }
            this._addError(el, "<" + _PLACEHOLDER_TAG$3 + "> misses the \"name\" attribute");
        }
        else {
            this._addError(el, "Unexpected tag");
        }
        return null;
    };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    XmlToI18n$2.prototype.visitComment = function (comment, context) { };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    XmlToI18n$2.prototype.visitAttribute = function (attribute, context) { };
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    XmlToI18n$2.prototype._addError = function (node, message) {
        this._errors.push(new I18nError(/** @type {?} */ ((node.sourceSpan)), message));
    };
    return XmlToI18n$2;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var HtmlParser = (function (_super) {
    __extends(HtmlParser, _super);
    function HtmlParser() {
        return _super.call(this, getHtmlTagDefinition) || this;
    }
    /**
     * @param {?} source
     * @param {?} url
     * @param {?=} parseExpansionForms
     * @param {?=} interpolationConfig
     * @return {?}
     */
    HtmlParser.prototype.parse = function (source, url, parseExpansionForms, interpolationConfig) {
        if (parseExpansionForms === void 0) { parseExpansionForms = false; }
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        return _super.prototype.parse.call(this, source, url, parseExpansionForms, interpolationConfig);
    };
    return HtmlParser;
}(Parser$1));
HtmlParser.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
HtmlParser.ctorParameters = function () { return []; };
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A container for translated messages
 */
var TranslationBundle = (function () {
    /**
     * @param {?=} _i18nNodesByMsgId
     * @param {?=} locale
     * @param {?=} digest
     * @param {?=} mapperFactory
     * @param {?=} missingTranslationStrategy
     * @param {?=} console
     */
    function TranslationBundle(_i18nNodesByMsgId, locale, digest, mapperFactory, missingTranslationStrategy, console) {
        if (_i18nNodesByMsgId === void 0) { _i18nNodesByMsgId = {}; }
        if (missingTranslationStrategy === void 0) { missingTranslationStrategy = MissingTranslationStrategy.Warning; }
        this._i18nNodesByMsgId = _i18nNodesByMsgId;
        this.digest = digest;
        this.mapperFactory = mapperFactory;
        this._i18nToHtml = new I18nToHtmlVisitor(_i18nNodesByMsgId, locale, digest, mapperFactory, missingTranslationStrategy, console);
    }
    /**
     * @param {?} content
     * @param {?} url
     * @param {?} serializer
     * @param {?} missingTranslationStrategy
     * @param {?=} console
     * @return {?}
     */
    TranslationBundle.load = function (content, url, serializer, missingTranslationStrategy, console) {
        var _a = serializer.load(content, url), locale = _a.locale, i18nNodesByMsgId = _a.i18nNodesByMsgId;
        var /** @type {?} */ digestFn = function (m) { return serializer.digest(m); };
        var /** @type {?} */ mapperFactory = function (m) { return ((serializer.createNameMapper(m))); };
        return new TranslationBundle(i18nNodesByMsgId, locale, digestFn, mapperFactory, missingTranslationStrategy, console);
    };
    /**
     * @param {?} srcMsg
     * @return {?}
     */
    TranslationBundle.prototype.get = function (srcMsg) {
        var /** @type {?} */ html = this._i18nToHtml.convert(srcMsg);
        if (html.errors.length) {
            throw new Error(html.errors.join('\n'));
        }
        return html.nodes;
    };
    /**
     * @param {?} srcMsg
     * @return {?}
     */
    TranslationBundle.prototype.has = function (srcMsg) { return this.digest(srcMsg) in this._i18nNodesByMsgId; };
    return TranslationBundle;
}());
var I18nToHtmlVisitor = (function () {
    /**
     * @param {?=} _i18nNodesByMsgId
     * @param {?=} _locale
     * @param {?=} _digest
     * @param {?=} _mapperFactory
     * @param {?=} _missingTranslationStrategy
     * @param {?=} _console
     */
    function I18nToHtmlVisitor(_i18nNodesByMsgId, _locale, _digest, _mapperFactory, _missingTranslationStrategy, _console) {
        if (_i18nNodesByMsgId === void 0) { _i18nNodesByMsgId = {}; }
        this._i18nNodesByMsgId = _i18nNodesByMsgId;
        this._locale = _locale;
        this._digest = _digest;
        this._mapperFactory = _mapperFactory;
        this._missingTranslationStrategy = _missingTranslationStrategy;
        this._console = _console;
        this._contextStack = [];
        this._errors = [];
    }
    /**
     * @param {?} srcMsg
     * @return {?}
     */
    I18nToHtmlVisitor.prototype.convert = function (srcMsg) {
        this._contextStack.length = 0;
        this._errors.length = 0;
        // i18n to text
        var /** @type {?} */ text = this._convertToText(srcMsg);
        // text to html
        var /** @type {?} */ url = srcMsg.nodes[0].sourceSpan.start.file.url;
        var /** @type {?} */ html = new HtmlParser().parse(text, url, true);
        return {
            nodes: html.rootNodes,
            errors: this._errors.concat(html.errors),
        };
    };
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    I18nToHtmlVisitor.prototype.visitText = function (text, context) { return text.value; };
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    I18nToHtmlVisitor.prototype.visitContainer = function (container, context) {
        var _this = this;
        return container.children.map(function (n) { return n.visit(_this); }).join('');
    };
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    I18nToHtmlVisitor.prototype.visitIcu = function (icu, context) {
        var _this = this;
        var /** @type {?} */ cases = Object.keys(icu.cases).map(function (k) { return k + " {" + icu.cases[k].visit(_this) + "}"; });
        // TODO(vicb): Once all format switch to using expression placeholders
        // we should throw when the placeholder is not in the source message
        var /** @type {?} */ exp = this._srcMsg.placeholders.hasOwnProperty(icu.expression) ?
            this._srcMsg.placeholders[icu.expression] :
            icu.expression;
        return "{" + exp + ", " + icu.type + ", " + cases.join(' ') + "}";
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    I18nToHtmlVisitor.prototype.visitPlaceholder = function (ph, context) {
        var /** @type {?} */ phName = this._mapper(ph.name);
        if (this._srcMsg.placeholders.hasOwnProperty(phName)) {
            return this._srcMsg.placeholders[phName];
        }
        if (this._srcMsg.placeholderToMessage.hasOwnProperty(phName)) {
            return this._convertToText(this._srcMsg.placeholderToMessage[phName]);
        }
        this._addError(ph, "Unknown placeholder \"" + ph.name + "\"");
        return '';
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    I18nToHtmlVisitor.prototype.visitTagPlaceholder = function (ph, context) {
        var _this = this;
        var /** @type {?} */ tag = "" + ph.tag;
        var /** @type {?} */ attrs = Object.keys(ph.attrs).map(function (name) { return name + "=\"" + ph.attrs[name] + "\""; }).join(' ');
        if (ph.isVoid) {
            return "<" + tag + " " + attrs + "/>";
        }
        var /** @type {?} */ children = ph.children.map(function (c) { return c.visit(_this); }).join('');
        return "<" + tag + " " + attrs + ">" + children + "</" + tag + ">";
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    I18nToHtmlVisitor.prototype.visitIcuPlaceholder = function (ph, context) {
        // An ICU placeholder references the source message to be serialized
        return this._convertToText(this._srcMsg.placeholderToMessage[ph.name]);
    };
    /**
     * Convert a source message to a translated text string:
     * - text nodes are replaced with their translation,
     * - placeholders are replaced with their content,
     * - ICU nodes are converted to ICU expressions.
     * @param {?} srcMsg
     * @return {?}
     */
    I18nToHtmlVisitor.prototype._convertToText = function (srcMsg) {
        var _this = this;
        var /** @type {?} */ id = this._digest(srcMsg);
        var /** @type {?} */ mapper = this._mapperFactory ? this._mapperFactory(srcMsg) : null;
        var /** @type {?} */ nodes;
        this._contextStack.push({ msg: this._srcMsg, mapper: this._mapper });
        this._srcMsg = srcMsg;
        if (this._i18nNodesByMsgId.hasOwnProperty(id)) {
            // When there is a translation use its nodes as the source
            // And create a mapper to convert serialized placeholder names to internal names
            nodes = this._i18nNodesByMsgId[id];
            this._mapper = function (name) { return mapper ? ((mapper.toInternalName(name))) : name; };
        }
        else {
            // When no translation has been found
            // - report an error / a warning / nothing,
            // - use the nodes from the original message
            // - placeholders are already internal and need no mapper
            if (this._missingTranslationStrategy === MissingTranslationStrategy.Error) {
                var /** @type {?} */ ctx = this._locale ? " for locale \"" + this._locale + "\"" : '';
                this._addError(srcMsg.nodes[0], "Missing translation for message \"" + id + "\"" + ctx);
            }
            else if (this._console &&
                this._missingTranslationStrategy === MissingTranslationStrategy.Warning) {
                var /** @type {?} */ ctx = this._locale ? " for locale \"" + this._locale + "\"" : '';
                this._console.warn("Missing translation for message \"" + id + "\"" + ctx);
            }
            nodes = srcMsg.nodes;
            this._mapper = function (name) { return name; };
        }
        var /** @type {?} */ text = nodes.map(function (node) { return node.visit(_this); }).join('');
        var /** @type {?} */ context = ((this._contextStack.pop()));
        this._srcMsg = context.msg;
        this._mapper = context.mapper;
        return text;
    };
    /**
     * @param {?} el
     * @param {?} msg
     * @return {?}
     */
    I18nToHtmlVisitor.prototype._addError = function (el, msg) {
        this._errors.push(new I18nError(el.sourceSpan, msg));
    };
    return I18nToHtmlVisitor;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var I18NHtmlParser = (function () {
    /**
     * @param {?} _htmlParser
     * @param {?=} translations
     * @param {?=} translationsFormat
     * @param {?=} missingTranslation
     * @param {?=} console
     */
    function I18NHtmlParser(_htmlParser, translations, translationsFormat, missingTranslation, console) {
        if (missingTranslation === void 0) { missingTranslation = MissingTranslationStrategy.Warning; }
        this._htmlParser = _htmlParser;
        if (translations) {
            var serializer = createSerializer(translationsFormat);
            this._translationBundle =
                TranslationBundle.load(translations, 'i18n', serializer, missingTranslation, console);
        }
    }
    /**
     * @param {?} source
     * @param {?} url
     * @param {?=} parseExpansionForms
     * @param {?=} interpolationConfig
     * @return {?}
     */
    I18NHtmlParser.prototype.parse = function (source, url, parseExpansionForms, interpolationConfig) {
        if (parseExpansionForms === void 0) { parseExpansionForms = false; }
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        var /** @type {?} */ parseResult = this._htmlParser.parse(source, url, parseExpansionForms, interpolationConfig);
        if (!this._translationBundle) {
            // Do not enable i18n when no translation bundle is provided
            return parseResult;
        }
        if (parseResult.errors.length) {
            return new ParseTreeResult(parseResult.rootNodes, parseResult.errors);
        }
        return mergeTranslations(parseResult.rootNodes, this._translationBundle, interpolationConfig, [], {});
    };
    return I18NHtmlParser;
}());
/**
 * @param {?=} format
 * @return {?}
 */
function createSerializer(format) {
    format = (format || 'xlf').toLowerCase();
    switch (format) {
        case 'xmb':
            return new Xmb();
        case 'xtb':
            return new Xtb();
        case 'xliff2':
        case 'xlf2':
            return new Xliff2();
        case 'xliff':
        case 'xlf':
        default:
            return new Xliff();
    }
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var CORE = assetUrl('core');
var Identifiers = (function () {
    function Identifiers() {
    }
    return Identifiers;
}());
Identifiers.ANALYZE_FOR_ENTRY_COMPONENTS = {
    name: 'ANALYZE_FOR_ENTRY_COMPONENTS',
    moduleUrl: CORE,
    runtime: ANALYZE_FOR_ENTRY_COMPONENTS
};
Identifiers.ElementRef = { name: 'ElementRef', moduleUrl: CORE, runtime: ElementRef };
Identifiers.NgModuleRef = { name: 'NgModuleRef', moduleUrl: CORE, runtime: NgModuleRef };
Identifiers.ViewContainerRef = { name: 'ViewContainerRef', moduleUrl: CORE, runtime: ViewContainerRef };
Identifiers.ChangeDetectorRef = { name: 'ChangeDetectorRef', moduleUrl: CORE, runtime: ChangeDetectorRef };
Identifiers.QueryList = { name: 'QueryList', moduleUrl: CORE, runtime: QueryList };
Identifiers.TemplateRef = { name: 'TemplateRef', moduleUrl: CORE, runtime: TemplateRef };
Identifiers.CodegenComponentFactoryResolver = {
    name: 'ɵCodegenComponentFactoryResolver',
    moduleUrl: CORE,
    runtime: ɵCodegenComponentFactoryResolver
};
Identifiers.ComponentFactoryResolver = {
    name: 'ComponentFactoryResolver',
    moduleUrl: CORE,
    runtime: ComponentFactoryResolver
};
Identifiers.ComponentFactory = { name: 'ComponentFactory', moduleUrl: CORE, runtime: ComponentFactory };
Identifiers.ComponentRef = { name: 'ComponentRef', moduleUrl: CORE, runtime: ComponentRef };
Identifiers.NgModuleFactory = { name: 'NgModuleFactory', moduleUrl: CORE, runtime: NgModuleFactory };
Identifiers.NgModuleInjector = {
    name: 'ɵNgModuleInjector',
    moduleUrl: CORE,
    runtime: ɵNgModuleInjector,
};
Identifiers.RegisterModuleFactoryFn = {
    name: 'ɵregisterModuleFactory',
    moduleUrl: CORE,
    runtime: ɵregisterModuleFactory,
};
Identifiers.Injector = { name: 'Injector', moduleUrl: CORE, runtime: Injector };
Identifiers.ViewEncapsulation = { name: 'ViewEncapsulation', moduleUrl: CORE, runtime: ViewEncapsulation };
Identifiers.ChangeDetectionStrategy = {
    name: 'ChangeDetectionStrategy',
    moduleUrl: CORE,
    runtime: ChangeDetectionStrategy
};
Identifiers.SecurityContext = {
    name: 'SecurityContext',
    moduleUrl: CORE,
    runtime: SecurityContext,
};
Identifiers.LOCALE_ID = { name: 'LOCALE_ID', moduleUrl: CORE, runtime: LOCALE_ID };
Identifiers.TRANSLATIONS_FORMAT = { name: 'TRANSLATIONS_FORMAT', moduleUrl: CORE, runtime: TRANSLATIONS_FORMAT };
Identifiers.inlineInterpolate = { name: 'ɵinlineInterpolate', moduleUrl: CORE, runtime: ɵinlineInterpolate };
Identifiers.interpolate = { name: 'ɵinterpolate', moduleUrl: CORE, runtime: ɵinterpolate };
Identifiers.EMPTY_ARRAY = { name: 'ɵEMPTY_ARRAY', moduleUrl: CORE, runtime: ɵEMPTY_ARRAY };
Identifiers.EMPTY_MAP = { name: 'ɵEMPTY_MAP', moduleUrl: CORE, runtime: ɵEMPTY_MAP };
Identifiers.Renderer = { name: 'Renderer', moduleUrl: CORE, runtime: Renderer };
Identifiers.viewDef = { name: 'ɵvid', moduleUrl: CORE, runtime: ɵvid };
Identifiers.elementDef = { name: 'ɵeld', moduleUrl: CORE, runtime: ɵeld };
Identifiers.anchorDef = { name: 'ɵand', moduleUrl: CORE, runtime: ɵand };
Identifiers.textDef = { name: 'ɵted', moduleUrl: CORE, runtime: ɵted };
Identifiers.directiveDef = { name: 'ɵdid', moduleUrl: CORE, runtime: ɵdid };
Identifiers.providerDef = { name: 'ɵprd', moduleUrl: CORE, runtime: ɵprd };
Identifiers.queryDef = { name: 'ɵqud', moduleUrl: CORE, runtime: ɵqud };
Identifiers.pureArrayDef = { name: 'ɵpad', moduleUrl: CORE, runtime: ɵpad };
Identifiers.pureObjectDef = { name: 'ɵpod', moduleUrl: CORE, runtime: ɵpod };
Identifiers.purePipeDef = { name: 'ɵppd', moduleUrl: CORE, runtime: ɵppd };
Identifiers.pipeDef = { name: 'ɵpid', moduleUrl: CORE, runtime: ɵpid };
Identifiers.nodeValue = { name: 'ɵnov', moduleUrl: CORE, runtime: ɵnov };
Identifiers.ngContentDef = { name: 'ɵncd', moduleUrl: CORE, runtime: ɵncd };
Identifiers.unwrapValue = { name: 'ɵunv', moduleUrl: CORE, runtime: ɵunv };
Identifiers.createRendererType2 = { name: 'ɵcrt', moduleUrl: CORE, runtime: ɵcrt };
Identifiers.RendererType2 = {
    name: 'RendererType2',
    moduleUrl: CORE,
    // type only
    runtime: null
};
Identifiers.ViewDefinition = {
    name: 'ɵViewDefinition',
    moduleUrl: CORE,
    // type only
    runtime: null
};
Identifiers.createComponentFactory = { name: 'ɵccf', moduleUrl: CORE, runtime: ɵccf };
/**
 * @param {?} pkg
 * @param {?=} path
 * @param {?=} type
 * @return {?}
 */
function assetUrl(pkg, path, type) {
    if (path === void 0) { path = null; }
    if (type === void 0) { type = 'src'; }
    if (path == null) {
        return "@angular/" + pkg;
    }
    else {
        return "@angular/" + pkg + "/" + type + "/" + path;
    }
}
/**
 * @param {?} identifier
 * @return {?}
 */
function resolveIdentifier(identifier) {
    var /** @type {?} */ name = identifier.name;
    return ɵreflector.resolveIdentifier(name, identifier.moduleUrl, null, identifier.runtime);
}
/**
 * @param {?} identifier
 * @return {?}
 */
function createIdentifier(identifier) {
    return { reference: resolveIdentifier(identifier) };
}
/**
 * @param {?} identifier
 * @return {?}
 */
function identifierToken(identifier) {
    return { identifier: identifier };
}
/**
 * @param {?} identifier
 * @return {?}
 */
function createIdentifierToken(identifier) {
    return identifierToken(createIdentifier(identifier));
}
/**
 * @param {?} enumType
 * @param {?} name
 * @return {?}
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// http://cldr.unicode.org/index/cldr-spec/plural-rules
var PLURAL_CASES = ['zero', 'one', 'two', 'few', 'many', 'other'];
/**
 * Expands special forms into elements.
 *
 * For example,
 *
 * ```
 * { messages.length, plural,
 *   =0 {zero}
 *   =1 {one}
 *   other {more than one}
 * }
 * ```
 *
 * will be expanded into
 *
 * ```
 * <ng-container [ngPlural]="messages.length">
 *   <ng-template ngPluralCase="=0">zero</ng-template>
 *   <ng-template ngPluralCase="=1">one</ng-template>
 *   <ng-template ngPluralCase="other">more than one</ng-template>
 * </ng-container>
 * ```
 * @param {?} nodes
 * @return {?}
 */
function expandNodes(nodes) {
    var /** @type {?} */ expander = new _Expander();
    return new ExpansionResult(visitAll(expander, nodes), expander.isExpanded, expander.errors);
}
var ExpansionResult = (function () {
    /**
     * @param {?} nodes
     * @param {?} expanded
     * @param {?} errors
     */
    function ExpansionResult(nodes, expanded, errors) {
        this.nodes = nodes;
        this.expanded = expanded;
        this.errors = errors;
    }
    return ExpansionResult;
}());
var ExpansionError = (function (_super) {
    __extends(ExpansionError, _super);
    /**
     * @param {?} span
     * @param {?} errorMsg
     */
    function ExpansionError(span, errorMsg) {
        return _super.call(this, span, errorMsg) || this;
    }
    return ExpansionError;
}(ParseError));
/**
 * Expand expansion forms (plural, select) to directives
 *
 * \@internal
 */
var _Expander = (function () {
    function _Expander() {
        this.isExpanded = false;
        this.errors = [];
    }
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    _Expander.prototype.visitElement = function (element, context) {
        return new Element(element.name, element.attrs, visitAll(this, element.children), element.sourceSpan, element.startSourceSpan, element.endSourceSpan);
    };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    _Expander.prototype.visitAttribute = function (attribute, context) { return attribute; };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    _Expander.prototype.visitText = function (text, context) { return text; };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    _Expander.prototype.visitComment = function (comment, context) { return comment; };
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    _Expander.prototype.visitExpansion = function (icu, context) {
        this.isExpanded = true;
        return icu.type == 'plural' ? _expandPluralForm(icu, this.errors) :
            _expandDefaultForm(icu, this.errors);
    };
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    _Expander.prototype.visitExpansionCase = function (icuCase, context) {
        throw new Error('Should not be reached');
    };
    return _Expander;
}());
/**
 * @param {?} ast
 * @param {?} errors
 * @return {?}
 */
function _expandPluralForm(ast, errors) {
    var /** @type {?} */ children = ast.cases.map(function (c) {
        if (PLURAL_CASES.indexOf(c.value) == -1 && !c.value.match(/^=\d+$/)) {
            errors.push(new ExpansionError(c.valueSourceSpan, "Plural cases should be \"=<number>\" or one of " + PLURAL_CASES.join(", ")));
        }
        var /** @type {?} */ expansionResult = expandNodes(c.expression);
        errors.push.apply(errors, expansionResult.errors);
        return new Element("ng-template", [new Attribute$1('ngPluralCase', "" + c.value, c.valueSourceSpan)], expansionResult.nodes, c.sourceSpan, c.sourceSpan, c.sourceSpan);
    });
    var /** @type {?} */ switchAttr = new Attribute$1('[ngPlural]', ast.switchValue, ast.switchValueSourceSpan);
    return new Element('ng-container', [switchAttr], children, ast.sourceSpan, ast.sourceSpan, ast.sourceSpan);
}
/**
 * @param {?} ast
 * @param {?} errors
 * @return {?}
 */
function _expandDefaultForm(ast, errors) {
    var /** @type {?} */ children = ast.cases.map(function (c) {
        var /** @type {?} */ expansionResult = expandNodes(c.expression);
        errors.push.apply(errors, expansionResult.errors);
        if (c.value === 'other') {
            // other is the default case when no values match
            return new Element("ng-template", [new Attribute$1('ngSwitchDefault', '', c.valueSourceSpan)], expansionResult.nodes, c.sourceSpan, c.sourceSpan, c.sourceSpan);
        }
        return new Element("ng-template", [new Attribute$1('ngSwitchCase', "" + c.value, c.valueSourceSpan)], expansionResult.nodes, c.sourceSpan, c.sourceSpan, c.sourceSpan);
    });
    var /** @type {?} */ switchAttr = new Attribute$1('[ngSwitch]', ast.switchValue, ast.switchValueSourceSpan);
    return new Element('ng-container', [switchAttr], children, ast.sourceSpan, ast.sourceSpan, ast.sourceSpan);
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var ProviderError = (function (_super) {
    __extends(ProviderError, _super);
    /**
     * @param {?} message
     * @param {?} span
     */
    function ProviderError(message, span) {
        return _super.call(this, span, message) || this;
    }
    return ProviderError;
}(ParseError));
var ProviderViewContext = (function () {
    /**
     * @param {?} component
     */
    function ProviderViewContext(component) {
        var _this = this;
        this.component = component;
        this.errors = [];
        this.viewQueries = _getViewQueries(component);
        this.viewProviders = new Map();
        component.viewProviders.forEach(function (provider) {
            if (_this.viewProviders.get(tokenReference(provider.token)) == null) {
                _this.viewProviders.set(tokenReference(provider.token), true);
            }
        });
    }
    return ProviderViewContext;
}());
var ProviderElementContext = (function () {
    /**
     * @param {?} viewContext
     * @param {?} _parent
     * @param {?} _isViewRoot
     * @param {?} _directiveAsts
     * @param {?} attrs
     * @param {?} refs
     * @param {?} isTemplate
     * @param {?} contentQueryStartId
     * @param {?} _sourceSpan
     */
    function ProviderElementContext(viewContext, _parent, _isViewRoot, _directiveAsts, attrs, refs, isTemplate, contentQueryStartId, _sourceSpan) {
        var _this = this;
        this.viewContext = viewContext;
        this._parent = _parent;
        this._isViewRoot = _isViewRoot;
        this._directiveAsts = _directiveAsts;
        this._sourceSpan = _sourceSpan;
        this._transformedProviders = new Map();
        this._seenProviders = new Map();
        this._hasViewContainer = false;
        this._queriedTokens = new Map();
        this._attrs = {};
        attrs.forEach(function (attrAst) { return _this._attrs[attrAst.name] = attrAst.value; });
        var directivesMeta = _directiveAsts.map(function (directiveAst) { return directiveAst.directive; });
        this._allProviders =
            _resolveProvidersFromDirectives(directivesMeta, _sourceSpan, viewContext.errors);
        this._contentQueries = _getContentQueries(contentQueryStartId, directivesMeta);
        Array.from(this._allProviders.values()).forEach(function (provider) {
            _this._addQueryReadsTo(provider.token, provider.token, _this._queriedTokens);
        });
        if (isTemplate) {
            var templateRefId = createIdentifierToken(Identifiers.TemplateRef);
            this._addQueryReadsTo(templateRefId, templateRefId, this._queriedTokens);
        }
        refs.forEach(function (refAst) {
            var defaultQueryValue = refAst.value || createIdentifierToken(Identifiers.ElementRef);
            _this._addQueryReadsTo({ value: refAst.name }, defaultQueryValue, _this._queriedTokens);
        });
        if (this._queriedTokens.get(resolveIdentifier(Identifiers.ViewContainerRef))) {
            this._hasViewContainer = true;
        }
        // create the providers that we know are eager first
        Array.from(this._allProviders.values()).forEach(function (provider) {
            var eager = provider.eager || _this._queriedTokens.get(tokenReference(provider.token));
            if (eager) {
                _this._getOrCreateLocalProvider(provider.providerType, provider.token, true);
            }
        });
    }
    /**
     * @return {?}
     */
    ProviderElementContext.prototype.afterElement = function () {
        var _this = this;
        // collect lazy providers
        Array.from(this._allProviders.values()).forEach(function (provider) {
            _this._getOrCreateLocalProvider(provider.providerType, provider.token, false);
        });
    };
    Object.defineProperty(ProviderElementContext.prototype, "transformProviders", {
        /**
         * @return {?}
         */
        get: function () {
            return Array.from(this._transformedProviders.values());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProviderElementContext.prototype, "transformedDirectiveAsts", {
        /**
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ sortedProviderTypes = this.transformProviders.map(function (provider) { return provider.token.identifier; });
            var /** @type {?} */ sortedDirectives = this._directiveAsts.slice();
            sortedDirectives.sort(function (dir1, dir2) { return sortedProviderTypes.indexOf(dir1.directive.type) -
                sortedProviderTypes.indexOf(dir2.directive.type); });
            return sortedDirectives;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProviderElementContext.prototype, "transformedHasViewContainer", {
        /**
         * @return {?}
         */
        get: function () { return this._hasViewContainer; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProviderElementContext.prototype, "queryMatches", {
        /**
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ allMatches = [];
            this._queriedTokens.forEach(function (matches) { allMatches.push.apply(allMatches, matches); });
            return allMatches;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} token
     * @param {?} defaultValue
     * @param {?} queryReadTokens
     * @return {?}
     */
    ProviderElementContext.prototype._addQueryReadsTo = function (token, defaultValue, queryReadTokens) {
        this._getQueriesFor(token).forEach(function (query) {
            var /** @type {?} */ queryValue = query.meta.read || defaultValue;
            var /** @type {?} */ tokenRef = tokenReference(queryValue);
            var /** @type {?} */ queryMatches = queryReadTokens.get(tokenRef);
            if (!queryMatches) {
                queryMatches = [];
                queryReadTokens.set(tokenRef, queryMatches);
            }
            queryMatches.push({ queryId: query.queryId, value: queryValue });
        });
    };
    /**
     * @param {?} token
     * @return {?}
     */
    ProviderElementContext.prototype._getQueriesFor = function (token) {
        var /** @type {?} */ result = [];
        var /** @type {?} */ currentEl = this;
        var /** @type {?} */ distance = 0;
        var /** @type {?} */ queries;
        while (currentEl !== null) {
            queries = currentEl._contentQueries.get(tokenReference(token));
            if (queries) {
                result.push.apply(result, queries.filter(function (query) { return query.meta.descendants || distance <= 1; }));
            }
            if (currentEl._directiveAsts.length > 0) {
                distance++;
            }
            currentEl = currentEl._parent;
        }
        queries = this.viewContext.viewQueries.get(tokenReference(token));
        if (queries) {
            result.push.apply(result, queries);
        }
        return result;
    };
    /**
     * @param {?} requestingProviderType
     * @param {?} token
     * @param {?} eager
     * @return {?}
     */
    ProviderElementContext.prototype._getOrCreateLocalProvider = function (requestingProviderType, token, eager) {
        var _this = this;
        var /** @type {?} */ resolvedProvider = this._allProviders.get(tokenReference(token));
        if (!resolvedProvider || ((requestingProviderType === ProviderAstType.Directive ||
            requestingProviderType === ProviderAstType.PublicService) &&
            resolvedProvider.providerType === ProviderAstType.PrivateService) ||
            ((requestingProviderType === ProviderAstType.PrivateService ||
                requestingProviderType === ProviderAstType.PublicService) &&
                resolvedProvider.providerType === ProviderAstType.Builtin)) {
            return null;
        }
        var /** @type {?} */ transformedProviderAst = this._transformedProviders.get(tokenReference(token));
        if (transformedProviderAst) {
            return transformedProviderAst;
        }
        if (this._seenProviders.get(tokenReference(token)) != null) {
            this.viewContext.errors.push(new ProviderError("Cannot instantiate cyclic dependency! " + tokenName(token), this._sourceSpan));
            return null;
        }
        this._seenProviders.set(tokenReference(token), true);
        var /** @type {?} */ transformedProviders = resolvedProvider.providers.map(function (provider) {
            var /** @type {?} */ transformedUseValue = provider.useValue;
            var /** @type {?} */ transformedUseExisting = ((provider.useExisting));
            var /** @type {?} */ transformedDeps = ((undefined));
            if (provider.useExisting != null) {
                var /** @type {?} */ existingDiDep = ((_this._getDependency(resolvedProvider.providerType, { token: provider.useExisting }, eager)));
                if (existingDiDep.token != null) {
                    transformedUseExisting = existingDiDep.token;
                }
                else {
                    transformedUseExisting = ((null));
                    transformedUseValue = existingDiDep.value;
                }
            }
            else if (provider.useFactory) {
                var /** @type {?} */ deps = provider.deps || provider.useFactory.diDeps;
                transformedDeps =
                    deps.map(function (dep) { return ((_this._getDependency(resolvedProvider.providerType, dep, eager))); });
            }
            else if (provider.useClass) {
                var /** @type {?} */ deps = provider.deps || provider.useClass.diDeps;
                transformedDeps =
                    deps.map(function (dep) { return ((_this._getDependency(resolvedProvider.providerType, dep, eager))); });
            }
            return _transformProvider(provider, {
                useExisting: transformedUseExisting,
                useValue: transformedUseValue,
                deps: transformedDeps
            });
        });
        transformedProviderAst =
            _transformProviderAst(resolvedProvider, { eager: eager, providers: transformedProviders });
        this._transformedProviders.set(tokenReference(token), transformedProviderAst);
        return transformedProviderAst;
    };
    /**
     * @param {?} requestingProviderType
     * @param {?} dep
     * @param {?=} eager
     * @return {?}
     */
    ProviderElementContext.prototype._getLocalDependency = function (requestingProviderType, dep, eager) {
        if (eager === void 0) { eager = false; }
        if (dep.isAttribute) {
            var /** @type {?} */ attrValue = this._attrs[((dep.token)).value];
            return { isValue: true, value: attrValue == null ? null : attrValue };
        }
        if (dep.token != null) {
            // access builtints
            if ((requestingProviderType === ProviderAstType.Directive ||
                requestingProviderType === ProviderAstType.Component)) {
                if (tokenReference(dep.token) === resolveIdentifier(Identifiers.Renderer) ||
                    tokenReference(dep.token) === resolveIdentifier(Identifiers.ElementRef) ||
                    tokenReference(dep.token) === resolveIdentifier(Identifiers.ChangeDetectorRef) ||
                    tokenReference(dep.token) === resolveIdentifier(Identifiers.TemplateRef)) {
                    return dep;
                }
                if (tokenReference(dep.token) === resolveIdentifier(Identifiers.ViewContainerRef)) {
                    this._hasViewContainer = true;
                }
            }
            // access the injector
            if (tokenReference(dep.token) === resolveIdentifier(Identifiers.Injector)) {
                return dep;
            }
            // access providers
            if (this._getOrCreateLocalProvider(requestingProviderType, dep.token, eager) != null) {
                return dep;
            }
        }
        return null;
    };
    /**
     * @param {?} requestingProviderType
     * @param {?} dep
     * @param {?=} eager
     * @return {?}
     */
    ProviderElementContext.prototype._getDependency = function (requestingProviderType, dep, eager) {
        if (eager === void 0) { eager = false; }
        var /** @type {?} */ currElement = this;
        var /** @type {?} */ currEager = eager;
        var /** @type {?} */ result = null;
        if (!dep.isSkipSelf) {
            result = this._getLocalDependency(requestingProviderType, dep, eager);
        }
        if (dep.isSelf) {
            if (!result && dep.isOptional) {
                result = { isValue: true, value: null };
            }
        }
        else {
            // check parent elements
            while (!result && currElement._parent) {
                var /** @type {?} */ prevElement = currElement;
                currElement = currElement._parent;
                if (prevElement._isViewRoot) {
                    currEager = false;
                }
                result = currElement._getLocalDependency(ProviderAstType.PublicService, dep, currEager);
            }
            // check @Host restriction
            if (!result) {
                if (!dep.isHost || this.viewContext.component.isHost ||
                    this.viewContext.component.type.reference === tokenReference(/** @type {?} */ ((dep.token))) ||
                    this.viewContext.viewProviders.get(tokenReference(/** @type {?} */ ((dep.token)))) != null) {
                    result = dep;
                }
                else {
                    result = dep.isOptional ? result = { isValue: true, value: null } : null;
                }
            }
        }
        if (!result) {
            this.viewContext.errors.push(new ProviderError("No provider for " + tokenName(/** @type {?} */ ((dep.token))), this._sourceSpan));
        }
        return result;
    };
    return ProviderElementContext;
}());
var NgModuleProviderAnalyzer = (function () {
    /**
     * @param {?} ngModule
     * @param {?} extraProviders
     * @param {?} sourceSpan
     */
    function NgModuleProviderAnalyzer(ngModule, extraProviders, sourceSpan) {
        var _this = this;
        this._transformedProviders = new Map();
        this._seenProviders = new Map();
        this._errors = [];
        this._allProviders = new Map();
        ngModule.transitiveModule.modules.forEach(function (ngModuleType) {
            var ngModuleProvider = { token: { identifier: ngModuleType }, useClass: ngModuleType };
            _resolveProviders([ngModuleProvider], ProviderAstType.PublicService, true, sourceSpan, _this._errors, _this._allProviders);
        });
        _resolveProviders(ngModule.transitiveModule.providers.map(function (entry) { return entry.provider; }).concat(extraProviders), ProviderAstType.PublicService, false, sourceSpan, this._errors, this._allProviders);
    }
    /**
     * @return {?}
     */
    NgModuleProviderAnalyzer.prototype.parse = function () {
        var _this = this;
        Array.from(this._allProviders.values()).forEach(function (provider) {
            _this._getOrCreateLocalProvider(provider.token, provider.eager);
        });
        if (this._errors.length > 0) {
            var /** @type {?} */ errorString = this._errors.join('\n');
            throw new Error("Provider parse errors:\n" + errorString);
        }
        return Array.from(this._transformedProviders.values());
    };
    /**
     * @param {?} token
     * @param {?} eager
     * @return {?}
     */
    NgModuleProviderAnalyzer.prototype._getOrCreateLocalProvider = function (token, eager) {
        var _this = this;
        var /** @type {?} */ resolvedProvider = this._allProviders.get(tokenReference(token));
        if (!resolvedProvider) {
            return null;
        }
        var /** @type {?} */ transformedProviderAst = this._transformedProviders.get(tokenReference(token));
        if (transformedProviderAst) {
            return transformedProviderAst;
        }
        if (this._seenProviders.get(tokenReference(token)) != null) {
            this._errors.push(new ProviderError("Cannot instantiate cyclic dependency! " + tokenName(token), resolvedProvider.sourceSpan));
            return null;
        }
        this._seenProviders.set(tokenReference(token), true);
        var /** @type {?} */ transformedProviders = resolvedProvider.providers.map(function (provider) {
            var /** @type {?} */ transformedUseValue = provider.useValue;
            var /** @type {?} */ transformedUseExisting = ((provider.useExisting));
            var /** @type {?} */ transformedDeps = ((undefined));
            if (provider.useExisting != null) {
                var /** @type {?} */ existingDiDep = _this._getDependency({ token: provider.useExisting }, eager, resolvedProvider.sourceSpan);
                if (existingDiDep.token != null) {
                    transformedUseExisting = existingDiDep.token;
                }
                else {
                    transformedUseExisting = ((null));
                    transformedUseValue = existingDiDep.value;
                }
            }
            else if (provider.useFactory) {
                var /** @type {?} */ deps = provider.deps || provider.useFactory.diDeps;
                transformedDeps =
                    deps.map(function (dep) { return _this._getDependency(dep, eager, resolvedProvider.sourceSpan); });
            }
            else if (provider.useClass) {
                var /** @type {?} */ deps = provider.deps || provider.useClass.diDeps;
                transformedDeps =
                    deps.map(function (dep) { return _this._getDependency(dep, eager, resolvedProvider.sourceSpan); });
            }
            return _transformProvider(provider, {
                useExisting: transformedUseExisting,
                useValue: transformedUseValue,
                deps: transformedDeps
            });
        });
        transformedProviderAst =
            _transformProviderAst(resolvedProvider, { eager: eager, providers: transformedProviders });
        this._transformedProviders.set(tokenReference(token), transformedProviderAst);
        return transformedProviderAst;
    };
    /**
     * @param {?} dep
     * @param {?=} eager
     * @param {?=} requestorSourceSpan
     * @return {?}
     */
    NgModuleProviderAnalyzer.prototype._getDependency = function (dep, eager, requestorSourceSpan) {
        if (eager === void 0) { eager = false; }
        var /** @type {?} */ foundLocal = false;
        if (!dep.isSkipSelf && dep.token != null) {
            // access the injector
            if (tokenReference(dep.token) === resolveIdentifier(Identifiers.Injector) ||
                tokenReference(dep.token) === resolveIdentifier(Identifiers.ComponentFactoryResolver)) {
                foundLocal = true;
            }
            else if (this._getOrCreateLocalProvider(dep.token, eager) != null) {
                foundLocal = true;
            }
        }
        var /** @type {?} */ result = dep;
        if (dep.isSelf && !foundLocal) {
            if (dep.isOptional) {
                result = { isValue: true, value: null };
            }
            else {
                this._errors.push(new ProviderError("No provider for " + tokenName(/** @type {?} */ ((dep.token))), requestorSourceSpan));
            }
        }
        return result;
    };
    return NgModuleProviderAnalyzer;
}());
/**
 * @param {?} provider
 * @param {?} __1
 * @return {?}
 */
function _transformProvider(provider, _a) {
    var useExisting = _a.useExisting, useValue = _a.useValue, deps = _a.deps;
    return {
        token: provider.token,
        useClass: provider.useClass,
        useExisting: useExisting,
        useFactory: provider.useFactory,
        useValue: useValue,
        deps: deps,
        multi: provider.multi
    };
}
/**
 * @param {?} provider
 * @param {?} __1
 * @return {?}
 */
function _transformProviderAst(provider, _a) {
    var eager = _a.eager, providers = _a.providers;
    return new ProviderAst(provider.token, provider.multiProvider, provider.eager || eager, providers, provider.providerType, provider.lifecycleHooks, provider.sourceSpan);
}
/**
 * @param {?} directives
 * @param {?} sourceSpan
 * @param {?} targetErrors
 * @return {?}
 */
function _resolveProvidersFromDirectives(directives, sourceSpan, targetErrors) {
    var /** @type {?} */ providersByToken = new Map();
    directives.forEach(function (directive) {
        var /** @type {?} */ dirProvider = { token: { identifier: directive.type }, useClass: directive.type };
        _resolveProviders([dirProvider], directive.isComponent ? ProviderAstType.Component : ProviderAstType.Directive, true, sourceSpan, targetErrors, providersByToken);
    });
    // Note: directives need to be able to overwrite providers of a component!
    var /** @type {?} */ directivesWithComponentFirst = directives.filter(function (dir) { return dir.isComponent; }).concat(directives.filter(function (dir) { return !dir.isComponent; }));
    directivesWithComponentFirst.forEach(function (directive) {
        _resolveProviders(directive.providers, ProviderAstType.PublicService, false, sourceSpan, targetErrors, providersByToken);
        _resolveProviders(directive.viewProviders, ProviderAstType.PrivateService, false, sourceSpan, targetErrors, providersByToken);
    });
    return providersByToken;
}
/**
 * @param {?} providers
 * @param {?} providerType
 * @param {?} eager
 * @param {?} sourceSpan
 * @param {?} targetErrors
 * @param {?} targetProvidersByToken
 * @return {?}
 */
function _resolveProviders(providers, providerType, eager, sourceSpan, targetErrors, targetProvidersByToken) {
    providers.forEach(function (provider) {
        var /** @type {?} */ resolvedProvider = targetProvidersByToken.get(tokenReference(provider.token));
        if (resolvedProvider != null && !!resolvedProvider.multiProvider !== !!provider.multi) {
            targetErrors.push(new ProviderError("Mixing multi and non multi provider is not possible for token " + tokenName(resolvedProvider.token), sourceSpan));
        }
        if (!resolvedProvider) {
            var /** @type {?} */ lifecycleHooks = provider.token.identifier &&
                ((provider.token.identifier)).lifecycleHooks ?
                ((provider.token.identifier)).lifecycleHooks :
                [];
            var /** @type {?} */ isUseValue = !(provider.useClass || provider.useExisting || provider.useFactory);
            resolvedProvider = new ProviderAst(provider.token, !!provider.multi, eager || isUseValue, [provider], providerType, lifecycleHooks, sourceSpan);
            targetProvidersByToken.set(tokenReference(provider.token), resolvedProvider);
        }
        else {
            if (!provider.multi) {
                resolvedProvider.providers.length = 0;
            }
            resolvedProvider.providers.push(provider);
        }
    });
}
/**
 * @param {?} component
 * @return {?}
 */
function _getViewQueries(component) {
    // Note: queries start with id 1 so we can use the number in a Bloom filter!
    var /** @type {?} */ viewQueryId = 1;
    var /** @type {?} */ viewQueries = new Map();
    if (component.viewQueries) {
        component.viewQueries.forEach(function (query) { return _addQueryToTokenMap(viewQueries, { meta: query, queryId: viewQueryId++ }); });
    }
    return viewQueries;
}
/**
 * @param {?} contentQueryStartId
 * @param {?} directives
 * @return {?}
 */
function _getContentQueries(contentQueryStartId, directives) {
    var /** @type {?} */ contentQueryId = contentQueryStartId;
    var /** @type {?} */ contentQueries = new Map();
    directives.forEach(function (directive, directiveIndex) {
        if (directive.queries) {
            directive.queries.forEach(function (query) { return _addQueryToTokenMap(contentQueries, { meta: query, queryId: contentQueryId++ }); });
        }
    });
    return contentQueries;
}
/**
 * @param {?} map
 * @param {?} query
 * @return {?}
 */
function _addQueryToTokenMap(map, query) {
    query.meta.selectors.forEach(function (token) {
        var /** @type {?} */ entry = map.get(tokenReference(token));
        if (!entry) {
            entry = [];
            map.set(tokenReference(token), entry);
        }
        entry.push(query);
    });
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @abstract
 */
var ElementSchemaRegistry = (function () {
    function ElementSchemaRegistry() {
    }
    /**
     * @abstract
     * @param {?} tagName
     * @param {?} propName
     * @param {?} schemaMetas
     * @return {?}
     */
    ElementSchemaRegistry.prototype.hasProperty = function (tagName, propName, schemaMetas) { };
    /**
     * @abstract
     * @param {?} tagName
     * @param {?} schemaMetas
     * @return {?}
     */
    ElementSchemaRegistry.prototype.hasElement = function (tagName, schemaMetas) { };
    /**
     * @abstract
     * @param {?} elementName
     * @param {?} propName
     * @param {?} isAttribute
     * @return {?}
     */
    ElementSchemaRegistry.prototype.securityContext = function (elementName, propName, isAttribute) { };
    /**
     * @abstract
     * @return {?}
     */
    ElementSchemaRegistry.prototype.allKnownElementNames = function () { };
    /**
     * @abstract
     * @param {?} propName
     * @return {?}
     */
    ElementSchemaRegistry.prototype.getMappedPropName = function (propName) { };
    /**
     * @abstract
     * @return {?}
     */
    ElementSchemaRegistry.prototype.getDefaultComponentElementName = function () { };
    /**
     * @abstract
     * @param {?} name
     * @return {?}
     */
    ElementSchemaRegistry.prototype.validateProperty = function (name) { };
    /**
     * @abstract
     * @param {?} name
     * @return {?}
     */
    ElementSchemaRegistry.prototype.validateAttribute = function (name) { };
    /**
     * @abstract
     * @param {?} propName
     * @return {?}
     */
    ElementSchemaRegistry.prototype.normalizeAnimationStyleProperty = function (propName) { };
    /**
     * @abstract
     * @param {?} camelCaseProp
     * @param {?} userProvidedProp
     * @param {?} val
     * @return {?}
     */
    ElementSchemaRegistry.prototype.normalizeAnimationStyleValue = function (camelCaseProp, userProvidedProp, val) { };
    return ElementSchemaRegistry;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var StyleWithImports = (function () {
    /**
     * @param {?} style
     * @param {?} styleUrls
     */
    function StyleWithImports(style$$1, styleUrls) {
        this.style = style$$1;
        this.styleUrls = styleUrls;
    }
    return StyleWithImports;
}());
/**
 * @param {?} url
 * @return {?}
 */
function isStyleUrlResolvable(url) {
    if (url == null || url.length === 0 || url[0] == '/')
        return false;
    var /** @type {?} */ schemeMatch = url.match(URL_WITH_SCHEMA_REGEXP);
    return schemeMatch === null || schemeMatch[1] == 'package' || schemeMatch[1] == 'asset';
}
/**
 * Rewrites stylesheets by resolving and removing the \@import urls that
 * are either relative or don't have a `package:` scheme
 * @param {?} resolver
 * @param {?} baseUrl
 * @param {?} cssText
 * @return {?}
 */
function extractStyleUrls(resolver, baseUrl, cssText) {
    var /** @type {?} */ foundUrls = [];
    var /** @type {?} */ modifiedCssText = cssText.replace(CSS_COMMENT_REGEXP, '').replace(CSS_IMPORT_REGEXP, function () {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
        }
        var /** @type {?} */ url = m[1] || m[2];
        if (!isStyleUrlResolvable(url)) {
            // Do not attempt to resolve non-package absolute URLs with URI scheme
            return m[0];
        }
        foundUrls.push(resolver.resolve(baseUrl, url));
        return '';
    });
    return new StyleWithImports(modifiedCssText, foundUrls);
}
var CSS_IMPORT_REGEXP = /@import\s+(?:url\()?\s*(?:(?:['"]([^'"]*))|([^;\)\s]*))[^;]*;?/g;
var CSS_COMMENT_REGEXP = /\/\*.+?\*\//g;
var URL_WITH_SCHEMA_REGEXP = /^([^:/?#]+):/;
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var PROPERTY_PARTS_SEPARATOR = '.';
var ATTRIBUTE_PREFIX = 'attr';
var CLASS_PREFIX = 'class';
var STYLE_PREFIX = 'style';
var ANIMATE_PROP_PREFIX = 'animate-';
var BoundPropertyType = {};
BoundPropertyType.DEFAULT = 0;
BoundPropertyType.LITERAL_ATTR = 1;
BoundPropertyType.ANIMATION = 2;
BoundPropertyType[BoundPropertyType.DEFAULT] = "DEFAULT";
BoundPropertyType[BoundPropertyType.LITERAL_ATTR] = "LITERAL_ATTR";
BoundPropertyType[BoundPropertyType.ANIMATION] = "ANIMATION";
/**
 * Represents a parsed property.
 */
var BoundProperty = (function () {
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} type
     * @param {?} sourceSpan
     */
    function BoundProperty(name, expression, type, sourceSpan) {
        this.name = name;
        this.expression = expression;
        this.type = type;
        this.sourceSpan = sourceSpan;
    }
    Object.defineProperty(BoundProperty.prototype, "isLiteral", {
        /**
         * @return {?}
         */
        get: function () { return this.type === BoundPropertyType.LITERAL_ATTR; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BoundProperty.prototype, "isAnimation", {
        /**
         * @return {?}
         */
        get: function () { return this.type === BoundPropertyType.ANIMATION; },
        enumerable: true,
        configurable: true
    });
    return BoundProperty;
}());
/**
 * Parses bindings in templates and in the directive host area.
 */
var BindingParser = (function () {
    /**
     * @param {?} _exprParser
     * @param {?} _interpolationConfig
     * @param {?} _schemaRegistry
     * @param {?} pipes
     * @param {?} _targetErrors
     */
    function BindingParser(_exprParser, _interpolationConfig, _schemaRegistry, pipes, _targetErrors) {
        var _this = this;
        this._exprParser = _exprParser;
        this._interpolationConfig = _interpolationConfig;
        this._schemaRegistry = _schemaRegistry;
        this._targetErrors = _targetErrors;
        this.pipesByName = new Map();
        this._usedPipes = new Map();
        pipes.forEach(function (pipe) { return _this.pipesByName.set(pipe.name, pipe); });
    }
    /**
     * @return {?}
     */
    BindingParser.prototype.getUsedPipes = function () { return Array.from(this._usedPipes.values()); };
    /**
     * @param {?} dirMeta
     * @param {?} elementSelector
     * @param {?} sourceSpan
     * @return {?}
     */
    BindingParser.prototype.createDirectiveHostPropertyAsts = function (dirMeta, elementSelector, sourceSpan) {
        var _this = this;
        if (dirMeta.hostProperties) {
            var /** @type {?} */ boundProps_1 = [];
            Object.keys(dirMeta.hostProperties).forEach(function (propName) {
                var /** @type {?} */ expression = dirMeta.hostProperties[propName];
                if (typeof expression === 'string') {
                    _this.parsePropertyBinding(propName, expression, true, sourceSpan, [], boundProps_1);
                }
                else {
                    _this._reportError("Value of the host property binding \"" + propName + "\" needs to be a string representing an expression but got \"" + expression + "\" (" + typeof expression + ")", sourceSpan);
                }
            });
            return boundProps_1.map(function (prop) { return _this.createElementPropertyAst(elementSelector, prop); });
        }
        return null;
    };
    /**
     * @param {?} dirMeta
     * @param {?} sourceSpan
     * @return {?}
     */
    BindingParser.prototype.createDirectiveHostEventAsts = function (dirMeta, sourceSpan) {
        var _this = this;
        if (dirMeta.hostListeners) {
            var /** @type {?} */ targetEventAsts_1 = [];
            Object.keys(dirMeta.hostListeners).forEach(function (propName) {
                var /** @type {?} */ expression = dirMeta.hostListeners[propName];
                if (typeof expression === 'string') {
                    _this.parseEvent(propName, expression, sourceSpan, [], targetEventAsts_1);
                }
                else {
                    _this._reportError("Value of the host listener \"" + propName + "\" needs to be a string representing an expression but got \"" + expression + "\" (" + typeof expression + ")", sourceSpan);
                }
            });
            return targetEventAsts_1;
        }
        return null;
    };
    /**
     * @param {?} value
     * @param {?} sourceSpan
     * @return {?}
     */
    BindingParser.prototype.parseInterpolation = function (value, sourceSpan) {
        var /** @type {?} */ sourceInfo = sourceSpan.start.toString();
        try {
            var /** @type {?} */ ast = ((this._exprParser.parseInterpolation(value, sourceInfo, this._interpolationConfig)));
            if (ast)
                this._reportExpressionParserErrors(ast.errors, sourceSpan);
            this._checkPipes(ast, sourceSpan);
            return ast;
        }
        catch (e) {
            this._reportError("" + e, sourceSpan);
            return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
        }
    };
    /**
     * @param {?} prefixToken
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetProps
     * @param {?} targetVars
     * @return {?}
     */
    BindingParser.prototype.parseInlineTemplateBinding = function (prefixToken, value, sourceSpan, targetMatchableAttrs, targetProps, targetVars) {
        var /** @type {?} */ bindings = this._parseTemplateBindings(prefixToken, value, sourceSpan);
        for (var /** @type {?} */ i = 0; i < bindings.length; i++) {
            var /** @type {?} */ binding = bindings[i];
            if (binding.keyIsVar) {
                targetVars.push(new VariableAst(binding.key, binding.name, sourceSpan));
            }
            else if (binding.expression) {
                this._parsePropertyAst(binding.key, binding.expression, sourceSpan, targetMatchableAttrs, targetProps);
            }
            else {
                targetMatchableAttrs.push([binding.key, '']);
                this.parseLiteralAttr(binding.key, null, sourceSpan, targetMatchableAttrs, targetProps);
            }
        }
    };
    /**
     * @param {?} prefixToken
     * @param {?} value
     * @param {?} sourceSpan
     * @return {?}
     */
    BindingParser.prototype._parseTemplateBindings = function (prefixToken, value, sourceSpan) {
        var _this = this;
        var /** @type {?} */ sourceInfo = sourceSpan.start.toString();
        try {
            var /** @type {?} */ bindingsResult = this._exprParser.parseTemplateBindings(prefixToken, value, sourceInfo);
            this._reportExpressionParserErrors(bindingsResult.errors, sourceSpan);
            bindingsResult.templateBindings.forEach(function (binding) {
                if (binding.expression) {
                    _this._checkPipes(binding.expression, sourceSpan);
                }
            });
            bindingsResult.warnings.forEach(function (warning) { _this._reportError(warning, sourceSpan, ParseErrorLevel.WARNING); });
            return bindingsResult.templateBindings;
        }
        catch (e) {
            this._reportError("" + e, sourceSpan);
            return [];
        }
    };
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetProps
     * @return {?}
     */
    BindingParser.prototype.parseLiteralAttr = function (name, value, sourceSpan, targetMatchableAttrs, targetProps) {
        if (_isAnimationLabel(name)) {
            name = name.substring(1);
            if (value) {
                this._reportError("Assigning animation triggers via @prop=\"exp\" attributes with an expression is invalid." +
                    " Use property bindings (e.g. [@prop]=\"exp\") or use an attribute without a value (e.g. @prop) instead.", sourceSpan, ParseErrorLevel.ERROR);
            }
            this._parseAnimation(name, value, sourceSpan, targetMatchableAttrs, targetProps);
        }
        else {
            targetProps.push(new BoundProperty(name, this._exprParser.wrapLiteralPrimitive(value, ''), BoundPropertyType.LITERAL_ATTR, sourceSpan));
        }
    };
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} isHost
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetProps
     * @return {?}
     */
    BindingParser.prototype.parsePropertyBinding = function (name, expression, isHost, sourceSpan, targetMatchableAttrs, targetProps) {
        var /** @type {?} */ isAnimationProp = false;
        if (name.startsWith(ANIMATE_PROP_PREFIX)) {
            isAnimationProp = true;
            name = name.substring(ANIMATE_PROP_PREFIX.length);
        }
        else if (_isAnimationLabel(name)) {
            isAnimationProp = true;
            name = name.substring(1);
        }
        if (isAnimationProp) {
            this._parseAnimation(name, expression, sourceSpan, targetMatchableAttrs, targetProps);
        }
        else {
            this._parsePropertyAst(name, this._parseBinding(expression, isHost, sourceSpan), sourceSpan, targetMatchableAttrs, targetProps);
        }
    };
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetProps
     * @return {?}
     */
    BindingParser.prototype.parsePropertyInterpolation = function (name, value, sourceSpan, targetMatchableAttrs, targetProps) {
        var /** @type {?} */ expr = this.parseInterpolation(value, sourceSpan);
        if (expr) {
            this._parsePropertyAst(name, expr, sourceSpan, targetMatchableAttrs, targetProps);
            return true;
        }
        return false;
    };
    /**
     * @param {?} name
     * @param {?} ast
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetProps
     * @return {?}
     */
    BindingParser.prototype._parsePropertyAst = function (name, ast, sourceSpan, targetMatchableAttrs, targetProps) {
        targetMatchableAttrs.push([name, /** @type {?} */ ((ast.source))]);
        targetProps.push(new BoundProperty(name, ast, BoundPropertyType.DEFAULT, sourceSpan));
    };
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetProps
     * @return {?}
     */
    BindingParser.prototype._parseAnimation = function (name, expression, sourceSpan, targetMatchableAttrs, targetProps) {
        // This will occur when a @trigger is not paired with an expression.
        // For animations it is valid to not have an expression since */void
        // states will be applied by angular when the element is attached/detached
        var /** @type {?} */ ast = this._parseBinding(expression || 'null', false, sourceSpan);
        targetMatchableAttrs.push([name, /** @type {?} */ ((ast.source))]);
        targetProps.push(new BoundProperty(name, ast, BoundPropertyType.ANIMATION, sourceSpan));
    };
    /**
     * @param {?} value
     * @param {?} isHostBinding
     * @param {?} sourceSpan
     * @return {?}
     */
    BindingParser.prototype._parseBinding = function (value, isHostBinding, sourceSpan) {
        var /** @type {?} */ sourceInfo = sourceSpan.start.toString();
        try {
            var /** @type {?} */ ast = isHostBinding ?
                this._exprParser.parseSimpleBinding(value, sourceInfo, this._interpolationConfig) :
                this._exprParser.parseBinding(value, sourceInfo, this._interpolationConfig);
            if (ast)
                this._reportExpressionParserErrors(ast.errors, sourceSpan);
            this._checkPipes(ast, sourceSpan);
            return ast;
        }
        catch (e) {
            this._reportError("" + e, sourceSpan);
            return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
        }
    };
    /**
     * @param {?} elementSelector
     * @param {?} boundProp
     * @return {?}
     */
    BindingParser.prototype.createElementPropertyAst = function (elementSelector, boundProp) {
        if (boundProp.isAnimation) {
            return new BoundElementPropertyAst(boundProp.name, PropertyBindingType.Animation, SecurityContext.NONE, boundProp.expression, null, boundProp.sourceSpan);
        }
        var /** @type {?} */ unit = null;
        var /** @type {?} */ bindingType = ((undefined));
        var /** @type {?} */ boundPropertyName = null;
        var /** @type {?} */ parts = boundProp.name.split(PROPERTY_PARTS_SEPARATOR);
        var /** @type {?} */ securityContexts = ((undefined));
        // Check check for special cases (prefix style, attr, class)
        if (parts.length > 1) {
            if (parts[0] == ATTRIBUTE_PREFIX) {
                boundPropertyName = parts[1];
                this._validatePropertyOrAttributeName(boundPropertyName, boundProp.sourceSpan, true);
                securityContexts = calcPossibleSecurityContexts(this._schemaRegistry, elementSelector, boundPropertyName, true);
                var /** @type {?} */ nsSeparatorIdx = boundPropertyName.indexOf(':');
                if (nsSeparatorIdx > -1) {
                    var /** @type {?} */ ns = boundPropertyName.substring(0, nsSeparatorIdx);
                    var /** @type {?} */ name = boundPropertyName.substring(nsSeparatorIdx + 1);
                    boundPropertyName = mergeNsAndName(ns, name);
                }
                bindingType = PropertyBindingType.Attribute;
            }
            else if (parts[0] == CLASS_PREFIX) {
                boundPropertyName = parts[1];
                bindingType = PropertyBindingType.Class;
                securityContexts = [SecurityContext.NONE];
            }
            else if (parts[0] == STYLE_PREFIX) {
                unit = parts.length > 2 ? parts[2] : null;
                boundPropertyName = parts[1];
                bindingType = PropertyBindingType.Style;
                securityContexts = [SecurityContext.STYLE];
            }
        }
        // If not a special case, use the full property name
        if (boundPropertyName === null) {
            boundPropertyName = this._schemaRegistry.getMappedPropName(boundProp.name);
            securityContexts = calcPossibleSecurityContexts(this._schemaRegistry, elementSelector, boundPropertyName, false);
            bindingType = PropertyBindingType.Property;
            this._validatePropertyOrAttributeName(boundPropertyName, boundProp.sourceSpan, false);
        }
        return new BoundElementPropertyAst(boundPropertyName, bindingType, securityContexts[0], boundProp.expression, unit, boundProp.sourceSpan);
    };
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetEvents
     * @return {?}
     */
    BindingParser.prototype.parseEvent = function (name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
        if (_isAnimationLabel(name)) {
            name = name.substr(1);
            this._parseAnimationEvent(name, expression, sourceSpan, targetEvents);
        }
        else {
            this._parseEvent(name, expression, sourceSpan, targetMatchableAttrs, targetEvents);
        }
    };
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} targetEvents
     * @return {?}
     */
    BindingParser.prototype._parseAnimationEvent = function (name, expression, sourceSpan, targetEvents) {
        var /** @type {?} */ matches = splitAtPeriod(name, [name, '']);
        var /** @type {?} */ eventName = matches[0];
        var /** @type {?} */ phase = matches[1].toLowerCase();
        if (phase) {
            switch (phase) {
                case 'start':
                case 'done':
                    var /** @type {?} */ ast = this._parseAction(expression, sourceSpan);
                    targetEvents.push(new BoundEventAst(eventName, null, phase, ast, sourceSpan));
                    break;
                default:
                    this._reportError("The provided animation output phase value \"" + phase + "\" for \"@" + eventName + "\" is not supported (use start or done)", sourceSpan);
                    break;
            }
        }
        else {
            this._reportError("The animation trigger output event (@" + eventName + ") is missing its phase value name (start or done are currently supported)", sourceSpan);
        }
    };
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetEvents
     * @return {?}
     */
    BindingParser.prototype._parseEvent = function (name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
        // long format: 'target: eventName'
        var _a = splitAtColon(name, [/** @type {?} */ ((null)), name]), target = _a[0], eventName = _a[1];
        var /** @type {?} */ ast = this._parseAction(expression, sourceSpan);
        targetMatchableAttrs.push([/** @type {?} */ ((name)), /** @type {?} */ ((ast.source))]);
        targetEvents.push(new BoundEventAst(eventName, target, null, ast, sourceSpan));
        // Don't detect directives for event names for now,
        // so don't add the event name to the matchableAttrs
    };
    /**
     * @param {?} value
     * @param {?} sourceSpan
     * @return {?}
     */
    BindingParser.prototype._parseAction = function (value, sourceSpan) {
        var /** @type {?} */ sourceInfo = sourceSpan.start.toString();
        try {
            var /** @type {?} */ ast = this._exprParser.parseAction(value, sourceInfo, this._interpolationConfig);
            if (ast) {
                this._reportExpressionParserErrors(ast.errors, sourceSpan);
            }
            if (!ast || ast.ast instanceof EmptyExpr) {
                this._reportError("Empty expressions are not allowed", sourceSpan);
                return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
            }
            this._checkPipes(ast, sourceSpan);
            return ast;
        }
        catch (e) {
            this._reportError("" + e, sourceSpan);
            return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
        }
    };
    /**
     * @param {?} message
     * @param {?} sourceSpan
     * @param {?=} level
     * @return {?}
     */
    BindingParser.prototype._reportError = function (message, sourceSpan, level) {
        if (level === void 0) { level = ParseErrorLevel.ERROR; }
        this._targetErrors.push(new ParseError(sourceSpan, message, level));
    };
    /**
     * @param {?} errors
     * @param {?} sourceSpan
     * @return {?}
     */
    BindingParser.prototype._reportExpressionParserErrors = function (errors, sourceSpan) {
        for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
            var error = errors_1[_i];
            this._reportError(error.message, sourceSpan);
        }
    };
    /**
     * @param {?} ast
     * @param {?} sourceSpan
     * @return {?}
     */
    BindingParser.prototype._checkPipes = function (ast, sourceSpan) {
        var _this = this;
        if (ast) {
            var /** @type {?} */ collector = new PipeCollector();
            ast.visit(collector);
            collector.pipes.forEach(function (ast, pipeName) {
                var /** @type {?} */ pipeMeta = _this.pipesByName.get(pipeName);
                if (!pipeMeta) {
                    _this._reportError("The pipe '" + pipeName + "' could not be found", new ParseSourceSpan(sourceSpan.start.moveBy(ast.span.start), sourceSpan.start.moveBy(ast.span.end)));
                }
                else {
                    _this._usedPipes.set(pipeName, pipeMeta);
                }
            });
        }
    };
    /**
     * @param {?} propName the name of the property / attribute
     * @param {?} sourceSpan
     * @param {?} isAttr true when binding to an attribute
     * @return {?}
     */
    BindingParser.prototype._validatePropertyOrAttributeName = function (propName, sourceSpan, isAttr) {
        var /** @type {?} */ report = isAttr ? this._schemaRegistry.validateAttribute(propName) :
            this._schemaRegistry.validateProperty(propName);
        if (report.error) {
            this._reportError(/** @type {?} */ ((report.msg)), sourceSpan, ParseErrorLevel.ERROR);
        }
    };
    return BindingParser;
}());
var PipeCollector = (function (_super) {
    __extends(PipeCollector, _super);
    function PipeCollector() {
        var _this = _super.apply(this, arguments) || this;
        _this.pipes = new Map();
        return _this;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    PipeCollector.prototype.visitPipe = function (ast, context) {
        this.pipes.set(ast.name, ast);
        ast.exp.visit(this);
        this.visitAll(ast.args, context);
        return null;
    };
    return PipeCollector;
}(RecursiveAstVisitor));
/**
 * @param {?} name
 * @return {?}
 */
function _isAnimationLabel(name) {
    return name[0] == '@';
}
/**
 * @param {?} registry
 * @param {?} selector
 * @param {?} propName
 * @param {?} isAttribute
 * @return {?}
 */
function calcPossibleSecurityContexts(registry, selector, propName, isAttribute) {
    var /** @type {?} */ ctxs = [];
    CssSelector.parse(selector).forEach(function (selector) {
        var /** @type {?} */ elementNames = selector.element ? [selector.element] : registry.allKnownElementNames();
        var /** @type {?} */ notElementNames = new Set(selector.notSelectors.filter(function (selector) { return selector.isElementSelector(); })
            .map(function (selector) { return selector.element; }));
        var /** @type {?} */ possibleElementNames = elementNames.filter(function (elementName) { return !notElementNames.has(elementName); });
        ctxs.push.apply(ctxs, possibleElementNames.map(function (elementName) { return registry.securityContext(elementName, propName, isAttribute); }));
    });
    return ctxs.length === 0 ? [SecurityContext.NONE] : Array.from(new Set(ctxs)).sort();
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var NG_CONTENT_SELECT_ATTR = 'select';
var LINK_ELEMENT = 'link';
var LINK_STYLE_REL_ATTR = 'rel';
var LINK_STYLE_HREF_ATTR = 'href';
var LINK_STYLE_REL_VALUE = 'stylesheet';
var STYLE_ELEMENT = 'style';
var SCRIPT_ELEMENT = 'script';
var NG_NON_BINDABLE_ATTR = 'ngNonBindable';
var NG_PROJECT_AS = 'ngProjectAs';
/**
 * @param {?} ast
 * @return {?}
 */
function preparseElement(ast) {
    var /** @type {?} */ selectAttr = ((null));
    var /** @type {?} */ hrefAttr = ((null));
    var /** @type {?} */ relAttr = ((null));
    var /** @type {?} */ nonBindable = false;
    var /** @type {?} */ projectAs = ((null));
    ast.attrs.forEach(function (attr) {
        var /** @type {?} */ lcAttrName = attr.name.toLowerCase();
        if (lcAttrName == NG_CONTENT_SELECT_ATTR) {
            selectAttr = attr.value;
        }
        else if (lcAttrName == LINK_STYLE_HREF_ATTR) {
            hrefAttr = attr.value;
        }
        else if (lcAttrName == LINK_STYLE_REL_ATTR) {
            relAttr = attr.value;
        }
        else if (attr.name == NG_NON_BINDABLE_ATTR) {
            nonBindable = true;
        }
        else if (attr.name == NG_PROJECT_AS) {
            if (attr.value.length > 0) {
                projectAs = attr.value;
            }
        }
    });
    selectAttr = normalizeNgContentSelect(selectAttr);
    var /** @type {?} */ nodeName = ast.name.toLowerCase();
    var /** @type {?} */ type = PreparsedElementType.OTHER;
    if (isNgContent(nodeName)) {
        type = PreparsedElementType.NG_CONTENT;
    }
    else if (nodeName == STYLE_ELEMENT) {
        type = PreparsedElementType.STYLE;
    }
    else if (nodeName == SCRIPT_ELEMENT) {
        type = PreparsedElementType.SCRIPT;
    }
    else if (nodeName == LINK_ELEMENT && relAttr == LINK_STYLE_REL_VALUE) {
        type = PreparsedElementType.STYLESHEET;
    }
    return new PreparsedElement(type, selectAttr, hrefAttr, nonBindable, projectAs);
}
var PreparsedElementType = {};
PreparsedElementType.NG_CONTENT = 0;
PreparsedElementType.STYLE = 1;
PreparsedElementType.STYLESHEET = 2;
PreparsedElementType.SCRIPT = 3;
PreparsedElementType.OTHER = 4;
PreparsedElementType[PreparsedElementType.NG_CONTENT] = "NG_CONTENT";
PreparsedElementType[PreparsedElementType.STYLE] = "STYLE";
PreparsedElementType[PreparsedElementType.STYLESHEET] = "STYLESHEET";
PreparsedElementType[PreparsedElementType.SCRIPT] = "SCRIPT";
PreparsedElementType[PreparsedElementType.OTHER] = "OTHER";
var PreparsedElement = (function () {
    /**
     * @param {?} type
     * @param {?} selectAttr
     * @param {?} hrefAttr
     * @param {?} nonBindable
     * @param {?} projectAs
     */
    function PreparsedElement(type, selectAttr, hrefAttr, nonBindable, projectAs) {
        this.type = type;
        this.selectAttr = selectAttr;
        this.hrefAttr = hrefAttr;
        this.nonBindable = nonBindable;
        this.projectAs = projectAs;
    }
    return PreparsedElement;
}());
/**
 * @param {?} selectAttr
 * @return {?}
 */
function normalizeNgContentSelect(selectAttr) {
    if (selectAttr === null || selectAttr.length === 0) {
        return '*';
    }
    return selectAttr;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var BIND_NAME_REGEXP = /^(?:(?:(?:(bind-)|(let-)|(ref-|#)|(on-)|(bindon-)|(@))(.+))|\[\(([^\)]+)\)\]|\[([^\]]+)\]|\(([^\)]+)\))$/;
// Group 1 = "bind-"
var KW_BIND_IDX = 1;
// Group 2 = "let-"
var KW_LET_IDX = 2;
// Group 3 = "ref-/#"
var KW_REF_IDX = 3;
// Group 4 = "on-"
var KW_ON_IDX = 4;
// Group 5 = "bindon-"
var KW_BINDON_IDX = 5;
// Group 6 = "@"
var KW_AT_IDX = 6;
// Group 7 = the identifier after "bind-", "let-", "ref-/#", "on-", "bindon-" or "@"
var IDENT_KW_IDX = 7;
// Group 8 = identifier inside [()]
var IDENT_BANANA_BOX_IDX = 8;
// Group 9 = identifier inside []
var IDENT_PROPERTY_IDX = 9;
// Group 10 = identifier inside ()
var IDENT_EVENT_IDX = 10;
// deprecated in 4.x
var TEMPLATE_ELEMENT = 'template';
// deprecated in 4.x
var TEMPLATE_ATTR = 'template';
var TEMPLATE_ATTR_PREFIX = '*';
var CLASS_ATTR = 'class';
var TEXT_CSS_SELECTOR = CssSelector.parse('*')[0];
var TEMPLATE_ELEMENT_DEPRECATION_WARNING = 'The <template> element is deprecated. Use <ng-template> instead';
var TEMPLATE_ATTR_DEPRECATION_WARNING = 'The template attribute is deprecated. Use an ng-template element instead.';
var warningCounts = {};
/**
 * @param {?} warnings
 * @return {?}
 */
function warnOnlyOnce(warnings) {
    return function (error) {
        if (warnings.indexOf(error.msg) !== -1) {
            warningCounts[error.msg] = (warningCounts[error.msg] || 0) + 1;
            return warningCounts[error.msg] <= 1;
        }
        return true;
    };
}
/**
 * Provides an array of {@link TemplateAstVisitor}s which will be used to transform
 * parsed templates before compilation is invoked, allowing custom expression syntax
 * and other advanced transformations.
 *
 * This is currently an internal-only feature and not meant for general use.
 */
var TEMPLATE_TRANSFORMS = new InjectionToken('TemplateTransforms');
var TemplateParseError = (function (_super) {
    __extends(TemplateParseError, _super);
    /**
     * @param {?} message
     * @param {?} span
     * @param {?} level
     */
    function TemplateParseError(message, span, level) {
        return _super.call(this, span, message, level) || this;
    }
    return TemplateParseError;
}(ParseError));
var TemplateParseResult = (function () {
    /**
     * @param {?=} templateAst
     * @param {?=} usedPipes
     * @param {?=} errors
     */
    function TemplateParseResult(templateAst, usedPipes, errors) {
        this.templateAst = templateAst;
        this.usedPipes = usedPipes;
        this.errors = errors;
    }
    return TemplateParseResult;
}());
var TemplateParser = (function () {
    /**
     * @param {?} _config
     * @param {?} _exprParser
     * @param {?} _schemaRegistry
     * @param {?} _htmlParser
     * @param {?} _console
     * @param {?} transforms
     */
    function TemplateParser(_config, _exprParser, _schemaRegistry, _htmlParser, _console, transforms) {
        this._config = _config;
        this._exprParser = _exprParser;
        this._schemaRegistry = _schemaRegistry;
        this._htmlParser = _htmlParser;
        this._console = _console;
        this.transforms = transforms;
    }
    /**
     * @param {?} component
     * @param {?} template
     * @param {?} directives
     * @param {?} pipes
     * @param {?} schemas
     * @param {?} templateUrl
     * @return {?}
     */
    TemplateParser.prototype.parse = function (component, template, directives, pipes, schemas, templateUrl) {
        var /** @type {?} */ result = this.tryParse(component, template, directives, pipes, schemas, templateUrl);
        var /** @type {?} */ warnings = ((result.errors)).filter(function (error) { return error.level === ParseErrorLevel.WARNING; })
            .filter(warnOnlyOnce([TEMPLATE_ATTR_DEPRECATION_WARNING, TEMPLATE_ELEMENT_DEPRECATION_WARNING]));
        var /** @type {?} */ errors = ((result.errors)).filter(function (error) { return error.level === ParseErrorLevel.ERROR; });
        if (warnings.length > 0) {
            this._console.warn("Template parse warnings:\n" + warnings.join('\n'));
        }
        if (errors.length > 0) {
            var /** @type {?} */ errorString = errors.join('\n');
            throw syntaxError("Template parse errors:\n" + errorString);
        }
        return { template: /** @type {?} */ ((result.templateAst)), pipes: /** @type {?} */ ((result.usedPipes)) };
    };
    /**
     * @param {?} component
     * @param {?} template
     * @param {?} directives
     * @param {?} pipes
     * @param {?} schemas
     * @param {?} templateUrl
     * @return {?}
     */
    TemplateParser.prototype.tryParse = function (component, template, directives, pipes, schemas, templateUrl) {
        return this.tryParseHtml(this.expandHtml(/** @type {?} */ ((this._htmlParser)).parse(template, templateUrl, true, this.getInterpolationConfig(component))), component, directives, pipes, schemas);
    };
    /**
     * @param {?} htmlAstWithErrors
     * @param {?} component
     * @param {?} directives
     * @param {?} pipes
     * @param {?} schemas
     * @return {?}
     */
    TemplateParser.prototype.tryParseHtml = function (htmlAstWithErrors, component, directives, pipes, schemas) {
        var /** @type {?} */ result;
        var /** @type {?} */ errors = htmlAstWithErrors.errors;
        var /** @type {?} */ usedPipes = [];
        if (htmlAstWithErrors.rootNodes.length > 0) {
            var /** @type {?} */ uniqDirectives = removeSummaryDuplicates(directives);
            var /** @type {?} */ uniqPipes = removeSummaryDuplicates(pipes);
            var /** @type {?} */ providerViewContext = new ProviderViewContext(component);
            var /** @type {?} */ interpolationConfig = ((undefined));
            if (component.template && component.template.interpolation) {
                interpolationConfig = {
                    start: component.template.interpolation[0],
                    end: component.template.interpolation[1]
                };
            }
            var /** @type {?} */ bindingParser = new BindingParser(this._exprParser, /** @type {?} */ ((interpolationConfig)), this._schemaRegistry, uniqPipes, errors);
            var /** @type {?} */ parseVisitor = new TemplateParseVisitor(this._config, providerViewContext, uniqDirectives, bindingParser, this._schemaRegistry, schemas, errors);
            result = visitAll(parseVisitor, htmlAstWithErrors.rootNodes, EMPTY_ELEMENT_CONTEXT);
            errors.push.apply(errors, providerViewContext.errors);
            usedPipes.push.apply(usedPipes, bindingParser.getUsedPipes());
        }
        else {
            result = [];
        }
        this._assertNoReferenceDuplicationOnTemplate(result, errors);
        if (errors.length > 0) {
            return new TemplateParseResult(result, usedPipes, errors);
        }
        if (this.transforms) {
            this.transforms.forEach(function (transform) { result = templateVisitAll(transform, result); });
        }
        return new TemplateParseResult(result, usedPipes, errors);
    };
    /**
     * @param {?} htmlAstWithErrors
     * @param {?=} forced
     * @return {?}
     */
    TemplateParser.prototype.expandHtml = function (htmlAstWithErrors, forced) {
        if (forced === void 0) { forced = false; }
        var /** @type {?} */ errors = htmlAstWithErrors.errors;
        if (errors.length == 0 || forced) {
            // Transform ICU messages to angular directives
            var /** @type {?} */ expandedHtmlAst = expandNodes(htmlAstWithErrors.rootNodes);
            errors.push.apply(errors, expandedHtmlAst.errors);
            htmlAstWithErrors = new ParseTreeResult(expandedHtmlAst.nodes, errors);
        }
        return htmlAstWithErrors;
    };
    /**
     * @param {?} component
     * @return {?}
     */
    TemplateParser.prototype.getInterpolationConfig = function (component) {
        if (component.template) {
            return InterpolationConfig.fromArray(component.template.interpolation);
        }
        return undefined;
    };
    /**
     * \@internal
     * @param {?} result
     * @param {?} errors
     * @return {?}
     */
    TemplateParser.prototype._assertNoReferenceDuplicationOnTemplate = function (result, errors) {
        var /** @type {?} */ existingReferences = [];
        result.filter(function (element) { return !!((element)).references; })
            .forEach(function (element) { return ((element)).references.forEach(function (reference) {
            var /** @type {?} */ name = reference.name;
            if (existingReferences.indexOf(name) < 0) {
                existingReferences.push(name);
            }
            else {
                var /** @type {?} */ error = new TemplateParseError("Reference \"#" + name + "\" is defined several times", reference.sourceSpan, ParseErrorLevel.ERROR);
                errors.push(error);
            }
        }); });
    };
    return TemplateParser;
}());
TemplateParser.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
TemplateParser.ctorParameters = function () { return [
    { type: CompilerConfig, },
    { type: Parser, },
    { type: ElementSchemaRegistry, },
    { type: I18NHtmlParser, },
    { type: ɵConsole, },
    { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [TEMPLATE_TRANSFORMS,] },] },
]; };
var TemplateParseVisitor = (function () {
    /**
     * @param {?} config
     * @param {?} providerViewContext
     * @param {?} directives
     * @param {?} _bindingParser
     * @param {?} _schemaRegistry
     * @param {?} _schemas
     * @param {?} _targetErrors
     */
    function TemplateParseVisitor(config, providerViewContext, directives, _bindingParser, _schemaRegistry, _schemas, _targetErrors) {
        var _this = this;
        this.config = config;
        this.providerViewContext = providerViewContext;
        this._bindingParser = _bindingParser;
        this._schemaRegistry = _schemaRegistry;
        this._schemas = _schemas;
        this._targetErrors = _targetErrors;
        this.selectorMatcher = new SelectorMatcher();
        this.directivesIndex = new Map();
        this.ngContentCount = 0;
        // Note: queries start with id 1 so we can use the number in a Bloom filter!
        this.contentQueryStartId = providerViewContext.component.viewQueries.length + 1;
        directives.forEach(function (directive, index) {
            var selector = CssSelector.parse(directive.selector);
            _this.selectorMatcher.addSelectables(selector, directive);
            _this.directivesIndex.set(directive, index);
        });
    }
    /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    TemplateParseVisitor.prototype.visitExpansion = function (expansion, context) { return null; };
    /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    TemplateParseVisitor.prototype.visitExpansionCase = function (expansionCase, context) { return null; };
    /**
     * @param {?} text
     * @param {?} parent
     * @return {?}
     */
    TemplateParseVisitor.prototype.visitText = function (text, parent) {
        var /** @type {?} */ ngContentIndex = ((parent.findNgContentIndex(TEXT_CSS_SELECTOR)));
        var /** @type {?} */ expr = this._bindingParser.parseInterpolation(text.value, /** @type {?} */ ((text.sourceSpan)));
        return expr ? new BoundTextAst(expr, ngContentIndex, /** @type {?} */ ((text.sourceSpan))) :
            new TextAst(text.value, ngContentIndex, /** @type {?} */ ((text.sourceSpan)));
    };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    TemplateParseVisitor.prototype.visitAttribute = function (attribute, context) {
        return new AttrAst(attribute.name, attribute.value, attribute.sourceSpan);
    };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    TemplateParseVisitor.prototype.visitComment = function (comment, context) { return null; };
    /**
     * @param {?} element
     * @param {?} parent
     * @return {?}
     */
    TemplateParseVisitor.prototype.visitElement = function (element, parent) {
        var _this = this;
        var /** @type {?} */ queryStartIndex = this.contentQueryStartId;
        var /** @type {?} */ nodeName = element.name;
        var /** @type {?} */ preparsedElement = preparseElement(element);
        if (preparsedElement.type === PreparsedElementType.SCRIPT ||
            preparsedElement.type === PreparsedElementType.STYLE) {
            // Skipping <script> for security reasons
            // Skipping <style> as we already processed them
            // in the StyleCompiler
            return null;
        }
        if (preparsedElement.type === PreparsedElementType.STYLESHEET &&
            isStyleUrlResolvable(preparsedElement.hrefAttr)) {
            // Skipping stylesheets with either relative urls or package scheme as we already processed
            // them in the StyleCompiler
            return null;
        }
        var /** @type {?} */ matchableAttrs = [];
        var /** @type {?} */ elementOrDirectiveProps = [];
        var /** @type {?} */ elementOrDirectiveRefs = [];
        var /** @type {?} */ elementVars = [];
        var /** @type {?} */ events = [];
        var /** @type {?} */ templateElementOrDirectiveProps = [];
        var /** @type {?} */ templateMatchableAttrs = [];
        var /** @type {?} */ templateElementVars = [];
        var /** @type {?} */ hasInlineTemplates = false;
        var /** @type {?} */ attrs = [];
        var /** @type {?} */ isTemplateElement = isTemplate(element, this.config.enableLegacyTemplate, function (m, span) { return _this._reportError(m, span, ParseErrorLevel.WARNING); });
        element.attrs.forEach(function (attr) {
            var /** @type {?} */ hasBinding = _this._parseAttr(isTemplateElement, attr, matchableAttrs, elementOrDirectiveProps, events, elementOrDirectiveRefs, elementVars);
            var /** @type {?} */ templateBindingsSource;
            var /** @type {?} */ prefixToken;
            var /** @type {?} */ normalizedName = _this._normalizeAttributeName(attr.name);
            if (_this.config.enableLegacyTemplate && normalizedName == TEMPLATE_ATTR) {
                _this._reportError(TEMPLATE_ATTR_DEPRECATION_WARNING, attr.sourceSpan, ParseErrorLevel.WARNING);
                templateBindingsSource = attr.value;
            }
            else if (normalizedName.startsWith(TEMPLATE_ATTR_PREFIX)) {
                templateBindingsSource = attr.value;
                prefixToken = normalizedName.substring(TEMPLATE_ATTR_PREFIX.length) + ':';
            }
            var /** @type {?} */ hasTemplateBinding = templateBindingsSource != null;
            if (hasTemplateBinding) {
                if (hasInlineTemplates) {
                    _this._reportError("Can't have multiple template bindings on one element. Use only one attribute named 'template' or prefixed with *", attr.sourceSpan);
                }
                hasInlineTemplates = true;
                _this._bindingParser.parseInlineTemplateBinding(/** @type {?} */ ((prefixToken)), /** @type {?} */ ((templateBindingsSource)), attr.sourceSpan, templateMatchableAttrs, templateElementOrDirectiveProps, templateElementVars);
            }
            if (!hasBinding && !hasTemplateBinding) {
                // don't include the bindings as attributes as well in the AST
                attrs.push(_this.visitAttribute(attr, null));
                matchableAttrs.push([attr.name, attr.value]);
            }
        });
        var /** @type {?} */ elementCssSelector = createElementCssSelector(nodeName, matchableAttrs);
        var _a = this._parseDirectives(this.selectorMatcher, elementCssSelector), directiveMetas = _a.directives, matchElement = _a.matchElement;
        var /** @type {?} */ references = [];
        var /** @type {?} */ boundDirectivePropNames = new Set();
        var /** @type {?} */ directiveAsts = this._createDirectiveAsts(isTemplateElement, element.name, directiveMetas, elementOrDirectiveProps, elementOrDirectiveRefs, /** @type {?} */ ((element.sourceSpan)), references, boundDirectivePropNames);
        var /** @type {?} */ elementProps = this._createElementPropertyAsts(element.name, elementOrDirectiveProps, boundDirectivePropNames);
        var /** @type {?} */ isViewRoot = parent.isTemplateElement || hasInlineTemplates;
        var /** @type {?} */ providerContext = new ProviderElementContext(this.providerViewContext, /** @type {?} */ ((parent.providerContext)), isViewRoot, directiveAsts, attrs, references, isTemplateElement, queryStartIndex, /** @type {?} */ ((element.sourceSpan)));
        var /** @type {?} */ children = visitAll(preparsedElement.nonBindable ? NON_BINDABLE_VISITOR : this, element.children, ElementContext.create(isTemplateElement, directiveAsts, isTemplateElement ? ((parent.providerContext)) : providerContext));
        providerContext.afterElement();
        // Override the actual selector when the `ngProjectAs` attribute is provided
        var /** @type {?} */ projectionSelector = preparsedElement.projectAs != null ?
            CssSelector.parse(preparsedElement.projectAs)[0] :
            elementCssSelector;
        var /** @type {?} */ ngContentIndex = ((parent.findNgContentIndex(projectionSelector)));
        var /** @type {?} */ parsedElement;
        if (preparsedElement.type === PreparsedElementType.NG_CONTENT) {
            if (element.children && !element.children.every(_isEmptyTextNode)) {
                this._reportError("<ng-content> element cannot have content.", /** @type {?} */ ((element.sourceSpan)));
            }
            parsedElement = new NgContentAst(this.ngContentCount++, hasInlineTemplates ? ((null)) : ngContentIndex, /** @type {?} */ ((element.sourceSpan)));
        }
        else if (isTemplateElement) {
            this._assertAllEventsPublishedByDirectives(directiveAsts, events);
            this._assertNoComponentsNorElementBindingsOnTemplate(directiveAsts, elementProps, /** @type {?} */ ((element.sourceSpan)));
            parsedElement = new EmbeddedTemplateAst(attrs, events, references, elementVars, providerContext.transformedDirectiveAsts, providerContext.transformProviders, providerContext.transformedHasViewContainer, providerContext.queryMatches, children, hasInlineTemplates ? ((null)) : ngContentIndex, /** @type {?} */ ((element.sourceSpan)));
        }
        else {
            this._assertElementExists(matchElement, element);
            this._assertOnlyOneComponent(directiveAsts, /** @type {?} */ ((element.sourceSpan)));
            var /** @type {?} */ ngContentIndex_1 = hasInlineTemplates ? null : parent.findNgContentIndex(projectionSelector);
            parsedElement = new ElementAst(nodeName, attrs, elementProps, events, references, providerContext.transformedDirectiveAsts, providerContext.transformProviders, providerContext.transformedHasViewContainer, providerContext.queryMatches, children, hasInlineTemplates ? null : ngContentIndex_1, element.sourceSpan, element.endSourceSpan || null);
        }
        if (hasInlineTemplates) {
            var /** @type {?} */ templateQueryStartIndex = this.contentQueryStartId;
            var /** @type {?} */ templateSelector = createElementCssSelector(TEMPLATE_ELEMENT, templateMatchableAttrs);
            var templateDirectiveMetas = this._parseDirectives(this.selectorMatcher, templateSelector).directives;
            var /** @type {?} */ templateBoundDirectivePropNames = new Set();
            var /** @type {?} */ templateDirectiveAsts = this._createDirectiveAsts(true, element.name, templateDirectiveMetas, templateElementOrDirectiveProps, [], /** @type {?} */ ((element.sourceSpan)), [], templateBoundDirectivePropNames);
            var /** @type {?} */ templateElementProps = this._createElementPropertyAsts(element.name, templateElementOrDirectiveProps, templateBoundDirectivePropNames);
            this._assertNoComponentsNorElementBindingsOnTemplate(templateDirectiveAsts, templateElementProps, /** @type {?} */ ((element.sourceSpan)));
            var /** @type {?} */ templateProviderContext = new ProviderElementContext(this.providerViewContext, /** @type {?} */ ((parent.providerContext)), parent.isTemplateElement, templateDirectiveAsts, [], [], true, templateQueryStartIndex, /** @type {?} */ ((element.sourceSpan)));
            templateProviderContext.afterElement();
            parsedElement = new EmbeddedTemplateAst([], [], [], templateElementVars, templateProviderContext.transformedDirectiveAsts, templateProviderContext.transformProviders, templateProviderContext.transformedHasViewContainer, templateProviderContext.queryMatches, [parsedElement], ngContentIndex, /** @type {?} */ ((element.sourceSpan)));
        }
        return parsedElement;
    };
    /**
     * @param {?} isTemplateElement
     * @param {?} attr
     * @param {?} targetMatchableAttrs
     * @param {?} targetProps
     * @param {?} targetEvents
     * @param {?} targetRefs
     * @param {?} targetVars
     * @return {?}
     */
    TemplateParseVisitor.prototype._parseAttr = function (isTemplateElement, attr, targetMatchableAttrs, targetProps, targetEvents, targetRefs, targetVars) {
        var /** @type {?} */ name = this._normalizeAttributeName(attr.name);
        var /** @type {?} */ value = attr.value;
        var /** @type {?} */ srcSpan = attr.sourceSpan;
        var /** @type {?} */ bindParts = name.match(BIND_NAME_REGEXP);
        var /** @type {?} */ hasBinding = false;
        if (bindParts !== null) {
            hasBinding = true;
            if (bindParts[KW_BIND_IDX] != null) {
                this._bindingParser.parsePropertyBinding(bindParts[IDENT_KW_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
            }
            else if (bindParts[KW_LET_IDX]) {
                if (isTemplateElement) {
                    var /** @type {?} */ identifier = bindParts[IDENT_KW_IDX];
                    this._parseVariable(identifier, value, srcSpan, targetVars);
                }
                else {
                    this._reportError("\"let-\" is only supported on template elements.", srcSpan);
                }
            }
            else if (bindParts[KW_REF_IDX]) {
                var /** @type {?} */ identifier = bindParts[IDENT_KW_IDX];
                this._parseReference(identifier, value, srcSpan, targetRefs);
            }
            else if (bindParts[KW_ON_IDX]) {
                this._bindingParser.parseEvent(bindParts[IDENT_KW_IDX], value, srcSpan, targetMatchableAttrs, targetEvents);
            }
            else if (bindParts[KW_BINDON_IDX]) {
                this._bindingParser.parsePropertyBinding(bindParts[IDENT_KW_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
                this._parseAssignmentEvent(bindParts[IDENT_KW_IDX], value, srcSpan, targetMatchableAttrs, targetEvents);
            }
            else if (bindParts[KW_AT_IDX]) {
                this._bindingParser.parseLiteralAttr(name, value, srcSpan, targetMatchableAttrs, targetProps);
            }
            else if (bindParts[IDENT_BANANA_BOX_IDX]) {
                this._bindingParser.parsePropertyBinding(bindParts[IDENT_BANANA_BOX_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
                this._parseAssignmentEvent(bindParts[IDENT_BANANA_BOX_IDX], value, srcSpan, targetMatchableAttrs, targetEvents);
            }
            else if (bindParts[IDENT_PROPERTY_IDX]) {
                this._bindingParser.parsePropertyBinding(bindParts[IDENT_PROPERTY_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
            }
            else if (bindParts[IDENT_EVENT_IDX]) {
                this._bindingParser.parseEvent(bindParts[IDENT_EVENT_IDX], value, srcSpan, targetMatchableAttrs, targetEvents);
            }
        }
        else {
            hasBinding = this._bindingParser.parsePropertyInterpolation(name, value, srcSpan, targetMatchableAttrs, targetProps);
        }
        if (!hasBinding) {
            this._bindingParser.parseLiteralAttr(name, value, srcSpan, targetMatchableAttrs, targetProps);
        }
        return hasBinding;
    };
    /**
     * @param {?} attrName
     * @return {?}
     */
    TemplateParseVisitor.prototype._normalizeAttributeName = function (attrName) {
        return /^data-/i.test(attrName) ? attrName.substring(5) : attrName;
    };
    /**
     * @param {?} identifier
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} targetVars
     * @return {?}
     */
    TemplateParseVisitor.prototype._parseVariable = function (identifier, value, sourceSpan, targetVars) {
        if (identifier.indexOf('-') > -1) {
            this._reportError("\"-\" is not allowed in variable names", sourceSpan);
        }
        targetVars.push(new VariableAst(identifier, value, sourceSpan));
    };
    /**
     * @param {?} identifier
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} targetRefs
     * @return {?}
     */
    TemplateParseVisitor.prototype._parseReference = function (identifier, value, sourceSpan, targetRefs) {
        if (identifier.indexOf('-') > -1) {
            this._reportError("\"-\" is not allowed in reference names", sourceSpan);
        }
        targetRefs.push(new ElementOrDirectiveRef(identifier, value, sourceSpan));
    };
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetEvents
     * @return {?}
     */
    TemplateParseVisitor.prototype._parseAssignmentEvent = function (name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
        this._bindingParser.parseEvent(name + "Change", expression + "=$event", sourceSpan, targetMatchableAttrs, targetEvents);
    };
    /**
     * @param {?} selectorMatcher
     * @param {?} elementCssSelector
     * @return {?}
     */
    TemplateParseVisitor.prototype._parseDirectives = function (selectorMatcher, elementCssSelector) {
        var _this = this;
        // Need to sort the directives so that we get consistent results throughout,
        // as selectorMatcher uses Maps inside.
        // Also deduplicate directives as they might match more than one time!
        var /** @type {?} */ directives = new Array(this.directivesIndex.size);
        // Whether any directive selector matches on the element name
        var /** @type {?} */ matchElement = false;
        selectorMatcher.match(elementCssSelector, function (selector, directive) {
            directives[((_this.directivesIndex.get(directive)))] = directive;
            matchElement = matchElement || selector.hasElementSelector();
        });
        return {
            directives: directives.filter(function (dir) { return !!dir; }),
            matchElement: matchElement,
        };
    };
    /**
     * @param {?} isTemplateElement
     * @param {?} elementName
     * @param {?} directives
     * @param {?} props
     * @param {?} elementOrDirectiveRefs
     * @param {?} elementSourceSpan
     * @param {?} targetReferences
     * @param {?} targetBoundDirectivePropNames
     * @return {?}
     */
    TemplateParseVisitor.prototype._createDirectiveAsts = function (isTemplateElement, elementName, directives, props, elementOrDirectiveRefs, elementSourceSpan, targetReferences, targetBoundDirectivePropNames) {
        var _this = this;
        var /** @type {?} */ matchedReferences = new Set();
        var /** @type {?} */ component = ((null));
        var /** @type {?} */ directiveAsts = directives.map(function (directive) {
            var /** @type {?} */ sourceSpan = new ParseSourceSpan(elementSourceSpan.start, elementSourceSpan.end, "Directive " + identifierName(directive.type));
            if (directive.isComponent) {
                component = directive;
            }
            var /** @type {?} */ directiveProperties = [];
            var /** @type {?} */ hostProperties = ((_this._bindingParser.createDirectiveHostPropertyAsts(directive, elementName, sourceSpan)));
            // Note: We need to check the host properties here as well,
            // as we don't know the element name in the DirectiveWrapperCompiler yet.
            hostProperties = _this._checkPropertiesInSchema(elementName, hostProperties);
            var /** @type {?} */ hostEvents = ((_this._bindingParser.createDirectiveHostEventAsts(directive, sourceSpan)));
            _this._createDirectivePropertyAsts(directive.inputs, props, directiveProperties, targetBoundDirectivePropNames);
            elementOrDirectiveRefs.forEach(function (elOrDirRef) {
                if ((elOrDirRef.value.length === 0 && directive.isComponent) ||
                    (directive.exportAs == elOrDirRef.value)) {
                    targetReferences.push(new ReferenceAst(elOrDirRef.name, identifierToken(directive.type), elOrDirRef.sourceSpan));
                    matchedReferences.add(elOrDirRef.name);
                }
            });
            var /** @type {?} */ contentQueryStartId = _this.contentQueryStartId;
            _this.contentQueryStartId += directive.queries.length;
            return new DirectiveAst(directive, directiveProperties, hostProperties, hostEvents, contentQueryStartId, sourceSpan);
        });
        elementOrDirectiveRefs.forEach(function (elOrDirRef) {
            if (elOrDirRef.value.length > 0) {
                if (!matchedReferences.has(elOrDirRef.name)) {
                    _this._reportError("There is no directive with \"exportAs\" set to \"" + elOrDirRef.value + "\"", elOrDirRef.sourceSpan);
                }
            }
            else if (!component) {
                var /** @type {?} */ refToken = ((null));
                if (isTemplateElement) {
                    refToken = createIdentifierToken(Identifiers.TemplateRef);
                }
                targetReferences.push(new ReferenceAst(elOrDirRef.name, refToken, elOrDirRef.sourceSpan));
            }
        });
        return directiveAsts;
    };
    /**
     * @param {?} directiveProperties
     * @param {?} boundProps
     * @param {?} targetBoundDirectiveProps
     * @param {?} targetBoundDirectivePropNames
     * @return {?}
     */
    TemplateParseVisitor.prototype._createDirectivePropertyAsts = function (directiveProperties, boundProps, targetBoundDirectiveProps, targetBoundDirectivePropNames) {
        if (directiveProperties) {
            var /** @type {?} */ boundPropsByName_1 = new Map();
            boundProps.forEach(function (boundProp) {
                var /** @type {?} */ prevValue = boundPropsByName_1.get(boundProp.name);
                if (!prevValue || prevValue.isLiteral) {
                    // give [a]="b" a higher precedence than a="b" on the same element
                    boundPropsByName_1.set(boundProp.name, boundProp);
                }
            });
            Object.keys(directiveProperties).forEach(function (dirProp) {
                var /** @type {?} */ elProp = directiveProperties[dirProp];
                var /** @type {?} */ boundProp = boundPropsByName_1.get(elProp);
                // Bindings are optional, so this binding only needs to be set up if an expression is given.
                if (boundProp) {
                    targetBoundDirectivePropNames.add(boundProp.name);
                    if (!isEmptyExpression(boundProp.expression)) {
                        targetBoundDirectiveProps.push(new BoundDirectivePropertyAst(dirProp, boundProp.name, boundProp.expression, boundProp.sourceSpan));
                    }
                }
            });
        }
    };
    /**
     * @param {?} elementName
     * @param {?} props
     * @param {?} boundDirectivePropNames
     * @return {?}
     */
    TemplateParseVisitor.prototype._createElementPropertyAsts = function (elementName, props, boundDirectivePropNames) {
        var _this = this;
        var /** @type {?} */ boundElementProps = [];
        props.forEach(function (prop) {
            if (!prop.isLiteral && !boundDirectivePropNames.has(prop.name)) {
                boundElementProps.push(_this._bindingParser.createElementPropertyAst(elementName, prop));
            }
        });
        return this._checkPropertiesInSchema(elementName, boundElementProps);
    };
    /**
     * @param {?} directives
     * @return {?}
     */
    TemplateParseVisitor.prototype._findComponentDirectives = function (directives) {
        return directives.filter(function (directive) { return directive.directive.isComponent; });
    };
    /**
     * @param {?} directives
     * @return {?}
     */
    TemplateParseVisitor.prototype._findComponentDirectiveNames = function (directives) {
        return this._findComponentDirectives(directives)
            .map(function (directive) { return ((identifierName(directive.directive.type))); });
    };
    /**
     * @param {?} directives
     * @param {?} sourceSpan
     * @return {?}
     */
    TemplateParseVisitor.prototype._assertOnlyOneComponent = function (directives, sourceSpan) {
        var /** @type {?} */ componentTypeNames = this._findComponentDirectiveNames(directives);
        if (componentTypeNames.length > 1) {
            this._reportError("More than one component matched on this element.\n" +
                "Make sure that only one component's selector can match a given element.\n" +
                ("Conflicting components: " + componentTypeNames.join(',')), sourceSpan);
        }
    };
    /**
     * Make sure that non-angular tags conform to the schemas.
     *
     * Note: An element is considered an angular tag when at least one directive selector matches the
     * tag name.
     *
     * @param {?} matchElement Whether any directive has matched on the tag name
     * @param {?} element the html element
     * @return {?}
     */
    TemplateParseVisitor.prototype._assertElementExists = function (matchElement, element) {
        var /** @type {?} */ elName = element.name.replace(/^:xhtml:/, '');
        if (!matchElement && !this._schemaRegistry.hasElement(elName, this._schemas)) {
            var /** @type {?} */ errorMsg = "'" + elName + "' is not a known element:\n";
            errorMsg +=
                "1. If '" + elName + "' is an Angular component, then verify that it is part of this module.\n";
            if (elName.indexOf('-') > -1) {
                errorMsg +=
                    "2. If '" + elName + "' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.";
            }
            else {
                errorMsg +=
                    "2. To allow any element add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component.";
            }
            this._reportError(errorMsg, /** @type {?} */ ((element.sourceSpan)));
        }
    };
    /**
     * @param {?} directives
     * @param {?} elementProps
     * @param {?} sourceSpan
     * @return {?}
     */
    TemplateParseVisitor.prototype._assertNoComponentsNorElementBindingsOnTemplate = function (directives, elementProps, sourceSpan) {
        var _this = this;
        var /** @type {?} */ componentTypeNames = this._findComponentDirectiveNames(directives);
        if (componentTypeNames.length > 0) {
            this._reportError("Components on an embedded template: " + componentTypeNames.join(','), sourceSpan);
        }
        elementProps.forEach(function (prop) {
            _this._reportError("Property binding " + prop.name + " not used by any directive on an embedded template. Make sure that the property name is spelled correctly and all directives are listed in the \"@NgModule.declarations\".", sourceSpan);
        });
    };
    /**
     * @param {?} directives
     * @param {?} events
     * @return {?}
     */
    TemplateParseVisitor.prototype._assertAllEventsPublishedByDirectives = function (directives, events) {
        var _this = this;
        var /** @type {?} */ allDirectiveEvents = new Set();
        directives.forEach(function (directive) {
            Object.keys(directive.directive.outputs).forEach(function (k) {
                var /** @type {?} */ eventName = directive.directive.outputs[k];
                allDirectiveEvents.add(eventName);
            });
        });
        events.forEach(function (event) {
            if (event.target != null || !allDirectiveEvents.has(event.name)) {
                _this._reportError("Event binding " + event.fullName + " not emitted by any directive on an embedded template. Make sure that the event name is spelled correctly and all directives are listed in the \"@NgModule.declarations\".", event.sourceSpan);
            }
        });
    };
    /**
     * @param {?} elementName
     * @param {?} boundProps
     * @return {?}
     */
    TemplateParseVisitor.prototype._checkPropertiesInSchema = function (elementName, boundProps) {
        var _this = this;
        // Note: We can't filter out empty expressions before this method,
        // as we still want to validate them!
        return boundProps.filter(function (boundProp) {
            if (boundProp.type === PropertyBindingType.Property &&
                !_this._schemaRegistry.hasProperty(elementName, boundProp.name, _this._schemas)) {
                var /** @type {?} */ errorMsg = "Can't bind to '" + boundProp.name + "' since it isn't a known property of '" + elementName + "'.";
                if (elementName.startsWith('ng-')) {
                    errorMsg +=
                        "\n1. If '" + boundProp.name + "' is an Angular directive, then add 'CommonModule' to the '@NgModule.imports' of this component." +
                            "\n2. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component.";
                }
                else if (elementName.indexOf('-') > -1) {
                    errorMsg +=
                        "\n1. If '" + elementName + "' is an Angular component and it has '" + boundProp.name + "' input, then verify that it is part of this module." +
                            ("\n2. If '" + elementName + "' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.") +
                            "\n3. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component.";
                }
                _this._reportError(errorMsg, boundProp.sourceSpan);
            }
            return !isEmptyExpression(boundProp.value);
        });
    };
    /**
     * @param {?} message
     * @param {?} sourceSpan
     * @param {?=} level
     * @return {?}
     */
    TemplateParseVisitor.prototype._reportError = function (message, sourceSpan, level) {
        if (level === void 0) { level = ParseErrorLevel.ERROR; }
        this._targetErrors.push(new ParseError(sourceSpan, message, level));
    };
    return TemplateParseVisitor;
}());
var NonBindableVisitor = (function () {
    function NonBindableVisitor() {
    }
    /**
     * @param {?} ast
     * @param {?} parent
     * @return {?}
     */
    NonBindableVisitor.prototype.visitElement = function (ast, parent) {
        var /** @type {?} */ preparsedElement = preparseElement(ast);
        if (preparsedElement.type === PreparsedElementType.SCRIPT ||
            preparsedElement.type === PreparsedElementType.STYLE ||
            preparsedElement.type === PreparsedElementType.STYLESHEET) {
            // Skipping <script> for security reasons
            // Skipping <style> and stylesheets as we already processed them
            // in the StyleCompiler
            return null;
        }
        var /** @type {?} */ attrNameAndValues = ast.attrs.map(function (attr) { return [attr.name, attr.value]; });
        var /** @type {?} */ selector = createElementCssSelector(ast.name, attrNameAndValues);
        var /** @type {?} */ ngContentIndex = parent.findNgContentIndex(selector);
        var /** @type {?} */ children = visitAll(this, ast.children, EMPTY_ELEMENT_CONTEXT);
        return new ElementAst(ast.name, visitAll(this, ast.attrs), [], [], [], [], [], false, [], children, ngContentIndex, ast.sourceSpan, ast.endSourceSpan);
    };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    NonBindableVisitor.prototype.visitComment = function (comment, context) { return null; };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    NonBindableVisitor.prototype.visitAttribute = function (attribute, context) {
        return new AttrAst(attribute.name, attribute.value, attribute.sourceSpan);
    };
    /**
     * @param {?} text
     * @param {?} parent
     * @return {?}
     */
    NonBindableVisitor.prototype.visitText = function (text, parent) {
        var /** @type {?} */ ngContentIndex = ((parent.findNgContentIndex(TEXT_CSS_SELECTOR)));
        return new TextAst(text.value, ngContentIndex, /** @type {?} */ ((text.sourceSpan)));
    };
    /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    NonBindableVisitor.prototype.visitExpansion = function (expansion, context) { return expansion; };
    /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    NonBindableVisitor.prototype.visitExpansionCase = function (expansionCase, context) { return expansionCase; };
    return NonBindableVisitor;
}());
var ElementOrDirectiveRef = (function () {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     */
    function ElementOrDirectiveRef(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    return ElementOrDirectiveRef;
}());
/**
 * @param {?} classAttrValue
 * @return {?}
 */
function splitClasses(classAttrValue) {
    return classAttrValue.trim().split(/\s+/g);
}
var ElementContext = (function () {
    /**
     * @param {?} isTemplateElement
     * @param {?} _ngContentIndexMatcher
     * @param {?} _wildcardNgContentIndex
     * @param {?} providerContext
     */
    function ElementContext(isTemplateElement, _ngContentIndexMatcher, _wildcardNgContentIndex, providerContext) {
        this.isTemplateElement = isTemplateElement;
        this._ngContentIndexMatcher = _ngContentIndexMatcher;
        this._wildcardNgContentIndex = _wildcardNgContentIndex;
        this.providerContext = providerContext;
    }
    /**
     * @param {?} isTemplateElement
     * @param {?} directives
     * @param {?} providerContext
     * @return {?}
     */
    ElementContext.create = function (isTemplateElement, directives, providerContext) {
        var /** @type {?} */ matcher = new SelectorMatcher();
        var /** @type {?} */ wildcardNgContentIndex = ((null));
        var /** @type {?} */ component = directives.find(function (directive) { return directive.directive.isComponent; });
        if (component) {
            var /** @type {?} */ ngContentSelectors = ((component.directive.template)).ngContentSelectors;
            for (var /** @type {?} */ i = 0; i < ngContentSelectors.length; i++) {
                var /** @type {?} */ selector = ngContentSelectors[i];
                if (selector === '*') {
                    wildcardNgContentIndex = i;
                }
                else {
                    matcher.addSelectables(CssSelector.parse(ngContentSelectors[i]), i);
                }
            }
        }
        return new ElementContext(isTemplateElement, matcher, wildcardNgContentIndex, providerContext);
    };
    /**
     * @param {?} selector
     * @return {?}
     */
    ElementContext.prototype.findNgContentIndex = function (selector) {
        var /** @type {?} */ ngContentIndices = [];
        this._ngContentIndexMatcher.match(selector, function (selector, ngContentIndex) { ngContentIndices.push(ngContentIndex); });
        ngContentIndices.sort();
        if (this._wildcardNgContentIndex != null) {
            ngContentIndices.push(this._wildcardNgContentIndex);
        }
        return ngContentIndices.length > 0 ? ngContentIndices[0] : null;
    };
    return ElementContext;
}());
/**
 * @param {?} elementName
 * @param {?} attributes
 * @return {?}
 */
function createElementCssSelector(elementName, attributes) {
    var /** @type {?} */ cssSelector = new CssSelector();
    var /** @type {?} */ elNameNoNs = splitNsName(elementName)[1];
    cssSelector.setElement(elNameNoNs);
    for (var /** @type {?} */ i = 0; i < attributes.length; i++) {
        var /** @type {?} */ attrName = attributes[i][0];
        var /** @type {?} */ attrNameNoNs = splitNsName(attrName)[1];
        var /** @type {?} */ attrValue = attributes[i][1];
        cssSelector.addAttribute(attrNameNoNs, attrValue);
        if (attrName.toLowerCase() == CLASS_ATTR) {
            var /** @type {?} */ classes = splitClasses(attrValue);
            classes.forEach(function (className) { return cssSelector.addClassName(className); });
        }
    }
    return cssSelector;
}
var EMPTY_ELEMENT_CONTEXT = new ElementContext(true, new SelectorMatcher(), null, null);
var NON_BINDABLE_VISITOR = new NonBindableVisitor();
/**
 * @param {?} node
 * @return {?}
 */
function _isEmptyTextNode(node) {
    return node instanceof Text && node.value.trim().length == 0;
}
/**
 * @template T
 * @param {?} items
 * @return {?}
 */
function removeSummaryDuplicates(items) {
    var /** @type {?} */ map = new Map();
    items.forEach(function (item) {
        if (!map.get(item.type.reference)) {
            map.set(item.type.reference, item);
        }
    });
    return Array.from(map.values());
}
/**
 * @param {?} ast
 * @return {?}
 */
function isEmptyExpression(ast) {
    if (ast instanceof ASTWithSource) {
        ast = ast.ast;
    }
    return ast instanceof EmptyExpr;
}
/**
 * @param {?} el
 * @param {?} enableLegacyTemplate
 * @param {?} reportDeprecation
 * @return {?}
 */
function isTemplate(el, enableLegacyTemplate, reportDeprecation) {
    if (isNgTemplate(el.name))
        return true;
    var /** @type {?} */ tagNoNs = splitNsName(el.name)[1];
    // `<template>` is HTML and case insensitive
    if (tagNoNs.toLowerCase() === TEMPLATE_ELEMENT) {
        if (enableLegacyTemplate && tagNoNs.toLowerCase() === TEMPLATE_ELEMENT) {
            reportDeprecation(TEMPLATE_ELEMENT_DEPRECATION_WARNING, /** @type {?} */ ((el.sourceSpan)));
            return true;
        }
    }
    return false;
}
/**
 * An interface for retrieving documents by URL that the compiler uses
 * to load templates.
 */
var ResourceLoader = (function () {
    function ResourceLoader() {
    }
    /**
     * @param {?} url
     * @return {?}
     */
    ResourceLoader.prototype.get = function (url) { return null; };
    return ResourceLoader;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Create a {\@link UrlResolver} with no package prefix.
 * @return {?}
 */
function createUrlResolverWithoutPackagePrefix() {
    return new UrlResolver();
}
/**
 * @return {?}
 */
function createOfflineCompileUrlResolver() {
    return new UrlResolver('.');
}
/**
 * A default provider for {@link PACKAGE_ROOT_URL} that maps to '/'.
 */
var DEFAULT_PACKAGE_URL_PROVIDER = {
    provide: PACKAGE_ROOT_URL,
    useValue: '/'
};
/**
 * Used by the {\@link Compiler} when resolving HTML and CSS template URLs.
 *
 * This class can be overridden by the application developer to create custom behavior.
 *
 * See {\@link Compiler}
 *
 * ## Example
 *
 * {\@example compiler/ts/url_resolver/url_resolver.ts region='url_resolver'}
 *
 * \@security When compiling templates at runtime, you must
 * ensure that the entire template comes from a trusted source.
 * Attacker-controlled data introduced by a template could expose your
 * application to XSS risks. For more detail, see the [Security Guide](http://g.co/ng/security).
 */
var UrlResolver = (function () {
    /**
     * @param {?=} _packagePrefix
     */
    function UrlResolver(_packagePrefix) {
        if (_packagePrefix === void 0) { _packagePrefix = null; }
        this._packagePrefix = _packagePrefix;
    }
    /**
     * Resolves the `url` given the `baseUrl`:
     * - when the `url` is null, the `baseUrl` is returned,
     * - if `url` is relative ('path/to/here', './path/to/here'), the resolved url is a combination of
     * `baseUrl` and `url`,
     * - if `url` is absolute (it has a scheme: 'http://', 'https://' or start with '/'), the `url` is
     * returned as is (ignoring the `baseUrl`)
     * @param {?} baseUrl
     * @param {?} url
     * @return {?}
     */
    UrlResolver.prototype.resolve = function (baseUrl, url) {
        var /** @type {?} */ resolvedUrl = url;
        if (baseUrl != null && baseUrl.length > 0) {
            resolvedUrl = _resolveUrl(baseUrl, resolvedUrl);
        }
        var /** @type {?} */ resolvedParts = _split(resolvedUrl);
        var /** @type {?} */ prefix = this._packagePrefix;
        if (prefix != null && resolvedParts != null &&
            resolvedParts[_ComponentIndex.Scheme] == 'package') {
            var /** @type {?} */ path = resolvedParts[_ComponentIndex.Path];
            prefix = prefix.replace(/\/+$/, '');
            path = path.replace(/^\/+/, '');
            return prefix + "/" + path;
        }
        return resolvedUrl;
    };
    return UrlResolver;
}());
UrlResolver.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
UrlResolver.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [PACKAGE_ROOT_URL,] },] },
]; };
/**
 * Extract the scheme of a URL.
 * @param {?} url
 * @return {?}
 */
function getUrlScheme(url) {
    var /** @type {?} */ match = _split(url);
    return (match && match[_ComponentIndex.Scheme]) || '';
}
/**
 * Builds a URI string from already-encoded parts.
 *
 * No encoding is performed.  Any component may be omitted as either null or
 * undefined.
 *
 * @param {?=} opt_scheme The scheme such as 'http'.
 * @param {?=} opt_userInfo The user name before the '\@'.
 * @param {?=} opt_domain The domain such as 'www.google.com', already
 *     URI-encoded.
 * @param {?=} opt_port The port number.
 * @param {?=} opt_path The path, already URI-encoded.  If it is not
 *     empty, it must begin with a slash.
 * @param {?=} opt_queryData The URI-encoded query data.
 * @param {?=} opt_fragment The URI-encoded fragment identifier.
 * @return {?} The fully combined URI.
 */
function _buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
    var /** @type {?} */ out = [];
    if (opt_scheme != null) {
        out.push(opt_scheme + ':');
    }
    if (opt_domain != null) {
        out.push('//');
        if (opt_userInfo != null) {
            out.push(opt_userInfo + '@');
        }
        out.push(opt_domain);
        if (opt_port != null) {
            out.push(':' + opt_port);
        }
    }
    if (opt_path != null) {
        out.push(opt_path);
    }
    if (opt_queryData != null) {
        out.push('?' + opt_queryData);
    }
    if (opt_fragment != null) {
        out.push('#' + opt_fragment);
    }
    return out.join('');
}
/**
 * A regular expression for breaking a URI into its component parts.
 *
 * {\@link http://www.gbiv.com/protocols/uri/rfc/rfc3986.html#RFC2234} says
 * As the "first-match-wins" algorithm is identical to the "greedy"
 * disambiguation method used by POSIX regular expressions, it is natural and
 * commonplace to use a regular expression for parsing the potential five
 * components of a URI reference.
 *
 * The following line is the regular expression for breaking-down a
 * well-formed URI reference into its components.
 *
 * <pre>
 * ^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?
 *  12            3  4          5       6  7        8 9
 * </pre>
 *
 * The numbers in the second line above are only to assist readability; they
 * indicate the reference points for each subexpression (i.e., each paired
 * parenthesis). We refer to the value matched for subexpression <n> as $<n>.
 * For example, matching the above expression to
 * <pre>
 *     http://www.ics.uci.edu/pub/ietf/uri/#Related
 * </pre>
 * results in the following subexpression matches:
 * <pre>
 *    $1 = http:
 *    $2 = http
 *    $3 = //www.ics.uci.edu
 *    $4 = www.ics.uci.edu
 *    $5 = /pub/ietf/uri/
 *    $6 = <undefined>
 *    $7 = <undefined>
 *    $8 = #Related
 *    $9 = Related
 * </pre>
 * where <undefined> indicates that the component is not present, as is the
 * case for the query component in the above example. Therefore, we can
 * determine the value of the five components as
 * <pre>
 *    scheme    = $2
 *    authority = $4
 *    path      = $5
 *    query     = $7
 *    fragment  = $9
 * </pre>
 *
 * The regular expression has been modified slightly to expose the
 * userInfo, domain, and port separately from the authority.
 * The modified version yields
 * <pre>
 *    $1 = http              scheme
 *    $2 = <undefined>       userInfo -\
 *    $3 = www.ics.uci.edu   domain     | authority
 *    $4 = <undefined>       port     -/
 *    $5 = /pub/ietf/uri/    path
 *    $6 = <undefined>       query without ?
 *    $7 = Related           fragment without #
 * </pre>
 * \@internal
 */
var _splitRe = new RegExp('^' +
    '(?:' +
    '([^:/?#.]+)' +
    // used by other URL parts such as :,
    // ?, /, #, and .
    ':)?' +
    '(?://' +
    '(?:([^/?#]*)@)?' +
    '([\\w\\d\\-\\u0100-\\uffff.%]*)' +
    // digits, dashes, dots, percent
    // escapes, and unicode characters.
    '(?::([0-9]+))?' +
    ')?' +
    '([^?#]+)?' +
    '(?:\\?([^#]*))?' +
    '(?:#(.*))?' +
    '$');
var _ComponentIndex = {};
_ComponentIndex.Scheme = 1;
_ComponentIndex.UserInfo = 2;
_ComponentIndex.Domain = 3;
_ComponentIndex.Port = 4;
_ComponentIndex.Path = 5;
_ComponentIndex.QueryData = 6;
_ComponentIndex.Fragment = 7;
_ComponentIndex[_ComponentIndex.Scheme] = "Scheme";
_ComponentIndex[_ComponentIndex.UserInfo] = "UserInfo";
_ComponentIndex[_ComponentIndex.Domain] = "Domain";
_ComponentIndex[_ComponentIndex.Port] = "Port";
_ComponentIndex[_ComponentIndex.Path] = "Path";
_ComponentIndex[_ComponentIndex.QueryData] = "QueryData";
_ComponentIndex[_ComponentIndex.Fragment] = "Fragment";
/**
 * Splits a URI into its component parts.
 *
 * Each component can be accessed via the component indices; for example:
 * <pre>
 * goog.uri.utils.split(someStr)[goog.uri.utils.CompontentIndex.QUERY_DATA];
 * </pre>
 *
 * @param {?} uri The URI string to examine.
 * @return {?} Each component still URI-encoded.
 *     Each component that is present will contain the encoded value, whereas
 *     components that are not present will be undefined or empty, depending
 *     on the browser's regular expression implementation.  Never null, since
 *     arbitrary strings may still look like path names.
 */
function _split(uri) {
    return ((uri.match(_splitRe)));
}
/**
 * Removes dot segments in given path component, as described in
 * RFC 3986, section 5.2.4.
 *
 * @param {?} path A non-empty path component.
 * @return {?} Path component with removed dot segments.
 */
function _removeDotSegments(path) {
    if (path == '/')
        return '/';
    var /** @type {?} */ leadingSlash = path[0] == '/' ? '/' : '';
    var /** @type {?} */ trailingSlash = path[path.length - 1] === '/' ? '/' : '';
    var /** @type {?} */ segments = path.split('/');
    var /** @type {?} */ out = [];
    var /** @type {?} */ up = 0;
    for (var /** @type {?} */ pos = 0; pos < segments.length; pos++) {
        var /** @type {?} */ segment = segments[pos];
        switch (segment) {
            case '':
            case '.':
                break;
            case '..':
                if (out.length > 0) {
                    out.pop();
                }
                else {
                    up++;
                }
                break;
            default:
                out.push(segment);
        }
    }
    if (leadingSlash == '') {
        while (up-- > 0) {
            out.unshift('..');
        }
        if (out.length === 0)
            out.push('.');
    }
    return leadingSlash + out.join('/') + trailingSlash;
}
/**
 * Takes an array of the parts from split and canonicalizes the path part
 * and then joins all the parts.
 * @param {?} parts
 * @return {?}
 */
function _joinAndCanonicalizePath(parts) {
    var /** @type {?} */ path = parts[_ComponentIndex.Path];
    path = path == null ? '' : _removeDotSegments(path);
    parts[_ComponentIndex.Path] = path;
    return _buildFromEncodedParts(parts[_ComponentIndex.Scheme], parts[_ComponentIndex.UserInfo], parts[_ComponentIndex.Domain], parts[_ComponentIndex.Port], path, parts[_ComponentIndex.QueryData], parts[_ComponentIndex.Fragment]);
}
/**
 * Resolves a URL.
 * @param {?} base The URL acting as the base URL.
 * @param {?} url
 * @return {?}
 */
function _resolveUrl(base, url) {
    var /** @type {?} */ parts = _split(encodeURI(url));
    var /** @type {?} */ baseParts = _split(base);
    if (parts[_ComponentIndex.Scheme] != null) {
        return _joinAndCanonicalizePath(parts);
    }
    else {
        parts[_ComponentIndex.Scheme] = baseParts[_ComponentIndex.Scheme];
    }
    for (var /** @type {?} */ i = _ComponentIndex.Scheme; i <= _ComponentIndex.Port; i++) {
        if (parts[i] == null) {
            parts[i] = baseParts[i];
        }
    }
    if (parts[_ComponentIndex.Path][0] == '/') {
        return _joinAndCanonicalizePath(parts);
    }
    var /** @type {?} */ path = baseParts[_ComponentIndex.Path];
    if (path == null)
        path = '/';
    var /** @type {?} */ index = path.lastIndexOf('/');
    path = path.substring(0, index + 1) + parts[_ComponentIndex.Path];
    parts[_ComponentIndex.Path] = path;
    return _joinAndCanonicalizePath(parts);
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var DirectiveNormalizer = (function () {
    /**
     * @param {?} _resourceLoader
     * @param {?} _urlResolver
     * @param {?} _htmlParser
     * @param {?} _config
     */
    function DirectiveNormalizer(_resourceLoader, _urlResolver, _htmlParser, _config) {
        this._resourceLoader = _resourceLoader;
        this._urlResolver = _urlResolver;
        this._htmlParser = _htmlParser;
        this._config = _config;
        this._resourceLoaderCache = new Map();
    }
    /**
     * @return {?}
     */
    DirectiveNormalizer.prototype.clearCache = function () { this._resourceLoaderCache.clear(); };
    /**
     * @param {?} normalizedDirective
     * @return {?}
     */
    DirectiveNormalizer.prototype.clearCacheFor = function (normalizedDirective) {
        var _this = this;
        if (!normalizedDirective.isComponent) {
            return;
        }
        var /** @type {?} */ template = ((normalizedDirective.template));
        this._resourceLoaderCache.delete(/** @type {?} */ ((template.templateUrl)));
        template.externalStylesheets.forEach(function (stylesheet) { _this._resourceLoaderCache.delete(/** @type {?} */ ((stylesheet.moduleUrl))); });
    };
    /**
     * @param {?} url
     * @return {?}
     */
    DirectiveNormalizer.prototype._fetch = function (url) {
        var /** @type {?} */ result = this._resourceLoaderCache.get(url);
        if (!result) {
            result = ((this._resourceLoader.get(url)));
            this._resourceLoaderCache.set(url, result);
        }
        return result;
    };
    /**
     * @param {?} prenormData
     * @return {?}
     */
    DirectiveNormalizer.prototype.normalizeTemplate = function (prenormData) {
        var _this = this;
        var /** @type {?} */ normalizedTemplateSync = ((null));
        var /** @type {?} */ normalizedTemplateAsync = ((undefined));
        if (isDefined(prenormData.template)) {
            if (isDefined(prenormData.templateUrl)) {
                throw syntaxError("'" + ɵstringify(prenormData.componentType) + "' component cannot define both template and templateUrl");
            }
            if (typeof prenormData.template !== 'string') {
                throw syntaxError("The template specified for component " + ɵstringify(prenormData.componentType) + " is not a string");
            }
            normalizedTemplateSync = this.normalizeTemplateSync(prenormData);
            normalizedTemplateAsync = Promise.resolve(/** @type {?} */ ((normalizedTemplateSync)));
        }
        else if (isDefined(prenormData.templateUrl)) {
            if (typeof prenormData.templateUrl !== 'string') {
                throw syntaxError("The templateUrl specified for component " + ɵstringify(prenormData.componentType) + " is not a string");
            }
            normalizedTemplateAsync = this.normalizeTemplateAsync(prenormData);
        }
        else {
            throw syntaxError("No template specified for component " + ɵstringify(prenormData.componentType));
        }
        if (normalizedTemplateSync && normalizedTemplateSync.styleUrls.length === 0) {
            // sync case
            return new SyncAsyncResult(normalizedTemplateSync);
        }
        else {
            // async case
            return new SyncAsyncResult(null, normalizedTemplateAsync.then(function (normalizedTemplate) { return _this.normalizeExternalStylesheets(normalizedTemplate); }));
        }
    };
    /**
     * @param {?} prenomData
     * @return {?}
     */
    DirectiveNormalizer.prototype.normalizeTemplateSync = function (prenomData) {
        return this.normalizeLoadedTemplate(prenomData, /** @type {?} */ ((prenomData.template)), prenomData.moduleUrl);
    };
    /**
     * @param {?} prenomData
     * @return {?}
     */
    DirectiveNormalizer.prototype.normalizeTemplateAsync = function (prenomData) {
        var _this = this;
        var /** @type {?} */ templateUrl = this._urlResolver.resolve(prenomData.moduleUrl, /** @type {?} */ ((prenomData.templateUrl)));
        return this._fetch(templateUrl)
            .then(function (value) { return _this.normalizeLoadedTemplate(prenomData, value, templateUrl); });
    };
    /**
     * @param {?} prenormData
     * @param {?} template
     * @param {?} templateAbsUrl
     * @return {?}
     */
    DirectiveNormalizer.prototype.normalizeLoadedTemplate = function (prenormData, template, templateAbsUrl) {
        var /** @type {?} */ isInline = !!prenormData.template;
        var /** @type {?} */ interpolationConfig = InterpolationConfig.fromArray(/** @type {?} */ ((prenormData.interpolation)));
        var /** @type {?} */ rootNodesAndErrors = this._htmlParser.parse(template, templateSourceUrl({ reference: prenormData.ngModuleType }, { type: { reference: prenormData.componentType } }, { isInline: isInline, templateUrl: templateAbsUrl }), true, interpolationConfig);
        if (rootNodesAndErrors.errors.length > 0) {
            var /** @type {?} */ errorString = rootNodesAndErrors.errors.join('\n');
            throw syntaxError("Template parse errors:\n" + errorString);
        }
        var /** @type {?} */ templateMetadataStyles = this.normalizeStylesheet(new CompileStylesheetMetadata({
            styles: prenormData.styles,
            styleUrls: prenormData.styleUrls,
            moduleUrl: prenormData.moduleUrl
        }));
        var /** @type {?} */ visitor = new TemplatePreparseVisitor();
        visitAll(visitor, rootNodesAndErrors.rootNodes);
        var /** @type {?} */ templateStyles = this.normalizeStylesheet(new CompileStylesheetMetadata({ styles: visitor.styles, styleUrls: visitor.styleUrls, moduleUrl: templateAbsUrl }));
        var /** @type {?} */ encapsulation = prenormData.encapsulation;
        if (encapsulation == null) {
            encapsulation = this._config.defaultEncapsulation;
        }
        var /** @type {?} */ styles = templateMetadataStyles.styles.concat(templateStyles.styles);
        var /** @type {?} */ styleUrls = templateMetadataStyles.styleUrls.concat(templateStyles.styleUrls);
        if (encapsulation === ViewEncapsulation.Emulated && styles.length === 0 &&
            styleUrls.length === 0) {
            encapsulation = ViewEncapsulation.None;
        }
        return new CompileTemplateMetadata({
            encapsulation: encapsulation,
            template: template,
            templateUrl: templateAbsUrl, styles: styles, styleUrls: styleUrls,
            ngContentSelectors: visitor.ngContentSelectors,
            animations: prenormData.animations,
            interpolation: prenormData.interpolation, isInline: isInline,
            externalStylesheets: []
        });
    };
    /**
     * @param {?} templateMeta
     * @return {?}
     */
    DirectiveNormalizer.prototype.normalizeExternalStylesheets = function (templateMeta) {
        return this._loadMissingExternalStylesheets(templateMeta.styleUrls)
            .then(function (externalStylesheets) { return new CompileTemplateMetadata({
            encapsulation: templateMeta.encapsulation,
            template: templateMeta.template,
            templateUrl: templateMeta.templateUrl,
            styles: templateMeta.styles,
            styleUrls: templateMeta.styleUrls,
            externalStylesheets: externalStylesheets,
            ngContentSelectors: templateMeta.ngContentSelectors,
            animations: templateMeta.animations,
            interpolation: templateMeta.interpolation,
            isInline: templateMeta.isInline,
        }); });
    };
    /**
     * @param {?} styleUrls
     * @param {?=} loadedStylesheets
     * @return {?}
     */
    DirectiveNormalizer.prototype._loadMissingExternalStylesheets = function (styleUrls, loadedStylesheets) {
        var _this = this;
        if (loadedStylesheets === void 0) { loadedStylesheets = new Map(); }
        return Promise
            .all(styleUrls.filter(function (styleUrl) { return !loadedStylesheets.has(styleUrl); })
            .map(function (styleUrl) { return _this._fetch(styleUrl).then(function (loadedStyle) {
            var /** @type {?} */ stylesheet = _this.normalizeStylesheet(new CompileStylesheetMetadata({ styles: [loadedStyle], moduleUrl: styleUrl }));
            loadedStylesheets.set(styleUrl, stylesheet);
            return _this._loadMissingExternalStylesheets(stylesheet.styleUrls, loadedStylesheets);
        }); }))
            .then(function (_) { return Array.from(loadedStylesheets.values()); });
    };
    /**
     * @param {?} stylesheet
     * @return {?}
     */
    DirectiveNormalizer.prototype.normalizeStylesheet = function (stylesheet) {
        var _this = this;
        var /** @type {?} */ moduleUrl = ((stylesheet.moduleUrl));
        var /** @type {?} */ allStyleUrls = stylesheet.styleUrls.filter(isStyleUrlResolvable)
            .map(function (url) { return _this._urlResolver.resolve(moduleUrl, url); });
        var /** @type {?} */ allStyles = stylesheet.styles.map(function (style$$1) {
            var /** @type {?} */ styleWithImports = extractStyleUrls(_this._urlResolver, moduleUrl, style$$1);
            allStyleUrls.push.apply(allStyleUrls, styleWithImports.styleUrls);
            return styleWithImports.style;
        });
        return new CompileStylesheetMetadata({ styles: allStyles, styleUrls: allStyleUrls, moduleUrl: moduleUrl });
    };
    return DirectiveNormalizer;
}());
DirectiveNormalizer.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
DirectiveNormalizer.ctorParameters = function () { return [
    { type: ResourceLoader, },
    { type: UrlResolver, },
    { type: HtmlParser, },
    { type: CompilerConfig, },
]; };
var TemplatePreparseVisitor = (function () {
    function TemplatePreparseVisitor() {
        this.ngContentSelectors = [];
        this.styles = [];
        this.styleUrls = [];
        this.ngNonBindableStackCount = 0;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitElement = function (ast, context) {
        var /** @type {?} */ preparsedElement = preparseElement(ast);
        switch (preparsedElement.type) {
            case PreparsedElementType.NG_CONTENT:
                if (this.ngNonBindableStackCount === 0) {
                    this.ngContentSelectors.push(preparsedElement.selectAttr);
                }
                break;
            case PreparsedElementType.STYLE:
                var /** @type {?} */ textContent_1 = '';
                ast.children.forEach(function (child) {
                    if (child instanceof Text) {
                        textContent_1 += child.value;
                    }
                });
                this.styles.push(textContent_1);
                break;
            case PreparsedElementType.STYLESHEET:
                this.styleUrls.push(preparsedElement.hrefAttr);
                break;
            default:
                break;
        }
        if (preparsedElement.nonBindable) {
            this.ngNonBindableStackCount++;
        }
        visitAll(this, ast.children);
        if (preparsedElement.nonBindable) {
            this.ngNonBindableStackCount--;
        }
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitExpansion = function (ast, context) { visitAll(this, ast.cases); };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitExpansionCase = function (ast, context) {
        visitAll(this, ast.expression);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitComment = function (ast, context) { return null; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitAttribute = function (ast, context) { return null; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    TemplatePreparseVisitor.prototype.visitText = function (ast, context) { return null; };
    return TemplatePreparseVisitor;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (undefined && undefined.__assign) || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
    }
    return t;
};
var DirectiveResolver = (function () {
    /**
     * @param {?=} _reflector
     */
    function DirectiveResolver(_reflector) {
        if (_reflector === void 0) { _reflector = ɵreflector; }
        this._reflector = _reflector;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    DirectiveResolver.prototype.isDirective = function (type) {
        var /** @type {?} */ typeMetadata = this._reflector.annotations(resolveForwardRef(type));
        return typeMetadata && typeMetadata.some(isDirectiveMetadata);
    };
    /**
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    DirectiveResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var /** @type {?} */ typeMetadata = this._reflector.annotations(resolveForwardRef(type));
        if (typeMetadata) {
            var /** @type {?} */ metadata = findLast(typeMetadata, isDirectiveMetadata);
            if (metadata) {
                var /** @type {?} */ propertyMetadata = this._reflector.propMetadata(type);
                return this._mergeWithPropertyMetadata(metadata, propertyMetadata, type);
            }
        }
        if (throwIfNotFound) {
            throw new Error("No Directive annotation found on " + ɵstringify(type));
        }
        return null;
    };
    /**
     * @param {?} dm
     * @param {?} propertyMetadata
     * @param {?} directiveType
     * @return {?}
     */
    DirectiveResolver.prototype._mergeWithPropertyMetadata = function (dm, propertyMetadata, directiveType) {
        var /** @type {?} */ inputs = [];
        var /** @type {?} */ outputs = [];
        var /** @type {?} */ host = {};
        var /** @type {?} */ queries = {};
        Object.keys(propertyMetadata).forEach(function (propName) {
            var /** @type {?} */ input = findLast(propertyMetadata[propName], function (a) { return a instanceof Input; });
            if (input) {
                if (input.bindingPropertyName) {
                    inputs.push(propName + ": " + input.bindingPropertyName);
                }
                else {
                    inputs.push(propName);
                }
            }
            var /** @type {?} */ output = findLast(propertyMetadata[propName], function (a) { return a instanceof Output; });
            if (output) {
                if (output.bindingPropertyName) {
                    outputs.push(propName + ": " + output.bindingPropertyName);
                }
                else {
                    outputs.push(propName);
                }
            }
            var /** @type {?} */ hostBindings = propertyMetadata[propName].filter(function (a) { return a && a instanceof HostBinding; });
            hostBindings.forEach(function (hostBinding) {
                if (hostBinding.hostPropertyName) {
                    var /** @type {?} */ startWith = hostBinding.hostPropertyName[0];
                    if (startWith === '(') {
                        throw new Error("@HostBinding can not bind to events. Use @HostListener instead.");
                    }
                    else if (startWith === '[') {
                        throw new Error("@HostBinding parameter should be a property name, 'class.<name>', or 'attr.<name>'.");
                    }
                    host["[" + hostBinding.hostPropertyName + "]"] = propName;
                }
                else {
                    host["[" + propName + "]"] = propName;
                }
            });
            var /** @type {?} */ hostListeners = propertyMetadata[propName].filter(function (a) { return a && a instanceof HostListener; });
            hostListeners.forEach(function (hostListener) {
                var /** @type {?} */ args = hostListener.args || [];
                host["(" + hostListener.eventName + ")"] = propName + "(" + args.join(',') + ")";
            });
            var /** @type {?} */ query = findLast(propertyMetadata[propName], function (a) { return a instanceof Query; });
            if (query) {
                queries[propName] = query;
            }
        });
        return this._merge(dm, inputs, outputs, host, queries, directiveType);
    };
    /**
     * @param {?} def
     * @return {?}
     */
    DirectiveResolver.prototype._extractPublicName = function (def) { return splitAtColon(def, [/** @type {?} */ ((null)), def])[1].trim(); };
    /**
     * @param {?} bindings
     * @return {?}
     */
    DirectiveResolver.prototype._dedupeBindings = function (bindings) {
        var /** @type {?} */ names = new Set();
        var /** @type {?} */ reversedResult = [];
        // go last to first to allow later entries to overwrite previous entries
        for (var /** @type {?} */ i = bindings.length - 1; i >= 0; i--) {
            var /** @type {?} */ binding = bindings[i];
            var /** @type {?} */ name = this._extractPublicName(binding);
            if (!names.has(name)) {
                names.add(name);
                reversedResult.push(binding);
            }
        }
        return reversedResult.reverse();
    };
    /**
     * @param {?} directive
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} host
     * @param {?} queries
     * @param {?} directiveType
     * @return {?}
     */
    DirectiveResolver.prototype._merge = function (directive, inputs, outputs, host, queries, directiveType) {
        var /** @type {?} */ mergedInputs = this._dedupeBindings(directive.inputs ? directive.inputs.concat(inputs) : inputs);
        var /** @type {?} */ mergedOutputs = this._dedupeBindings(directive.outputs ? directive.outputs.concat(outputs) : outputs);
        var /** @type {?} */ mergedHost = directive.host ? __assign({}, directive.host, host) : host;
        var /** @type {?} */ mergedQueries = directive.queries ? __assign({}, directive.queries, queries) : queries;
        if (directive instanceof Component) {
            return new Component({
                selector: directive.selector,
                inputs: mergedInputs,
                outputs: mergedOutputs,
                host: mergedHost,
                exportAs: directive.exportAs,
                moduleId: directive.moduleId,
                queries: mergedQueries,
                changeDetection: directive.changeDetection,
                providers: directive.providers,
                viewProviders: directive.viewProviders,
                entryComponents: directive.entryComponents,
                template: directive.template,
                templateUrl: directive.templateUrl,
                styles: directive.styles,
                styleUrls: directive.styleUrls,
                encapsulation: directive.encapsulation,
                animations: directive.animations,
                interpolation: directive.interpolation
            });
        }
        else {
            return new Directive({
                selector: directive.selector,
                inputs: mergedInputs,
                outputs: mergedOutputs,
                host: mergedHost,
                exportAs: directive.exportAs,
                queries: mergedQueries,
                providers: directive.providers
            });
        }
    };
    return DirectiveResolver;
}());
DirectiveResolver.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
DirectiveResolver.ctorParameters = function () { return [
    { type: ɵReflectorReader, },
]; };
/**
 * @param {?} type
 * @return {?}
 */
function isDirectiveMetadata(type) {
    return type instanceof Directive;
}
/**
 * @template T
 * @param {?} arr
 * @param {?} condition
 * @return {?}
 */
function findLast(arr, condition) {
    for (var /** @type {?} */ i = arr.length - 1; i >= 0; i--) {
        if (condition(arr[i])) {
            return arr[i];
        }
    }
    return null;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var STRIP_SRC_FILE_SUFFIXES = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
var NG_FACTORY = /\.ngfactory\./;
/**
 * @param {?} filePath
 * @return {?}
 */
function ngfactoryFilePath(filePath) {
    var /** @type {?} */ urlWithSuffix = splitTypescriptSuffix(filePath);
    return urlWithSuffix[0] + ".ngfactory" + urlWithSuffix[1];
}
/**
 * @param {?} filePath
 * @return {?}
 */
function stripNgFactory(filePath) {
    return filePath.replace(NG_FACTORY, '.');
}
/**
 * @param {?} filePath
 * @return {?}
 */
function isNgFactoryFile(filePath) {
    return NG_FACTORY.test(filePath);
}
/**
 * @param {?} path
 * @return {?}
 */
function splitTypescriptSuffix(path) {
    if (path.endsWith('.d.ts')) {
        return [path.slice(0, -5), '.ts'];
    }
    var /** @type {?} */ lastDot = path.lastIndexOf('.');
    if (lastDot !== -1) {
        return [path.substring(0, lastDot), path.substring(lastDot)];
    }
    return [path, ''];
}
/**
 * @param {?} fileName
 * @return {?}
 */
function summaryFileName(fileName) {
    var /** @type {?} */ fileNameWithoutSuffix = fileName.replace(STRIP_SRC_FILE_SUFFIXES, '');
    return fileNameWithoutSuffix + ".ngsummary.json";
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @param {?} hook
 * @param {?} token
 * @return {?}
 */
function hasLifecycleHook(hook, token) {
    return ɵreflector.hasLifecycleHook(token, getHookName(hook));
}
/**
 * @param {?} hook
 * @return {?}
 */
function getHookName(hook) {
    switch (hook) {
        case ɵLifecycleHooks.OnInit:
            return 'ngOnInit';
        case ɵLifecycleHooks.OnDestroy:
            return 'ngOnDestroy';
        case ɵLifecycleHooks.DoCheck:
            return 'ngDoCheck';
        case ɵLifecycleHooks.OnChanges:
            return 'ngOnChanges';
        case ɵLifecycleHooks.AfterContentInit:
            return 'ngAfterContentInit';
        case ɵLifecycleHooks.AfterContentChecked:
            return 'ngAfterContentChecked';
        case ɵLifecycleHooks.AfterViewInit:
            return 'ngAfterViewInit';
        case ɵLifecycleHooks.AfterViewChecked:
            return 'ngAfterViewChecked';
    }
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @param {?} obj
 * @return {?}
 */
function _isNgModuleMetadata(obj) {
    return obj instanceof NgModule;
}
/**
 * Resolves types to {\@link NgModule}.
 */
var NgModuleResolver = (function () {
    /**
     * @param {?=} _reflector
     */
    function NgModuleResolver(_reflector) {
        if (_reflector === void 0) { _reflector = ɵreflector; }
        this._reflector = _reflector;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    NgModuleResolver.prototype.isNgModule = function (type) { return this._reflector.annotations(type).some(_isNgModuleMetadata); };
    /**
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    NgModuleResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var /** @type {?} */ ngModuleMeta = findLast(this._reflector.annotations(type), _isNgModuleMetadata);
        if (ngModuleMeta) {
            return ngModuleMeta;
        }
        else {
            if (throwIfNotFound) {
                throw new Error("No NgModule metadata found for '" + ɵstringify(type) + "'.");
            }
            return null;
        }
    };
    return NgModuleResolver;
}());
NgModuleResolver.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
NgModuleResolver.ctorParameters = function () { return [
    { type: ɵReflectorReader, },
]; };
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @param {?} type
 * @return {?}
 */
function _isPipeMetadata(type) {
    return type instanceof Pipe;
}
/**
 * Resolve a `Type` for {\@link Pipe}.
 *
 * This interface can be overridden by the application developer to create custom behavior.
 *
 * See {\@link Compiler}
 */
var PipeResolver = (function () {
    /**
     * @param {?=} _reflector
     */
    function PipeResolver(_reflector) {
        if (_reflector === void 0) { _reflector = ɵreflector; }
        this._reflector = _reflector;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    PipeResolver.prototype.isPipe = function (type) {
        var /** @type {?} */ typeMetadata = this._reflector.annotations(resolveForwardRef(type));
        return typeMetadata && typeMetadata.some(_isPipeMetadata);
    };
    /**
     * Return {\@link Pipe} for a given `Type`.
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    PipeResolver.prototype.resolve = function (type, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var /** @type {?} */ metas = this._reflector.annotations(resolveForwardRef(type));
        if (metas) {
            var /** @type {?} */ annotation = findLast(metas, _isPipeMetadata);
            if (annotation) {
                return annotation;
            }
        }
        if (throwIfNotFound) {
            throw new Error("No Pipe decorator found on " + ɵstringify(type));
        }
        return null;
    };
    return PipeResolver;
}());
PipeResolver.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
PipeResolver.ctorParameters = function () { return [
    { type: ɵReflectorReader, },
]; };
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var SummaryResolver = (function () {
    function SummaryResolver() {
    }
    /**
     * @param {?} fileName
     * @return {?}
     */
    SummaryResolver.prototype.isLibraryFile = function (fileName) { return false; };
    ;
    /**
     * @param {?} fileName
     * @return {?}
     */
    SummaryResolver.prototype.getLibraryFileName = function (fileName) { return null; };
    /**
     * @param {?} reference
     * @return {?}
     */
    SummaryResolver.prototype.resolveSummary = function (reference) { return null; };
    ;
    /**
     * @param {?} filePath
     * @return {?}
     */
    SummaryResolver.prototype.getSymbolsOf = function (filePath) { return []; };
    /**
     * @param {?} reference
     * @return {?}
     */
    SummaryResolver.prototype.getImportAs = function (reference) { return reference; };
    return SummaryResolver;
}());
SummaryResolver.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
SummaryResolver.ctorParameters = function () { return []; };
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var ERROR_COLLECTOR_TOKEN = new InjectionToken('ErrorCollector');
var CompileMetadataResolver = (function () {
    /**
     * @param {?} _config
     * @param {?} _ngModuleResolver
     * @param {?} _directiveResolver
     * @param {?} _pipeResolver
     * @param {?} _summaryResolver
     * @param {?} _schemaRegistry
     * @param {?} _directiveNormalizer
     * @param {?} _console
     * @param {?} _staticSymbolCache
     * @param {?=} _reflector
     * @param {?=} _errorCollector
     */
    function CompileMetadataResolver(_config, _ngModuleResolver, _directiveResolver, _pipeResolver, _summaryResolver, _schemaRegistry, _directiveNormalizer, _console, _staticSymbolCache, _reflector, _errorCollector) {
        if (_reflector === void 0) { _reflector = ɵreflector; }
        this._config = _config;
        this._ngModuleResolver = _ngModuleResolver;
        this._directiveResolver = _directiveResolver;
        this._pipeResolver = _pipeResolver;
        this._summaryResolver = _summaryResolver;
        this._schemaRegistry = _schemaRegistry;
        this._directiveNormalizer = _directiveNormalizer;
        this._console = _console;
        this._staticSymbolCache = _staticSymbolCache;
        this._reflector = _reflector;
        this._errorCollector = _errorCollector;
        this._nonNormalizedDirectiveCache = new Map();
        this._directiveCache = new Map();
        this._summaryCache = new Map();
        this._pipeCache = new Map();
        this._ngModuleCache = new Map();
        this._ngModuleOfTypes = new Map();
    }
    /**
     * @param {?} type
     * @return {?}
     */
    CompileMetadataResolver.prototype.clearCacheFor = function (type) {
        var /** @type {?} */ dirMeta = this._directiveCache.get(type);
        this._directiveCache.delete(type);
        this._nonNormalizedDirectiveCache.delete(type);
        this._summaryCache.delete(type);
        this._pipeCache.delete(type);
        this._ngModuleOfTypes.delete(type);
        // Clear all of the NgModule as they contain transitive information!
        this._ngModuleCache.clear();
        if (dirMeta) {
            this._directiveNormalizer.clearCacheFor(dirMeta);
        }
    };
    /**
     * @return {?}
     */
    CompileMetadataResolver.prototype.clearCache = function () {
        this._directiveCache.clear();
        this._nonNormalizedDirectiveCache.clear();
        this._summaryCache.clear();
        this._pipeCache.clear();
        this._ngModuleCache.clear();
        this._ngModuleOfTypes.clear();
        this._directiveNormalizer.clearCache();
    };
    /**
     * @param {?} baseType
     * @param {?} name
     * @return {?}
     */
    CompileMetadataResolver.prototype._createProxyClass = function (baseType, name) {
        var /** @type {?} */ delegate = null;
        var /** @type {?} */ proxyClass = (function () {
            if (!delegate) {
                throw new Error("Illegal state: Class " + name + " for type " + ɵstringify(baseType) + " is not compiled yet!");
            }
            return delegate.apply(this, arguments);
        });
        proxyClass.setDelegate = function (d) {
            delegate = d;
            ((proxyClass)).prototype = d.prototype;
        };
        // Make stringify work correctly
        ((proxyClass)).overriddenName = name;
        return proxyClass;
    };
    /**
     * @param {?} dirType
     * @param {?} name
     * @return {?}
     */
    CompileMetadataResolver.prototype.getGeneratedClass = function (dirType, name) {
        if (dirType instanceof StaticSymbol) {
            return this._staticSymbolCache.get(ngfactoryFilePath(dirType.filePath), name);
        }
        else {
            return this._createProxyClass(dirType, name);
        }
    };
    /**
     * @param {?} dirType
     * @return {?}
     */
    CompileMetadataResolver.prototype.getComponentViewClass = function (dirType) {
        return this.getGeneratedClass(dirType, viewClassName(dirType, 0));
    };
    /**
     * @param {?} dirType
     * @return {?}
     */
    CompileMetadataResolver.prototype.getHostComponentViewClass = function (dirType) {
        return this.getGeneratedClass(dirType, hostViewClassName(dirType));
    };
    /**
     * @param {?} dirType
     * @return {?}
     */
    CompileMetadataResolver.prototype.getHostComponentType = function (dirType) {
        var /** @type {?} */ name = identifierName({ reference: dirType }) + "_Host";
        if (dirType instanceof StaticSymbol) {
            return this._staticSymbolCache.get(dirType.filePath, name);
        }
        else {
            var /** @type {?} */ HostClass = (function HostClass() { });
            HostClass.overriddenName = name;
            return HostClass;
        }
    };
    /**
     * @param {?} dirType
     * @return {?}
     */
    CompileMetadataResolver.prototype.getRendererType = function (dirType) {
        if (dirType instanceof StaticSymbol) {
            return this._staticSymbolCache.get(ngfactoryFilePath(dirType.filePath), rendererTypeName(dirType));
        }
        else {
            // returning an object as proxy,
            // that we fill later during runtime compilation.
            return ({});
        }
    };
    /**
     * @param {?} selector
     * @param {?} dirType
     * @param {?} inputs
     * @param {?} outputs
     * @return {?}
     */
    CompileMetadataResolver.prototype.getComponentFactory = function (selector, dirType, inputs, outputs) {
        if (dirType instanceof StaticSymbol) {
            return this._staticSymbolCache.get(ngfactoryFilePath(dirType.filePath), componentFactoryName(dirType));
        }
        else {
            var /** @type {?} */ hostView = this.getHostComponentViewClass(dirType);
            // Note: ngContentSelectors will be filled later once the template is
            // loaded.
            return ɵccf(selector, dirType, /** @type {?} */ (hostView), inputs, outputs, []);
        }
    };
    /**
     * @param {?} factory
     * @param {?} ngContentSelectors
     * @return {?}
     */
    CompileMetadataResolver.prototype.initComponentFactory = function (factory, ngContentSelectors) {
        if (!(factory instanceof StaticSymbol)) {
            (_a = factory.ngContentSelectors).push.apply(_a, ngContentSelectors);
        }
        var _a;
    };
    /**
     * @param {?} type
     * @param {?} kind
     * @return {?}
     */
    CompileMetadataResolver.prototype._loadSummary = function (type, kind) {
        var /** @type {?} */ typeSummary = this._summaryCache.get(type);
        if (!typeSummary) {
            var /** @type {?} */ summary = this._summaryResolver.resolveSummary(type);
            typeSummary = summary ? summary.type : null;
            this._summaryCache.set(type, typeSummary || null);
        }
        return typeSummary && typeSummary.summaryKind === kind ? typeSummary : null;
    };
    /**
     * @param {?} ngModuleType
     * @param {?} directiveType
     * @param {?} isSync
     * @return {?}
     */
    CompileMetadataResolver.prototype._loadDirectiveMetadata = function (ngModuleType, directiveType, isSync) {
        var _this = this;
        if (this._directiveCache.has(directiveType)) {
            return null;
        }
        directiveType = resolveForwardRef(directiveType);
        var _a = ((this.getNonNormalizedDirectiveMetadata(directiveType))), annotation = _a.annotation, metadata = _a.metadata;
        var /** @type {?} */ createDirectiveMetadata = function (templateMetadata) {
            var /** @type {?} */ normalizedDirMeta = new CompileDirectiveMetadata({
                isHost: false,
                type: metadata.type,
                isComponent: metadata.isComponent,
                selector: metadata.selector,
                exportAs: metadata.exportAs,
                changeDetection: metadata.changeDetection,
                inputs: metadata.inputs,
                outputs: metadata.outputs,
                hostListeners: metadata.hostListeners,
                hostProperties: metadata.hostProperties,
                hostAttributes: metadata.hostAttributes,
                providers: metadata.providers,
                viewProviders: metadata.viewProviders,
                queries: metadata.queries,
                viewQueries: metadata.viewQueries,
                entryComponents: metadata.entryComponents,
                componentViewType: metadata.componentViewType,
                rendererType: metadata.rendererType,
                componentFactory: metadata.componentFactory,
                template: templateMetadata
            });
            if (templateMetadata) {
                _this.initComponentFactory(/** @type {?} */ ((metadata.componentFactory)), templateMetadata.ngContentSelectors);
            }
            _this._directiveCache.set(directiveType, normalizedDirMeta);
            _this._summaryCache.set(directiveType, normalizedDirMeta.toSummary());
            return normalizedDirMeta;
        };
        if (metadata.isComponent) {
            var /** @type {?} */ template = ((metadata.template));
            var /** @type {?} */ templateMeta = this._directiveNormalizer.normalizeTemplate({
                ngModuleType: ngModuleType,
                componentType: directiveType,
                moduleUrl: componentModuleUrl(this._reflector, directiveType, annotation),
                encapsulation: template.encapsulation,
                template: template.template,
                templateUrl: template.templateUrl,
                styles: template.styles,
                styleUrls: template.styleUrls,
                animations: template.animations,
                interpolation: template.interpolation
            });
            if (templateMeta.syncResult) {
                createDirectiveMetadata(templateMeta.syncResult);
                return null;
            }
            else {
                if (isSync) {
                    this._reportError(componentStillLoadingError(directiveType), directiveType);
                    return null;
                }
                return ((templateMeta.asyncResult)).then(createDirectiveMetadata);
            }
        }
        else {
            // directive
            createDirectiveMetadata(null);
            return null;
        }
    };
    /**
     * @param {?} directiveType
     * @return {?}
     */
    CompileMetadataResolver.prototype.getNonNormalizedDirectiveMetadata = function (directiveType) {
        var _this = this;
        directiveType = resolveForwardRef(directiveType);
        if (!directiveType) {
            return null;
        }
        var /** @type {?} */ cacheEntry = this._nonNormalizedDirectiveCache.get(directiveType);
        if (cacheEntry) {
            return cacheEntry;
        }
        var /** @type {?} */ dirMeta = this._directiveResolver.resolve(directiveType, false);
        if (!dirMeta) {
            return null;
        }
        var /** @type {?} */ nonNormalizedTemplateMetadata = ((undefined));
        if (dirMeta instanceof Component) {
            // component
            assertArrayOfStrings('styles', dirMeta.styles);
            assertArrayOfStrings('styleUrls', dirMeta.styleUrls);
            assertInterpolationSymbols('interpolation', dirMeta.interpolation);
            var /** @type {?} */ animations = dirMeta.animations;
            nonNormalizedTemplateMetadata = new CompileTemplateMetadata({
                encapsulation: noUndefined(dirMeta.encapsulation),
                template: noUndefined(dirMeta.template),
                templateUrl: noUndefined(dirMeta.templateUrl),
                styles: dirMeta.styles || [],
                styleUrls: dirMeta.styleUrls || [],
                animations: animations || [],
                interpolation: noUndefined(dirMeta.interpolation),
                isInline: !!dirMeta.template,
                externalStylesheets: [],
                ngContentSelectors: []
            });
        }
        var /** @type {?} */ changeDetectionStrategy = ((null));
        var /** @type {?} */ viewProviders = [];
        var /** @type {?} */ entryComponentMetadata = [];
        var /** @type {?} */ selector = dirMeta.selector;
        if (dirMeta instanceof Component) {
            // Component
            changeDetectionStrategy = ((dirMeta.changeDetection));
            if (dirMeta.viewProviders) {
                viewProviders = this._getProvidersMetadata(dirMeta.viewProviders, entryComponentMetadata, "viewProviders for \"" + stringifyType(directiveType) + "\"", [], directiveType);
            }
            if (dirMeta.entryComponents) {
                entryComponentMetadata = flattenAndDedupeArray(dirMeta.entryComponents)
                    .map(function (type) { return ((_this._getEntryComponentMetadata(type))); })
                    .concat(entryComponentMetadata);
            }
            if (!selector) {
                selector = this._schemaRegistry.getDefaultComponentElementName();
            }
        }
        else {
            // Directive
            if (!selector) {
                this._reportError(syntaxError("Directive " + stringifyType(directiveType) + " has no selector, please add it!"), directiveType);
                selector = 'error';
            }
        }
        var /** @type {?} */ providers = [];
        if (dirMeta.providers != null) {
            providers = this._getProvidersMetadata(dirMeta.providers, entryComponentMetadata, "providers for \"" + stringifyType(directiveType) + "\"", [], directiveType);
        }
        var /** @type {?} */ queries = [];
        var /** @type {?} */ viewQueries = [];
        if (dirMeta.queries != null) {
            queries = this._getQueriesMetadata(dirMeta.queries, false, directiveType);
            viewQueries = this._getQueriesMetadata(dirMeta.queries, true, directiveType);
        }
        var /** @type {?} */ metadata = CompileDirectiveMetadata.create({
            isHost: false,
            selector: selector,
            exportAs: noUndefined(dirMeta.exportAs),
            isComponent: !!nonNormalizedTemplateMetadata,
            type: this._getTypeMetadata(directiveType),
            template: nonNormalizedTemplateMetadata,
            changeDetection: changeDetectionStrategy,
            inputs: dirMeta.inputs || [],
            outputs: dirMeta.outputs || [],
            host: dirMeta.host || {},
            providers: providers || [],
            viewProviders: viewProviders || [],
            queries: queries || [],
            viewQueries: viewQueries || [],
            entryComponents: entryComponentMetadata,
            componentViewType: nonNormalizedTemplateMetadata ? this.getComponentViewClass(directiveType) :
                null,
            rendererType: nonNormalizedTemplateMetadata ? this.getRendererType(directiveType) : null,
            componentFactory: null
        });
        if (nonNormalizedTemplateMetadata) {
            metadata.componentFactory =
                this.getComponentFactory(selector, directiveType, metadata.inputs, metadata.outputs);
        }
        cacheEntry = { metadata: metadata, annotation: dirMeta };
        this._nonNormalizedDirectiveCache.set(directiveType, cacheEntry);
        return cacheEntry;
    };
    /**
     * Gets the metadata for the given directive.
     * This assumes `loadNgModuleDirectiveAndPipeMetadata` has been called first.
     * @param {?} directiveType
     * @return {?}
     */
    CompileMetadataResolver.prototype.getDirectiveMetadata = function (directiveType) {
        var /** @type {?} */ dirMeta = ((this._directiveCache.get(directiveType)));
        if (!dirMeta) {
            this._reportError(syntaxError("Illegal state: getDirectiveMetadata can only be called after loadNgModuleDirectiveAndPipeMetadata for a module that declares it. Directive " + stringifyType(directiveType) + "."), directiveType);
        }
        return dirMeta;
    };
    /**
     * @param {?} dirType
     * @return {?}
     */
    CompileMetadataResolver.prototype.getDirectiveSummary = function (dirType) {
        var /** @type {?} */ dirSummary = (this._loadSummary(dirType, CompileSummaryKind.Directive));
        if (!dirSummary) {
            this._reportError(syntaxError("Illegal state: Could not load the summary for directive " + stringifyType(dirType) + "."), dirType);
        }
        return dirSummary;
    };
    /**
     * @param {?} type
     * @return {?}
     */
    CompileMetadataResolver.prototype.isDirective = function (type) { return this._directiveResolver.isDirective(type); };
    /**
     * @param {?} type
     * @return {?}
     */
    CompileMetadataResolver.prototype.isPipe = function (type) { return this._pipeResolver.isPipe(type); };
    /**
     * @param {?} moduleType
     * @return {?}
     */
    CompileMetadataResolver.prototype.getNgModuleSummary = function (moduleType) {
        var /** @type {?} */ moduleSummary = (this._loadSummary(moduleType, CompileSummaryKind.NgModule));
        if (!moduleSummary) {
            var /** @type {?} */ moduleMeta = this.getNgModuleMetadata(moduleType, false);
            moduleSummary = moduleMeta ? moduleMeta.toSummary() : null;
            if (moduleSummary) {
                this._summaryCache.set(moduleType, moduleSummary);
            }
        }
        return moduleSummary;
    };
    /**
     * Loads the declared directives and pipes of an NgModule.
     * @param {?} moduleType
     * @param {?} isSync
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    CompileMetadataResolver.prototype.loadNgModuleDirectiveAndPipeMetadata = function (moduleType, isSync, throwIfNotFound) {
        var _this = this;
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var /** @type {?} */ ngModule = this.getNgModuleMetadata(moduleType, throwIfNotFound);
        var /** @type {?} */ loading = [];
        if (ngModule) {
            ngModule.declaredDirectives.forEach(function (id) {
                var /** @type {?} */ promise = _this._loadDirectiveMetadata(moduleType, id.reference, isSync);
                if (promise) {
                    loading.push(promise);
                }
            });
            ngModule.declaredPipes.forEach(function (id) { return _this._loadPipeMetadata(id.reference); });
        }
        return Promise.all(loading);
    };
    /**
     * @param {?} moduleType
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    CompileMetadataResolver.prototype.getNgModuleMetadata = function (moduleType, throwIfNotFound) {
        var _this = this;
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        moduleType = resolveForwardRef(moduleType);
        var /** @type {?} */ compileMeta = this._ngModuleCache.get(moduleType);
        if (compileMeta) {
            return compileMeta;
        }
        var /** @type {?} */ meta = this._ngModuleResolver.resolve(moduleType, throwIfNotFound);
        if (!meta) {
            return null;
        }
        var /** @type {?} */ declaredDirectives = [];
        var /** @type {?} */ exportedNonModuleIdentifiers = [];
        var /** @type {?} */ declaredPipes = [];
        var /** @type {?} */ importedModules = [];
        var /** @type {?} */ exportedModules = [];
        var /** @type {?} */ providers = [];
        var /** @type {?} */ entryComponents = [];
        var /** @type {?} */ bootstrapComponents = [];
        var /** @type {?} */ schemas = [];
        if (meta.imports) {
            flattenAndDedupeArray(meta.imports).forEach(function (importedType) {
                var /** @type {?} */ importedModuleType = ((undefined));
                if (isValidType(importedType)) {
                    importedModuleType = importedType;
                }
                else if (importedType && importedType.ngModule) {
                    var /** @type {?} */ moduleWithProviders = importedType;
                    importedModuleType = moduleWithProviders.ngModule;
                    if (moduleWithProviders.providers) {
                        providers.push.apply(providers, _this._getProvidersMetadata(moduleWithProviders.providers, entryComponents, "provider for the NgModule '" + stringifyType(importedModuleType) + "'", [], importedType));
                    }
                }
                if (importedModuleType) {
                    if (_this._checkSelfImport(moduleType, importedModuleType))
                        return;
                    var /** @type {?} */ importedModuleSummary = _this.getNgModuleSummary(importedModuleType);
                    if (!importedModuleSummary) {
                        _this._reportError(syntaxError("Unexpected " + _this._getTypeDescriptor(importedType) + " '" + stringifyType(importedType) + "' imported by the module '" + stringifyType(moduleType) + "'. Please add a @NgModule annotation."), moduleType);
                        return;
                    }
                    importedModules.push(importedModuleSummary);
                }
                else {
                    _this._reportError(syntaxError("Unexpected value '" + stringifyType(importedType) + "' imported by the module '" + stringifyType(moduleType) + "'"), moduleType);
                    return;
                }
            });
        }
        if (meta.exports) {
            flattenAndDedupeArray(meta.exports).forEach(function (exportedType) {
                if (!isValidType(exportedType)) {
                    _this._reportError(syntaxError("Unexpected value '" + stringifyType(exportedType) + "' exported by the module '" + stringifyType(moduleType) + "'"), moduleType);
                    return;
                }
                var /** @type {?} */ exportedModuleSummary = _this.getNgModuleSummary(exportedType);
                if (exportedModuleSummary) {
                    exportedModules.push(exportedModuleSummary);
                }
                else {
                    exportedNonModuleIdentifiers.push(_this._getIdentifierMetadata(exportedType));
                }
            });
        }
        // Note: This will be modified later, so we rely on
        // getting a new instance every time!
        var /** @type {?} */ transitiveModule = this._getTransitiveNgModuleMetadata(importedModules, exportedModules);
        if (meta.declarations) {
            flattenAndDedupeArray(meta.declarations).forEach(function (declaredType) {
                if (!isValidType(declaredType)) {
                    _this._reportError(syntaxError("Unexpected value '" + stringifyType(declaredType) + "' declared by the module '" + stringifyType(moduleType) + "'"), moduleType);
                    return;
                }
                var /** @type {?} */ declaredIdentifier = _this._getIdentifierMetadata(declaredType);
                if (_this._directiveResolver.isDirective(declaredType)) {
                    transitiveModule.addDirective(declaredIdentifier);
                    declaredDirectives.push(declaredIdentifier);
                    _this._addTypeToModule(declaredType, moduleType);
                }
                else if (_this._pipeResolver.isPipe(declaredType)) {
                    transitiveModule.addPipe(declaredIdentifier);
                    transitiveModule.pipes.push(declaredIdentifier);
                    declaredPipes.push(declaredIdentifier);
                    _this._addTypeToModule(declaredType, moduleType);
                }
                else {
                    _this._reportError(syntaxError("Unexpected " + _this._getTypeDescriptor(declaredType) + " '" + stringifyType(declaredType) + "' declared by the module '" + stringifyType(moduleType) + "'. Please add a @Pipe/@Directive/@Component annotation."), moduleType);
                    return;
                }
            });
        }
        var /** @type {?} */ exportedDirectives = [];
        var /** @type {?} */ exportedPipes = [];
        exportedNonModuleIdentifiers.forEach(function (exportedId) {
            if (transitiveModule.directivesSet.has(exportedId.reference)) {
                exportedDirectives.push(exportedId);
                transitiveModule.addExportedDirective(exportedId);
            }
            else if (transitiveModule.pipesSet.has(exportedId.reference)) {
                exportedPipes.push(exportedId);
                transitiveModule.addExportedPipe(exportedId);
            }
            else {
                _this._reportError(syntaxError("Can't export " + _this._getTypeDescriptor(exportedId.reference) + " " + stringifyType(exportedId.reference) + " from " + stringifyType(moduleType) + " as it was neither declared nor imported!"), moduleType);
                return;
            }
        });
        // The providers of the module have to go last
        // so that they overwrite any other provider we already added.
        if (meta.providers) {
            providers.push.apply(providers, this._getProvidersMetadata(meta.providers, entryComponents, "provider for the NgModule '" + stringifyType(moduleType) + "'", [], moduleType));
        }
        if (meta.entryComponents) {
            entryComponents.push.apply(entryComponents, flattenAndDedupeArray(meta.entryComponents)
                .map(function (type) { return ((_this._getEntryComponentMetadata(type))); }));
        }
        if (meta.bootstrap) {
            flattenAndDedupeArray(meta.bootstrap).forEach(function (type) {
                if (!isValidType(type)) {
                    _this._reportError(syntaxError("Unexpected value '" + stringifyType(type) + "' used in the bootstrap property of module '" + stringifyType(moduleType) + "'"), moduleType);
                    return;
                }
                bootstrapComponents.push(_this._getIdentifierMetadata(type));
            });
        }
        entryComponents.push.apply(entryComponents, bootstrapComponents.map(function (type) { return ((_this._getEntryComponentMetadata(type.reference))); }));
        if (meta.schemas) {
            schemas.push.apply(schemas, flattenAndDedupeArray(meta.schemas));
        }
        compileMeta = new CompileNgModuleMetadata({
            type: this._getTypeMetadata(moduleType),
            providers: providers,
            entryComponents: entryComponents,
            bootstrapComponents: bootstrapComponents,
            schemas: schemas,
            declaredDirectives: declaredDirectives,
            exportedDirectives: exportedDirectives,
            declaredPipes: declaredPipes,
            exportedPipes: exportedPipes,
            importedModules: importedModules,
            exportedModules: exportedModules,
            transitiveModule: transitiveModule,
            id: meta.id || null,
        });
        entryComponents.forEach(function (id) { return transitiveModule.addEntryComponent(id); });
        providers.forEach(function (provider) { return transitiveModule.addProvider(provider, /** @type {?} */ ((compileMeta)).type); });
        transitiveModule.addModule(compileMeta.type);
        this._ngModuleCache.set(moduleType, compileMeta);
        return compileMeta;
    };
    /**
     * @param {?} moduleType
     * @param {?} importedModuleType
     * @return {?}
     */
    CompileMetadataResolver.prototype._checkSelfImport = function (moduleType, importedModuleType) {
        if (moduleType === importedModuleType) {
            this._reportError(syntaxError("'" + stringifyType(moduleType) + "' module can't import itself"), moduleType);
            return true;
        }
        return false;
    };
    /**
     * @param {?} type
     * @return {?}
     */
    CompileMetadataResolver.prototype._getTypeDescriptor = function (type) {
        if (this._directiveResolver.isDirective(type)) {
            return 'directive';
        }
        if (this._pipeResolver.isPipe(type)) {
            return 'pipe';
        }
        if (this._ngModuleResolver.isNgModule(type)) {
            return 'module';
        }
        if (((type)).provide) {
            return 'provider';
        }
        return 'value';
    };
    /**
     * @param {?} type
     * @param {?} moduleType
     * @return {?}
     */
    CompileMetadataResolver.prototype._addTypeToModule = function (type, moduleType) {
        var /** @type {?} */ oldModule = this._ngModuleOfTypes.get(type);
        if (oldModule && oldModule !== moduleType) {
            this._reportError(syntaxError("Type " + stringifyType(type) + " is part of the declarations of 2 modules: " + stringifyType(oldModule) + " and " + stringifyType(moduleType) + "! " +
                ("Please consider moving " + stringifyType(type) + " to a higher module that imports " + stringifyType(oldModule) + " and " + stringifyType(moduleType) + ". ") +
                ("You can also create a new NgModule that exports and includes " + stringifyType(type) + " then import that NgModule in " + stringifyType(oldModule) + " and " + stringifyType(moduleType) + ".")), moduleType);
            return;
        }
        this._ngModuleOfTypes.set(type, moduleType);
    };
    /**
     * @param {?} importedModules
     * @param {?} exportedModules
     * @return {?}
     */
    CompileMetadataResolver.prototype._getTransitiveNgModuleMetadata = function (importedModules, exportedModules) {
        // collect `providers` / `entryComponents` from all imported and all exported modules
        var /** @type {?} */ result = new TransitiveCompileNgModuleMetadata();
        var /** @type {?} */ modulesByToken = new Map();
        importedModules.concat(exportedModules).forEach(function (modSummary) {
            modSummary.modules.forEach(function (mod) { return result.addModule(mod); });
            modSummary.entryComponents.forEach(function (comp) { return result.addEntryComponent(comp); });
            var /** @type {?} */ addedTokens = new Set();
            modSummary.providers.forEach(function (entry) {
                var /** @type {?} */ tokenRef = tokenReference(entry.provider.token);
                var /** @type {?} */ prevModules = modulesByToken.get(tokenRef);
                if (!prevModules) {
                    prevModules = new Set();
                    modulesByToken.set(tokenRef, prevModules);
                }
                var /** @type {?} */ moduleRef = entry.module.reference;
                // Note: the providers of one module may still contain multiple providers
                // per token (e.g. for multi providers), and we need to preserve these.
                if (addedTokens.has(tokenRef) || !prevModules.has(moduleRef)) {
                    prevModules.add(moduleRef);
                    addedTokens.add(tokenRef);
                    result.addProvider(entry.provider, entry.module);
                }
            });
        });
        exportedModules.forEach(function (modSummary) {
            modSummary.exportedDirectives.forEach(function (id) { return result.addExportedDirective(id); });
            modSummary.exportedPipes.forEach(function (id) { return result.addExportedPipe(id); });
        });
        importedModules.forEach(function (modSummary) {
            modSummary.exportedDirectives.forEach(function (id) { return result.addDirective(id); });
            modSummary.exportedPipes.forEach(function (id) { return result.addPipe(id); });
        });
        return result;
    };
    /**
     * @param {?} type
     * @return {?}
     */
    CompileMetadataResolver.prototype._getIdentifierMetadata = function (type) {
        type = resolveForwardRef(type);
        return { reference: type };
    };
    /**
     * @param {?} type
     * @return {?}
     */
    CompileMetadataResolver.prototype.isInjectable = function (type) {
        var /** @type {?} */ annotations = this._reflector.annotations(type);
        // Note: We need an exact check here as @Component / @Directive / ... inherit
        // from @CompilerInjectable!
        return annotations.some(function (ann) { return ann.constructor === Injectable; });
    };
    /**
     * @param {?} type
     * @return {?}
     */
    CompileMetadataResolver.prototype.getInjectableSummary = function (type) {
        return {
            summaryKind: CompileSummaryKind.Injectable,
            type: this._getTypeMetadata(type, null, false)
        };
    };
    /**
     * @param {?} type
     * @param {?=} dependencies
     * @return {?}
     */
    CompileMetadataResolver.prototype._getInjectableMetadata = function (type, dependencies) {
        if (dependencies === void 0) { dependencies = null; }
        var /** @type {?} */ typeSummary = this._loadSummary(type, CompileSummaryKind.Injectable);
        if (typeSummary) {
            return typeSummary.type;
        }
        return this._getTypeMetadata(type, dependencies);
    };
    /**
     * @param {?} type
     * @param {?=} dependencies
     * @param {?=} throwOnUnknownDeps
     * @return {?}
     */
    CompileMetadataResolver.prototype._getTypeMetadata = function (type, dependencies, throwOnUnknownDeps) {
        if (dependencies === void 0) { dependencies = null; }
        if (throwOnUnknownDeps === void 0) { throwOnUnknownDeps = true; }
        var /** @type {?} */ identifier = this._getIdentifierMetadata(type);
        return {
            reference: identifier.reference,
            diDeps: this._getDependenciesMetadata(identifier.reference, dependencies, throwOnUnknownDeps),
            lifecycleHooks: ɵLIFECYCLE_HOOKS_VALUES.filter(function (hook) { return hasLifecycleHook(hook, identifier.reference); }),
        };
    };
    /**
     * @param {?} factory
     * @param {?=} dependencies
     * @return {?}
     */
    CompileMetadataResolver.prototype._getFactoryMetadata = function (factory, dependencies) {
        if (dependencies === void 0) { dependencies = null; }
        factory = resolveForwardRef(factory);
        return { reference: factory, diDeps: this._getDependenciesMetadata(factory, dependencies) };
    };
    /**
     * Gets the metadata for the given pipe.
     * This assumes `loadNgModuleDirectiveAndPipeMetadata` has been called first.
     * @param {?} pipeType
     * @return {?}
     */
    CompileMetadataResolver.prototype.getPipeMetadata = function (pipeType) {
        var /** @type {?} */ pipeMeta = this._pipeCache.get(pipeType);
        if (!pipeMeta) {
            this._reportError(syntaxError("Illegal state: getPipeMetadata can only be called after loadNgModuleDirectiveAndPipeMetadata for a module that declares it. Pipe " + stringifyType(pipeType) + "."), pipeType);
        }
        return pipeMeta || null;
    };
    /**
     * @param {?} pipeType
     * @return {?}
     */
    CompileMetadataResolver.prototype.getPipeSummary = function (pipeType) {
        var /** @type {?} */ pipeSummary = (this._loadSummary(pipeType, CompileSummaryKind.Pipe));
        if (!pipeSummary) {
            this._reportError(syntaxError("Illegal state: Could not load the summary for pipe " + stringifyType(pipeType) + "."), pipeType);
        }
        return pipeSummary;
    };
    /**
     * @param {?} pipeType
     * @return {?}
     */
    CompileMetadataResolver.prototype.getOrLoadPipeMetadata = function (pipeType) {
        var /** @type {?} */ pipeMeta = this._pipeCache.get(pipeType);
        if (!pipeMeta) {
            pipeMeta = this._loadPipeMetadata(pipeType);
        }
        return pipeMeta;
    };
    /**
     * @param {?} pipeType
     * @return {?}
     */
    CompileMetadataResolver.prototype._loadPipeMetadata = function (pipeType) {
        pipeType = resolveForwardRef(pipeType);
        var /** @type {?} */ pipeAnnotation = ((this._pipeResolver.resolve(pipeType)));
        var /** @type {?} */ pipeMeta = new CompilePipeMetadata({
            type: this._getTypeMetadata(pipeType),
            name: pipeAnnotation.name,
            pure: !!pipeAnnotation.pure
        });
        this._pipeCache.set(pipeType, pipeMeta);
        this._summaryCache.set(pipeType, pipeMeta.toSummary());
        return pipeMeta;
    };
    /**
     * @param {?} typeOrFunc
     * @param {?} dependencies
     * @param {?=} throwOnUnknownDeps
     * @return {?}
     */
    CompileMetadataResolver.prototype._getDependenciesMetadata = function (typeOrFunc, dependencies, throwOnUnknownDeps) {
        var _this = this;
        if (throwOnUnknownDeps === void 0) { throwOnUnknownDeps = true; }
        var /** @type {?} */ hasUnknownDeps = false;
        var /** @type {?} */ params = dependencies || this._reflector.parameters(typeOrFunc) || [];
        var /** @type {?} */ dependenciesMetadata = params.map(function (param) {
            var /** @type {?} */ isAttribute = false;
            var /** @type {?} */ isHost = false;
            var /** @type {?} */ isSelf = false;
            var /** @type {?} */ isSkipSelf = false;
            var /** @type {?} */ isOptional = false;
            var /** @type {?} */ token = null;
            if (Array.isArray(param)) {
                param.forEach(function (paramEntry) {
                    if (paramEntry instanceof Host) {
                        isHost = true;
                    }
                    else if (paramEntry instanceof Self) {
                        isSelf = true;
                    }
                    else if (paramEntry instanceof SkipSelf) {
                        isSkipSelf = true;
                    }
                    else if (paramEntry instanceof Optional) {
                        isOptional = true;
                    }
                    else if (paramEntry instanceof Attribute) {
                        isAttribute = true;
                        token = paramEntry.attributeName;
                    }
                    else if (paramEntry instanceof Inject) {
                        token = paramEntry.token;
                    }
                    else if (paramEntry instanceof InjectionToken) {
                        token = paramEntry;
                    }
                    else if (isValidType(paramEntry) && token == null) {
                        token = paramEntry;
                    }
                });
            }
            else {
                token = param;
            }
            if (token == null) {
                hasUnknownDeps = true;
                return ((null));
            }
            return {
                isAttribute: isAttribute,
                isHost: isHost,
                isSelf: isSelf,
                isSkipSelf: isSkipSelf,
                isOptional: isOptional,
                token: _this._getTokenMetadata(token)
            };
        });
        if (hasUnknownDeps) {
            var /** @type {?} */ depsTokens = dependenciesMetadata.map(function (dep) { return dep ? stringifyType(dep.token) : '?'; }).join(', ');
            var /** @type {?} */ message = "Can't resolve all parameters for " + stringifyType(typeOrFunc) + ": (" + depsTokens + ").";
            if (throwOnUnknownDeps) {
                this._reportError(syntaxError(message), typeOrFunc);
            }
            else {
                this._console.warn("Warning: " + message + " This will become an error in Angular v5.x");
            }
        }
        return dependenciesMetadata;
    };
    /**
     * @param {?} token
     * @return {?}
     */
    CompileMetadataResolver.prototype._getTokenMetadata = function (token) {
        token = resolveForwardRef(token);
        var /** @type {?} */ compileToken;
        if (typeof token === 'string') {
            compileToken = { value: token };
        }
        else {
            compileToken = { identifier: { reference: token } };
        }
        return compileToken;
    };
    /**
     * @param {?} providers
     * @param {?} targetEntryComponents
     * @param {?=} debugInfo
     * @param {?=} compileProviders
     * @param {?=} type
     * @return {?}
     */
    CompileMetadataResolver.prototype._getProvidersMetadata = function (providers, targetEntryComponents, debugInfo, compileProviders, type) {
        var _this = this;
        if (compileProviders === void 0) { compileProviders = []; }
        providers.forEach(function (provider, providerIdx) {
            if (Array.isArray(provider)) {
                _this._getProvidersMetadata(provider, targetEntryComponents, debugInfo, compileProviders);
            }
            else {
                provider = resolveForwardRef(provider);
                var /** @type {?} */ providerMeta = ((undefined));
                if (provider && typeof provider === 'object' && provider.hasOwnProperty('provide')) {
                    _this._validateProvider(provider);
                    providerMeta = new ProviderMeta(provider.provide, provider);
                }
                else if (isValidType(provider)) {
                    providerMeta = new ProviderMeta(provider, { useClass: provider });
                }
                else if (provider === void 0) {
                    _this._reportError(syntaxError("Encountered undefined provider! Usually this means you have a circular dependencies (might be caused by using 'barrel' index.ts files."));
                    return;
                }
                else {
                    var /** @type {?} */ providersInfo = ((providers.reduce(function (soFar, seenProvider, seenProviderIdx) {
                        if (seenProviderIdx < providerIdx) {
                            soFar.push("" + stringifyType(seenProvider));
                        }
                        else if (seenProviderIdx == providerIdx) {
                            soFar.push("?" + stringifyType(seenProvider) + "?");
                        }
                        else if (seenProviderIdx == providerIdx + 1) {
                            soFar.push('...');
                        }
                        return soFar;
                    }, [])))
                        .join(', ');
                    _this._reportError(syntaxError("Invalid " + (debugInfo ? debugInfo : 'provider') + " - only instances of Provider and Type are allowed, got: [" + providersInfo + "]"), type);
                    return;
                }
                if (providerMeta.token === resolveIdentifier(Identifiers.ANALYZE_FOR_ENTRY_COMPONENTS)) {
                    targetEntryComponents.push.apply(targetEntryComponents, _this._getEntryComponentsFromProvider(providerMeta, type));
                }
                else {
                    compileProviders.push(_this.getProviderMetadata(providerMeta));
                }
            }
        });
        return compileProviders;
    };
    /**
     * @param {?} provider
     * @return {?}
     */
    CompileMetadataResolver.prototype._validateProvider = function (provider) {
        if (provider.hasOwnProperty('useClass') && provider.useClass == null) {
            this._reportError(syntaxError("Invalid provider for " + stringifyType(provider.provide) + ". useClass cannot be " + provider.useClass + ".\n           Usually it happens when:\n           1. There's a circular dependency (might be caused by using index.ts (barrel) files).\n           2. Class was used before it was declared. Use forwardRef in this case."));
        }
    };
    /**
     * @param {?} provider
     * @param {?=} type
     * @return {?}
     */
    CompileMetadataResolver.prototype._getEntryComponentsFromProvider = function (provider, type) {
        var _this = this;
        var /** @type {?} */ components = [];
        var /** @type {?} */ collectedIdentifiers = [];
        if (provider.useFactory || provider.useExisting || provider.useClass) {
            this._reportError(syntaxError("The ANALYZE_FOR_ENTRY_COMPONENTS token only supports useValue!"), type);
            return [];
        }
        if (!provider.multi) {
            this._reportError(syntaxError("The ANALYZE_FOR_ENTRY_COMPONENTS token only supports 'multi = true'!"), type);
            return [];
        }
        extractIdentifiers(provider.useValue, collectedIdentifiers);
        collectedIdentifiers.forEach(function (identifier) {
            var /** @type {?} */ entry = _this._getEntryComponentMetadata(identifier.reference, false);
            if (entry) {
                components.push(entry);
            }
        });
        return components;
    };
    /**
     * @param {?} dirType
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    CompileMetadataResolver.prototype._getEntryComponentMetadata = function (dirType, throwIfNotFound) {
        if (throwIfNotFound === void 0) { throwIfNotFound = true; }
        var /** @type {?} */ dirMeta = this.getNonNormalizedDirectiveMetadata(dirType);
        if (dirMeta && dirMeta.metadata.isComponent) {
            return { componentType: dirType, componentFactory: /** @type {?} */ ((dirMeta.metadata.componentFactory)) };
        }
        var /** @type {?} */ dirSummary = (this._loadSummary(dirType, CompileSummaryKind.Directive));
        if (dirSummary && dirSummary.isComponent) {
            return { componentType: dirType, componentFactory: /** @type {?} */ ((dirSummary.componentFactory)) };
        }
        if (throwIfNotFound) {
            throw syntaxError(dirType.name + " cannot be used as an entry component.");
        }
        return null;
    };
    /**
     * @param {?} provider
     * @return {?}
     */
    CompileMetadataResolver.prototype.getProviderMetadata = function (provider) {
        var /** @type {?} */ compileDeps = ((undefined));
        var /** @type {?} */ compileTypeMetadata = ((null));
        var /** @type {?} */ compileFactoryMetadata = ((null));
        var /** @type {?} */ token = this._getTokenMetadata(provider.token);
        if (provider.useClass) {
            compileTypeMetadata = this._getInjectableMetadata(provider.useClass, provider.dependencies);
            compileDeps = compileTypeMetadata.diDeps;
            if (provider.token === provider.useClass) {
                // use the compileTypeMetadata as it contains information about lifecycleHooks...
                token = { identifier: compileTypeMetadata };
            }
        }
        else if (provider.useFactory) {
            compileFactoryMetadata = this._getFactoryMetadata(provider.useFactory, provider.dependencies);
            compileDeps = compileFactoryMetadata.diDeps;
        }
        return {
            token: token,
            useClass: compileTypeMetadata,
            useValue: provider.useValue,
            useFactory: compileFactoryMetadata,
            useExisting: provider.useExisting ? this._getTokenMetadata(provider.useExisting) : undefined,
            deps: compileDeps,
            multi: provider.multi
        };
    };
    /**
     * @param {?} queries
     * @param {?} isViewQuery
     * @param {?} directiveType
     * @return {?}
     */
    CompileMetadataResolver.prototype._getQueriesMetadata = function (queries, isViewQuery, directiveType) {
        var _this = this;
        var /** @type {?} */ res = [];
        Object.keys(queries).forEach(function (propertyName) {
            var /** @type {?} */ query = queries[propertyName];
            if (query.isViewQuery === isViewQuery) {
                res.push(_this._getQueryMetadata(query, propertyName, directiveType));
            }
        });
        return res;
    };
    /**
     * @param {?} selector
     * @return {?}
     */
    CompileMetadataResolver.prototype._queryVarBindings = function (selector) { return selector.split(/\s*,\s*/); };
    /**
     * @param {?} q
     * @param {?} propertyName
     * @param {?} typeOrFunc
     * @return {?}
     */
    CompileMetadataResolver.prototype._getQueryMetadata = function (q, propertyName, typeOrFunc) {
        var _this = this;
        var /** @type {?} */ selectors;
        if (typeof q.selector === 'string') {
            selectors =
                this._queryVarBindings(q.selector).map(function (varName) { return _this._getTokenMetadata(varName); });
        }
        else {
            if (!q.selector) {
                this._reportError(syntaxError("Can't construct a query for the property \"" + propertyName + "\" of \"" + stringifyType(typeOrFunc) + "\" since the query selector wasn't defined."), typeOrFunc);
                selectors = [];
            }
            else {
                selectors = [this._getTokenMetadata(q.selector)];
            }
        }
        return {
            selectors: selectors,
            first: q.first,
            descendants: q.descendants, propertyName: propertyName,
            read: q.read ? this._getTokenMetadata(q.read) : ((null))
        };
    };
    /**
     * @param {?} error
     * @param {?=} type
     * @param {?=} otherType
     * @return {?}
     */
    CompileMetadataResolver.prototype._reportError = function (error, type, otherType) {
        if (this._errorCollector) {
            this._errorCollector(error, type);
            if (otherType) {
                this._errorCollector(error, otherType);
            }
        }
        else {
            throw error;
        }
    };
    return CompileMetadataResolver;
}());
CompileMetadataResolver.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
CompileMetadataResolver.ctorParameters = function () { return [
    { type: CompilerConfig, },
    { type: NgModuleResolver, },
    { type: DirectiveResolver, },
    { type: PipeResolver, },
    { type: SummaryResolver, },
    { type: ElementSchemaRegistry, },
    { type: DirectiveNormalizer, },
    { type: ɵConsole, },
    { type: StaticSymbolCache, decorators: [{ type: Optional },] },
    { type: ɵReflectorReader, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ERROR_COLLECTOR_TOKEN,] },] },
]; };
/**
 * @param {?} tree
 * @param {?=} out
 * @return {?}
 */
function flattenArray(tree, out) {
    if (out === void 0) { out = []; }
    if (tree) {
        for (var /** @type {?} */ i = 0; i < tree.length; i++) {
            var /** @type {?} */ item = resolveForwardRef(tree[i]);
            if (Array.isArray(item)) {
                flattenArray(item, out);
            }
            else {
                out.push(item);
            }
        }
    }
    return out;
}
/**
 * @param {?} array
 * @return {?}
 */
function dedupeArray(array) {
    if (array) {
        return Array.from(new Set(array));
    }
    return [];
}
/**
 * @param {?} tree
 * @return {?}
 */
function flattenAndDedupeArray(tree) {
    return dedupeArray(flattenArray(tree));
}
/**
 * @param {?} value
 * @return {?}
 */
function isValidType(value) {
    return (value instanceof StaticSymbol) || (value instanceof Type);
}
/**
 * @param {?} reflector
 * @param {?} type
 * @param {?} cmpMetadata
 * @return {?}
 */
function componentModuleUrl(reflector, type, cmpMetadata) {
    if (type instanceof StaticSymbol) {
        return reflector.resourceUri(type);
    }
    var /** @type {?} */ moduleId = cmpMetadata.moduleId;
    if (typeof moduleId === 'string') {
        var /** @type {?} */ scheme = getUrlScheme(moduleId);
        return scheme ? moduleId : "package:" + moduleId + MODULE_SUFFIX;
    }
    else if (moduleId !== null && moduleId !== void 0) {
        throw syntaxError("moduleId should be a string in \"" + stringifyType(type) + "\". See https://goo.gl/wIDDiL for more information.\n" +
            "If you're using Webpack you should inline the template and the styles, see https://goo.gl/X2J8zc.");
    }
    return ((reflector.importUri(type)));
}
/**
 * @param {?} value
 * @param {?} targetIdentifiers
 * @return {?}
 */
function extractIdentifiers(value, targetIdentifiers) {
    visitValue(value, new _CompileValueConverter(), targetIdentifiers);
}
var _CompileValueConverter = (function (_super) {
    __extends(_CompileValueConverter, _super);
    function _CompileValueConverter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} value
     * @param {?} targetIdentifiers
     * @return {?}
     */
    _CompileValueConverter.prototype.visitOther = function (value, targetIdentifiers) {
        targetIdentifiers.push({ reference: value });
    };
    return _CompileValueConverter;
}(ValueTransformer));
/**
 * @param {?} type
 * @return {?}
 */
function stringifyType(type) {
    if (type instanceof StaticSymbol) {
        return type.name + " in " + type.filePath;
    }
    else {
        return ɵstringify(type);
    }
}
/**
 * Indicates that a component is still being loaded in a synchronous compile.
 * @param {?} compType
 * @return {?}
 */
function componentStillLoadingError(compType) {
    var /** @type {?} */ error = Error("Can't compile synchronously as " + ɵstringify(compType) + " is still being loaded!");
    ((error))[ɵERROR_COMPONENT_TYPE] = compType;
    return error;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var TypeModifier = {};
TypeModifier.Const = 0;
TypeModifier[TypeModifier.Const] = "Const";
/**
 * @abstract
 */
var Type$1 = (function () {
    /**
     * @param {?=} modifiers
     */
    function Type$1(modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        this.modifiers = modifiers;
        if (!modifiers) {
            this.modifiers = [];
        }
    }
    /**
     * @abstract
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Type$1.prototype.visitType = function (visitor, context) { };
    /**
     * @param {?} modifier
     * @return {?}
     */
    Type$1.prototype.hasModifier = function (modifier) { return ((this.modifiers)).indexOf(modifier) !== -1; };
    return Type$1;
}());
var BuiltinTypeName = {};
BuiltinTypeName.Dynamic = 0;
BuiltinTypeName.Bool = 1;
BuiltinTypeName.String = 2;
BuiltinTypeName.Int = 3;
BuiltinTypeName.Number = 4;
BuiltinTypeName.Function = 5;
BuiltinTypeName.Inferred = 6;
BuiltinTypeName[BuiltinTypeName.Dynamic] = "Dynamic";
BuiltinTypeName[BuiltinTypeName.Bool] = "Bool";
BuiltinTypeName[BuiltinTypeName.String] = "String";
BuiltinTypeName[BuiltinTypeName.Int] = "Int";
BuiltinTypeName[BuiltinTypeName.Number] = "Number";
BuiltinTypeName[BuiltinTypeName.Function] = "Function";
BuiltinTypeName[BuiltinTypeName.Inferred] = "Inferred";
var BuiltinType = (function (_super) {
    __extends(BuiltinType, _super);
    /**
     * @param {?} name
     * @param {?=} modifiers
     */
    function BuiltinType(name, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers) || this;
        _this.name = name;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    BuiltinType.prototype.visitType = function (visitor, context) {
        return visitor.visitBuiltintType(this, context);
    };
    return BuiltinType;
}(Type$1));
var ExpressionType = (function (_super) {
    __extends(ExpressionType, _super);
    /**
     * @param {?} value
     * @param {?=} modifiers
     */
    function ExpressionType(value, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers) || this;
        _this.value = value;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ExpressionType.prototype.visitType = function (visitor, context) {
        return visitor.visitExpressionType(this, context);
    };
    return ExpressionType;
}(Type$1));
var ArrayType = (function (_super) {
    __extends(ArrayType, _super);
    /**
     * @param {?} of
     * @param {?=} modifiers
     */
    function ArrayType(of, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers) || this;
        _this.of = of;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ArrayType.prototype.visitType = function (visitor, context) {
        return visitor.visitArrayType(this, context);
    };
    return ArrayType;
}(Type$1));
var MapType = (function (_super) {
    __extends(MapType, _super);
    /**
     * @param {?} valueType
     * @param {?=} modifiers
     */
    function MapType(valueType, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers) || this;
        _this.valueType = valueType || null;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    MapType.prototype.visitType = function (visitor, context) { return visitor.visitMapType(this, context); };
    return MapType;
}(Type$1));
var DYNAMIC_TYPE = new BuiltinType(BuiltinTypeName.Dynamic);
var INFERRED_TYPE = new BuiltinType(BuiltinTypeName.Inferred);
var BOOL_TYPE = new BuiltinType(BuiltinTypeName.Bool);
var INT_TYPE = new BuiltinType(BuiltinTypeName.Int);
var NUMBER_TYPE = new BuiltinType(BuiltinTypeName.Number);
var STRING_TYPE = new BuiltinType(BuiltinTypeName.String);
var FUNCTION_TYPE = new BuiltinType(BuiltinTypeName.Function);
var BinaryOperator = {};
BinaryOperator.Equals = 0;
BinaryOperator.NotEquals = 1;
BinaryOperator.Identical = 2;
BinaryOperator.NotIdentical = 3;
BinaryOperator.Minus = 4;
BinaryOperator.Plus = 5;
BinaryOperator.Divide = 6;
BinaryOperator.Multiply = 7;
BinaryOperator.Modulo = 8;
BinaryOperator.And = 9;
BinaryOperator.Or = 10;
BinaryOperator.Lower = 11;
BinaryOperator.LowerEquals = 12;
BinaryOperator.Bigger = 13;
BinaryOperator.BiggerEquals = 14;
BinaryOperator[BinaryOperator.Equals] = "Equals";
BinaryOperator[BinaryOperator.NotEquals] = "NotEquals";
BinaryOperator[BinaryOperator.Identical] = "Identical";
BinaryOperator[BinaryOperator.NotIdentical] = "NotIdentical";
BinaryOperator[BinaryOperator.Minus] = "Minus";
BinaryOperator[BinaryOperator.Plus] = "Plus";
BinaryOperator[BinaryOperator.Divide] = "Divide";
BinaryOperator[BinaryOperator.Multiply] = "Multiply";
BinaryOperator[BinaryOperator.Modulo] = "Modulo";
BinaryOperator[BinaryOperator.And] = "And";
BinaryOperator[BinaryOperator.Or] = "Or";
BinaryOperator[BinaryOperator.Lower] = "Lower";
BinaryOperator[BinaryOperator.LowerEquals] = "LowerEquals";
BinaryOperator[BinaryOperator.Bigger] = "Bigger";
BinaryOperator[BinaryOperator.BiggerEquals] = "BiggerEquals";
/**
 * @abstract
 */
var Expression = (function () {
    /**
     * @param {?} type
     * @param {?=} sourceSpan
     */
    function Expression(type, sourceSpan) {
        this.type = type || null;
        this.sourceSpan = sourceSpan || null;
    }
    /**
     * @abstract
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Expression.prototype.visitExpression = function (visitor, context) { };
    /**
     * @param {?} name
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.prop = function (name, sourceSpan) {
        return new ReadPropExpr(this, name, null, sourceSpan);
    };
    /**
     * @param {?} index
     * @param {?=} type
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.key = function (index, type, sourceSpan) {
        return new ReadKeyExpr(this, index, type, sourceSpan);
    };
    /**
     * @param {?} name
     * @param {?} params
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.callMethod = function (name, params, sourceSpan) {
        return new InvokeMethodExpr(this, name, params, null, sourceSpan);
    };
    /**
     * @param {?} params
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.callFn = function (params, sourceSpan) {
        return new InvokeFunctionExpr(this, params, null, sourceSpan);
    };
    /**
     * @param {?} params
     * @param {?=} type
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.instantiate = function (params, type, sourceSpan) {
        return new InstantiateExpr(this, params, type, sourceSpan);
    };
    /**
     * @param {?} trueCase
     * @param {?=} falseCase
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.conditional = function (trueCase, falseCase, sourceSpan) {
        if (falseCase === void 0) { falseCase = null; }
        return new ConditionalExpr(this, trueCase, falseCase, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.equals = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Equals, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.notEquals = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.NotEquals, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.identical = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Identical, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.notIdentical = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.NotIdentical, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.minus = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Minus, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.plus = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Plus, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.divide = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Divide, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.multiply = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Multiply, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.modulo = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Modulo, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.and = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.And, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.or = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Or, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.lower = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Lower, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.lowerEquals = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.LowerEquals, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.bigger = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Bigger, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.biggerEquals = function (rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.BiggerEquals, this, rhs, null, sourceSpan);
    };
    /**
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.isBlank = function (sourceSpan) {
        // Note: We use equals by purpose here to compare to null and undefined in JS.
        // We use the typed null to allow strictNullChecks to narrow types.
        return this.equals(TYPED_NULL_EXPR, sourceSpan);
    };
    /**
     * @param {?} type
     * @param {?=} sourceSpan
     * @return {?}
     */
    Expression.prototype.cast = function (type, sourceSpan) {
        return new CastExpr(this, type, sourceSpan);
    };
    /**
     * @return {?}
     */
    Expression.prototype.toStmt = function () { return new ExpressionStatement(this, null); };
    return Expression;
}());
var BuiltinVar = {};
BuiltinVar.This = 0;
BuiltinVar.Super = 1;
BuiltinVar.CatchError = 2;
BuiltinVar.CatchStack = 3;
BuiltinVar[BuiltinVar.This] = "This";
BuiltinVar[BuiltinVar.Super] = "Super";
BuiltinVar[BuiltinVar.CatchError] = "CatchError";
BuiltinVar[BuiltinVar.CatchStack] = "CatchStack";
var ReadVarExpr = (function (_super) {
    __extends(ReadVarExpr, _super);
    /**
     * @param {?} name
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function ReadVarExpr(name, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        if (typeof name === 'string') {
            _this.name = name;
            _this.builtin = null;
        }
        else {
            _this.name = null;
            _this.builtin = name;
        }
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ReadVarExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitReadVarExpr(this, context);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    ReadVarExpr.prototype.set = function (value) {
        if (!this.name) {
            throw new Error("Built in variable " + this.builtin + " can not be assigned to.");
        }
        return new WriteVarExpr(this.name, value, null, this.sourceSpan);
    };
    return ReadVarExpr;
}(Expression));
var WriteVarExpr = (function (_super) {
    __extends(WriteVarExpr, _super);
    /**
     * @param {?} name
     * @param {?} value
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function WriteVarExpr(name, value, type, sourceSpan) {
        var _this = _super.call(this, type || value.type, sourceSpan) || this;
        _this.name = name;
        _this.value = value;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    WriteVarExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitWriteVarExpr(this, context);
    };
    /**
     * @param {?=} type
     * @param {?=} modifiers
     * @return {?}
     */
    WriteVarExpr.prototype.toDeclStmt = function (type, modifiers) {
        return new DeclareVarStmt(this.name, this.value, type, modifiers, this.sourceSpan);
    };
    return WriteVarExpr;
}(Expression));
var WriteKeyExpr = (function (_super) {
    __extends(WriteKeyExpr, _super);
    /**
     * @param {?} receiver
     * @param {?} index
     * @param {?} value
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function WriteKeyExpr(receiver, index, value, type, sourceSpan) {
        var _this = _super.call(this, type || value.type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.index = index;
        _this.value = value;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    WriteKeyExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitWriteKeyExpr(this, context);
    };
    return WriteKeyExpr;
}(Expression));
var WritePropExpr = (function (_super) {
    __extends(WritePropExpr, _super);
    /**
     * @param {?} receiver
     * @param {?} name
     * @param {?} value
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function WritePropExpr(receiver, name, value, type, sourceSpan) {
        var _this = _super.call(this, type || value.type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.name = name;
        _this.value = value;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    WritePropExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitWritePropExpr(this, context);
    };
    return WritePropExpr;
}(Expression));
var BuiltinMethod = {};
BuiltinMethod.ConcatArray = 0;
BuiltinMethod.SubscribeObservable = 1;
BuiltinMethod.Bind = 2;
BuiltinMethod[BuiltinMethod.ConcatArray] = "ConcatArray";
BuiltinMethod[BuiltinMethod.SubscribeObservable] = "SubscribeObservable";
BuiltinMethod[BuiltinMethod.Bind] = "Bind";
var InvokeMethodExpr = (function (_super) {
    __extends(InvokeMethodExpr, _super);
    /**
     * @param {?} receiver
     * @param {?} method
     * @param {?} args
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function InvokeMethodExpr(receiver, method, args, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.args = args;
        if (typeof method === 'string') {
            _this.name = method;
            _this.builtin = null;
        }
        else {
            _this.name = null;
            _this.builtin = method;
        }
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    InvokeMethodExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitInvokeMethodExpr(this, context);
    };
    return InvokeMethodExpr;
}(Expression));
var InvokeFunctionExpr = (function (_super) {
    __extends(InvokeFunctionExpr, _super);
    /**
     * @param {?} fn
     * @param {?} args
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function InvokeFunctionExpr(fn, args, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.fn = fn;
        _this.args = args;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    InvokeFunctionExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitInvokeFunctionExpr(this, context);
    };
    return InvokeFunctionExpr;
}(Expression));
var InstantiateExpr = (function (_super) {
    __extends(InstantiateExpr, _super);
    /**
     * @param {?} classExpr
     * @param {?} args
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function InstantiateExpr(classExpr, args, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.classExpr = classExpr;
        _this.args = args;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    InstantiateExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitInstantiateExpr(this, context);
    };
    return InstantiateExpr;
}(Expression));
var LiteralExpr = (function (_super) {
    __extends(LiteralExpr, _super);
    /**
     * @param {?} value
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function LiteralExpr(value, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.value = value;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    LiteralExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitLiteralExpr(this, context);
    };
    return LiteralExpr;
}(Expression));
var ExternalExpr = (function (_super) {
    __extends(ExternalExpr, _super);
    /**
     * @param {?} value
     * @param {?=} type
     * @param {?=} typeParams
     * @param {?=} sourceSpan
     */
    function ExternalExpr(value, type, typeParams, sourceSpan) {
        if (typeParams === void 0) { typeParams = null; }
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.value = value;
        _this.typeParams = typeParams;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ExternalExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitExternalExpr(this, context);
    };
    return ExternalExpr;
}(Expression));
var ConditionalExpr = (function (_super) {
    __extends(ConditionalExpr, _super);
    /**
     * @param {?} condition
     * @param {?} trueCase
     * @param {?=} falseCase
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function ConditionalExpr(condition, trueCase, falseCase, type, sourceSpan) {
        if (falseCase === void 0) { falseCase = null; }
        var _this = _super.call(this, type || trueCase.type, sourceSpan) || this;
        _this.condition = condition;
        _this.falseCase = falseCase;
        _this.trueCase = trueCase;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ConditionalExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitConditionalExpr(this, context);
    };
    return ConditionalExpr;
}(Expression));
var NotExpr = (function (_super) {
    __extends(NotExpr, _super);
    /**
     * @param {?} condition
     * @param {?=} sourceSpan
     */
    function NotExpr(condition, sourceSpan) {
        var _this = _super.call(this, BOOL_TYPE, sourceSpan) || this;
        _this.condition = condition;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    NotExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitNotExpr(this, context);
    };
    return NotExpr;
}(Expression));
var CastExpr = (function (_super) {
    __extends(CastExpr, _super);
    /**
     * @param {?} value
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function CastExpr(value, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.value = value;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    CastExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitCastExpr(this, context);
    };
    return CastExpr;
}(Expression));
var FnParam = (function () {
    /**
     * @param {?} name
     * @param {?=} type
     */
    function FnParam(name, type) {
        if (type === void 0) { type = null; }
        this.name = name;
        this.type = type;
    }
    return FnParam;
}());
var FunctionExpr = (function (_super) {
    __extends(FunctionExpr, _super);
    /**
     * @param {?} params
     * @param {?} statements
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function FunctionExpr(params, statements, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.params = params;
        _this.statements = statements;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    FunctionExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitFunctionExpr(this, context);
    };
    /**
     * @param {?} name
     * @param {?=} modifiers
     * @return {?}
     */
    FunctionExpr.prototype.toDeclStmt = function (name, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        return new DeclareFunctionStmt(name, this.params, this.statements, this.type, modifiers, this.sourceSpan);
    };
    return FunctionExpr;
}(Expression));
var BinaryOperatorExpr = (function (_super) {
    __extends(BinaryOperatorExpr, _super);
    /**
     * @param {?} operator
     * @param {?} lhs
     * @param {?} rhs
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function BinaryOperatorExpr(operator, lhs, rhs, type, sourceSpan) {
        var _this = _super.call(this, type || lhs.type, sourceSpan) || this;
        _this.operator = operator;
        _this.rhs = rhs;
        _this.lhs = lhs;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    BinaryOperatorExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitBinaryOperatorExpr(this, context);
    };
    return BinaryOperatorExpr;
}(Expression));
var ReadPropExpr = (function (_super) {
    __extends(ReadPropExpr, _super);
    /**
     * @param {?} receiver
     * @param {?} name
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function ReadPropExpr(receiver, name, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.name = name;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ReadPropExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitReadPropExpr(this, context);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    ReadPropExpr.prototype.set = function (value) {
        return new WritePropExpr(this.receiver, this.name, value, null, this.sourceSpan);
    };
    return ReadPropExpr;
}(Expression));
var ReadKeyExpr = (function (_super) {
    __extends(ReadKeyExpr, _super);
    /**
     * @param {?} receiver
     * @param {?} index
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function ReadKeyExpr(receiver, index, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.receiver = receiver;
        _this.index = index;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ReadKeyExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitReadKeyExpr(this, context);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    ReadKeyExpr.prototype.set = function (value) {
        return new WriteKeyExpr(this.receiver, this.index, value, null, this.sourceSpan);
    };
    return ReadKeyExpr;
}(Expression));
var LiteralArrayExpr = (function (_super) {
    __extends(LiteralArrayExpr, _super);
    /**
     * @param {?} entries
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function LiteralArrayExpr(entries, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.entries = entries;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    LiteralArrayExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitLiteralArrayExpr(this, context);
    };
    return LiteralArrayExpr;
}(Expression));
var LiteralMapEntry = (function () {
    /**
     * @param {?} key
     * @param {?} value
     * @param {?=} quoted
     */
    function LiteralMapEntry(key, value, quoted) {
        if (quoted === void 0) { quoted = false; }
        this.key = key;
        this.value = value;
        this.quoted = quoted;
    }
    return LiteralMapEntry;
}());
var LiteralMapExpr = (function (_super) {
    __extends(LiteralMapExpr, _super);
    /**
     * @param {?} entries
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    function LiteralMapExpr(entries, type, sourceSpan) {
        var _this = _super.call(this, type, sourceSpan) || this;
        _this.entries = entries;
        _this.valueType = null;
        if (type) {
            _this.valueType = type.valueType;
        }
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    LiteralMapExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitLiteralMapExpr(this, context);
    };
    return LiteralMapExpr;
}(Expression));
var CommaExpr = (function (_super) {
    __extends(CommaExpr, _super);
    /**
     * @param {?} parts
     * @param {?=} sourceSpan
     */
    function CommaExpr(parts, sourceSpan) {
        var _this = _super.call(this, parts[parts.length - 1].type, sourceSpan) || this;
        _this.parts = parts;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    CommaExpr.prototype.visitExpression = function (visitor, context) {
        return visitor.visitCommaExpr(this, context);
    };
    return CommaExpr;
}(Expression));
var THIS_EXPR = new ReadVarExpr(BuiltinVar.This, null, null);
var SUPER_EXPR = new ReadVarExpr(BuiltinVar.Super, null, null);
var CATCH_ERROR_VAR = new ReadVarExpr(BuiltinVar.CatchError, null, null);
var CATCH_STACK_VAR = new ReadVarExpr(BuiltinVar.CatchStack, null, null);
var NULL_EXPR = new LiteralExpr(null, null, null);
var TYPED_NULL_EXPR = new LiteralExpr(null, INFERRED_TYPE, null);
var StmtModifier = {};
StmtModifier.Final = 0;
StmtModifier.Private = 1;
StmtModifier[StmtModifier.Final] = "Final";
StmtModifier[StmtModifier.Private] = "Private";
/**
 * @abstract
 */
var Statement = (function () {
    /**
     * @param {?=} modifiers
     * @param {?=} sourceSpan
     */
    function Statement(modifiers, sourceSpan) {
        this.modifiers = modifiers || [];
        this.sourceSpan = sourceSpan || null;
    }
    /**
     * @abstract
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Statement.prototype.visitStatement = function (visitor, context) { };
    /**
     * @param {?} modifier
     * @return {?}
     */
    Statement.prototype.hasModifier = function (modifier) { return ((this.modifiers)).indexOf(modifier) !== -1; };
    return Statement;
}());
var DeclareVarStmt = (function (_super) {
    __extends(DeclareVarStmt, _super);
    /**
     * @param {?} name
     * @param {?} value
     * @param {?=} type
     * @param {?=} modifiers
     * @param {?=} sourceSpan
     */
    function DeclareVarStmt(name, value, type, modifiers, sourceSpan) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers, sourceSpan) || this;
        _this.name = name;
        _this.value = value;
        _this.type = type || value.type;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    DeclareVarStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitDeclareVarStmt(this, context);
    };
    return DeclareVarStmt;
}(Statement));
var DeclareFunctionStmt = (function (_super) {
    __extends(DeclareFunctionStmt, _super);
    /**
     * @param {?} name
     * @param {?} params
     * @param {?} statements
     * @param {?=} type
     * @param {?=} modifiers
     * @param {?=} sourceSpan
     */
    function DeclareFunctionStmt(name, params, statements, type, modifiers, sourceSpan) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers, sourceSpan) || this;
        _this.name = name;
        _this.params = params;
        _this.statements = statements;
        _this.type = type || null;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    DeclareFunctionStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitDeclareFunctionStmt(this, context);
    };
    return DeclareFunctionStmt;
}(Statement));
var ExpressionStatement = (function (_super) {
    __extends(ExpressionStatement, _super);
    /**
     * @param {?} expr
     * @param {?=} sourceSpan
     */
    function ExpressionStatement(expr, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.expr = expr;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ExpressionStatement.prototype.visitStatement = function (visitor, context) {
        return visitor.visitExpressionStmt(this, context);
    };
    return ExpressionStatement;
}(Statement));
var ReturnStatement = (function (_super) {
    __extends(ReturnStatement, _super);
    /**
     * @param {?} value
     * @param {?=} sourceSpan
     */
    function ReturnStatement(value, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.value = value;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ReturnStatement.prototype.visitStatement = function (visitor, context) {
        return visitor.visitReturnStmt(this, context);
    };
    return ReturnStatement;
}(Statement));
var AbstractClassPart = (function () {
    /**
     * @param {?} type
     * @param {?} modifiers
     */
    function AbstractClassPart(type, modifiers) {
        this.modifiers = modifiers;
        if (!modifiers) {
            this.modifiers = [];
        }
        this.type = type || null;
    }
    /**
     * @param {?} modifier
     * @return {?}
     */
    AbstractClassPart.prototype.hasModifier = function (modifier) { return ((this.modifiers)).indexOf(modifier) !== -1; };
    return AbstractClassPart;
}());
var ClassField = (function (_super) {
    __extends(ClassField, _super);
    /**
     * @param {?} name
     * @param {?=} type
     * @param {?=} modifiers
     */
    function ClassField(name, type, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, type, modifiers) || this;
        _this.name = name;
        return _this;
    }
    return ClassField;
}(AbstractClassPart));
var ClassMethod = (function (_super) {
    __extends(ClassMethod, _super);
    /**
     * @param {?} name
     * @param {?} params
     * @param {?} body
     * @param {?=} type
     * @param {?=} modifiers
     */
    function ClassMethod(name, params, body, type, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, type, modifiers) || this;
        _this.name = name;
        _this.params = params;
        _this.body = body;
        return _this;
    }
    return ClassMethod;
}(AbstractClassPart));
var ClassGetter = (function (_super) {
    __extends(ClassGetter, _super);
    /**
     * @param {?} name
     * @param {?} body
     * @param {?=} type
     * @param {?=} modifiers
     */
    function ClassGetter(name, body, type, modifiers) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, type, modifiers) || this;
        _this.name = name;
        _this.body = body;
        return _this;
    }
    return ClassGetter;
}(AbstractClassPart));
var ClassStmt = (function (_super) {
    __extends(ClassStmt, _super);
    /**
     * @param {?} name
     * @param {?} parent
     * @param {?} fields
     * @param {?} getters
     * @param {?} constructorMethod
     * @param {?} methods
     * @param {?=} modifiers
     * @param {?=} sourceSpan
     */
    function ClassStmt(name, parent, fields, getters, constructorMethod, methods, modifiers, sourceSpan) {
        if (modifiers === void 0) { modifiers = null; }
        var _this = _super.call(this, modifiers, sourceSpan) || this;
        _this.name = name;
        _this.parent = parent;
        _this.fields = fields;
        _this.getters = getters;
        _this.constructorMethod = constructorMethod;
        _this.methods = methods;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ClassStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitDeclareClassStmt(this, context);
    };
    return ClassStmt;
}(Statement));
var IfStmt = (function (_super) {
    __extends(IfStmt, _super);
    /**
     * @param {?} condition
     * @param {?} trueCase
     * @param {?=} falseCase
     * @param {?=} sourceSpan
     */
    function IfStmt(condition, trueCase, falseCase, sourceSpan) {
        if (falseCase === void 0) { falseCase = []; }
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.condition = condition;
        _this.trueCase = trueCase;
        _this.falseCase = falseCase;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    IfStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitIfStmt(this, context);
    };
    return IfStmt;
}(Statement));
var TryCatchStmt = (function (_super) {
    __extends(TryCatchStmt, _super);
    /**
     * @param {?} bodyStmts
     * @param {?} catchStmts
     * @param {?=} sourceSpan
     */
    function TryCatchStmt(bodyStmts, catchStmts, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.bodyStmts = bodyStmts;
        _this.catchStmts = catchStmts;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    TryCatchStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitTryCatchStmt(this, context);
    };
    return TryCatchStmt;
}(Statement));
var ThrowStmt = (function (_super) {
    __extends(ThrowStmt, _super);
    /**
     * @param {?} error
     * @param {?=} sourceSpan
     */
    function ThrowStmt(error, sourceSpan) {
        var _this = _super.call(this, null, sourceSpan) || this;
        _this.error = error;
        return _this;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ThrowStmt.prototype.visitStatement = function (visitor, context) {
        return visitor.visitThrowStmt(this, context);
    };
    return ThrowStmt;
}(Statement));
var AstTransformer$1 = (function () {
    function AstTransformer$1() {
    }
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.transformExpr = function (expr, context) { return expr; };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.transformStmt = function (stmt, context) { return stmt; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitReadVarExpr = function (ast, context) { return this.transformExpr(ast, context); };
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitWriteVarExpr = function (expr, context) {
        return this.transformExpr(new WriteVarExpr(expr.name, expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
    };
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitWriteKeyExpr = function (expr, context) {
        return this.transformExpr(new WriteKeyExpr(expr.receiver.visitExpression(this, context), expr.index.visitExpression(this, context), expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
    };
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitWritePropExpr = function (expr, context) {
        return this.transformExpr(new WritePropExpr(expr.receiver.visitExpression(this, context), expr.name, expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitInvokeMethodExpr = function (ast, context) {
        var /** @type {?} */ method = ast.builtin || ast.name;
        return this.transformExpr(new InvokeMethodExpr(ast.receiver.visitExpression(this, context), /** @type {?} */ ((method)), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitInvokeFunctionExpr = function (ast, context) {
        return this.transformExpr(new InvokeFunctionExpr(ast.fn.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitInstantiateExpr = function (ast, context) {
        return this.transformExpr(new InstantiateExpr(ast.classExpr.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitLiteralExpr = function (ast, context) { return this.transformExpr(ast, context); };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitExternalExpr = function (ast, context) {
        return this.transformExpr(ast, context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitConditionalExpr = function (ast, context) {
        return this.transformExpr(new ConditionalExpr(ast.condition.visitExpression(this, context), ast.trueCase.visitExpression(this, context), /** @type {?} */ ((ast.falseCase)).visitExpression(this, context), ast.type, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitNotExpr = function (ast, context) {
        return this.transformExpr(new NotExpr(ast.condition.visitExpression(this, context), ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitCastExpr = function (ast, context) {
        return this.transformExpr(new CastExpr(ast.value.visitExpression(this, context), ast.type, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitFunctionExpr = function (ast, context) {
        return this.transformExpr(new FunctionExpr(ast.params, this.visitAllStatements(ast.statements, context), ast.type, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitBinaryOperatorExpr = function (ast, context) {
        return this.transformExpr(new BinaryOperatorExpr(ast.operator, ast.lhs.visitExpression(this, context), ast.rhs.visitExpression(this, context), ast.type, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitReadPropExpr = function (ast, context) {
        return this.transformExpr(new ReadPropExpr(ast.receiver.visitExpression(this, context), ast.name, ast.type, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitReadKeyExpr = function (ast, context) {
        return this.transformExpr(new ReadKeyExpr(ast.receiver.visitExpression(this, context), ast.index.visitExpression(this, context), ast.type, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitLiteralArrayExpr = function (ast, context) {
        return this.transformExpr(new LiteralArrayExpr(this.visitAllExpressions(ast.entries, context), ast.type, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitLiteralMapExpr = function (ast, context) {
        var _this = this;
        var /** @type {?} */ entries = ast.entries.map(function (entry) { return new LiteralMapEntry(entry.key, entry.value.visitExpression(_this, context), entry.quoted); });
        var /** @type {?} */ mapType = new MapType(ast.valueType, null);
        return this.transformExpr(new LiteralMapExpr(entries, mapType, ast.sourceSpan), context);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitCommaExpr = function (ast, context) {
        return this.transformExpr(new CommaExpr(this.visitAllExpressions(ast.parts, context), ast.sourceSpan), context);
    };
    /**
     * @param {?} exprs
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitAllExpressions = function (exprs, context) {
        var _this = this;
        return exprs.map(function (expr) { return expr.visitExpression(_this, context); });
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitDeclareVarStmt = function (stmt, context) {
        return this.transformStmt(new DeclareVarStmt(stmt.name, stmt.value.visitExpression(this, context), stmt.type, stmt.modifiers, stmt.sourceSpan), context);
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitDeclareFunctionStmt = function (stmt, context) {
        return this.transformStmt(new DeclareFunctionStmt(stmt.name, stmt.params, this.visitAllStatements(stmt.statements, context), stmt.type, stmt.modifiers, stmt.sourceSpan), context);
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitExpressionStmt = function (stmt, context) {
        return this.transformStmt(new ExpressionStatement(stmt.expr.visitExpression(this, context), stmt.sourceSpan), context);
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitReturnStmt = function (stmt, context) {
        return this.transformStmt(new ReturnStatement(stmt.value.visitExpression(this, context), stmt.sourceSpan), context);
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitDeclareClassStmt = function (stmt, context) {
        var _this = this;
        var /** @type {?} */ parent = ((stmt.parent)).visitExpression(this, context);
        var /** @type {?} */ getters = stmt.getters.map(function (getter) { return new ClassGetter(getter.name, _this.visitAllStatements(getter.body, context), getter.type, getter.modifiers); });
        var /** @type {?} */ ctorMethod = stmt.constructorMethod &&
            new ClassMethod(stmt.constructorMethod.name, stmt.constructorMethod.params, this.visitAllStatements(stmt.constructorMethod.body, context), stmt.constructorMethod.type, stmt.constructorMethod.modifiers);
        var /** @type {?} */ methods = stmt.methods.map(function (method) { return new ClassMethod(method.name, method.params, _this.visitAllStatements(method.body, context), method.type, method.modifiers); });
        return this.transformStmt(new ClassStmt(stmt.name, parent, stmt.fields, getters, ctorMethod, methods, stmt.modifiers, stmt.sourceSpan), context);
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitIfStmt = function (stmt, context) {
        return this.transformStmt(new IfStmt(stmt.condition.visitExpression(this, context), this.visitAllStatements(stmt.trueCase, context), this.visitAllStatements(stmt.falseCase, context), stmt.sourceSpan), context);
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitTryCatchStmt = function (stmt, context) {
        return this.transformStmt(new TryCatchStmt(this.visitAllStatements(stmt.bodyStmts, context), this.visitAllStatements(stmt.catchStmts, context), stmt.sourceSpan), context);
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitThrowStmt = function (stmt, context) {
        return this.transformStmt(new ThrowStmt(stmt.error.visitExpression(this, context), stmt.sourceSpan), context);
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitCommentStmt = function (stmt, context) {
        return this.transformStmt(stmt, context);
    };
    /**
     * @param {?} stmts
     * @param {?} context
     * @return {?}
     */
    AstTransformer$1.prototype.visitAllStatements = function (stmts, context) {
        var _this = this;
        return stmts.map(function (stmt) { return stmt.visitStatement(_this, context); });
    };
    return AstTransformer$1;
}());
var RecursiveAstVisitor$1 = (function () {
    function RecursiveAstVisitor$1() {
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitReadVarExpr = function (ast, context) { return ast; };
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitWriteVarExpr = function (expr, context) {
        expr.value.visitExpression(this, context);
        return expr;
    };
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitWriteKeyExpr = function (expr, context) {
        expr.receiver.visitExpression(this, context);
        expr.index.visitExpression(this, context);
        expr.value.visitExpression(this, context);
        return expr;
    };
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitWritePropExpr = function (expr, context) {
        expr.receiver.visitExpression(this, context);
        expr.value.visitExpression(this, context);
        return expr;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitInvokeMethodExpr = function (ast, context) {
        ast.receiver.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitInvokeFunctionExpr = function (ast, context) {
        ast.fn.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitInstantiateExpr = function (ast, context) {
        ast.classExpr.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitLiteralExpr = function (ast, context) { return ast; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitExternalExpr = function (ast, context) { return ast; };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitConditionalExpr = function (ast, context) {
        ast.condition.visitExpression(this, context);
        ast.trueCase.visitExpression(this, context); /** @type {?} */
        ((ast.falseCase)).visitExpression(this, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitNotExpr = function (ast, context) {
        ast.condition.visitExpression(this, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitCastExpr = function (ast, context) {
        ast.value.visitExpression(this, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitFunctionExpr = function (ast, context) {
        this.visitAllStatements(ast.statements, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitBinaryOperatorExpr = function (ast, context) {
        ast.lhs.visitExpression(this, context);
        ast.rhs.visitExpression(this, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitReadPropExpr = function (ast, context) {
        ast.receiver.visitExpression(this, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitReadKeyExpr = function (ast, context) {
        ast.receiver.visitExpression(this, context);
        ast.index.visitExpression(this, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitLiteralArrayExpr = function (ast, context) {
        this.visitAllExpressions(ast.entries, context);
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitLiteralMapExpr = function (ast, context) {
        var _this = this;
        ast.entries.forEach(function (entry) { return entry.value.visitExpression(_this, context); });
        return ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitCommaExpr = function (ast, context) {
        this.visitAllExpressions(ast.parts, context);
    };
    /**
     * @param {?} exprs
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitAllExpressions = function (exprs, context) {
        var _this = this;
        exprs.forEach(function (expr) { return expr.visitExpression(_this, context); });
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitDeclareVarStmt = function (stmt, context) {
        stmt.value.visitExpression(this, context);
        return stmt;
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitDeclareFunctionStmt = function (stmt, context) {
        this.visitAllStatements(stmt.statements, context);
        return stmt;
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitExpressionStmt = function (stmt, context) {
        stmt.expr.visitExpression(this, context);
        return stmt;
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitReturnStmt = function (stmt, context) {
        stmt.value.visitExpression(this, context);
        return stmt;
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitDeclareClassStmt = function (stmt, context) {
        var _this = this;
        ((stmt.parent)).visitExpression(this, context);
        stmt.getters.forEach(function (getter) { return _this.visitAllStatements(getter.body, context); });
        if (stmt.constructorMethod) {
            this.visitAllStatements(stmt.constructorMethod.body, context);
        }
        stmt.methods.forEach(function (method) { return _this.visitAllStatements(method.body, context); });
        return stmt;
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitIfStmt = function (stmt, context) {
        stmt.condition.visitExpression(this, context);
        this.visitAllStatements(stmt.trueCase, context);
        this.visitAllStatements(stmt.falseCase, context);
        return stmt;
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitTryCatchStmt = function (stmt, context) {
        this.visitAllStatements(stmt.bodyStmts, context);
        this.visitAllStatements(stmt.catchStmts, context);
        return stmt;
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitThrowStmt = function (stmt, context) {
        stmt.error.visitExpression(this, context);
        return stmt;
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitCommentStmt = function (stmt, context) { return stmt; };
    /**
     * @param {?} stmts
     * @param {?} context
     * @return {?}
     */
    RecursiveAstVisitor$1.prototype.visitAllStatements = function (stmts, context) {
        var _this = this;
        stmts.forEach(function (stmt) { return stmt.visitStatement(_this, context); });
    };
    return RecursiveAstVisitor$1;
}());
/**
 * @param {?} stmts
 * @return {?}
 */
function findReadVarNames(stmts) {
    var /** @type {?} */ visitor = new _ReadVarVisitor();
    visitor.visitAllStatements(stmts, null);
    return visitor.varNames;
}
var _ReadVarVisitor = (function (_super) {
    __extends(_ReadVarVisitor, _super);
    function _ReadVarVisitor() {
        var _this = _super.apply(this, arguments) || this;
        _this.varNames = new Set();
        return _this;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    _ReadVarVisitor.prototype.visitDeclareFunctionStmt = function (stmt, context) {
        // Don't descend into nested functions
        return stmt;
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    _ReadVarVisitor.prototype.visitDeclareClassStmt = function (stmt, context) {
        // Don't descend into nested classes
        return stmt;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    _ReadVarVisitor.prototype.visitReadVarExpr = function (ast, context) {
        if (ast.name) {
            this.varNames.add(ast.name);
        }
        return null;
    };
    return _ReadVarVisitor;
}(RecursiveAstVisitor$1));
/**
 * @param {?} stmt
 * @param {?} sourceSpan
 * @return {?}
 */
function applySourceSpanToStatementIfNeeded(stmt, sourceSpan) {
    if (!sourceSpan) {
        return stmt;
    }
    var /** @type {?} */ transformer = new _ApplySourceSpanTransformer(sourceSpan);
    return stmt.visitStatement(transformer, null);
}
/**
 * @param {?} expr
 * @param {?} sourceSpan
 * @return {?}
 */
function applySourceSpanToExpressionIfNeeded(expr, sourceSpan) {
    if (!sourceSpan) {
        return expr;
    }
    var /** @type {?} */ transformer = new _ApplySourceSpanTransformer(sourceSpan);
    return expr.visitExpression(transformer, null);
}
var _ApplySourceSpanTransformer = (function (_super) {
    __extends(_ApplySourceSpanTransformer, _super);
    /**
     * @param {?} sourceSpan
     */
    function _ApplySourceSpanTransformer(sourceSpan) {
        var _this = _super.call(this) || this;
        _this.sourceSpan = sourceSpan;
        return _this;
    }
    /**
     * @param {?} obj
     * @return {?}
     */
    _ApplySourceSpanTransformer.prototype._clone = function (obj) {
        var /** @type {?} */ clone = Object.create(obj.constructor.prototype);
        for (var /** @type {?} */ prop in obj) {
            clone[prop] = obj[prop];
        }
        return clone;
    };
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    _ApplySourceSpanTransformer.prototype.transformExpr = function (expr, context) {
        if (!expr.sourceSpan) {
            expr = this._clone(expr);
            expr.sourceSpan = this.sourceSpan;
        }
        return expr;
    };
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    _ApplySourceSpanTransformer.prototype.transformStmt = function (stmt, context) {
        if (!stmt.sourceSpan) {
            stmt = this._clone(stmt);
            stmt.sourceSpan = this.sourceSpan;
        }
        return stmt;
    };
    return _ApplySourceSpanTransformer;
}(AstTransformer$1));
/**
 * @param {?} name
 * @param {?=} type
 * @param {?=} sourceSpan
 * @return {?}
 */
function variable(name, type, sourceSpan) {
    return new ReadVarExpr(name, type, sourceSpan);
}
/**
 * @param {?} id
 * @param {?=} typeParams
 * @param {?=} sourceSpan
 * @return {?}
 */
function importExpr(id, typeParams, sourceSpan) {
    if (typeParams === void 0) { typeParams = null; }
    return new ExternalExpr(id, null, typeParams, sourceSpan);
}
/**
 * @param {?} id
 * @param {?=} typeParams
 * @param {?=} typeModifiers
 * @return {?}
 */
function importType(id, typeParams, typeModifiers) {
    if (typeParams === void 0) { typeParams = null; }
    if (typeModifiers === void 0) { typeModifiers = null; }
    return id != null ? expressionType(importExpr(id, typeParams, null), typeModifiers) : null;
}
/**
 * @param {?} expr
 * @param {?=} typeModifiers
 * @return {?}
 */
function expressionType(expr, typeModifiers) {
    if (typeModifiers === void 0) { typeModifiers = null; }
    return expr != null ? ((new ExpressionType(expr, typeModifiers))) : null;
}
/**
 * @param {?} values
 * @param {?=} type
 * @param {?=} sourceSpan
 * @return {?}
 */
function literalArr(values, type, sourceSpan) {
    return new LiteralArrayExpr(values, type, sourceSpan);
}
/**
 * @param {?} values
 * @param {?=} type
 * @param {?=} quoted
 * @return {?}
 */
function literalMap(values, type, quoted) {
    if (type === void 0) { type = null; }
    if (quoted === void 0) { quoted = false; }
    return new LiteralMapExpr(values.map(function (entry) { return new LiteralMapEntry(entry[0], entry[1], quoted); }), type, null);
}
/**
 * @param {?} expr
 * @param {?=} sourceSpan
 * @return {?}
 */
function not(expr, sourceSpan) {
    return new NotExpr(expr, sourceSpan);
}
/**
 * @param {?} params
 * @param {?} body
 * @param {?=} type
 * @param {?=} sourceSpan
 * @return {?}
 */
function fn(params, body, type, sourceSpan) {
    return new FunctionExpr(params, body, type, sourceSpan);
}
/**
 * @param {?} value
 * @param {?=} type
 * @param {?=} sourceSpan
 * @return {?}
 */
function literal(value, type, sourceSpan) {
    return new LiteralExpr(value, type, sourceSpan);
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Create a new class stmts based on the given data.
 * @param {?} config
 * @return {?}
 */
function createClassStmt(config) {
    var /** @type {?} */ parentArgs = config.parentArgs || [];
    var /** @type {?} */ superCtorStmts = config.parent ? [SUPER_EXPR.callFn(parentArgs).toStmt()] : [];
    var /** @type {?} */ builder = concatClassBuilderParts(Array.isArray(config.builders) ? config.builders : [config.builders]);
    var /** @type {?} */ ctor = new ClassMethod(null, config.ctorParams || [], superCtorStmts.concat(builder.ctorStmts));
    return new ClassStmt(config.name, config.parent || null, builder.fields, builder.getters, ctor, builder.methods, config.modifiers || [], config.sourceSpan);
}
/**
 * @param {?} builders
 * @return {?}
 */
function concatClassBuilderParts(builders) {
    return {
        fields: [].concat.apply([], ((builders.map((function (builder) { return builder.fields || []; }))))),
        methods: [].concat.apply([], ((builders.map(function (builder) { return builder.methods || []; })))),
        getters: [].concat.apply([], ((builders.map(function (builder) { return builder.getters || []; })))),
        ctorStmts: [].concat.apply([], ((builders.map(function (builder) { return builder.ctorStmts || []; })))),
    };
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var QUOTED_KEYS = '$quoted$';
/**
 * @param {?} value
 * @param {?=} type
 * @return {?}
 */
function convertValueToOutputAst(value, type) {
    if (type === void 0) { type = null; }
    return visitValue(value, new _ValueOutputAstTransformer(), type);
}
var _ValueOutputAstTransformer = (function () {
    function _ValueOutputAstTransformer() {
    }
    /**
     * @param {?} arr
     * @param {?} type
     * @return {?}
     */
    _ValueOutputAstTransformer.prototype.visitArray = function (arr, type) {
        var _this = this;
        return literalArr(arr.map(function (value) { return visitValue(value, _this, null); }), type);
    };
    /**
     * @param {?} map
     * @param {?} type
     * @return {?}
     */
    _ValueOutputAstTransformer.prototype.visitStringMap = function (map, type) {
        var _this = this;
        var /** @type {?} */ entries = [];
        var /** @type {?} */ quotedSet = new Set(map && map[QUOTED_KEYS]);
        Object.keys(map).forEach(function (key) {
            entries.push(new LiteralMapEntry(key, visitValue(map[key], _this, null), quotedSet.has(key)));
        });
        return new LiteralMapExpr(entries, type);
    };
    /**
     * @param {?} value
     * @param {?} type
     * @return {?}
     */
    _ValueOutputAstTransformer.prototype.visitPrimitive = function (value, type) { return literal(value, type); };
    /**
     * @param {?} value
     * @param {?} type
     * @return {?}
     */
    _ValueOutputAstTransformer.prototype.visitOther = function (value, type) {
        if (value instanceof Expression) {
            return value;
        }
        else {
            return importExpr({ reference: value });
        }
    };
    return _ValueOutputAstTransformer;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * This is currently not read, but will probably be used in the future.
 * We keep it as we already pass it through all the rigth places...
 */
var ComponentFactoryDependency = (function () {
    /**
     * @param {?} compType
     */
    function ComponentFactoryDependency(compType) {
        this.compType = compType;
    }
    return ComponentFactoryDependency;
}());
var NgModuleCompileResult = (function () {
    /**
     * @param {?} statements
     * @param {?} ngModuleFactoryVar
     * @param {?} dependencies
     */
    function NgModuleCompileResult(statements, ngModuleFactoryVar, dependencies) {
        this.statements = statements;
        this.ngModuleFactoryVar = ngModuleFactoryVar;
        this.dependencies = dependencies;
    }
    return NgModuleCompileResult;
}());
var NgModuleCompiler = (function () {
    function NgModuleCompiler() {
    }
    /**
     * @param {?} ngModuleMeta
     * @param {?} extraProviders
     * @return {?}
     */
    NgModuleCompiler.prototype.compile = function (ngModuleMeta, extraProviders) {
        var /** @type {?} */ sourceSpan = typeSourceSpan('NgModule', ngModuleMeta.type);
        var /** @type {?} */ deps = [];
        var /** @type {?} */ bootstrapComponentFactories = [];
        var /** @type {?} */ entryComponentFactories = ngModuleMeta.transitiveModule.entryComponents.map(function (entryComponent) {
            if (ngModuleMeta.bootstrapComponents.some(function (id) { return id.reference === entryComponent.componentType; })) {
                bootstrapComponentFactories.push({ reference: entryComponent.componentFactory });
            }
            deps.push(new ComponentFactoryDependency(entryComponent.componentType));
            return { reference: entryComponent.componentFactory };
        });
        var /** @type {?} */ builder = new _InjectorBuilder(ngModuleMeta, entryComponentFactories, bootstrapComponentFactories, sourceSpan);
        var /** @type {?} */ providerParser = new NgModuleProviderAnalyzer(ngModuleMeta, extraProviders, sourceSpan);
        providerParser.parse().forEach(function (provider) { return builder.addProvider(provider); });
        var /** @type {?} */ injectorClass = builder.build();
        var /** @type {?} */ ngModuleFactoryVar = identifierName(ngModuleMeta.type) + "NgFactory";
        var /** @type {?} */ ngModuleFactoryStmt = variable(ngModuleFactoryVar)
            .set(importExpr(createIdentifier(Identifiers.NgModuleFactory))
            .instantiate([variable(injectorClass.name), importExpr(ngModuleMeta.type)], importType(createIdentifier(Identifiers.NgModuleFactory), [/** @type {?} */ ((importType(ngModuleMeta.type)))], [TypeModifier.Const])))
            .toDeclStmt(null, [StmtModifier.Final]);
        var /** @type {?} */ stmts = [injectorClass, ngModuleFactoryStmt];
        if (ngModuleMeta.id) {
            var /** @type {?} */ registerFactoryStmt = importExpr(createIdentifier(Identifiers.RegisterModuleFactoryFn))
                .callFn([literal(ngModuleMeta.id), variable(ngModuleFactoryVar)])
                .toStmt();
            stmts.push(registerFactoryStmt);
        }
        return new NgModuleCompileResult(stmts, ngModuleFactoryVar, deps);
    };
    return NgModuleCompiler;
}());
NgModuleCompiler.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
NgModuleCompiler.ctorParameters = function () { return []; };
var _InjectorBuilder = (function () {
    /**
     * @param {?} _ngModuleMeta
     * @param {?} _entryComponentFactories
     * @param {?} _bootstrapComponentFactories
     * @param {?} _sourceSpan
     */
    function _InjectorBuilder(_ngModuleMeta, _entryComponentFactories, _bootstrapComponentFactories, _sourceSpan) {
        this._ngModuleMeta = _ngModuleMeta;
        this._entryComponentFactories = _entryComponentFactories;
        this._bootstrapComponentFactories = _bootstrapComponentFactories;
        this._sourceSpan = _sourceSpan;
        this.fields = [];
        this.getters = [];
        this.methods = [];
        this.ctorStmts = [];
        this._lazyProps = new Map();
        this._tokens = [];
        this._instances = new Map();
        this._createStmts = [];
        this._destroyStmts = [];
    }
    /**
     * @param {?} resolvedProvider
     * @return {?}
     */
    _InjectorBuilder.prototype.addProvider = function (resolvedProvider) {
        var _this = this;
        var /** @type {?} */ providerValueExpressions = resolvedProvider.providers.map(function (provider) { return _this._getProviderValue(provider); });
        var /** @type {?} */ propName = "_" + tokenName(resolvedProvider.token) + "_" + this._instances.size;
        var /** @type {?} */ instance = this._createProviderProperty(propName, resolvedProvider, providerValueExpressions, resolvedProvider.multiProvider, resolvedProvider.eager);
        if (resolvedProvider.lifecycleHooks.indexOf(ɵLifecycleHooks.OnDestroy) !== -1) {
            var /** @type {?} */ callNgOnDestroy = instance.callMethod('ngOnDestroy', []);
            if (!resolvedProvider.eager) {
                callNgOnDestroy = ((this._lazyProps.get(instance.name))).and(callNgOnDestroy);
            }
            this._destroyStmts.push(callNgOnDestroy.toStmt());
        }
        this._tokens.push(resolvedProvider.token);
        this._instances.set(tokenReference(resolvedProvider.token), instance);
    };
    /**
     * @return {?}
     */
    _InjectorBuilder.prototype.build = function () {
        var _this = this;
        var /** @type {?} */ getMethodStmts = this._tokens.map(function (token) {
            var /** @type {?} */ providerExpr = ((_this._instances.get(tokenReference(token))));
            return new IfStmt(InjectMethodVars.token.identical(createDiTokenExpression(token)), [new ReturnStatement(providerExpr)]);
        });
        var /** @type {?} */ methods = [
            new ClassMethod('createInternal', [], this._createStmts.concat(new ReturnStatement(/** @type {?} */ ((this._instances.get(this._ngModuleMeta.type.reference))))), importType(this._ngModuleMeta.type)),
            new ClassMethod('getInternal', [
                new FnParam(/** @type {?} */ ((InjectMethodVars.token.name)), DYNAMIC_TYPE),
                new FnParam(/** @type {?} */ ((InjectMethodVars.notFoundResult.name)), DYNAMIC_TYPE)
            ], getMethodStmts.concat([new ReturnStatement(InjectMethodVars.notFoundResult)]), DYNAMIC_TYPE),
            new ClassMethod('destroyInternal', [], this._destroyStmts),
        ];
        var /** @type {?} */ parentArgs = [
            variable(InjectorProps.parent.name),
            literalArr(this._entryComponentFactories.map(function (componentFactory) { return importExpr(componentFactory); })),
            literalArr(this._bootstrapComponentFactories.map(function (componentFactory) { return importExpr(componentFactory); }))
        ];
        var /** @type {?} */ injClassName = identifierName(this._ngModuleMeta.type) + "Injector";
        return createClassStmt({
            name: injClassName,
            ctorParams: [new FnParam(InjectorProps.parent.name, importType(createIdentifier(Identifiers.Injector)))],
            parent: importExpr(createIdentifier(Identifiers.NgModuleInjector), [/** @type {?} */ ((importType(this._ngModuleMeta.type)))]),
            parentArgs: parentArgs,
            builders: [{ methods: methods }, this]
        });
    };
    /**
     * @param {?} provider
     * @return {?}
     */
    _InjectorBuilder.prototype._getProviderValue = function (provider) {
        var _this = this;
        var /** @type {?} */ result;
        if (provider.useExisting != null) {
            result = this._getDependency({ token: provider.useExisting });
        }
        else if (provider.useFactory != null) {
            var /** @type {?} */ deps = provider.deps || provider.useFactory.diDeps;
            var /** @type {?} */ depsExpr = deps.map(function (dep) { return _this._getDependency(dep); });
            result = importExpr(provider.useFactory).callFn(depsExpr);
        }
        else if (provider.useClass != null) {
            var /** @type {?} */ deps = provider.deps || provider.useClass.diDeps;
            var /** @type {?} */ depsExpr = deps.map(function (dep) { return _this._getDependency(dep); });
            result =
                importExpr(provider.useClass).instantiate(depsExpr, importType(provider.useClass));
        }
        else {
            result = convertValueToOutputAst(provider.useValue);
        }
        return result;
    };
    /**
     * @param {?} propName
     * @param {?} provider
     * @param {?} providerValueExpressions
     * @param {?} isMulti
     * @param {?} isEager
     * @return {?}
     */
    _InjectorBuilder.prototype._createProviderProperty = function (propName, provider, providerValueExpressions, isMulti, isEager) {
        var /** @type {?} */ resolvedProviderValueExpr;
        var /** @type {?} */ type;
        if (isMulti) {
            resolvedProviderValueExpr = literalArr(providerValueExpressions);
            type = new ArrayType(DYNAMIC_TYPE);
        }
        else {
            resolvedProviderValueExpr = providerValueExpressions[0];
            type = ((providerValueExpressions[0].type));
        }
        if (!type) {
            type = DYNAMIC_TYPE;
        }
        if (isEager) {
            this.fields.push(new ClassField(propName, type));
            this._createStmts.push(THIS_EXPR.prop(propName).set(resolvedProviderValueExpr).toStmt());
        }
        else {
            var /** @type {?} */ internalFieldProp = THIS_EXPR.prop("_" + propName);
            this.fields.push(new ClassField(internalFieldProp.name, type));
            // Note: Equals is important for JS so that it also checks the undefined case!
            var /** @type {?} */ getterStmts = [
                new IfStmt(internalFieldProp.isBlank(), [internalFieldProp.set(resolvedProviderValueExpr).toStmt()]),
                new ReturnStatement(internalFieldProp)
            ];
            this.getters.push(new ClassGetter(propName, getterStmts, type));
            this._lazyProps.set(propName, internalFieldProp);
        }
        return THIS_EXPR.prop(propName);
    };
    /**
     * @param {?} dep
     * @return {?}
     */
    _InjectorBuilder.prototype._getDependency = function (dep) {
        var /** @type {?} */ result = ((null));
        if (dep.isValue) {
            result = literal(dep.value);
        }
        if (!dep.isSkipSelf) {
            if (dep.token) {
                if (tokenReference(dep.token) === resolveIdentifier(Identifiers.Injector)) {
                    result = THIS_EXPR;
                }
                else if (tokenReference(dep.token) === resolveIdentifier(Identifiers.ComponentFactoryResolver)) {
                    result = THIS_EXPR.prop('componentFactoryResolver');
                }
            }
            if (!result) {
                result = ((this._instances.get(tokenReference(/** @type {?} */ ((dep.token))))));
            }
        }
        if (!result) {
            var /** @type {?} */ args = [createDiTokenExpression(/** @type {?} */ ((dep.token)))];
            if (dep.isOptional) {
                args.push(NULL_EXPR);
            }
            result = InjectorProps.parent.callMethod('get', args);
        }
        return result;
    };
    return _InjectorBuilder;
}());
/**
 * @param {?} token
 * @return {?}
 */
function createDiTokenExpression(token) {
    if (token.value != null) {
        return literal(token.value);
    }
    else {
        return importExpr(/** @type {?} */ ((token.identifier)));
    }
}
var InjectorProps = (function () {
    function InjectorProps() {
    }
    return InjectorProps;
}());
InjectorProps.parent = THIS_EXPR.prop('parent');
var InjectMethodVars = (function () {
    function InjectMethodVars() {
    }
    return InjectMethodVars;
}());
InjectMethodVars.token = variable('token');
InjectMethodVars.notFoundResult = variable('notFoundResult');
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit
var VERSION$1 = 3;
var JS_B64_PREFIX = '# sourceMappingURL=data:application/json;base64,';
var SourceMapGenerator = (function () {
    /**
     * @param {?=} file
     */
    function SourceMapGenerator(file) {
        if (file === void 0) { file = null; }
        this.file = file;
        this.sourcesContent = new Map();
        this.lines = [];
        this.lastCol0 = 0;
        this.hasMappings = false;
    }
    /**
     * @param {?} url
     * @param {?=} content
     * @return {?}
     */
    SourceMapGenerator.prototype.addSource = function (url, content) {
        if (content === void 0) { content = null; }
        if (!this.sourcesContent.has(url)) {
            this.sourcesContent.set(url, content);
        }
        return this;
    };
    /**
     * @return {?}
     */
    SourceMapGenerator.prototype.addLine = function () {
        this.lines.push([]);
        this.lastCol0 = 0;
        return this;
    };
    /**
     * @param {?} col0
     * @param {?=} sourceUrl
     * @param {?=} sourceLine0
     * @param {?=} sourceCol0
     * @return {?}
     */
    SourceMapGenerator.prototype.addMapping = function (col0, sourceUrl, sourceLine0, sourceCol0) {
        if (!this.currentLine) {
            throw new Error("A line must be added before mappings can be added");
        }
        if (sourceUrl != null && !this.sourcesContent.has(sourceUrl)) {
            throw new Error("Unknown source file \"" + sourceUrl + "\"");
        }
        if (col0 == null) {
            throw new Error("The column in the generated code must be provided");
        }
        if (col0 < this.lastCol0) {
            throw new Error("Mapping should be added in output order");
        }
        if (sourceUrl && (sourceLine0 == null || sourceCol0 == null)) {
            throw new Error("The source location must be provided when a source url is provided");
        }
        this.hasMappings = true;
        this.lastCol0 = col0;
        this.currentLine.push({ col0: col0, sourceUrl: sourceUrl, sourceLine0: sourceLine0, sourceCol0: sourceCol0 });
        return this;
    };
    Object.defineProperty(SourceMapGenerator.prototype, "currentLine", {
        /**
         * @return {?}
         */
        get: function () { return this.lines.slice(-1)[0]; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    SourceMapGenerator.prototype.toJSON = function () {
        var _this = this;
        if (!this.hasMappings) {
            return null;
        }
        var /** @type {?} */ sourcesIndex = new Map();
        var /** @type {?} */ sources = [];
        var /** @type {?} */ sourcesContent = [];
        Array.from(this.sourcesContent.keys()).forEach(function (url, i) {
            sourcesIndex.set(url, i);
            sources.push(url);
            sourcesContent.push(_this.sourcesContent.get(url) || null);
        });
        var /** @type {?} */ mappings = '';
        var /** @type {?} */ lastCol0 = 0;
        var /** @type {?} */ lastSourceIndex = 0;
        var /** @type {?} */ lastSourceLine0 = 0;
        var /** @type {?} */ lastSourceCol0 = 0;
        this.lines.forEach(function (segments) {
            lastCol0 = 0;
            mappings += segments
                .map(function (segment) {
                // zero-based starting column of the line in the generated code
                var /** @type {?} */ segAsStr = toBase64VLQ(segment.col0 - lastCol0);
                lastCol0 = segment.col0;
                if (segment.sourceUrl != null) {
                    // zero-based index into the “sources” list
                    segAsStr +=
                        toBase64VLQ(/** @type {?} */ ((sourcesIndex.get(segment.sourceUrl))) - lastSourceIndex);
                    lastSourceIndex = ((sourcesIndex.get(segment.sourceUrl)));
                    // the zero-based starting line in the original source
                    segAsStr += toBase64VLQ(/** @type {?} */ ((segment.sourceLine0)) - lastSourceLine0);
                    lastSourceLine0 = ((segment.sourceLine0));
                    // the zero-based starting column in the original source
                    segAsStr += toBase64VLQ(/** @type {?} */ ((segment.sourceCol0)) - lastSourceCol0);
                    lastSourceCol0 = ((segment.sourceCol0));
                }
                return segAsStr;
            })
                .join(',');
            mappings += ';';
        });
        mappings = mappings.slice(0, -1);
        return {
            'file': this.file || '',
            'version': VERSION$1,
            'sourceRoot': '',
            'sources': sources,
            'sourcesContent': sourcesContent,
            'mappings': mappings,
        };
    };
    /**
     * @return {?}
     */
    SourceMapGenerator.prototype.toJsComment = function () {
        return this.hasMappings ? '//' + JS_B64_PREFIX + toBase64String(JSON.stringify(this, null, 0)) :
            '';
    };
    return SourceMapGenerator;
}());
/**
 * @param {?} value
 * @return {?}
 */
function toBase64String(value) {
    var /** @type {?} */ b64 = '';
    value = utf8Encode(value);
    for (var /** @type {?} */ i = 0; i < value.length;) {
        var /** @type {?} */ i1 = value.charCodeAt(i++);
        var /** @type {?} */ i2 = value.charCodeAt(i++);
        var /** @type {?} */ i3 = value.charCodeAt(i++);
        b64 += toBase64Digit(i1 >> 2);
        b64 += toBase64Digit(((i1 & 3) << 4) | (isNaN(i2) ? 0 : i2 >> 4));
        b64 += isNaN(i2) ? '=' : toBase64Digit(((i2 & 15) << 2) | (i3 >> 6));
        b64 += isNaN(i2) || isNaN(i3) ? '=' : toBase64Digit(i3 & 63);
    }
    return b64;
}
/**
 * @param {?} value
 * @return {?}
 */
function toBase64VLQ(value) {
    value = value < 0 ? ((-value) << 1) + 1 : value << 1;
    var /** @type {?} */ out = '';
    do {
        var /** @type {?} */ digit = value & 31;
        value = value >> 5;
        if (value > 0) {
            digit = digit | 32;
        }
        out += toBase64Digit(digit);
    } while (value > 0);
    return out;
}
var B64_DIGITS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
/**
 * @param {?} value
 * @return {?}
 */
function toBase64Digit(value) {
    if (value < 0 || value >= 64) {
        throw new Error("Can only encode value in the range [0, 63]");
    }
    return B64_DIGITS[value];
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var _SINGLE_QUOTE_ESCAPE_STRING_RE = /'|\\|\n|\r|\$/g;
var _LEGAL_IDENTIFIER_RE = /^[$A-Z_][0-9A-Z_$]*$/i;
var _INDENT_WITH = '  ';
var CATCH_ERROR_VAR$1 = variable('error', null, null);
var CATCH_STACK_VAR$1 = variable('stack', null, null);
/**
 * @abstract
 */
var _EmittedLine = (function () {
    /**
     * @param {?} indent
     */
    function _EmittedLine(indent) {
        this.indent = indent;
        this.parts = [];
        this.srcSpans = [];
    }
    return _EmittedLine;
}());
var EmitterVisitorContext = (function () {
    /**
     * @param {?} _exportedVars
     * @param {?} _indent
     */
    function EmitterVisitorContext(_exportedVars, _indent) {
        this._exportedVars = _exportedVars;
        this._indent = _indent;
        this._classes = [];
        this._lines = [new _EmittedLine(_indent)];
    }
    /**
     * @param {?} exportedVars
     * @return {?}
     */
    EmitterVisitorContext.createRoot = function (exportedVars) {
        return new EmitterVisitorContext(exportedVars, 0);
    };
    Object.defineProperty(EmitterVisitorContext.prototype, "_currentLine", {
        /**
         * @return {?}
         */
        get: function () { return this._lines[this._lines.length - 1]; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} varName
     * @return {?}
     */
    EmitterVisitorContext.prototype.isExportedVar = function (varName) { return this._exportedVars.indexOf(varName) !== -1; };
    /**
     * @param {?=} from
     * @param {?=} lastPart
     * @return {?}
     */
    EmitterVisitorContext.prototype.println = function (from, lastPart) {
        if (lastPart === void 0) { lastPart = ''; }
        this.print(from || null, lastPart, true);
    };
    /**
     * @return {?}
     */
    EmitterVisitorContext.prototype.lineIsEmpty = function () { return this._currentLine.parts.length === 0; };
    /**
     * @param {?} from
     * @param {?} part
     * @param {?=} newLine
     * @return {?}
     */
    EmitterVisitorContext.prototype.print = function (from, part, newLine) {
        if (newLine === void 0) { newLine = false; }
        if (part.length > 0) {
            this._currentLine.parts.push(part);
            this._currentLine.srcSpans.push(from && from.sourceSpan || null);
        }
        if (newLine) {
            this._lines.push(new _EmittedLine(this._indent));
        }
    };
    /**
     * @return {?}
     */
    EmitterVisitorContext.prototype.removeEmptyLastLine = function () {
        if (this.lineIsEmpty()) {
            this._lines.pop();
        }
    };
    /**
     * @return {?}
     */
    EmitterVisitorContext.prototype.incIndent = function () {
        this._indent++;
        this._currentLine.indent = this._indent;
    };
    /**
     * @return {?}
     */
    EmitterVisitorContext.prototype.decIndent = function () {
        this._indent--;
        this._currentLine.indent = this._indent;
    };
    /**
     * @param {?} clazz
     * @return {?}
     */
    EmitterVisitorContext.prototype.pushClass = function (clazz) { this._classes.push(clazz); };
    /**
     * @return {?}
     */
    EmitterVisitorContext.prototype.popClass = function () { return ((this._classes.pop())); };
    Object.defineProperty(EmitterVisitorContext.prototype, "currentClass", {
        /**
         * @return {?}
         */
        get: function () {
            return this._classes.length > 0 ? this._classes[this._classes.length - 1] : null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    EmitterVisitorContext.prototype.toSource = function () {
        return this.sourceLines
            .map(function (l) { return l.parts.length > 0 ? _createIndent(l.indent) + l.parts.join('') : ''; })
            .join('\n');
    };
    /**
     * @param {?} sourceFilePath
     * @param {?} genFilePath
     * @param {?=} startsAtLine
     * @return {?}
     */
    EmitterVisitorContext.prototype.toSourceMapGenerator = function (sourceFilePath, genFilePath, startsAtLine) {
        if (startsAtLine === void 0) { startsAtLine = 0; }
        var /** @type {?} */ map = new SourceMapGenerator(genFilePath);
        var /** @type {?} */ firstOffsetMapped = false;
        var /** @type {?} */ mapFirstOffsetIfNeeded = function () {
            if (!firstOffsetMapped) {
                // Add a single space so that tools won't try to load the file from disk.
                // Note: We are using virtual urls like `ng:///`, so we have to
                // provide a content here.
                map.addSource(sourceFilePath, ' ').addMapping(0, sourceFilePath, 0, 0);
                firstOffsetMapped = true;
            }
        };
        for (var /** @type {?} */ i = 0; i < startsAtLine; i++) {
            map.addLine();
            mapFirstOffsetIfNeeded();
        }
        this.sourceLines.forEach(function (line, lineIdx) {
            map.addLine();
            var /** @type {?} */ spans = line.srcSpans;
            var /** @type {?} */ parts = line.parts;
            var /** @type {?} */ col0 = line.indent * _INDENT_WITH.length;
            var /** @type {?} */ spanIdx = 0;
            // skip leading parts without source spans
            while (spanIdx < spans.length && !spans[spanIdx]) {
                col0 += parts[spanIdx].length;
                spanIdx++;
            }
            if (spanIdx < spans.length && lineIdx === 0 && col0 === 0) {
                firstOffsetMapped = true;
            }
            else {
                mapFirstOffsetIfNeeded();
            }
            while (spanIdx < spans.length) {
                var /** @type {?} */ span = ((spans[spanIdx]));
                var /** @type {?} */ source = span.start.file;
                var /** @type {?} */ sourceLine = span.start.line;
                var /** @type {?} */ sourceCol = span.start.col;
                map.addSource(source.url, source.content)
                    .addMapping(col0, source.url, sourceLine, sourceCol);
                col0 += parts[spanIdx].length;
                spanIdx++;
                // assign parts without span or the same span to the previous segment
                while (spanIdx < spans.length && (span === spans[spanIdx] || !spans[spanIdx])) {
                    col0 += parts[spanIdx].length;
                    spanIdx++;
                }
            }
        });
        return map;
    };
    Object.defineProperty(EmitterVisitorContext.prototype, "sourceLines", {
        /**
         * @return {?}
         */
        get: function () {
            if (this._lines.length && this._lines[this._lines.length - 1].parts.length === 0) {
                return this._lines.slice(0, -1);
            }
            return this._lines;
        },
        enumerable: true,
        configurable: true
    });
    return EmitterVisitorContext;
}());
/**
 * @abstract
 */
var AbstractEmitterVisitor = (function () {
    /**
     * @param {?} _escapeDollarInStrings
     */
    function AbstractEmitterVisitor(_escapeDollarInStrings) {
        this._escapeDollarInStrings = _escapeDollarInStrings;
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitExpressionStmt = function (stmt, ctx) {
        stmt.expr.visitExpression(this, ctx);
        ctx.println(stmt, ';');
        return null;
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitReturnStmt = function (stmt, ctx) {
        ctx.print(stmt, "return ");
        stmt.value.visitExpression(this, ctx);
        ctx.println(stmt, ';');
        return null;
    };
    /**
     * @abstract
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitCastExpr = function (ast, context) { };
    /**
     * @abstract
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitDeclareClassStmt = function (stmt, ctx) { };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitIfStmt = function (stmt, ctx) {
        ctx.print(stmt, "if (");
        stmt.condition.visitExpression(this, ctx);
        ctx.print(stmt, ") {");
        var /** @type {?} */ hasElseCase = stmt.falseCase != null && stmt.falseCase.length > 0;
        if (stmt.trueCase.length <= 1 && !hasElseCase) {
            ctx.print(stmt, " ");
            this.visitAllStatements(stmt.trueCase, ctx);
            ctx.removeEmptyLastLine();
            ctx.print(stmt, " ");
        }
        else {
            ctx.println();
            ctx.incIndent();
            this.visitAllStatements(stmt.trueCase, ctx);
            ctx.decIndent();
            if (hasElseCase) {
                ctx.println(stmt, "} else {");
                ctx.incIndent();
                this.visitAllStatements(stmt.falseCase, ctx);
                ctx.decIndent();
            }
        }
        ctx.println(stmt, "}");
        return null;
    };
    /**
     * @abstract
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitTryCatchStmt = function (stmt, ctx) { };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitThrowStmt = function (stmt, ctx) {
        ctx.print(stmt, "throw ");
        stmt.error.visitExpression(this, ctx);
        ctx.println(stmt, ";");
        return null;
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitCommentStmt = function (stmt, ctx) {
        var /** @type {?} */ lines = stmt.comment.split('\n');
        lines.forEach(function (line) { ctx.println(stmt, "// " + line); });
        return null;
    };
    /**
     * @abstract
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitDeclareVarStmt = function (stmt, ctx) { };
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitWriteVarExpr = function (expr, ctx) {
        var /** @type {?} */ lineWasEmpty = ctx.lineIsEmpty();
        if (!lineWasEmpty) {
            ctx.print(expr, '(');
        }
        ctx.print(expr, expr.name + " = ");
        expr.value.visitExpression(this, ctx);
        if (!lineWasEmpty) {
            ctx.print(expr, ')');
        }
        return null;
    };
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitWriteKeyExpr = function (expr, ctx) {
        var /** @type {?} */ lineWasEmpty = ctx.lineIsEmpty();
        if (!lineWasEmpty) {
            ctx.print(expr, '(');
        }
        expr.receiver.visitExpression(this, ctx);
        ctx.print(expr, "[");
        expr.index.visitExpression(this, ctx);
        ctx.print(expr, "] = ");
        expr.value.visitExpression(this, ctx);
        if (!lineWasEmpty) {
            ctx.print(expr, ')');
        }
        return null;
    };
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitWritePropExpr = function (expr, ctx) {
        var /** @type {?} */ lineWasEmpty = ctx.lineIsEmpty();
        if (!lineWasEmpty) {
            ctx.print(expr, '(');
        }
        expr.receiver.visitExpression(this, ctx);
        ctx.print(expr, "." + expr.name + " = ");
        expr.value.visitExpression(this, ctx);
        if (!lineWasEmpty) {
            ctx.print(expr, ')');
        }
        return null;
    };
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitInvokeMethodExpr = function (expr, ctx) {
        expr.receiver.visitExpression(this, ctx);
        var /** @type {?} */ name = expr.name;
        if (expr.builtin != null) {
            name = this.getBuiltinMethodName(expr.builtin);
            if (name == null) {
                // some builtins just mean to skip the call.
                return null;
            }
        }
        ctx.print(expr, "." + name + "(");
        this.visitAllExpressions(expr.args, ctx, ",");
        ctx.print(expr, ")");
        return null;
    };
    /**
     * @abstract
     * @param {?} method
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.getBuiltinMethodName = function (method) { };
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitInvokeFunctionExpr = function (expr, ctx) {
        expr.fn.visitExpression(this, ctx);
        ctx.print(expr, "(");
        this.visitAllExpressions(expr.args, ctx, ',');
        ctx.print(expr, ")");
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitReadVarExpr = function (ast, ctx) {
        var /** @type {?} */ varName = ((ast.name));
        if (ast.builtin != null) {
            switch (ast.builtin) {
                case BuiltinVar.Super:
                    varName = 'super';
                    break;
                case BuiltinVar.This:
                    varName = 'this';
                    break;
                case BuiltinVar.CatchError:
                    varName = ((CATCH_ERROR_VAR$1.name));
                    break;
                case BuiltinVar.CatchStack:
                    varName = ((CATCH_STACK_VAR$1.name));
                    break;
                default:
                    throw new Error("Unknown builtin variable " + ast.builtin);
            }
        }
        ctx.print(ast, varName);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitInstantiateExpr = function (ast, ctx) {
        ctx.print(ast, "new ");
        ast.classExpr.visitExpression(this, ctx);
        ctx.print(ast, "(");
        this.visitAllExpressions(ast.args, ctx, ',');
        ctx.print(ast, ")");
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitLiteralExpr = function (ast, ctx) {
        var /** @type {?} */ value = ast.value;
        if (typeof value === 'string') {
            ctx.print(ast, escapeIdentifier(value, this._escapeDollarInStrings));
        }
        else {
            ctx.print(ast, "" + value);
        }
        return null;
    };
    /**
     * @abstract
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitExternalExpr = function (ast, ctx) { };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitConditionalExpr = function (ast, ctx) {
        ctx.print(ast, "(");
        ast.condition.visitExpression(this, ctx);
        ctx.print(ast, '? ');
        ast.trueCase.visitExpression(this, ctx);
        ctx.print(ast, ': '); /** @type {?} */
        ((ast.falseCase)).visitExpression(this, ctx);
        ctx.print(ast, ")");
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitNotExpr = function (ast, ctx) {
        ctx.print(ast, '!');
        ast.condition.visitExpression(this, ctx);
        return null;
    };
    /**
     * @abstract
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitFunctionExpr = function (ast, ctx) { };
    /**
     * @abstract
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitDeclareFunctionStmt = function (stmt, context) { };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitBinaryOperatorExpr = function (ast, ctx) {
        var /** @type {?} */ opStr;
        switch (ast.operator) {
            case BinaryOperator.Equals:
                opStr = '==';
                break;
            case BinaryOperator.Identical:
                opStr = '===';
                break;
            case BinaryOperator.NotEquals:
                opStr = '!=';
                break;
            case BinaryOperator.NotIdentical:
                opStr = '!==';
                break;
            case BinaryOperator.And:
                opStr = '&&';
                break;
            case BinaryOperator.Or:
                opStr = '||';
                break;
            case BinaryOperator.Plus:
                opStr = '+';
                break;
            case BinaryOperator.Minus:
                opStr = '-';
                break;
            case BinaryOperator.Divide:
                opStr = '/';
                break;
            case BinaryOperator.Multiply:
                opStr = '*';
                break;
            case BinaryOperator.Modulo:
                opStr = '%';
                break;
            case BinaryOperator.Lower:
                opStr = '<';
                break;
            case BinaryOperator.LowerEquals:
                opStr = '<=';
                break;
            case BinaryOperator.Bigger:
                opStr = '>';
                break;
            case BinaryOperator.BiggerEquals:
                opStr = '>=';
                break;
            default:
                throw new Error("Unknown operator " + ast.operator);
        }
        ctx.print(ast, "(");
        ast.lhs.visitExpression(this, ctx);
        ctx.print(ast, " " + opStr + " ");
        ast.rhs.visitExpression(this, ctx);
        ctx.print(ast, ")");
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitReadPropExpr = function (ast, ctx) {
        ast.receiver.visitExpression(this, ctx);
        ctx.print(ast, ".");
        ctx.print(ast, ast.name);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitReadKeyExpr = function (ast, ctx) {
        ast.receiver.visitExpression(this, ctx);
        ctx.print(ast, "[");
        ast.index.visitExpression(this, ctx);
        ctx.print(ast, "]");
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitLiteralArrayExpr = function (ast, ctx) {
        var /** @type {?} */ useNewLine = ast.entries.length > 1;
        ctx.print(ast, "[", useNewLine);
        ctx.incIndent();
        this.visitAllExpressions(ast.entries, ctx, ',', useNewLine);
        ctx.decIndent();
        ctx.print(ast, "]", useNewLine);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitLiteralMapExpr = function (ast, ctx) {
        var _this = this;
        var /** @type {?} */ useNewLine = ast.entries.length > 1;
        ctx.print(ast, "{", useNewLine);
        ctx.incIndent();
        this.visitAllObjects(function (entry) {
            ctx.print(ast, escapeIdentifier(entry.key, _this._escapeDollarInStrings, entry.quoted) + ": ");
            entry.value.visitExpression(_this, ctx);
        }, ast.entries, ctx, ',', useNewLine);
        ctx.decIndent();
        ctx.print(ast, "}", useNewLine);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitCommaExpr = function (ast, ctx) {
        ctx.print(ast, '(');
        this.visitAllExpressions(ast.parts, ctx, ',');
        ctx.print(ast, ')');
        return null;
    };
    /**
     * @param {?} expressions
     * @param {?} ctx
     * @param {?} separator
     * @param {?=} newLine
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitAllExpressions = function (expressions, ctx, separator, newLine) {
        var _this = this;
        if (newLine === void 0) { newLine = false; }
        this.visitAllObjects(function (expr) { return expr.visitExpression(_this, ctx); }, expressions, ctx, separator, newLine);
    };
    /**
     * @template T
     * @param {?} handler
     * @param {?} expressions
     * @param {?} ctx
     * @param {?} separator
     * @param {?=} newLine
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitAllObjects = function (handler, expressions, ctx, separator, newLine) {
        if (newLine === void 0) { newLine = false; }
        for (var /** @type {?} */ i = 0; i < expressions.length; i++) {
            if (i > 0) {
                ctx.print(null, separator, newLine);
            }
            handler(expressions[i]);
        }
        if (newLine) {
            ctx.println();
        }
    };
    /**
     * @param {?} statements
     * @param {?} ctx
     * @return {?}
     */
    AbstractEmitterVisitor.prototype.visitAllStatements = function (statements, ctx) {
        var _this = this;
        statements.forEach(function (stmt) { return stmt.visitStatement(_this, ctx); });
    };
    return AbstractEmitterVisitor;
}());
/**
 * @param {?} input
 * @param {?} escapeDollar
 * @param {?=} alwaysQuote
 * @return {?}
 */
function escapeIdentifier(input, escapeDollar, alwaysQuote) {
    if (alwaysQuote === void 0) { alwaysQuote = true; }
    if (input == null) {
        return null;
    }
    var /** @type {?} */ body = input.replace(_SINGLE_QUOTE_ESCAPE_STRING_RE, function () {
        var match = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            match[_i] = arguments[_i];
        }
        if (match[0] == '$') {
            return escapeDollar ? '\\$' : '$';
        }
        else if (match[0] == '\n') {
            return '\\n';
        }
        else if (match[0] == '\r') {
            return '\\r';
        }
        else {
            return "\\" + match[0];
        }
    });
    var /** @type {?} */ requiresQuotes = alwaysQuote || !_LEGAL_IDENTIFIER_RE.test(body);
    return requiresQuotes ? "'" + body + "'" : body;
}
/**
 * @param {?} count
 * @return {?}
 */
function _createIndent(count) {
    var /** @type {?} */ res = '';
    for (var /** @type {?} */ i = 0; i < count; i++) {
        res += _INDENT_WITH;
    }
    return res;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var _debugFilePath = '/debug/lib';
/**
 * @param {?} ast
 * @return {?}
 */
function debugOutputAstAsTypeScript(ast) {
    var /** @type {?} */ converter = new _TsEmitterVisitor(_debugFilePath, {
        /**
         * @param {?} filePath
         * @param {?} containingFilePath
         * @return {?}
         */
        fileNameToModuleName: function (filePath, containingFilePath) { return filePath; },
        /**
         * @param {?} symbol
         * @return {?}
         */
        getImportAs: function (symbol) { return null; },
        getTypeArity: function (symbol) { return null; }
    });
    var /** @type {?} */ ctx = EmitterVisitorContext.createRoot([]);
    var /** @type {?} */ asts = Array.isArray(ast) ? ast : [ast];
    asts.forEach(function (ast) {
        if (ast instanceof Statement) {
            ast.visitStatement(converter, ctx);
        }
        else if (ast instanceof Expression) {
            ast.visitExpression(converter, ctx);
        }
        else if (ast instanceof Type$1) {
            ast.visitType(converter, ctx);
        }
        else {
            throw new Error("Don't know how to print debug info for " + ast);
        }
    });
    return ctx.toSource();
}
var TypeScriptEmitter = (function () {
    /**
     * @param {?} _importResolver
     */
    function TypeScriptEmitter(_importResolver) {
        this._importResolver = _importResolver;
    }
    /**
     * @param {?} srcFilePath
     * @param {?} genFilePath
     * @param {?} stmts
     * @param {?} exportedVars
     * @param {?=} preamble
     * @return {?}
     */
    TypeScriptEmitter.prototype.emitStatements = function (srcFilePath, genFilePath, stmts, exportedVars, preamble) {
        var _this = this;
        if (preamble === void 0) { preamble = ''; }
        var /** @type {?} */ converter = new _TsEmitterVisitor(genFilePath, this._importResolver);
        var /** @type {?} */ ctx = EmitterVisitorContext.createRoot(exportedVars);
        converter.visitAllStatements(stmts, ctx);
        var /** @type {?} */ preambleLines = preamble ? preamble.split('\n') : [];
        converter.reexports.forEach(function (reexports, exportedFilePath) {
            var /** @type {?} */ reexportsCode = reexports.map(function (reexport) { return reexport.name + " as " + reexport.as; }).join(',');
            preambleLines.push("export {" + reexportsCode + "} from '" + _this._importResolver.fileNameToModuleName(exportedFilePath, genFilePath) + "';");
        });
        converter.importsWithPrefixes.forEach(function (prefix, importedFilePath) {
            // Note: can't write the real word for import as it screws up system.js auto detection...
            preambleLines.push("imp" +
                ("ort * as " + prefix + " from '" + _this._importResolver.fileNameToModuleName(importedFilePath, genFilePath) + "';"));
        });
        var /** @type {?} */ sm = ctx.toSourceMapGenerator(srcFilePath, genFilePath, preambleLines.length).toJsComment();
        var /** @type {?} */ lines = preambleLines.concat([ctx.toSource(), sm]);
        if (sm) {
            // always add a newline at the end, as some tools have bugs without it.
            lines.push('');
        }
        return lines.join('\n');
    };
    return TypeScriptEmitter;
}());
var _TsEmitterVisitor = (function (_super) {
    __extends(_TsEmitterVisitor, _super);
    /**
     * @param {?} _genFilePath
     * @param {?} _importResolver
     */
    function _TsEmitterVisitor(_genFilePath, _importResolver) {
        var _this = _super.call(this, false) || this;
        _this._genFilePath = _genFilePath;
        _this._importResolver = _importResolver;
        _this.typeExpression = 0;
        _this.importsWithPrefixes = new Map();
        _this.reexports = new Map();
        return _this;
    }
    /**
     * @param {?} t
     * @param {?} ctx
     * @param {?=} defaultType
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitType = function (t, ctx, defaultType) {
        if (defaultType === void 0) { defaultType = 'any'; }
        if (t) {
            this.typeExpression++;
            t.visitType(this, ctx);
            this.typeExpression--;
        }
        else {
            ctx.print(null, defaultType);
        }
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitLiteralExpr = function (ast, ctx) {
        var /** @type {?} */ value = ast.value;
        if (value == null && ast.type != INFERRED_TYPE) {
            ctx.print(ast, "(" + value + " as any)");
            return null;
        }
        return _super.prototype.visitLiteralExpr.call(this, ast, ctx);
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitLiteralArrayExpr = function (ast, ctx) {
        if (ast.entries.length === 0) {
            ctx.print(ast, '(');
        }
        var /** @type {?} */ result = _super.prototype.visitLiteralArrayExpr.call(this, ast, ctx);
        if (ast.entries.length === 0) {
            ctx.print(ast, ' as any[])');
        }
        return result;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitExternalExpr = function (ast, ctx) {
        this._visitIdentifier(ast.value, ast.typeParams, ctx);
        return null;
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitDeclareVarStmt = function (stmt, ctx) {
        if (ctx.isExportedVar(stmt.name) && stmt.value instanceof ExternalExpr && !stmt.type) {
            // check for a reexport
            var _a = this._resolveStaticSymbol(stmt.value.value), name = _a.name, filePath = _a.filePath, members = _a.members;
            if (((members)).length === 0 && filePath !== this._genFilePath) {
                var /** @type {?} */ reexports = this.reexports.get(filePath);
                if (!reexports) {
                    reexports = [];
                    this.reexports.set(filePath, reexports);
                }
                reexports.push({ name: name, as: stmt.name });
                return null;
            }
        }
        if (ctx.isExportedVar(stmt.name)) {
            ctx.print(stmt, "export ");
        }
        if (stmt.hasModifier(StmtModifier.Final)) {
            ctx.print(stmt, "const");
        }
        else {
            ctx.print(stmt, "var");
        }
        ctx.print(stmt, " " + stmt.name);
        this._printColonType(stmt.type, ctx);
        ctx.print(stmt, " = ");
        stmt.value.visitExpression(this, ctx);
        ctx.println(stmt, ";");
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitCastExpr = function (ast, ctx) {
        ctx.print(ast, "(<"); /** @type {?} */
        ((ast.type)).visitType(this, ctx);
        ctx.print(ast, ">");
        ast.value.visitExpression(this, ctx);
        ctx.print(ast, ")");
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitInstantiateExpr = function (ast, ctx) {
        ctx.print(ast, "new ");
        this.typeExpression++;
        ast.classExpr.visitExpression(this, ctx);
        this.typeExpression--;
        ctx.print(ast, "(");
        this.visitAllExpressions(ast.args, ctx, ',');
        ctx.print(ast, ")");
        return null;
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitDeclareClassStmt = function (stmt, ctx) {
        var _this = this;
        ctx.pushClass(stmt);
        if (ctx.isExportedVar(stmt.name)) {
            ctx.print(stmt, "export ");
        }
        ctx.print(stmt, "class " + stmt.name);
        if (stmt.parent != null) {
            ctx.print(stmt, " extends ");
            this.typeExpression++;
            stmt.parent.visitExpression(this, ctx);
            this.typeExpression--;
        }
        ctx.println(stmt, " {");
        ctx.incIndent();
        stmt.fields.forEach(function (field) { return _this._visitClassField(field, ctx); });
        if (stmt.constructorMethod != null) {
            this._visitClassConstructor(stmt, ctx);
        }
        stmt.getters.forEach(function (getter) { return _this._visitClassGetter(getter, ctx); });
        stmt.methods.forEach(function (method) { return _this._visitClassMethod(method, ctx); });
        ctx.decIndent();
        ctx.println(stmt, "}");
        ctx.popClass();
        return null;
    };
    /**
     * @param {?} field
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype._visitClassField = function (field, ctx) {
        if (field.hasModifier(StmtModifier.Private)) {
            // comment out as a workaround for #10967
            ctx.print(null, "/*private*/ ");
        }
        ctx.print(null, field.name);
        this._printColonType(field.type, ctx);
        ctx.println(null, ";");
    };
    /**
     * @param {?} getter
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype._visitClassGetter = function (getter, ctx) {
        if (getter.hasModifier(StmtModifier.Private)) {
            ctx.print(null, "private ");
        }
        ctx.print(null, "get " + getter.name + "()");
        this._printColonType(getter.type, ctx);
        ctx.println(null, " {");
        ctx.incIndent();
        this.visitAllStatements(getter.body, ctx);
        ctx.decIndent();
        ctx.println(null, "}");
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype._visitClassConstructor = function (stmt, ctx) {
        ctx.print(stmt, "constructor(");
        this._visitParams(stmt.constructorMethod.params, ctx);
        ctx.println(stmt, ") {");
        ctx.incIndent();
        this.visitAllStatements(stmt.constructorMethod.body, ctx);
        ctx.decIndent();
        ctx.println(stmt, "}");
    };
    /**
     * @param {?} method
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype._visitClassMethod = function (method, ctx) {
        if (method.hasModifier(StmtModifier.Private)) {
            ctx.print(null, "private ");
        }
        ctx.print(null, method.name + "(");
        this._visitParams(method.params, ctx);
        ctx.print(null, ")");
        this._printColonType(method.type, ctx, 'void');
        ctx.println(null, " {");
        ctx.incIndent();
        this.visitAllStatements(method.body, ctx);
        ctx.decIndent();
        ctx.println(null, "}");
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitFunctionExpr = function (ast, ctx) {
        ctx.print(ast, "(");
        this._visitParams(ast.params, ctx);
        ctx.print(ast, ")");
        this._printColonType(ast.type, ctx, 'void');
        ctx.println(ast, " => {");
        ctx.incIndent();
        this.visitAllStatements(ast.statements, ctx);
        ctx.decIndent();
        ctx.print(ast, "}");
        return null;
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitDeclareFunctionStmt = function (stmt, ctx) {
        if (ctx.isExportedVar(stmt.name)) {
            ctx.print(stmt, "export ");
        }
        ctx.print(stmt, "function " + stmt.name + "(");
        this._visitParams(stmt.params, ctx);
        ctx.print(stmt, ")");
        this._printColonType(stmt.type, ctx, 'void');
        ctx.println(stmt, " {");
        ctx.incIndent();
        this.visitAllStatements(stmt.statements, ctx);
        ctx.decIndent();
        ctx.println(stmt, "}");
        return null;
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitTryCatchStmt = function (stmt, ctx) {
        ctx.println(stmt, "try {");
        ctx.incIndent();
        this.visitAllStatements(stmt.bodyStmts, ctx);
        ctx.decIndent();
        ctx.println(stmt, "} catch (" + CATCH_ERROR_VAR$1.name + ") {");
        ctx.incIndent();
        var /** @type {?} */ catchStmts = [/** @type {?} */ (CATCH_STACK_VAR$1.set(CATCH_ERROR_VAR$1.prop('stack', null)).toDeclStmt(null, [
                StmtModifier.Final
            ]))].concat(stmt.catchStmts);
        this.visitAllStatements(catchStmts, ctx);
        ctx.decIndent();
        ctx.println(stmt, "}");
        return null;
    };
    /**
     * @param {?} type
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitBuiltintType = function (type, ctx) {
        var /** @type {?} */ typeStr;
        switch (type.name) {
            case BuiltinTypeName.Bool:
                typeStr = 'boolean';
                break;
            case BuiltinTypeName.Dynamic:
                typeStr = 'any';
                break;
            case BuiltinTypeName.Function:
                typeStr = 'Function';
                break;
            case BuiltinTypeName.Number:
                typeStr = 'number';
                break;
            case BuiltinTypeName.Int:
                typeStr = 'number';
                break;
            case BuiltinTypeName.String:
                typeStr = 'string';
                break;
            default:
                throw new Error("Unsupported builtin type " + type.name);
        }
        ctx.print(null, typeStr);
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitExpressionType = function (ast, ctx) {
        ast.value.visitExpression(this, ctx);
        return null;
    };
    /**
     * @param {?} type
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitArrayType = function (type, ctx) {
        this.visitType(type.of, ctx);
        ctx.print(null, "[]");
        return null;
    };
    /**
     * @param {?} type
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype.visitMapType = function (type, ctx) {
        ctx.print(null, "{[key: string]:");
        this.visitType(type.valueType, ctx);
        ctx.print(null, "}");
        return null;
    };
    /**
     * @param {?} method
     * @return {?}
     */
    _TsEmitterVisitor.prototype.getBuiltinMethodName = function (method) {
        var /** @type {?} */ name;
        switch (method) {
            case BuiltinMethod.ConcatArray:
                name = 'concat';
                break;
            case BuiltinMethod.SubscribeObservable:
                name = 'subscribe';
                break;
            case BuiltinMethod.Bind:
                name = 'bind';
                break;
            default:
                throw new Error("Unknown builtin method: " + method);
        }
        return name;
    };
    /**
     * @param {?} params
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype._visitParams = function (params, ctx) {
        var _this = this;
        this.visitAllObjects(function (param) {
            ctx.print(null, param.name);
            _this._printColonType(param.type, ctx);
        }, params, ctx, ',');
    };
    /**
     * @param {?} value
     * @return {?}
     */
    _TsEmitterVisitor.prototype._resolveStaticSymbol = function (value) {
        var /** @type {?} */ reference = value.reference;
        if (!(reference instanceof StaticSymbol)) {
            throw new Error("Internal error: unknown identifier " + JSON.stringify(value));
        }
        var /** @type {?} */ arity = this._importResolver.getTypeArity(reference) || undefined;
        var /** @type {?} */ importReference = this._importResolver.getImportAs(reference) || reference;
        return {
            name: importReference.name,
            filePath: importReference.filePath,
            members: importReference.members, arity: arity
        };
    };
    /**
     * @param {?} value
     * @param {?} typeParams
     * @param {?} ctx
     * @return {?}
     */
    _TsEmitterVisitor.prototype._visitIdentifier = function (value, typeParams, ctx) {
        var _this = this;
        var _a = this._resolveStaticSymbol(value), name = _a.name, filePath = _a.filePath, members = _a.members, arity = _a.arity;
        if (filePath != this._genFilePath) {
            var /** @type {?} */ prefix = this.importsWithPrefixes.get(filePath);
            if (prefix == null) {
                prefix = "import" + this.importsWithPrefixes.size;
                this.importsWithPrefixes.set(filePath, prefix);
            }
            ctx.print(null, prefix + ".");
        }
        if (((members)).length) {
            ctx.print(null, name);
            ctx.print(null, '.');
            ctx.print(null, /** @type {?} */ ((members)).join('.'));
        }
        else {
            ctx.print(null, name);
        }
        if (this.typeExpression > 0) {
            // If we are in a type expression that refers to a generic type then supply
            // the required type parameters. If there were not enough type parameters
            // supplied, supply any as the type. Outside a type expression the reference
            // should not supply type parameters and be treated as a simple value reference
            // to the constructor function itself.
            var /** @type {?} */ suppliedParameters = (typeParams && typeParams.length) || 0;
            var /** @type {?} */ additionalParameters = (arity || 0) - suppliedParameters;
            if (suppliedParameters > 0 || additionalParameters > 0) {
                ctx.print(null, "<");
                if (suppliedParameters > 0) {
                    this.visitAllObjects(function (type) { return type.visitType(_this, ctx); }, /** @type {?} */ ((typeParams)), ctx, ',');
                }
                if (additionalParameters > 0) {
                    for (var /** @type {?} */ i = 0; i < additionalParameters; i++) {
                        if (i > 0 || suppliedParameters > 0)
                            ctx.print(null, ',');
                        ctx.print(null, 'any');
                    }
                }
                ctx.print(null, ">");
            }
        }
    };
    /**
     * @param {?} type
     * @param {?} ctx
     * @param {?=} defaultType
     * @return {?}
     */
    _TsEmitterVisitor.prototype._printColonType = function (type, ctx, defaultType) {
        if (type !== INFERRED_TYPE) {
            ctx.print(null, ':');
            this.visitType(type, ctx, defaultType);
        }
    };
    return _TsEmitterVisitor;
}(AbstractEmitterVisitor));
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// =================================================================================================
// =================================================================================================
// =========== S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P  ===========
// =================================================================================================
// =================================================================================================
//
//        DO NOT EDIT THIS LIST OF SECURITY SENSITIVE PROPERTIES WITHOUT A SECURITY REVIEW!
//                               Reach out to mprobst for details.
//
// =================================================================================================
/** Map from tagName|propertyName SecurityContext. Properties applying to all tags use '*'. */
var SECURITY_SCHEMA = {};
/**
 * @param {?} ctx
 * @param {?} specs
 * @return {?}
 */
function registerContext(ctx, specs) {
    for (var _i = 0, specs_1 = specs; _i < specs_1.length; _i++) {
        var spec = specs_1[_i];
        SECURITY_SCHEMA[spec.toLowerCase()] = ctx;
    }
}
// Case is insignificant below, all element and attribute names are lower-cased for lookup.
registerContext(SecurityContext.HTML, [
    'iframe|srcdoc',
    '*|innerHTML',
    '*|outerHTML',
]);
registerContext(SecurityContext.STYLE, ['*|style']);
// NB: no SCRIPT contexts here, they are never allowed due to the parser stripping them.
registerContext(SecurityContext.URL, [
    '*|formAction', 'area|href', 'area|ping', 'audio|src', 'a|href',
    'a|ping', 'blockquote|cite', 'body|background', 'del|cite', 'form|action',
    'img|src', 'img|srcset', 'input|src', 'ins|cite', 'q|cite',
    'source|src', 'source|srcset', 'track|src', 'video|poster', 'video|src',
]);
registerContext(SecurityContext.RESOURCE_URL, [
    'applet|code',
    'applet|codebase',
    'base|href',
    'embed|src',
    'frame|src',
    'head|profile',
    'html|manifest',
    'iframe|src',
    'link|href',
    'media|src',
    'object|codebase',
    'object|data',
    'script|src',
]);
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var BOOLEAN = 'boolean';
var NUMBER = 'number';
var STRING = 'string';
var OBJECT = 'object';
/**
 * This array represents the DOM schema. It encodes inheritance, properties, and events.
 *
 * ## Overview
 *
 * Each line represents one kind of element. The `element_inheritance` and properties are joined
 * using `element_inheritance|properties` syntax.
 *
 * ## Element Inheritance
 *
 * The `element_inheritance` can be further subdivided as `element1,element2,...^parentElement`.
 * Here the individual elements are separated by `,` (commas). Every element in the list
 * has identical properties.
 *
 * An `element` may inherit additional properties from `parentElement` If no `^parentElement` is
 * specified then `""` (blank) element is assumed.
 *
 * NOTE: The blank element inherits from root `[Element]` element, the super element of all
 * elements.
 *
 * NOTE an element prefix such as `:svg:` has no special meaning to the schema.
 *
 * ## Properties
 *
 * Each element has a set of properties separated by `,` (commas). Each property can be prefixed
 * by a special character designating its type:
 *
 * - (no prefix): property is a string.
 * - `*`: property represents an event.
 * - `!`: property is a boolean.
 * - `#`: property is a number.
 * - `%`: property is an object.
 *
 * ## Query
 *
 * The class creates an internal squas representation which allows to easily answer the query of
 * if a given property exist on a given element.
 *
 * NOTE: We don't yet support querying for types or events.
 * NOTE: This schema is auto extracted from `schema_extractor.ts` located in the test folder,
 *       see dom_element_schema_registry_spec.ts
 */
// =================================================================================================
// =================================================================================================
// =========== S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P  ===========
// =================================================================================================
// =================================================================================================
//
//                       DO NOT EDIT THIS DOM SCHEMA WITHOUT A SECURITY REVIEW!
//
// Newly added properties must be security reviewed and assigned an appropriate SecurityContext in
// dom_security_schema.ts. Reach out to mprobst & rjamet for details.
//
// =================================================================================================
var SCHEMA = [
    '[Element]|textContent,%classList,className,id,innerHTML,*beforecopy,*beforecut,*beforepaste,*copy,*cut,*paste,*search,*selectstart,*webkitfullscreenchange,*webkitfullscreenerror,*wheel,outerHTML,#scrollLeft,#scrollTop',
    '[HTMLElement]^[Element]|accessKey,contentEditable,dir,!draggable,!hidden,innerText,lang,*abort,*beforecopy,*beforecut,*beforepaste,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*message,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*mozfullscreenchange,*mozfullscreenerror,*mozpointerlockchange,*mozpointerlockerror,*paste,*pause,*play,*playing,*progress,*ratechange,*reset,*resize,*scroll,*search,*seeked,*seeking,*select,*selectstart,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,*webglcontextcreationerror,*webglcontextlost,*webglcontextrestored,*webkitfullscreenchange,*webkitfullscreenerror,*wheel,outerText,!spellcheck,%style,#tabIndex,title,!translate',
    'abbr,address,article,aside,b,bdi,bdo,cite,code,dd,dfn,dt,em,figcaption,figure,footer,header,i,kbd,main,mark,nav,noscript,rb,rp,rt,rtc,ruby,s,samp,section,small,strong,sub,sup,u,var,wbr^[HTMLElement]|accessKey,contentEditable,dir,!draggable,!hidden,innerText,lang,*abort,*beforecopy,*beforecut,*beforepaste,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*message,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*mozfullscreenchange,*mozfullscreenerror,*mozpointerlockchange,*mozpointerlockerror,*paste,*pause,*play,*playing,*progress,*ratechange,*reset,*resize,*scroll,*search,*seeked,*seeking,*select,*selectstart,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,*webglcontextcreationerror,*webglcontextlost,*webglcontextrestored,*webkitfullscreenchange,*webkitfullscreenerror,*wheel,outerText,!spellcheck,%style,#tabIndex,title,!translate',
    'media^[HTMLElement]|!autoplay,!controls,%crossOrigin,#currentTime,!defaultMuted,#defaultPlaybackRate,!disableRemotePlayback,!loop,!muted,*encrypted,#playbackRate,preload,src,%srcObject,#volume',
    ':svg:^[HTMLElement]|*abort,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,%style,#tabIndex',
    ':svg:graphics^:svg:|',
    ':svg:animation^:svg:|*begin,*end,*repeat',
    ':svg:geometry^:svg:|',
    ':svg:componentTransferFunction^:svg:|',
    ':svg:gradient^:svg:|',
    ':svg:textContent^:svg:graphics|',
    ':svg:textPositioning^:svg:textContent|',
    'a^[HTMLElement]|charset,coords,download,hash,host,hostname,href,hreflang,name,password,pathname,ping,port,protocol,referrerPolicy,rel,rev,search,shape,target,text,type,username',
    'area^[HTMLElement]|alt,coords,hash,host,hostname,href,!noHref,password,pathname,ping,port,protocol,referrerPolicy,search,shape,target,username',
    'audio^media|',
    'br^[HTMLElement]|clear',
    'base^[HTMLElement]|href,target',
    'body^[HTMLElement]|aLink,background,bgColor,link,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,text,vLink',
    'button^[HTMLElement]|!autofocus,!disabled,formAction,formEnctype,formMethod,!formNoValidate,formTarget,name,type,value',
    'canvas^[HTMLElement]|#height,#width',
    'content^[HTMLElement]|select',
    'dl^[HTMLElement]|!compact',
    'datalist^[HTMLElement]|',
    'details^[HTMLElement]|!open',
    'dialog^[HTMLElement]|!open,returnValue',
    'dir^[HTMLElement]|!compact',
    'div^[HTMLElement]|align',
    'embed^[HTMLElement]|align,height,name,src,type,width',
    'fieldset^[HTMLElement]|!disabled,name',
    'font^[HTMLElement]|color,face,size',
    'form^[HTMLElement]|acceptCharset,action,autocomplete,encoding,enctype,method,name,!noValidate,target',
    'frame^[HTMLElement]|frameBorder,longDesc,marginHeight,marginWidth,name,!noResize,scrolling,src',
    'frameset^[HTMLElement]|cols,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,rows',
    'hr^[HTMLElement]|align,color,!noShade,size,width',
    'head^[HTMLElement]|',
    'h1,h2,h3,h4,h5,h6^[HTMLElement]|align',
    'html^[HTMLElement]|version',
    'iframe^[HTMLElement]|align,!allowFullscreen,frameBorder,height,longDesc,marginHeight,marginWidth,name,referrerPolicy,%sandbox,scrolling,src,srcdoc,width',
    'img^[HTMLElement]|align,alt,border,%crossOrigin,#height,#hspace,!isMap,longDesc,lowsrc,name,referrerPolicy,sizes,src,srcset,useMap,#vspace,#width',
    'input^[HTMLElement]|accept,align,alt,autocapitalize,autocomplete,!autofocus,!checked,!defaultChecked,defaultValue,dirName,!disabled,%files,formAction,formEnctype,formMethod,!formNoValidate,formTarget,#height,!incremental,!indeterminate,max,#maxLength,min,#minLength,!multiple,name,pattern,placeholder,!readOnly,!required,selectionDirection,#selectionEnd,#selectionStart,#size,src,step,type,useMap,value,%valueAsDate,#valueAsNumber,#width',
    'keygen^[HTMLElement]|!autofocus,challenge,!disabled,keytype,name',
    'li^[HTMLElement]|type,#value',
    'label^[HTMLElement]|htmlFor',
    'legend^[HTMLElement]|align',
    'link^[HTMLElement]|as,charset,%crossOrigin,!disabled,href,hreflang,integrity,media,rel,%relList,rev,%sizes,target,type',
    'map^[HTMLElement]|name',
    'marquee^[HTMLElement]|behavior,bgColor,direction,height,#hspace,#loop,#scrollAmount,#scrollDelay,!trueSpeed,#vspace,width',
    'menu^[HTMLElement]|!compact',
    'meta^[HTMLElement]|content,httpEquiv,name,scheme',
    'meter^[HTMLElement]|#high,#low,#max,#min,#optimum,#value',
    'ins,del^[HTMLElement]|cite,dateTime',
    'ol^[HTMLElement]|!compact,!reversed,#start,type',
    'object^[HTMLElement]|align,archive,border,code,codeBase,codeType,data,!declare,height,#hspace,name,standby,type,useMap,#vspace,width',
    'optgroup^[HTMLElement]|!disabled,label',
    'option^[HTMLElement]|!defaultSelected,!disabled,label,!selected,text,value',
    'output^[HTMLElement]|defaultValue,%htmlFor,name,value',
    'p^[HTMLElement]|align',
    'param^[HTMLElement]|name,type,value,valueType',
    'picture^[HTMLElement]|',
    'pre^[HTMLElement]|#width',
    'progress^[HTMLElement]|#max,#value',
    'q,blockquote,cite^[HTMLElement]|',
    'script^[HTMLElement]|!async,charset,%crossOrigin,!defer,event,htmlFor,integrity,src,text,type',
    'select^[HTMLElement]|!autofocus,!disabled,#length,!multiple,name,!required,#selectedIndex,#size,value',
    'shadow^[HTMLElement]|',
    'source^[HTMLElement]|media,sizes,src,srcset,type',
    'span^[HTMLElement]|',
    'style^[HTMLElement]|!disabled,media,type',
    'caption^[HTMLElement]|align',
    'th,td^[HTMLElement]|abbr,align,axis,bgColor,ch,chOff,#colSpan,headers,height,!noWrap,#rowSpan,scope,vAlign,width',
    'col,colgroup^[HTMLElement]|align,ch,chOff,#span,vAlign,width',
    'table^[HTMLElement]|align,bgColor,border,%caption,cellPadding,cellSpacing,frame,rules,summary,%tFoot,%tHead,width',
    'tr^[HTMLElement]|align,bgColor,ch,chOff,vAlign',
    'tfoot,thead,tbody^[HTMLElement]|align,ch,chOff,vAlign',
    'template^[HTMLElement]|',
    'textarea^[HTMLElement]|autocapitalize,!autofocus,#cols,defaultValue,dirName,!disabled,#maxLength,#minLength,name,placeholder,!readOnly,!required,#rows,selectionDirection,#selectionEnd,#selectionStart,value,wrap',
    'title^[HTMLElement]|text',
    'track^[HTMLElement]|!default,kind,label,src,srclang',
    'ul^[HTMLElement]|!compact,type',
    'unknown^[HTMLElement]|',
    'video^media|#height,poster,#width',
    ':svg:a^:svg:graphics|',
    ':svg:animate^:svg:animation|',
    ':svg:animateMotion^:svg:animation|',
    ':svg:animateTransform^:svg:animation|',
    ':svg:circle^:svg:geometry|',
    ':svg:clipPath^:svg:graphics|',
    ':svg:cursor^:svg:|',
    ':svg:defs^:svg:graphics|',
    ':svg:desc^:svg:|',
    ':svg:discard^:svg:|',
    ':svg:ellipse^:svg:geometry|',
    ':svg:feBlend^:svg:|',
    ':svg:feColorMatrix^:svg:|',
    ':svg:feComponentTransfer^:svg:|',
    ':svg:feComposite^:svg:|',
    ':svg:feConvolveMatrix^:svg:|',
    ':svg:feDiffuseLighting^:svg:|',
    ':svg:feDisplacementMap^:svg:|',
    ':svg:feDistantLight^:svg:|',
    ':svg:feDropShadow^:svg:|',
    ':svg:feFlood^:svg:|',
    ':svg:feFuncA^:svg:componentTransferFunction|',
    ':svg:feFuncB^:svg:componentTransferFunction|',
    ':svg:feFuncG^:svg:componentTransferFunction|',
    ':svg:feFuncR^:svg:componentTransferFunction|',
    ':svg:feGaussianBlur^:svg:|',
    ':svg:feImage^:svg:|',
    ':svg:feMerge^:svg:|',
    ':svg:feMergeNode^:svg:|',
    ':svg:feMorphology^:svg:|',
    ':svg:feOffset^:svg:|',
    ':svg:fePointLight^:svg:|',
    ':svg:feSpecularLighting^:svg:|',
    ':svg:feSpotLight^:svg:|',
    ':svg:feTile^:svg:|',
    ':svg:feTurbulence^:svg:|',
    ':svg:filter^:svg:|',
    ':svg:foreignObject^:svg:graphics|',
    ':svg:g^:svg:graphics|',
    ':svg:image^:svg:graphics|',
    ':svg:line^:svg:geometry|',
    ':svg:linearGradient^:svg:gradient|',
    ':svg:mpath^:svg:|',
    ':svg:marker^:svg:|',
    ':svg:mask^:svg:|',
    ':svg:metadata^:svg:|',
    ':svg:path^:svg:geometry|',
    ':svg:pattern^:svg:|',
    ':svg:polygon^:svg:geometry|',
    ':svg:polyline^:svg:geometry|',
    ':svg:radialGradient^:svg:gradient|',
    ':svg:rect^:svg:geometry|',
    ':svg:svg^:svg:graphics|#currentScale,#zoomAndPan',
    ':svg:script^:svg:|type',
    ':svg:set^:svg:animation|',
    ':svg:stop^:svg:|',
    ':svg:style^:svg:|!disabled,media,title,type',
    ':svg:switch^:svg:graphics|',
    ':svg:symbol^:svg:|',
    ':svg:tspan^:svg:textPositioning|',
    ':svg:text^:svg:textPositioning|',
    ':svg:textPath^:svg:textContent|',
    ':svg:title^:svg:|',
    ':svg:use^:svg:graphics|',
    ':svg:view^:svg:|#zoomAndPan',
    'data^[HTMLElement]|value',
    'menuitem^[HTMLElement]|type,label,icon,!disabled,!checked,radiogroup,!default',
    'summary^[HTMLElement]|',
    'time^[HTMLElement]|dateTime',
];
var _ATTR_TO_PROP = {
    'class': 'className',
    'for': 'htmlFor',
    'formaction': 'formAction',
    'innerHtml': 'innerHTML',
    'readonly': 'readOnly',
    'tabindex': 'tabIndex',
};
var DomElementSchemaRegistry = (function (_super) {
    __extends(DomElementSchemaRegistry, _super);
    function DomElementSchemaRegistry() {
        var _this = _super.call(this) || this;
        _this._schema = {};
        SCHEMA.forEach(function (encodedType) {
            var type = {};
            var _a = encodedType.split('|'), strType = _a[0], strProperties = _a[1];
            var properties = strProperties.split(',');
            var _b = strType.split('^'), typeNames = _b[0], superName = _b[1];
            typeNames.split(',').forEach(function (tag) { return _this._schema[tag.toLowerCase()] = type; });
            var superType = superName && _this._schema[superName.toLowerCase()];
            if (superType) {
                Object.keys(superType).forEach(function (prop) { type[prop] = superType[prop]; });
            }
            properties.forEach(function (property) {
                if (property.length > 0) {
                    switch (property[0]) {
                        case '*':
                            // We don't yet support events.
                            // If ever allowing to bind to events, GO THROUGH A SECURITY REVIEW, allowing events
                            // will
                            // almost certainly introduce bad XSS vulnerabilities.
                            // type[property.substring(1)] = EVENT;
                            break;
                        case '!':
                            type[property.substring(1)] = BOOLEAN;
                            break;
                        case '#':
                            type[property.substring(1)] = NUMBER;
                            break;
                        case '%':
                            type[property.substring(1)] = OBJECT;
                            break;
                        default:
                            type[property] = STRING;
                    }
                }
            });
        });
        return _this;
    }
    /**
     * @param {?} tagName
     * @param {?} propName
     * @param {?} schemaMetas
     * @return {?}
     */
    DomElementSchemaRegistry.prototype.hasProperty = function (tagName, propName, schemaMetas) {
        if (schemaMetas.some(function (schema) { return schema.name === NO_ERRORS_SCHEMA.name; })) {
            return true;
        }
        if (tagName.indexOf('-') > -1) {
            if (isNgContainer(tagName) || isNgContent(tagName)) {
                return false;
            }
            if (schemaMetas.some(function (schema) { return schema.name === CUSTOM_ELEMENTS_SCHEMA.name; })) {
                // Can't tell now as we don't know which properties a custom element will get
                // once it is instantiated
                return true;
            }
        }
        var /** @type {?} */ elementProperties = this._schema[tagName.toLowerCase()] || this._schema['unknown'];
        return !!elementProperties[propName];
    };
    /**
     * @param {?} tagName
     * @param {?} schemaMetas
     * @return {?}
     */
    DomElementSchemaRegistry.prototype.hasElement = function (tagName, schemaMetas) {
        if (schemaMetas.some(function (schema) { return schema.name === NO_ERRORS_SCHEMA.name; })) {
            return true;
        }
        if (tagName.indexOf('-') > -1) {
            if (isNgContainer(tagName) || isNgContent(tagName)) {
                return true;
            }
            if (schemaMetas.some(function (schema) { return schema.name === CUSTOM_ELEMENTS_SCHEMA.name; })) {
                // Allow any custom elements
                return true;
            }
        }
        return !!this._schema[tagName.toLowerCase()];
    };
    /**
     * securityContext returns the security context for the given property on the given DOM tag.
     *
     * Tag and property name are statically known and cannot change at runtime, i.e. it is not
     * possible to bind a value into a changing attribute or tag name.
     *
     * The filtering is white list based. All attributes in the schema above are assumed to have the
     * 'NONE' security context, i.e. that they are safe inert string values. Only specific well known
     * attack vectors are assigned their appropriate context.
     * @param {?} tagName
     * @param {?} propName
     * @param {?} isAttribute
     * @return {?}
     */
    DomElementSchemaRegistry.prototype.securityContext = function (tagName, propName, isAttribute) {
        if (isAttribute) {
            // NB: For security purposes, use the mapped property name, not the attribute name.
            propName = this.getMappedPropName(propName);
        }
        // Make sure comparisons are case insensitive, so that case differences between attribute and
        // property names do not have a security impact.
        tagName = tagName.toLowerCase();
        propName = propName.toLowerCase();
        var /** @type {?} */ ctx = SECURITY_SCHEMA[tagName + '|' + propName];
        if (ctx) {
            return ctx;
        }
        ctx = SECURITY_SCHEMA['*|' + propName];
        return ctx ? ctx : SecurityContext.NONE;
    };
    /**
     * @param {?} propName
     * @return {?}
     */
    DomElementSchemaRegistry.prototype.getMappedPropName = function (propName) { return _ATTR_TO_PROP[propName] || propName; };
    /**
     * @return {?}
     */
    DomElementSchemaRegistry.prototype.getDefaultComponentElementName = function () { return 'ng-component'; };
    /**
     * @param {?} name
     * @return {?}
     */
    DomElementSchemaRegistry.prototype.validateProperty = function (name) {
        if (name.toLowerCase().startsWith('on')) {
            var /** @type {?} */ msg = "Binding to event property '" + name + "' is disallowed for security reasons, " +
                ("please use (" + name.slice(2) + ")=...") +
                ("\nIf '" + name + "' is a directive input, make sure the directive is imported by the") +
                " current module.";
            return { error: true, msg: msg };
        }
        else {
            return { error: false };
        }
    };
    /**
     * @param {?} name
     * @return {?}
     */
    DomElementSchemaRegistry.prototype.validateAttribute = function (name) {
        if (name.toLowerCase().startsWith('on')) {
            var /** @type {?} */ msg = "Binding to event attribute '" + name + "' is disallowed for security reasons, " +
                ("please use (" + name.slice(2) + ")=...");
            return { error: true, msg: msg };
        }
        else {
            return { error: false };
        }
    };
    /**
     * @return {?}
     */
    DomElementSchemaRegistry.prototype.allKnownElementNames = function () { return Object.keys(this._schema); };
    /**
     * @param {?} propName
     * @return {?}
     */
    DomElementSchemaRegistry.prototype.normalizeAnimationStyleProperty = function (propName) {
        return dashCaseToCamelCase(propName);
    };
    /**
     * @param {?} camelCaseProp
     * @param {?} userProvidedProp
     * @param {?} val
     * @return {?}
     */
    DomElementSchemaRegistry.prototype.normalizeAnimationStyleValue = function (camelCaseProp, userProvidedProp, val) {
        var /** @type {?} */ unit = '';
        var /** @type {?} */ strVal = val.toString().trim();
        var /** @type {?} */ errorMsg = ((null));
        if (_isPixelDimensionStyle(camelCaseProp) && val !== 0 && val !== '0') {
            if (typeof val === 'number') {
                unit = 'px';
            }
            else {
                var /** @type {?} */ valAndSuffixMatch = val.match(/^[+-]?[\d\.]+([a-z]*)$/);
                if (valAndSuffixMatch && valAndSuffixMatch[1].length == 0) {
                    errorMsg = "Please provide a CSS unit value for " + userProvidedProp + ":" + val;
                }
            }
        }
        return { error: errorMsg, value: strVal + unit };
    };
    return DomElementSchemaRegistry;
}(ElementSchemaRegistry));
DomElementSchemaRegistry.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
DomElementSchemaRegistry.ctorParameters = function () { return []; };
/**
 * @param {?} prop
 * @return {?}
 */
function _isPixelDimensionStyle(prop) {
    switch (prop) {
        case 'width':
        case 'height':
        case 'minWidth':
        case 'minHeight':
        case 'maxWidth':
        case 'maxHeight':
        case 'left':
        case 'top':
        case 'bottom':
        case 'right':
        case 'fontSize':
        case 'outlineWidth':
        case 'outlineOffset':
        case 'paddingTop':
        case 'paddingLeft':
        case 'paddingBottom':
        case 'paddingRight':
        case 'marginTop':
        case 'marginLeft':
        case 'marginBottom':
        case 'marginRight':
        case 'borderRadius':
        case 'borderWidth':
        case 'borderTopWidth':
        case 'borderLeftWidth':
        case 'borderRightWidth':
        case 'borderBottomWidth':
        case 'textIndent':
            return true;
        default:
            return false;
    }
}
var ShadowCss = (function () {
    function ShadowCss() {
        this.strictStyling = true;
    }
    /**
     * @param {?} cssText
     * @param {?} selector
     * @param {?=} hostSelector
     * @return {?}
     */
    ShadowCss.prototype.shimCssText = function (cssText, selector, hostSelector) {
        if (hostSelector === void 0) { hostSelector = ''; }
        var /** @type {?} */ sourceMappingUrl = extractSourceMappingUrl(cssText);
        cssText = stripComments(cssText);
        cssText = this._insertDirectives(cssText);
        return this._scopeCssText(cssText, selector, hostSelector) + sourceMappingUrl;
    };
    /**
     * @param {?} cssText
     * @return {?}
     */
    ShadowCss.prototype._insertDirectives = function (cssText) {
        cssText = this._insertPolyfillDirectivesInCssText(cssText);
        return this._insertPolyfillRulesInCssText(cssText);
    };
    /**
     * @param {?} cssText
     * @return {?}
     */
    ShadowCss.prototype._insertPolyfillDirectivesInCssText = function (cssText) {
        // Difference with webcomponents.js: does not handle comments
        return cssText.replace(_cssContentNextSelectorRe, function () {
            var m = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                m[_i] = arguments[_i];
            }
            return m[2] + '{';
        });
    };
    /**
     * @param {?} cssText
     * @return {?}
     */
    ShadowCss.prototype._insertPolyfillRulesInCssText = function (cssText) {
        // Difference with webcomponents.js: does not handle comments
        return cssText.replace(_cssContentRuleRe, function () {
            var m = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                m[_i] = arguments[_i];
            }
            var /** @type {?} */ rule = m[0].replace(m[1], '').replace(m[2], '');
            return m[4] + rule;
        });
    };
    /**
     * @param {?} cssText
     * @param {?} scopeSelector
     * @param {?} hostSelector
     * @return {?}
     */
    ShadowCss.prototype._scopeCssText = function (cssText, scopeSelector, hostSelector) {
        var /** @type {?} */ unscopedRules = this._extractUnscopedRulesFromCssText(cssText);
        // replace :host and :host-context -shadowcsshost and -shadowcsshost respectively
        cssText = this._insertPolyfillHostInCssText(cssText);
        cssText = this._convertColonHost(cssText);
        cssText = this._convertColonHostContext(cssText);
        cssText = this._convertShadowDOMSelectors(cssText);
        if (scopeSelector) {
            cssText = this._scopeSelectors(cssText, scopeSelector, hostSelector);
        }
        cssText = cssText + '\n' + unscopedRules;
        return cssText.trim();
    };
    /**
     * @param {?} cssText
     * @return {?}
     */
    ShadowCss.prototype._extractUnscopedRulesFromCssText = function (cssText) {
        // Difference with webcomponents.js: does not handle comments
        var /** @type {?} */ r = '';
        var /** @type {?} */ m;
        _cssContentUnscopedRuleRe.lastIndex = 0;
        while ((m = _cssContentUnscopedRuleRe.exec(cssText)) !== null) {
            var /** @type {?} */ rule = m[0].replace(m[2], '').replace(m[1], m[4]);
            r += rule + '\n\n';
        }
        return r;
    };
    /**
     * @param {?} cssText
     * @return {?}
     */
    ShadowCss.prototype._convertColonHost = function (cssText) {
        return this._convertColonRule(cssText, _cssColonHostRe, this._colonHostPartReplacer);
    };
    /**
     * @param {?} cssText
     * @return {?}
     */
    ShadowCss.prototype._convertColonHostContext = function (cssText) {
        return this._convertColonRule(cssText, _cssColonHostContextRe, this._colonHostContextPartReplacer);
    };
    /**
     * @param {?} cssText
     * @param {?} regExp
     * @param {?} partReplacer
     * @return {?}
     */
    ShadowCss.prototype._convertColonRule = function (cssText, regExp, partReplacer) {
        // m[1] = :host(-context), m[2] = contents of (), m[3] rest of rule
        return cssText.replace(regExp, function () {
            var m = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                m[_i] = arguments[_i];
            }
            if (m[2]) {
                var /** @type {?} */ parts = m[2].split(',');
                var /** @type {?} */ r = [];
                for (var /** @type {?} */ i = 0; i < parts.length; i++) {
                    var /** @type {?} */ p = parts[i].trim();
                    if (!p)
                        break;
                    r.push(partReplacer(_polyfillHostNoCombinator, p, m[3]));
                }
                return r.join(',');
            }
            else {
                return _polyfillHostNoCombinator + m[3];
            }
        });
    };
    /**
     * @param {?} host
     * @param {?} part
     * @param {?} suffix
     * @return {?}
     */
    ShadowCss.prototype._colonHostContextPartReplacer = function (host, part, suffix) {
        if (part.indexOf(_polyfillHost) > -1) {
            return this._colonHostPartReplacer(host, part, suffix);
        }
        else {
            return host + part + suffix + ', ' + part + ' ' + host + suffix;
        }
    };
    /**
     * @param {?} host
     * @param {?} part
     * @param {?} suffix
     * @return {?}
     */
    ShadowCss.prototype._colonHostPartReplacer = function (host, part, suffix) {
        return host + part.replace(_polyfillHost, '') + suffix;
    };
    /**
     * @param {?} cssText
     * @return {?}
     */
    ShadowCss.prototype._convertShadowDOMSelectors = function (cssText) {
        return _shadowDOMSelectorsRe.reduce(function (result, pattern) { return result.replace(pattern, ' '); }, cssText);
    };
    /**
     * @param {?} cssText
     * @param {?} scopeSelector
     * @param {?} hostSelector
     * @return {?}
     */
    ShadowCss.prototype._scopeSelectors = function (cssText, scopeSelector, hostSelector) {
        var _this = this;
        return processRules(cssText, function (rule) {
            var /** @type {?} */ selector = rule.selector;
            var /** @type {?} */ content = rule.content;
            if (rule.selector[0] != '@') {
                selector =
                    _this._scopeSelector(rule.selector, scopeSelector, hostSelector, _this.strictStyling);
            }
            else if (rule.selector.startsWith('@media') || rule.selector.startsWith('@supports') ||
                rule.selector.startsWith('@page') || rule.selector.startsWith('@document')) {
                content = _this._scopeSelectors(rule.content, scopeSelector, hostSelector);
            }
            return new CssRule(selector, content);
        });
    };
    /**
     * @param {?} selector
     * @param {?} scopeSelector
     * @param {?} hostSelector
     * @param {?} strict
     * @return {?}
     */
    ShadowCss.prototype._scopeSelector = function (selector, scopeSelector, hostSelector, strict) {
        var _this = this;
        return selector.split(',')
            .map(function (part) { return part.trim().split(_shadowDeepSelectors); })
            .map(function (deepParts) {
            var shallowPart = deepParts[0], otherParts = deepParts.slice(1);
            var /** @type {?} */ applyScope = function (shallowPart) {
                if (_this._selectorNeedsScoping(shallowPart, scopeSelector)) {
                    return strict ?
                        _this._applyStrictSelectorScope(shallowPart, scopeSelector, hostSelector) :
                        _this._applySelectorScope(shallowPart, scopeSelector, hostSelector);
                }
                else {
                    return shallowPart;
                }
            };
            return [applyScope(shallowPart)].concat(otherParts).join(' ');
        })
            .join(', ');
    };
    /**
     * @param {?} selector
     * @param {?} scopeSelector
     * @return {?}
     */
    ShadowCss.prototype._selectorNeedsScoping = function (selector, scopeSelector) {
        var /** @type {?} */ re = this._makeScopeMatcher(scopeSelector);
        return !re.test(selector);
    };
    /**
     * @param {?} scopeSelector
     * @return {?}
     */
    ShadowCss.prototype._makeScopeMatcher = function (scopeSelector) {
        var /** @type {?} */ lre = /\[/g;
        var /** @type {?} */ rre = /\]/g;
        scopeSelector = scopeSelector.replace(lre, '\\[').replace(rre, '\\]');
        return new RegExp('^(' + scopeSelector + ')' + _selectorReSuffix, 'm');
    };
    /**
     * @param {?} selector
     * @param {?} scopeSelector
     * @param {?} hostSelector
     * @return {?}
     */
    ShadowCss.prototype._applySelectorScope = function (selector, scopeSelector, hostSelector) {
        // Difference from webcomponents.js: scopeSelector could not be an array
        return this._applySimpleSelectorScope(selector, scopeSelector, hostSelector);
    };
    /**
     * @param {?} selector
     * @param {?} scopeSelector
     * @param {?} hostSelector
     * @return {?}
     */
    ShadowCss.prototype._applySimpleSelectorScope = function (selector, scopeSelector, hostSelector) {
        // In Android browser, the lastIndex is not reset when the regex is used in String.replace()
        _polyfillHostRe.lastIndex = 0;
        if (_polyfillHostRe.test(selector)) {
            var /** @type {?} */ replaceBy_1 = this.strictStyling ? "[" + hostSelector + "]" : scopeSelector;
            return selector
                .replace(_polyfillHostNoCombinatorRe, function (hnc, selector) {
                return selector.replace(/([^:]*)(:*)(.*)/, function (_, before, colon, after) {
                    return before + replaceBy_1 + colon + after;
                });
            })
                .replace(_polyfillHostRe, replaceBy_1 + ' ');
        }
        return scopeSelector + ' ' + selector;
    };
    /**
     * @param {?} selector
     * @param {?} scopeSelector
     * @param {?} hostSelector
     * @return {?}
     */
    ShadowCss.prototype._applyStrictSelectorScope = function (selector, scopeSelector, hostSelector) {
        var _this = this;
        var /** @type {?} */ isRe = /\[is=([^\]]*)\]/g;
        scopeSelector = scopeSelector.replace(isRe, function (_) {
            var parts = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                parts[_i - 1] = arguments[_i];
            }
            return parts[0];
        });
        var /** @type {?} */ attrName = '[' + scopeSelector + ']';
        var /** @type {?} */ _scopeSelectorPart = function (p) {
            var /** @type {?} */ scopedP = p.trim();
            if (!scopedP) {
                return '';
            }
            if (p.indexOf(_polyfillHostNoCombinator) > -1) {
                scopedP = _this._applySimpleSelectorScope(p, scopeSelector, hostSelector);
            }
            else {
                // remove :host since it should be unnecessary
                var /** @type {?} */ t = p.replace(_polyfillHostRe, '');
                if (t.length > 0) {
                    var /** @type {?} */ matches = t.match(/([^:]*)(:*)(.*)/);
                    if (matches) {
                        scopedP = matches[1] + attrName + matches[2] + matches[3];
                    }
                }
            }
            return scopedP;
        };
        var /** @type {?} */ safeContent = new SafeSelector(selector);
        selector = safeContent.content();
        var /** @type {?} */ scopedSelector = '';
        var /** @type {?} */ startIndex = 0;
        var /** @type {?} */ res;
        var /** @type {?} */ sep = /( |>|\+|~(?!=))\s*/g;
        var /** @type {?} */ scopeAfter = selector.indexOf(_polyfillHostNoCombinator);
        while ((res = sep.exec(selector)) !== null) {
            var /** @type {?} */ separator = res[1];
            var /** @type {?} */ part = selector.slice(startIndex, res.index).trim();
            // if a selector appears before :host-context it should not be shimmed as it
            // matches on ancestor elements and not on elements in the host's shadow
            var /** @type {?} */ scopedPart = startIndex >= scopeAfter ? _scopeSelectorPart(part) : part;
            scopedSelector += scopedPart + " " + separator + " ";
            startIndex = sep.lastIndex;
        }
        scopedSelector += _scopeSelectorPart(selector.substring(startIndex));
        // replace the placeholders with their original values
        return safeContent.restore(scopedSelector);
    };
    /**
     * @param {?} selector
     * @return {?}
     */
    ShadowCss.prototype._insertPolyfillHostInCssText = function (selector) {
        return selector.replace(_colonHostContextRe, _polyfillHostContext)
            .replace(_colonHostRe, _polyfillHost);
    };
    return ShadowCss;
}());
var SafeSelector = (function () {
    /**
     * @param {?} selector
     */
    function SafeSelector(selector) {
        var _this = this;
        this.placeholders = [];
        this.index = 0;
        // Replaces attribute selectors with placeholders.
        // The WS in [attr="va lue"] would otherwise be interpreted as a selector separator.
        selector = selector.replace(/(\[[^\]]*\])/g, function (_, keep) {
            var replaceBy = "__ph-" + _this.index + "__";
            _this.placeholders.push(keep);
            _this.index++;
            return replaceBy;
        });
        // Replaces the expression in `:nth-child(2n + 1)` with a placeholder.
        // WS and "+" would otherwise be interpreted as selector separators.
        this._content = selector.replace(/(:nth-[-\w]+)(\([^)]+\))/g, function (_, pseudo, exp) {
            var replaceBy = "__ph-" + _this.index + "__";
            _this.placeholders.push(exp);
            _this.index++;
            return pseudo + replaceBy;
        });
    }
    ;
    /**
     * @param {?} content
     * @return {?}
     */
    SafeSelector.prototype.restore = function (content) {
        var _this = this;
        return content.replace(/__ph-(\d+)__/g, function (ph, index) { return _this.placeholders[+index]; });
    };
    /**
     * @return {?}
     */
    SafeSelector.prototype.content = function () { return this._content; };
    return SafeSelector;
}());
var _cssContentNextSelectorRe = /polyfill-next-selector[^}]*content:[\s]*?(['"])(.*?)\1[;\s]*}([^{]*?){/gim;
var _cssContentRuleRe = /(polyfill-rule)[^}]*(content:[\s]*(['"])(.*?)\3)[;\s]*[^}]*}/gim;
var _cssContentUnscopedRuleRe = /(polyfill-unscoped-rule)[^}]*(content:[\s]*(['"])(.*?)\3)[;\s]*[^}]*}/gim;
var _polyfillHost = '-shadowcsshost';
// note: :host-context pre-processed to -shadowcsshostcontext.
var _polyfillHostContext = '-shadowcsscontext';
var _parenSuffix = ')(?:\\((' +
    '(?:\\([^)(]*\\)|[^)(]*)+?' +
    ')\\))?([^,{]*)';
var _cssColonHostRe = new RegExp('(' + _polyfillHost + _parenSuffix, 'gim');
var _cssColonHostContextRe = new RegExp('(' + _polyfillHostContext + _parenSuffix, 'gim');
var _polyfillHostNoCombinator = _polyfillHost + '-no-combinator';
var _polyfillHostNoCombinatorRe = /-shadowcsshost-no-combinator([^\s]*)/;
var _shadowDOMSelectorsRe = [
    /::shadow/g,
    /::content/g,
    // Deprecated selectors
    /\/shadow-deep\//g,
    /\/shadow\//g,
];
var _shadowDeepSelectors = /(?:>>>)|(?:\/deep\/)/g;
var _selectorReSuffix = '([>\\s~+\[.,{:][\\s\\S]*)?$';
var _polyfillHostRe = /-shadowcsshost/gim;
var _colonHostRe = /:host/gim;
var _colonHostContextRe = /:host-context/gim;
var _commentRe = /\/\*\s*[\s\S]*?\*\//g;
/**
 * @param {?} input
 * @return {?}
 */
function stripComments(input) {
    return input.replace(_commentRe, '');
}
// all comments except inline source mapping
var _sourceMappingUrlRe = /\/\*\s*#\s*sourceMappingURL=[\s\S]+?\*\//;
/**
 * @param {?} input
 * @return {?}
 */
function extractSourceMappingUrl(input) {
    var /** @type {?} */ matcher = input.match(_sourceMappingUrlRe);
    return matcher ? matcher[0] : '';
}
var _ruleRe = /(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g;
var _curlyRe = /([{}])/g;
var OPEN_CURLY = '{';
var CLOSE_CURLY = '}';
var BLOCK_PLACEHOLDER = '%BLOCK%';
var CssRule = (function () {
    /**
     * @param {?} selector
     * @param {?} content
     */
    function CssRule(selector, content) {
        this.selector = selector;
        this.content = content;
    }
    return CssRule;
}());
/**
 * @param {?} input
 * @param {?} ruleCallback
 * @return {?}
 */
function processRules(input, ruleCallback) {
    var /** @type {?} */ inputWithEscapedBlocks = escapeBlocks(input);
    var /** @type {?} */ nextBlockIndex = 0;
    return inputWithEscapedBlocks.escapedString.replace(_ruleRe, function () {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
        }
        var /** @type {?} */ selector = m[2];
        var /** @type {?} */ content = '';
        var /** @type {?} */ suffix = m[4];
        var /** @type {?} */ contentPrefix = '';
        if (suffix && suffix.startsWith('{' + BLOCK_PLACEHOLDER)) {
            content = inputWithEscapedBlocks.blocks[nextBlockIndex++];
            suffix = suffix.substring(BLOCK_PLACEHOLDER.length + 1);
            contentPrefix = '{';
        }
        var /** @type {?} */ rule = ruleCallback(new CssRule(selector, content));
        return "" + m[1] + rule.selector + m[3] + contentPrefix + rule.content + suffix;
    });
}
var StringWithEscapedBlocks = (function () {
    /**
     * @param {?} escapedString
     * @param {?} blocks
     */
    function StringWithEscapedBlocks(escapedString, blocks) {
        this.escapedString = escapedString;
        this.blocks = blocks;
    }
    return StringWithEscapedBlocks;
}());
/**
 * @param {?} input
 * @return {?}
 */
function escapeBlocks(input) {
    var /** @type {?} */ inputParts = input.split(_curlyRe);
    var /** @type {?} */ resultParts = [];
    var /** @type {?} */ escapedBlocks = [];
    var /** @type {?} */ bracketCount = 0;
    var /** @type {?} */ currentBlockParts = [];
    for (var /** @type {?} */ partIndex = 0; partIndex < inputParts.length; partIndex++) {
        var /** @type {?} */ part = inputParts[partIndex];
        if (part == CLOSE_CURLY) {
            bracketCount--;
        }
        if (bracketCount > 0) {
            currentBlockParts.push(part);
        }
        else {
            if (currentBlockParts.length > 0) {
                escapedBlocks.push(currentBlockParts.join(''));
                resultParts.push(BLOCK_PLACEHOLDER);
                currentBlockParts = [];
            }
            resultParts.push(part);
        }
        if (part == OPEN_CURLY) {
            bracketCount++;
        }
    }
    if (currentBlockParts.length > 0) {
        escapedBlocks.push(currentBlockParts.join(''));
        resultParts.push(BLOCK_PLACEHOLDER);
    }
    return new StringWithEscapedBlocks(resultParts.join(''), escapedBlocks);
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var COMPONENT_VARIABLE = '%COMP%';
var HOST_ATTR = "_nghost-" + COMPONENT_VARIABLE;
var CONTENT_ATTR = "_ngcontent-" + COMPONENT_VARIABLE;
var StylesCompileDependency = (function () {
    /**
     * @param {?} name
     * @param {?} moduleUrl
     * @param {?} isShimmed
     * @param {?} valuePlaceholder
     */
    function StylesCompileDependency(name, moduleUrl, isShimmed, valuePlaceholder) {
        this.name = name;
        this.moduleUrl = moduleUrl;
        this.isShimmed = isShimmed;
        this.valuePlaceholder = valuePlaceholder;
    }
    return StylesCompileDependency;
}());
var StylesCompileResult = (function () {
    /**
     * @param {?} componentStylesheet
     * @param {?} externalStylesheets
     */
    function StylesCompileResult(componentStylesheet, externalStylesheets) {
        this.componentStylesheet = componentStylesheet;
        this.externalStylesheets = externalStylesheets;
    }
    return StylesCompileResult;
}());
var CompiledStylesheet = (function () {
    /**
     * @param {?} statements
     * @param {?} stylesVar
     * @param {?} dependencies
     * @param {?} isShimmed
     * @param {?} meta
     */
    function CompiledStylesheet(statements, stylesVar, dependencies, isShimmed, meta) {
        this.statements = statements;
        this.stylesVar = stylesVar;
        this.dependencies = dependencies;
        this.isShimmed = isShimmed;
        this.meta = meta;
    }
    return CompiledStylesheet;
}());
var StyleCompiler = (function () {
    /**
     * @param {?} _urlResolver
     */
    function StyleCompiler(_urlResolver) {
        this._urlResolver = _urlResolver;
        this._shadowCss = new ShadowCss();
    }
    /**
     * @param {?} comp
     * @return {?}
     */
    StyleCompiler.prototype.compileComponent = function (comp) {
        var _this = this;
        var /** @type {?} */ template = ((comp.template));
        var /** @type {?} */ externalStylesheets = [];
        var /** @type {?} */ componentStylesheet = this._compileStyles(comp, new CompileStylesheetMetadata({
            styles: template.styles,
            styleUrls: template.styleUrls,
            moduleUrl: identifierModuleUrl(comp.type)
        }), true);
        template.externalStylesheets.forEach(function (stylesheetMeta) {
            var /** @type {?} */ compiledStylesheet = _this._compileStyles(comp, stylesheetMeta, false);
            externalStylesheets.push(compiledStylesheet);
        });
        return new StylesCompileResult(componentStylesheet, externalStylesheets);
    };
    /**
     * @param {?} comp
     * @param {?} stylesheet
     * @param {?} isComponentStylesheet
     * @return {?}
     */
    StyleCompiler.prototype._compileStyles = function (comp, stylesheet, isComponentStylesheet) {
        var _this = this;
        var /** @type {?} */ shim = ((comp.template)).encapsulation === ViewEncapsulation.Emulated;
        var /** @type {?} */ styleExpressions = stylesheet.styles.map(function (plainStyle) { return literal(_this._shimIfNeeded(plainStyle, shim)); });
        var /** @type {?} */ dependencies = [];
        for (var /** @type {?} */ i = 0; i < stylesheet.styleUrls.length; i++) {
            var /** @type {?} */ identifier = { reference: null };
            dependencies.push(new StylesCompileDependency(getStylesVarName(null), stylesheet.styleUrls[i], shim, identifier));
            styleExpressions.push(new ExternalExpr(identifier));
        }
        // styles variable contains plain strings and arrays of other styles arrays (recursive),
        // so we set its type to dynamic.
        var /** @type {?} */ stylesVar = getStylesVarName(isComponentStylesheet ? comp : null);
        var /** @type {?} */ stmt = variable(stylesVar)
            .set(literalArr(styleExpressions, new ArrayType(DYNAMIC_TYPE, [TypeModifier.Const])))
            .toDeclStmt(null, [StmtModifier.Final]);
        return new CompiledStylesheet([stmt], stylesVar, dependencies, shim, stylesheet);
    };
    /**
     * @param {?} style
     * @param {?} shim
     * @return {?}
     */
    StyleCompiler.prototype._shimIfNeeded = function (style$$1, shim) {
        return shim ? this._shadowCss.shimCssText(style$$1, CONTENT_ATTR, HOST_ATTR) : style$$1;
    };
    return StyleCompiler;
}());
StyleCompiler.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
StyleCompiler.ctorParameters = function () { return [
    { type: UrlResolver, },
]; };
/**
 * @param {?} component
 * @return {?}
 */
function getStylesVarName(component) {
    var /** @type {?} */ result = "styles";
    if (component) {
        result += "_" + identifierName(component.type);
    }
    return result;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var EventHandlerVars = (function () {
    function EventHandlerVars() {
    }
    return EventHandlerVars;
}());
EventHandlerVars.event = variable('$event');
var ConvertActionBindingResult = (function () {
    /**
     * @param {?} stmts
     * @param {?} allowDefault
     */
    function ConvertActionBindingResult(stmts, allowDefault) {
        this.stmts = stmts;
        this.allowDefault = allowDefault;
    }
    return ConvertActionBindingResult;
}());
/**
 * Converts the given expression AST into an executable output AST, assuming the expression is
 * used in an action binding (e.g. an event handler).
 * @param {?} localResolver
 * @param {?} implicitReceiver
 * @param {?} action
 * @param {?} bindingId
 * @return {?}
 */
function convertActionBinding(localResolver, implicitReceiver, action, bindingId) {
    if (!localResolver) {
        localResolver = new DefaultLocalResolver();
    }
    var /** @type {?} */ actionWithoutBuiltins = convertPropertyBindingBuiltins({
        createLiteralArrayConverter: function (argCount) {
            // Note: no caching for literal arrays in actions.
            return function (args) { return literalArr(args); };
        },
        createLiteralMapConverter: function (keys) {
            // Note: no caching for literal maps in actions.
            return function (args) { return literalMap(/** @type {?} */ (keys.map(function (key, i) { return [key, args[i]]; }))); };
        },
        createPipeConverter: function (name) {
            throw new Error("Illegal State: Actions are not allowed to contain pipes. Pipe: " + name);
        }
    }, action);
    var /** @type {?} */ visitor = new _AstToIrVisitor(localResolver, implicitReceiver, bindingId);
    var /** @type {?} */ actionStmts = [];
    flattenStatements(actionWithoutBuiltins.visit(visitor, _Mode.Statement), actionStmts);
    prependTemporaryDecls(visitor.temporaryCount, bindingId, actionStmts);
    var /** @type {?} */ lastIndex = actionStmts.length - 1;
    var /** @type {?} */ preventDefaultVar = ((null));
    if (lastIndex >= 0) {
        var /** @type {?} */ lastStatement = actionStmts[lastIndex];
        var /** @type {?} */ returnExpr = convertStmtIntoExpression(lastStatement);
        if (returnExpr) {
            // Note: We need to cast the result of the method call to dynamic,
            // as it might be a void method!
            preventDefaultVar = createPreventDefaultVar(bindingId);
            actionStmts[lastIndex] =
                preventDefaultVar.set(returnExpr.cast(DYNAMIC_TYPE).notIdentical(literal(false)))
                    .toDeclStmt(null, [StmtModifier.Final]);
        }
    }
    return new ConvertActionBindingResult(actionStmts, preventDefaultVar);
}
/**
 * @param {?} converterFactory
 * @param {?} ast
 * @return {?}
 */
function convertPropertyBindingBuiltins(converterFactory, ast) {
    return convertBuiltins(converterFactory, ast);
}
var ConvertPropertyBindingResult = (function () {
    /**
     * @param {?} stmts
     * @param {?} currValExpr
     */
    function ConvertPropertyBindingResult(stmts, currValExpr) {
        this.stmts = stmts;
        this.currValExpr = currValExpr;
    }
    return ConvertPropertyBindingResult;
}());
/**
 * Converts the given expression AST into an executable output AST, assuming the expression
 * is used in property binding. The expression has to be preprocessed via
 * `convertPropertyBindingBuiltins`.
 * @param {?} localResolver
 * @param {?} implicitReceiver
 * @param {?} expressionWithoutBuiltins
 * @param {?} bindingId
 * @return {?}
 */
function convertPropertyBinding(localResolver, implicitReceiver, expressionWithoutBuiltins, bindingId) {
    if (!localResolver) {
        localResolver = new DefaultLocalResolver();
    }
    var /** @type {?} */ currValExpr = createCurrValueExpr(bindingId);
    var /** @type {?} */ stmts = [];
    var /** @type {?} */ visitor = new _AstToIrVisitor(localResolver, implicitReceiver, bindingId);
    var /** @type {?} */ outputExpr = expressionWithoutBuiltins.visit(visitor, _Mode.Expression);
    if (visitor.temporaryCount) {
        for (var /** @type {?} */ i = 0; i < visitor.temporaryCount; i++) {
            stmts.push(temporaryDeclaration(bindingId, i));
        }
    }
    stmts.push(currValExpr.set(outputExpr).toDeclStmt(null, [StmtModifier.Final]));
    return new ConvertPropertyBindingResult(stmts, currValExpr);
}
/**
 * @param {?} converterFactory
 * @param {?} ast
 * @return {?}
 */
function convertBuiltins(converterFactory, ast) {
    var /** @type {?} */ visitor = new _BuiltinAstConverter(converterFactory);
    return ast.visit(visitor);
}
/**
 * @param {?} bindingId
 * @param {?} temporaryNumber
 * @return {?}
 */
function temporaryName(bindingId, temporaryNumber) {
    return "tmp_" + bindingId + "_" + temporaryNumber;
}
/**
 * @param {?} bindingId
 * @param {?} temporaryNumber
 * @return {?}
 */
function temporaryDeclaration(bindingId, temporaryNumber) {
    return new DeclareVarStmt(temporaryName(bindingId, temporaryNumber), NULL_EXPR);
}
/**
 * @param {?} temporaryCount
 * @param {?} bindingId
 * @param {?} statements
 * @return {?}
 */
function prependTemporaryDecls(temporaryCount, bindingId, statements) {
    for (var /** @type {?} */ i = temporaryCount - 1; i >= 0; i--) {
        statements.unshift(temporaryDeclaration(bindingId, i));
    }
}
var _Mode = {};
_Mode.Statement = 0;
_Mode.Expression = 1;
_Mode[_Mode.Statement] = "Statement";
_Mode[_Mode.Expression] = "Expression";
/**
 * @param {?} mode
 * @param {?} ast
 * @return {?}
 */
function ensureStatementMode(mode, ast) {
    if (mode !== _Mode.Statement) {
        throw new Error("Expected a statement, but saw " + ast);
    }
}
/**
 * @param {?} mode
 * @param {?} ast
 * @return {?}
 */
function ensureExpressionMode(mode, ast) {
    if (mode !== _Mode.Expression) {
        throw new Error("Expected an expression, but saw " + ast);
    }
}
/**
 * @param {?} mode
 * @param {?} expr
 * @return {?}
 */
function convertToStatementIfNeeded(mode, expr) {
    if (mode === _Mode.Statement) {
        return expr.toStmt();
    }
    else {
        return expr;
    }
}
var _BuiltinAstConverter = (function (_super) {
    __extends(_BuiltinAstConverter, _super);
    /**
     * @param {?} _converterFactory
     */
    function _BuiltinAstConverter(_converterFactory) {
        var _this = _super.call(this) || this;
        _this._converterFactory = _converterFactory;
        return _this;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    _BuiltinAstConverter.prototype.visitPipe = function (ast, context) {
        var _this = this;
        var /** @type {?} */ args = [ast.exp].concat(ast.args).map(function (ast) { return ast.visit(_this, context); });
        return new BuiltinFunctionCall(ast.span, args, this._converterFactory.createPipeConverter(ast.name, args.length));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    _BuiltinAstConverter.prototype.visitLiteralArray = function (ast, context) {
        var _this = this;
        var /** @type {?} */ args = ast.expressions.map(function (ast) { return ast.visit(_this, context); });
        return new BuiltinFunctionCall(ast.span, args, this._converterFactory.createLiteralArrayConverter(ast.expressions.length));
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    _BuiltinAstConverter.prototype.visitLiteralMap = function (ast, context) {
        var _this = this;
        var /** @type {?} */ args = ast.values.map(function (ast) { return ast.visit(_this, context); });
        return new BuiltinFunctionCall(ast.span, args, this._converterFactory.createLiteralMapConverter(ast.keys));
    };
    return _BuiltinAstConverter;
}(AstTransformer));
var _AstToIrVisitor = (function () {
    /**
     * @param {?} _localResolver
     * @param {?} _implicitReceiver
     * @param {?} bindingId
     */
    function _AstToIrVisitor(_localResolver, _implicitReceiver, bindingId) {
        this._localResolver = _localResolver;
        this._implicitReceiver = _implicitReceiver;
        this.bindingId = bindingId;
        this._nodeMap = new Map();
        this._resultMap = new Map();
        this._currentTemporary = 0;
        this.temporaryCount = 0;
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visitBinary = function (ast, mode) {
        var /** @type {?} */ op;
        switch (ast.operation) {
            case '+':
                op = BinaryOperator.Plus;
                break;
            case '-':
                op = BinaryOperator.Minus;
                break;
            case '*':
                op = BinaryOperator.Multiply;
                break;
            case '/':
                op = BinaryOperator.Divide;
                break;
            case '%':
                op = BinaryOperator.Modulo;
                break;
            case '&&':
                op = BinaryOperator.And;
                break;
            case '||':
                op = BinaryOperator.Or;
                break;
            case '==':
                op = BinaryOperator.Equals;
                break;
            case '!=':
                op = BinaryOperator.NotEquals;
                break;
            case '===':
                op = BinaryOperator.Identical;
                break;
            case '!==':
                op = BinaryOperator.NotIdentical;
                break;
            case '<':
                op = BinaryOperator.Lower;
                break;
            case '>':
                op = BinaryOperator.Bigger;
                break;
            case '<=':
                op = BinaryOperator.LowerEquals;
                break;
            case '>=':
                op = BinaryOperator.BiggerEquals;
                break;
            default:
                throw new Error("Unsupported operation " + ast.operation);
        }
        return convertToStatementIfNeeded(mode, new BinaryOperatorExpr(op, this.visit(ast.left, _Mode.Expression), this.visit(ast.right, _Mode.Expression)));
    };
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visitChain = function (ast, mode) {
        ensureStatementMode(mode, ast);
        return this.visitAll(ast.expressions, mode);
    };
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visitConditional = function (ast, mode) {
        var /** @type {?} */ value = this.visit(ast.condition, _Mode.Expression);
        return convertToStatementIfNeeded(mode, value.conditional(this.visit(ast.trueExp, _Mode.Expression), this.visit(ast.falseExp, _Mode.Expression)));
    };
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visitPipe = function (ast, mode) {
        throw new Error("Illegal state: Pipes should have been converted into functions. Pipe: " + ast.name);
    };
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visitFunctionCall = function (ast, mode) {
        var /** @type {?} */ convertedArgs = this.visitAll(ast.args, _Mode.Expression);
        var /** @type {?} */ fnResult;
        if (ast instanceof BuiltinFunctionCall) {
            fnResult = ast.converter(convertedArgs);
        }
        else {
            fnResult = this.visit(/** @type {?} */ ((ast.target)), _Mode.Expression).callFn(convertedArgs);
        }
        return convertToStatementIfNeeded(mode, fnResult);
    };
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visitImplicitReceiver = function (ast, mode) {
        ensureExpressionMode(mode, ast);
        return this._implicitReceiver;
    };
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visitInterpolation = function (ast, mode) {
        ensureExpressionMode(mode, ast);
        var /** @type {?} */ args = [literal(ast.expressions.length)];
        for (var /** @type {?} */ i = 0; i < ast.strings.length - 1; i++) {
            args.push(literal(ast.strings[i]));
            args.push(this.visit(ast.expressions[i], _Mode.Expression));
        }
        args.push(literal(ast.strings[ast.strings.length - 1]));
        return ast.expressions.length <= 9 ?
            importExpr(createIdentifier(Identifiers.inlineInterpolate)).callFn(args) :
            importExpr(createIdentifier(Identifiers.interpolate)).callFn([
                args[0], literalArr(args.slice(1))
            ]);
    };
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visitKeyedRead = function (ast, mode) {
        var /** @type {?} */ leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
            return this.convertSafeAccess(ast, leftMostSafe, mode);
        }
        else {
            return convertToStatementIfNeeded(mode, this.visit(ast.obj, _Mode.Expression).key(this.visit(ast.key, _Mode.Expression)));
        }
    };
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visitKeyedWrite = function (ast, mode) {
        var /** @type {?} */ obj = this.visit(ast.obj, _Mode.Expression);
        var /** @type {?} */ key = this.visit(ast.key, _Mode.Expression);
        var /** @type {?} */ value = this.visit(ast.value, _Mode.Expression);
        return convertToStatementIfNeeded(mode, obj.key(key).set(value));
    };
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visitLiteralArray = function (ast, mode) {
        throw new Error("Illegal State: literal arrays should have been converted into functions");
    };
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visitLiteralMap = function (ast, mode) {
        throw new Error("Illegal State: literal maps should have been converted into functions");
    };
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visitLiteralPrimitive = function (ast, mode) {
        return convertToStatementIfNeeded(mode, literal(ast.value));
    };
    /**
     * @param {?} name
     * @return {?}
     */
    _AstToIrVisitor.prototype._getLocal = function (name) { return this._localResolver.getLocal(name); };
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visitMethodCall = function (ast, mode) {
        var /** @type {?} */ leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
            return this.convertSafeAccess(ast, leftMostSafe, mode);
        }
        else {
            var /** @type {?} */ args = this.visitAll(ast.args, _Mode.Expression);
            var /** @type {?} */ result = null;
            var /** @type {?} */ receiver = this.visit(ast.receiver, _Mode.Expression);
            if (receiver === this._implicitReceiver) {
                var /** @type {?} */ varExpr = this._getLocal(ast.name);
                if (varExpr) {
                    result = varExpr.callFn(args);
                }
            }
            if (result == null) {
                result = receiver.callMethod(ast.name, args);
            }
            return convertToStatementIfNeeded(mode, result);
        }
    };
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visitPrefixNot = function (ast, mode) {
        return convertToStatementIfNeeded(mode, not(this.visit(ast.expression, _Mode.Expression)));
    };
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visitPropertyRead = function (ast, mode) {
        var /** @type {?} */ leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
            return this.convertSafeAccess(ast, leftMostSafe, mode);
        }
        else {
            var /** @type {?} */ result = null;
            var /** @type {?} */ receiver = this.visit(ast.receiver, _Mode.Expression);
            if (receiver === this._implicitReceiver) {
                result = this._getLocal(ast.name);
            }
            if (result == null) {
                result = receiver.prop(ast.name);
            }
            return convertToStatementIfNeeded(mode, result);
        }
    };
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visitPropertyWrite = function (ast, mode) {
        var /** @type {?} */ receiver = this.visit(ast.receiver, _Mode.Expression);
        if (receiver === this._implicitReceiver) {
            var /** @type {?} */ varExpr = this._getLocal(ast.name);
            if (varExpr) {
                throw new Error('Cannot assign to a reference or variable!');
            }
        }
        return convertToStatementIfNeeded(mode, receiver.prop(ast.name).set(this.visit(ast.value, _Mode.Expression)));
    };
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visitSafePropertyRead = function (ast, mode) {
        return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
    };
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visitSafeMethodCall = function (ast, mode) {
        return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
    };
    /**
     * @param {?} asts
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visitAll = function (asts, mode) {
        var _this = this;
        return asts.map(function (ast) { return _this.visit(ast, mode); });
    };
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visitQuote = function (ast, mode) {
        throw new Error("Quotes are not supported for evaluation!\n        Statement: " + ast.uninterpretedExpression + " located at " + ast.location);
    };
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.visit = function (ast, mode) {
        var /** @type {?} */ result = this._resultMap.get(ast);
        if (result)
            return result;
        return (this._nodeMap.get(ast) || ast).visit(this, mode);
    };
    /**
     * @param {?} ast
     * @param {?} leftMostSafe
     * @param {?} mode
     * @return {?}
     */
    _AstToIrVisitor.prototype.convertSafeAccess = function (ast, leftMostSafe, mode) {
        // If the expression contains a safe access node on the left it needs to be converted to
        // an expression that guards the access to the member by checking the receiver for blank. As
        // execution proceeds from left to right, the left most part of the expression must be guarded
        // first but, because member access is left associative, the right side of the expression is at
        // the top of the AST. The desired result requires lifting a copy of the the left part of the
        // expression up to test it for blank before generating the unguarded version.
        // Consider, for example the following expression: a?.b.c?.d.e
        // This results in the ast:
        //         .
        //        / \
        //       ?.   e
        //      /  \
        //     .    d
        //    / \
        //   ?.  c
        //  /  \
        // a    b
        // The following tree should be generated:
        //
        //        /---- ? ----\
        //       /      |      \
        //     a   /--- ? ---\  null
        //        /     |     \
        //       .      .     null
        //      / \    / \
        //     .  c   .   e
        //    / \    / \
        //   a   b  ,   d
        //         / \
        //        .   c
        //       / \
        //      a   b
        //
        // Notice that the first guard condition is the left hand of the left most safe access node
        // which comes in as leftMostSafe to this routine.
        var /** @type {?} */ guardedExpression = this.visit(leftMostSafe.receiver, _Mode.Expression);
        var /** @type {?} */ temporary = ((undefined));
        if (this.needsTemporary(leftMostSafe.receiver)) {
            // If the expression has method calls or pipes then we need to save the result into a
            // temporary variable to avoid calling stateful or impure code more than once.
            temporary = this.allocateTemporary();
            // Preserve the result in the temporary variable
            guardedExpression = temporary.set(guardedExpression);
            // Ensure all further references to the guarded expression refer to the temporary instead.
            this._resultMap.set(leftMostSafe.receiver, temporary);
        }
        var /** @type {?} */ condition = guardedExpression.isBlank();
        // Convert the ast to an unguarded access to the receiver's member. The map will substitute
        // leftMostNode with its unguarded version in the call to `this.visit()`.
        if (leftMostSafe instanceof SafeMethodCall) {
            this._nodeMap.set(leftMostSafe, new MethodCall(leftMostSafe.span, leftMostSafe.receiver, leftMostSafe.name, leftMostSafe.args));
        }
        else {
            this._nodeMap.set(leftMostSafe, new PropertyRead(leftMostSafe.span, leftMostSafe.receiver, leftMostSafe.name));
        }
        // Recursively convert the node now without the guarded member access.
        var /** @type {?} */ access = this.visit(ast, _Mode.Expression);
        // Remove the mapping. This is not strictly required as the converter only traverses each node
        // once but is safer if the conversion is changed to traverse the nodes more than once.
        this._nodeMap.delete(leftMostSafe);
        // If we allocated a temporary, release it.
        if (temporary) {
            this.releaseTemporary(temporary);
        }
        // Produce the conditional
        return convertToStatementIfNeeded(mode, condition.conditional(literal(null), access));
    };
    /**
     * @param {?} ast
     * @return {?}
     */
    _AstToIrVisitor.prototype.leftMostSafeNode = function (ast) {
        var _this = this;
        var /** @type {?} */ visit = function (visitor, ast) {
            return (_this._nodeMap.get(ast) || ast).visit(visitor);
        };
        return ast.visit({
            /**
             * @param {?} ast
             * @return {?}
             */
            visitBinary: function (ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitChain: function (ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitConditional: function (ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitFunctionCall: function (ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitImplicitReceiver: function (ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitInterpolation: function (ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitKeyedRead: function (ast) { return visit(this, ast.obj); },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitKeyedWrite: function (ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitLiteralArray: function (ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitLiteralMap: function (ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitLiteralPrimitive: function (ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitMethodCall: function (ast) { return visit(this, ast.receiver); },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPipe: function (ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPrefixNot: function (ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPropertyRead: function (ast) { return visit(this, ast.receiver); },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPropertyWrite: function (ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitQuote: function (ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitSafeMethodCall: function (ast) { return visit(this, ast.receiver) || ast; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitSafePropertyRead: function (ast) {
                return visit(this, ast.receiver) || ast;
            }
        });
    };
    /**
     * @param {?} ast
     * @return {?}
     */
    _AstToIrVisitor.prototype.needsTemporary = function (ast) {
        var _this = this;
        var /** @type {?} */ visit = function (visitor, ast) {
            return ast && (_this._nodeMap.get(ast) || ast).visit(visitor);
        };
        var /** @type {?} */ visitSome = function (visitor, ast) {
            return ast.some(function (ast) { return visit(visitor, ast); });
        };
        return ast.visit({
            /**
             * @param {?} ast
             * @return {?}
             */
            visitBinary: function (ast) { return visit(this, ast.left) || visit(this, ast.right); },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitChain: function (ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitConditional: function (ast) {
                return visit(this, ast.condition) || visit(this, ast.trueExp) ||
                    visit(this, ast.falseExp);
            },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitFunctionCall: function (ast) { return true; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitImplicitReceiver: function (ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitInterpolation: function (ast) { return visitSome(this, ast.expressions); },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitKeyedRead: function (ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitKeyedWrite: function (ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitLiteralArray: function (ast) { return true; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitLiteralMap: function (ast) { return true; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitLiteralPrimitive: function (ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitMethodCall: function (ast) { return true; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPipe: function (ast) { return true; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPrefixNot: function (ast) { return visit(this, ast.expression); },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPropertyRead: function (ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPropertyWrite: function (ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitQuote: function (ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitSafeMethodCall: function (ast) { return true; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitSafePropertyRead: function (ast) { return false; }
        });
    };
    /**
     * @return {?}
     */
    _AstToIrVisitor.prototype.allocateTemporary = function () {
        var /** @type {?} */ tempNumber = this._currentTemporary++;
        this.temporaryCount = Math.max(this._currentTemporary, this.temporaryCount);
        return new ReadVarExpr(temporaryName(this.bindingId, tempNumber));
    };
    /**
     * @param {?} temporary
     * @return {?}
     */
    _AstToIrVisitor.prototype.releaseTemporary = function (temporary) {
        this._currentTemporary--;
        if (temporary.name != temporaryName(this.bindingId, this._currentTemporary)) {
            throw new Error("Temporary " + temporary.name + " released out of order");
        }
    };
    return _AstToIrVisitor;
}());
/**
 * @param {?} arg
 * @param {?} output
 * @return {?}
 */
function flattenStatements(arg, output) {
    if (Array.isArray(arg)) {
        ((arg)).forEach(function (entry) { return flattenStatements(entry, output); });
    }
    else {
        output.push(arg);
    }
}
var DefaultLocalResolver = (function () {
    function DefaultLocalResolver() {
    }
    /**
     * @param {?} name
     * @return {?}
     */
    DefaultLocalResolver.prototype.getLocal = function (name) {
        if (name === EventHandlerVars.event.name) {
            return EventHandlerVars.event;
        }
        return null;
    };
    return DefaultLocalResolver;
}());
/**
 * @param {?} bindingId
 * @return {?}
 */
function createCurrValueExpr(bindingId) {
    return variable("currVal_" + bindingId); // fix syntax highlighting: `
}
/**
 * @param {?} bindingId
 * @return {?}
 */
function createPreventDefaultVar(bindingId) {
    return variable("pd_" + bindingId);
}
/**
 * @param {?} stmt
 * @return {?}
 */
function convertStmtIntoExpression(stmt) {
    if (stmt instanceof ExpressionStatement) {
        return stmt.expr;
    }
    else if (stmt instanceof ReturnStatement) {
        return stmt.value;
    }
    return null;
}
var BuiltinFunctionCall = (function (_super) {
    __extends(BuiltinFunctionCall, _super);
    /**
     * @param {?} span
     * @param {?} args
     * @param {?} converter
     */
    function BuiltinFunctionCall(span, args, converter) {
        var _this = _super.call(this, span, null, args) || this;
        _this.args = args;
        _this.converter = converter;
        return _this;
    }
    return BuiltinFunctionCall;
}(FunctionCall));
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var CLASS_ATTR$1 = 'class';
var STYLE_ATTR = 'style';
var IMPLICIT_TEMPLATE_VAR = '\$implicit';
var ViewCompileResult = (function () {
    /**
     * @param {?} statements
     * @param {?} viewClassVar
     * @param {?} rendererTypeVar
     */
    function ViewCompileResult(statements, viewClassVar, rendererTypeVar) {
        this.statements = statements;
        this.viewClassVar = viewClassVar;
        this.rendererTypeVar = rendererTypeVar;
    }
    return ViewCompileResult;
}());
var ViewCompiler = (function () {
    /**
     * @param {?} _genConfigNext
     * @param {?} _schemaRegistry
     */
    function ViewCompiler(_genConfigNext, _schemaRegistry) {
        this._genConfigNext = _genConfigNext;
        this._schemaRegistry = _schemaRegistry;
    }
    /**
     * @param {?} component
     * @param {?} template
     * @param {?} styles
     * @param {?} usedPipes
     * @return {?}
     */
    ViewCompiler.prototype.compileComponent = function (component, template, styles, usedPipes) {
        var /** @type {?} */ embeddedViewCount = 0;
        var /** @type {?} */ staticQueryIds = findStaticQueryIds(template);
        var /** @type {?} */ statements = [];
        var /** @type {?} */ renderComponentVarName = ((undefined));
        if (!component.isHost) {
            var /** @type {?} */ template_1 = ((component.template));
            var /** @type {?} */ customRenderData = [];
            if (template_1.animations && template_1.animations.length) {
                customRenderData.push(new LiteralMapEntry('animation', convertValueToOutputAst(template_1.animations), true));
            }
            var /** @type {?} */ renderComponentVar = variable(rendererTypeName(component.type.reference));
            renderComponentVarName = ((renderComponentVar.name));
            statements.push(renderComponentVar
                .set(importExpr(createIdentifier(Identifiers.createRendererType2))
                .callFn([new LiteralMapExpr([
                    new LiteralMapEntry('encapsulation', literal(template_1.encapsulation)),
                    new LiteralMapEntry('styles', styles),
                    new LiteralMapEntry('data', new LiteralMapExpr(customRenderData))
                ])]))
                .toDeclStmt(importType(createIdentifier(Identifiers.RendererType2)), [StmtModifier.Final]));
        }
        var /** @type {?} */ viewBuilderFactory = function (parent) {
            var /** @type {?} */ embeddedViewIndex = embeddedViewCount++;
            return new ViewBuilder(parent, component, embeddedViewIndex, usedPipes, staticQueryIds, viewBuilderFactory);
        };
        var /** @type {?} */ visitor = viewBuilderFactory(null);
        visitor.visitAll([], template);
        statements.push.apply(statements, visitor.build());
        return new ViewCompileResult(statements, visitor.viewName, renderComponentVarName);
    };
    return ViewCompiler;
}());
ViewCompiler.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
ViewCompiler.ctorParameters = function () { return [
    { type: CompilerConfig, },
    { type: ElementSchemaRegistry, },
]; };
var LOG_VAR = variable('l');
var VIEW_VAR = variable('v');
var CHECK_VAR = variable('ck');
var COMP_VAR = variable('co');
var EVENT_NAME_VAR = variable('en');
var ALLOW_DEFAULT_VAR = variable("ad");
var ViewBuilder = (function () {
    /**
     * @param {?} parent
     * @param {?} component
     * @param {?} embeddedViewIndex
     * @param {?} usedPipes
     * @param {?} staticQueryIds
     * @param {?} viewBuilderFactory
     */
    function ViewBuilder(parent, component, embeddedViewIndex, usedPipes, staticQueryIds, viewBuilderFactory) {
        this.parent = parent;
        this.component = component;
        this.embeddedViewIndex = embeddedViewIndex;
        this.usedPipes = usedPipes;
        this.staticQueryIds = staticQueryIds;
        this.viewBuilderFactory = viewBuilderFactory;
        this.nodes = [];
        this.purePipeNodeIndices = Object.create(null);
        this.refNodeIndices = Object.create(null);
        this.variables = [];
        this.children = [];
        // TODO(tbosch): The old view compiler used to use an `any` type
        // for the context in any embedded view. We keep this behaivor for now
        // to be able to introduce the new view compiler without too many errors.
        this.compType =
            this.embeddedViewIndex > 0 ? DYNAMIC_TYPE : importType(this.component.type);
    }
    Object.defineProperty(ViewBuilder.prototype, "viewName", {
        /**
         * @return {?}
         */
        get: function () {
            return viewClassName(this.component.type.reference, this.embeddedViewIndex);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} variables
     * @param {?} astNodes
     * @return {?}
     */
    ViewBuilder.prototype.visitAll = function (variables, astNodes) {
        var _this = this;
        this.variables = variables;
        // create the pipes for the pure pipes immediately, so that we know their indices.
        if (!this.parent) {
            this.usedPipes.forEach(function (pipe) {
                if (pipe.pure) {
                    _this.purePipeNodeIndices[pipe.name] = _this._createPipe(null, pipe);
                }
            });
        }
        if (!this.parent) {
            var /** @type {?} */ queryIds_1 = staticViewQueryIds(this.staticQueryIds);
            this.component.viewQueries.forEach(function (query, queryIndex) {
                // Note: queries start with id 1 so we can use the number in a Bloom filter!
                var /** @type {?} */ queryId = queryIndex + 1;
                var /** @type {?} */ bindingType = query.first ? 0 /* First */ : 1;
                var /** @type {?} */ flags = 134217728 /* TypeViewQuery */ | calcStaticDynamicQueryFlags(queryIds_1, queryId, query.first);
                _this.nodes.push(function () { return ({
                    sourceSpan: null,
                    nodeFlags: flags,
                    nodeDef: importExpr(createIdentifier(Identifiers.queryDef)).callFn([
                        literal(flags), literal(queryId),
                        new LiteralMapExpr([new LiteralMapEntry(query.propertyName, literal(bindingType))])
                    ])
                }); });
            });
        }
        templateVisitAll(this, astNodes);
        if (this.parent && (astNodes.length === 0 || needsAdditionalRootNode(astNodes))) {
            // if the view is an embedded view, then we need to add an additional root node in some cases
            this.nodes.push(function () { return ({
                sourceSpan: null,
                nodeFlags: 1 /* TypeElement */,
                nodeDef: importExpr(createIdentifier(Identifiers.anchorDef)).callFn([
                    literal(0 /* None */), NULL_EXPR, NULL_EXPR, literal(0)
                ])
            }); });
        }
    };
    /**
     * @param {?=} targetStatements
     * @return {?}
     */
    ViewBuilder.prototype.build = function (targetStatements) {
        if (targetStatements === void 0) { targetStatements = []; }
        this.children.forEach(function (child) { return child.build(targetStatements); });
        var _a = this._createNodeExpressions(), updateRendererStmts = _a.updateRendererStmts, updateDirectivesStmts = _a.updateDirectivesStmts, nodeDefExprs = _a.nodeDefExprs;
        var /** @type {?} */ updateRendererFn = this._createUpdateFn(updateRendererStmts);
        var /** @type {?} */ updateDirectivesFn = this._createUpdateFn(updateDirectivesStmts);
        var /** @type {?} */ viewFlags = 0;
        if (!this.parent && this.component.changeDetection === ChangeDetectionStrategy.OnPush) {
            viewFlags |= 2 /* OnPush */;
        }
        var /** @type {?} */ viewFactory = new DeclareFunctionStmt(this.viewName, [new FnParam(/** @type {?} */ ((LOG_VAR.name)))], [new ReturnStatement(importExpr(createIdentifier(Identifiers.viewDef)).callFn([
                literal(viewFlags),
                literalArr(nodeDefExprs),
                updateDirectivesFn,
                updateRendererFn,
            ]))], importType(createIdentifier(Identifiers.ViewDefinition)));
        targetStatements.push(viewFactory);
        return targetStatements;
    };
    /**
     * @param {?} updateStmts
     * @return {?}
     */
    ViewBuilder.prototype._createUpdateFn = function (updateStmts) {
        var /** @type {?} */ updateFn;
        if (updateStmts.length > 0) {
            var /** @type {?} */ preStmts = [];
            if (!this.component.isHost && findReadVarNames(updateStmts).has(/** @type {?} */ ((COMP_VAR.name)))) {
                preStmts.push(COMP_VAR.set(VIEW_VAR.prop('component')).toDeclStmt(this.compType));
            }
            updateFn = fn([
                new FnParam(/** @type {?} */ ((CHECK_VAR.name)), INFERRED_TYPE),
                new FnParam(/** @type {?} */ ((VIEW_VAR.name)), INFERRED_TYPE)
            ], preStmts.concat(updateStmts), INFERRED_TYPE);
        }
        else {
            updateFn = NULL_EXPR;
        }
        return updateFn;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitNgContent = function (ast, context) {
        // ngContentDef(ngContentIndex: number, index: number): NodeDef;
        this.nodes.push(function () { return ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 8 /* TypeNgContent */,
            nodeDef: importExpr(createIdentifier(Identifiers.ngContentDef)).callFn([
                literal(ast.ngContentIndex), literal(ast.index)
            ])
        }); });
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitText = function (ast, context) {
        // textDef(ngContentIndex: number, constants: string[]): NodeDef;
        this.nodes.push(function () { return ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 2 /* TypeText */,
            nodeDef: importExpr(createIdentifier(Identifiers.textDef)).callFn([
                literal(ast.ngContentIndex), literalArr([literal(ast.value)])
            ])
        }); });
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitBoundText = function (ast, context) {
        var _this = this;
        var /** @type {?} */ nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array
        this.nodes.push(/** @type {?} */ ((null)));
        var /** @type {?} */ astWithSource = (ast.value);
        var /** @type {?} */ inter = (astWithSource.ast);
        var /** @type {?} */ updateRendererExpressions = inter.expressions.map(function (expr, bindingIndex) { return _this._preprocessUpdateExpression({ nodeIndex: nodeIndex, bindingIndex: bindingIndex, sourceSpan: ast.sourceSpan, context: COMP_VAR, value: expr }); });
        // textDef(ngContentIndex: number, constants: string[]): NodeDef;
        this.nodes[nodeIndex] = function () { return ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 2 /* TypeText */,
            nodeDef: importExpr(createIdentifier(Identifiers.textDef)).callFn([
                literal(ast.ngContentIndex), literalArr(inter.strings.map(function (s) { return literal(s); }))
            ]),
            updateRenderer: updateRendererExpressions
        }); };
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitEmbeddedTemplate = function (ast, context) {
        var _this = this;
        var /** @type {?} */ nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array
        this.nodes.push(/** @type {?} */ ((null)));
        var _a = this._visitElementOrTemplate(nodeIndex, ast), flags = _a.flags, queryMatchesExpr = _a.queryMatchesExpr, hostEvents = _a.hostEvents;
        var /** @type {?} */ childVisitor = this.viewBuilderFactory(this);
        this.children.push(childVisitor);
        childVisitor.visitAll(ast.variables, ast.children);
        var /** @type {?} */ childCount = this.nodes.length - nodeIndex - 1;
        // anchorDef(
        //   flags: NodeFlags, matchedQueries: [string, QueryValueType][], ngContentIndex: number,
        //   childCount: number, handleEventFn?: ElementHandleEventFn, templateFactory?:
        //   ViewDefinitionFactory): NodeDef;
        this.nodes[nodeIndex] = function () { return ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 1 /* TypeElement */ | flags,
            nodeDef: importExpr(createIdentifier(Identifiers.anchorDef)).callFn([
                literal(flags),
                queryMatchesExpr,
                literal(ast.ngContentIndex),
                literal(childCount),
                _this._createElementHandleEventFn(nodeIndex, hostEvents),
                variable(childVisitor.viewName),
            ])
        }); };
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitElement = function (ast, context) {
        var _this = this;
        var /** @type {?} */ nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array so we can add children
        this.nodes.push(/** @type {?} */ ((null)));
        // Using a null element name creates an anchor.
        var /** @type {?} */ elName = isNgContainer(ast.name) ? null : ast.name;
        var _a = this._visitElementOrTemplate(nodeIndex, ast), flags = _a.flags, usedEvents = _a.usedEvents, queryMatchesExpr = _a.queryMatchesExpr, dirHostBindings = _a.hostBindings, hostEvents = _a.hostEvents;
        var /** @type {?} */ inputDefs = [];
        var /** @type {?} */ updateRendererExpressions = [];
        var /** @type {?} */ outputDefs = [];
        if (elName) {
            var /** @type {?} */ hostBindings = ast.inputs
                .map(function (inputAst) { return ({
                context: /** @type {?} */ (COMP_VAR),
                inputAst: inputAst,
                dirAst: /** @type {?} */ (null),
            }); })
                .concat(dirHostBindings);
            if (hostBindings.length) {
                updateRendererExpressions =
                    hostBindings.map(function (hostBinding, bindingIndex) { return _this._preprocessUpdateExpression({
                        context: hostBinding.context,
                        nodeIndex: nodeIndex,
                        bindingIndex: bindingIndex,
                        sourceSpan: hostBinding.inputAst.sourceSpan,
                        value: hostBinding.inputAst.value
                    }); });
                inputDefs = hostBindings.map(function (hostBinding) { return elementBindingDef(hostBinding.inputAst, hostBinding.dirAst); });
            }
            outputDefs = usedEvents.map(function (_a) {
                var target = _a[0], eventName = _a[1];
                return literalArr([literal(target), literal(eventName)]);
            });
        }
        templateVisitAll(this, ast.children);
        var /** @type {?} */ childCount = this.nodes.length - nodeIndex - 1;
        var /** @type {?} */ compAst = ast.directives.find(function (dirAst) { return dirAst.directive.isComponent; });
        var /** @type {?} */ compRendererType = NULL_EXPR;
        var /** @type {?} */ compView = NULL_EXPR;
        if (compAst) {
            compView = importExpr({ reference: compAst.directive.componentViewType });
            compRendererType = importExpr({ reference: compAst.directive.rendererType });
        }
        // elementDef(
        //   flags: NodeFlags, matchedQueriesDsl: [string | number, QueryValueType][],
        //   ngContentIndex: number, childCount: number, namespaceAndName: string,
        //   fixedAttrs: [string, string][] = [],
        //   bindings?: [BindingFlags, string, string | SecurityContext][],
        //   outputs?: ([OutputType.ElementOutput | OutputType.DirectiveHostOutput, string, string])[],
        //   handleEvent?: ElementHandleEventFn,
        //   componentView?: () => ViewDefinition, componentRendererType?: RendererType2): NodeDef;
        this.nodes[nodeIndex] = function () { return ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 1 /* TypeElement */ | flags,
            nodeDef: importExpr(createIdentifier(Identifiers.elementDef)).callFn([
                literal(flags),
                queryMatchesExpr,
                literal(ast.ngContentIndex),
                literal(childCount),
                literal(elName),
                elName ? fixedAttrsDef(ast) : NULL_EXPR,
                inputDefs.length ? literalArr(inputDefs) : NULL_EXPR,
                outputDefs.length ? literalArr(outputDefs) : NULL_EXPR,
                _this._createElementHandleEventFn(nodeIndex, hostEvents),
                compView,
                compRendererType,
            ]),
            updateRenderer: updateRendererExpressions
        }); };
    };
    /**
     * @param {?} nodeIndex
     * @param {?} ast
     * @return {?}
     */
    ViewBuilder.prototype._visitElementOrTemplate = function (nodeIndex, ast) {
        var _this = this;
        var /** @type {?} */ flags = 0;
        if (ast.hasViewContainer) {
            flags |= 16777216 /* EmbeddedViews */;
        }
        var /** @type {?} */ usedEvents = new Map();
        ast.outputs.forEach(function (event) {
            var _a = elementEventNameAndTarget(event, null), name = _a.name, target = _a.target;
            usedEvents.set(ɵelementEventFullName(target, name), [target, name]);
        });
        ast.directives.forEach(function (dirAst) {
            dirAst.hostEvents.forEach(function (event) {
                var _a = elementEventNameAndTarget(event, dirAst), name = _a.name, target = _a.target;
                usedEvents.set(ɵelementEventFullName(target, name), [target, name]);
            });
        });
        var /** @type {?} */ hostBindings = [];
        var /** @type {?} */ hostEvents = [];
        var /** @type {?} */ componentFactoryResolverProvider = createComponentFactoryResolver(ast.directives);
        if (componentFactoryResolverProvider) {
            this._visitProvider(componentFactoryResolverProvider, ast.queryMatches);
        }
        ast.providers.forEach(function (providerAst, providerIndex) {
            var /** @type {?} */ dirAst = ((undefined));
            var /** @type {?} */ dirIndex = ((undefined));
            ast.directives.forEach(function (localDirAst, i) {
                if (localDirAst.directive.type.reference === tokenReference(providerAst.token)) {
                    dirAst = localDirAst;
                    dirIndex = i;
                }
            });
            if (dirAst) {
                var _a = _this._visitDirective(providerAst, dirAst, dirIndex, nodeIndex, ast.references, ast.queryMatches, usedEvents, /** @type {?} */ ((_this.staticQueryIds.get(/** @type {?} */ (ast))))), dirHostBindings = _a.hostBindings, dirHostEvents = _a.hostEvents;
                hostBindings.push.apply(hostBindings, dirHostBindings);
                hostEvents.push.apply(hostEvents, dirHostEvents);
            }
            else {
                _this._visitProvider(providerAst, ast.queryMatches);
            }
        });
        var /** @type {?} */ queryMatchExprs = [];
        ast.queryMatches.forEach(function (match) {
            var /** @type {?} */ valueType = ((undefined));
            if (tokenReference(match.value) === resolveIdentifier(Identifiers.ElementRef)) {
                valueType = 0 /* ElementRef */;
            }
            else if (tokenReference(match.value) === resolveIdentifier(Identifiers.ViewContainerRef)) {
                valueType = 3 /* ViewContainerRef */;
            }
            else if (tokenReference(match.value) === resolveIdentifier(Identifiers.TemplateRef)) {
                valueType = 2 /* TemplateRef */;
            }
            if (valueType != null) {
                queryMatchExprs.push(literalArr([literal(match.queryId), literal(valueType)]));
            }
        });
        ast.references.forEach(function (ref) {
            var /** @type {?} */ valueType = ((undefined));
            if (!ref.value) {
                valueType = 1 /* RenderElement */;
            }
            else if (tokenReference(ref.value) === resolveIdentifier(Identifiers.TemplateRef)) {
                valueType = 2 /* TemplateRef */;
            }
            if (valueType != null) {
                _this.refNodeIndices[ref.name] = nodeIndex;
                queryMatchExprs.push(literalArr([literal(ref.name), literal(valueType)]));
            }
        });
        ast.outputs.forEach(function (outputAst) {
            hostEvents.push({ context: COMP_VAR, eventAst: outputAst, dirAst: /** @type {?} */ ((null)) });
        });
        return {
            flags: flags,
            usedEvents: Array.from(usedEvents.values()),
            queryMatchesExpr: queryMatchExprs.length ? literalArr(queryMatchExprs) : NULL_EXPR,
            hostBindings: hostBindings,
            hostEvents: hostEvents
        };
    };
    /**
     * @param {?} providerAst
     * @param {?} dirAst
     * @param {?} directiveIndex
     * @param {?} elementNodeIndex
     * @param {?} refs
     * @param {?} queryMatches
     * @param {?} usedEvents
     * @param {?} queryIds
     * @return {?}
     */
    ViewBuilder.prototype._visitDirective = function (providerAst, dirAst, directiveIndex, elementNodeIndex, refs, queryMatches, usedEvents, queryIds) {
        var _this = this;
        var /** @type {?} */ nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array so we can add children
        this.nodes.push(/** @type {?} */ ((null)));
        dirAst.directive.queries.forEach(function (query, queryIndex) {
            var /** @type {?} */ queryId = dirAst.contentQueryStartId + queryIndex;
            var /** @type {?} */ flags = 67108864 /* TypeContentQuery */ | calcStaticDynamicQueryFlags(queryIds, queryId, query.first);
            var /** @type {?} */ bindingType = query.first ? 0 /* First */ : 1;
            _this.nodes.push(function () { return ({
                sourceSpan: dirAst.sourceSpan,
                nodeFlags: flags,
                nodeDef: importExpr(createIdentifier(Identifiers.queryDef)).callFn([
                    literal(flags), literal(queryId),
                    new LiteralMapExpr([new LiteralMapEntry(query.propertyName, literal(bindingType))])
                ]),
            }); });
        });
        // Note: the operation below might also create new nodeDefs,
        // but we don't want them to be a child of a directive,
        // as they might be a provider/pipe on their own.
        // I.e. we only allow queries as children of directives nodes.
        var /** @type {?} */ childCount = this.nodes.length - nodeIndex - 1;
        var _a = this._visitProviderOrDirective(providerAst, queryMatches), flags = _a.flags, queryMatchExprs = _a.queryMatchExprs, providerExpr = _a.providerExpr, depsExpr = _a.depsExpr;
        refs.forEach(function (ref) {
            if (ref.value && tokenReference(ref.value) === tokenReference(providerAst.token)) {
                _this.refNodeIndices[ref.name] = nodeIndex;
                queryMatchExprs.push(literalArr([literal(ref.name), literal(4 /* Provider */)]));
            }
        });
        if (dirAst.directive.isComponent) {
            flags |= 32768 /* Component */;
        }
        var /** @type {?} */ inputDefs = dirAst.inputs.map(function (inputAst, inputIndex) {
            var /** @type {?} */ mapValue = literalArr([literal(inputIndex), literal(inputAst.directiveName)]);
            // Note: it's important to not quote the key so that we can capture renames by minifiers!
            return new LiteralMapEntry(inputAst.directiveName, mapValue, false);
        });
        var /** @type {?} */ outputDefs = [];
        var /** @type {?} */ dirMeta = dirAst.directive;
        Object.keys(dirMeta.outputs).forEach(function (propName) {
            var /** @type {?} */ eventName = dirMeta.outputs[propName];
            if (usedEvents.has(eventName)) {
                // Note: it's important to not quote the key so that we can capture renames by minifiers!
                outputDefs.push(new LiteralMapEntry(propName, literal(eventName), false));
            }
        });
        var /** @type {?} */ updateDirectiveExpressions = [];
        if (dirAst.inputs.length || (flags & (262144 /* DoCheck */ | 65536 /* OnInit */)) > 0) {
            updateDirectiveExpressions =
                dirAst.inputs.map(function (input, bindingIndex) { return _this._preprocessUpdateExpression({
                    nodeIndex: nodeIndex,
                    bindingIndex: bindingIndex,
                    sourceSpan: input.sourceSpan,
                    context: COMP_VAR,
                    value: input.value
                }); });
        }
        var /** @type {?} */ dirContextExpr = importExpr(createIdentifier(Identifiers.nodeValue)).callFn([
            VIEW_VAR, literal(nodeIndex)
        ]);
        var /** @type {?} */ hostBindings = dirAst.hostProperties.map(function (inputAst) { return ({
            context: dirContextExpr,
            dirAst: dirAst,
            inputAst: inputAst,
        }); });
        var /** @type {?} */ hostEvents = dirAst.hostEvents.map(function (hostEventAst) { return ({
            context: dirContextExpr,
            eventAst: hostEventAst, dirAst: dirAst,
        }); });
        // directiveDef(
        //   flags: NodeFlags, matchedQueries: [string, QueryValueType][], childCount: number, ctor:
        //   any,
        //   deps: ([DepFlags, any] | any)[], props?: {[name: string]: [number, string]},
        //   outputs?: {[name: string]: string}, component?: () => ViewDefinition): NodeDef;
        this.nodes[nodeIndex] = function () { return ({
            sourceSpan: dirAst.sourceSpan,
            nodeFlags: 16384 /* TypeDirective */ | flags,
            nodeDef: importExpr(createIdentifier(Identifiers.directiveDef)).callFn([
                literal(flags), queryMatchExprs.length ? literalArr(queryMatchExprs) : NULL_EXPR,
                literal(childCount), providerExpr, depsExpr,
                inputDefs.length ? new LiteralMapExpr(inputDefs) : NULL_EXPR,
                outputDefs.length ? new LiteralMapExpr(outputDefs) : NULL_EXPR
            ]),
            updateDirectives: updateDirectiveExpressions,
            directive: dirAst.directive.type,
        }); };
        return { hostBindings: hostBindings, hostEvents: hostEvents };
    };
    /**
     * @param {?} providerAst
     * @param {?} queryMatches
     * @return {?}
     */
    ViewBuilder.prototype._visitProvider = function (providerAst, queryMatches) {
        var /** @type {?} */ nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array so we can add children
        this.nodes.push(/** @type {?} */ ((null)));
        var _a = this._visitProviderOrDirective(providerAst, queryMatches), flags = _a.flags, queryMatchExprs = _a.queryMatchExprs, providerExpr = _a.providerExpr, depsExpr = _a.depsExpr;
        // providerDef(
        //   flags: NodeFlags, matchedQueries: [string, QueryValueType][], token:any,
        //   value: any, deps: ([DepFlags, any] | any)[]): NodeDef;
        this.nodes[nodeIndex] = function () { return ({
            sourceSpan: providerAst.sourceSpan,
            nodeFlags: flags,
            nodeDef: importExpr(createIdentifier(Identifiers.providerDef)).callFn([
                literal(flags), queryMatchExprs.length ? literalArr(queryMatchExprs) : NULL_EXPR,
                tokenExpr(providerAst.token), providerExpr, depsExpr
            ])
        }); };
    };
    /**
     * @param {?} providerAst
     * @param {?} queryMatches
     * @return {?}
     */
    ViewBuilder.prototype._visitProviderOrDirective = function (providerAst, queryMatches) {
        var /** @type {?} */ flags = 0;
        if (!providerAst.eager) {
            flags |= 4096 /* LazyProvider */;
        }
        if (providerAst.providerType === ProviderAstType.PrivateService) {
            flags |= 8192 /* PrivateProvider */;
        }
        providerAst.lifecycleHooks.forEach(function (lifecycleHook) {
            // for regular providers, we only support ngOnDestroy
            if (lifecycleHook === ɵLifecycleHooks.OnDestroy ||
                providerAst.providerType === ProviderAstType.Directive ||
                providerAst.providerType === ProviderAstType.Component) {
                flags |= lifecycleHookToNodeFlag(lifecycleHook);
            }
        });
        var /** @type {?} */ queryMatchExprs = [];
        queryMatches.forEach(function (match) {
            if (tokenReference(match.value) === tokenReference(providerAst.token)) {
                queryMatchExprs.push(literalArr([literal(match.queryId), literal(4 /* Provider */)]));
            }
        });
        var _a = providerDef(providerAst), providerExpr = _a.providerExpr, depsExpr = _a.depsExpr, providerType = _a.flags;
        return { flags: flags | providerType, queryMatchExprs: queryMatchExprs, providerExpr: providerExpr, depsExpr: depsExpr };
    };
    /**
     * @param {?} name
     * @return {?}
     */
    ViewBuilder.prototype.getLocal = function (name) {
        if (name == EventHandlerVars.event.name) {
            return EventHandlerVars.event;
        }
        var /** @type {?} */ currViewExpr = VIEW_VAR;
        for (var /** @type {?} */ currBuilder = this; currBuilder; currBuilder = currBuilder.parent,
            currViewExpr = currViewExpr.prop('parent').cast(DYNAMIC_TYPE)) {
            // check references
            var /** @type {?} */ refNodeIndex = currBuilder.refNodeIndices[name];
            if (refNodeIndex != null) {
                return importExpr(createIdentifier(Identifiers.nodeValue)).callFn([
                    currViewExpr, literal(refNodeIndex)
                ]);
            }
            // check variables
            var /** @type {?} */ varAst = currBuilder.variables.find(function (varAst) { return varAst.name === name; });
            if (varAst) {
                var /** @type {?} */ varValue = varAst.value || IMPLICIT_TEMPLATE_VAR;
                return currViewExpr.prop('context').prop(varValue);
            }
        }
        return null;
    };
    /**
     * @param {?} sourceSpan
     * @param {?} argCount
     * @return {?}
     */
    ViewBuilder.prototype.createLiteralArrayConverter = function (sourceSpan, argCount) {
        if (argCount === 0) {
            var /** @type {?} */ valueExpr_1 = importExpr(createIdentifier(Identifiers.EMPTY_ARRAY));
            return function () { return valueExpr_1; };
        }
        var /** @type {?} */ nodeIndex = this.nodes.length;
        // pureArrayDef(argCount: number): NodeDef;
        this.nodes.push(function () { return ({
            sourceSpan: sourceSpan,
            nodeFlags: 32 /* TypePureArray */,
            nodeDef: importExpr(createIdentifier(Identifiers.pureArrayDef)).callFn([literal(argCount)])
        }); });
        return function (args) { return callCheckStmt(nodeIndex, args); };
    };
    /**
     * @param {?} sourceSpan
     * @param {?} keys
     * @return {?}
     */
    ViewBuilder.prototype.createLiteralMapConverter = function (sourceSpan, keys) {
        if (keys.length === 0) {
            var /** @type {?} */ valueExpr_2 = importExpr(createIdentifier(Identifiers.EMPTY_MAP));
            return function () { return valueExpr_2; };
        }
        var /** @type {?} */ nodeIndex = this.nodes.length;
        // function pureObjectDef(propertyNames: string[]): NodeDef
        this.nodes.push(function () { return ({
            sourceSpan: sourceSpan,
            nodeFlags: 64 /* TypePureObject */,
            nodeDef: importExpr(createIdentifier(Identifiers.pureObjectDef))
                .callFn([literalArr(keys.map(function (key) { return literal(key); }))])
        }); });
        return function (args) { return callCheckStmt(nodeIndex, args); };
    };
    /**
     * @param {?} expression
     * @param {?} name
     * @param {?} argCount
     * @return {?}
     */
    ViewBuilder.prototype.createPipeConverter = function (expression, name, argCount) {
        var /** @type {?} */ pipe = ((this.usedPipes.find(function (pipeSummary) { return pipeSummary.name === name; })));
        if (pipe.pure) {
            var /** @type {?} */ nodeIndex_1 = this.nodes.length;
            // function purePipeDef(argCount: number): NodeDef;
            this.nodes.push(function () { return ({
                sourceSpan: expression.sourceSpan,
                nodeFlags: 128 /* TypePurePipe */,
                nodeDef: importExpr(createIdentifier(Identifiers.purePipeDef))
                    .callFn([literal(argCount)])
            }); });
            // find underlying pipe in the component view
            var /** @type {?} */ compViewExpr = VIEW_VAR;
            var /** @type {?} */ compBuilder = this;
            while (compBuilder.parent) {
                compBuilder = compBuilder.parent;
                compViewExpr = compViewExpr.prop('parent').cast(DYNAMIC_TYPE);
            }
            var /** @type {?} */ pipeNodeIndex = compBuilder.purePipeNodeIndices[name];
            var /** @type {?} */ pipeValueExpr_1 = importExpr(createIdentifier(Identifiers.nodeValue)).callFn([
                compViewExpr, literal(pipeNodeIndex)
            ]);
            return function (args) { return callUnwrapValue(expression.nodeIndex, expression.bindingIndex, callCheckStmt(nodeIndex_1, [pipeValueExpr_1].concat(args))); };
        }
        else {
            var /** @type {?} */ nodeIndex = this._createPipe(expression.sourceSpan, pipe);
            var /** @type {?} */ nodeValueExpr_1 = importExpr(createIdentifier(Identifiers.nodeValue)).callFn([
                VIEW_VAR, literal(nodeIndex)
            ]);
            return function (args) { return callUnwrapValue(expression.nodeIndex, expression.bindingIndex, nodeValueExpr_1.callMethod('transform', args)); };
        }
    };
    /**
     * @param {?} sourceSpan
     * @param {?} pipe
     * @return {?}
     */
    ViewBuilder.prototype._createPipe = function (sourceSpan, pipe) {
        var /** @type {?} */ nodeIndex = this.nodes.length;
        var /** @type {?} */ flags = 0;
        pipe.type.lifecycleHooks.forEach(function (lifecycleHook) {
            // for pipes, we only support ngOnDestroy
            if (lifecycleHook === ɵLifecycleHooks.OnDestroy) {
                flags |= lifecycleHookToNodeFlag(lifecycleHook);
            }
        });
        var /** @type {?} */ depExprs = pipe.type.diDeps.map(depDef);
        // function pipeDef(
        //   flags: NodeFlags, ctor: any, deps: ([DepFlags, any] | any)[]): NodeDef
        this.nodes.push(function () { return ({
            sourceSpan: sourceSpan,
            nodeFlags: 16 /* TypePipe */,
            nodeDef: importExpr(createIdentifier(Identifiers.pipeDef)).callFn([
                literal(flags), importExpr(pipe.type), literalArr(depExprs)
            ])
        }); });
        return nodeIndex;
    };
    /**
     * @param {?} expression
     * @return {?}
     */
    ViewBuilder.prototype._preprocessUpdateExpression = function (expression) {
        var _this = this;
        return {
            nodeIndex: expression.nodeIndex,
            bindingIndex: expression.bindingIndex,
            sourceSpan: expression.sourceSpan,
            context: expression.context,
            value: convertPropertyBindingBuiltins({
                createLiteralArrayConverter: function (argCount) { return _this.createLiteralArrayConverter(expression.sourceSpan, argCount); },
                createLiteralMapConverter: function (keys) { return _this.createLiteralMapConverter(expression.sourceSpan, keys); },
                createPipeConverter: function (name, argCount) { return _this.createPipeConverter(expression, name, argCount); }
            }, expression.value)
        };
    };
    /**
     * @return {?}
     */
    ViewBuilder.prototype._createNodeExpressions = function () {
        var /** @type {?} */ self = this;
        var /** @type {?} */ updateBindingCount = 0;
        var /** @type {?} */ updateRendererStmts = [];
        var /** @type {?} */ updateDirectivesStmts = [];
        var /** @type {?} */ nodeDefExprs = this.nodes.map(function (factory, nodeIndex) {
            var _a = factory(), nodeDef = _a.nodeDef, nodeFlags = _a.nodeFlags, updateDirectives = _a.updateDirectives, updateRenderer = _a.updateRenderer, sourceSpan = _a.sourceSpan;
            if (updateRenderer) {
                updateRendererStmts.push.apply(updateRendererStmts, createUpdateStatements(nodeIndex, sourceSpan, updateRenderer, false));
            }
            if (updateDirectives) {
                updateDirectivesStmts.push.apply(updateDirectivesStmts, createUpdateStatements(nodeIndex, sourceSpan, updateDirectives, (nodeFlags & (262144 /* DoCheck */ | 65536 /* OnInit */)) > 0));
            }
            // We use a comma expression to call the log function before
            // the nodeDef function, but still use the result of the nodeDef function
            // as the value.
            // Note: We only add the logger to elements / text nodes,
            // so we don't generate too much code.
            var /** @type {?} */ logWithNodeDef = nodeFlags & 3 /* CatRenderNode */ ?
                new CommaExpr([LOG_VAR.callFn([]).callFn([]), nodeDef]) :
                nodeDef;
            return applySourceSpanToExpressionIfNeeded(logWithNodeDef, sourceSpan);
        });
        return { updateRendererStmts: updateRendererStmts, updateDirectivesStmts: updateDirectivesStmts, nodeDefExprs: nodeDefExprs };
        /**
         * @param {?} nodeIndex
         * @param {?} sourceSpan
         * @param {?} expressions
         * @param {?} allowEmptyExprs
         * @return {?}
         */
        function createUpdateStatements(nodeIndex, sourceSpan, expressions, allowEmptyExprs) {
            var /** @type {?} */ updateStmts = [];
            var /** @type {?} */ exprs = expressions.map(function (_a) {
                var sourceSpan = _a.sourceSpan, context = _a.context, value = _a.value;
                var /** @type {?} */ bindingId = "" + updateBindingCount++;
                var /** @type {?} */ nameResolver = context === COMP_VAR ? self : null;
                var _b = convertPropertyBinding(nameResolver, context, value, bindingId), stmts = _b.stmts, currValExpr = _b.currValExpr;
                updateStmts.push.apply(updateStmts, stmts.map(function (stmt) { return applySourceSpanToStatementIfNeeded(stmt, sourceSpan); }));
                return applySourceSpanToExpressionIfNeeded(currValExpr, sourceSpan);
            });
            if (expressions.length || allowEmptyExprs) {
                updateStmts.push(applySourceSpanToStatementIfNeeded(callCheckStmt(nodeIndex, exprs).toStmt(), sourceSpan));
            }
            return updateStmts;
        }
    };
    /**
     * @param {?} nodeIndex
     * @param {?} handlers
     * @return {?}
     */
    ViewBuilder.prototype._createElementHandleEventFn = function (nodeIndex, handlers) {
        var _this = this;
        var /** @type {?} */ handleEventStmts = [];
        var /** @type {?} */ handleEventBindingCount = 0;
        handlers.forEach(function (_a) {
            var context = _a.context, eventAst = _a.eventAst, dirAst = _a.dirAst;
            var /** @type {?} */ bindingId = "" + handleEventBindingCount++;
            var /** @type {?} */ nameResolver = context === COMP_VAR ? _this : null;
            var _b = convertActionBinding(nameResolver, context, eventAst.handler, bindingId), stmts = _b.stmts, allowDefault = _b.allowDefault;
            var /** @type {?} */ trueStmts = stmts;
            if (allowDefault) {
                trueStmts.push(ALLOW_DEFAULT_VAR.set(allowDefault.and(ALLOW_DEFAULT_VAR)).toStmt());
            }
            var _c = elementEventNameAndTarget(eventAst, dirAst), eventTarget = _c.target, eventName = _c.name;
            var /** @type {?} */ fullEventName = ɵelementEventFullName(eventTarget, eventName);
            handleEventStmts.push(applySourceSpanToStatementIfNeeded(new IfStmt(literal(fullEventName).identical(EVENT_NAME_VAR), trueStmts), eventAst.sourceSpan));
        });
        var /** @type {?} */ handleEventFn;
        if (handleEventStmts.length > 0) {
            var /** @type {?} */ preStmts = [ALLOW_DEFAULT_VAR.set(literal(true)).toDeclStmt(BOOL_TYPE)];
            if (!this.component.isHost && findReadVarNames(handleEventStmts).has(/** @type {?} */ ((COMP_VAR.name)))) {
                preStmts.push(COMP_VAR.set(VIEW_VAR.prop('component')).toDeclStmt(this.compType));
            }
            handleEventFn = fn([
                new FnParam(/** @type {?} */ ((VIEW_VAR.name)), INFERRED_TYPE),
                new FnParam(/** @type {?} */ ((EVENT_NAME_VAR.name)), INFERRED_TYPE),
                new FnParam(/** @type {?} */ ((EventHandlerVars.event.name)), INFERRED_TYPE)
            ], preStmts.concat(handleEventStmts, [new ReturnStatement(ALLOW_DEFAULT_VAR)]), INFERRED_TYPE);
        }
        else {
            handleEventFn = NULL_EXPR;
        }
        return handleEventFn;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitDirective = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitDirectiveProperty = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitReference = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitVariable = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitEvent = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitElementProperty = function (ast, context) { };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    ViewBuilder.prototype.visitAttr = function (ast, context) { };
    return ViewBuilder;
}());
/**
 * @param {?} providerAst
 * @return {?}
 */
function providerDef(providerAst) {
    return providerAst.multiProvider ?
        multiProviderDef(providerAst.providers) :
        singleProviderDef(providerAst.providerType, providerAst.providers[0]);
}
/**
 * @param {?} providers
 * @return {?}
 */
function multiProviderDef(providers) {
    var /** @type {?} */ allDepDefs = [];
    var /** @type {?} */ allParams = [];
    var /** @type {?} */ exprs = providers.map(function (provider, providerIndex) {
        var /** @type {?} */ expr;
        if (provider.useClass) {
            var /** @type {?} */ depExprs = convertDeps(providerIndex, provider.deps || provider.useClass.diDeps);
            expr = importExpr(provider.useClass).instantiate(depExprs);
        }
        else if (provider.useFactory) {
            var /** @type {?} */ depExprs = convertDeps(providerIndex, provider.deps || provider.useFactory.diDeps);
            expr = importExpr(provider.useFactory).callFn(depExprs);
        }
        else if (provider.useExisting) {
            var /** @type {?} */ depExprs = convertDeps(providerIndex, [{ token: provider.useExisting }]);
            expr = depExprs[0];
        }
        else {
            expr = convertValueToOutputAst(provider.useValue);
        }
        return expr;
    });
    var /** @type {?} */ providerExpr = fn(allParams, [new ReturnStatement(literalArr(exprs))], INFERRED_TYPE);
    return { providerExpr: providerExpr, flags: 1024 /* TypeFactoryProvider */, depsExpr: literalArr(allDepDefs) };
    /**
     * @param {?} providerIndex
     * @param {?} deps
     * @return {?}
     */
    function convertDeps(providerIndex, deps) {
        return deps.map(function (dep, depIndex) {
            var /** @type {?} */ paramName = "p" + providerIndex + "_" + depIndex;
            allParams.push(new FnParam(paramName, DYNAMIC_TYPE));
            allDepDefs.push(depDef(dep));
            return variable(paramName);
        });
    }
}
/**
 * @param {?} providerType
 * @param {?} providerMeta
 * @return {?}
 */
function singleProviderDef(providerType, providerMeta) {
    var /** @type {?} */ providerExpr;
    var /** @type {?} */ flags;
    var /** @type {?} */ deps;
    if (providerType === ProviderAstType.Directive || providerType === ProviderAstType.Component) {
        providerExpr = importExpr(/** @type {?} */ ((providerMeta.useClass)));
        flags = 16384 /* TypeDirective */;
        deps = providerMeta.deps || ((providerMeta.useClass)).diDeps;
    }
    else {
        if (providerMeta.useClass) {
            providerExpr = importExpr(providerMeta.useClass);
            flags = 512 /* TypeClassProvider */;
            deps = providerMeta.deps || providerMeta.useClass.diDeps;
        }
        else if (providerMeta.useFactory) {
            providerExpr = importExpr(providerMeta.useFactory);
            flags = 1024 /* TypeFactoryProvider */;
            deps = providerMeta.deps || providerMeta.useFactory.diDeps;
        }
        else if (providerMeta.useExisting) {
            providerExpr = NULL_EXPR;
            flags = 2048 /* TypeUseExistingProvider */;
            deps = [{ token: providerMeta.useExisting }];
        }
        else {
            providerExpr = convertValueToOutputAst(providerMeta.useValue);
            flags = 256 /* TypeValueProvider */;
            deps = [];
        }
    }
    var /** @type {?} */ depsExpr = literalArr(deps.map(function (dep) { return depDef(dep); }));
    return { providerExpr: providerExpr, flags: flags, depsExpr: depsExpr };
}
/**
 * @param {?} tokenMeta
 * @return {?}
 */
function tokenExpr(tokenMeta) {
    return tokenMeta.identifier ? importExpr(tokenMeta.identifier) : literal(tokenMeta.value);
}
/**
 * @param {?} dep
 * @return {?}
 */
function depDef(dep) {
    // Note: the following fields have already been normalized out by provider_analyzer:
    // - isAttribute, isSelf, isHost
    var /** @type {?} */ expr = dep.isValue ? convertValueToOutputAst(dep.value) : tokenExpr(/** @type {?} */ ((dep.token)));
    var /** @type {?} */ flags = 0;
    if (dep.isSkipSelf) {
        flags |= 1 /* SkipSelf */;
    }
    if (dep.isOptional) {
        flags |= 2 /* Optional */;
    }
    if (dep.isValue) {
        flags |= 8 /* Value */;
    }
    return flags === 0 /* None */ ? expr : literalArr([literal(flags), expr]);
}
/**
 * @param {?} astNodes
 * @return {?}
 */
function needsAdditionalRootNode(astNodes) {
    var /** @type {?} */ lastAstNode = astNodes[astNodes.length - 1];
    if (lastAstNode instanceof EmbeddedTemplateAst) {
        return lastAstNode.hasViewContainer;
    }
    if (lastAstNode instanceof ElementAst) {
        if (isNgContainer(lastAstNode.name) && lastAstNode.children.length) {
            return needsAdditionalRootNode(lastAstNode.children);
        }
        return lastAstNode.hasViewContainer;
    }
    return lastAstNode instanceof NgContentAst;
}
/**
 * @param {?} lifecycleHook
 * @return {?}
 */
function lifecycleHookToNodeFlag(lifecycleHook) {
    var /** @type {?} */ nodeFlag = 0;
    switch (lifecycleHook) {
        case ɵLifecycleHooks.AfterContentChecked:
            nodeFlag = 2097152 /* AfterContentChecked */;
            break;
        case ɵLifecycleHooks.AfterContentInit:
            nodeFlag = 1048576 /* AfterContentInit */;
            break;
        case ɵLifecycleHooks.AfterViewChecked:
            nodeFlag = 8388608 /* AfterViewChecked */;
            break;
        case ɵLifecycleHooks.AfterViewInit:
            nodeFlag = 4194304 /* AfterViewInit */;
            break;
        case ɵLifecycleHooks.DoCheck:
            nodeFlag = 262144 /* DoCheck */;
            break;
        case ɵLifecycleHooks.OnChanges:
            nodeFlag = 524288 /* OnChanges */;
            break;
        case ɵLifecycleHooks.OnDestroy:
            nodeFlag = 131072 /* OnDestroy */;
            break;
        case ɵLifecycleHooks.OnInit:
            nodeFlag = 65536 /* OnInit */;
            break;
    }
    return nodeFlag;
}
/**
 * @param {?} inputAst
 * @param {?} dirAst
 * @return {?}
 */
function elementBindingDef(inputAst, dirAst) {
    switch (inputAst.type) {
        case PropertyBindingType.Attribute:
            return literalArr([
                literal(1 /* TypeElementAttribute */), literal(inputAst.name),
                literal(inputAst.securityContext)
            ]);
        case PropertyBindingType.Property:
            return literalArr([
                literal(8 /* TypeProperty */), literal(inputAst.name),
                literal(inputAst.securityContext)
            ]);
        case PropertyBindingType.Animation:
            var /** @type {?} */ bindingType = 8 /* TypeProperty */ |
                (dirAst && dirAst.directive.isComponent ? 32 /* SyntheticHostProperty */ :
                    16 /* SyntheticProperty */);
            return literalArr([
                literal(bindingType), literal('@' + inputAst.name), literal(inputAst.securityContext)
            ]);
        case PropertyBindingType.Class:
            return literalArr([literal(2 /* TypeElementClass */), literal(inputAst.name), NULL_EXPR]);
        case PropertyBindingType.Style:
            return literalArr([
                literal(4 /* TypeElementStyle */), literal(inputAst.name), literal(inputAst.unit)
            ]);
    }
}
/**
 * @param {?} elementAst
 * @return {?}
 */
function fixedAttrsDef(elementAst) {
    var /** @type {?} */ mapResult = Object.create(null);
    elementAst.attrs.forEach(function (attrAst) { mapResult[attrAst.name] = attrAst.value; });
    elementAst.directives.forEach(function (dirAst) {
        Object.keys(dirAst.directive.hostAttributes).forEach(function (name) {
            var /** @type {?} */ value = dirAst.directive.hostAttributes[name];
            var /** @type {?} */ prevValue = mapResult[name];
            mapResult[name] = prevValue != null ? mergeAttributeValue(name, prevValue, value) : value;
        });
    });
    // Note: We need to sort to get a defined output order
    // for tests and for caching generated artifacts...
    return literalArr(Object.keys(mapResult).sort().map(function (attrName) { return literalArr([literal(attrName), literal(mapResult[attrName])]); }));
}
/**
 * @param {?} attrName
 * @param {?} attrValue1
 * @param {?} attrValue2
 * @return {?}
 */
function mergeAttributeValue(attrName, attrValue1, attrValue2) {
    if (attrName == CLASS_ATTR$1 || attrName == STYLE_ATTR) {
        return attrValue1 + " " + attrValue2;
    }
    else {
        return attrValue2;
    }
}
/**
 * @param {?} nodeIndex
 * @param {?} exprs
 * @return {?}
 */
function callCheckStmt(nodeIndex, exprs) {
    if (exprs.length > 10) {
        return CHECK_VAR.callFn([VIEW_VAR, literal(nodeIndex), literal(1 /* Dynamic */), literalArr(exprs)]);
    }
    else {
        return CHECK_VAR.callFn([VIEW_VAR, literal(nodeIndex), literal(0 /* Inline */)].concat(exprs));
    }
}
/**
 * @param {?} nodeIndex
 * @param {?} bindingIdx
 * @param {?} expr
 * @return {?}
 */
function callUnwrapValue(nodeIndex, bindingIdx, expr) {
    return importExpr(createIdentifier(Identifiers.unwrapValue)).callFn([
        VIEW_VAR, literal(nodeIndex), literal(bindingIdx), expr
    ]);
}
/**
 * @param {?} nodes
 * @param {?=} result
 * @return {?}
 */
function findStaticQueryIds(nodes, result) {
    if (result === void 0) { result = new Map(); }
    nodes.forEach(function (node) {
        var /** @type {?} */ staticQueryIds = new Set();
        var /** @type {?} */ dynamicQueryIds = new Set();
        var /** @type {?} */ queryMatches = ((undefined));
        if (node instanceof ElementAst) {
            findStaticQueryIds(node.children, result);
            node.children.forEach(function (child) {
                var /** @type {?} */ childData = ((result.get(child)));
                childData.staticQueryIds.forEach(function (queryId) { return staticQueryIds.add(queryId); });
                childData.dynamicQueryIds.forEach(function (queryId) { return dynamicQueryIds.add(queryId); });
            });
            queryMatches = node.queryMatches;
        }
        else if (node instanceof EmbeddedTemplateAst) {
            findStaticQueryIds(node.children, result);
            node.children.forEach(function (child) {
                var /** @type {?} */ childData = ((result.get(child)));
                childData.staticQueryIds.forEach(function (queryId) { return dynamicQueryIds.add(queryId); });
                childData.dynamicQueryIds.forEach(function (queryId) { return dynamicQueryIds.add(queryId); });
            });
            queryMatches = node.queryMatches;
        }
        if (queryMatches) {
            queryMatches.forEach(function (match) { return staticQueryIds.add(match.queryId); });
        }
        dynamicQueryIds.forEach(function (queryId) { return staticQueryIds.delete(queryId); });
        result.set(node, { staticQueryIds: staticQueryIds, dynamicQueryIds: dynamicQueryIds });
    });
    return result;
}
/**
 * @param {?} nodeStaticQueryIds
 * @return {?}
 */
function staticViewQueryIds(nodeStaticQueryIds) {
    var /** @type {?} */ staticQueryIds = new Set();
    var /** @type {?} */ dynamicQueryIds = new Set();
    Array.from(nodeStaticQueryIds.values()).forEach(function (entry) {
        entry.staticQueryIds.forEach(function (queryId) { return staticQueryIds.add(queryId); });
        entry.dynamicQueryIds.forEach(function (queryId) { return dynamicQueryIds.add(queryId); });
    });
    dynamicQueryIds.forEach(function (queryId) { return staticQueryIds.delete(queryId); });
    return { staticQueryIds: staticQueryIds, dynamicQueryIds: dynamicQueryIds };
}
/**
 * @param {?} directives
 * @return {?}
 */
function createComponentFactoryResolver(directives) {
    var /** @type {?} */ componentDirMeta = directives.find(function (dirAst) { return dirAst.directive.isComponent; });
    if (componentDirMeta && componentDirMeta.directive.entryComponents.length) {
        var /** @type {?} */ entryComponentFactories = componentDirMeta.directive.entryComponents.map(function (entryComponent) { return importExpr({ reference: entryComponent.componentFactory }); });
        var /** @type {?} */ token = createIdentifierToken(Identifiers.ComponentFactoryResolver);
        var /** @type {?} */ classMeta = {
            diDeps: [
                { isValue: true, value: literalArr(entryComponentFactories) },
                { token: token, isSkipSelf: true, isOptional: true },
                { token: createIdentifierToken(Identifiers.NgModuleRef) },
            ],
            lifecycleHooks: [],
            reference: resolveIdentifier(Identifiers.CodegenComponentFactoryResolver)
        };
        return new ProviderAst(token, false, true, [{ token: token, multi: false, useClass: classMeta }], ProviderAstType.PrivateService, [], componentDirMeta.sourceSpan);
    }
    return null;
}
/**
 * @param {?} eventAst
 * @param {?} dirAst
 * @return {?}
 */
function elementEventNameAndTarget(eventAst, dirAst) {
    if (eventAst.isAnimation) {
        return {
            name: "@" + eventAst.name + "." + eventAst.phase,
            target: dirAst && dirAst.directive.isComponent ? 'component' : null
        };
    }
    else {
        return eventAst;
    }
}
/**
 * @param {?} queryIds
 * @param {?} queryId
 * @param {?} isFirst
 * @return {?}
 */
function calcStaticDynamicQueryFlags(queryIds, queryId, isFirst) {
    var /** @type {?} */ flags = 0;
    // Note: We only make queries static that query for a single item.
    // This is because of backwards compatibility with the old view compiler...
    if (isFirst && (queryIds.staticQueryIds.has(queryId) || !queryIds.dynamicQueryIds.has(queryId))) {
        flags |= 268435456 /* StaticQuery */;
    }
    else {
        flags |= 536870912 /* DynamicQuery */;
    }
    return flags;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var GeneratedFile = (function () {
    /**
     * @param {?} srcFileUrl
     * @param {?} genFileUrl
     * @param {?} source
     */
    function GeneratedFile(srcFileUrl, genFileUrl, source) {
        this.srcFileUrl = srcFileUrl;
        this.genFileUrl = genFileUrl;
        this.source = source;
    }
    return GeneratedFile;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @param {?} summaryResolver
 * @param {?} symbolResolver
 * @param {?} symbols
 * @param {?} types
 * @return {?}
 */
function serializeSummaries(summaryResolver, symbolResolver, symbols, types) {
    var /** @type {?} */ serializer = new Serializer$1(symbolResolver, summaryResolver);
    // for symbols, we use everything except for the class metadata itself
    // (we keep the statics though), as the class metadata is contained in the
    // CompileTypeSummary.
    symbols.forEach(function (resolvedSymbol) { return serializer.addOrMergeSummary({ symbol: resolvedSymbol.symbol, metadata: resolvedSymbol.metadata }); });
    // Add summaries that are referenced by the given symbols (transitively)
    // Note: the serializer.symbols array might be growing while
    // we execute the loop!
    for (var /** @type {?} */ processedIndex = 0; processedIndex < serializer.symbols.length; processedIndex++) {
        var /** @type {?} */ symbol = serializer.symbols[processedIndex];
        if (summaryResolver.isLibraryFile(symbol.filePath)) {
            var /** @type {?} */ summary = summaryResolver.resolveSummary(symbol);
            if (!summary) {
                // some symbols might originate from a plain typescript library
                // that just exported .d.ts and .metadata.json files, i.e. where no summary
                // files were created.
                var /** @type {?} */ resolvedSymbol = symbolResolver.resolveSymbol(symbol);
                if (resolvedSymbol) {
                    summary = { symbol: resolvedSymbol.symbol, metadata: resolvedSymbol.metadata };
                }
            }
            if (summary) {
                serializer.addOrMergeSummary(summary);
            }
        }
    }
    // Add type summaries.
    // Note: We don't add the summaries of all referenced symbols as for the ResolvedSymbols,
    // as the type summaries already contain the transitive data that they require
    // (in a minimal way).
    types.forEach(function (typeSummary) {
        serializer.addOrMergeSummary({ symbol: typeSummary.type.reference, metadata: null, type: typeSummary });
        if (typeSummary.summaryKind === CompileSummaryKind.NgModule) {
            var /** @type {?} */ ngModuleSummary = (typeSummary);
            ngModuleSummary.exportedDirectives.concat(ngModuleSummary.exportedPipes).forEach(function (id) {
                var /** @type {?} */ symbol = id.reference;
                if (summaryResolver.isLibraryFile(symbol.filePath)) {
                    var /** @type {?} */ summary = summaryResolver.resolveSummary(symbol);
                    if (summary) {
                        serializer.addOrMergeSummary(summary);
                    }
                }
            });
        }
    });
    return serializer.serialize();
}
/**
 * @param {?} symbolCache
 * @param {?} json
 * @return {?}
 */
function deserializeSummaries(symbolCache, json) {
    var /** @type {?} */ deserializer = new Deserializer(symbolCache);
    return deserializer.deserialize(json);
}
var Serializer$1 = (function (_super) {
    __extends(Serializer$1, _super);
    /**
     * @param {?} symbolResolver
     * @param {?} summaryResolver
     */
    function Serializer$1(symbolResolver, summaryResolver) {
        var _this = _super.call(this) || this;
        _this.symbolResolver = symbolResolver;
        _this.summaryResolver = summaryResolver;
        // Note: This only contains symbols without members.
        _this.symbols = [];
        _this.indexBySymbol = new Map();
        _this.processedSummaryBySymbol = new Map();
        _this.processedSummaries = [];
        return _this;
    }
    /**
     * @param {?} summary
     * @return {?}
     */
    Serializer$1.prototype.addOrMergeSummary = function (summary) {
        var /** @type {?} */ symbolMeta = summary.metadata;
        if (symbolMeta && symbolMeta.__symbolic === 'class') {
            // For classes, we keep everything except their class decorators.
            // We need to keep e.g. the ctor args, method names, method decorators
            // so that the class can be extended in another compilation unit.
            // We don't keep the class decorators as
            // 1) they refer to data
            //   that should not cause a rebuild of downstream compilation units
            //   (e.g. inline templates of @Component, or @NgModule.declarations)
            // 2) their data is already captured in TypeSummaries, e.g. DirectiveSummary.
            var /** @type {?} */ clone_1 = {};
            Object.keys(symbolMeta).forEach(function (propName) {
                if (propName !== 'decorators') {
                    clone_1[propName] = symbolMeta[propName];
                }
            });
            symbolMeta = clone_1;
        }
        var /** @type {?} */ processedSummary = this.processedSummaryBySymbol.get(summary.symbol);
        if (!processedSummary) {
            processedSummary = this.processValue({ symbol: summary.symbol });
            this.processedSummaries.push(processedSummary);
            this.processedSummaryBySymbol.set(summary.symbol, processedSummary);
        }
        // Note: == on purpose to compare with undefined!
        if (processedSummary.metadata == null && symbolMeta != null) {
            processedSummary.metadata = this.processValue(symbolMeta);
        }
        // Note: == on purpose to compare with undefined!
        if (processedSummary.type == null && summary.type != null) {
            processedSummary.type = this.processValue(summary.type);
        }
    };
    /**
     * @return {?}
     */
    Serializer$1.prototype.serialize = function () {
        var _this = this;
        var /** @type {?} */ exportAs = [];
        var /** @type {?} */ json = JSON.stringify({
            summaries: this.processedSummaries,
            symbols: this.symbols.map(function (symbol, index) {
                symbol.assertNoMembers();
                var /** @type {?} */ importAs = ((undefined));
                if (_this.summaryResolver.isLibraryFile(symbol.filePath)) {
                    importAs = symbol.name + "_" + index;
                    exportAs.push({ symbol: symbol, exportAs: importAs });
                }
                return {
                    __symbol: index,
                    name: symbol.name,
                    // We convert the source filenames tinto output filenames,
                    // as the generated summary file will be used when teh current
                    // compilation unit is used as a library
                    filePath: _this.summaryResolver.getLibraryFileName(symbol.filePath),
                    importAs: importAs
                };
            })
        });
        return { json: json, exportAs: exportAs };
    };
    /**
     * @param {?} value
     * @return {?}
     */
    Serializer$1.prototype.processValue = function (value) { return visitValue(value, this, null); };
    /**
     * @param {?} value
     * @param {?} context
     * @return {?}
     */
    Serializer$1.prototype.visitOther = function (value, context) {
        if (value instanceof StaticSymbol) {
            var /** @type {?} */ baseSymbol = this.symbolResolver.getStaticSymbol(value.filePath, value.name);
            var /** @type {?} */ index = this.indexBySymbol.get(baseSymbol);
            // Note: == on purpose to compare with undefined!
            if (index == null) {
                index = this.indexBySymbol.size;
                this.indexBySymbol.set(baseSymbol, index);
                this.symbols.push(baseSymbol);
            }
            return { __symbol: index, members: value.members };
        }
    };
    return Serializer$1;
}(ValueTransformer));
var Deserializer = (function (_super) {
    __extends(Deserializer, _super);
    /**
     * @param {?} symbolCache
     */
    function Deserializer(symbolCache) {
        var _this = _super.call(this) || this;
        _this.symbolCache = symbolCache;
        return _this;
    }
    /**
     * @param {?} json
     * @return {?}
     */
    Deserializer.prototype.deserialize = function (json) {
        var _this = this;
        var /** @type {?} */ data = JSON.parse(json);
        var /** @type {?} */ importAs = [];
        this.symbols = [];
        data.symbols.forEach(function (serializedSymbol) {
            var /** @type {?} */ symbol = _this.symbolCache.get(serializedSymbol.filePath, serializedSymbol.name);
            _this.symbols.push(symbol);
            if (serializedSymbol.importAs) {
                importAs.push({ symbol: symbol, importAs: serializedSymbol.importAs });
            }
        });
        var /** @type {?} */ summaries = visitValue(data.summaries, this, null);
        return { summaries: summaries, importAs: importAs };
    };
    /**
     * @param {?} map
     * @param {?} context
     * @return {?}
     */
    Deserializer.prototype.visitStringMap = function (map, context) {
        if ('__symbol' in map) {
            var /** @type {?} */ baseSymbol = this.symbols[map['__symbol']];
            var /** @type {?} */ members = map['members'];
            return members.length ? this.symbolCache.get(baseSymbol.filePath, baseSymbol.name, members) :
                baseSymbol;
        }
        else {
            return _super.prototype.visitStringMap.call(this, map, context);
        }
    };
    return Deserializer;
}(ValueTransformer));
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var AotCompiler = (function () {
    /**
     * @param {?} _config
     * @param {?} _host
     * @param {?} _metadataResolver
     * @param {?} _templateParser
     * @param {?} _styleCompiler
     * @param {?} _viewCompiler
     * @param {?} _ngModuleCompiler
     * @param {?} _outputEmitter
     * @param {?} _summaryResolver
     * @param {?} _localeId
     * @param {?} _translationFormat
     * @param {?} _genFilePreamble
     * @param {?} _symbolResolver
     */
    function AotCompiler(_config, _host, _metadataResolver, _templateParser, _styleCompiler, _viewCompiler, _ngModuleCompiler, _outputEmitter, _summaryResolver, _localeId, _translationFormat, _genFilePreamble, _symbolResolver) {
        this._config = _config;
        this._host = _host;
        this._metadataResolver = _metadataResolver;
        this._templateParser = _templateParser;
        this._styleCompiler = _styleCompiler;
        this._viewCompiler = _viewCompiler;
        this._ngModuleCompiler = _ngModuleCompiler;
        this._outputEmitter = _outputEmitter;
        this._summaryResolver = _summaryResolver;
        this._localeId = _localeId;
        this._translationFormat = _translationFormat;
        this._genFilePreamble = _genFilePreamble;
        this._symbolResolver = _symbolResolver;
    }
    /**
     * @return {?}
     */
    AotCompiler.prototype.clearCache = function () { this._metadataResolver.clearCache(); };
    /**
     * @param {?} rootFiles
     * @return {?}
     */
    AotCompiler.prototype.compileAll = function (rootFiles) {
        var _this = this;
        var /** @type {?} */ programSymbols = extractProgramSymbols(this._symbolResolver, rootFiles, this._host);
        var _a = analyzeAndValidateNgModules(programSymbols, this._host, this._metadataResolver), ngModuleByPipeOrDirective = _a.ngModuleByPipeOrDirective, files = _a.files, ngModules = _a.ngModules;
        return Promise
            .all(ngModules.map(function (ngModule) { return _this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false); }))
            .then(function () {
            var /** @type {?} */ sourceModules = files.map(function (file) { return _this._compileSrcFile(file.srcUrl, ngModuleByPipeOrDirective, file.directives, file.pipes, file.ngModules, file.injectables); });
            return flatten(sourceModules);
        });
    };
    /**
     * @param {?} srcFileUrl
     * @param {?} ngModuleByPipeOrDirective
     * @param {?} directives
     * @param {?} pipes
     * @param {?} ngModules
     * @param {?} injectables
     * @return {?}
     */
    AotCompiler.prototype._compileSrcFile = function (srcFileUrl, ngModuleByPipeOrDirective, directives, pipes, ngModules, injectables) {
        var _this = this;
        var /** @type {?} */ fileSuffix = splitTypescriptSuffix(srcFileUrl)[1];
        var /** @type {?} */ statements = [];
        var /** @type {?} */ exportedVars = [];
        var /** @type {?} */ generatedFiles = [];
        generatedFiles.push(this._createSummary(srcFileUrl, directives, pipes, ngModules, injectables, statements, exportedVars));
        // compile all ng modules
        exportedVars.push.apply(exportedVars, ngModules.map(function (ngModuleType) { return _this._compileModule(ngModuleType, statements); }));
        // compile components
        directives.forEach(function (dirType) {
            var /** @type {?} */ compMeta = _this._metadataResolver.getDirectiveMetadata(/** @type {?} */ (dirType));
            if (!compMeta.isComponent) {
                return Promise.resolve(null);
            }
            var /** @type {?} */ ngModule = ngModuleByPipeOrDirective.get(dirType);
            if (!ngModule) {
                throw new Error("Internal Error: cannot determine the module for component " + identifierName(compMeta.type) + "!");
            }
            _assertComponent(compMeta);
            // compile styles
            var /** @type {?} */ stylesCompileResults = _this._styleCompiler.compileComponent(compMeta);
            stylesCompileResults.externalStylesheets.forEach(function (compiledStyleSheet) {
                generatedFiles.push(_this._codgenStyles(srcFileUrl, compiledStyleSheet, fileSuffix));
            });
            // compile components
            var /** @type {?} */ compViewVars = _this._compileComponent(compMeta, ngModule, ngModule.transitiveModule.directives, stylesCompileResults.componentStylesheet, fileSuffix, statements);
            exportedVars.push(_this._compileComponentFactory(compMeta, ngModule, fileSuffix, statements), compViewVars.viewClassVar, compViewVars.compRenderTypeVar);
        });
        if (statements.length > 0) {
            var /** @type {?} */ srcModule = this._codegenSourceModule(srcFileUrl, ngfactoryFilePath(srcFileUrl), statements, exportedVars);
            generatedFiles.unshift(srcModule);
        }
        return generatedFiles;
    };
    /**
     * @param {?} srcFileUrl
     * @param {?} directives
     * @param {?} pipes
     * @param {?} ngModules
     * @param {?} injectables
     * @param {?} targetStatements
     * @param {?} targetExportedVars
     * @return {?}
     */
    AotCompiler.prototype._createSummary = function (srcFileUrl, directives, pipes, ngModules, injectables, targetStatements, targetExportedVars) {
        var _this = this;
        var /** @type {?} */ symbolSummaries = this._symbolResolver.getSymbolsOf(srcFileUrl)
            .map(function (symbol) { return _this._symbolResolver.resolveSymbol(symbol); });
        var /** @type {?} */ typeSummaries = ngModules.map(function (ref) { return ((_this._metadataResolver.getNgModuleSummary(ref))); }).concat(directives.map(function (ref) { return ((_this._metadataResolver.getDirectiveSummary(ref))); }), pipes.map(function (ref) { return ((_this._metadataResolver.getPipeSummary(ref))); }), injectables.map(function (ref) { return ((_this._metadataResolver.getInjectableSummary(ref))); }));
        var _a = serializeSummaries(this._summaryResolver, this._symbolResolver, symbolSummaries, typeSummaries), json = _a.json, exportAs = _a.exportAs;
        exportAs.forEach(function (entry) {
            targetStatements.push(variable(entry.exportAs).set(importExpr({ reference: entry.symbol })).toDeclStmt());
            targetExportedVars.push(entry.exportAs);
        });
        return new GeneratedFile(srcFileUrl, summaryFileName(srcFileUrl), json);
    };
    /**
     * @param {?} ngModuleType
     * @param {?} targetStatements
     * @return {?}
     */
    AotCompiler.prototype._compileModule = function (ngModuleType, targetStatements) {
        var /** @type {?} */ ngModule = ((this._metadataResolver.getNgModuleMetadata(ngModuleType)));
        var /** @type {?} */ providers = [];
        if (this._localeId) {
            providers.push({
                token: createIdentifierToken(Identifiers.LOCALE_ID),
                useValue: this._localeId,
            });
        }
        if (this._translationFormat) {
            providers.push({
                token: createIdentifierToken(Identifiers.TRANSLATIONS_FORMAT),
                useValue: this._translationFormat
            });
        }
        var /** @type {?} */ appCompileResult = this._ngModuleCompiler.compile(ngModule, providers);
        targetStatements.push.apply(targetStatements, appCompileResult.statements);
        return appCompileResult.ngModuleFactoryVar;
    };
    /**
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} fileSuffix
     * @param {?} targetStatements
     * @return {?}
     */
    AotCompiler.prototype._compileComponentFactory = function (compMeta, ngModule, fileSuffix, targetStatements) {
        var /** @type {?} */ hostType = this._metadataResolver.getHostComponentType(compMeta.type.reference);
        var /** @type {?} */ hostMeta = createHostComponentMeta(hostType, compMeta, this._metadataResolver.getHostComponentViewClass(hostType));
        var /** @type {?} */ hostViewFactoryVar = this._compileComponent(hostMeta, ngModule, [compMeta.type], null, fileSuffix, targetStatements)
            .viewClassVar;
        var /** @type {?} */ compFactoryVar = componentFactoryName(compMeta.type.reference);
        var /** @type {?} */ inputsExprs = [];
        for (var /** @type {?} */ propName in compMeta.inputs) {
            var /** @type {?} */ templateName = compMeta.inputs[propName];
            // Don't quote so that the key gets minified...
            inputsExprs.push(new LiteralMapEntry(propName, literal(templateName), false));
        }
        var /** @type {?} */ outputsExprs = [];
        for (var /** @type {?} */ propName in compMeta.outputs) {
            var /** @type {?} */ templateName = compMeta.outputs[propName];
            // Don't quote so that the key gets minified...
            outputsExprs.push(new LiteralMapEntry(propName, literal(templateName), false));
        }
        targetStatements.push(variable(compFactoryVar)
            .set(importExpr(createIdentifier(Identifiers.createComponentFactory)).callFn([
            literal(compMeta.selector), importExpr(compMeta.type),
            variable(hostViewFactoryVar), new LiteralMapExpr(inputsExprs),
            new LiteralMapExpr(outputsExprs),
            literalArr(/** @type {?} */ ((compMeta.template)).ngContentSelectors.map(function (selector) { return literal(selector); }))
        ]))
            .toDeclStmt(importType(createIdentifier(Identifiers.ComponentFactory), [/** @type {?} */ ((importType(compMeta.type)))], [TypeModifier.Const]), [StmtModifier.Final]));
        return compFactoryVar;
    };
    /**
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} directiveIdentifiers
     * @param {?} componentStyles
     * @param {?} fileSuffix
     * @param {?} targetStatements
     * @return {?}
     */
    AotCompiler.prototype._compileComponent = function (compMeta, ngModule, directiveIdentifiers, componentStyles, fileSuffix, targetStatements) {
        var _this = this;
        var /** @type {?} */ directives = directiveIdentifiers.map(function (dir) { return _this._metadataResolver.getDirectiveSummary(dir.reference); });
        var /** @type {?} */ pipes = ngModule.transitiveModule.pipes.map(function (pipe) { return _this._metadataResolver.getPipeSummary(pipe.reference); });
        var _a = this._templateParser.parse(compMeta, /** @type {?} */ ((((compMeta.template)).template)), directives, pipes, ngModule.schemas, templateSourceUrl(ngModule.type, compMeta, /** @type {?} */ ((compMeta.template)))), parsedTemplate = _a.template, usedPipes = _a.pipes;
        var /** @type {?} */ stylesExpr = componentStyles ? variable(componentStyles.stylesVar) : literalArr([]);
        var /** @type {?} */ viewResult = this._viewCompiler.compileComponent(compMeta, parsedTemplate, stylesExpr, usedPipes);
        if (componentStyles) {
            targetStatements.push.apply(targetStatements, _resolveStyleStatements(this._symbolResolver, componentStyles, fileSuffix));
        }
        targetStatements.push.apply(targetStatements, viewResult.statements);
        return { viewClassVar: viewResult.viewClassVar, compRenderTypeVar: viewResult.rendererTypeVar };
    };
    /**
     * @param {?} fileUrl
     * @param {?} stylesCompileResult
     * @param {?} fileSuffix
     * @return {?}
     */
    AotCompiler.prototype._codgenStyles = function (fileUrl, stylesCompileResult, fileSuffix) {
        _resolveStyleStatements(this._symbolResolver, stylesCompileResult, fileSuffix);
        return this._codegenSourceModule(fileUrl, _stylesModuleUrl(/** @type {?} */ ((stylesCompileResult.meta.moduleUrl)), stylesCompileResult.isShimmed, fileSuffix), stylesCompileResult.statements, [stylesCompileResult.stylesVar]);
    };
    /**
     * @param {?} srcFileUrl
     * @param {?} genFileUrl
     * @param {?} statements
     * @param {?} exportedVars
     * @return {?}
     */
    AotCompiler.prototype._codegenSourceModule = function (srcFileUrl, genFileUrl, statements, exportedVars) {
        return new GeneratedFile(srcFileUrl, genFileUrl, this._outputEmitter.emitStatements(sourceUrl(srcFileUrl), genFileUrl, statements, exportedVars, this._genFilePreamble));
    };
    return AotCompiler;
}());
/**
 * @param {?} reflector
 * @param {?} compileResult
 * @param {?} fileSuffix
 * @return {?}
 */
function _resolveStyleStatements(reflector, compileResult, fileSuffix) {
    compileResult.dependencies.forEach(function (dep) {
        dep.valuePlaceholder.reference = reflector.getStaticSymbol(_stylesModuleUrl(dep.moduleUrl, dep.isShimmed, fileSuffix), dep.name);
    });
    return compileResult.statements;
}
/**
 * @param {?} stylesheetUrl
 * @param {?} shim
 * @param {?} suffix
 * @return {?}
 */
function _stylesModuleUrl(stylesheetUrl, shim, suffix) {
    return "" + stylesheetUrl + (shim ? '.shim' : '') + ".ngstyle" + suffix;
}
/**
 * @param {?} meta
 * @return {?}
 */
function _assertComponent(meta) {
    if (!meta.isComponent) {
        throw new Error("Could not compile '" + identifierName(meta.type) + "' because it is not a component.");
    }
}
/**
 * @param {?} programStaticSymbols
 * @param {?} host
 * @param {?} metadataResolver
 * @return {?}
 */
function analyzeNgModules(programStaticSymbols, host, metadataResolver) {
    var _a = _createNgModules(programStaticSymbols, host, metadataResolver), ngModules = _a.ngModules, symbolsMissingModule = _a.symbolsMissingModule;
    return _analyzeNgModules(programStaticSymbols, ngModules, symbolsMissingModule, metadataResolver);
}
/**
 * @param {?} programStaticSymbols
 * @param {?} host
 * @param {?} metadataResolver
 * @return {?}
 */
function analyzeAndValidateNgModules(programStaticSymbols, host, metadataResolver) {
    var /** @type {?} */ result = analyzeNgModules(programStaticSymbols, host, metadataResolver);
    if (result.symbolsMissingModule && result.symbolsMissingModule.length) {
        var /** @type {?} */ messages = result.symbolsMissingModule.map(function (s) { return "Cannot determine the module for class " + s.name + " in " + s.filePath + "! Add " + s.name + " to the NgModule to fix it."; });
        throw syntaxError(messages.join('\n'));
    }
    return result;
}
/**
 * @param {?} programSymbols
 * @param {?} ngModuleMetas
 * @param {?} symbolsMissingModule
 * @param {?} metadataResolver
 * @return {?}
 */
function _analyzeNgModules(programSymbols, ngModuleMetas, symbolsMissingModule, metadataResolver) {
    var /** @type {?} */ moduleMetasByRef = new Map();
    ngModuleMetas.forEach(function (ngModule) { return moduleMetasByRef.set(ngModule.type.reference, ngModule); });
    var /** @type {?} */ ngModuleByPipeOrDirective = new Map();
    var /** @type {?} */ ngModulesByFile = new Map();
    var /** @type {?} */ ngDirectivesByFile = new Map();
    var /** @type {?} */ ngPipesByFile = new Map();
    var /** @type {?} */ ngInjectablesByFile = new Map();
    var /** @type {?} */ filePaths = new Set();
    // Make sure we produce an analyzed file for each input file
    programSymbols.forEach(function (symbol) {
        var /** @type {?} */ filePath = symbol.filePath;
        filePaths.add(filePath);
        if (metadataResolver.isInjectable(symbol)) {
            ngInjectablesByFile.set(filePath, (ngInjectablesByFile.get(filePath) || []).concat(symbol));
        }
    });
    // Looping over all modules to construct:
    // - a map from file to modules `ngModulesByFile`,
    // - a map from file to directives `ngDirectivesByFile`,
    // - a map from file to pipes `ngPipesByFile`,
    // - a map from directive/pipe to module `ngModuleByPipeOrDirective`.
    ngModuleMetas.forEach(function (ngModuleMeta) {
        var /** @type {?} */ srcFileUrl = ngModuleMeta.type.reference.filePath;
        filePaths.add(srcFileUrl);
        ngModulesByFile.set(srcFileUrl, (ngModulesByFile.get(srcFileUrl) || []).concat(ngModuleMeta.type.reference));
        ngModuleMeta.declaredDirectives.forEach(function (dirIdentifier) {
            var /** @type {?} */ fileUrl = dirIdentifier.reference.filePath;
            filePaths.add(fileUrl);
            ngDirectivesByFile.set(fileUrl, (ngDirectivesByFile.get(fileUrl) || []).concat(dirIdentifier.reference));
            ngModuleByPipeOrDirective.set(dirIdentifier.reference, ngModuleMeta);
        });
        ngModuleMeta.declaredPipes.forEach(function (pipeIdentifier) {
            var /** @type {?} */ fileUrl = pipeIdentifier.reference.filePath;
            filePaths.add(fileUrl);
            ngPipesByFile.set(fileUrl, (ngPipesByFile.get(fileUrl) || []).concat(pipeIdentifier.reference));
            ngModuleByPipeOrDirective.set(pipeIdentifier.reference, ngModuleMeta);
        });
    });
    var /** @type {?} */ files = [];
    filePaths.forEach(function (srcUrl) {
        var /** @type {?} */ directives = ngDirectivesByFile.get(srcUrl) || [];
        var /** @type {?} */ pipes = ngPipesByFile.get(srcUrl) || [];
        var /** @type {?} */ ngModules = ngModulesByFile.get(srcUrl) || [];
        var /** @type {?} */ injectables = ngInjectablesByFile.get(srcUrl) || [];
        files.push({ srcUrl: srcUrl, directives: directives, pipes: pipes, ngModules: ngModules, injectables: injectables });
    });
    return {
        // map directive/pipe to module
        ngModuleByPipeOrDirective: ngModuleByPipeOrDirective,
        // list modules and directives for every source file
        files: files,
        ngModules: ngModuleMetas, symbolsMissingModule: symbolsMissingModule
    };
}
/**
 * @param {?} staticSymbolResolver
 * @param {?} files
 * @param {?} host
 * @return {?}
 */
function extractProgramSymbols(staticSymbolResolver, files, host) {
    var /** @type {?} */ staticSymbols = [];
    files.filter(function (fileName) { return host.isSourceFile(fileName); }).forEach(function (sourceFile) {
        staticSymbolResolver.getSymbolsOf(sourceFile).forEach(function (symbol) {
            var /** @type {?} */ resolvedSymbol = staticSymbolResolver.resolveSymbol(symbol);
            var /** @type {?} */ symbolMeta = resolvedSymbol.metadata;
            if (symbolMeta) {
                if (symbolMeta.__symbolic != 'error') {
                    // Ignore symbols that are only included to record error information.
                    staticSymbols.push(resolvedSymbol.symbol);
                }
            }
        });
    });
    return staticSymbols;
}
/**
 * @param {?} programStaticSymbols
 * @param {?} host
 * @param {?} metadataResolver
 * @return {?}
 */
function _createNgModules(programStaticSymbols, host, metadataResolver) {
    var /** @type {?} */ ngModules = new Map();
    var /** @type {?} */ programPipesAndDirectives = [];
    var /** @type {?} */ ngModulePipesAndDirective = new Set();
    var /** @type {?} */ addNgModule = function (staticSymbol) {
        if (ngModules.has(staticSymbol) || !host.isSourceFile(staticSymbol.filePath)) {
            return false;
        }
        var /** @type {?} */ ngModule = metadataResolver.getNgModuleMetadata(staticSymbol, false);
        if (ngModule) {
            ngModules.set(ngModule.type.reference, ngModule);
            ngModule.declaredDirectives.forEach(function (dir) { return ngModulePipesAndDirective.add(dir.reference); });
            ngModule.declaredPipes.forEach(function (pipe) { return ngModulePipesAndDirective.add(pipe.reference); });
            // For every input module add the list of transitively included modules
            ngModule.transitiveModule.modules.forEach(function (modMeta) { return addNgModule(modMeta.reference); });
        }
        return !!ngModule;
    };
    programStaticSymbols.forEach(function (staticSymbol) {
        if (!addNgModule(staticSymbol) &&
            (metadataResolver.isDirective(staticSymbol) || metadataResolver.isPipe(staticSymbol))) {
            programPipesAndDirectives.push(staticSymbol);
        }
    });
    // Throw an error if any of the program pipe or directives is not declared by a module
    var /** @type {?} */ symbolsMissingModule = programPipesAndDirectives.filter(function (s) { return !ngModulePipesAndDirective.has(s); });
    return { ngModules: Array.from(ngModules.values()), symbolsMissingModule: symbolsMissingModule };
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var StaticAndDynamicReflectionCapabilities = (function () {
    /**
     * @param {?} staticDelegate
     */
    function StaticAndDynamicReflectionCapabilities(staticDelegate) {
        this.staticDelegate = staticDelegate;
        this.dynamicDelegate = new ɵReflectionCapabilities();
    }
    /**
     * @param {?} staticDelegate
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.install = function (staticDelegate) {
        ɵreflector.updateCapabilities(new StaticAndDynamicReflectionCapabilities(staticDelegate));
    };
    /**
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.isReflectionEnabled = function () { return true; };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.factory = function (type) { return this.dynamicDelegate.factory(type); };
    /**
     * @param {?} type
     * @param {?} lcProperty
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.hasLifecycleHook = function (type, lcProperty) {
        return isStaticType(type) ? this.staticDelegate.hasLifecycleHook(type, lcProperty) :
            this.dynamicDelegate.hasLifecycleHook(type, lcProperty);
    };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.parameters = function (type) {
        return isStaticType(type) ? this.staticDelegate.parameters(type) :
            this.dynamicDelegate.parameters(type);
    };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.annotations = function (type) {
        return isStaticType(type) ? this.staticDelegate.annotations(type) :
            this.dynamicDelegate.annotations(type);
    };
    /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.propMetadata = function (typeOrFunc) {
        return isStaticType(typeOrFunc) ? this.staticDelegate.propMetadata(typeOrFunc) :
            this.dynamicDelegate.propMetadata(typeOrFunc);
    };
    /**
     * @param {?} name
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.getter = function (name) { return this.dynamicDelegate.getter(name); };
    /**
     * @param {?} name
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.setter = function (name) { return this.dynamicDelegate.setter(name); };
    /**
     * @param {?} name
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.method = function (name) { return this.dynamicDelegate.method(name); };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.importUri = function (type) { return ((this.staticDelegate.importUri(type))); };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.resourceUri = function (type) { return this.staticDelegate.resourceUri(type); };
    /**
     * @param {?} name
     * @param {?} moduleUrl
     * @param {?} members
     * @param {?} runtime
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.resolveIdentifier = function (name, moduleUrl, members, runtime) {
        return this.staticDelegate.resolveIdentifier(name, moduleUrl, members);
    };
    /**
     * @param {?} enumIdentifier
     * @param {?} name
     * @return {?}
     */
    StaticAndDynamicReflectionCapabilities.prototype.resolveEnum = function (enumIdentifier, name) {
        if (isStaticType(enumIdentifier)) {
            return this.staticDelegate.resolveEnum(enumIdentifier, name);
        }
        else {
            return null;
        }
    };
    return StaticAndDynamicReflectionCapabilities;
}());
/**
 * @param {?} type
 * @return {?}
 */
function isStaticType(type) {
    return typeof type === 'object' && type.name && type.filePath;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var ANGULAR_CORE = '@angular/core';
var HIDDEN_KEY = /^\$.*\$$/;
var IGNORE = {
    __symbolic: 'ignore'
};
/**
 * @param {?} value
 * @return {?}
 */
function shouldIgnore(value) {
    return value && value.__symbolic == 'ignore';
}
/**
 * A static reflector implements enough of the Reflector API that is necessary to compile
 * templates statically.
 */
var StaticReflector = (function () {
    /**
     * @param {?} summaryResolver
     * @param {?} symbolResolver
     * @param {?=} knownMetadataClasses
     * @param {?=} knownMetadataFunctions
     * @param {?=} errorRecorder
     */
    function StaticReflector(summaryResolver, symbolResolver, knownMetadataClasses, knownMetadataFunctions, errorRecorder) {
        if (knownMetadataClasses === void 0) { knownMetadataClasses = []; }
        if (knownMetadataFunctions === void 0) { knownMetadataFunctions = []; }
        var _this = this;
        this.summaryResolver = summaryResolver;
        this.symbolResolver = symbolResolver;
        this.errorRecorder = errorRecorder;
        this.annotationCache = new Map();
        this.propertyCache = new Map();
        this.parameterCache = new Map();
        this.methodCache = new Map();
        this.conversionMap = new Map();
        this.annotationForParentClassWithSummaryKind = new Map();
        this.annotationNames = new Map();
        this.initializeConversionMap();
        knownMetadataClasses.forEach(function (kc) { return _this._registerDecoratorOrConstructor(_this.getStaticSymbol(kc.filePath, kc.name), kc.ctor); });
        knownMetadataFunctions.forEach(function (kf) { return _this._registerFunction(_this.getStaticSymbol(kf.filePath, kf.name), kf.fn); });
        this.annotationForParentClassWithSummaryKind.set(CompileSummaryKind.Directive, [Directive, Component]);
        this.annotationForParentClassWithSummaryKind.set(CompileSummaryKind.Pipe, [Pipe]);
        this.annotationForParentClassWithSummaryKind.set(CompileSummaryKind.NgModule, [NgModule]);
        this.annotationForParentClassWithSummaryKind.set(CompileSummaryKind.Injectable, [Injectable, Pipe, Directive, Component, NgModule]);
        this.annotationNames.set(Directive, 'Directive');
        this.annotationNames.set(Component, 'Component');
        this.annotationNames.set(Pipe, 'Pipe');
        this.annotationNames.set(NgModule, 'NgModule');
        this.annotationNames.set(Injectable, 'Injectable');
    }
    /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    StaticReflector.prototype.importUri = function (typeOrFunc) {
        var /** @type {?} */ staticSymbol = this.findSymbolDeclaration(typeOrFunc);
        return staticSymbol ? staticSymbol.filePath : null;
    };
    /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    StaticReflector.prototype.resourceUri = function (typeOrFunc) {
        var /** @type {?} */ staticSymbol = this.findSymbolDeclaration(typeOrFunc);
        return this.symbolResolver.getResourcePath(staticSymbol);
    };
    /**
     * @param {?} name
     * @param {?} moduleUrl
     * @param {?} members
     * @return {?}
     */
    StaticReflector.prototype.resolveIdentifier = function (name, moduleUrl, members) {
        var /** @type {?} */ importSymbol = this.getStaticSymbol(moduleUrl, name);
        var /** @type {?} */ rootSymbol = this.findDeclaration(moduleUrl, name);
        if (importSymbol != rootSymbol) {
            this.symbolResolver.recordImportAs(rootSymbol, importSymbol);
        }
        if (members && members.length) {
            return this.getStaticSymbol(rootSymbol.filePath, rootSymbol.name, members);
        }
        return rootSymbol;
    };
    /**
     * @param {?} moduleUrl
     * @param {?} name
     * @param {?=} containingFile
     * @return {?}
     */
    StaticReflector.prototype.findDeclaration = function (moduleUrl, name, containingFile) {
        return this.findSymbolDeclaration(this.symbolResolver.getSymbolByModule(moduleUrl, name, containingFile));
    };
    /**
     * @param {?} symbol
     * @return {?}
     */
    StaticReflector.prototype.findSymbolDeclaration = function (symbol) {
        var /** @type {?} */ resolvedSymbol = this.symbolResolver.resolveSymbol(symbol);
        if (resolvedSymbol && resolvedSymbol.metadata instanceof StaticSymbol) {
            return this.findSymbolDeclaration(resolvedSymbol.metadata);
        }
        else {
            return symbol;
        }
    };
    /**
     * @param {?} enumIdentifier
     * @param {?} name
     * @return {?}
     */
    StaticReflector.prototype.resolveEnum = function (enumIdentifier, name) {
        var /** @type {?} */ staticSymbol = enumIdentifier;
        var /** @type {?} */ members = (staticSymbol.members || []).concat(name);
        return this.getStaticSymbol(staticSymbol.filePath, staticSymbol.name, members);
    };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticReflector.prototype.annotations = function (type) {
        var _this = this;
        var /** @type {?} */ annotations = this.annotationCache.get(type);
        if (!annotations) {
            annotations = [];
            var /** @type {?} */ classMetadata = this.getTypeMetadata(type);
            var /** @type {?} */ parentType = this.findParentType(type, classMetadata);
            if (parentType) {
                var /** @type {?} */ parentAnnotations = this.annotations(parentType);
                annotations.push.apply(annotations, parentAnnotations);
            }
            var /** @type {?} */ ownAnnotations_1 = [];
            if (classMetadata['decorators']) {
                ownAnnotations_1 = this.simplify(type, classMetadata['decorators']);
                annotations.push.apply(annotations, ownAnnotations_1);
            }
            if (parentType && !this.summaryResolver.isLibraryFile(type.filePath) &&
                this.summaryResolver.isLibraryFile(parentType.filePath)) {
                var /** @type {?} */ summary = this.summaryResolver.resolveSummary(parentType);
                if (summary && summary.type) {
                    var /** @type {?} */ requiredAnnotationTypes = ((this.annotationForParentClassWithSummaryKind.get(/** @type {?} */ ((summary.type.summaryKind)))));
                    var /** @type {?} */ typeHasRequiredAnnotation = requiredAnnotationTypes.some(function (requiredType) { return ownAnnotations_1.some(function (ann) { return ann instanceof requiredType; }); });
                    if (!typeHasRequiredAnnotation) {
                        this.reportError(syntaxError("Class " + type.name + " in " + type.filePath + " extends from a " + CompileSummaryKind[((summary.type.summaryKind))] + " in another compilation unit without duplicating the decorator. " +
                            ("Please add a " + requiredAnnotationTypes.map(function (type) { return _this.annotationNames.get(type); }).join(' or ') + " decorator to the class.")), type);
                    }
                }
            }
            this.annotationCache.set(type, annotations.filter(function (ann) { return !!ann; }));
        }
        return annotations;
    };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticReflector.prototype.propMetadata = function (type) {
        var _this = this;
        var /** @type {?} */ propMetadata = this.propertyCache.get(type);
        if (!propMetadata) {
            var /** @type {?} */ classMetadata = this.getTypeMetadata(type);
            propMetadata = {};
            var /** @type {?} */ parentType = this.findParentType(type, classMetadata);
            if (parentType) {
                var /** @type {?} */ parentPropMetadata_1 = this.propMetadata(parentType);
                Object.keys(parentPropMetadata_1).forEach(function (parentProp) {
                    ((propMetadata))[parentProp] = parentPropMetadata_1[parentProp];
                });
            }
            var /** @type {?} */ members_1 = classMetadata['members'] || {};
            Object.keys(members_1).forEach(function (propName) {
                var /** @type {?} */ propData = members_1[propName];
                var /** @type {?} */ prop = ((propData))
                    .find(function (a) { return a['__symbolic'] == 'property' || a['__symbolic'] == 'method'; });
                var /** @type {?} */ decorators = [];
                if (((propMetadata))[propName]) {
                    decorators.push.apply(decorators, ((propMetadata))[propName]);
                } /** @type {?} */
                ((propMetadata))[propName] = decorators;
                if (prop && prop['decorators']) {
                    decorators.push.apply(decorators, _this.simplify(type, prop['decorators']));
                }
            });
            this.propertyCache.set(type, propMetadata);
        }
        return propMetadata;
    };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticReflector.prototype.parameters = function (type) {
        if (!(type instanceof StaticSymbol)) {
            this.reportError(new Error("parameters received " + JSON.stringify(type) + " which is not a StaticSymbol"), type);
            return [];
        }
        try {
            var /** @type {?} */ parameters_1 = this.parameterCache.get(type);
            if (!parameters_1) {
                var /** @type {?} */ classMetadata = this.getTypeMetadata(type);
                var /** @type {?} */ parentType = this.findParentType(type, classMetadata);
                var /** @type {?} */ members = classMetadata ? classMetadata['members'] : null;
                var /** @type {?} */ ctorData = members ? members['__ctor__'] : null;
                if (ctorData) {
                    var /** @type {?} */ ctor = ((ctorData)).find(function (a) { return a['__symbolic'] == 'constructor'; });
                    var /** @type {?} */ parameterTypes = (this.simplify(type, ctor['parameters'] || []));
                    var /** @type {?} */ parameterDecorators_1 = (this.simplify(type, ctor['parameterDecorators'] || []));
                    parameters_1 = [];
                    parameterTypes.forEach(function (paramType, index) {
                        var /** @type {?} */ nestedResult = [];
                        if (paramType) {
                            nestedResult.push(paramType);
                        }
                        var /** @type {?} */ decorators = parameterDecorators_1 ? parameterDecorators_1[index] : null;
                        if (decorators) {
                            nestedResult.push.apply(nestedResult, decorators);
                        } /** @type {?} */
                        ((parameters_1)).push(nestedResult);
                    });
                }
                else if (parentType) {
                    parameters_1 = this.parameters(parentType);
                }
                if (!parameters_1) {
                    parameters_1 = [];
                }
                this.parameterCache.set(type, parameters_1);
            }
            return parameters_1;
        }
        catch (e) {
            console.error("Failed on type " + JSON.stringify(type) + " with error " + e);
            throw e;
        }
    };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticReflector.prototype._methodNames = function (type) {
        var /** @type {?} */ methodNames = this.methodCache.get(type);
        if (!methodNames) {
            var /** @type {?} */ classMetadata = this.getTypeMetadata(type);
            methodNames = {};
            var /** @type {?} */ parentType = this.findParentType(type, classMetadata);
            if (parentType) {
                var /** @type {?} */ parentMethodNames_1 = this._methodNames(parentType);
                Object.keys(parentMethodNames_1).forEach(function (parentProp) {
                    ((methodNames))[parentProp] = parentMethodNames_1[parentProp];
                });
            }
            var /** @type {?} */ members_2 = classMetadata['members'] || {};
            Object.keys(members_2).forEach(function (propName) {
                var /** @type {?} */ propData = members_2[propName];
                var /** @type {?} */ isMethod = ((propData)).some(function (a) { return a['__symbolic'] == 'method'; }); /** @type {?} */
                ((methodNames))[propName] = ((methodNames))[propName] || isMethod;
            });
            this.methodCache.set(type, methodNames);
        }
        return methodNames;
    };
    /**
     * @param {?} type
     * @param {?} classMetadata
     * @return {?}
     */
    StaticReflector.prototype.findParentType = function (type, classMetadata) {
        var /** @type {?} */ parentType = this.trySimplify(type, classMetadata['extends']);
        if (parentType instanceof StaticSymbol) {
            return parentType;
        }
    };
    /**
     * @param {?} type
     * @param {?} lcProperty
     * @return {?}
     */
    StaticReflector.prototype.hasLifecycleHook = function (type, lcProperty) {
        if (!(type instanceof StaticSymbol)) {
            this.reportError(new Error("hasLifecycleHook received " + JSON.stringify(type) + " which is not a StaticSymbol"), type);
        }
        try {
            return !!this._methodNames(type)[lcProperty];
        }
        catch (e) {
            console.error("Failed on type " + JSON.stringify(type) + " with error " + e);
            throw e;
        }
    };
    /**
     * @param {?} type
     * @param {?} ctor
     * @return {?}
     */
    StaticReflector.prototype._registerDecoratorOrConstructor = function (type, ctor) {
        this.conversionMap.set(type, function (context, args) { return new (ctor.bind.apply(ctor, [void 0].concat(args)))(); });
    };
    /**
     * @param {?} type
     * @param {?} fn
     * @return {?}
     */
    StaticReflector.prototype._registerFunction = function (type, fn) {
        this.conversionMap.set(type, function (context, args) { return fn.apply(undefined, args); });
    };
    /**
     * @return {?}
     */
    StaticReflector.prototype.initializeConversionMap = function () {
        this.injectionToken = this.findDeclaration(ANGULAR_CORE, 'InjectionToken');
        this.opaqueToken = this.findDeclaration(ANGULAR_CORE, 'OpaqueToken');
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Host'), Host);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Injectable'), Injectable);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Self'), Self);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'SkipSelf'), SkipSelf);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Inject'), Inject);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Optional'), Optional);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Attribute'), Attribute);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ContentChild'), ContentChild);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ContentChildren'), ContentChildren);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ViewChild'), ViewChild);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ViewChildren'), ViewChildren);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Input'), Input);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Output'), Output);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Pipe'), Pipe);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'HostBinding'), HostBinding);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'HostListener'), HostListener);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Directive'), Directive);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Component'), Component);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'NgModule'), NgModule);
        // Note: Some metadata classes can be used directly with Provider.deps.
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Host'), Host);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Self'), Self);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'SkipSelf'), SkipSelf);
        this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Optional'), Optional);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'trigger'), trigger);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'state'), state);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'transition'), transition);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'style'), style);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'animate'), animate);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'keyframes'), keyframes);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'sequence'), sequence);
        this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'group'), group);
    };
    /**
     * getStaticSymbol produces a Type whose metadata is known but whose implementation is not loaded.
     * All types passed to the StaticResolver should be pseudo-types returned by this method.
     *
     * @param {?} declarationFile the absolute path of the file where the symbol is declared
     * @param {?} name the name of the type.
     * @param {?=} members
     * @return {?}
     */
    StaticReflector.prototype.getStaticSymbol = function (declarationFile, name, members) {
        return this.symbolResolver.getStaticSymbol(declarationFile, name, members);
    };
    /**
     * @param {?} error
     * @param {?} context
     * @param {?=} path
     * @return {?}
     */
    StaticReflector.prototype.reportError = function (error, context, path) {
        if (this.errorRecorder) {
            this.errorRecorder(error, (context && context.filePath) || path);
        }
        else {
            throw error;
        }
    };
    /**
     * Simplify but discard any errors
     * @param {?} context
     * @param {?} value
     * @return {?}
     */
    StaticReflector.prototype.trySimplify = function (context, value) {
        var /** @type {?} */ originalRecorder = this.errorRecorder;
        this.errorRecorder = function (error, fileName) { };
        var /** @type {?} */ result = this.simplify(context, value);
        this.errorRecorder = originalRecorder;
        return result;
    };
    /**
     * \@internal
     * @param {?} context
     * @param {?} value
     * @return {?}
     */
    StaticReflector.prototype.simplify = function (context, value) {
        var _this = this;
        var /** @type {?} */ self = this;
        var /** @type {?} */ scope = BindingScope.empty;
        var /** @type {?} */ calling = new Map();
        /**
         * @param {?} context
         * @param {?} value
         * @param {?} depth
         * @return {?}
         */
        function simplifyInContext(context, value, depth) {
            /**
             * @param {?} staticSymbol
             * @return {?}
             */
            function resolveReferenceValue(staticSymbol) {
                var /** @type {?} */ resolvedSymbol = self.symbolResolver.resolveSymbol(staticSymbol);
                return resolvedSymbol ? resolvedSymbol.metadata : null;
            }
            /**
             * @param {?} functionSymbol
             * @param {?} targetFunction
             * @param {?} args
             * @return {?}
             */
            function simplifyCall(functionSymbol, targetFunction, args) {
                if (targetFunction && targetFunction['__symbolic'] == 'function') {
                    if (calling.get(functionSymbol)) {
                        throw new Error('Recursion not supported');
                    }
                    calling.set(functionSymbol, true);
                    try {
                        var /** @type {?} */ value_1 = targetFunction['value'];
                        if (value_1 && (depth != 0 || value_1.__symbolic != 'error')) {
                            var /** @type {?} */ parameters = targetFunction['parameters'];
                            var /** @type {?} */ defaults = targetFunction.defaults;
                            args = args.map(function (arg) { return simplifyInContext(context, arg, depth + 1); })
                                .map(function (arg) { return shouldIgnore(arg) ? undefined : arg; });
                            if (defaults && defaults.length > args.length) {
                                args.push.apply(args, defaults.slice(args.length).map(function (value) { return simplify(value); }));
                            }
                            var /** @type {?} */ functionScope = BindingScope.build();
                            for (var /** @type {?} */ i = 0; i < parameters.length; i++) {
                                functionScope.define(parameters[i], args[i]);
                            }
                            var /** @type {?} */ oldScope = scope;
                            var /** @type {?} */ result_1;
                            try {
                                scope = functionScope.done();
                                result_1 = simplifyInContext(functionSymbol, value_1, depth + 1);
                            }
                            finally {
                                scope = oldScope;
                            }
                            return result_1;
                        }
                    }
                    finally {
                        calling.delete(functionSymbol);
                    }
                }
                if (depth === 0) {
                    // If depth is 0 we are evaluating the top level expression that is describing element
                    // decorator. In this case, it is a decorator we don't understand, such as a custom
                    // non-angular decorator, and we should just ignore it.
                    return IGNORE;
                }
                return simplify({ __symbolic: 'error', message: 'Function call not supported', context: functionSymbol });
            }
            /**
             * @param {?} expression
             * @return {?}
             */
            function simplify(expression) {
                if (isPrimitive(expression)) {
                    return expression;
                }
                if (expression instanceof Array) {
                    var /** @type {?} */ result_2 = [];
                    for (var _i = 0, _a = ((expression)); _i < _a.length; _i++) {
                        var item = _a[_i];
                        // Check for a spread expression
                        if (item && item.__symbolic === 'spread') {
                            var /** @type {?} */ spreadArray = simplify(item.expression);
                            if (Array.isArray(spreadArray)) {
                                for (var _b = 0, spreadArray_1 = spreadArray; _b < spreadArray_1.length; _b++) {
                                    var spreadItem = spreadArray_1[_b];
                                    result_2.push(spreadItem);
                                }
                                continue;
                            }
                        }
                        var /** @type {?} */ value_2 = simplify(item);
                        if (shouldIgnore(value_2)) {
                            continue;
                        }
                        result_2.push(value_2);
                    }
                    return result_2;
                }
                if (expression instanceof StaticSymbol) {
                    // Stop simplification at builtin symbols
                    if (expression === self.injectionToken || expression === self.opaqueToken ||
                        self.conversionMap.has(expression)) {
                        return expression;
                    }
                    else {
                        var /** @type {?} */ staticSymbol = expression;
                        var /** @type {?} */ declarationValue = resolveReferenceValue(staticSymbol);
                        if (declarationValue) {
                            return simplifyInContext(staticSymbol, declarationValue, depth + 1);
                        }
                        else {
                            return staticSymbol;
                        }
                    }
                }
                if (expression) {
                    if (expression['__symbolic']) {
                        var /** @type {?} */ staticSymbol = void 0;
                        switch (expression['__symbolic']) {
                            case 'binop':
                                var /** @type {?} */ left = simplify(expression['left']);
                                if (shouldIgnore(left))
                                    return left;
                                var /** @type {?} */ right = simplify(expression['right']);
                                if (shouldIgnore(right))
                                    return right;
                                switch (expression['operator']) {
                                    case '&&':
                                        return left && right;
                                    case '||':
                                        return left || right;
                                    case '|':
                                        return left | right;
                                    case '^':
                                        return left ^ right;
                                    case '&':
                                        return left & right;
                                    case '==':
                                        return left == right;
                                    case '!=':
                                        return left != right;
                                    case '===':
                                        return left === right;
                                    case '!==':
                                        return left !== right;
                                    case '<':
                                        return left < right;
                                    case '>':
                                        return left > right;
                                    case '<=':
                                        return left <= right;
                                    case '>=':
                                        return left >= right;
                                    case '<<':
                                        return left << right;
                                    case '>>':
                                        return left >> right;
                                    case '+':
                                        return left + right;
                                    case '-':
                                        return left - right;
                                    case '*':
                                        return left * right;
                                    case '/':
                                        return left / right;
                                    case '%':
                                        return left % right;
                                }
                                return null;
                            case 'if':
                                var /** @type {?} */ condition = simplify(expression['condition']);
                                return condition ? simplify(expression['thenExpression']) :
                                    simplify(expression['elseExpression']);
                            case 'pre':
                                var /** @type {?} */ operand = simplify(expression['operand']);
                                if (shouldIgnore(operand))
                                    return operand;
                                switch (expression['operator']) {
                                    case '+':
                                        return operand;
                                    case '-':
                                        return -operand;
                                    case '!':
                                        return !operand;
                                    case '~':
                                        return ~operand;
                                }
                                return null;
                            case 'index':
                                var /** @type {?} */ indexTarget = simplify(expression['expression']);
                                var /** @type {?} */ index = simplify(expression['index']);
                                if (indexTarget && isPrimitive(index))
                                    return indexTarget[index];
                                return null;
                            case 'select':
                                var /** @type {?} */ member = expression['member'];
                                var /** @type {?} */ selectContext = context;
                                var /** @type {?} */ selectTarget = simplify(expression['expression']);
                                if (selectTarget instanceof StaticSymbol) {
                                    var /** @type {?} */ members = selectTarget.members.concat(member);
                                    selectContext =
                                        self.getStaticSymbol(selectTarget.filePath, selectTarget.name, members);
                                    var /** @type {?} */ declarationValue = resolveReferenceValue(selectContext);
                                    if (declarationValue) {
                                        return simplifyInContext(selectContext, declarationValue, depth + 1);
                                    }
                                    else {
                                        return selectContext;
                                    }
                                }
                                if (selectTarget && isPrimitive(member))
                                    return simplifyInContext(selectContext, selectTarget[member], depth + 1);
                                return null;
                            case 'reference':
                                // Note: This only has to deal with variable references,
                                // as symbol references have been converted into StaticSymbols already
                                // in the StaticSymbolResolver!
                                var /** @type {?} */ name = expression['name'];
                                var /** @type {?} */ localValue = scope.resolve(name);
                                if (localValue != BindingScope.missing) {
                                    return localValue;
                                }
                                break;
                            case 'class':
                                return context;
                            case 'function':
                                return context;
                            case 'new':
                            case 'call':
                                // Determine if the function is a built-in conversion
                                staticSymbol = simplifyInContext(context, expression['expression'], depth + 1);
                                if (staticSymbol instanceof StaticSymbol) {
                                    if (staticSymbol === self.injectionToken || staticSymbol === self.opaqueToken) {
                                        // if somebody calls new InjectionToken, don't create an InjectionToken,
                                        // but rather return the symbol to which the InjectionToken is assigned to.
                                        return context;
                                    }
                                    var /** @type {?} */ argExpressions = expression['arguments'] || [];
                                    var /** @type {?} */ converter = self.conversionMap.get(staticSymbol);
                                    if (converter) {
                                        var /** @type {?} */ args = argExpressions.map(function (arg) { return simplifyInContext(context, arg, depth + 1); })
                                            .map(function (arg) { return shouldIgnore(arg) ? undefined : arg; });
                                        return converter(context, args);
                                    }
                                    else {
                                        // Determine if the function is one we can simplify.
                                        var /** @type {?} */ targetFunction = resolveReferenceValue(staticSymbol);
                                        return simplifyCall(staticSymbol, targetFunction, argExpressions);
                                    }
                                }
                                return IGNORE;
                            case 'error':
                                var /** @type {?} */ message = produceErrorMessage(expression);
                                if (expression['line']) {
                                    message =
                                        message + " (position " + (expression['line'] + 1) + ":" + (expression['character'] + 1) + " in the original .ts file)";
                                    self.reportError(positionalError(message, context.filePath, expression['line'], expression['character']), context);
                                }
                                else {
                                    self.reportError(new Error(message), context);
                                }
                                return IGNORE;
                            case 'ignore':
                                return expression;
                        }
                        return null;
                    }
                    return mapStringMap(expression, function (value, name) { return simplify(value); });
                }
                return IGNORE;
            }
            try {
                return simplify(value);
            }
            catch (e) {
                var /** @type {?} */ members = context.members.length ? "." + context.members.join('.') : '';
                var /** @type {?} */ message = e.message + ", resolving symbol " + context.name + members + " in " + context.filePath;
                if (e.fileName) {
                    throw positionalError(message, e.fileName, e.line, e.column);
                }
                throw syntaxError(message);
            }
        }
        var /** @type {?} */ recordedSimplifyInContext = function (context, value, depth) {
            try {
                return simplifyInContext(context, value, depth);
            }
            catch (e) {
                _this.reportError(e, context);
            }
        };
        var /** @type {?} */ result = this.errorRecorder ? recordedSimplifyInContext(context, value, 0) :
            simplifyInContext(context, value, 0);
        if (shouldIgnore(result)) {
            return undefined;
        }
        return result;
    };
    /**
     * @param {?} type
     * @return {?}
     */
    StaticReflector.prototype.getTypeMetadata = function (type) {
        var /** @type {?} */ resolvedSymbol = this.symbolResolver.resolveSymbol(type);
        return resolvedSymbol && resolvedSymbol.metadata ? resolvedSymbol.metadata :
            { __symbolic: 'class' };
    };
    return StaticReflector;
}());
/**
 * @param {?} error
 * @return {?}
 */
function expandedMessage(error) {
    switch (error.message) {
        case 'Reference to non-exported class':
            if (error.context && error.context.className) {
                return "Reference to a non-exported class " + error.context.className + ". Consider exporting the class";
            }
            break;
        case 'Variable not initialized':
            return 'Only initialized variables and constants can be referenced because the value of this variable is needed by the template compiler';
        case 'Destructuring not supported':
            return 'Referencing an exported destructured variable or constant is not supported by the template compiler. Consider simplifying this to avoid destructuring';
        case 'Could not resolve type':
            if (error.context && error.context.typeName) {
                return "Could not resolve type " + error.context.typeName;
            }
            break;
        case 'Function call not supported':
            var /** @type {?} */ prefix = error.context && error.context.name ? "Calling function '" + error.context.name + "', f" : 'F';
            return prefix +
                'unction calls are not supported. Consider replacing the function or lambda with a reference to an exported function';
        case 'Reference to a local symbol':
            if (error.context && error.context.name) {
                return "Reference to a local (non-exported) symbol '" + error.context.name + "'. Consider exporting the symbol";
            }
            break;
    }
    return error.message;
}
/**
 * @param {?} error
 * @return {?}
 */
function produceErrorMessage(error) {
    return "Error encountered resolving symbol values statically. " + expandedMessage(error);
}
/**
 * @param {?} input
 * @param {?} transform
 * @return {?}
 */
function mapStringMap(input, transform) {
    if (!input)
        return {};
    var /** @type {?} */ result = {};
    Object.keys(input).forEach(function (key) {
        var /** @type {?} */ value = transform(input[key], key);
        if (!shouldIgnore(value)) {
            if (HIDDEN_KEY.test(key)) {
                Object.defineProperty(result, key, { enumerable: false, configurable: true, value: value });
            }
            else {
                result[key] = value;
            }
        }
    });
    return result;
}
/**
 * @param {?} o
 * @return {?}
 */
function isPrimitive(o) {
    return o === null || (typeof o !== 'function' && typeof o !== 'object');
}
/**
 * @abstract
 */
var BindingScope = (function () {
    function BindingScope() {
    }
    /**
     * @abstract
     * @param {?} name
     * @return {?}
     */
    BindingScope.prototype.resolve = function (name) { };
    /**
     * @return {?}
     */
    BindingScope.build = function () {
        var /** @type {?} */ current = new Map();
        return {
            define: function (name, value) {
                current.set(name, value);
                return this;
            },
            done: function () {
                return current.size > 0 ? new PopulatedScope(current) : BindingScope.empty;
            }
        };
    };
    return BindingScope;
}());
BindingScope.missing = {};
BindingScope.empty = { resolve: function (name) { return BindingScope.missing; } };
var PopulatedScope = (function (_super) {
    __extends(PopulatedScope, _super);
    /**
     * @param {?} bindings
     */
    function PopulatedScope(bindings) {
        var _this = _super.call(this) || this;
        _this.bindings = bindings;
        return _this;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    PopulatedScope.prototype.resolve = function (name) {
        return this.bindings.has(name) ? this.bindings.get(name) : BindingScope.missing;
    };
    return PopulatedScope;
}(BindingScope));
/**
 * @param {?} message
 * @param {?} fileName
 * @param {?} line
 * @param {?} column
 * @return {?}
 */
function positionalError(message, fileName, line, column) {
    var /** @type {?} */ result = new Error(message);
    ((result)).fileName = fileName;
    ((result)).line = line;
    ((result)).column = column;
    return result;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var ResolvedStaticSymbol = (function () {
    /**
     * @param {?} symbol
     * @param {?} metadata
     */
    function ResolvedStaticSymbol(symbol, metadata) {
        this.symbol = symbol;
        this.metadata = metadata;
    }
    return ResolvedStaticSymbol;
}());
var SUPPORTED_SCHEMA_VERSION = 3;
/**
 * This class is responsible for loading metadata per symbol,
 * and normalizing references between symbols.
 *
 * Internally, it only uses symbols without members,
 * and deduces the values for symbols with members based
 * on these symbols.
 */
var StaticSymbolResolver = (function () {
    /**
     * @param {?} host
     * @param {?} staticSymbolCache
     * @param {?} summaryResolver
     * @param {?=} errorRecorder
     */
    function StaticSymbolResolver(host, staticSymbolCache, summaryResolver, errorRecorder) {
        this.host = host;
        this.staticSymbolCache = staticSymbolCache;
        this.summaryResolver = summaryResolver;
        this.errorRecorder = errorRecorder;
        this.metadataCache = new Map();
        this.resolvedSymbols = new Map();
        this.resolvedFilePaths = new Set();
        this.importAs = new Map();
        this.symbolResourcePaths = new Map();
        this.symbolFromFile = new Map();
    }
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    StaticSymbolResolver.prototype.resolveSymbol = function (staticSymbol) {
        if (staticSymbol.members.length > 0) {
            return ((this._resolveSymbolMembers(staticSymbol)));
        }
        var /** @type {?} */ result = this.resolvedSymbols.get(staticSymbol);
        if (result) {
            return result;
        }
        result = ((this._resolveSymbolFromSummary(staticSymbol)));
        if (result) {
            return result;
        }
        // Note: Some users use libraries that were not compiled with ngc, i.e. they don't
        // have summaries, only .d.ts files. So we always need to check both, the summary
        // and metadata.
        this._createSymbolsOf(staticSymbol.filePath);
        result = ((this.resolvedSymbols.get(staticSymbol)));
        return result;
    };
    /**
     * getImportAs produces a symbol that can be used to import the given symbol.
     * The import might be different than the symbol if the symbol is exported from
     * a library with a summary; in which case we want to import the symbol from the
     * ngfactory re-export instead of directly to avoid introducing a direct dependency
     * on an otherwise indirect dependency.
     *
     * @param {?} staticSymbol the symbol for which to generate a import symbol
     * @return {?}
     */
    StaticSymbolResolver.prototype.getImportAs = function (staticSymbol) {
        if (staticSymbol.members.length) {
            var /** @type {?} */ baseSymbol = this.getStaticSymbol(staticSymbol.filePath, staticSymbol.name);
            var /** @type {?} */ baseImportAs = this.getImportAs(baseSymbol);
            return baseImportAs ?
                this.getStaticSymbol(baseImportAs.filePath, baseImportAs.name, staticSymbol.members) :
                null;
        }
        var /** @type {?} */ result = this.summaryResolver.getImportAs(staticSymbol);
        if (!result) {
            result = ((this.importAs.get(staticSymbol)));
        }
        return result;
    };
    /**
     * getResourcePath produces the path to the original location of the symbol and should
     * be used to determine the relative location of resource references recorded in
     * symbol metadata.
     * @param {?} staticSymbol
     * @return {?}
     */
    StaticSymbolResolver.prototype.getResourcePath = function (staticSymbol) {
        return this.symbolResourcePaths.get(staticSymbol) || staticSymbol.filePath;
    };
    /**
     * getTypeArity returns the number of generic type parameters the given symbol
     * has. If the symbol is not a type the result is null.
     * @param {?} staticSymbol
     * @return {?}
     */
    StaticSymbolResolver.prototype.getTypeArity = function (staticSymbol) {
        // If the file is a factory file, don't resolve the symbol as doing so would
        // cause the metadata for an factory file to be loaded which doesn't exist.
        // All references to generated classes must include the correct arity whenever
        // generating code.
        if (isNgFactoryFile(staticSymbol.filePath)) {
            return null;
        }
        var /** @type {?} */ resolvedSymbol = this.resolveSymbol(staticSymbol);
        while (resolvedSymbol && resolvedSymbol.metadata instanceof StaticSymbol) {
            resolvedSymbol = this.resolveSymbol(resolvedSymbol.metadata);
        }
        return (resolvedSymbol && resolvedSymbol.metadata && resolvedSymbol.metadata.arity) || null;
    };
    /**
     * @param {?} sourceSymbol
     * @param {?} targetSymbol
     * @return {?}
     */
    StaticSymbolResolver.prototype.recordImportAs = function (sourceSymbol, targetSymbol) {
        sourceSymbol.assertNoMembers();
        targetSymbol.assertNoMembers();
        this.importAs.set(sourceSymbol, targetSymbol);
    };
    /**
     * Invalidate all information derived from the given file.
     *
     * @param {?} fileName the file to invalidate
     * @return {?}
     */
    StaticSymbolResolver.prototype.invalidateFile = function (fileName) {
        this.metadataCache.delete(fileName);
        this.resolvedFilePaths.delete(fileName);
        var /** @type {?} */ symbols = this.symbolFromFile.get(fileName);
        if (symbols) {
            this.symbolFromFile.delete(fileName);
            for (var _i = 0, symbols_1 = symbols; _i < symbols_1.length; _i++) {
                var symbol = symbols_1[_i];
                this.resolvedSymbols.delete(symbol);
                this.importAs.delete(symbol);
                this.symbolResourcePaths.delete(symbol);
            }
        }
    };
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    StaticSymbolResolver.prototype._resolveSymbolMembers = function (staticSymbol) {
        var /** @type {?} */ members = staticSymbol.members;
        var /** @type {?} */ baseResolvedSymbol = this.resolveSymbol(this.getStaticSymbol(staticSymbol.filePath, staticSymbol.name));
        if (!baseResolvedSymbol) {
            return null;
        }
        var /** @type {?} */ baseMetadata = baseResolvedSymbol.metadata;
        if (baseMetadata instanceof StaticSymbol) {
            return new ResolvedStaticSymbol(staticSymbol, this.getStaticSymbol(baseMetadata.filePath, baseMetadata.name, members));
        }
        else if (baseMetadata && baseMetadata.__symbolic === 'class') {
            if (baseMetadata.statics && members.length === 1) {
                return new ResolvedStaticSymbol(staticSymbol, baseMetadata.statics[members[0]]);
            }
        }
        else {
            var /** @type {?} */ value = baseMetadata;
            for (var /** @type {?} */ i = 0; i < members.length && value; i++) {
                value = value[members[i]];
            }
            return new ResolvedStaticSymbol(staticSymbol, value);
        }
        return null;
    };
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    StaticSymbolResolver.prototype._resolveSymbolFromSummary = function (staticSymbol) {
        var /** @type {?} */ summary = this.summaryResolver.resolveSummary(staticSymbol);
        return summary ? new ResolvedStaticSymbol(staticSymbol, summary.metadata) : null;
    };
    /**
     * getStaticSymbol produces a Type whose metadata is known but whose implementation is not loaded.
     * All types passed to the StaticResolver should be pseudo-types returned by this method.
     *
     * @param {?} declarationFile the absolute path of the file where the symbol is declared
     * @param {?} name the name of the type.
     * @param {?=} members a symbol for a static member of the named type
     * @return {?}
     */
    StaticSymbolResolver.prototype.getStaticSymbol = function (declarationFile, name, members) {
        return this.staticSymbolCache.get(declarationFile, name, members);
    };
    /**
     * @param {?} filePath
     * @return {?}
     */
    StaticSymbolResolver.prototype.getSymbolsOf = function (filePath) {
        // Note: Some users use libraries that were not compiled with ngc, i.e. they don't
        // have summaries, only .d.ts files. So we always need to check both, the summary
        // and metadata.
        var /** @type {?} */ symbols = new Set(this.summaryResolver.getSymbolsOf(filePath));
        this._createSymbolsOf(filePath);
        this.resolvedSymbols.forEach(function (resolvedSymbol) {
            if (resolvedSymbol.symbol.filePath === filePath) {
                symbols.add(resolvedSymbol.symbol);
            }
        });
        return Array.from(symbols);
    };
    /**
     * @param {?} filePath
     * @return {?}
     */
    StaticSymbolResolver.prototype._createSymbolsOf = function (filePath) {
        var _this = this;
        if (this.resolvedFilePaths.has(filePath)) {
            return;
        }
        this.resolvedFilePaths.add(filePath);
        var /** @type {?} */ resolvedSymbols = [];
        var /** @type {?} */ metadata = this.getModuleMetadata(filePath);
        if (metadata['metadata']) {
            // handle direct declarations of the symbol
            var /** @type {?} */ topLevelSymbolNames_1 = new Set(Object.keys(metadata['metadata']).map(unescapeIdentifier));
            var /** @type {?} */ origins_1 = metadata['origins'] || {};
            Object.keys(metadata['metadata']).forEach(function (metadataKey) {
                var /** @type {?} */ symbolMeta = metadata['metadata'][metadataKey];
                var /** @type {?} */ name = unescapeIdentifier(metadataKey);
                var /** @type {?} */ symbol = _this.getStaticSymbol(filePath, name);
                var /** @type {?} */ importSymbol = undefined;
                if (metadata['importAs']) {
                    // Index bundle indexes should use the importAs module name instead of a reference
                    // to the .d.ts file directly.
                    importSymbol = _this.getStaticSymbol(metadata['importAs'], name);
                    _this.recordImportAs(symbol, importSymbol);
                }
                var /** @type {?} */ origin = origins_1.hasOwnProperty(metadataKey) && origins_1[metadataKey];
                if (origin) {
                    // If the symbol is from a bundled index, use the declaration location of the
                    // symbol so relative references (such as './my.html') will be calculated
                    // correctly.
                    var /** @type {?} */ originFilePath = _this.resolveModule(origin, filePath);
                    if (!originFilePath) {
                        _this.reportError(new Error("Couldn't resolve original symbol for " + origin + " from " + filePath));
                    }
                    else {
                        _this.symbolResourcePaths.set(symbol, originFilePath);
                    }
                }
                resolvedSymbols.push(_this.createResolvedSymbol(symbol, filePath, topLevelSymbolNames_1, symbolMeta));
            });
        }
        // handle the symbols in one of the re-export location
        if (metadata['exports']) {
            var _loop_1 = function (moduleExport) {
                // handle the symbols in the list of explicitly re-exported symbols.
                if (moduleExport.export) {
                    moduleExport.export.forEach(function (exportSymbol) {
                        var /** @type {?} */ symbolName;
                        if (typeof exportSymbol === 'string') {
                            symbolName = exportSymbol;
                        }
                        else {
                            symbolName = exportSymbol.as;
                        }
                        symbolName = unescapeIdentifier(symbolName);
                        var /** @type {?} */ symName = symbolName;
                        if (typeof exportSymbol !== 'string') {
                            symName = unescapeIdentifier(exportSymbol.name);
                        }
                        var /** @type {?} */ resolvedModule = _this.resolveModule(moduleExport.from, filePath);
                        if (resolvedModule) {
                            var /** @type {?} */ targetSymbol = _this.getStaticSymbol(resolvedModule, symName);
                            var /** @type {?} */ sourceSymbol = _this.getStaticSymbol(filePath, symbolName);
                            resolvedSymbols.push(_this.createExport(sourceSymbol, targetSymbol));
                        }
                    });
                }
                else {
                    // handle the symbols via export * directives.
                    var /** @type {?} */ resolvedModule = this_1.resolveModule(moduleExport.from, filePath);
                    if (resolvedModule) {
                        var /** @type {?} */ nestedExports = this_1.getSymbolsOf(resolvedModule);
                        nestedExports.forEach(function (targetSymbol) {
                            var /** @type {?} */ sourceSymbol = _this.getStaticSymbol(filePath, targetSymbol.name);
                            resolvedSymbols.push(_this.createExport(sourceSymbol, targetSymbol));
                        });
                    }
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = metadata['exports']; _i < _a.length; _i++) {
                var moduleExport = _a[_i];
                _loop_1(/** @type {?} */ moduleExport);
            }
        }
        resolvedSymbols.forEach(function (resolvedSymbol) { return _this.resolvedSymbols.set(resolvedSymbol.symbol, resolvedSymbol); });
        this.symbolFromFile.set(filePath, resolvedSymbols.map(function (resolvedSymbol) { return resolvedSymbol.symbol; }));
    };
    /**
     * @param {?} sourceSymbol
     * @param {?} topLevelPath
     * @param {?} topLevelSymbolNames
     * @param {?} metadata
     * @return {?}
     */
    StaticSymbolResolver.prototype.createResolvedSymbol = function (sourceSymbol, topLevelPath, topLevelSymbolNames, metadata) {
        // For classes that don't have Angular summaries / metadata,
        // we only keep their arity, but nothing else
        // (e.g. their constructor parameters).
        // We do this to prevent introducing deep imports
        // as we didn't generate .ngfactory.ts files with proper reexports.
        if (this.summaryResolver.isLibraryFile(sourceSymbol.filePath) && metadata &&
            metadata['__symbolic'] === 'class') {
            var /** @type {?} */ transformedMeta_1 = { __symbolic: 'class', arity: metadata.arity };
            return new ResolvedStaticSymbol(sourceSymbol, transformedMeta_1);
        }
        var /** @type {?} */ self = this;
        var ReferenceTransformer = (function (_super) {
            __extends(ReferenceTransformer, _super);
            function ReferenceTransformer() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            /**
             * @param {?} map
             * @param {?} functionParams
             * @return {?}
             */
            ReferenceTransformer.prototype.visitStringMap = function (map, functionParams) {
                var /** @type {?} */ symbolic = map['__symbolic'];
                if (symbolic === 'function') {
                    var /** @type {?} */ oldLen = functionParams.length;
                    functionParams.push.apply(functionParams, (map['parameters'] || []));
                    var /** @type {?} */ result = _super.prototype.visitStringMap.call(this, map, functionParams);
                    functionParams.length = oldLen;
                    return result;
                }
                else if (symbolic === 'reference') {
                    var /** @type {?} */ module_1 = map['module'];
                    var /** @type {?} */ name = map['name'] ? unescapeIdentifier(map['name']) : map['name'];
                    if (!name) {
                        return null;
                    }
                    var /** @type {?} */ filePath = void 0;
                    if (module_1) {
                        filePath = ((self.resolveModule(module_1, sourceSymbol.filePath)));
                        if (!filePath) {
                            return {
                                __symbolic: 'error',
                                message: "Could not resolve " + module_1 + " relative to " + sourceSymbol.filePath + "."
                            };
                        }
                        return self.getStaticSymbol(filePath, name);
                    }
                    else if (functionParams.indexOf(name) >= 0) {
                        // reference to a function parameter
                        return { __symbolic: 'reference', name: name };
                    }
                    else {
                        if (topLevelSymbolNames.has(name)) {
                            return self.getStaticSymbol(topLevelPath, name);
                        }
                        // ambient value
                        null;
                    }
                }
                else {
                    return _super.prototype.visitStringMap.call(this, map, functionParams);
                }
            };
            return ReferenceTransformer;
        }(ValueTransformer));
        var /** @type {?} */ transformedMeta = visitValue(metadata, new ReferenceTransformer(), []);
        if (transformedMeta instanceof StaticSymbol) {
            return this.createExport(sourceSymbol, transformedMeta);
        }
        return new ResolvedStaticSymbol(sourceSymbol, transformedMeta);
    };
    /**
     * @param {?} sourceSymbol
     * @param {?} targetSymbol
     * @return {?}
     */
    StaticSymbolResolver.prototype.createExport = function (sourceSymbol, targetSymbol) {
        sourceSymbol.assertNoMembers();
        targetSymbol.assertNoMembers();
        if (this.summaryResolver.isLibraryFile(sourceSymbol.filePath)) {
            // This case is for an ng library importing symbols from a plain ts library
            // transitively.
            // Note: We rely on the fact that we discover symbols in the direction
            // from source files to library files
            this.importAs.set(targetSymbol, this.getImportAs(sourceSymbol) || sourceSymbol);
        }
        return new ResolvedStaticSymbol(sourceSymbol, targetSymbol);
    };
    /**
     * @param {?} error
     * @param {?=} context
     * @param {?=} path
     * @return {?}
     */
    StaticSymbolResolver.prototype.reportError = function (error, context, path) {
        if (this.errorRecorder) {
            this.errorRecorder(error, (context && context.filePath) || path);
        }
        else {
            throw error;
        }
    };
    /**
     * @param {?} module an absolute path to a module file.
     * @return {?}
     */
    StaticSymbolResolver.prototype.getModuleMetadata = function (module) {
        var /** @type {?} */ moduleMetadata = this.metadataCache.get(module);
        if (!moduleMetadata) {
            var /** @type {?} */ moduleMetadatas = this.host.getMetadataFor(module);
            if (moduleMetadatas) {
                var /** @type {?} */ maxVersion_1 = -1;
                moduleMetadatas.forEach(function (md) {
                    if (md['version'] > maxVersion_1) {
                        maxVersion_1 = md['version'];
                        moduleMetadata = md;
                    }
                });
            }
            if (!moduleMetadata) {
                moduleMetadata =
                    { __symbolic: 'module', version: SUPPORTED_SCHEMA_VERSION, module: module, metadata: {} };
            }
            if (moduleMetadata['version'] != SUPPORTED_SCHEMA_VERSION) {
                var /** @type {?} */ errorMessage = moduleMetadata['version'] == 2 ?
                    "Unsupported metadata version " + moduleMetadata['version'] + " for module " + module + ". This module should be compiled with a newer version of ngc" :
                    "Metadata version mismatch for module " + module + ", found version " + moduleMetadata['version'] + ", expected " + SUPPORTED_SCHEMA_VERSION;
                this.reportError(new Error(errorMessage));
            }
            this.metadataCache.set(module, moduleMetadata);
        }
        return moduleMetadata;
    };
    /**
     * @param {?} module
     * @param {?} symbolName
     * @param {?=} containingFile
     * @return {?}
     */
    StaticSymbolResolver.prototype.getSymbolByModule = function (module, symbolName, containingFile) {
        var /** @type {?} */ filePath = this.resolveModule(module, containingFile);
        if (!filePath) {
            this.reportError(new Error("Could not resolve module " + module + (containingFile ? " relative to $ {\n            containingFile\n          } " : '')));
            return this.getStaticSymbol("ERROR:" + module, symbolName);
        }
        return this.getStaticSymbol(filePath, symbolName);
    };
    /**
     * @param {?} module
     * @param {?=} containingFile
     * @return {?}
     */
    StaticSymbolResolver.prototype.resolveModule = function (module, containingFile) {
        try {
            return this.host.moduleNameToFileName(module, containingFile);
        }
        catch (e) {
            console.error("Could not resolve module '" + module + "' relative to file " + containingFile);
            this.reportError(e, undefined, containingFile);
        }
        return null;
    };
    return StaticSymbolResolver;
}());
/**
 * @param {?} identifier
 * @return {?}
 */
function unescapeIdentifier(identifier) {
    return identifier.startsWith('___') ? identifier.substr(1) : identifier;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var AotSummaryResolver = (function () {
    /**
     * @param {?} host
     * @param {?} staticSymbolCache
     */
    function AotSummaryResolver(host, staticSymbolCache) {
        this.host = host;
        this.staticSymbolCache = staticSymbolCache;
        this.summaryCache = new Map();
        this.loadedFilePaths = new Set();
        this.importAs = new Map();
    }
    /**
     * @param {?} filePath
     * @return {?}
     */
    AotSummaryResolver.prototype.isLibraryFile = function (filePath) {
        // Note: We need to strip the .ngfactory. file path,
        // so this method also works for generated files
        // (for which host.isSourceFile will always return false).
        return !this.host.isSourceFile(stripNgFactory(filePath));
    };
    /**
     * @param {?} filePath
     * @return {?}
     */
    AotSummaryResolver.prototype.getLibraryFileName = function (filePath) { return this.host.getOutputFileName(filePath); };
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    AotSummaryResolver.prototype.resolveSummary = function (staticSymbol) {
        staticSymbol.assertNoMembers();
        var /** @type {?} */ summary = this.summaryCache.get(staticSymbol);
        if (!summary) {
            this._loadSummaryFile(staticSymbol.filePath);
            summary = ((this.summaryCache.get(staticSymbol)));
        }
        return summary;
    };
    /**
     * @param {?} filePath
     * @return {?}
     */
    AotSummaryResolver.prototype.getSymbolsOf = function (filePath) {
        this._loadSummaryFile(filePath);
        return Array.from(this.summaryCache.keys()).filter(function (symbol) { return symbol.filePath === filePath; });
    };
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    AotSummaryResolver.prototype.getImportAs = function (staticSymbol) {
        staticSymbol.assertNoMembers();
        return ((this.importAs.get(staticSymbol)));
    };
    /**
     * @param {?} filePath
     * @return {?}
     */
    AotSummaryResolver.prototype._loadSummaryFile = function (filePath) {
        var _this = this;
        if (this.loadedFilePaths.has(filePath)) {
            return;
        }
        this.loadedFilePaths.add(filePath);
        if (this.isLibraryFile(filePath)) {
            var /** @type {?} */ summaryFilePath = summaryFileName(filePath);
            var /** @type {?} */ json = void 0;
            try {
                json = this.host.loadSummary(summaryFilePath);
            }
            catch (e) {
                console.error("Error loading summary file " + summaryFilePath);
                throw e;
            }
            if (json) {
                var _a = deserializeSummaries(this.staticSymbolCache, json), summaries = _a.summaries, importAs = _a.importAs;
                summaries.forEach(function (summary) { return _this.summaryCache.set(summary.symbol, summary); });
                importAs.forEach(function (importAs) {
                    _this.importAs.set(importAs.symbol, _this.staticSymbolCache.get(ngfactoryFilePath(filePath), importAs.importAs));
                });
            }
        }
    };
    return AotSummaryResolver;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Creates a new AotCompiler based on options and a host.
 * @param {?} compilerHost
 * @param {?} options
 * @return {?}
 */
function createAotCompiler(compilerHost, options) {
    var /** @type {?} */ translations = options.translations || '';
    var /** @type {?} */ urlResolver = createOfflineCompileUrlResolver();
    var /** @type {?} */ symbolCache = new StaticSymbolCache();
    var /** @type {?} */ summaryResolver = new AotSummaryResolver(compilerHost, symbolCache);
    var /** @type {?} */ symbolResolver = new StaticSymbolResolver(compilerHost, symbolCache, summaryResolver);
    var /** @type {?} */ staticReflector = new StaticReflector(summaryResolver, symbolResolver);
    StaticAndDynamicReflectionCapabilities.install(staticReflector);
    var /** @type {?} */ console = new ɵConsole();
    var /** @type {?} */ htmlParser = new I18NHtmlParser(new HtmlParser(), translations, options.i18nFormat, MissingTranslationStrategy.Warning, console);
    var /** @type {?} */ config = new CompilerConfig({
        defaultEncapsulation: ViewEncapsulation.Emulated,
        useJit: false,
        enableLegacyTemplate: options.enableLegacyTemplate !== false,
    });
    var /** @type {?} */ normalizer = new DirectiveNormalizer({ get: function (url) { return compilerHost.loadResource(url); } }, urlResolver, htmlParser, config);
    var /** @type {?} */ expressionParser = new Parser(new Lexer());
    var /** @type {?} */ elementSchemaRegistry = new DomElementSchemaRegistry();
    var /** @type {?} */ tmplParser = new TemplateParser(config, expressionParser, elementSchemaRegistry, htmlParser, console, []);
    var /** @type {?} */ resolver = new CompileMetadataResolver(config, new NgModuleResolver(staticReflector), new DirectiveResolver(staticReflector), new PipeResolver(staticReflector), summaryResolver, elementSchemaRegistry, normalizer, console, symbolCache, staticReflector);
    // TODO(vicb): do not pass options.i18nFormat here
    var /** @type {?} */ importResolver = {
        getImportAs: function (symbol) { return ((symbolResolver.getImportAs(symbol))); },
        fileNameToModuleName: function (fileName, containingFilePath) { return compilerHost.fileNameToModuleName(fileName, containingFilePath); },
        getTypeArity: function (symbol) { return ((symbolResolver.getTypeArity(symbol))); }
    };
    var /** @type {?} */ viewCompiler = new ViewCompiler(config, elementSchemaRegistry);
    var /** @type {?} */ compiler = new AotCompiler(config, compilerHost, resolver, tmplParser, new StyleCompiler(urlResolver), viewCompiler, new NgModuleCompiler(), new TypeScriptEmitter(importResolver), summaryResolver, options.locale || null, options.i18nFormat || null, options.genFilePreamble || null, symbolResolver);
    return { compiler: compiler, reflector: staticReflector };
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @param {?} statements
 * @param {?} resultVars
 * @return {?}
 */
function interpretStatements(statements, resultVars) {
    var /** @type {?} */ stmtsWithReturn = statements.concat([new ReturnStatement(literalArr(resultVars.map(function (resultVar) { return variable(resultVar); })))]);
    var /** @type {?} */ ctx = new _ExecutionContext(null, null, null, new Map());
    var /** @type {?} */ visitor = new StatementInterpreter();
    var /** @type {?} */ result = visitor.visitAllStatements(stmtsWithReturn, ctx);
    return result != null ? result.value : null;
}
/**
 * @param {?} varNames
 * @param {?} varValues
 * @param {?} statements
 * @param {?} ctx
 * @param {?} visitor
 * @return {?}
 */
function _executeFunctionStatements(varNames, varValues, statements, ctx, visitor) {
    var /** @type {?} */ childCtx = ctx.createChildWihtLocalVars();
    for (var /** @type {?} */ i = 0; i < varNames.length; i++) {
        childCtx.vars.set(varNames[i], varValues[i]);
    }
    var /** @type {?} */ result = visitor.visitAllStatements(statements, childCtx);
    return result ? result.value : null;
}
var _ExecutionContext = (function () {
    /**
     * @param {?} parent
     * @param {?} instance
     * @param {?} className
     * @param {?} vars
     */
    function _ExecutionContext(parent, instance, className, vars) {
        this.parent = parent;
        this.instance = instance;
        this.className = className;
        this.vars = vars;
    }
    /**
     * @return {?}
     */
    _ExecutionContext.prototype.createChildWihtLocalVars = function () {
        return new _ExecutionContext(this, this.instance, this.className, new Map());
    };
    return _ExecutionContext;
}());
var ReturnValue = (function () {
    /**
     * @param {?} value
     */
    function ReturnValue(value) {
        this.value = value;
    }
    return ReturnValue;
}());
/**
 * @param {?} _classStmt
 * @param {?} _ctx
 * @param {?} _visitor
 * @return {?}
 */
function createDynamicClass(_classStmt, _ctx, _visitor) {
    var /** @type {?} */ propertyDescriptors = {};
    _classStmt.getters.forEach(function (getter) {
        // Note: use `function` instead of arrow function to capture `this`
        propertyDescriptors[getter.name] = {
            configurable: false,
            get: function () {
                var /** @type {?} */ instanceCtx = new _ExecutionContext(_ctx, this, _classStmt.name, _ctx.vars);
                return _executeFunctionStatements([], [], getter.body, instanceCtx, _visitor);
            }
        };
    });
    _classStmt.methods.forEach(function (method) {
        var /** @type {?} */ paramNames = method.params.map(function (param) { return param.name; });
        // Note: use `function` instead of arrow function to capture `this`
        propertyDescriptors[((method.name))] = {
            writable: false,
            configurable: false,
            value: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var /** @type {?} */ instanceCtx = new _ExecutionContext(_ctx, this, _classStmt.name, _ctx.vars);
                return _executeFunctionStatements(paramNames, args, method.body, instanceCtx, _visitor);
            }
        };
    });
    var /** @type {?} */ ctorParamNames = _classStmt.constructorMethod.params.map(function (param) { return param.name; });
    // Note: use `function` instead of arrow function to capture `this`
    var /** @type {?} */ ctor = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var /** @type {?} */ instanceCtx = new _ExecutionContext(_ctx, this, _classStmt.name, _ctx.vars);
        _classStmt.fields.forEach(function (field) { _this[field.name] = undefined; });
        _executeFunctionStatements(ctorParamNames, args, _classStmt.constructorMethod.body, instanceCtx, _visitor);
    };
    var /** @type {?} */ superClass = _classStmt.parent ? _classStmt.parent.visitExpression(_visitor, _ctx) : Object;
    ctor.prototype = Object.create(superClass.prototype, propertyDescriptors);
    return ctor;
}
var StatementInterpreter = (function () {
    function StatementInterpreter() {
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    StatementInterpreter.prototype.debugAst = function (ast) { return debugOutputAstAsTypeScript(ast); };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitDeclareVarStmt = function (stmt, ctx) {
        ctx.vars.set(stmt.name, stmt.value.visitExpression(this, ctx));
        return null;
    };
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitWriteVarExpr = function (expr, ctx) {
        var /** @type {?} */ value = expr.value.visitExpression(this, ctx);
        var /** @type {?} */ currCtx = ctx;
        while (currCtx != null) {
            if (currCtx.vars.has(expr.name)) {
                currCtx.vars.set(expr.name, value);
                return value;
            }
            currCtx = ((currCtx.parent));
        }
        throw new Error("Not declared variable " + expr.name);
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitReadVarExpr = function (ast, ctx) {
        var /** @type {?} */ varName = ((ast.name));
        if (ast.builtin != null) {
            switch (ast.builtin) {
                case BuiltinVar.Super:
                    return ctx.instance.__proto__;
                case BuiltinVar.This:
                    return ctx.instance;
                case BuiltinVar.CatchError:
                    varName = CATCH_ERROR_VAR$2;
                    break;
                case BuiltinVar.CatchStack:
                    varName = CATCH_STACK_VAR$2;
                    break;
                default:
                    throw new Error("Unknown builtin variable " + ast.builtin);
            }
        }
        var /** @type {?} */ currCtx = ctx;
        while (currCtx != null) {
            if (currCtx.vars.has(varName)) {
                return currCtx.vars.get(varName);
            }
            currCtx = ((currCtx.parent));
        }
        throw new Error("Not declared variable " + varName);
    };
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitWriteKeyExpr = function (expr, ctx) {
        var /** @type {?} */ receiver = expr.receiver.visitExpression(this, ctx);
        var /** @type {?} */ index = expr.index.visitExpression(this, ctx);
        var /** @type {?} */ value = expr.value.visitExpression(this, ctx);
        receiver[index] = value;
        return value;
    };
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitWritePropExpr = function (expr, ctx) {
        var /** @type {?} */ receiver = expr.receiver.visitExpression(this, ctx);
        var /** @type {?} */ value = expr.value.visitExpression(this, ctx);
        receiver[expr.name] = value;
        return value;
    };
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitInvokeMethodExpr = function (expr, ctx) {
        var /** @type {?} */ receiver = expr.receiver.visitExpression(this, ctx);
        var /** @type {?} */ args = this.visitAllExpressions(expr.args, ctx);
        var /** @type {?} */ result;
        if (expr.builtin != null) {
            switch (expr.builtin) {
                case BuiltinMethod.ConcatArray:
                    result = receiver.concat.apply(receiver, args);
                    break;
                case BuiltinMethod.SubscribeObservable:
                    result = receiver.subscribe({ next: args[0] });
                    break;
                case BuiltinMethod.Bind:
                    result = receiver.bind.apply(receiver, args);
                    break;
                default:
                    throw new Error("Unknown builtin method " + expr.builtin);
            }
        }
        else {
            result = receiver[((expr.name))].apply(receiver, args);
        }
        return result;
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitInvokeFunctionExpr = function (stmt, ctx) {
        var /** @type {?} */ args = this.visitAllExpressions(stmt.args, ctx);
        var /** @type {?} */ fnExpr = stmt.fn;
        if (fnExpr instanceof ReadVarExpr && fnExpr.builtin === BuiltinVar.Super) {
            ctx.instance.constructor.prototype.constructor.apply(ctx.instance, args);
            return null;
        }
        else {
            var /** @type {?} */ fn$$1 = stmt.fn.visitExpression(this, ctx);
            return fn$$1.apply(null, args);
        }
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitReturnStmt = function (stmt, ctx) {
        return new ReturnValue(stmt.value.visitExpression(this, ctx));
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitDeclareClassStmt = function (stmt, ctx) {
        var /** @type {?} */ clazz = createDynamicClass(stmt, ctx, this);
        ctx.vars.set(stmt.name, clazz);
        return null;
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitExpressionStmt = function (stmt, ctx) {
        return stmt.expr.visitExpression(this, ctx);
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitIfStmt = function (stmt, ctx) {
        var /** @type {?} */ condition = stmt.condition.visitExpression(this, ctx);
        if (condition) {
            return this.visitAllStatements(stmt.trueCase, ctx);
        }
        else if (stmt.falseCase != null) {
            return this.visitAllStatements(stmt.falseCase, ctx);
        }
        return null;
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitTryCatchStmt = function (stmt, ctx) {
        try {
            return this.visitAllStatements(stmt.bodyStmts, ctx);
        }
        catch (e) {
            var /** @type {?} */ childCtx = ctx.createChildWihtLocalVars();
            childCtx.vars.set(CATCH_ERROR_VAR$2, e);
            childCtx.vars.set(CATCH_STACK_VAR$2, e.stack);
            return this.visitAllStatements(stmt.catchStmts, childCtx);
        }
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitThrowStmt = function (stmt, ctx) {
        throw stmt.error.visitExpression(this, ctx);
    };
    /**
     * @param {?} stmt
     * @param {?=} context
     * @return {?}
     */
    StatementInterpreter.prototype.visitCommentStmt = function (stmt, context) { return null; };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitInstantiateExpr = function (ast, ctx) {
        var /** @type {?} */ args = this.visitAllExpressions(ast.args, ctx);
        var /** @type {?} */ clazz = ast.classExpr.visitExpression(this, ctx);
        return new (clazz.bind.apply(clazz, [void 0].concat(args)))();
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitLiteralExpr = function (ast, ctx) { return ast.value; };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitExternalExpr = function (ast, ctx) {
        return ast.value.reference;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitConditionalExpr = function (ast, ctx) {
        if (ast.condition.visitExpression(this, ctx)) {
            return ast.trueCase.visitExpression(this, ctx);
        }
        else if (ast.falseCase != null) {
            return ast.falseCase.visitExpression(this, ctx);
        }
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitNotExpr = function (ast, ctx) {
        return !ast.condition.visitExpression(this, ctx);
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitCastExpr = function (ast, ctx) {
        return ast.value.visitExpression(this, ctx);
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitFunctionExpr = function (ast, ctx) {
        var /** @type {?} */ paramNames = ast.params.map(function (param) { return param.name; });
        return _declareFn(paramNames, ast.statements, ctx, this);
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitDeclareFunctionStmt = function (stmt, ctx) {
        var /** @type {?} */ paramNames = stmt.params.map(function (param) { return param.name; });
        ctx.vars.set(stmt.name, _declareFn(paramNames, stmt.statements, ctx, this));
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitBinaryOperatorExpr = function (ast, ctx) {
        var _this = this;
        var /** @type {?} */ lhs = function () { return ast.lhs.visitExpression(_this, ctx); };
        var /** @type {?} */ rhs = function () { return ast.rhs.visitExpression(_this, ctx); };
        switch (ast.operator) {
            case BinaryOperator.Equals:
                return lhs() == rhs();
            case BinaryOperator.Identical:
                return lhs() === rhs();
            case BinaryOperator.NotEquals:
                return lhs() != rhs();
            case BinaryOperator.NotIdentical:
                return lhs() !== rhs();
            case BinaryOperator.And:
                return lhs() && rhs();
            case BinaryOperator.Or:
                return lhs() || rhs();
            case BinaryOperator.Plus:
                return lhs() + rhs();
            case BinaryOperator.Minus:
                return lhs() - rhs();
            case BinaryOperator.Divide:
                return lhs() / rhs();
            case BinaryOperator.Multiply:
                return lhs() * rhs();
            case BinaryOperator.Modulo:
                return lhs() % rhs();
            case BinaryOperator.Lower:
                return lhs() < rhs();
            case BinaryOperator.LowerEquals:
                return lhs() <= rhs();
            case BinaryOperator.Bigger:
                return lhs() > rhs();
            case BinaryOperator.BiggerEquals:
                return lhs() >= rhs();
            default:
                throw new Error("Unknown operator " + ast.operator);
        }
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitReadPropExpr = function (ast, ctx) {
        var /** @type {?} */ result;
        var /** @type {?} */ receiver = ast.receiver.visitExpression(this, ctx);
        result = receiver[ast.name];
        return result;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitReadKeyExpr = function (ast, ctx) {
        var /** @type {?} */ receiver = ast.receiver.visitExpression(this, ctx);
        var /** @type {?} */ prop = ast.index.visitExpression(this, ctx);
        return receiver[prop];
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitLiteralArrayExpr = function (ast, ctx) {
        return this.visitAllExpressions(ast.entries, ctx);
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitLiteralMapExpr = function (ast, ctx) {
        var _this = this;
        var /** @type {?} */ result = {};
        ast.entries.forEach(function (entry) { return ((result))[entry.key] = entry.value.visitExpression(_this, ctx); });
        return result;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    StatementInterpreter.prototype.visitCommaExpr = function (ast, context) {
        var /** @type {?} */ values = this.visitAllExpressions(ast.parts, context);
        return values[values.length - 1];
    };
    /**
     * @param {?} expressions
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitAllExpressions = function (expressions, ctx) {
        var _this = this;
        return expressions.map(function (expr) { return expr.visitExpression(_this, ctx); });
    };
    /**
     * @param {?} statements
     * @param {?} ctx
     * @return {?}
     */
    StatementInterpreter.prototype.visitAllStatements = function (statements, ctx) {
        for (var /** @type {?} */ i = 0; i < statements.length; i++) {
            var /** @type {?} */ stmt = statements[i];
            var /** @type {?} */ val = stmt.visitStatement(this, ctx);
            if (val instanceof ReturnValue) {
                return val;
            }
        }
        return null;
    };
    return StatementInterpreter;
}());
/**
 * @param {?} varNames
 * @param {?} statements
 * @param {?} ctx
 * @param {?} visitor
 * @return {?}
 */
function _declareFn(varNames, statements, ctx, visitor) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return _executeFunctionStatements(varNames, args, statements, ctx, visitor);
    };
}
var CATCH_ERROR_VAR$2 = 'error';
var CATCH_STACK_VAR$2 = 'stack';
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @abstract
 */
var AbstractJsEmitterVisitor = (function (_super) {
    __extends(AbstractJsEmitterVisitor, _super);
    function AbstractJsEmitterVisitor() {
        return _super.call(this, false) || this;
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractJsEmitterVisitor.prototype.visitDeclareClassStmt = function (stmt, ctx) {
        var _this = this;
        ctx.pushClass(stmt);
        this._visitClassConstructor(stmt, ctx);
        if (stmt.parent != null) {
            ctx.print(stmt, stmt.name + ".prototype = Object.create(");
            stmt.parent.visitExpression(this, ctx);
            ctx.println(stmt, ".prototype);");
        }
        stmt.getters.forEach(function (getter) { return _this._visitClassGetter(stmt, getter, ctx); });
        stmt.methods.forEach(function (method) { return _this._visitClassMethod(stmt, method, ctx); });
        ctx.popClass();
        return null;
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractJsEmitterVisitor.prototype._visitClassConstructor = function (stmt, ctx) {
        ctx.print(stmt, "function " + stmt.name + "(");
        if (stmt.constructorMethod != null) {
            this._visitParams(stmt.constructorMethod.params, ctx);
        }
        ctx.println(stmt, ") {");
        ctx.incIndent();
        if (stmt.constructorMethod != null) {
            if (stmt.constructorMethod.body.length > 0) {
                ctx.println(stmt, "var self = this;");
                this.visitAllStatements(stmt.constructorMethod.body, ctx);
            }
        }
        ctx.decIndent();
        ctx.println(stmt, "}");
    };
    /**
     * @param {?} stmt
     * @param {?} getter
     * @param {?} ctx
     * @return {?}
     */
    AbstractJsEmitterVisitor.prototype._visitClassGetter = function (stmt, getter, ctx) {
        ctx.println(stmt, "Object.defineProperty(" + stmt.name + ".prototype, '" + getter.name + "', { get: function() {");
        ctx.incIndent();
        if (getter.body.length > 0) {
            ctx.println(stmt, "var self = this;");
            this.visitAllStatements(getter.body, ctx);
        }
        ctx.decIndent();
        ctx.println(stmt, "}});");
    };
    /**
     * @param {?} stmt
     * @param {?} method
     * @param {?} ctx
     * @return {?}
     */
    AbstractJsEmitterVisitor.prototype._visitClassMethod = function (stmt, method, ctx) {
        ctx.print(stmt, stmt.name + ".prototype." + method.name + " = function(");
        this._visitParams(method.params, ctx);
        ctx.println(stmt, ") {");
        ctx.incIndent();
        if (method.body.length > 0) {
            ctx.println(stmt, "var self = this;");
            this.visitAllStatements(method.body, ctx);
        }
        ctx.decIndent();
        ctx.println(stmt, "};");
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractJsEmitterVisitor.prototype.visitReadVarExpr = function (ast, ctx) {
        if (ast.builtin === BuiltinVar.This) {
            ctx.print(ast, 'self');
        }
        else if (ast.builtin === BuiltinVar.Super) {
            throw new Error("'super' needs to be handled at a parent ast node, not at the variable level!");
        }
        else {
            _super.prototype.visitReadVarExpr.call(this, ast, ctx);
        }
        return null;
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractJsEmitterVisitor.prototype.visitDeclareVarStmt = function (stmt, ctx) {
        ctx.print(stmt, "var " + stmt.name + " = ");
        stmt.value.visitExpression(this, ctx);
        ctx.println(stmt, ";");
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractJsEmitterVisitor.prototype.visitCastExpr = function (ast, ctx) {
        ast.value.visitExpression(this, ctx);
        return null;
    };
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    AbstractJsEmitterVisitor.prototype.visitInvokeFunctionExpr = function (expr, ctx) {
        var /** @type {?} */ fnExpr = expr.fn;
        if (fnExpr instanceof ReadVarExpr && fnExpr.builtin === BuiltinVar.Super) {
            ((((ctx.currentClass)).parent)).visitExpression(this, ctx);
            ctx.print(expr, ".call(this");
            if (expr.args.length > 0) {
                ctx.print(expr, ", ");
                this.visitAllExpressions(expr.args, ctx, ',');
            }
            ctx.print(expr, ")");
        }
        else {
            _super.prototype.visitInvokeFunctionExpr.call(this, expr, ctx);
        }
        return null;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    AbstractJsEmitterVisitor.prototype.visitFunctionExpr = function (ast, ctx) {
        ctx.print(ast, "function(");
        this._visitParams(ast.params, ctx);
        ctx.println(ast, ") {");
        ctx.incIndent();
        this.visitAllStatements(ast.statements, ctx);
        ctx.decIndent();
        ctx.print(ast, "}");
        return null;
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractJsEmitterVisitor.prototype.visitDeclareFunctionStmt = function (stmt, ctx) {
        ctx.print(stmt, "function " + stmt.name + "(");
        this._visitParams(stmt.params, ctx);
        ctx.println(stmt, ") {");
        ctx.incIndent();
        this.visitAllStatements(stmt.statements, ctx);
        ctx.decIndent();
        ctx.println(stmt, "}");
        return null;
    };
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    AbstractJsEmitterVisitor.prototype.visitTryCatchStmt = function (stmt, ctx) {
        ctx.println(stmt, "try {");
        ctx.incIndent();
        this.visitAllStatements(stmt.bodyStmts, ctx);
        ctx.decIndent();
        ctx.println(stmt, "} catch (" + CATCH_ERROR_VAR$1.name + ") {");
        ctx.incIndent();
        var /** @type {?} */ catchStmts = [/** @type {?} */ (CATCH_STACK_VAR$1.set(CATCH_ERROR_VAR$1.prop('stack')).toDeclStmt(null, [
                StmtModifier.Final
            ]))].concat(stmt.catchStmts);
        this.visitAllStatements(catchStmts, ctx);
        ctx.decIndent();
        ctx.println(stmt, "}");
        return null;
    };
    /**
     * @param {?} params
     * @param {?} ctx
     * @return {?}
     */
    AbstractJsEmitterVisitor.prototype._visitParams = function (params, ctx) {
        this.visitAllObjects(function (param) { return ctx.print(null, param.name); }, params, ctx, ',');
    };
    /**
     * @param {?} method
     * @return {?}
     */
    AbstractJsEmitterVisitor.prototype.getBuiltinMethodName = function (method) {
        var /** @type {?} */ name;
        switch (method) {
            case BuiltinMethod.ConcatArray:
                name = 'concat';
                break;
            case BuiltinMethod.SubscribeObservable:
                name = 'subscribe';
                break;
            case BuiltinMethod.Bind:
                name = 'bind';
                break;
            default:
                throw new Error("Unknown builtin method: " + method);
        }
        return name;
    };
    return AbstractJsEmitterVisitor;
}(AbstractEmitterVisitor));
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @param {?} sourceUrl
 * @param {?} ctx
 * @param {?} vars
 * @return {?}
 */
function evalExpression(sourceUrl$$1, ctx, vars) {
    var /** @type {?} */ fnBody = ctx.toSource() + "\n//# sourceURL=" + sourceUrl$$1;
    var /** @type {?} */ fnArgNames = [];
    var /** @type {?} */ fnArgValues = [];
    for (var /** @type {?} */ argName in vars) {
        fnArgNames.push(argName);
        fnArgValues.push(vars[argName]);
    }
    if (isDevMode()) {
        // using `new Function(...)` generates a header, 1 line of no arguments, 2 lines otherwise
        // E.g. ```
        // function anonymous(a,b,c
        // /**/) { ... }```
        // We don't want to hard code this fact, so we auto detect it via an empty function first.
        var /** @type {?} */ emptyFn = new (Function.bind.apply(Function, [void 0].concat(fnArgNames.concat('return null;'))))().toString();
        var /** @type {?} */ headerLines = emptyFn.slice(0, emptyFn.indexOf('return null;')).split('\n').length - 1;
        fnBody += "\n" + ctx.toSourceMapGenerator(sourceUrl$$1, sourceUrl$$1, headerLines).toJsComment();
    }
    return new (Function.bind.apply(Function, [void 0].concat(fnArgNames.concat(fnBody))))().apply(void 0, fnArgValues);
}
/**
 * @param {?} sourceUrl
 * @param {?} statements
 * @param {?} resultVars
 * @return {?}
 */
function jitStatements(sourceUrl$$1, statements, resultVars) {
    var /** @type {?} */ converter = new JitEmitterVisitor();
    var /** @type {?} */ ctx = EmitterVisitorContext.createRoot(resultVars);
    var /** @type {?} */ returnStmt = new ReturnStatement(literalArr(resultVars.map(function (resultVar) { return variable(resultVar); })));
    converter.visitAllStatements(statements.concat([returnStmt]), ctx);
    return evalExpression(sourceUrl$$1, ctx, converter.getArgs());
}
var JitEmitterVisitor = (function (_super) {
    __extends(JitEmitterVisitor, _super);
    function JitEmitterVisitor() {
        var _this = _super.apply(this, arguments) || this;
        _this._evalArgNames = [];
        _this._evalArgValues = [];
        return _this;
    }
    /**
     * @return {?}
     */
    JitEmitterVisitor.prototype.getArgs = function () {
        var /** @type {?} */ result = {};
        for (var /** @type {?} */ i = 0; i < this._evalArgNames.length; i++) {
            result[this._evalArgNames[i]] = this._evalArgValues[i];
        }
        return result;
    };
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    JitEmitterVisitor.prototype.visitExternalExpr = function (ast, ctx) {
        var /** @type {?} */ value = ast.value.reference;
        var /** @type {?} */ id = this._evalArgValues.indexOf(value);
        if (id === -1) {
            id = this._evalArgValues.length;
            this._evalArgValues.push(value);
            var /** @type {?} */ name = identifierName(ast.value) || 'val';
            this._evalArgNames.push("jit_" + name + id);
        }
        ctx.print(ast, this._evalArgNames[id]);
        return null;
    };
    return JitEmitterVisitor;
}(AbstractJsEmitterVisitor));
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * An internal module of the Angular compiler that begins with component types,
 * extracts templates, and eventually produces a compiled version of the component
 * ready for linking into an application.
 *
 * \@security When compiling templates at runtime, you must ensure that the entire template comes
 * from a trusted source. Attacker-controlled data introduced by a template could expose your
 * application to XSS risks.  For more detail, see the [Security Guide](http://g.co/ng/security).
 */
var JitCompiler = (function () {
    /**
     * @param {?} _injector
     * @param {?} _metadataResolver
     * @param {?} _templateParser
     * @param {?} _styleCompiler
     * @param {?} _viewCompiler
     * @param {?} _ngModuleCompiler
     * @param {?} _compilerConfig
     * @param {?} _console
     */
    function JitCompiler(_injector, _metadataResolver, _templateParser, _styleCompiler, _viewCompiler, _ngModuleCompiler, _compilerConfig, _console) {
        this._injector = _injector;
        this._metadataResolver = _metadataResolver;
        this._templateParser = _templateParser;
        this._styleCompiler = _styleCompiler;
        this._viewCompiler = _viewCompiler;
        this._ngModuleCompiler = _ngModuleCompiler;
        this._compilerConfig = _compilerConfig;
        this._console = _console;
        this._compiledTemplateCache = new Map();
        this._compiledHostTemplateCache = new Map();
        this._compiledDirectiveWrapperCache = new Map();
        this._compiledNgModuleCache = new Map();
        this._sharedStylesheetCount = 0;
    }
    Object.defineProperty(JitCompiler.prototype, "injector", {
        /**
         * @return {?}
         */
        get: function () { return this._injector; },
        enumerable: true,
        configurable: true
    });
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    JitCompiler.prototype.compileModuleSync = function (moduleType) {
        return ((this._compileModuleAndComponents(moduleType, true).syncResult));
    };
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    JitCompiler.prototype.compileModuleAsync = function (moduleType) {
        return ((this._compileModuleAndComponents(moduleType, false).asyncResult));
    };
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    JitCompiler.prototype.compileModuleAndAllComponentsSync = function (moduleType) {
        return ((this._compileModuleAndAllComponents(moduleType, true).syncResult));
    };
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    JitCompiler.prototype.compileModuleAndAllComponentsAsync = function (moduleType) {
        return ((this._compileModuleAndAllComponents(moduleType, false).asyncResult));
    };
    /**
     * @param {?} component
     * @return {?}
     */
    JitCompiler.prototype.getNgContentSelectors = function (component) {
        this._console.warn('Compiler.getNgContentSelectors is deprecated. Use ComponentFactory.ngContentSelectors instead!');
        var /** @type {?} */ template = this._compiledTemplateCache.get(component);
        if (!template) {
            throw new Error("The component " + ɵstringify(component) + " is not yet compiled!");
        }
        return ((template.compMeta.template)).ngContentSelectors;
    };
    /**
     * @template T
     * @param {?} moduleType
     * @param {?} isSync
     * @return {?}
     */
    JitCompiler.prototype._compileModuleAndComponents = function (moduleType, isSync) {
        var _this = this;
        var /** @type {?} */ loadingPromise = this._loadModules(moduleType, isSync);
        var /** @type {?} */ createResult = function () {
            _this._compileComponents(moduleType, null);
            return _this._compileModule(moduleType);
        };
        if (isSync) {
            return new SyncAsyncResult(createResult());
        }
        else {
            return new SyncAsyncResult(null, loadingPromise.then(createResult));
        }
    };
    /**
     * @template T
     * @param {?} moduleType
     * @param {?} isSync
     * @return {?}
     */
    JitCompiler.prototype._compileModuleAndAllComponents = function (moduleType, isSync) {
        var _this = this;
        var /** @type {?} */ loadingPromise = this._loadModules(moduleType, isSync);
        var /** @type {?} */ createResult = function () {
            var /** @type {?} */ componentFactories = [];
            _this._compileComponents(moduleType, componentFactories);
            return new ModuleWithComponentFactories(_this._compileModule(moduleType), componentFactories);
        };
        if (isSync) {
            return new SyncAsyncResult(createResult());
        }
        else {
            return new SyncAsyncResult(null, loadingPromise.then(createResult));
        }
    };
    /**
     * @param {?} mainModule
     * @param {?} isSync
     * @return {?}
     */
    JitCompiler.prototype._loadModules = function (mainModule, isSync) {
        var _this = this;
        var /** @type {?} */ loadingPromises = [];
        var /** @type {?} */ ngModule = ((this._metadataResolver.getNgModuleMetadata(mainModule)));
        // Note: the loadingPromise for a module only includes the loading of the exported directives
        // of imported modules.
        // However, for runtime compilation, we want to transitively compile all modules,
        // so we also need to call loadNgModuleDirectiveAndPipeMetadata for all nested modules.
        ngModule.transitiveModule.modules.forEach(function (localModuleMeta) {
            loadingPromises.push(_this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(localModuleMeta.reference, isSync));
        });
        return Promise.all(loadingPromises);
    };
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    JitCompiler.prototype._compileModule = function (moduleType) {
        var _this = this;
        var /** @type {?} */ ngModuleFactory = ((this._compiledNgModuleCache.get(moduleType)));
        if (!ngModuleFactory) {
            var /** @type {?} */ moduleMeta_1 = ((this._metadataResolver.getNgModuleMetadata(moduleType)));
            // Always provide a bound Compiler
            var /** @type {?} */ extraProviders = [this._metadataResolver.getProviderMetadata(new ProviderMeta(Compiler, { useFactory: function () { return new ModuleBoundCompiler(_this, moduleMeta_1.type.reference); } }))];
            var /** @type {?} */ compileResult = this._ngModuleCompiler.compile(moduleMeta_1, extraProviders);
            if (!this._compilerConfig.useJit) {
                ngModuleFactory =
                    interpretStatements(compileResult.statements, [compileResult.ngModuleFactoryVar])[0];
            }
            else {
                ngModuleFactory = jitStatements(ngModuleJitUrl(moduleMeta_1), compileResult.statements, [compileResult.ngModuleFactoryVar])[0];
            }
            this._compiledNgModuleCache.set(moduleMeta_1.type.reference, ngModuleFactory);
        }
        return ngModuleFactory;
    };
    /**
     * \@internal
     * @param {?} mainModule
     * @param {?} allComponentFactories
     * @return {?}
     */
    JitCompiler.prototype._compileComponents = function (mainModule, allComponentFactories) {
        var _this = this;
        var /** @type {?} */ ngModule = ((this._metadataResolver.getNgModuleMetadata(mainModule)));
        var /** @type {?} */ moduleByDirective = new Map();
        var /** @type {?} */ templates = new Set();
        ngModule.transitiveModule.modules.forEach(function (localModuleSummary) {
            var /** @type {?} */ localModuleMeta = ((_this._metadataResolver.getNgModuleMetadata(localModuleSummary.reference)));
            localModuleMeta.declaredDirectives.forEach(function (dirIdentifier) {
                moduleByDirective.set(dirIdentifier.reference, localModuleMeta);
                var /** @type {?} */ dirMeta = _this._metadataResolver.getDirectiveMetadata(dirIdentifier.reference);
                if (dirMeta.isComponent) {
                    templates.add(_this._createCompiledTemplate(dirMeta, localModuleMeta));
                    if (allComponentFactories) {
                        var /** @type {?} */ template = _this._createCompiledHostTemplate(dirMeta.type.reference, localModuleMeta);
                        templates.add(template);
                        allComponentFactories.push(/** @type {?} */ (dirMeta.componentFactory));
                    }
                }
            });
        });
        ngModule.transitiveModule.modules.forEach(function (localModuleSummary) {
            var /** @type {?} */ localModuleMeta = ((_this._metadataResolver.getNgModuleMetadata(localModuleSummary.reference)));
            localModuleMeta.declaredDirectives.forEach(function (dirIdentifier) {
                var /** @type {?} */ dirMeta = _this._metadataResolver.getDirectiveMetadata(dirIdentifier.reference);
                if (dirMeta.isComponent) {
                    dirMeta.entryComponents.forEach(function (entryComponentType) {
                        var /** @type {?} */ moduleMeta = ((moduleByDirective.get(entryComponentType.componentType)));
                        templates.add(_this._createCompiledHostTemplate(entryComponentType.componentType, moduleMeta));
                    });
                }
            });
            localModuleMeta.entryComponents.forEach(function (entryComponentType) {
                var /** @type {?} */ moduleMeta = ((moduleByDirective.get(entryComponentType.componentType)));
                templates.add(_this._createCompiledHostTemplate(entryComponentType.componentType, moduleMeta));
            });
        });
        templates.forEach(function (template) { return _this._compileTemplate(template); });
    };
    /**
     * @param {?} type
     * @return {?}
     */
    JitCompiler.prototype.clearCacheFor = function (type) {
        this._compiledNgModuleCache.delete(type);
        this._metadataResolver.clearCacheFor(type);
        this._compiledHostTemplateCache.delete(type);
        var /** @type {?} */ compiledTemplate = this._compiledTemplateCache.get(type);
        if (compiledTemplate) {
            this._compiledTemplateCache.delete(type);
        }
    };
    /**
     * @return {?}
     */
    JitCompiler.prototype.clearCache = function () {
        this._metadataResolver.clearCache();
        this._compiledTemplateCache.clear();
        this._compiledHostTemplateCache.clear();
        this._compiledNgModuleCache.clear();
    };
    /**
     * @param {?} compType
     * @param {?} ngModule
     * @return {?}
     */
    JitCompiler.prototype._createCompiledHostTemplate = function (compType, ngModule) {
        if (!ngModule) {
            throw new Error("Component " + ɵstringify(compType) + " is not part of any NgModule or the module has not been imported into your module.");
        }
        var /** @type {?} */ compiledTemplate = this._compiledHostTemplateCache.get(compType);
        if (!compiledTemplate) {
            var /** @type {?} */ compMeta = this._metadataResolver.getDirectiveMetadata(compType);
            assertComponent(compMeta);
            var /** @type {?} */ componentFactory = (compMeta.componentFactory);
            var /** @type {?} */ hostClass = this._metadataResolver.getHostComponentType(compType);
            var /** @type {?} */ hostMeta = createHostComponentMeta(hostClass, compMeta, /** @type {?} */ (ɵgetComponentViewDefinitionFactory(componentFactory)));
            compiledTemplate =
                new CompiledTemplate(true, compMeta.type, hostMeta, ngModule, [compMeta.type]);
            this._compiledHostTemplateCache.set(compType, compiledTemplate);
        }
        return compiledTemplate;
    };
    /**
     * @param {?} compMeta
     * @param {?} ngModule
     * @return {?}
     */
    JitCompiler.prototype._createCompiledTemplate = function (compMeta, ngModule) {
        var /** @type {?} */ compiledTemplate = this._compiledTemplateCache.get(compMeta.type.reference);
        if (!compiledTemplate) {
            assertComponent(compMeta);
            compiledTemplate = new CompiledTemplate(false, compMeta.type, compMeta, ngModule, ngModule.transitiveModule.directives);
            this._compiledTemplateCache.set(compMeta.type.reference, compiledTemplate);
        }
        return compiledTemplate;
    };
    /**
     * @param {?} template
     * @return {?}
     */
    JitCompiler.prototype._compileTemplate = function (template) {
        var _this = this;
        if (template.isCompiled) {
            return;
        }
        var /** @type {?} */ compMeta = template.compMeta;
        var /** @type {?} */ externalStylesheetsByModuleUrl = new Map();
        var /** @type {?} */ stylesCompileResult = this._styleCompiler.compileComponent(compMeta);
        stylesCompileResult.externalStylesheets.forEach(function (r) { externalStylesheetsByModuleUrl.set(/** @type {?} */ ((r.meta.moduleUrl)), r); });
        this._resolveStylesCompileResult(stylesCompileResult.componentStylesheet, externalStylesheetsByModuleUrl);
        var /** @type {?} */ directives = template.directives.map(function (dir) { return _this._metadataResolver.getDirectiveSummary(dir.reference); });
        var /** @type {?} */ pipes = template.ngModule.transitiveModule.pipes.map(function (pipe) { return _this._metadataResolver.getPipeSummary(pipe.reference); });
        var _a = this._templateParser.parse(compMeta, /** @type {?} */ ((((compMeta.template)).template)), directives, pipes, template.ngModule.schemas, templateSourceUrl(template.ngModule.type, template.compMeta, /** @type {?} */ ((template.compMeta.template)))), parsedTemplate = _a.template, usedPipes = _a.pipes;
        var /** @type {?} */ compileResult = this._viewCompiler.compileComponent(compMeta, parsedTemplate, variable(stylesCompileResult.componentStylesheet.stylesVar), usedPipes);
        var /** @type {?} */ statements = stylesCompileResult.componentStylesheet.statements.concat(compileResult.statements);
        var /** @type {?} */ viewClassAndRendererTypeVars = compMeta.isHost ?
            [compileResult.viewClassVar] :
            [compileResult.viewClassVar, compileResult.rendererTypeVar];
        var /** @type {?} */ viewClass;
        var /** @type {?} */ rendererType;
        if (!this._compilerConfig.useJit) {
            _b = interpretStatements(statements, viewClassAndRendererTypeVars), viewClass = _b[0], rendererType = _b[1];
        }
        else {
            _c = jitStatements(templateJitUrl(template.ngModule.type, template.compMeta), statements, viewClassAndRendererTypeVars), viewClass = _c[0], rendererType = _c[1];
        }
        template.compiled(viewClass, rendererType);
        var _b, _c;
    };
    /**
     * @param {?} result
     * @param {?} externalStylesheetsByModuleUrl
     * @return {?}
     */
    JitCompiler.prototype._resolveStylesCompileResult = function (result, externalStylesheetsByModuleUrl) {
        var _this = this;
        result.dependencies.forEach(function (dep, i) {
            var /** @type {?} */ nestedCompileResult = ((externalStylesheetsByModuleUrl.get(dep.moduleUrl)));
            var /** @type {?} */ nestedStylesArr = _this._resolveAndEvalStylesCompileResult(nestedCompileResult, externalStylesheetsByModuleUrl);
            dep.valuePlaceholder.reference = nestedStylesArr;
        });
    };
    /**
     * @param {?} result
     * @param {?} externalStylesheetsByModuleUrl
     * @return {?}
     */
    JitCompiler.prototype._resolveAndEvalStylesCompileResult = function (result, externalStylesheetsByModuleUrl) {
        this._resolveStylesCompileResult(result, externalStylesheetsByModuleUrl);
        if (!this._compilerConfig.useJit) {
            return interpretStatements(result.statements, [result.stylesVar])[0];
        }
        else {
            return jitStatements(sharedStylesheetJitUrl(result.meta, this._sharedStylesheetCount++), result.statements, [result.stylesVar])[0];
        }
    };
    return JitCompiler;
}());
JitCompiler.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
JitCompiler.ctorParameters = function () { return [
    { type: Injector, },
    { type: CompileMetadataResolver, },
    { type: TemplateParser, },
    { type: StyleCompiler, },
    { type: ViewCompiler, },
    { type: NgModuleCompiler, },
    { type: CompilerConfig, },
    { type: ɵConsole, },
]; };
var CompiledTemplate = (function () {
    /**
     * @param {?} isHost
     * @param {?} compType
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} directives
     */
    function CompiledTemplate(isHost, compType, compMeta, ngModule, directives) {
        this.isHost = isHost;
        this.compType = compType;
        this.compMeta = compMeta;
        this.ngModule = ngModule;
        this.directives = directives;
        this._viewClass = ((null));
        this.isCompiled = false;
    }
    /**
     * @param {?} viewClass
     * @param {?} rendererType
     * @return {?}
     */
    CompiledTemplate.prototype.compiled = function (viewClass, rendererType) {
        this._viewClass = viewClass;
        ((this.compMeta.componentViewType)).setDelegate(viewClass);
        for (var /** @type {?} */ prop in rendererType) {
            ((this.compMeta.rendererType))[prop] = rendererType[prop];
        }
        this.isCompiled = true;
    };
    return CompiledTemplate;
}());
/**
 * @param {?} meta
 * @return {?}
 */
function assertComponent(meta) {
    if (!meta.isComponent) {
        throw new Error("Could not compile '" + identifierName(meta.type) + "' because it is not a component.");
    }
}
/**
 * Implements `Compiler` by delegating to the JitCompiler using a known module.
 */
var ModuleBoundCompiler = (function () {
    /**
     * @param {?} _delegate
     * @param {?} _ngModule
     */
    function ModuleBoundCompiler(_delegate, _ngModule) {
        this._delegate = _delegate;
        this._ngModule = _ngModule;
    }
    Object.defineProperty(ModuleBoundCompiler.prototype, "_injector", {
        /**
         * @return {?}
         */
        get: function () { return this._delegate.injector; },
        enumerable: true,
        configurable: true
    });
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    ModuleBoundCompiler.prototype.compileModuleSync = function (moduleType) {
        return this._delegate.compileModuleSync(moduleType);
    };
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    ModuleBoundCompiler.prototype.compileModuleAsync = function (moduleType) {
        return this._delegate.compileModuleAsync(moduleType);
    };
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    ModuleBoundCompiler.prototype.compileModuleAndAllComponentsSync = function (moduleType) {
        return this._delegate.compileModuleAndAllComponentsSync(moduleType);
    };
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    ModuleBoundCompiler.prototype.compileModuleAndAllComponentsAsync = function (moduleType) {
        return this._delegate.compileModuleAndAllComponentsAsync(moduleType);
    };
    /**
     * @param {?} component
     * @return {?}
     */
    ModuleBoundCompiler.prototype.getNgContentSelectors = function (component) {
        return this._delegate.getNgContentSelectors(component);
    };
    /**
     * Clears all caches
     * @return {?}
     */
    ModuleBoundCompiler.prototype.clearCache = function () { this._delegate.clearCache(); };
    /**
     * Clears the cache for the given component/ngModule.
     * @param {?} type
     * @return {?}
     */
    ModuleBoundCompiler.prototype.clearCacheFor = function (type) { this._delegate.clearCacheFor(type); };
    return ModuleBoundCompiler;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A container for message extracted from the templates.
 */
var MessageBundle = (function () {
    /**
     * @param {?} _htmlParser
     * @param {?} _implicitTags
     * @param {?} _implicitAttrs
     * @param {?=} _locale
     */
    function MessageBundle(_htmlParser, _implicitTags, _implicitAttrs, _locale) {
        if (_locale === void 0) { _locale = null; }
        this._htmlParser = _htmlParser;
        this._implicitTags = _implicitTags;
        this._implicitAttrs = _implicitAttrs;
        this._locale = _locale;
        this._messages = [];
    }
    /**
     * @param {?} html
     * @param {?} url
     * @param {?} interpolationConfig
     * @return {?}
     */
    MessageBundle.prototype.updateFromTemplate = function (html, url, interpolationConfig) {
        var /** @type {?} */ htmlParserResult = this._htmlParser.parse(html, url, true, interpolationConfig);
        if (htmlParserResult.errors.length) {
            return htmlParserResult.errors;
        }
        var /** @type {?} */ i18nParserResult = extractMessages(htmlParserResult.rootNodes, interpolationConfig, this._implicitTags, this._implicitAttrs);
        if (i18nParserResult.errors.length) {
            return i18nParserResult.errors;
        }
        (_a = this._messages).push.apply(_a, i18nParserResult.messages);
        return [];
        var _a;
    };
    /**
     * @return {?}
     */
    MessageBundle.prototype.getMessages = function () { return this._messages; };
    /**
     * @param {?} serializer
     * @param {?=} filterSources
     * @return {?}
     */
    MessageBundle.prototype.write = function (serializer, filterSources) {
        var /** @type {?} */ messages = {};
        var /** @type {?} */ mapperVisitor = new MapPlaceholderNames();
        // Deduplicate messages based on their ID
        this._messages.forEach(function (message) {
            var /** @type {?} */ id = serializer.digest(message);
            if (!messages.hasOwnProperty(id)) {
                messages[id] = message;
            }
            else {
                (_a = messages[id].sources).push.apply(_a, message.sources);
            }
            var _a;
        });
        // Transform placeholder names using the serializer mapping
        var /** @type {?} */ msgList = Object.keys(messages).map(function (id) {
            var /** @type {?} */ mapper = serializer.createNameMapper(messages[id]);
            var /** @type {?} */ src = messages[id];
            var /** @type {?} */ nodes = mapper ? mapperVisitor.convert(src.nodes, mapper) : src.nodes;
            var /** @type {?} */ transformedMessage = new Message(nodes, {}, {}, src.meaning, src.description, id);
            transformedMessage.sources = src.sources;
            if (filterSources) {
                transformedMessage.sources.forEach(function (source) { return source.filePath = filterSources(source.filePath); });
            }
            return transformedMessage;
        });
        return serializer.write(msgList, this._locale);
    };
    return MessageBundle;
}());
var MapPlaceholderNames = (function (_super) {
    __extends(MapPlaceholderNames, _super);
    function MapPlaceholderNames() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} nodes
     * @param {?} mapper
     * @return {?}
     */
    MapPlaceholderNames.prototype.convert = function (nodes, mapper) {
        var _this = this;
        return mapper ? nodes.map(function (n) { return n.visit(_this, mapper); }) : nodes;
    };
    /**
     * @param {?} ph
     * @param {?} mapper
     * @return {?}
     */
    MapPlaceholderNames.prototype.visitTagPlaceholder = function (ph, mapper) {
        var _this = this;
        var /** @type {?} */ startName = ((mapper.toPublicName(ph.startName)));
        var /** @type {?} */ closeName = ph.closeName ? ((mapper.toPublicName(ph.closeName))) : ph.closeName;
        var /** @type {?} */ children = ph.children.map(function (n) { return n.visit(_this, mapper); });
        return new TagPlaceholder(ph.tag, ph.attrs, startName, closeName, children, ph.isVoid, ph.sourceSpan);
    };
    /**
     * @param {?} ph
     * @param {?} mapper
     * @return {?}
     */
    MapPlaceholderNames.prototype.visitPlaceholder = function (ph, mapper) {
        return new Placeholder(ph.value, /** @type {?} */ ((mapper.toPublicName(ph.name))), ph.sourceSpan);
    };
    /**
     * @param {?} ph
     * @param {?} mapper
     * @return {?}
     */
    MapPlaceholderNames.prototype.visitIcuPlaceholder = function (ph, mapper) {
        return new IcuPlaceholder(ph.value, /** @type {?} */ ((mapper.toPublicName(ph.name))), ph.sourceSpan);
    };
    return MapPlaceholderNames;
}(CloneVisitor));
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Extract i18n messages from source code
 */
var Extractor = (function () {
    /**
     * @param {?} host
     * @param {?} staticSymbolResolver
     * @param {?} messageBundle
     * @param {?} metadataResolver
     */
    function Extractor(host, staticSymbolResolver, messageBundle, metadataResolver) {
        this.host = host;
        this.staticSymbolResolver = staticSymbolResolver;
        this.messageBundle = messageBundle;
        this.metadataResolver = metadataResolver;
    }
    /**
     * @param {?} rootFiles
     * @return {?}
     */
    Extractor.prototype.extract = function (rootFiles) {
        var _this = this;
        var /** @type {?} */ programSymbols = extractProgramSymbols(this.staticSymbolResolver, rootFiles, this.host);
        var _a = analyzeAndValidateNgModules(programSymbols, this.host, this.metadataResolver), files = _a.files, ngModules = _a.ngModules;
        return Promise
            .all(ngModules.map(function (ngModule) { return _this.metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false); }))
            .then(function () {
            var /** @type {?} */ errors = [];
            files.forEach(function (file) {
                var /** @type {?} */ compMetas = [];
                file.directives.forEach(function (directiveType) {
                    var /** @type {?} */ dirMeta = _this.metadataResolver.getDirectiveMetadata(directiveType);
                    if (dirMeta && dirMeta.isComponent) {
                        compMetas.push(dirMeta);
                    }
                });
                compMetas.forEach(function (compMeta) {
                    var /** @type {?} */ html = ((((compMeta.template)).template));
                    var /** @type {?} */ interpolationConfig = InterpolationConfig.fromArray(/** @type {?} */ ((compMeta.template)).interpolation);
                    errors.push.apply(errors, ((_this.messageBundle.updateFromTemplate(html, file.srcUrl, interpolationConfig))));
                });
            });
            if (errors.length) {
                throw new Error(errors.map(function (e) { return e.toString(); }).join('\n'));
            }
            return _this.messageBundle;
        });
    };
    /**
     * @param {?} host
     * @param {?} locale
     * @return {?}
     */
    Extractor.create = function (host, locale) {
        var /** @type {?} */ htmlParser = new I18NHtmlParser(new HtmlParser());
        var /** @type {?} */ urlResolver = createOfflineCompileUrlResolver();
        var /** @type {?} */ symbolCache = new StaticSymbolCache();
        var /** @type {?} */ summaryResolver = new AotSummaryResolver(host, symbolCache);
        var /** @type {?} */ staticSymbolResolver = new StaticSymbolResolver(host, symbolCache, summaryResolver);
        var /** @type {?} */ staticReflector = new StaticReflector(summaryResolver, staticSymbolResolver);
        StaticAndDynamicReflectionCapabilities.install(staticReflector);
        var /** @type {?} */ config = new CompilerConfig({ defaultEncapsulation: ViewEncapsulation.Emulated, useJit: false });
        var /** @type {?} */ normalizer = new DirectiveNormalizer({ get: function (url) { return host.loadResource(url); } }, urlResolver, htmlParser, config);
        var /** @type {?} */ elementSchemaRegistry = new DomElementSchemaRegistry();
        var /** @type {?} */ resolver = new CompileMetadataResolver(config, new NgModuleResolver(staticReflector), new DirectiveResolver(staticReflector), new PipeResolver(staticReflector), summaryResolver, elementSchemaRegistry, normalizer, new ɵConsole(), symbolCache, staticReflector);
        // TODO(vicb): implicit tags & attributes
        var /** @type {?} */ messageBundle = new MessageBundle(htmlParser, [], {}, locale);
        var /** @type {?} */ extractor = new Extractor(host, staticSymbolResolver, messageBundle, resolver);
        return { extractor: extractor, staticReflector: staticReflector };
    };
    return Extractor;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var _NO_RESOURCE_LOADER = {
    /**
     * @param {?} url
     * @return {?}
     */
    get: function (url) {
        throw new Error("No ResourceLoader implementation has been provided. Can't read the url \"" + url + "\"");
    }
};
var baseHtmlParser = new InjectionToken('HtmlParser');
/**
 * @param {?} parser
 * @param {?} translations
 * @param {?} format
 * @param {?} config
 * @param {?} console
 * @return {?}
 */
function i18nHtmlParserFactory(parser, translations, format, config, console) {
    return new I18NHtmlParser(parser, translations, format, /** @type {?} */ ((config.missingTranslation)), console);
}
/**
 * A set of providers that provide `JitCompiler` and its dependencies to use for
 * template compilation.
 */
var COMPILER_PROVIDERS = [
    { provide: ɵReflector, useValue: ɵreflector },
    { provide: ɵReflectorReader, useExisting: ɵReflector },
    { provide: ResourceLoader, useValue: _NO_RESOURCE_LOADER },
    SummaryResolver,
    ɵConsole,
    Lexer,
    Parser,
    {
        provide: baseHtmlParser,
        useClass: HtmlParser,
    },
    {
        provide: I18NHtmlParser,
        useFactory: i18nHtmlParserFactory,
        deps: [
            baseHtmlParser,
            [new Optional(), new Inject(TRANSLATIONS)],
            [new Optional(), new Inject(TRANSLATIONS_FORMAT)],
            [CompilerConfig],
            [ɵConsole],
        ]
    },
    {
        provide: HtmlParser,
        useExisting: I18NHtmlParser,
    },
    TemplateParser,
    DirectiveNormalizer,
    CompileMetadataResolver,
    DEFAULT_PACKAGE_URL_PROVIDER,
    StyleCompiler,
    ViewCompiler,
    NgModuleCompiler,
    { provide: CompilerConfig, useValue: new CompilerConfig() },
    JitCompiler,
    { provide: Compiler, useExisting: JitCompiler },
    DomElementSchemaRegistry,
    { provide: ElementSchemaRegistry, useExisting: DomElementSchemaRegistry },
    UrlResolver,
    DirectiveResolver,
    PipeResolver,
    NgModuleResolver,
];
var JitCompilerFactory = (function () {
    /**
     * @param {?} defaultOptions
     */
    function JitCompilerFactory(defaultOptions) {
        var compilerOptions = {
            useDebug: isDevMode(),
            useJit: true,
            defaultEncapsulation: ViewEncapsulation.Emulated,
            missingTranslation: MissingTranslationStrategy.Warning,
            enableLegacyTemplate: true,
        };
        this._defaultOptions = [compilerOptions].concat(defaultOptions);
    }
    /**
     * @param {?=} options
     * @return {?}
     */
    JitCompilerFactory.prototype.createCompiler = function (options) {
        if (options === void 0) { options = []; }
        var /** @type {?} */ opts = _mergeOptions(this._defaultOptions.concat(options));
        var /** @type {?} */ injector = ReflectiveInjector.resolveAndCreate([
            COMPILER_PROVIDERS, {
                provide: CompilerConfig,
                useFactory: function () {
                    return new CompilerConfig({
                        // let explicit values from the compiler options overwrite options
                        // from the app providers
                        useJit: opts.useJit,
                        // let explicit values from the compiler options overwrite options
                        // from the app providers
                        defaultEncapsulation: opts.defaultEncapsulation,
                        missingTranslation: opts.missingTranslation,
                        enableLegacyTemplate: opts.enableLegacyTemplate,
                    });
                },
                deps: []
            }, /** @type {?} */ ((opts.providers))
        ]);
        return injector.get(Compiler);
    };
    return JitCompilerFactory;
}());
JitCompilerFactory.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
JitCompilerFactory.ctorParameters = function () { return [
    { type: Array, decorators: [{ type: Inject, args: [COMPILER_OPTIONS,] },] },
]; };
/**
 * @return {?}
 */
function _initReflector() {
    ɵreflector.reflectionCapabilities = new ɵReflectionCapabilities();
}
/**
 * A platform that included corePlatform and the compiler.
 *
 * \@experimental
 */
var platformCoreDynamic = createPlatformFactory(platformCore, 'coreDynamic', [
    { provide: COMPILER_OPTIONS, useValue: {}, multi: true },
    { provide: CompilerFactory, useClass: JitCompilerFactory },
    { provide: PLATFORM_INITIALIZER, useValue: _initReflector, multi: true },
]);
/**
 * @param {?} optionsArr
 * @return {?}
 */
function _mergeOptions(optionsArr) {
    return {
        useJit: _lastDefined(optionsArr.map(function (options) { return options.useJit; })),
        defaultEncapsulation: _lastDefined(optionsArr.map(function (options) { return options.defaultEncapsulation; })),
        providers: _mergeArrays(optionsArr.map(function (options) { return ((options.providers)); })),
        missingTranslation: _lastDefined(optionsArr.map(function (options) { return options.missingTranslation; })),
    };
}
/**
 * @template T
 * @param {?} args
 * @return {?}
 */
function _lastDefined(args) {
    for (var /** @type {?} */ i = args.length - 1; i >= 0; i--) {
        if (args[i] !== undefined) {
            return args[i];
        }
    }
    return undefined;
}
/**
 * @param {?} parts
 * @return {?}
 */
function _mergeArrays(parts) {
    var /** @type {?} */ result = [];
    parts.forEach(function (part) { return part && result.push.apply(result, part); });
    return result;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Interface that defines how import statements should be generated.
 * @abstract
 */
var ImportResolver = (function () {
    function ImportResolver() {
    }
    /**
     * Converts a file path to a module name that can be used as an `import.
     * I.e. `path/to/importedFile.ts` should be imported by `path/to/containingFile.ts`.
     * @abstract
     * @param {?} importedFilePath
     * @param {?} containingFilePath
     * @return {?}
     */
    ImportResolver.prototype.fileNameToModuleName = function (importedFilePath, containingFilePath) { };
    /**
     * Converts the given StaticSymbol into another StaticSymbol that should be used
     * to generate the import from.
     * @abstract
     * @param {?} symbol
     * @return {?}
     */
    ImportResolver.prototype.getImportAs = function (symbol) { };
    /**
     * Determine the arity of a type.
     * @abstract
     * @param {?} symbol
     * @return {?}
     */
    ImportResolver.prototype.getTypeArity = function (symbol) { };
    return ImportResolver;
}());
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
// This file only reexports content of the `src` folder. Keep it that way.
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
 * Entry point for all public APIs of the compiler package.
 */
// This file only reexports content of the `src` folder. Keep it that way.
export { VERSION, TEMPLATE_TRANSFORMS, CompilerConfig, JitCompiler, DirectiveResolver, PipeResolver, NgModuleResolver, DEFAULT_INTERPOLATION_CONFIG, InterpolationConfig, NgModuleCompiler, ViewCompiler, isSyntaxError, syntaxError, TextAst, BoundTextAst, AttrAst, BoundElementPropertyAst, BoundEventAst, ReferenceAst, VariableAst, ElementAst, EmbeddedTemplateAst, BoundDirectivePropertyAst, DirectiveAst, ProviderAst, ProviderAstType, NgContentAst, PropertyBindingType, templateVisitAll, CompileAnimationEntryMetadata, CompileAnimationStateMetadata, CompileAnimationStateDeclarationMetadata, CompileAnimationStateTransitionMetadata, CompileAnimationMetadata, CompileAnimationKeyframesSequenceMetadata, CompileAnimationStyleMetadata, CompileAnimationAnimateMetadata, CompileAnimationWithStepsMetadata, CompileAnimationSequenceMetadata, CompileAnimationGroupMetadata, identifierName, identifierModuleUrl, viewClassName, rendererTypeName, hostViewClassName, dirWrapperClassName, componentFactoryName, CompileSummaryKind, tokenName, tokenReference, CompileStylesheetMetadata, CompileTemplateMetadata, CompileDirectiveMetadata, createHostComponentMeta, CompilePipeMetadata, CompileNgModuleMetadata, TransitiveCompileNgModuleMetadata, ProviderMeta, flatten, sourceUrl, templateSourceUrl, sharedStylesheetJitUrl, ngModuleJitUrl, templateJitUrl, createAotCompiler, AotCompiler, analyzeNgModules, analyzeAndValidateNgModules, extractProgramSymbols, GeneratedFile, StaticReflector, StaticAndDynamicReflectionCapabilities, StaticSymbol, StaticSymbolCache, ResolvedStaticSymbol, StaticSymbolResolver, unescapeIdentifier, AotSummaryResolver, SummaryResolver, i18nHtmlParserFactory, COMPILER_PROVIDERS, JitCompilerFactory, platformCoreDynamic, createUrlResolverWithoutPackagePrefix, createOfflineCompileUrlResolver, DEFAULT_PACKAGE_URL_PROVIDER, UrlResolver, getUrlScheme, ResourceLoader, ElementSchemaRegistry, Extractor, I18NHtmlParser, MessageBundle, Serializer, Xliff, Xliff2, Xmb, Xtb, DirectiveNormalizer, ParserError, ParseSpan, AST, Quote, EmptyExpr, ImplicitReceiver, Chain, Conditional, PropertyRead, PropertyWrite, SafePropertyRead, KeyedRead, KeyedWrite, BindingPipe, LiteralPrimitive, LiteralArray, LiteralMap, Interpolation, Binary, PrefixNot, MethodCall, SafeMethodCall, FunctionCall, ASTWithSource, TemplateBinding, RecursiveAstVisitor, AstTransformer, TokenType, Lexer, Token, EOF, isIdentifier, isQuote, SplitInterpolation, TemplateBindingParseResult, Parser, _ParseAST, ERROR_COLLECTOR_TOKEN, CompileMetadataResolver, componentModuleUrl, Text, Expansion, ExpansionCase, Attribute$1 as Attribute, Element, Comment, visitAll, ParseTreeResult, TreeError, HtmlParser, HtmlTagDefinition, getHtmlTagDefinition, TagContentType, splitNsName, isNgContainer, isNgContent, isNgTemplate, getNsPrefix, mergeNsAndName, NAMED_ENTITIES, ImportResolver, debugOutputAstAsTypeScript, TypeScriptEmitter, ParseLocation, ParseSourceFile, ParseSourceSpan, ParseErrorLevel, ParseError, typeSourceSpan, DomElementSchemaRegistry, CssSelector, SelectorMatcher, SelectorListContext, SelectorContext, StylesCompileDependency, StylesCompileResult, CompiledStylesheet, StyleCompiler, TemplateParseError, TemplateParseResult, TemplateParser, splitClasses, createElementCssSelector, removeSummaryDuplicates };
//# sourceMappingURL=compiler.js.map
//# sourceMappingURL=compiler.es5.js.map