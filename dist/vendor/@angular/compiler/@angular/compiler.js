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
const VERSION = new Version('4.1.3');

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
class TextAst {
    /**
     * @param {?} value
     * @param {?} ngContentIndex
     * @param {?} sourceSpan
     */
    constructor(value, ngContentIndex, sourceSpan) {
        this.value = value;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitText(this, context); }
}
/**
 * A bound expression within the text of a template.
 */
class BoundTextAst {
    /**
     * @param {?} value
     * @param {?} ngContentIndex
     * @param {?} sourceSpan
     */
    constructor(value, ngContentIndex, sourceSpan) {
        this.value = value;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) {
        return visitor.visitBoundText(this, context);
    }
}
/**
 * A plain attribute on an element.
 */
class AttrAst {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     */
    constructor(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitAttr(this, context); }
}
/**
 * A binding for an element property (e.g. `[property]="expression"`) or an animation trigger (e.g.
 * `[\@trigger]="stateExp"`)
 */
class BoundElementPropertyAst {
    /**
     * @param {?} name
     * @param {?} type
     * @param {?} securityContext
     * @param {?} value
     * @param {?} unit
     * @param {?} sourceSpan
     */
    constructor(name, type, securityContext, value, unit, sourceSpan) {
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
    visit(visitor, context) {
        return visitor.visitElementProperty(this, context);
    }
    /**
     * @return {?}
     */
    get isAnimation() { return this.type === PropertyBindingType.Animation; }
}
/**
 * A binding for an element event (e.g. `(event)="handler()"`) or an animation trigger event (e.g.
 * `(\@trigger.phase)="callback($event)"`).
 */
class BoundEventAst {
    /**
     * @param {?} name
     * @param {?} target
     * @param {?} phase
     * @param {?} handler
     * @param {?} sourceSpan
     */
    constructor(name, target, phase, handler, sourceSpan) {
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
    static calcFullName(name, target, phase) {
        if (target) {
            return `${target}:${name}`;
        }
        else if (phase) {
            return `@${name}.${phase}`;
        }
        else {
            return name;
        }
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) {
        return visitor.visitEvent(this, context);
    }
    /**
     * @return {?}
     */
    get fullName() { return BoundEventAst.calcFullName(this.name, this.target, this.phase); }
    /**
     * @return {?}
     */
    get isAnimation() { return !!this.phase; }
}
/**
 * A reference declaration on an element (e.g. `let someName="expression"`).
 */
class ReferenceAst {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     */
    constructor(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) {
        return visitor.visitReference(this, context);
    }
}
/**
 * A variable declaration on a <ng-template> (e.g. `var-someName="someLocalName"`).
 */
class VariableAst {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     */
    constructor(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) {
        return visitor.visitVariable(this, context);
    }
}
/**
 * An element declaration in a template.
 */
class ElementAst {
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
    constructor(name, attrs, inputs, outputs, references, directives, providers, hasViewContainer, queryMatches, children, ngContentIndex, sourceSpan, endSourceSpan) {
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
    visit(visitor, context) {
        return visitor.visitElement(this, context);
    }
}
/**
 * A `<ng-template>` element included in an Angular template.
 */
class EmbeddedTemplateAst {
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
    constructor(attrs, outputs, references, variables, directives, providers, hasViewContainer, queryMatches, children, ngContentIndex, sourceSpan) {
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
    visit(visitor, context) {
        return visitor.visitEmbeddedTemplate(this, context);
    }
}
/**
 * A directive property with a bound value (e.g. `*ngIf="condition").
 */
class BoundDirectivePropertyAst {
    /**
     * @param {?} directiveName
     * @param {?} templateName
     * @param {?} value
     * @param {?} sourceSpan
     */
    constructor(directiveName, templateName, value, sourceSpan) {
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
    visit(visitor, context) {
        return visitor.visitDirectiveProperty(this, context);
    }
}
/**
 * A directive declared on an element.
 */
class DirectiveAst {
    /**
     * @param {?} directive
     * @param {?} inputs
     * @param {?} hostProperties
     * @param {?} hostEvents
     * @param {?} contentQueryStartId
     * @param {?} sourceSpan
     */
    constructor(directive, inputs, hostProperties, hostEvents, contentQueryStartId, sourceSpan) {
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
    visit(visitor, context) {
        return visitor.visitDirective(this, context);
    }
}
/**
 * A provider declared on an element
 */
class ProviderAst {
    /**
     * @param {?} token
     * @param {?} multiProvider
     * @param {?} eager
     * @param {?} providers
     * @param {?} providerType
     * @param {?} lifecycleHooks
     * @param {?} sourceSpan
     */
    constructor(token, multiProvider, eager, providers, providerType, lifecycleHooks, sourceSpan) {
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
    visit(visitor, context) {
        // No visit method in the visitor for now...
        return null;
    }
}
let ProviderAstType = {};
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
class NgContentAst {
    /**
     * @param {?} index
     * @param {?} ngContentIndex
     * @param {?} sourceSpan
     */
    constructor(index, ngContentIndex, sourceSpan) {
        this.index = index;
        this.ngContentIndex = ngContentIndex;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) {
        return visitor.visitNgContent(this, context);
    }
}
let PropertyBindingType = {};
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
function templateVisitAll(visitor, asts, context = null) {
    const /** @type {?} */ result = [];
    const /** @type {?} */ visit = visitor.visit ?
        (ast) => ((visitor.visit))(ast, context) || ast.visit(visitor, context) :
        (ast) => ast.visit(visitor, context);
    asts.forEach(ast => {
        const /** @type {?} */ astResult = visit(ast);
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
class StaticSymbol {
    /**
     * @param {?} filePath
     * @param {?} name
     * @param {?} members
     */
    constructor(filePath, name, members) {
        this.filePath = filePath;
        this.name = name;
        this.members = members;
    }
    /**
     * @return {?}
     */
    assertNoMembers() {
        if (this.members.length) {
            throw new Error(`Illegal state: symbol without members expected, but got ${JSON.stringify(this)}.`);
        }
    }
}
/**
 * A cache of static symbol used by the StaticReflector to return the same symbol for the
 * same symbol values.
 */
class StaticSymbolCache {
    constructor() {
        this.cache = new Map();
    }
    /**
     * @param {?} declarationFile
     * @param {?} name
     * @param {?=} members
     * @return {?}
     */
    get(declarationFile, name, members) {
        members = members || [];
        const /** @type {?} */ memberSuffix = members.length ? `.${members.join('.')}` : '';
        const /** @type {?} */ key = `"${declarationFile}".${name}${memberSuffix}`;
        let /** @type {?} */ result = this.cache.get(key);
        if (!result) {
            result = new StaticSymbol(declarationFile, name, members);
            this.cache.set(key, result);
        }
        return result;
    }
}

let TagContentType = {};
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
    const /** @type {?} */ colonIndex = elementName.indexOf(':', 1);
    if (colonIndex == -1) {
        throw new Error(`Unsupported format "${elementName}" expecting ":namespace:name"`);
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
    return prefix ? `:${prefix}:${localName}` : localName;
}
// see http://www.w3.org/TR/html51/syntax.html#named-character-references
// see https://html.spec.whatwg.org/multipage/entities.json
// This list is not exhaustive to keep the compiler footprint low.
// The `&#123;` / `&#x1ab;` syntax should be used when the named character reference does not
// exist.
const NAMED_ENTITIES = {
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
class HtmlTagDefinition {
    /**
     * @param {?=} __0
     */
    constructor({ closedByChildren, requiredParents, implicitNamespacePrefix, contentType = TagContentType.PARSABLE_DATA, closedByParent = false, isVoid = false, ignoreFirstLf = false } = {}) {
        this.closedByChildren = {};
        this.closedByParent = false;
        this.canSelfClose = false;
        if (closedByChildren && closedByChildren.length > 0) {
            closedByChildren.forEach(tagName => this.closedByChildren[tagName] = true);
        }
        this.isVoid = isVoid;
        this.closedByParent = closedByParent || isVoid;
        if (requiredParents && requiredParents.length > 0) {
            this.requiredParents = {};
            // The first parent is the list is automatically when none of the listed parents are present
            this.parentToAdd = requiredParents[0];
            requiredParents.forEach(tagName => this.requiredParents[tagName] = true);
        }
        this.implicitNamespacePrefix = implicitNamespacePrefix || null;
        this.contentType = contentType;
        this.ignoreFirstLf = ignoreFirstLf;
    }
    /**
     * @param {?} currentParent
     * @return {?}
     */
    requireExtraParent(currentParent) {
        if (!this.requiredParents) {
            return false;
        }
        if (!currentParent) {
            return true;
        }
        const /** @type {?} */ lcParent = currentParent.toLowerCase();
        const /** @type {?} */ isParentTemplate = lcParent === 'template' || currentParent === 'ng-template';
        return !isParentTemplate && this.requiredParents[lcParent] != true;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    isClosedByChild(name) {
        return this.isVoid || name.toLowerCase() in this.closedByChildren;
    }
}
// see http://www.w3.org/TR/html51/syntax.html#optional-tags
// This implementation does not fully conform to the HTML5 spec.
const TAG_DEFINITIONS = {
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
const _DEFAULT_TAG_DEFINITION = new HtmlTagDefinition();
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
const _SELECTOR_REGEXP = new RegExp('(\\:not\\()|' +
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
class CssSelector {
    constructor() {
        this.element = null;
        this.classNames = [];
        this.attrs = [];
        this.notSelectors = [];
    }
    /**
     * @param {?} selector
     * @return {?}
     */
    static parse(selector) {
        const /** @type {?} */ results = [];
        const /** @type {?} */ _addResult = (res, cssSel) => {
            if (cssSel.notSelectors.length > 0 && !cssSel.element && cssSel.classNames.length == 0 &&
                cssSel.attrs.length == 0) {
                cssSel.element = '*';
            }
            res.push(cssSel);
        };
        let /** @type {?} */ cssSelector = new CssSelector();
        let /** @type {?} */ match;
        let /** @type {?} */ current = cssSelector;
        let /** @type {?} */ inNot = false;
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
    }
    /**
     * @return {?}
     */
    isElementSelector() {
        return this.hasElementSelector() && this.classNames.length == 0 && this.attrs.length == 0 &&
            this.notSelectors.length === 0;
    }
    /**
     * @return {?}
     */
    hasElementSelector() { return !!this.element; }
    /**
     * @param {?=} element
     * @return {?}
     */
    setElement(element = null) { this.element = element; }
    /**
     * Gets a template string for an element that matches the selector.
     * @return {?}
     */
    getMatchingElementTemplate() {
        const /** @type {?} */ tagName = this.element || 'div';
        const /** @type {?} */ classAttr = this.classNames.length > 0 ? ` class="${this.classNames.join(' ')}"` : '';
        let /** @type {?} */ attrs = '';
        for (let /** @type {?} */ i = 0; i < this.attrs.length; i += 2) {
            const /** @type {?} */ attrName = this.attrs[i];
            const /** @type {?} */ attrValue = this.attrs[i + 1] !== '' ? `="${this.attrs[i + 1]}"` : '';
            attrs += ` ${attrName}${attrValue}`;
        }
        return getHtmlTagDefinition(tagName).isVoid ? `<${tagName}${classAttr}${attrs}/>` :
            `<${tagName}${classAttr}${attrs}></${tagName}>`;
    }
    /**
     * @param {?} name
     * @param {?=} value
     * @return {?}
     */
    addAttribute(name, value = '') {
        this.attrs.push(name, value && value.toLowerCase() || '');
    }
    /**
     * @param {?} name
     * @return {?}
     */
    addClassName(name) { this.classNames.push(name.toLowerCase()); }
    /**
     * @return {?}
     */
    toString() {
        let /** @type {?} */ res = this.element || '';
        if (this.classNames) {
            this.classNames.forEach(klass => res += `.${klass}`);
        }
        if (this.attrs) {
            for (let /** @type {?} */ i = 0; i < this.attrs.length; i += 2) {
                const /** @type {?} */ name = this.attrs[i];
                const /** @type {?} */ value = this.attrs[i + 1];
                res += `[${name}${value ? '=' + value : ''}]`;
            }
        }
        this.notSelectors.forEach(notSelector => res += `:not(${notSelector})`);
        return res;
    }
}
/**
 * Reads a list of CssSelectors and allows to calculate which ones
 * are contained in a given CssSelector.
 */
class SelectorMatcher {
    constructor() {
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
    static createNotMatcher(notSelectors) {
        const /** @type {?} */ notMatcher = new SelectorMatcher();
        notMatcher.addSelectables(notSelectors, null);
        return notMatcher;
    }
    /**
     * @param {?} cssSelectors
     * @param {?=} callbackCtxt
     * @return {?}
     */
    addSelectables(cssSelectors, callbackCtxt) {
        let /** @type {?} */ listContext = ((null));
        if (cssSelectors.length > 1) {
            listContext = new SelectorListContext(cssSelectors);
            this._listContexts.push(listContext);
        }
        for (let /** @type {?} */ i = 0; i < cssSelectors.length; i++) {
            this._addSelectable(cssSelectors[i], callbackCtxt, listContext);
        }
    }
    /**
     * Add an object that can be found later on by calling `match`.
     * @param {?} cssSelector A css selector
     * @param {?} callbackCtxt An opaque object that will be given to the callback of the `match` function
     * @param {?} listContext
     * @return {?}
     */
    _addSelectable(cssSelector, callbackCtxt, listContext) {
        let /** @type {?} */ matcher = this;
        const /** @type {?} */ element = cssSelector.element;
        const /** @type {?} */ classNames = cssSelector.classNames;
        const /** @type {?} */ attrs = cssSelector.attrs;
        const /** @type {?} */ selectable = new SelectorContext(cssSelector, callbackCtxt, listContext);
        if (element) {
            const /** @type {?} */ isTerminal = attrs.length === 0 && classNames.length === 0;
            if (isTerminal) {
                this._addTerminal(matcher._elementMap, element, selectable);
            }
            else {
                matcher = this._addPartial(matcher._elementPartialMap, element);
            }
        }
        if (classNames) {
            for (let /** @type {?} */ i = 0; i < classNames.length; i++) {
                const /** @type {?} */ isTerminal = attrs.length === 0 && i === classNames.length - 1;
                const /** @type {?} */ className = classNames[i];
                if (isTerminal) {
                    this._addTerminal(matcher._classMap, className, selectable);
                }
                else {
                    matcher = this._addPartial(matcher._classPartialMap, className);
                }
            }
        }
        if (attrs) {
            for (let /** @type {?} */ i = 0; i < attrs.length; i += 2) {
                const /** @type {?} */ isTerminal = i === attrs.length - 2;
                const /** @type {?} */ name = attrs[i];
                const /** @type {?} */ value = attrs[i + 1];
                if (isTerminal) {
                    const /** @type {?} */ terminalMap = matcher._attrValueMap;
                    let /** @type {?} */ terminalValuesMap = terminalMap.get(name);
                    if (!terminalValuesMap) {
                        terminalValuesMap = new Map();
                        terminalMap.set(name, terminalValuesMap);
                    }
                    this._addTerminal(terminalValuesMap, value, selectable);
                }
                else {
                    const /** @type {?} */ partialMap = matcher._attrValuePartialMap;
                    let /** @type {?} */ partialValuesMap = partialMap.get(name);
                    if (!partialValuesMap) {
                        partialValuesMap = new Map();
                        partialMap.set(name, partialValuesMap);
                    }
                    matcher = this._addPartial(partialValuesMap, value);
                }
            }
        }
    }
    /**
     * @param {?} map
     * @param {?} name
     * @param {?} selectable
     * @return {?}
     */
    _addTerminal(map, name, selectable) {
        let /** @type {?} */ terminalList = map.get(name);
        if (!terminalList) {
            terminalList = [];
            map.set(name, terminalList);
        }
        terminalList.push(selectable);
    }
    /**
     * @param {?} map
     * @param {?} name
     * @return {?}
     */
    _addPartial(map, name) {
        let /** @type {?} */ matcher = map.get(name);
        if (!matcher) {
            matcher = new SelectorMatcher();
            map.set(name, matcher);
        }
        return matcher;
    }
    /**
     * Find the objects that have been added via `addSelectable`
     * whose css selector is contained in the given css selector.
     * @param {?} cssSelector A css selector
     * @param {?} matchedCallback This callback will be called with the object handed into `addSelectable`
     * @return {?} boolean true if a match was found
     */
    match(cssSelector, matchedCallback) {
        let /** @type {?} */ result = false;
        const /** @type {?} */ element = ((cssSelector.element));
        const /** @type {?} */ classNames = cssSelector.classNames;
        const /** @type {?} */ attrs = cssSelector.attrs;
        for (let /** @type {?} */ i = 0; i < this._listContexts.length; i++) {
            this._listContexts[i].alreadyMatched = false;
        }
        result = this._matchTerminal(this._elementMap, element, cssSelector, matchedCallback) || result;
        result = this._matchPartial(this._elementPartialMap, element, cssSelector, matchedCallback) ||
            result;
        if (classNames) {
            for (let /** @type {?} */ i = 0; i < classNames.length; i++) {
                const /** @type {?} */ className = classNames[i];
                result =
                    this._matchTerminal(this._classMap, className, cssSelector, matchedCallback) || result;
                result =
                    this._matchPartial(this._classPartialMap, className, cssSelector, matchedCallback) ||
                        result;
            }
        }
        if (attrs) {
            for (let /** @type {?} */ i = 0; i < attrs.length; i += 2) {
                const /** @type {?} */ name = attrs[i];
                const /** @type {?} */ value = attrs[i + 1];
                const /** @type {?} */ terminalValuesMap = ((this._attrValueMap.get(name)));
                if (value) {
                    result =
                        this._matchTerminal(terminalValuesMap, '', cssSelector, matchedCallback) || result;
                }
                result =
                    this._matchTerminal(terminalValuesMap, value, cssSelector, matchedCallback) || result;
                const /** @type {?} */ partialValuesMap = ((this._attrValuePartialMap.get(name)));
                if (value) {
                    result = this._matchPartial(partialValuesMap, '', cssSelector, matchedCallback) || result;
                }
                result =
                    this._matchPartial(partialValuesMap, value, cssSelector, matchedCallback) || result;
            }
        }
        return result;
    }
    /**
     * \@internal
     * @param {?} map
     * @param {?} name
     * @param {?} cssSelector
     * @param {?} matchedCallback
     * @return {?}
     */
    _matchTerminal(map, name, cssSelector, matchedCallback) {
        if (!map || typeof name !== 'string') {
            return false;
        }
        let /** @type {?} */ selectables = map.get(name) || [];
        const /** @type {?} */ starSelectables = ((map.get('*')));
        if (starSelectables) {
            selectables = selectables.concat(starSelectables);
        }
        if (selectables.length === 0) {
            return false;
        }
        let /** @type {?} */ selectable;
        let /** @type {?} */ result = false;
        for (let /** @type {?} */ i = 0; i < selectables.length; i++) {
            selectable = selectables[i];
            result = selectable.finalize(cssSelector, matchedCallback) || result;
        }
        return result;
    }
    /**
     * \@internal
     * @param {?} map
     * @param {?} name
     * @param {?} cssSelector
     * @param {?} matchedCallback
     * @return {?}
     */
    _matchPartial(map, name, cssSelector, matchedCallback) {
        if (!map || typeof name !== 'string') {
            return false;
        }
        const /** @type {?} */ nestedSelector = map.get(name);
        if (!nestedSelector) {
            return false;
        }
        // TODO(perf): get rid of recursion and measure again
        // TODO(perf): don't pass the whole selector into the recursion,
        // but only the not processed parts
        return nestedSelector.match(cssSelector, matchedCallback);
    }
}
class SelectorListContext {
    /**
     * @param {?} selectors
     */
    constructor(selectors) {
        this.selectors = selectors;
        this.alreadyMatched = false;
    }
}
class SelectorContext {
    /**
     * @param {?} selector
     * @param {?} cbContext
     * @param {?} listContext
     */
    constructor(selector, cbContext, listContext) {
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
    finalize(cssSelector, callback) {
        let /** @type {?} */ result = true;
        if (this.notSelectors.length > 0 && (!this.listContext || !this.listContext.alreadyMatched)) {
            const /** @type {?} */ notMatcher = SelectorMatcher.createNotMatcher(this.notSelectors);
            result = !notMatcher.match(cssSelector, null);
        }
        if (result && callback && (!this.listContext || !this.listContext.alreadyMatched)) {
            if (this.listContext) {
                this.listContext.alreadyMatched = true;
            }
            callback(this.selector, this.cbContext);
        }
        return result;
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const MODULE_SUFFIX = '';
const DASH_CASE_REGEXP = /-+([a-z0-9])/g;
/**
 * @param {?} input
 * @return {?}
 */

/**
 * @param {?} input
 * @return {?}
 */
function dashCaseToCamelCase(input) {
    return input.replace(DASH_CASE_REGEXP, (...m) => m[1].toUpperCase());
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
    const /** @type {?} */ characterIndex = input.indexOf(character);
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
class ValueTransformer {
    /**
     * @param {?} arr
     * @param {?} context
     * @return {?}
     */
    visitArray(arr, context) {
        return arr.map(value => visitValue(value, this, context));
    }
    /**
     * @param {?} map
     * @param {?} context
     * @return {?}
     */
    visitStringMap(map, context) {
        const /** @type {?} */ result = {};
        Object.keys(map).forEach(key => { result[key] = visitValue(map[key], this, context); });
        return result;
    }
    /**
     * @param {?} value
     * @param {?} context
     * @return {?}
     */
    visitPrimitive(value, context) { return value; }
    /**
     * @param {?} value
     * @param {?} context
     * @return {?}
     */
    visitOther(value, context) { return value; }
}
class SyncAsyncResult {
    /**
     * @param {?} syncResult
     * @param {?=} asyncResult
     */
    constructor(syncResult, asyncResult = null) {
        this.syncResult = syncResult;
        this.asyncResult = asyncResult;
        if (!asyncResult) {
            this.asyncResult = Promise.resolve(syncResult);
        }
    }
}
/**
 * @param {?} msg
 * @return {?}
 */
function syntaxError(msg) {
    const /** @type {?} */ error = Error(msg);
    ((error))[ERROR_SYNTAX_ERROR] = true;
    return error;
}
const ERROR_SYNTAX_ERROR = 'ngSyntaxError';
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
const STRING_MAP_PROTO = Object.getPrototypeOf({});
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
    let /** @type {?} */ encoded = '';
    for (let /** @type {?} */ index = 0; index < str.length; index++) {
        let /** @type {?} */ codePoint = str.charCodeAt(index);
        // decode surrogate
        // see https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        if (codePoint >= 0xd800 && codePoint <= 0xdbff && str.length > (index + 1)) {
            const /** @type {?} */ low = str.charCodeAt(index + 1);
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
const HOST_REG_EXP = /^(?:(?:\[([^\]]+)\])|(?:\(([^\)]+)\)))|(\@[-\w]+)$/;
class CompileAnimationEntryMetadata {
    /**
     * @param {?=} name
     * @param {?=} definitions
     */
    constructor(name = null, definitions = null) {
        this.name = name;
        this.definitions = definitions;
    }
}
/**
 * @abstract
 */
class CompileAnimationStateMetadata {
}
class CompileAnimationStateDeclarationMetadata extends CompileAnimationStateMetadata {
    /**
     * @param {?} stateNameExpr
     * @param {?} styles
     */
    constructor(stateNameExpr, styles) {
        super();
        this.stateNameExpr = stateNameExpr;
        this.styles = styles;
    }
}
class CompileAnimationStateTransitionMetadata extends CompileAnimationStateMetadata {
    /**
     * @param {?} stateChangeExpr
     * @param {?} steps
     */
    constructor(stateChangeExpr, steps) {
        super();
        this.stateChangeExpr = stateChangeExpr;
        this.steps = steps;
    }
}
/**
 * @abstract
 */
class CompileAnimationMetadata {
}
class CompileAnimationKeyframesSequenceMetadata extends CompileAnimationMetadata {
    /**
     * @param {?=} steps
     */
    constructor(steps = []) {
        super();
        this.steps = steps;
    }
}
class CompileAnimationStyleMetadata extends CompileAnimationMetadata {
    /**
     * @param {?} offset
     * @param {?=} styles
     */
    constructor(offset, styles = null) {
        super();
        this.offset = offset;
        this.styles = styles;
    }
}
class CompileAnimationAnimateMetadata extends CompileAnimationMetadata {
    /**
     * @param {?=} timings
     * @param {?=} styles
     */
    constructor(timings = 0, styles = null) {
        super();
        this.timings = timings;
        this.styles = styles;
    }
}
/**
 * @abstract
 */
class CompileAnimationWithStepsMetadata extends CompileAnimationMetadata {
    /**
     * @param {?=} steps
     */
    constructor(steps = null) {
        super();
        this.steps = steps;
    }
}
class CompileAnimationSequenceMetadata extends CompileAnimationWithStepsMetadata {
    /**
     * @param {?=} steps
     */
    constructor(steps = null) { super(steps); }
}
class CompileAnimationGroupMetadata extends CompileAnimationWithStepsMetadata {
    /**
     * @param {?=} steps
     */
    constructor(steps = null) { super(steps); }
}
/**
 * @param {?} name
 * @return {?}
 */
function _sanitizeIdentifier(name) {
    return name.replace(/\W/g, '_');
}
let _anonymousTypeIndex = 0;
/**
 * @param {?} compileIdentifier
 * @return {?}
 */
function identifierName(compileIdentifier) {
    if (!compileIdentifier || !compileIdentifier.reference) {
        return null;
    }
    const /** @type {?} */ ref = compileIdentifier.reference;
    if (ref instanceof StaticSymbol) {
        return ref.name;
    }
    if (ref['__anonymousType']) {
        return ref['__anonymousType'];
    }
    let /** @type {?} */ identifier = ɵstringify(ref);
    if (identifier.indexOf('(') >= 0) {
        // case: anonymous functions!
        identifier = `anonymous_${_anonymousTypeIndex++}`;
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
    const /** @type {?} */ ref = compileIdentifier.reference;
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
    return `View_${identifierName({ reference: compType })}_${embeddedTemplateIndex}`;
}
/**
 * @param {?} compType
 * @return {?}
 */
function rendererTypeName(compType) {
    return `RenderType_${identifierName({ reference: compType })}`;
}
/**
 * @param {?} compType
 * @return {?}
 */
function hostViewClassName(compType) {
    return `HostView_${identifierName({ reference: compType })}`;
}
/**
 * @param {?} dirType
 * @return {?}
 */
function dirWrapperClassName(dirType) {
    return `Wrapper_${identifierName({ reference: dirType })}`;
}
/**
 * @param {?} compType
 * @return {?}
 */
function componentFactoryName(compType) {
    return `${identifierName({ reference: compType })}NgFactory`;
}
let CompileSummaryKind = {};
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
class CompileStylesheetMetadata {
    /**
     * @param {?=} __0
     */
    constructor({ moduleUrl, styles, styleUrls } = {}) {
        this.moduleUrl = moduleUrl || null;
        this.styles = _normalizeArray(styles);
        this.styleUrls = _normalizeArray(styleUrls);
    }
}
/**
 * Metadata regarding compilation of a template.
 */
class CompileTemplateMetadata {
    /**
     * @param {?} __0
     */
    constructor({ encapsulation, template, templateUrl, styles, styleUrls, externalStylesheets, animations, ngContentSelectors, interpolation, isInline }) {
        this.encapsulation = encapsulation;
        this.template = template;
        this.templateUrl = templateUrl;
        this.styles = _normalizeArray(styles);
        this.styleUrls = _normalizeArray(styleUrls);
        this.externalStylesheets = _normalizeArray(externalStylesheets);
        this.animations = animations ? flatten(animations) : [];
        this.ngContentSelectors = ngContentSelectors || [];
        if (interpolation && interpolation.length != 2) {
            throw new Error(`'interpolation' should have a start and an end symbol.`);
        }
        this.interpolation = interpolation;
        this.isInline = isInline;
    }
    /**
     * @return {?}
     */
    toSummary() {
        return {
            animations: this.animations.map(anim => anim.name),
            ngContentSelectors: this.ngContentSelectors,
            encapsulation: this.encapsulation,
        };
    }
}
/**
 * Metadata regarding compilation of a directive.
 */
class CompileDirectiveMetadata {
    /**
     * @param {?} __0
     * @return {?}
     */
    static create({ isHost, type, isComponent, selector, exportAs, changeDetection, inputs, outputs, host, providers, viewProviders, queries, viewQueries, entryComponents, template, componentViewType, rendererType, componentFactory }) {
        const /** @type {?} */ hostListeners = {};
        const /** @type {?} */ hostProperties = {};
        const /** @type {?} */ hostAttributes = {};
        if (host != null) {
            Object.keys(host).forEach(key => {
                const /** @type {?} */ value = host[key];
                const /** @type {?} */ matches = key.match(HOST_REG_EXP);
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
        const /** @type {?} */ inputsMap = {};
        if (inputs != null) {
            inputs.forEach((bindConfig) => {
                // canonical syntax: `dirProp: elProp`
                // if there is no `:`, use dirProp = elProp
                const /** @type {?} */ parts = splitAtColon(bindConfig, [bindConfig, bindConfig]);
                inputsMap[parts[0]] = parts[1];
            });
        }
        const /** @type {?} */ outputsMap = {};
        if (outputs != null) {
            outputs.forEach((bindConfig) => {
                // canonical syntax: `dirProp: elProp`
                // if there is no `:`, use dirProp = elProp
                const /** @type {?} */ parts = splitAtColon(bindConfig, [bindConfig, bindConfig]);
                outputsMap[parts[0]] = parts[1];
            });
        }
        return new CompileDirectiveMetadata({
            isHost,
            type,
            isComponent: !!isComponent, selector, exportAs, changeDetection,
            inputs: inputsMap,
            outputs: outputsMap,
            hostListeners,
            hostProperties,
            hostAttributes,
            providers,
            viewProviders,
            queries,
            viewQueries,
            entryComponents,
            template,
            componentViewType,
            rendererType,
            componentFactory,
        });
    }
    /**
     * @param {?} __0
     */
    constructor({ isHost, type, isComponent, selector, exportAs, changeDetection, inputs, outputs, hostListeners, hostProperties, hostAttributes, providers, viewProviders, queries, viewQueries, entryComponents, template, componentViewType, rendererType, componentFactory }) {
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
     * @return {?}
     */
    toSummary() {
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
    }
}
/**
 * Construct {\@link CompileDirectiveMetadata} from {\@link ComponentTypeMetadata} and a selector.
 * @param {?} hostTypeReference
 * @param {?} compMeta
 * @param {?} hostViewType
 * @return {?}
 */
function createHostComponentMeta(hostTypeReference, compMeta, hostViewType) {
    const /** @type {?} */ template = CssSelector.parse(/** @type {?} */ ((compMeta.selector)))[0].getMatchingElementTemplate();
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
class CompilePipeMetadata {
    /**
     * @param {?} __0
     */
    constructor({ type, name, pure }) {
        this.type = type;
        this.name = name;
        this.pure = !!pure;
    }
    /**
     * @return {?}
     */
    toSummary() {
        return {
            summaryKind: CompileSummaryKind.Pipe,
            type: this.type,
            name: this.name,
            pure: this.pure
        };
    }
}
/**
 * Metadata regarding compilation of a module.
 */
class CompileNgModuleMetadata {
    /**
     * @param {?} __0
     */
    constructor({ type, providers, declaredDirectives, exportedDirectives, declaredPipes, exportedPipes, entryComponents, bootstrapComponents, importedModules, exportedModules, schemas, transitiveModule, id }) {
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
    toSummary() {
        const /** @type {?} */ module = ((this.transitiveModule));
        return {
            summaryKind: CompileSummaryKind.NgModule,
            type: this.type,
            entryComponents: module.entryComponents,
            providers: module.providers,
            modules: module.modules,
            exportedDirectives: module.exportedDirectives,
            exportedPipes: module.exportedPipes
        };
    }
}
class TransitiveCompileNgModuleMetadata {
    constructor() {
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
    addProvider(provider, module) {
        this.providers.push({ provider: provider, module: module });
    }
    /**
     * @param {?} id
     * @return {?}
     */
    addDirective(id) {
        if (!this.directivesSet.has(id.reference)) {
            this.directivesSet.add(id.reference);
            this.directives.push(id);
        }
    }
    /**
     * @param {?} id
     * @return {?}
     */
    addExportedDirective(id) {
        if (!this.exportedDirectivesSet.has(id.reference)) {
            this.exportedDirectivesSet.add(id.reference);
            this.exportedDirectives.push(id);
        }
    }
    /**
     * @param {?} id
     * @return {?}
     */
    addPipe(id) {
        if (!this.pipesSet.has(id.reference)) {
            this.pipesSet.add(id.reference);
            this.pipes.push(id);
        }
    }
    /**
     * @param {?} id
     * @return {?}
     */
    addExportedPipe(id) {
        if (!this.exportedPipesSet.has(id.reference)) {
            this.exportedPipesSet.add(id.reference);
            this.exportedPipes.push(id);
        }
    }
    /**
     * @param {?} id
     * @return {?}
     */
    addModule(id) {
        if (!this.modulesSet.has(id.reference)) {
            this.modulesSet.add(id.reference);
            this.modules.push(id);
        }
    }
    /**
     * @param {?} ec
     * @return {?}
     */
    addEntryComponent(ec) {
        if (!this.entryComponentsSet.has(ec.componentType)) {
            this.entryComponentsSet.add(ec.componentType);
            this.entryComponents.push(ec);
        }
    }
}
/**
 * @param {?} obj
 * @return {?}
 */
function _normalizeArray(obj) {
    return obj || [];
}
class ProviderMeta {
    /**
     * @param {?} token
     * @param {?} __1
     */
    constructor(token, { useClass, useValue, useExisting, useFactory, deps, multi }) {
        this.token = token;
        this.useClass = useClass || null;
        this.useValue = useValue;
        this.useExisting = useExisting;
        this.useFactory = useFactory || null;
        this.dependencies = deps || null;
        this.multi = !!multi;
    }
}
/**
 * @template T
 * @param {?} list
 * @return {?}
 */
function flatten(list) {
    return list.reduce((flat, item) => {
        const /** @type {?} */ flatItem = Array.isArray(item) ? flatten(item) : item;
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
    let /** @type {?} */ url;
    if (templateMeta.isInline) {
        if (compMeta.type.reference instanceof StaticSymbol) {
            // Note: a .ts file might contain multiple components with inline templates,
            // so we need to give them unique urls, as these will be used for sourcemaps.
            url = `${compMeta.type.reference.filePath}.${compMeta.type.reference.name}.html`;
        }
        else {
            url = `${identifierName(ngModuleType)}/${identifierName(compMeta.type)}.html`;
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
    const /** @type {?} */ pathParts = ((meta.moduleUrl)).split(/\/\\/g);
    const /** @type {?} */ baseName = pathParts[pathParts.length - 1];
    return sourceUrl(`css/${id}${baseName}.ngstyle.js`);
}
/**
 * @param {?} moduleMeta
 * @return {?}
 */
function ngModuleJitUrl(moduleMeta) {
    return sourceUrl(`${identifierName(moduleMeta.type)}/module.ngfactory.js`);
}
/**
 * @param {?} ngModuleType
 * @param {?} compMeta
 * @return {?}
 */
function templateJitUrl(ngModuleType, compMeta) {
    return sourceUrl(`${identifierName(ngModuleType)}/${identifierName(compMeta.type)}.ngfactory.js`);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class CompilerConfig {
    /**
     * @param {?=} __0
     */
    constructor({ defaultEncapsulation = ViewEncapsulation.Emulated, useJit = true, missingTranslation, enableLegacyTemplate } = {}) {
        this.defaultEncapsulation = defaultEncapsulation;
        this.useJit = !!useJit;
        this.missingTranslation = missingTranslation || null;
        this.enableLegacyTemplate = enableLegacyTemplate !== false;
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class ParserError {
    /**
     * @param {?} message
     * @param {?} input
     * @param {?} errLocation
     * @param {?=} ctxLocation
     */
    constructor(message, input, errLocation, ctxLocation) {
        this.input = input;
        this.errLocation = errLocation;
        this.ctxLocation = ctxLocation;
        this.message = `Parser Error: ${message} ${errLocation} [${input}] in ${ctxLocation}`;
    }
}
class ParseSpan {
    /**
     * @param {?} start
     * @param {?} end
     */
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}
class AST {
    /**
     * @param {?} span
     */
    constructor(span) {
        this.span = span;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) { return null; }
    /**
     * @return {?}
     */
    toString() { return 'AST'; }
}
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
class Quote extends AST {
    /**
     * @param {?} span
     * @param {?} prefix
     * @param {?} uninterpretedExpression
     * @param {?} location
     */
    constructor(span, prefix, uninterpretedExpression, location) {
        super(span);
        this.prefix = prefix;
        this.uninterpretedExpression = uninterpretedExpression;
        this.location = location;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) { return visitor.visitQuote(this, context); }
    /**
     * @return {?}
     */
    toString() { return 'Quote'; }
}
class EmptyExpr extends AST {
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        // do nothing
    }
}
class ImplicitReceiver extends AST {
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitImplicitReceiver(this, context);
    }
}
/**
 * Multiple expressions separated by a semicolon.
 */
class Chain extends AST {
    /**
     * @param {?} span
     * @param {?} expressions
     */
    constructor(span, expressions) {
        super(span);
        this.expressions = expressions;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) { return visitor.visitChain(this, context); }
}
class Conditional extends AST {
    /**
     * @param {?} span
     * @param {?} condition
     * @param {?} trueExp
     * @param {?} falseExp
     */
    constructor(span, condition, trueExp, falseExp) {
        super(span);
        this.condition = condition;
        this.trueExp = trueExp;
        this.falseExp = falseExp;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitConditional(this, context);
    }
}
class PropertyRead extends AST {
    /**
     * @param {?} span
     * @param {?} receiver
     * @param {?} name
     */
    constructor(span, receiver, name) {
        super(span);
        this.receiver = receiver;
        this.name = name;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitPropertyRead(this, context);
    }
}
class PropertyWrite extends AST {
    /**
     * @param {?} span
     * @param {?} receiver
     * @param {?} name
     * @param {?} value
     */
    constructor(span, receiver, name, value) {
        super(span);
        this.receiver = receiver;
        this.name = name;
        this.value = value;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitPropertyWrite(this, context);
    }
}
class SafePropertyRead extends AST {
    /**
     * @param {?} span
     * @param {?} receiver
     * @param {?} name
     */
    constructor(span, receiver, name) {
        super(span);
        this.receiver = receiver;
        this.name = name;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitSafePropertyRead(this, context);
    }
}
class KeyedRead extends AST {
    /**
     * @param {?} span
     * @param {?} obj
     * @param {?} key
     */
    constructor(span, obj, key) {
        super(span);
        this.obj = obj;
        this.key = key;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitKeyedRead(this, context);
    }
}
class KeyedWrite extends AST {
    /**
     * @param {?} span
     * @param {?} obj
     * @param {?} key
     * @param {?} value
     */
    constructor(span, obj, key, value) {
        super(span);
        this.obj = obj;
        this.key = key;
        this.value = value;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitKeyedWrite(this, context);
    }
}
class BindingPipe extends AST {
    /**
     * @param {?} span
     * @param {?} exp
     * @param {?} name
     * @param {?} args
     */
    constructor(span, exp, name, args) {
        super(span);
        this.exp = exp;
        this.name = name;
        this.args = args;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) { return visitor.visitPipe(this, context); }
}
class LiteralPrimitive extends AST {
    /**
     * @param {?} span
     * @param {?} value
     */
    constructor(span, value) {
        super(span);
        this.value = value;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitLiteralPrimitive(this, context);
    }
}
class LiteralArray extends AST {
    /**
     * @param {?} span
     * @param {?} expressions
     */
    constructor(span, expressions) {
        super(span);
        this.expressions = expressions;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitLiteralArray(this, context);
    }
}
class LiteralMap extends AST {
    /**
     * @param {?} span
     * @param {?} keys
     * @param {?} values
     */
    constructor(span, keys, values) {
        super(span);
        this.keys = keys;
        this.values = values;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitLiteralMap(this, context);
    }
}
class Interpolation extends AST {
    /**
     * @param {?} span
     * @param {?} strings
     * @param {?} expressions
     */
    constructor(span, strings, expressions) {
        super(span);
        this.strings = strings;
        this.expressions = expressions;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitInterpolation(this, context);
    }
}
class Binary extends AST {
    /**
     * @param {?} span
     * @param {?} operation
     * @param {?} left
     * @param {?} right
     */
    constructor(span, operation, left, right) {
        super(span);
        this.operation = operation;
        this.left = left;
        this.right = right;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitBinary(this, context);
    }
}
class PrefixNot extends AST {
    /**
     * @param {?} span
     * @param {?} expression
     */
    constructor(span, expression) {
        super(span);
        this.expression = expression;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitPrefixNot(this, context);
    }
}
class MethodCall extends AST {
    /**
     * @param {?} span
     * @param {?} receiver
     * @param {?} name
     * @param {?} args
     */
    constructor(span, receiver, name, args) {
        super(span);
        this.receiver = receiver;
        this.name = name;
        this.args = args;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitMethodCall(this, context);
    }
}
class SafeMethodCall extends AST {
    /**
     * @param {?} span
     * @param {?} receiver
     * @param {?} name
     * @param {?} args
     */
    constructor(span, receiver, name, args) {
        super(span);
        this.receiver = receiver;
        this.name = name;
        this.args = args;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitSafeMethodCall(this, context);
    }
}
class FunctionCall extends AST {
    /**
     * @param {?} span
     * @param {?} target
     * @param {?} args
     */
    constructor(span, target, args) {
        super(span);
        this.target = target;
        this.args = args;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitFunctionCall(this, context);
    }
}
class ASTWithSource extends AST {
    /**
     * @param {?} ast
     * @param {?} source
     * @param {?} location
     * @param {?} errors
     */
    constructor(ast, source, location, errors) {
        super(new ParseSpan(0, source == null ? 0 : source.length));
        this.ast = ast;
        this.source = source;
        this.location = location;
        this.errors = errors;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) { return this.ast.visit(visitor, context); }
    /**
     * @return {?}
     */
    toString() { return `${this.source} in ${this.location}`; }
}
class TemplateBinding {
    /**
     * @param {?} span
     * @param {?} key
     * @param {?} keyIsVar
     * @param {?} name
     * @param {?} expression
     */
    constructor(span, key, keyIsVar, name, expression) {
        this.span = span;
        this.key = key;
        this.keyIsVar = keyIsVar;
        this.name = name;
        this.expression = expression;
    }
}
class RecursiveAstVisitor {
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitBinary(ast, context) {
        ast.left.visit(this);
        ast.right.visit(this);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitChain(ast, context) { return this.visitAll(ast.expressions, context); }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitConditional(ast, context) {
        ast.condition.visit(this);
        ast.trueExp.visit(this);
        ast.falseExp.visit(this);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPipe(ast, context) {
        ast.exp.visit(this);
        this.visitAll(ast.args, context);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitFunctionCall(ast, context) {
        ((ast.target)).visit(this);
        this.visitAll(ast.args, context);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitImplicitReceiver(ast, context) { return null; }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitInterpolation(ast, context) {
        return this.visitAll(ast.expressions, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitKeyedRead(ast, context) {
        ast.obj.visit(this);
        ast.key.visit(this);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitKeyedWrite(ast, context) {
        ast.obj.visit(this);
        ast.key.visit(this);
        ast.value.visit(this);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralArray(ast, context) {
        return this.visitAll(ast.expressions, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralMap(ast, context) { return this.visitAll(ast.values, context); }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralPrimitive(ast, context) { return null; }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitMethodCall(ast, context) {
        ast.receiver.visit(this);
        return this.visitAll(ast.args, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPrefixNot(ast, context) {
        ast.expression.visit(this);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPropertyRead(ast, context) {
        ast.receiver.visit(this);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPropertyWrite(ast, context) {
        ast.receiver.visit(this);
        ast.value.visit(this);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitSafePropertyRead(ast, context) {
        ast.receiver.visit(this);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitSafeMethodCall(ast, context) {
        ast.receiver.visit(this);
        return this.visitAll(ast.args, context);
    }
    /**
     * @param {?} asts
     * @param {?} context
     * @return {?}
     */
    visitAll(asts, context) {
        asts.forEach(ast => ast.visit(this, context));
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitQuote(ast, context) { return null; }
}
class AstTransformer {
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitImplicitReceiver(ast, context) { return ast; }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitInterpolation(ast, context) {
        return new Interpolation(ast.span, ast.strings, this.visitAll(ast.expressions));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralPrimitive(ast, context) {
        return new LiteralPrimitive(ast.span, ast.value);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPropertyRead(ast, context) {
        return new PropertyRead(ast.span, ast.receiver.visit(this), ast.name);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPropertyWrite(ast, context) {
        return new PropertyWrite(ast.span, ast.receiver.visit(this), ast.name, ast.value.visit(this));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitSafePropertyRead(ast, context) {
        return new SafePropertyRead(ast.span, ast.receiver.visit(this), ast.name);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitMethodCall(ast, context) {
        return new MethodCall(ast.span, ast.receiver.visit(this), ast.name, this.visitAll(ast.args));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitSafeMethodCall(ast, context) {
        return new SafeMethodCall(ast.span, ast.receiver.visit(this), ast.name, this.visitAll(ast.args));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitFunctionCall(ast, context) {
        return new FunctionCall(ast.span, /** @type {?} */ ((ast.target)).visit(this), this.visitAll(ast.args));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralArray(ast, context) {
        return new LiteralArray(ast.span, this.visitAll(ast.expressions));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralMap(ast, context) {
        return new LiteralMap(ast.span, ast.keys, this.visitAll(ast.values));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitBinary(ast, context) {
        return new Binary(ast.span, ast.operation, ast.left.visit(this), ast.right.visit(this));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPrefixNot(ast, context) {
        return new PrefixNot(ast.span, ast.expression.visit(this));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitConditional(ast, context) {
        return new Conditional(ast.span, ast.condition.visit(this), ast.trueExp.visit(this), ast.falseExp.visit(this));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPipe(ast, context) {
        return new BindingPipe(ast.span, ast.exp.visit(this), ast.name, this.visitAll(ast.args));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitKeyedRead(ast, context) {
        return new KeyedRead(ast.span, ast.obj.visit(this), ast.key.visit(this));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitKeyedWrite(ast, context) {
        return new KeyedWrite(ast.span, ast.obj.visit(this), ast.key.visit(this), ast.value.visit(this));
    }
    /**
     * @param {?} asts
     * @return {?}
     */
    visitAll(asts) {
        const /** @type {?} */ res = new Array(asts.length);
        for (let /** @type {?} */ i = 0; i < asts.length; ++i) {
            res[i] = asts[i].visit(this);
        }
        return res;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitChain(ast, context) {
        return new Chain(ast.span, this.visitAll(ast.expressions));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitQuote(ast, context) {
        return new Quote(ast.span, ast.prefix, ast.uninterpretedExpression, ast.location);
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const $EOF = 0;
const $TAB = 9;
const $LF = 10;
const $VTAB = 11;
const $FF = 12;
const $CR = 13;
const $SPACE = 32;
const $BANG = 33;
const $DQ = 34;
const $HASH = 35;
const $$ = 36;
const $PERCENT = 37;
const $AMPERSAND = 38;
const $SQ = 39;
const $LPAREN = 40;
const $RPAREN = 41;
const $STAR = 42;
const $PLUS = 43;
const $COMMA = 44;
const $MINUS = 45;
const $PERIOD = 46;
const $SLASH = 47;
const $COLON = 58;
const $SEMICOLON = 59;
const $LT = 60;
const $EQ = 61;
const $GT = 62;
const $QUESTION = 63;
const $0 = 48;
const $9 = 57;
const $A = 65;
const $E = 69;
const $F = 70;
const $X = 88;
const $Z = 90;
const $LBRACKET = 91;
const $BACKSLASH = 92;
const $RBRACKET = 93;
const $CARET = 94;
const $_ = 95;
const $a = 97;
const $e = 101;
const $f = 102;
const $n = 110;
const $r = 114;
const $t = 116;
const $u = 117;
const $v = 118;
const $x = 120;
const $z = 122;
const $LBRACE = 123;
const $BAR = 124;
const $RBRACE = 125;
const $NBSP = 160;



const $BT = 96;
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
    return (x) => x;
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
        throw new Error(`Expected '${identifier}' to be an array of strings.`);
    }
    for (let /** @type {?} */ i = 0; i < value.length; i += 1) {
        if (typeof value[i] !== 'string') {
            throw new Error(`Expected '${identifier}' to be an array of strings.`);
        }
    }
}
const INTERPOLATION_BLACKLIST_REGEXPS = [
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
        throw new Error(`Expected '${identifier}' to be an array, [start, end].`);
    }
    else if (isDevMode() && value != null) {
        const /** @type {?} */ start = (value[0]);
        const /** @type {?} */ end = (value[1]);
        // black list checking
        INTERPOLATION_BLACKLIST_REGEXPS.forEach(regexp => {
            if (regexp.test(start) || regexp.test(end)) {
                throw new Error(`['${start}', '${end}'] contains unusable interpolation symbol.`);
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
class InterpolationConfig {
    /**
     * @param {?} start
     * @param {?} end
     */
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
    /**
     * @param {?} markers
     * @return {?}
     */
    static fromArray(markers) {
        if (!markers) {
            return DEFAULT_INTERPOLATION_CONFIG;
        }
        assertInterpolationSymbols('interpolation', markers);
        return new InterpolationConfig(markers[0], markers[1]);
    }
    ;
}
const DEFAULT_INTERPOLATION_CONFIG = new InterpolationConfig('{{', '}}');

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
let TokenType = {};
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
const KEYWORDS = ['var', 'let', 'as', 'null', 'undefined', 'true', 'false', 'if', 'else', 'this'];
class Lexer {
    /**
     * @param {?} text
     * @return {?}
     */
    tokenize(text) {
        const /** @type {?} */ scanner = new _Scanner(text);
        const /** @type {?} */ tokens = [];
        let /** @type {?} */ token = scanner.scanToken();
        while (token != null) {
            tokens.push(token);
            token = scanner.scanToken();
        }
        return tokens;
    }
}
Lexer.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
Lexer.ctorParameters = () => [];
class Token {
    /**
     * @param {?} index
     * @param {?} type
     * @param {?} numValue
     * @param {?} strValue
     */
    constructor(index, type, numValue, strValue) {
        this.index = index;
        this.type = type;
        this.numValue = numValue;
        this.strValue = strValue;
    }
    /**
     * @param {?} code
     * @return {?}
     */
    isCharacter(code) {
        return this.type == TokenType.Character && this.numValue == code;
    }
    /**
     * @return {?}
     */
    isNumber() { return this.type == TokenType.Number; }
    /**
     * @return {?}
     */
    isString() { return this.type == TokenType.String; }
    /**
     * @param {?} operater
     * @return {?}
     */
    isOperator(operater) {
        return this.type == TokenType.Operator && this.strValue == operater;
    }
    /**
     * @return {?}
     */
    isIdentifier() { return this.type == TokenType.Identifier; }
    /**
     * @return {?}
     */
    isKeyword() { return this.type == TokenType.Keyword; }
    /**
     * @return {?}
     */
    isKeywordLet() { return this.type == TokenType.Keyword && this.strValue == 'let'; }
    /**
     * @return {?}
     */
    isKeywordAs() { return this.type == TokenType.Keyword && this.strValue == 'as'; }
    /**
     * @return {?}
     */
    isKeywordNull() { return this.type == TokenType.Keyword && this.strValue == 'null'; }
    /**
     * @return {?}
     */
    isKeywordUndefined() {
        return this.type == TokenType.Keyword && this.strValue == 'undefined';
    }
    /**
     * @return {?}
     */
    isKeywordTrue() { return this.type == TokenType.Keyword && this.strValue == 'true'; }
    /**
     * @return {?}
     */
    isKeywordFalse() { return this.type == TokenType.Keyword && this.strValue == 'false'; }
    /**
     * @return {?}
     */
    isKeywordThis() { return this.type == TokenType.Keyword && this.strValue == 'this'; }
    /**
     * @return {?}
     */
    isError() { return this.type == TokenType.Error; }
    /**
     * @return {?}
     */
    toNumber() { return this.type == TokenType.Number ? this.numValue : -1; }
    /**
     * @return {?}
     */
    toString() {
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
    }
}
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
const EOF = new Token(-1, TokenType.Character, 0, '');
class _Scanner {
    /**
     * @param {?} input
     */
    constructor(input) {
        this.input = input;
        this.peek = 0;
        this.index = -1;
        this.length = input.length;
        this.advance();
    }
    /**
     * @return {?}
     */
    advance() {
        this.peek = ++this.index >= this.length ? $EOF : this.input.charCodeAt(this.index);
    }
    /**
     * @return {?}
     */
    scanToken() {
        const /** @type {?} */ input = this.input, /** @type {?} */ length = this.length;
        let /** @type {?} */ peek = this.peek, /** @type {?} */ index = this.index;
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
        const /** @type {?} */ start = index;
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
        return this.error(`Unexpected character [${String.fromCharCode(peek)}]`, 0);
    }
    /**
     * @param {?} start
     * @param {?} code
     * @return {?}
     */
    scanCharacter(start, code) {
        this.advance();
        return newCharacterToken(start, code);
    }
    /**
     * @param {?} start
     * @param {?} str
     * @return {?}
     */
    scanOperator(start, str) {
        this.advance();
        return newOperatorToken(start, str);
    }
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
    scanComplexOperator(start, one, twoCode, two, threeCode, three) {
        this.advance();
        let /** @type {?} */ str = one;
        if (this.peek == twoCode) {
            this.advance();
            str += two;
        }
        if (threeCode != null && this.peek == threeCode) {
            this.advance();
            str += three;
        }
        return newOperatorToken(start, str);
    }
    /**
     * @return {?}
     */
    scanIdentifier() {
        const /** @type {?} */ start = this.index;
        this.advance();
        while (isIdentifierPart(this.peek))
            this.advance();
        const /** @type {?} */ str = this.input.substring(start, this.index);
        return KEYWORDS.indexOf(str) > -1 ? newKeywordToken(start, str) :
            newIdentifierToken(start, str);
    }
    /**
     * @param {?} start
     * @return {?}
     */
    scanNumber(start) {
        let /** @type {?} */ simple = (this.index === start);
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
        const /** @type {?} */ str = this.input.substring(start, this.index);
        const /** @type {?} */ value = simple ? parseIntAutoRadix(str) : parseFloat(str);
        return newNumberToken(start, value);
    }
    /**
     * @return {?}
     */
    scanString() {
        const /** @type {?} */ start = this.index;
        const /** @type {?} */ quote = this.peek;
        this.advance(); // Skip initial quote.
        let /** @type {?} */ buffer = '';
        let /** @type {?} */ marker = this.index;
        const /** @type {?} */ input = this.input;
        while (this.peek != quote) {
            if (this.peek == $BACKSLASH) {
                buffer += input.substring(marker, this.index);
                this.advance();
                let /** @type {?} */ unescapedCode;
                // Workaround for TS2.1-introduced type strictness
                this.peek = this.peek;
                if (this.peek == $u) {
                    // 4 character hex code for unicode character.
                    const /** @type {?} */ hex = input.substring(this.index + 1, this.index + 5);
                    if (/^[0-9a-f]+$/i.test(hex)) {
                        unescapedCode = parseInt(hex, 16);
                    }
                    else {
                        return this.error(`Invalid unicode escape [\\u${hex}]`, 0);
                    }
                    for (let /** @type {?} */ i = 0; i < 5; i++) {
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
        const /** @type {?} */ last = input.substring(marker, this.index);
        this.advance(); // Skip terminating quote.
        return newStringToken(start, buffer + last);
    }
    /**
     * @param {?} message
     * @param {?} offset
     * @return {?}
     */
    error(message, offset) {
        const /** @type {?} */ position = this.index + offset;
        return newErrorToken(position, `Lexer Error: ${message} at column ${position} in expression [${this.input}]`);
    }
}
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
    const /** @type {?} */ scanner = new _Scanner(input);
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
    const /** @type {?} */ result = parseInt(text);
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
class SplitInterpolation {
    /**
     * @param {?} strings
     * @param {?} expressions
     * @param {?} offsets
     */
    constructor(strings, expressions, offsets) {
        this.strings = strings;
        this.expressions = expressions;
        this.offsets = offsets;
    }
}
class TemplateBindingParseResult {
    /**
     * @param {?} templateBindings
     * @param {?} warnings
     * @param {?} errors
     */
    constructor(templateBindings, warnings, errors) {
        this.templateBindings = templateBindings;
        this.warnings = warnings;
        this.errors = errors;
    }
}
/**
 * @param {?} config
 * @return {?}
 */
function _createInterpolateRegExp(config) {
    const /** @type {?} */ pattern = escapeRegExp(config.start) + '([\\s\\S]*?)' + escapeRegExp(config.end);
    return new RegExp(pattern, 'g');
}
class Parser {
    /**
     * @param {?} _lexer
     */
    constructor(_lexer) {
        this._lexer = _lexer;
        this.errors = [];
    }
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    parseAction(input, location, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        this._checkNoInterpolation(input, location, interpolationConfig);
        const /** @type {?} */ sourceToLex = this._stripComments(input);
        const /** @type {?} */ tokens = this._lexer.tokenize(this._stripComments(input));
        const /** @type {?} */ ast = new _ParseAST(input, location, tokens, sourceToLex.length, true, this.errors, input.length - sourceToLex.length)
            .parseChain();
        return new ASTWithSource(ast, input, location, this.errors);
    }
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    parseBinding(input, location, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        const /** @type {?} */ ast = this._parseBindingAst(input, location, interpolationConfig);
        return new ASTWithSource(ast, input, location, this.errors);
    }
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    parseSimpleBinding(input, location, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        const /** @type {?} */ ast = this._parseBindingAst(input, location, interpolationConfig);
        const /** @type {?} */ errors = SimpleExpressionChecker.check(ast);
        if (errors.length > 0) {
            this._reportError(`Host binding expression cannot contain ${errors.join(' ')}`, input, location);
        }
        return new ASTWithSource(ast, input, location, this.errors);
    }
    /**
     * @param {?} message
     * @param {?} input
     * @param {?} errLocation
     * @param {?=} ctxLocation
     * @return {?}
     */
    _reportError(message, input, errLocation, ctxLocation) {
        this.errors.push(new ParserError(message, input, errLocation, ctxLocation));
    }
    /**
     * @param {?} input
     * @param {?} location
     * @param {?} interpolationConfig
     * @return {?}
     */
    _parseBindingAst(input, location, interpolationConfig) {
        // Quotes expressions use 3rd-party expression language. We don't want to use
        // our lexer or parser for that, so we check for that ahead of time.
        const /** @type {?} */ quote = this._parseQuote(input, location);
        if (quote != null) {
            return quote;
        }
        this._checkNoInterpolation(input, location, interpolationConfig);
        const /** @type {?} */ sourceToLex = this._stripComments(input);
        const /** @type {?} */ tokens = this._lexer.tokenize(sourceToLex);
        return new _ParseAST(input, location, tokens, sourceToLex.length, false, this.errors, input.length - sourceToLex.length)
            .parseChain();
    }
    /**
     * @param {?} input
     * @param {?} location
     * @return {?}
     */
    _parseQuote(input, location) {
        if (input == null)
            return null;
        const /** @type {?} */ prefixSeparatorIndex = input.indexOf(':');
        if (prefixSeparatorIndex == -1)
            return null;
        const /** @type {?} */ prefix = input.substring(0, prefixSeparatorIndex).trim();
        if (!isIdentifier(prefix))
            return null;
        const /** @type {?} */ uninterpretedExpression = input.substring(prefixSeparatorIndex + 1);
        return new Quote(new ParseSpan(0, input.length), prefix, uninterpretedExpression, location);
    }
    /**
     * @param {?} prefixToken
     * @param {?} input
     * @param {?} location
     * @return {?}
     */
    parseTemplateBindings(prefixToken, input, location) {
        const /** @type {?} */ tokens = this._lexer.tokenize(input);
        if (prefixToken) {
            // Prefix the tokens with the tokens from prefixToken but have them take no space (0 index).
            const /** @type {?} */ prefixTokens = this._lexer.tokenize(prefixToken).map(t => {
                t.index = 0;
                return t;
            });
            tokens.unshift(...prefixTokens);
        }
        return new _ParseAST(input, location, tokens, input.length, false, this.errors, 0)
            .parseTemplateBindings();
    }
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    parseInterpolation(input, location, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        const /** @type {?} */ split = this.splitInterpolation(input, location, interpolationConfig);
        if (split == null)
            return null;
        const /** @type {?} */ expressions = [];
        for (let /** @type {?} */ i = 0; i < split.expressions.length; ++i) {
            const /** @type {?} */ expressionText = split.expressions[i];
            const /** @type {?} */ sourceToLex = this._stripComments(expressionText);
            const /** @type {?} */ tokens = this._lexer.tokenize(this._stripComments(split.expressions[i]));
            const /** @type {?} */ ast = new _ParseAST(input, location, tokens, sourceToLex.length, false, this.errors, split.offsets[i] + (expressionText.length - sourceToLex.length))
                .parseChain();
            expressions.push(ast);
        }
        return new ASTWithSource(new Interpolation(new ParseSpan(0, input == null ? 0 : input.length), split.strings, expressions), input, location, this.errors);
    }
    /**
     * @param {?} input
     * @param {?} location
     * @param {?=} interpolationConfig
     * @return {?}
     */
    splitInterpolation(input, location, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        const /** @type {?} */ regexp = _createInterpolateRegExp(interpolationConfig);
        const /** @type {?} */ parts = input.split(regexp);
        if (parts.length <= 1) {
            return null;
        }
        const /** @type {?} */ strings = [];
        const /** @type {?} */ expressions = [];
        const /** @type {?} */ offsets = [];
        let /** @type {?} */ offset = 0;
        for (let /** @type {?} */ i = 0; i < parts.length; i++) {
            const /** @type {?} */ part = parts[i];
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
                this._reportError('Blank expressions are not allowed in interpolated strings', input, `at column ${this._findInterpolationErrorColumn(parts, i, interpolationConfig)} in`, location);
                expressions.push('$implict');
                offsets.push(offset);
            }
        }
        return new SplitInterpolation(strings, expressions, offsets);
    }
    /**
     * @param {?} input
     * @param {?} location
     * @return {?}
     */
    wrapLiteralPrimitive(input, location) {
        return new ASTWithSource(new LiteralPrimitive(new ParseSpan(0, input == null ? 0 : input.length), input), input, location, this.errors);
    }
    /**
     * @param {?} input
     * @return {?}
     */
    _stripComments(input) {
        const /** @type {?} */ i = this._commentStart(input);
        return i != null ? input.substring(0, i).trim() : input;
    }
    /**
     * @param {?} input
     * @return {?}
     */
    _commentStart(input) {
        let /** @type {?} */ outerQuote = null;
        for (let /** @type {?} */ i = 0; i < input.length - 1; i++) {
            const /** @type {?} */ char = input.charCodeAt(i);
            const /** @type {?} */ nextChar = input.charCodeAt(i + 1);
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
    }
    /**
     * @param {?} input
     * @param {?} location
     * @param {?} interpolationConfig
     * @return {?}
     */
    _checkNoInterpolation(input, location, interpolationConfig) {
        const /** @type {?} */ regexp = _createInterpolateRegExp(interpolationConfig);
        const /** @type {?} */ parts = input.split(regexp);
        if (parts.length > 1) {
            this._reportError(`Got interpolation (${interpolationConfig.start}${interpolationConfig.end}) where expression was expected`, input, `at column ${this._findInterpolationErrorColumn(parts, 1, interpolationConfig)} in`, location);
        }
    }
    /**
     * @param {?} parts
     * @param {?} partInErrIdx
     * @param {?} interpolationConfig
     * @return {?}
     */
    _findInterpolationErrorColumn(parts, partInErrIdx, interpolationConfig) {
        let /** @type {?} */ errLocation = '';
        for (let /** @type {?} */ j = 0; j < partInErrIdx; j++) {
            errLocation += j % 2 === 0 ?
                parts[j] :
                `${interpolationConfig.start}${parts[j]}${interpolationConfig.end}`;
        }
        return errLocation.length;
    }
}
Parser.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
Parser.ctorParameters = () => [
    { type: Lexer, },
];
class _ParseAST {
    /**
     * @param {?} input
     * @param {?} location
     * @param {?} tokens
     * @param {?} inputLength
     * @param {?} parseAction
     * @param {?} errors
     * @param {?} offset
     */
    constructor(input, location, tokens, inputLength, parseAction, errors, offset) {
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
    peek(offset) {
        const /** @type {?} */ i = this.index + offset;
        return i < this.tokens.length ? this.tokens[i] : EOF;
    }
    /**
     * @return {?}
     */
    get next() { return this.peek(0); }
    /**
     * @return {?}
     */
    get inputIndex() {
        return (this.index < this.tokens.length) ? this.next.index + this.offset :
            this.inputLength + this.offset;
    }
    /**
     * @param {?} start
     * @return {?}
     */
    span(start) { return new ParseSpan(start, this.inputIndex); }
    /**
     * @return {?}
     */
    advance() { this.index++; }
    /**
     * @param {?} code
     * @return {?}
     */
    optionalCharacter(code) {
        if (this.next.isCharacter(code)) {
            this.advance();
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * @return {?}
     */
    peekKeywordLet() { return this.next.isKeywordLet(); }
    /**
     * @return {?}
     */
    peekKeywordAs() { return this.next.isKeywordAs(); }
    /**
     * @param {?} code
     * @return {?}
     */
    expectCharacter(code) {
        if (this.optionalCharacter(code))
            return;
        this.error(`Missing expected ${String.fromCharCode(code)}`);
    }
    /**
     * @param {?} op
     * @return {?}
     */
    optionalOperator(op) {
        if (this.next.isOperator(op)) {
            this.advance();
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * @param {?} operator
     * @return {?}
     */
    expectOperator(operator) {
        if (this.optionalOperator(operator))
            return;
        this.error(`Missing expected operator ${operator}`);
    }
    /**
     * @return {?}
     */
    expectIdentifierOrKeyword() {
        const /** @type {?} */ n = this.next;
        if (!n.isIdentifier() && !n.isKeyword()) {
            this.error(`Unexpected token ${n}, expected identifier or keyword`);
            return '';
        }
        this.advance();
        return n.toString();
    }
    /**
     * @return {?}
     */
    expectIdentifierOrKeywordOrString() {
        const /** @type {?} */ n = this.next;
        if (!n.isIdentifier() && !n.isKeyword() && !n.isString()) {
            this.error(`Unexpected token ${n}, expected identifier, keyword, or string`);
            return '';
        }
        this.advance();
        return n.toString();
    }
    /**
     * @return {?}
     */
    parseChain() {
        const /** @type {?} */ exprs = [];
        const /** @type {?} */ start = this.inputIndex;
        while (this.index < this.tokens.length) {
            const /** @type {?} */ expr = this.parsePipe();
            exprs.push(expr);
            if (this.optionalCharacter($SEMICOLON)) {
                if (!this.parseAction) {
                    this.error('Binding expression cannot contain chained expression');
                }
                while (this.optionalCharacter($SEMICOLON)) {
                } // read all semicolons
            }
            else if (this.index < this.tokens.length) {
                this.error(`Unexpected token '${this.next}'`);
            }
        }
        if (exprs.length == 0)
            return new EmptyExpr(this.span(start));
        if (exprs.length == 1)
            return exprs[0];
        return new Chain(this.span(start), exprs);
    }
    /**
     * @return {?}
     */
    parsePipe() {
        let /** @type {?} */ result = this.parseExpression();
        if (this.optionalOperator('|')) {
            if (this.parseAction) {
                this.error('Cannot have a pipe in an action expression');
            }
            do {
                const /** @type {?} */ name = ((this.expectIdentifierOrKeyword()));
                const /** @type {?} */ args = [];
                while (this.optionalCharacter($COLON)) {
                    args.push(this.parseExpression());
                }
                result = new BindingPipe(this.span(result.span.start), result, name, args);
            } while (this.optionalOperator('|'));
        }
        return result;
    }
    /**
     * @return {?}
     */
    parseExpression() { return this.parseConditional(); }
    /**
     * @return {?}
     */
    parseConditional() {
        const /** @type {?} */ start = this.inputIndex;
        const /** @type {?} */ result = this.parseLogicalOr();
        if (this.optionalOperator('?')) {
            const /** @type {?} */ yes = this.parsePipe();
            let /** @type {?} */ no;
            if (!this.optionalCharacter($COLON)) {
                const /** @type {?} */ end = this.inputIndex;
                const /** @type {?} */ expression = this.input.substring(start, end);
                this.error(`Conditional expression ${expression} requires all 3 expressions`);
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
    }
    /**
     * @return {?}
     */
    parseLogicalOr() {
        // '||'
        let /** @type {?} */ result = this.parseLogicalAnd();
        while (this.optionalOperator('||')) {
            const /** @type {?} */ right = this.parseLogicalAnd();
            result = new Binary(this.span(result.span.start), '||', result, right);
        }
        return result;
    }
    /**
     * @return {?}
     */
    parseLogicalAnd() {
        // '&&'
        let /** @type {?} */ result = this.parseEquality();
        while (this.optionalOperator('&&')) {
            const /** @type {?} */ right = this.parseEquality();
            result = new Binary(this.span(result.span.start), '&&', result, right);
        }
        return result;
    }
    /**
     * @return {?}
     */
    parseEquality() {
        // '==','!=','===','!=='
        let /** @type {?} */ result = this.parseRelational();
        while (this.next.type == TokenType.Operator) {
            const /** @type {?} */ operator = this.next.strValue;
            switch (operator) {
                case '==':
                case '===':
                case '!=':
                case '!==':
                    this.advance();
                    const /** @type {?} */ right = this.parseRelational();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    }
    /**
     * @return {?}
     */
    parseRelational() {
        // '<', '>', '<=', '>='
        let /** @type {?} */ result = this.parseAdditive();
        while (this.next.type == TokenType.Operator) {
            const /** @type {?} */ operator = this.next.strValue;
            switch (operator) {
                case '<':
                case '>':
                case '<=':
                case '>=':
                    this.advance();
                    const /** @type {?} */ right = this.parseAdditive();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    }
    /**
     * @return {?}
     */
    parseAdditive() {
        // '+', '-'
        let /** @type {?} */ result = this.parseMultiplicative();
        while (this.next.type == TokenType.Operator) {
            const /** @type {?} */ operator = this.next.strValue;
            switch (operator) {
                case '+':
                case '-':
                    this.advance();
                    let /** @type {?} */ right = this.parseMultiplicative();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    }
    /**
     * @return {?}
     */
    parseMultiplicative() {
        // '*', '%', '/'
        let /** @type {?} */ result = this.parsePrefix();
        while (this.next.type == TokenType.Operator) {
            const /** @type {?} */ operator = this.next.strValue;
            switch (operator) {
                case '*':
                case '%':
                case '/':
                    this.advance();
                    let /** @type {?} */ right = this.parsePrefix();
                    result = new Binary(this.span(result.span.start), operator, result, right);
                    continue;
            }
            break;
        }
        return result;
    }
    /**
     * @return {?}
     */
    parsePrefix() {
        if (this.next.type == TokenType.Operator) {
            const /** @type {?} */ start = this.inputIndex;
            const /** @type {?} */ operator = this.next.strValue;
            let /** @type {?} */ result;
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
    }
    /**
     * @return {?}
     */
    parseCallChain() {
        let /** @type {?} */ result = this.parsePrimary();
        while (true) {
            if (this.optionalCharacter($PERIOD)) {
                result = this.parseAccessMemberOrMethodCall(result, false);
            }
            else if (this.optionalOperator('?.')) {
                result = this.parseAccessMemberOrMethodCall(result, true);
            }
            else if (this.optionalCharacter($LBRACKET)) {
                this.rbracketsExpected++;
                const /** @type {?} */ key = this.parsePipe();
                this.rbracketsExpected--;
                this.expectCharacter($RBRACKET);
                if (this.optionalOperator('=')) {
                    const /** @type {?} */ value = this.parseConditional();
                    result = new KeyedWrite(this.span(result.span.start), result, key, value);
                }
                else {
                    result = new KeyedRead(this.span(result.span.start), result, key);
                }
            }
            else if (this.optionalCharacter($LPAREN)) {
                this.rparensExpected++;
                const /** @type {?} */ args = this.parseCallArguments();
                this.rparensExpected--;
                this.expectCharacter($RPAREN);
                result = new FunctionCall(this.span(result.span.start), result, args);
            }
            else {
                return result;
            }
        }
    }
    /**
     * @return {?}
     */
    parsePrimary() {
        const /** @type {?} */ start = this.inputIndex;
        if (this.optionalCharacter($LPAREN)) {
            this.rparensExpected++;
            const /** @type {?} */ result = this.parsePipe();
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
            const /** @type {?} */ elements = this.parseExpressionList($RBRACKET);
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
            const /** @type {?} */ value = this.next.toNumber();
            this.advance();
            return new LiteralPrimitive(this.span(start), value);
        }
        else if (this.next.isString()) {
            const /** @type {?} */ literalValue = this.next.toString();
            this.advance();
            return new LiteralPrimitive(this.span(start), literalValue);
        }
        else if (this.index >= this.tokens.length) {
            this.error(`Unexpected end of expression: ${this.input}`);
            return new EmptyExpr(this.span(start));
        }
        else {
            this.error(`Unexpected token ${this.next}`);
            return new EmptyExpr(this.span(start));
        }
    }
    /**
     * @param {?} terminator
     * @return {?}
     */
    parseExpressionList(terminator) {
        const /** @type {?} */ result = [];
        if (!this.next.isCharacter(terminator)) {
            do {
                result.push(this.parsePipe());
            } while (this.optionalCharacter($COMMA));
        }
        return result;
    }
    /**
     * @return {?}
     */
    parseLiteralMap() {
        const /** @type {?} */ keys = [];
        const /** @type {?} */ values = [];
        const /** @type {?} */ start = this.inputIndex;
        this.expectCharacter($LBRACE);
        if (!this.optionalCharacter($RBRACE)) {
            this.rbracesExpected++;
            do {
                const /** @type {?} */ key = ((this.expectIdentifierOrKeywordOrString()));
                keys.push(key);
                this.expectCharacter($COLON);
                values.push(this.parsePipe());
            } while (this.optionalCharacter($COMMA));
            this.rbracesExpected--;
            this.expectCharacter($RBRACE);
        }
        return new LiteralMap(this.span(start), keys, values);
    }
    /**
     * @param {?} receiver
     * @param {?=} isSafe
     * @return {?}
     */
    parseAccessMemberOrMethodCall(receiver, isSafe = false) {
        const /** @type {?} */ start = receiver.span.start;
        const /** @type {?} */ id = ((this.expectIdentifierOrKeyword()));
        if (this.optionalCharacter($LPAREN)) {
            this.rparensExpected++;
            const /** @type {?} */ args = this.parseCallArguments();
            this.expectCharacter($RPAREN);
            this.rparensExpected--;
            const /** @type {?} */ span = this.span(start);
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
                    const /** @type {?} */ value = this.parseConditional();
                    return new PropertyWrite(this.span(start), receiver, id, value);
                }
                else {
                    return new PropertyRead(this.span(start), receiver, id);
                }
            }
        }
    }
    /**
     * @return {?}
     */
    parseCallArguments() {
        if (this.next.isCharacter($RPAREN))
            return [];
        const /** @type {?} */ positionals = [];
        do {
            positionals.push(this.parsePipe());
        } while (this.optionalCharacter($COMMA));
        return (positionals);
    }
    /**
     * An identifier, a keyword, a string with an optional `-` inbetween.
     * @return {?}
     */
    expectTemplateBindingKey() {
        let /** @type {?} */ result = '';
        let /** @type {?} */ operatorFound = false;
        do {
            result += this.expectIdentifierOrKeywordOrString();
            operatorFound = this.optionalOperator('-');
            if (operatorFound) {
                result += '-';
            }
        } while (operatorFound);
        return result.toString();
    }
    /**
     * @return {?}
     */
    parseTemplateBindings() {
        const /** @type {?} */ bindings = [];
        let /** @type {?} */ prefix = ((null));
        const /** @type {?} */ warnings = [];
        while (this.index < this.tokens.length) {
            const /** @type {?} */ start = this.inputIndex;
            let /** @type {?} */ keyIsVar = this.peekKeywordLet();
            if (keyIsVar) {
                this.advance();
            }
            let /** @type {?} */ rawKey = this.expectTemplateBindingKey();
            let /** @type {?} */ key = rawKey;
            if (!keyIsVar) {
                if (prefix == null) {
                    prefix = key;
                }
                else {
                    key = prefix + key[0].toUpperCase() + key.substring(1);
                }
            }
            this.optionalCharacter($COLON);
            let /** @type {?} */ name = ((null));
            let /** @type {?} */ expression = ((null));
            if (keyIsVar) {
                if (this.optionalOperator('=')) {
                    name = this.expectTemplateBindingKey();
                }
                else {
                    name = '\$implicit';
                }
            }
            else if (this.peekKeywordAs()) {
                const /** @type {?} */ letStart = this.inputIndex;
                this.advance(); // consume `as`
                name = rawKey;
                key = this.expectTemplateBindingKey(); // read local var name
                keyIsVar = true;
            }
            else if (this.next !== EOF && !this.peekKeywordLet()) {
                const /** @type {?} */ start = this.inputIndex;
                const /** @type {?} */ ast = this.parsePipe();
                const /** @type {?} */ source = this.input.substring(start - this.offset, this.inputIndex - this.offset);
                expression = new ASTWithSource(ast, source, this.location, this.errors);
            }
            bindings.push(new TemplateBinding(this.span(start), key, keyIsVar, name, expression));
            if (this.peekKeywordAs() && !keyIsVar) {
                const /** @type {?} */ letStart = this.inputIndex;
                this.advance(); // consume `as`
                const /** @type {?} */ letName = this.expectTemplateBindingKey(); // read local var name
                bindings.push(new TemplateBinding(this.span(letStart), letName, true, key, /** @type {?} */ ((null))));
            }
            if (!this.optionalCharacter($SEMICOLON)) {
                this.optionalCharacter($COMMA);
            }
        }
        return new TemplateBindingParseResult(bindings, warnings, this.errors);
    }
    /**
     * @param {?} message
     * @param {?=} index
     * @return {?}
     */
    error(message, index = null) {
        this.errors.push(new ParserError(message, this.input, this.locationText(index), this.location));
        this.skip();
    }
    /**
     * @param {?=} index
     * @return {?}
     */
    locationText(index = null) {
        if (index == null)
            index = this.index;
        return (index < this.tokens.length) ? `at column ${this.tokens[index].index + 1} in` :
            `at the end of the expression`;
    }
    /**
     * @return {?}
     */
    skip() {
        let /** @type {?} */ n = this.next;
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
    }
}
class SimpleExpressionChecker {
    constructor() {
        this.errors = [];
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    static check(ast) {
        const /** @type {?} */ s = new SimpleExpressionChecker();
        ast.visit(s);
        return s.errors;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitImplicitReceiver(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitInterpolation(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralPrimitive(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPropertyRead(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPropertyWrite(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitSafePropertyRead(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitMethodCall(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitSafeMethodCall(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitFunctionCall(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralArray(ast, context) { this.visitAll(ast.expressions); }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralMap(ast, context) { this.visitAll(ast.values); }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitBinary(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPrefixNot(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitConditional(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPipe(ast, context) { this.errors.push('pipes'); }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitKeyedRead(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitKeyedWrite(ast, context) { }
    /**
     * @param {?} asts
     * @return {?}
     */
    visitAll(asts) { return asts.map(node => node.visit(this)); }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitChain(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitQuote(ast, context) { }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class ParseLocation {
    /**
     * @param {?} file
     * @param {?} offset
     * @param {?} line
     * @param {?} col
     */
    constructor(file, offset, line, col) {
        this.file = file;
        this.offset = offset;
        this.line = line;
        this.col = col;
    }
    /**
     * @return {?}
     */
    toString() {
        return this.offset != null ? `${this.file.url}@${this.line}:${this.col}` : this.file.url;
    }
    /**
     * @param {?} delta
     * @return {?}
     */
    moveBy(delta) {
        const /** @type {?} */ source = this.file.content;
        const /** @type {?} */ len = source.length;
        let /** @type {?} */ offset = this.offset;
        let /** @type {?} */ line = this.line;
        let /** @type {?} */ col = this.col;
        while (offset > 0 && delta < 0) {
            offset--;
            delta++;
            const /** @type {?} */ ch = source.charCodeAt(offset);
            if (ch == $LF) {
                line--;
                const /** @type {?} */ priorLine = source.substr(0, offset - 1).lastIndexOf(String.fromCharCode($LF));
                col = priorLine > 0 ? offset - priorLine : offset;
            }
            else {
                col--;
            }
        }
        while (offset < len && delta > 0) {
            const /** @type {?} */ ch = source.charCodeAt(offset);
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
    }
    /**
     * @param {?} maxChars
     * @param {?} maxLines
     * @return {?}
     */
    getContext(maxChars, maxLines) {
        const /** @type {?} */ content = this.file.content;
        let /** @type {?} */ startOffset = this.offset;
        if (startOffset != null) {
            if (startOffset > content.length - 1) {
                startOffset = content.length - 1;
            }
            let /** @type {?} */ endOffset = startOffset;
            let /** @type {?} */ ctxChars = 0;
            let /** @type {?} */ ctxLines = 0;
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
    }
}
class ParseSourceFile {
    /**
     * @param {?} content
     * @param {?} url
     */
    constructor(content, url) {
        this.content = content;
        this.url = url;
    }
}
class ParseSourceSpan {
    /**
     * @param {?} start
     * @param {?} end
     * @param {?=} details
     */
    constructor(start, end, details = null) {
        this.start = start;
        this.end = end;
        this.details = details;
    }
    /**
     * @return {?}
     */
    toString() {
        return this.start.file.content.substring(this.start.offset, this.end.offset);
    }
}
let ParseErrorLevel = {};
ParseErrorLevel.WARNING = 0;
ParseErrorLevel.ERROR = 1;
ParseErrorLevel[ParseErrorLevel.WARNING] = "WARNING";
ParseErrorLevel[ParseErrorLevel.ERROR] = "ERROR";
class ParseError {
    /**
     * @param {?} span
     * @param {?} msg
     * @param {?=} level
     */
    constructor(span, msg, level = ParseErrorLevel.ERROR) {
        this.span = span;
        this.msg = msg;
        this.level = level;
    }
    /**
     * @return {?}
     */
    toString() {
        const /** @type {?} */ ctx = this.span.start.getContext(100, 3);
        const /** @type {?} */ contextStr = ctx ? ` ("${ctx.before}[${ParseErrorLevel[this.level]} ->]${ctx.after}")` : '';
        const /** @type {?} */ details = this.span.details ? `, ${this.span.details}` : '';
        return `${this.msg}${contextStr}: ${this.span.start}${details}`;
    }
}
/**
 * @param {?} kind
 * @param {?} type
 * @return {?}
 */
function typeSourceSpan(kind, type) {
    const /** @type {?} */ moduleUrl = identifierModuleUrl(type);
    const /** @type {?} */ sourceFileName = moduleUrl != null ? `in ${kind} ${identifierName(type)} in ${moduleUrl}` :
        `in ${kind} ${identifierName(type)}`;
    const /** @type {?} */ sourceFile = new ParseSourceFile('', sourceFileName);
    return new ParseSourceSpan(new ParseLocation(sourceFile, -1, -1, -1), new ParseLocation(sourceFile, -1, -1, -1));
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class Text {
    /**
     * @param {?} value
     * @param {?} sourceSpan
     */
    constructor(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitText(this, context); }
}
class Expansion {
    /**
     * @param {?} switchValue
     * @param {?} type
     * @param {?} cases
     * @param {?} sourceSpan
     * @param {?} switchValueSourceSpan
     */
    constructor(switchValue, type, cases, sourceSpan, switchValueSourceSpan) {
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
    visit(visitor, context) { return visitor.visitExpansion(this, context); }
}
class ExpansionCase {
    /**
     * @param {?} value
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} valueSourceSpan
     * @param {?} expSourceSpan
     */
    constructor(value, expression, sourceSpan, valueSourceSpan, expSourceSpan) {
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
    visit(visitor, context) { return visitor.visitExpansionCase(this, context); }
}
class Attribute$1 {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?=} valueSpan
     */
    constructor(name, value, sourceSpan, valueSpan) {
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
    visit(visitor, context) { return visitor.visitAttribute(this, context); }
}
class Element {
    /**
     * @param {?} name
     * @param {?} attrs
     * @param {?} children
     * @param {?} sourceSpan
     * @param {?=} startSourceSpan
     * @param {?=} endSourceSpan
     */
    constructor(name, attrs, children, sourceSpan, startSourceSpan = null, endSourceSpan = null) {
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
    visit(visitor, context) { return visitor.visitElement(this, context); }
}
class Comment {
    /**
     * @param {?} value
     * @param {?} sourceSpan
     */
    constructor(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitComment(this, context); }
}
/**
 * @param {?} visitor
 * @param {?} nodes
 * @param {?=} context
 * @return {?}
 */
function visitAll(visitor, nodes, context = null) {
    const /** @type {?} */ result = [];
    const /** @type {?} */ visit = visitor.visit ?
        (ast) => ((visitor.visit))(ast, context) || ast.visit(visitor, context) :
        (ast) => ast.visit(visitor, context);
    nodes.forEach(ast => {
        const /** @type {?} */ astResult = visit(ast);
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
let TokenType$1 = {};
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
class Token$1 {
    /**
     * @param {?} type
     * @param {?} parts
     * @param {?} sourceSpan
     */
    constructor(type, parts, sourceSpan) {
        this.type = type;
        this.parts = parts;
        this.sourceSpan = sourceSpan;
    }
}
class TokenError extends ParseError {
    /**
     * @param {?} errorMsg
     * @param {?} tokenType
     * @param {?} span
     */
    constructor(errorMsg, tokenType, span) {
        super(span, errorMsg);
        this.tokenType = tokenType;
    }
}
class TokenizeResult {
    /**
     * @param {?} tokens
     * @param {?} errors
     */
    constructor(tokens, errors) {
        this.tokens = tokens;
        this.errors = errors;
    }
}
/**
 * @param {?} source
 * @param {?} url
 * @param {?} getTagDefinition
 * @param {?=} tokenizeExpansionForms
 * @param {?=} interpolationConfig
 * @return {?}
 */
function tokenize(source, url, getTagDefinition, tokenizeExpansionForms = false, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
    return new _Tokenizer(new ParseSourceFile(source, url), getTagDefinition, tokenizeExpansionForms, interpolationConfig)
        .tokenize();
}
const _CR_OR_CRLF_REGEXP = /\r\n?/g;
/**
 * @param {?} charCode
 * @return {?}
 */
function _unexpectedCharacterErrorMsg(charCode) {
    const /** @type {?} */ char = charCode === $EOF ? 'EOF' : String.fromCharCode(charCode);
    return `Unexpected character "${char}"`;
}
/**
 * @param {?} entitySrc
 * @return {?}
 */
function _unknownEntityErrorMsg(entitySrc) {
    return `Unknown entity "${entitySrc}" - use the "&#<decimal>;" or  "&#x<hex>;" syntax`;
}
class _ControlFlowError {
    /**
     * @param {?} error
     */
    constructor(error) {
        this.error = error;
    }
}
class _Tokenizer {
    /**
     * @param {?} _file The html source
     * @param {?} _getTagDefinition
     * @param {?} _tokenizeIcu Whether to tokenize ICU messages (considered as text nodes when false)
     * @param {?=} _interpolationConfig
     */
    constructor(_file, _getTagDefinition, _tokenizeIcu, _interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
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
    _processCarriageReturns(content) {
        // http://www.w3.org/TR/html5/syntax.html#preprocessing-the-input-stream
        // In order to keep the original position in the source, we can not
        // pre-process it.
        // Instead CRs are processed right before instantiating the tokens.
        return content.replace(_CR_OR_CRLF_REGEXP, '\n');
    }
    /**
     * @return {?}
     */
    tokenize() {
        while (this._peek !== $EOF) {
            const /** @type {?} */ start = this._getLocation();
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
    }
    /**
     * \@internal
     * @return {?}
     */
    _tokenizeExpansionForm() {
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
    }
    /**
     * @return {?}
     */
    _getLocation() {
        return new ParseLocation(this._file, this._index, this._line, this._column);
    }
    /**
     * @param {?=} start
     * @param {?=} end
     * @return {?}
     */
    _getSpan(start = this._getLocation(), end = this._getLocation()) {
        return new ParseSourceSpan(start, end);
    }
    /**
     * @param {?} type
     * @param {?=} start
     * @return {?}
     */
    _beginToken(type, start = this._getLocation()) {
        this._currentTokenStart = start;
        this._currentTokenType = type;
    }
    /**
     * @param {?} parts
     * @param {?=} end
     * @return {?}
     */
    _endToken(parts, end = this._getLocation()) {
        const /** @type {?} */ token = new Token$1(this._currentTokenType, parts, new ParseSourceSpan(this._currentTokenStart, end));
        this.tokens.push(token);
        this._currentTokenStart = ((null));
        this._currentTokenType = ((null));
        return token;
    }
    /**
     * @param {?} msg
     * @param {?} span
     * @return {?}
     */
    _createError(msg, span) {
        if (this._isInExpansionForm()) {
            msg += ` (Do you have an unescaped "{" in your template? Use "{{ '{' }}") to escape it.)`;
        }
        const /** @type {?} */ error = new TokenError(msg, this._currentTokenType, span);
        this._currentTokenStart = ((null));
        this._currentTokenType = ((null));
        return new _ControlFlowError(error);
    }
    /**
     * @return {?}
     */
    _advance() {
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
    }
    /**
     * @param {?} charCode
     * @return {?}
     */
    _attemptCharCode(charCode) {
        if (this._peek === charCode) {
            this._advance();
            return true;
        }
        return false;
    }
    /**
     * @param {?} charCode
     * @return {?}
     */
    _attemptCharCodeCaseInsensitive(charCode) {
        if (compareCharCodeCaseInsensitive(this._peek, charCode)) {
            this._advance();
            return true;
        }
        return false;
    }
    /**
     * @param {?} charCode
     * @return {?}
     */
    _requireCharCode(charCode) {
        const /** @type {?} */ location = this._getLocation();
        if (!this._attemptCharCode(charCode)) {
            throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan(location, location));
        }
    }
    /**
     * @param {?} chars
     * @return {?}
     */
    _attemptStr(chars) {
        const /** @type {?} */ len = chars.length;
        if (this._index + len > this._length) {
            return false;
        }
        const /** @type {?} */ initialPosition = this._savePosition();
        for (let /** @type {?} */ i = 0; i < len; i++) {
            if (!this._attemptCharCode(chars.charCodeAt(i))) {
                // If attempting to parse the string fails, we want to reset the parser
                // to where it was before the attempt
                this._restorePosition(initialPosition);
                return false;
            }
        }
        return true;
    }
    /**
     * @param {?} chars
     * @return {?}
     */
    _attemptStrCaseInsensitive(chars) {
        for (let /** @type {?} */ i = 0; i < chars.length; i++) {
            if (!this._attemptCharCodeCaseInsensitive(chars.charCodeAt(i))) {
                return false;
            }
        }
        return true;
    }
    /**
     * @param {?} chars
     * @return {?}
     */
    _requireStr(chars) {
        const /** @type {?} */ location = this._getLocation();
        if (!this._attemptStr(chars)) {
            throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan(location));
        }
    }
    /**
     * @param {?} predicate
     * @return {?}
     */
    _attemptCharCodeUntilFn(predicate) {
        while (!predicate(this._peek)) {
            this._advance();
        }
    }
    /**
     * @param {?} predicate
     * @param {?} len
     * @return {?}
     */
    _requireCharCodeUntilFn(predicate, len) {
        const /** @type {?} */ start = this._getLocation();
        this._attemptCharCodeUntilFn(predicate);
        if (this._index - start.offset < len) {
            throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan(start, start));
        }
    }
    /**
     * @param {?} char
     * @return {?}
     */
    _attemptUntilChar(char) {
        while (this._peek !== char) {
            this._advance();
        }
    }
    /**
     * @param {?} decodeEntities
     * @return {?}
     */
    _readChar(decodeEntities) {
        if (decodeEntities && this._peek === $AMPERSAND) {
            return this._decodeEntity();
        }
        else {
            const /** @type {?} */ index = this._index;
            this._advance();
            return this._input[index];
        }
    }
    /**
     * @return {?}
     */
    _decodeEntity() {
        const /** @type {?} */ start = this._getLocation();
        this._advance();
        if (this._attemptCharCode($HASH)) {
            const /** @type {?} */ isHex = this._attemptCharCode($x) || this._attemptCharCode($X);
            const /** @type {?} */ numberStart = this._getLocation().offset;
            this._attemptCharCodeUntilFn(isDigitEntityEnd);
            if (this._peek != $SEMICOLON) {
                throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan());
            }
            this._advance();
            const /** @type {?} */ strNum = this._input.substring(numberStart, this._index - 1);
            try {
                const /** @type {?} */ charCode = parseInt(strNum, isHex ? 16 : 10);
                return String.fromCharCode(charCode);
            }
            catch (e) {
                const /** @type {?} */ entity = this._input.substring(start.offset + 1, this._index - 1);
                throw this._createError(_unknownEntityErrorMsg(entity), this._getSpan(start));
            }
        }
        else {
            const /** @type {?} */ startPosition = this._savePosition();
            this._attemptCharCodeUntilFn(isNamedEntityEnd);
            if (this._peek != $SEMICOLON) {
                this._restorePosition(startPosition);
                return '&';
            }
            this._advance();
            const /** @type {?} */ name = this._input.substring(start.offset + 1, this._index - 1);
            const /** @type {?} */ char = NAMED_ENTITIES[name];
            if (!char) {
                throw this._createError(_unknownEntityErrorMsg(name), this._getSpan(start));
            }
            return char;
        }
    }
    /**
     * @param {?} decodeEntities
     * @param {?} firstCharOfEnd
     * @param {?} attemptEndRest
     * @return {?}
     */
    _consumeRawText(decodeEntities, firstCharOfEnd, attemptEndRest) {
        let /** @type {?} */ tagCloseStart;
        const /** @type {?} */ textStart = this._getLocation();
        this._beginToken(decodeEntities ? TokenType$1.ESCAPABLE_RAW_TEXT : TokenType$1.RAW_TEXT, textStart);
        const /** @type {?} */ parts = [];
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
    }
    /**
     * @param {?} start
     * @return {?}
     */
    _consumeComment(start) {
        this._beginToken(TokenType$1.COMMENT_START, start);
        this._requireCharCode($MINUS);
        this._endToken([]);
        const /** @type {?} */ textToken = this._consumeRawText(false, $MINUS, () => this._attemptStr('->'));
        this._beginToken(TokenType$1.COMMENT_END, textToken.sourceSpan.end);
        this._endToken([]);
    }
    /**
     * @param {?} start
     * @return {?}
     */
    _consumeCdata(start) {
        this._beginToken(TokenType$1.CDATA_START, start);
        this._requireStr('CDATA[');
        this._endToken([]);
        const /** @type {?} */ textToken = this._consumeRawText(false, $RBRACKET, () => this._attemptStr(']>'));
        this._beginToken(TokenType$1.CDATA_END, textToken.sourceSpan.end);
        this._endToken([]);
    }
    /**
     * @param {?} start
     * @return {?}
     */
    _consumeDocType(start) {
        this._beginToken(TokenType$1.DOC_TYPE, start);
        this._attemptUntilChar($GT);
        this._advance();
        this._endToken([this._input.substring(start.offset + 2, this._index - 1)]);
    }
    /**
     * @return {?}
     */
    _consumePrefixAndName() {
        const /** @type {?} */ nameOrPrefixStart = this._index;
        let /** @type {?} */ prefix = ((null));
        while (this._peek !== $COLON && !isPrefixEnd(this._peek)) {
            this._advance();
        }
        let /** @type {?} */ nameStart;
        if (this._peek === $COLON) {
            this._advance();
            prefix = this._input.substring(nameOrPrefixStart, this._index - 1);
            nameStart = this._index;
        }
        else {
            nameStart = nameOrPrefixStart;
        }
        this._requireCharCodeUntilFn(isNameEnd, this._index === nameStart ? 1 : 0);
        const /** @type {?} */ name = this._input.substring(nameStart, this._index);
        return [prefix, name];
    }
    /**
     * @param {?} start
     * @return {?}
     */
    _consumeTagOpen(start) {
        const /** @type {?} */ savedPos = this._savePosition();
        let /** @type {?} */ tagName;
        let /** @type {?} */ lowercaseTagName;
        try {
            if (!isAsciiLetter(this._peek)) {
                throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan());
            }
            const /** @type {?} */ nameStart = this._index;
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
        const /** @type {?} */ contentTokenType = this._getTagDefinition(tagName).contentType;
        if (contentTokenType === TagContentType.RAW_TEXT) {
            this._consumeRawTextWithTagClose(lowercaseTagName, false);
        }
        else if (contentTokenType === TagContentType.ESCAPABLE_RAW_TEXT) {
            this._consumeRawTextWithTagClose(lowercaseTagName, true);
        }
    }
    /**
     * @param {?} lowercaseTagName
     * @param {?} decodeEntities
     * @return {?}
     */
    _consumeRawTextWithTagClose(lowercaseTagName, decodeEntities) {
        const /** @type {?} */ textToken = this._consumeRawText(decodeEntities, $LT, () => {
            if (!this._attemptCharCode($SLASH))
                return false;
            this._attemptCharCodeUntilFn(isNotWhitespace);
            if (!this._attemptStrCaseInsensitive(lowercaseTagName))
                return false;
            this._attemptCharCodeUntilFn(isNotWhitespace);
            return this._attemptCharCode($GT);
        });
        this._beginToken(TokenType$1.TAG_CLOSE, textToken.sourceSpan.end);
        this._endToken([/** @type {?} */ ((null)), lowercaseTagName]);
    }
    /**
     * @param {?} start
     * @return {?}
     */
    _consumeTagOpenStart(start) {
        this._beginToken(TokenType$1.TAG_OPEN_START, start);
        const /** @type {?} */ parts = this._consumePrefixAndName();
        this._endToken(parts);
    }
    /**
     * @return {?}
     */
    _consumeAttributeName() {
        this._beginToken(TokenType$1.ATTR_NAME);
        const /** @type {?} */ prefixAndName = this._consumePrefixAndName();
        this._endToken(prefixAndName);
    }
    /**
     * @return {?}
     */
    _consumeAttributeValue() {
        this._beginToken(TokenType$1.ATTR_VALUE);
        let /** @type {?} */ value;
        if (this._peek === $SQ || this._peek === $DQ) {
            const /** @type {?} */ quoteChar = this._peek;
            this._advance();
            const /** @type {?} */ parts = [];
            while (this._peek !== quoteChar) {
                parts.push(this._readChar(true));
            }
            value = parts.join('');
            this._advance();
        }
        else {
            const /** @type {?} */ valueStart = this._index;
            this._requireCharCodeUntilFn(isNameEnd, 1);
            value = this._input.substring(valueStart, this._index);
        }
        this._endToken([this._processCarriageReturns(value)]);
    }
    /**
     * @return {?}
     */
    _consumeTagOpenEnd() {
        const /** @type {?} */ tokenType = this._attemptCharCode($SLASH) ? TokenType$1.TAG_OPEN_END_VOID : TokenType$1.TAG_OPEN_END;
        this._beginToken(tokenType);
        this._requireCharCode($GT);
        this._endToken([]);
    }
    /**
     * @param {?} start
     * @return {?}
     */
    _consumeTagClose(start) {
        this._beginToken(TokenType$1.TAG_CLOSE, start);
        this._attemptCharCodeUntilFn(isNotWhitespace);
        const /** @type {?} */ prefixAndName = this._consumePrefixAndName();
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._requireCharCode($GT);
        this._endToken(prefixAndName);
    }
    /**
     * @return {?}
     */
    _consumeExpansionFormStart() {
        this._beginToken(TokenType$1.EXPANSION_FORM_START, this._getLocation());
        this._requireCharCode($LBRACE);
        this._endToken([]);
        this._expansionCaseStack.push(TokenType$1.EXPANSION_FORM_START);
        this._beginToken(TokenType$1.RAW_TEXT, this._getLocation());
        const /** @type {?} */ condition = this._readUntil($COMMA);
        this._endToken([condition], this._getLocation());
        this._requireCharCode($COMMA);
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._beginToken(TokenType$1.RAW_TEXT, this._getLocation());
        const /** @type {?} */ type = this._readUntil($COMMA);
        this._endToken([type], this._getLocation());
        this._requireCharCode($COMMA);
        this._attemptCharCodeUntilFn(isNotWhitespace);
    }
    /**
     * @return {?}
     */
    _consumeExpansionCaseStart() {
        this._beginToken(TokenType$1.EXPANSION_CASE_VALUE, this._getLocation());
        const /** @type {?} */ value = this._readUntil($LBRACE).trim();
        this._endToken([value], this._getLocation());
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._beginToken(TokenType$1.EXPANSION_CASE_EXP_START, this._getLocation());
        this._requireCharCode($LBRACE);
        this._endToken([], this._getLocation());
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._expansionCaseStack.push(TokenType$1.EXPANSION_CASE_EXP_START);
    }
    /**
     * @return {?}
     */
    _consumeExpansionCaseEnd() {
        this._beginToken(TokenType$1.EXPANSION_CASE_EXP_END, this._getLocation());
        this._requireCharCode($RBRACE);
        this._endToken([], this._getLocation());
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._expansionCaseStack.pop();
    }
    /**
     * @return {?}
     */
    _consumeExpansionFormEnd() {
        this._beginToken(TokenType$1.EXPANSION_FORM_END, this._getLocation());
        this._requireCharCode($RBRACE);
        this._endToken([]);
        this._expansionCaseStack.pop();
    }
    /**
     * @return {?}
     */
    _consumeText() {
        const /** @type {?} */ start = this._getLocation();
        this._beginToken(TokenType$1.TEXT, start);
        const /** @type {?} */ parts = [];
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
    }
    /**
     * @return {?}
     */
    _isTextEnd() {
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
    }
    /**
     * @return {?}
     */
    _savePosition() {
        return [this._peek, this._index, this._column, this._line, this.tokens.length];
    }
    /**
     * @param {?} char
     * @return {?}
     */
    _readUntil(char) {
        const /** @type {?} */ start = this._index;
        this._attemptUntilChar(char);
        return this._input.substring(start, this._index);
    }
    /**
     * @param {?} position
     * @return {?}
     */
    _restorePosition(position) {
        this._peek = position[0];
        this._index = position[1];
        this._column = position[2];
        this._line = position[3];
        const /** @type {?} */ nbTokens = position[4];
        if (nbTokens < this.tokens.length) {
            // remove any extra tokens
            this.tokens = this.tokens.slice(0, nbTokens);
        }
    }
    /**
     * @return {?}
     */
    _isInExpansionCase() {
        return this._expansionCaseStack.length > 0 &&
            this._expansionCaseStack[this._expansionCaseStack.length - 1] ===
                TokenType$1.EXPANSION_CASE_EXP_START;
    }
    /**
     * @return {?}
     */
    _isInExpansionForm() {
        return this._expansionCaseStack.length > 0 &&
            this._expansionCaseStack[this._expansionCaseStack.length - 1] ===
                TokenType$1.EXPANSION_FORM_START;
    }
}
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
    const /** @type {?} */ isInterpolationStart = interpolationConfig ? input.indexOf(interpolationConfig.start, offset) == offset : false;
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
    const /** @type {?} */ dstTokens = [];
    let /** @type {?} */ lastDstToken = undefined;
    for (let /** @type {?} */ i = 0; i < srcTokens.length; i++) {
        const /** @type {?} */ token = srcTokens[i];
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
class TreeError extends ParseError {
    /**
     * @param {?} elementName
     * @param {?} span
     * @param {?} msg
     */
    constructor(elementName, span, msg) {
        super(span, msg);
        this.elementName = elementName;
    }
    /**
     * @param {?} elementName
     * @param {?} span
     * @param {?} msg
     * @return {?}
     */
    static create(elementName, span, msg) {
        return new TreeError(elementName, span, msg);
    }
}
class ParseTreeResult {
    /**
     * @param {?} rootNodes
     * @param {?} errors
     */
    constructor(rootNodes, errors) {
        this.rootNodes = rootNodes;
        this.errors = errors;
    }
}
class Parser$1 {
    /**
     * @param {?} getTagDefinition
     */
    constructor(getTagDefinition) {
        this.getTagDefinition = getTagDefinition;
    }
    /**
     * @param {?} source
     * @param {?} url
     * @param {?=} parseExpansionForms
     * @param {?=} interpolationConfig
     * @return {?}
     */
    parse(source, url, parseExpansionForms = false, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        const /** @type {?} */ tokensAndErrors = tokenize(source, url, this.getTagDefinition, parseExpansionForms, interpolationConfig);
        const /** @type {?} */ treeAndErrors = new _TreeBuilder(tokensAndErrors.tokens, this.getTagDefinition).build();
        return new ParseTreeResult(treeAndErrors.rootNodes, ((tokensAndErrors.errors)).concat(treeAndErrors.errors));
    }
}
class _TreeBuilder {
    /**
     * @param {?} tokens
     * @param {?} getTagDefinition
     */
    constructor(tokens, getTagDefinition) {
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
    build() {
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
    }
    /**
     * @return {?}
     */
    _advance() {
        const /** @type {?} */ prev = this._peek;
        if (this._index < this.tokens.length - 1) {
            // Note: there is always an EOF token at the end
            this._index++;
        }
        this._peek = this.tokens[this._index];
        return prev;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    _advanceIf(type) {
        if (this._peek.type === type) {
            return this._advance();
        }
        return null;
    }
    /**
     * @param {?} startToken
     * @return {?}
     */
    _consumeCdata(startToken) {
        this._consumeText(this._advance());
        this._advanceIf(TokenType$1.CDATA_END);
    }
    /**
     * @param {?} token
     * @return {?}
     */
    _consumeComment(token) {
        const /** @type {?} */ text = this._advanceIf(TokenType$1.RAW_TEXT);
        this._advanceIf(TokenType$1.COMMENT_END);
        const /** @type {?} */ value = text != null ? text.parts[0].trim() : null;
        this._addToParent(new Comment(value, token.sourceSpan));
    }
    /**
     * @param {?} token
     * @return {?}
     */
    _consumeExpansion(token) {
        const /** @type {?} */ switchValue = this._advance();
        const /** @type {?} */ type = this._advance();
        const /** @type {?} */ cases = [];
        // read =
        while (this._peek.type === TokenType$1.EXPANSION_CASE_VALUE) {
            const /** @type {?} */ expCase = this._parseExpansionCase();
            if (!expCase)
                return; // error
            cases.push(expCase);
        }
        // read the final }
        if (this._peek.type !== TokenType$1.EXPANSION_FORM_END) {
            this._errors.push(TreeError.create(null, this._peek.sourceSpan, `Invalid ICU message. Missing '}'.`));
            return;
        }
        const /** @type {?} */ sourceSpan = new ParseSourceSpan(token.sourceSpan.start, this._peek.sourceSpan.end);
        this._addToParent(new Expansion(switchValue.parts[0], type.parts[0], cases, sourceSpan, switchValue.sourceSpan));
        this._advance();
    }
    /**
     * @return {?}
     */
    _parseExpansionCase() {
        const /** @type {?} */ value = this._advance();
        // read {
        if (this._peek.type !== TokenType$1.EXPANSION_CASE_EXP_START) {
            this._errors.push(TreeError.create(null, this._peek.sourceSpan, `Invalid ICU message. Missing '{'.`));
            return null;
        }
        // read until }
        const /** @type {?} */ start = this._advance();
        const /** @type {?} */ exp = this._collectExpansionExpTokens(start);
        if (!exp)
            return null;
        const /** @type {?} */ end = this._advance();
        exp.push(new Token$1(TokenType$1.EOF, [], end.sourceSpan));
        // parse everything in between { and }
        const /** @type {?} */ parsedExp = new _TreeBuilder(exp, this.getTagDefinition).build();
        if (parsedExp.errors.length > 0) {
            this._errors = this._errors.concat(/** @type {?} */ (parsedExp.errors));
            return null;
        }
        const /** @type {?} */ sourceSpan = new ParseSourceSpan(value.sourceSpan.start, end.sourceSpan.end);
        const /** @type {?} */ expSourceSpan = new ParseSourceSpan(start.sourceSpan.start, end.sourceSpan.end);
        return new ExpansionCase(value.parts[0], parsedExp.rootNodes, sourceSpan, value.sourceSpan, expSourceSpan);
    }
    /**
     * @param {?} start
     * @return {?}
     */
    _collectExpansionExpTokens(start) {
        const /** @type {?} */ exp = [];
        const /** @type {?} */ expansionFormStack = [TokenType$1.EXPANSION_CASE_EXP_START];
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
                    this._errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
                    return null;
                }
            }
            if (this._peek.type === TokenType$1.EXPANSION_FORM_END) {
                if (lastOnStack(expansionFormStack, TokenType$1.EXPANSION_FORM_START)) {
                    expansionFormStack.pop();
                }
                else {
                    this._errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
                    return null;
                }
            }
            if (this._peek.type === TokenType$1.EOF) {
                this._errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
                return null;
            }
            exp.push(this._advance());
        }
    }
    /**
     * @param {?} token
     * @return {?}
     */
    _consumeText(token) {
        let /** @type {?} */ text = token.parts[0];
        if (text.length > 0 && text[0] == '\n') {
            const /** @type {?} */ parent = this._getParentElement();
            if (parent != null && parent.children.length == 0 &&
                this.getTagDefinition(parent.name).ignoreFirstLf) {
                text = text.substring(1);
            }
        }
        if (text.length > 0) {
            this._addToParent(new Text(text, token.sourceSpan));
        }
    }
    /**
     * @return {?}
     */
    _closeVoidElement() {
        if (this._elementStack.length > 0) {
            const /** @type {?} */ el = this._elementStack[this._elementStack.length - 1];
            if (this.getTagDefinition(el.name).isVoid) {
                this._elementStack.pop();
            }
        }
    }
    /**
     * @param {?} startTagToken
     * @return {?}
     */
    _consumeStartTag(startTagToken) {
        const /** @type {?} */ prefix = startTagToken.parts[0];
        const /** @type {?} */ name = startTagToken.parts[1];
        const /** @type {?} */ attrs = [];
        while (this._peek.type === TokenType$1.ATTR_NAME) {
            attrs.push(this._consumeAttr(this._advance()));
        }
        const /** @type {?} */ fullName = this._getElementFullName(prefix, name, this._getParentElement());
        let /** @type {?} */ selfClosing = false;
        // Note: There could have been a tokenizer error
        // so that we don't get a token for the end tag...
        if (this._peek.type === TokenType$1.TAG_OPEN_END_VOID) {
            this._advance();
            selfClosing = true;
            const /** @type {?} */ tagDef = this.getTagDefinition(fullName);
            if (!(tagDef.canSelfClose || getNsPrefix(fullName) !== null || tagDef.isVoid)) {
                this._errors.push(TreeError.create(fullName, startTagToken.sourceSpan, `Only void and foreign elements can be self closed "${startTagToken.parts[1]}"`));
            }
        }
        else if (this._peek.type === TokenType$1.TAG_OPEN_END) {
            this._advance();
            selfClosing = false;
        }
        const /** @type {?} */ end = this._peek.sourceSpan.start;
        const /** @type {?} */ span = new ParseSourceSpan(startTagToken.sourceSpan.start, end);
        const /** @type {?} */ el = new Element(fullName, attrs, [], span, span, undefined);
        this._pushElement(el);
        if (selfClosing) {
            this._popElement(fullName);
            el.endSourceSpan = span;
        }
    }
    /**
     * @param {?} el
     * @return {?}
     */
    _pushElement(el) {
        if (this._elementStack.length > 0) {
            const /** @type {?} */ parentEl = this._elementStack[this._elementStack.length - 1];
            if (this.getTagDefinition(parentEl.name).isClosedByChild(el.name)) {
                this._elementStack.pop();
            }
        }
        const /** @type {?} */ tagDef = this.getTagDefinition(el.name);
        const { parent, container } = this._getParentElementSkippingContainers();
        if (parent && tagDef.requireExtraParent(parent.name)) {
            const /** @type {?} */ newParent = new Element(tagDef.parentToAdd, [], [], el.sourceSpan, el.startSourceSpan, el.endSourceSpan);
            this._insertBeforeContainer(parent, container, newParent);
        }
        this._addToParent(el);
        this._elementStack.push(el);
    }
    /**
     * @param {?} endTagToken
     * @return {?}
     */
    _consumeEndTag(endTagToken) {
        const /** @type {?} */ fullName = this._getElementFullName(endTagToken.parts[0], endTagToken.parts[1], this._getParentElement());
        if (this._getParentElement()) {
            ((this._getParentElement())).endSourceSpan = endTagToken.sourceSpan;
        }
        if (this.getTagDefinition(fullName).isVoid) {
            this._errors.push(TreeError.create(fullName, endTagToken.sourceSpan, `Void elements do not have end tags "${endTagToken.parts[1]}"`));
        }
        else if (!this._popElement(fullName)) {
            const /** @type {?} */ errMsg = `Unexpected closing tag "${fullName}". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags`;
            this._errors.push(TreeError.create(fullName, endTagToken.sourceSpan, errMsg));
        }
    }
    /**
     * @param {?} fullName
     * @return {?}
     */
    _popElement(fullName) {
        for (let /** @type {?} */ stackIndex = this._elementStack.length - 1; stackIndex >= 0; stackIndex--) {
            const /** @type {?} */ el = this._elementStack[stackIndex];
            if (el.name == fullName) {
                this._elementStack.splice(stackIndex, this._elementStack.length - stackIndex);
                return true;
            }
            if (!this.getTagDefinition(el.name).closedByParent) {
                return false;
            }
        }
        return false;
    }
    /**
     * @param {?} attrName
     * @return {?}
     */
    _consumeAttr(attrName) {
        const /** @type {?} */ fullName = mergeNsAndName(attrName.parts[0], attrName.parts[1]);
        let /** @type {?} */ end = attrName.sourceSpan.end;
        let /** @type {?} */ value = '';
        let /** @type {?} */ valueSpan = ((undefined));
        if (this._peek.type === TokenType$1.ATTR_VALUE) {
            const /** @type {?} */ valueToken = this._advance();
            value = valueToken.parts[0];
            end = valueToken.sourceSpan.end;
            valueSpan = valueToken.sourceSpan;
        }
        return new Attribute$1(fullName, value, new ParseSourceSpan(attrName.sourceSpan.start, end), valueSpan);
    }
    /**
     * @return {?}
     */
    _getParentElement() {
        return this._elementStack.length > 0 ? this._elementStack[this._elementStack.length - 1] : null;
    }
    /**
     * Returns the parent in the DOM and the container.
     *
     * `<ng-container>` elements are skipped as they are not rendered as DOM element.
     * @return {?}
     */
    _getParentElementSkippingContainers() {
        let /** @type {?} */ container = null;
        for (let /** @type {?} */ i = this._elementStack.length - 1; i >= 0; i--) {
            if (!isNgContainer(this._elementStack[i].name)) {
                return { parent: this._elementStack[i], container };
            }
            container = this._elementStack[i];
        }
        return { parent: this._elementStack[this._elementStack.length - 1], container };
    }
    /**
     * @param {?} node
     * @return {?}
     */
    _addToParent(node) {
        const /** @type {?} */ parent = this._getParentElement();
        if (parent != null) {
            parent.children.push(node);
        }
        else {
            this._rootNodes.push(node);
        }
    }
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
    _insertBeforeContainer(parent, container, node) {
        if (!container) {
            this._addToParent(node);
            this._elementStack.push(node);
        }
        else {
            if (parent) {
                // replace the container with the new node in the children
                const /** @type {?} */ index = parent.children.indexOf(container);
                parent.children[index] = node;
            }
            else {
                this._rootNodes.push(node);
            }
            node.children.push(container);
            this._elementStack.splice(this._elementStack.indexOf(container), 0, node);
        }
    }
    /**
     * @param {?} prefix
     * @param {?} localName
     * @param {?} parentElement
     * @return {?}
     */
    _getElementFullName(prefix, localName, parentElement) {
        if (prefix == null) {
            prefix = ((this.getTagDefinition(localName).implicitNamespacePrefix));
            if (prefix == null && parentElement != null) {
                prefix = getNsPrefix(parentElement.name);
            }
        }
        return mergeNsAndName(prefix, localName);
    }
}
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
class Message {
    /**
     * @param {?} nodes message AST
     * @param {?} placeholders maps placeholder names to static content
     * @param {?} placeholderToMessage maps placeholder names to messages (used for nested ICU messages)
     * @param {?} meaning
     * @param {?} description
     * @param {?} id
     */
    constructor(nodes, placeholders, placeholderToMessage, meaning, description, id) {
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
}
class Text$1 {
    /**
     * @param {?} value
     * @param {?} sourceSpan
     */
    constructor(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitText(this, context); }
}
class Container {
    /**
     * @param {?} children
     * @param {?} sourceSpan
     */
    constructor(children, sourceSpan) {
        this.children = children;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitContainer(this, context); }
}
class Icu {
    /**
     * @param {?} expression
     * @param {?} type
     * @param {?} cases
     * @param {?} sourceSpan
     */
    constructor(expression, type, cases, sourceSpan) {
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
    visit(visitor, context) { return visitor.visitIcu(this, context); }
}
class TagPlaceholder {
    /**
     * @param {?} tag
     * @param {?} attrs
     * @param {?} startName
     * @param {?} closeName
     * @param {?} children
     * @param {?} isVoid
     * @param {?} sourceSpan
     */
    constructor(tag, attrs, startName, closeName, children, isVoid, sourceSpan) {
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
    visit(visitor, context) { return visitor.visitTagPlaceholder(this, context); }
}
class Placeholder {
    /**
     * @param {?} value
     * @param {?} name
     * @param {?} sourceSpan
     */
    constructor(value, name, sourceSpan) {
        this.value = value;
        this.name = name;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitPlaceholder(this, context); }
}
class IcuPlaceholder {
    /**
     * @param {?} value
     * @param {?} name
     * @param {?} sourceSpan
     */
    constructor(value, name, sourceSpan) {
        this.value = value;
        this.name = name;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context) { return visitor.visitIcuPlaceholder(this, context); }
}
class CloneVisitor {
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    visitText(text, context) { return new Text$1(text.value, text.sourceSpan); }
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    visitContainer(container, context) {
        const /** @type {?} */ children = container.children.map(n => n.visit(this, context));
        return new Container(children, container.sourceSpan);
    }
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    visitIcu(icu, context) {
        const /** @type {?} */ cases = {};
        Object.keys(icu.cases).forEach(key => cases[key] = icu.cases[key].visit(this, context));
        const /** @type {?} */ msg = new Icu(icu.expression, icu.type, cases, icu.sourceSpan);
        msg.expressionPlaceholder = icu.expressionPlaceholder;
        return msg;
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitTagPlaceholder(ph, context) {
        const /** @type {?} */ children = ph.children.map(n => n.visit(this, context));
        return new TagPlaceholder(ph.tag, ph.attrs, ph.startName, ph.closeName, children, ph.isVoid, ph.sourceSpan);
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitPlaceholder(ph, context) {
        return new Placeholder(ph.value, ph.name, ph.sourceSpan);
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitIcuPlaceholder(ph, context) {
        return new IcuPlaceholder(ph.value, ph.name, ph.sourceSpan);
    }
}
class RecurseVisitor {
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    visitText(text, context) { }
    ;
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    visitContainer(container, context) {
        container.children.forEach(child => child.visit(this));
    }
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    visitIcu(icu, context) {
        Object.keys(icu.cases).forEach(k => { icu.cases[k].visit(this); });
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitTagPlaceholder(ph, context) {
        ph.children.forEach(child => child.visit(this));
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitPlaceholder(ph, context) { }
    ;
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitIcuPlaceholder(ph, context) { }
    ;
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const TAG_TO_PLACEHOLDER_NAMES = {
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
class PlaceholderRegistry {
    constructor() {
        this._placeHolderNameCounts = {};
        this._signatureToName = {};
    }
    /**
     * @param {?} tag
     * @param {?} attrs
     * @param {?} isVoid
     * @return {?}
     */
    getStartTagPlaceholderName(tag, attrs, isVoid) {
        const /** @type {?} */ signature = this._hashTag(tag, attrs, isVoid);
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        const /** @type {?} */ upperTag = tag.toUpperCase();
        const /** @type {?} */ baseName = TAG_TO_PLACEHOLDER_NAMES[upperTag] || `TAG_${upperTag}`;
        const /** @type {?} */ name = this._generateUniqueName(isVoid ? baseName : `START_${baseName}`);
        this._signatureToName[signature] = name;
        return name;
    }
    /**
     * @param {?} tag
     * @return {?}
     */
    getCloseTagPlaceholderName(tag) {
        const /** @type {?} */ signature = this._hashClosingTag(tag);
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        const /** @type {?} */ upperTag = tag.toUpperCase();
        const /** @type {?} */ baseName = TAG_TO_PLACEHOLDER_NAMES[upperTag] || `TAG_${upperTag}`;
        const /** @type {?} */ name = this._generateUniqueName(`CLOSE_${baseName}`);
        this._signatureToName[signature] = name;
        return name;
    }
    /**
     * @param {?} name
     * @param {?} content
     * @return {?}
     */
    getPlaceholderName(name, content) {
        const /** @type {?} */ upperName = name.toUpperCase();
        const /** @type {?} */ signature = `PH: ${upperName}=${content}`;
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        const /** @type {?} */ uniqueName = this._generateUniqueName(upperName);
        this._signatureToName[signature] = uniqueName;
        return uniqueName;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    getUniquePlaceholder(name) {
        return this._generateUniqueName(name.toUpperCase());
    }
    /**
     * @param {?} tag
     * @param {?} attrs
     * @param {?} isVoid
     * @return {?}
     */
    _hashTag(tag, attrs, isVoid) {
        const /** @type {?} */ start = `<${tag}`;
        const /** @type {?} */ strAttrs = Object.keys(attrs).sort().map((name) => ` ${name}=${attrs[name]}`).join('');
        const /** @type {?} */ end = isVoid ? '/>' : `></${tag}>`;
        return start + strAttrs + end;
    }
    /**
     * @param {?} tag
     * @return {?}
     */
    _hashClosingTag(tag) { return this._hashTag(`/${tag}`, {}, false); }
    /**
     * @param {?} base
     * @return {?}
     */
    _generateUniqueName(base) {
        const /** @type {?} */ seen = this._placeHolderNameCounts.hasOwnProperty(base);
        if (!seen) {
            this._placeHolderNameCounts[base] = 1;
            return base;
        }
        const /** @type {?} */ id = this._placeHolderNameCounts[base];
        this._placeHolderNameCounts[base] = id + 1;
        return `${base}_${id}`;
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const _expParser = new Parser(new Lexer());
/**
 * Returns a function converting html nodes to an i18n Message given an interpolationConfig
 * @param {?} interpolationConfig
 * @return {?}
 */
function createI18nMessageFactory(interpolationConfig) {
    const /** @type {?} */ visitor = new _I18nVisitor(_expParser, interpolationConfig);
    return (nodes, meaning, description, id) => visitor.toI18nMessage(nodes, meaning, description, id);
}
class _I18nVisitor {
    /**
     * @param {?} _expressionParser
     * @param {?} _interpolationConfig
     */
    constructor(_expressionParser, _interpolationConfig) {
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
    toI18nMessage(nodes, meaning, description, id) {
        this._isIcu = nodes.length == 1 && nodes[0] instanceof Expansion;
        this._icuDepth = 0;
        this._placeholderRegistry = new PlaceholderRegistry();
        this._placeholderToContent = {};
        this._placeholderToMessage = {};
        const /** @type {?} */ i18nodes = visitAll(this, nodes, {});
        return new Message(i18nodes, this._placeholderToContent, this._placeholderToMessage, meaning, description, id);
    }
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    visitElement(el, context) {
        const /** @type {?} */ children = visitAll(this, el.children);
        const /** @type {?} */ attrs = {};
        el.attrs.forEach(attr => {
            // Do not visit the attributes, translatable ones are top-level ASTs
            attrs[attr.name] = attr.value;
        });
        const /** @type {?} */ isVoid = getHtmlTagDefinition(el.name).isVoid;
        const /** @type {?} */ startPhName = this._placeholderRegistry.getStartTagPlaceholderName(el.name, attrs, isVoid);
        this._placeholderToContent[startPhName] = ((el.sourceSpan)).toString();
        let /** @type {?} */ closePhName = '';
        if (!isVoid) {
            closePhName = this._placeholderRegistry.getCloseTagPlaceholderName(el.name);
            this._placeholderToContent[closePhName] = `</${el.name}>`;
        }
        return new TagPlaceholder(el.name, attrs, startPhName, closePhName, children, isVoid, /** @type {?} */ ((el.sourceSpan)));
    }
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    visitAttribute(attribute, context) {
        return this._visitTextWithInterpolation(attribute.value, attribute.sourceSpan);
    }
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    visitText(text, context) {
        return this._visitTextWithInterpolation(text.value, /** @type {?} */ ((text.sourceSpan)));
    }
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    visitComment(comment, context) { return null; }
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    visitExpansion(icu, context) {
        this._icuDepth++;
        const /** @type {?} */ i18nIcuCases = {};
        const /** @type {?} */ i18nIcu = new Icu(icu.switchValue, icu.type, i18nIcuCases, icu.sourceSpan);
        icu.cases.forEach((caze) => {
            i18nIcuCases[caze.value] = new Container(caze.expression.map((node) => node.visit(this, {})), caze.expSourceSpan);
        });
        this._icuDepth--;
        if (this._isIcu || this._icuDepth > 0) {
            // Returns an ICU node when:
            // - the message (vs a part of the message) is an ICU message, or
            // - the ICU message is nested.
            const /** @type {?} */ expPh = this._placeholderRegistry.getUniquePlaceholder(`VAR_${icu.type}`);
            i18nIcu.expressionPlaceholder = expPh;
            this._placeholderToContent[expPh] = icu.switchValue;
            return i18nIcu;
        }
        // Else returns a placeholder
        // ICU placeholders should not be replaced with their original content but with the their
        // translations. We need to create a new visitor (they are not re-entrant) to compute the
        // message id.
        // TODO(vicb): add a html.Node -> i18n.Message cache to avoid having to re-create the msg
        const /** @type {?} */ phName = this._placeholderRegistry.getPlaceholderName('ICU', icu.sourceSpan.toString());
        const /** @type {?} */ visitor = new _I18nVisitor(this._expressionParser, this._interpolationConfig);
        this._placeholderToMessage[phName] = visitor.toI18nMessage([icu], '', '', '');
        return new IcuPlaceholder(i18nIcu, phName, icu.sourceSpan);
    }
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    visitExpansionCase(icuCase, context) {
        throw new Error('Unreachable code');
    }
    /**
     * @param {?} text
     * @param {?} sourceSpan
     * @return {?}
     */
    _visitTextWithInterpolation(text, sourceSpan) {
        const /** @type {?} */ splitInterpolation = this._expressionParser.splitInterpolation(text, sourceSpan.start.toString(), this._interpolationConfig);
        if (!splitInterpolation) {
            // No expression, return a single text
            return new Text$1(text, sourceSpan);
        }
        // Return a group of text + expressions
        const /** @type {?} */ nodes = [];
        const /** @type {?} */ container = new Container(nodes, sourceSpan);
        const { start: sDelimiter, end: eDelimiter } = this._interpolationConfig;
        for (let /** @type {?} */ i = 0; i < splitInterpolation.strings.length - 1; i++) {
            const /** @type {?} */ expression = splitInterpolation.expressions[i];
            const /** @type {?} */ baseName = _extractPlaceholderName(expression) || 'INTERPOLATION';
            const /** @type {?} */ phName = this._placeholderRegistry.getPlaceholderName(baseName, expression);
            if (splitInterpolation.strings[i].length) {
                // No need to add empty strings
                nodes.push(new Text$1(splitInterpolation.strings[i], sourceSpan));
            }
            nodes.push(new Placeholder(expression, phName, sourceSpan));
            this._placeholderToContent[phName] = sDelimiter + expression + eDelimiter;
        }
        // The last index contains no expression
        const /** @type {?} */ lastStringIdx = splitInterpolation.strings.length - 1;
        if (splitInterpolation.strings[lastStringIdx].length) {
            nodes.push(new Text$1(splitInterpolation.strings[lastStringIdx], sourceSpan));
        }
        return container;
    }
}
const _CUSTOM_PH_EXP = /\/\/[\s\S]*i18n[\s\S]*\([\s\S]*ph[\s\S]*=[\s\S]*("|')([\s\S]*?)\1[\s\S]*\)/g;
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
class I18nError extends ParseError {
    /**
     * @param {?} span
     * @param {?} msg
     */
    constructor(span, msg) { super(span, msg); }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const _I18N_ATTR = 'i18n';
const _I18N_ATTR_PREFIX = 'i18n-';
const _I18N_COMMENT_PREFIX_REGEXP = /^i18n:?/;
const MEANING_SEPARATOR = '|';
const ID_SEPARATOR = '@@';
/**
 * Extract translatable messages from an html AST
 * @param {?} nodes
 * @param {?} interpolationConfig
 * @param {?} implicitTags
 * @param {?} implicitAttrs
 * @return {?}
 */
function extractMessages(nodes, interpolationConfig, implicitTags, implicitAttrs) {
    const /** @type {?} */ visitor = new _Visitor(implicitTags, implicitAttrs);
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
    const /** @type {?} */ visitor = new _Visitor(implicitTags, implicitAttrs);
    return visitor.merge(nodes, translations, interpolationConfig);
}
class ExtractionResult {
    /**
     * @param {?} messages
     * @param {?} errors
     */
    constructor(messages, errors) {
        this.messages = messages;
        this.errors = errors;
    }
}
let _VisitorMode = {};
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
class _Visitor {
    /**
     * @param {?} _implicitTags
     * @param {?} _implicitAttrs
     */
    constructor(_implicitTags, _implicitAttrs) {
        this._implicitTags = _implicitTags;
        this._implicitAttrs = _implicitAttrs;
    }
    /**
     * Extracts the messages from the tree
     * @param {?} nodes
     * @param {?} interpolationConfig
     * @return {?}
     */
    extract(nodes, interpolationConfig) {
        this._init(_VisitorMode.Extract, interpolationConfig);
        nodes.forEach(node => node.visit(this, null));
        if (this._inI18nBlock) {
            this._reportError(nodes[nodes.length - 1], 'Unclosed block');
        }
        return new ExtractionResult(this._messages, this._errors);
    }
    /**
     * Returns a tree where all translatable nodes are translated
     * @param {?} nodes
     * @param {?} translations
     * @param {?} interpolationConfig
     * @return {?}
     */
    merge(nodes, translations, interpolationConfig) {
        this._init(_VisitorMode.Merge, interpolationConfig);
        this._translations = translations;
        // Construct a single fake root element
        const /** @type {?} */ wrapper = new Element('wrapper', [], nodes, /** @type {?} */ ((undefined)), undefined, undefined);
        const /** @type {?} */ translatedNode = wrapper.visit(this, null);
        if (this._inI18nBlock) {
            this._reportError(nodes[nodes.length - 1], 'Unclosed block');
        }
        return new ParseTreeResult(translatedNode.children, this._errors);
    }
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    visitExpansionCase(icuCase, context) {
        // Parse cases for translatable html attributes
        const /** @type {?} */ expression = visitAll(this, icuCase.expression, context);
        if (this._mode === _VisitorMode.Merge) {
            return new ExpansionCase(icuCase.value, expression, icuCase.sourceSpan, icuCase.valueSourceSpan, icuCase.expSourceSpan);
        }
    }
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    visitExpansion(icu, context) {
        this._mayBeAddBlockChildren(icu);
        const /** @type {?} */ wasInIcu = this._inIcu;
        if (!this._inIcu) {
            // nested ICU messages should not be extracted but top-level translated as a whole
            if (this._isInTranslatableSection) {
                this._addMessage([icu]);
            }
            this._inIcu = true;
        }
        const /** @type {?} */ cases = visitAll(this, icu.cases, context);
        if (this._mode === _VisitorMode.Merge) {
            icu = new Expansion(icu.switchValue, icu.type, cases, icu.sourceSpan, icu.switchValueSourceSpan);
        }
        this._inIcu = wasInIcu;
        return icu;
    }
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    visitComment(comment, context) {
        const /** @type {?} */ isOpening = _isOpeningComment(comment);
        if (isOpening && this._isInTranslatableSection) {
            this._reportError(comment, 'Could not start a block inside a translatable section');
            return;
        }
        const /** @type {?} */ isClosing = _isClosingComment(comment);
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
                        const /** @type {?} */ message = ((this._addMessage(this._blockChildren, this._blockMeaningAndDesc)));
                        // merge attributes in sections
                        const /** @type {?} */ nodes = this._translateMessage(comment, message);
                        return visitAll(this, nodes);
                    }
                    else {
                        this._reportError(comment, 'I18N blocks should not cross element boundaries');
                        return;
                    }
                }
            }
        }
    }
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    visitText(text, context) {
        if (this._isInTranslatableSection) {
            this._mayBeAddBlockChildren(text);
        }
        return text;
    }
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    visitElement(el, context) {
        this._mayBeAddBlockChildren(el);
        this._depth++;
        const /** @type {?} */ wasInI18nNode = this._inI18nNode;
        const /** @type {?} */ wasInImplicitNode = this._inImplicitNode;
        let /** @type {?} */ childNodes = [];
        let /** @type {?} */ translatedChildNodes = ((undefined));
        // Extract:
        // - top level nodes with the (implicit) "i18n" attribute if not already in a section
        // - ICU messages
        const /** @type {?} */ i18nAttr = _getI18nAttr(el);
        const /** @type {?} */ i18nMeta = i18nAttr ? i18nAttr.value : '';
        const /** @type {?} */ isImplicit = this._implicitTags.some(tag => el.name === tag) && !this._inIcu &&
            !this._isInTranslatableSection;
        const /** @type {?} */ isTopLevelImplicit = !wasInImplicitNode && isImplicit;
        this._inImplicitNode = wasInImplicitNode || isImplicit;
        if (!this._isInTranslatableSection && !this._inIcu) {
            if (i18nAttr || isTopLevelImplicit) {
                this._inI18nNode = true;
                const /** @type {?} */ message = ((this._addMessage(el.children, i18nMeta)));
                translatedChildNodes = this._translateMessage(el, message);
            }
            if (this._mode == _VisitorMode.Extract) {
                const /** @type {?} */ isTranslatable = i18nAttr || isTopLevelImplicit;
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
            const /** @type {?} */ visitNodes = translatedChildNodes || el.children;
            visitNodes.forEach(child => {
                const /** @type {?} */ visited = child.visit(this, context);
                if (visited && !this._isInTranslatableSection) {
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
            const /** @type {?} */ translatedAttrs = this._translateAttributes(el);
            return new Element(el.name, translatedAttrs, childNodes, el.sourceSpan, el.startSourceSpan, el.endSourceSpan);
        }
        return null;
    }
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    visitAttribute(attribute, context) {
        throw new Error('unreachable code');
    }
    /**
     * @param {?} mode
     * @param {?} interpolationConfig
     * @return {?}
     */
    _init(mode, interpolationConfig) {
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
    }
    /**
     * @param {?} el
     * @return {?}
     */
    _visitAttributesOf(el) {
        const /** @type {?} */ explicitAttrNameToValue = {};
        const /** @type {?} */ implicitAttrNames = this._implicitAttrs[el.name] || [];
        el.attrs.filter(attr => attr.name.startsWith(_I18N_ATTR_PREFIX))
            .forEach(attr => explicitAttrNameToValue[attr.name.slice(_I18N_ATTR_PREFIX.length)] =
            attr.value);
        el.attrs.forEach(attr => {
            if (attr.name in explicitAttrNameToValue) {
                this._addMessage([attr], explicitAttrNameToValue[attr.name]);
            }
            else if (implicitAttrNames.some(name => attr.name === name)) {
                this._addMessage([attr]);
            }
        });
    }
    /**
     * @param {?} ast
     * @param {?=} msgMeta
     * @return {?}
     */
    _addMessage(ast, msgMeta) {
        if (ast.length == 0 ||
            ast.length == 1 && ast[0] instanceof Attribute$1 && !((ast[0])).value) {
            // Do not create empty messages
            return null;
        }
        const { meaning, description, id } = _parseMessageMeta(msgMeta);
        const /** @type {?} */ message = this._createI18nMessage(ast, meaning, description, id);
        this._messages.push(message);
        return message;
    }
    /**
     * @param {?} el
     * @param {?} message
     * @return {?}
     */
    _translateMessage(el, message) {
        if (message && this._mode === _VisitorMode.Merge) {
            const /** @type {?} */ nodes = this._translations.get(message);
            if (nodes) {
                return nodes;
            }
            this._reportError(el, `Translation unavailable for message id="${this._translations.digest(message)}"`);
        }
        return [];
    }
    /**
     * @param {?} el
     * @return {?}
     */
    _translateAttributes(el) {
        const /** @type {?} */ attributes = el.attrs;
        const /** @type {?} */ i18nParsedMessageMeta = {};
        attributes.forEach(attr => {
            if (attr.name.startsWith(_I18N_ATTR_PREFIX)) {
                i18nParsedMessageMeta[attr.name.slice(_I18N_ATTR_PREFIX.length)] =
                    _parseMessageMeta(attr.value);
            }
        });
        const /** @type {?} */ translatedAttributes = [];
        attributes.forEach((attr) => {
            if (attr.name === _I18N_ATTR || attr.name.startsWith(_I18N_ATTR_PREFIX)) {
                // strip i18n specific attributes
                return;
            }
            if (attr.value && attr.value != '' && i18nParsedMessageMeta.hasOwnProperty(attr.name)) {
                const { meaning, description, id } = i18nParsedMessageMeta[attr.name];
                const /** @type {?} */ message = this._createI18nMessage([attr], meaning, description, id);
                const /** @type {?} */ nodes = this._translations.get(message);
                if (nodes) {
                    if (nodes.length == 0) {
                        translatedAttributes.push(new Attribute$1(attr.name, '', attr.sourceSpan));
                    }
                    else if (nodes[0] instanceof Text) {
                        const /** @type {?} */ value = ((nodes[0])).value;
                        translatedAttributes.push(new Attribute$1(attr.name, value, attr.sourceSpan));
                    }
                    else {
                        this._reportError(el, `Unexpected translation for attribute "${attr.name}" (id="${id || this._translations.digest(message)}")`);
                    }
                }
                else {
                    this._reportError(el, `Translation unavailable for attribute "${attr.name}" (id="${id || this._translations.digest(message)}")`);
                }
            }
            else {
                translatedAttributes.push(attr);
            }
        });
        return translatedAttributes;
    }
    /**
     * Add the node as a child of the block when:
     * - we are in a block,
     * - we are not inside a ICU message (those are handled separately),
     * - the node is a "direct child" of the block
     * @param {?} node
     * @return {?}
     */
    _mayBeAddBlockChildren(node) {
        if (this._inI18nBlock && !this._inIcu && this._depth == this._blockStartDepth) {
            this._blockChildren.push(node);
        }
    }
    /**
     * Marks the start of a section, see `_closeTranslatableSection`
     * @param {?} node
     * @return {?}
     */
    _openTranslatableSection(node) {
        if (this._isInTranslatableSection) {
            this._reportError(node, 'Unexpected section start');
        }
        else {
            this._msgCountAtSectionStart = this._messages.length;
        }
    }
    /**
     * A translatable section could be:
     * - the content of translatable element,
     * - nodes between `<!-- i18n -->` and `<!-- /i18n -->` comments
     * @return {?}
     */
    get _isInTranslatableSection() {
        return this._msgCountAtSectionStart !== void 0;
    }
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
    _closeTranslatableSection(node, directChildren) {
        if (!this._isInTranslatableSection) {
            this._reportError(node, 'Unexpected section end');
            return;
        }
        const /** @type {?} */ startIndex = this._msgCountAtSectionStart;
        const /** @type {?} */ significantChildren = directChildren.reduce((count, node) => count + (node instanceof Comment ? 0 : 1), 0);
        if (significantChildren == 1) {
            for (let /** @type {?} */ i = this._messages.length - 1; i >= startIndex; i--) {
                const /** @type {?} */ ast = this._messages[i].nodes;
                if (!(ast.length == 1 && ast[0] instanceof Text$1)) {
                    this._messages.splice(i, 1);
                    break;
                }
            }
        }
        this._msgCountAtSectionStart = undefined;
    }
    /**
     * @param {?} node
     * @param {?} msg
     * @return {?}
     */
    _reportError(node, msg) {
        this._errors.push(new I18nError(/** @type {?} */ ((node.sourceSpan)), msg));
    }
}
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
    return p.attrs.find(attr => attr.name === _I18N_ATTR) || null;
}
/**
 * @param {?=} i18n
 * @return {?}
 */
function _parseMessageMeta(i18n) {
    if (!i18n)
        return { meaning: '', description: '', id: '' };
    const /** @type {?} */ idIndex = i18n.indexOf(ID_SEPARATOR);
    const /** @type {?} */ descIndex = i18n.indexOf(MEANING_SEPARATOR);
    const [meaningAndDesc, id] = (idIndex > -1) ? [i18n.slice(0, idIndex), i18n.slice(idIndex + 2)] : [i18n, ''];
    const [meaning, description] = (descIndex > -1) ?
        [meaningAndDesc.slice(0, descIndex), meaningAndDesc.slice(descIndex + 1)] :
        ['', meaningAndDesc];
    return { meaning, description, id };
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class XmlTagDefinition {
    constructor() {
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
    requireExtraParent(currentParent) { return false; }
    /**
     * @param {?} name
     * @return {?}
     */
    isClosedByChild(name) { return false; }
}
const _TAG_DEFINITION = new XmlTagDefinition();
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
class XmlParser extends Parser$1 {
    constructor() { super(getXmlTagDefinition); }
    /**
     * @param {?} source
     * @param {?} url
     * @param {?=} parseExpansionForms
     * @return {?}
     */
    parse(source, url, parseExpansionForms = false) {
        return super.parse(source, url, parseExpansionForms);
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
 * @param {?} message
 * @return {?}
 */
function digest(message) {
    return message.id || sha1(serializeNodes(message.nodes).join('') + `[${message.meaning}]`);
}
/**
 * @param {?} message
 * @return {?}
 */
function decimalDigest(message) {
    if (message.id) {
        return message.id;
    }
    const /** @type {?} */ visitor = new _SerializerIgnoreIcuExpVisitor();
    const /** @type {?} */ parts = message.nodes.map(a => a.visit(visitor, null));
    return computeMsgId(parts.join(''), message.meaning);
}
/**
 * Serialize the i18n ast to something xml-like in order to generate an UID.
 *
 * The visitor is also used in the i18n parser tests
 *
 * \@internal
 */
class _SerializerVisitor {
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    visitText(text, context) { return text.value; }
    /**
     * @param {?} container
     * @param {?} context
     * @return {?}
     */
    visitContainer(container, context) {
        return `[${container.children.map(child => child.visit(this)).join(', ')}]`;
    }
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    visitIcu(icu, context) {
        const /** @type {?} */ strCases = Object.keys(icu.cases).map((k) => `${k} {${icu.cases[k].visit(this)}}`);
        return `{${icu.expression}, ${icu.type}, ${strCases.join(', ')}}`;
    }
    /**
     * @param {?} ph
     * @param {?} context
     * @return {?}
     */
    visitTagPlaceholder(ph, context) {
        return ph.isVoid ?
            `<ph tag name="${ph.startName}"/>` :
            `<ph tag name="${ph.startName}">${ph.children.map(child => child.visit(this)).join(', ')}</ph name="${ph.closeName}">`;
    }
    /**
     * @param {?} ph
     * @param {?} context
     * @return {?}
     */
    visitPlaceholder(ph, context) {
        return ph.value ? `<ph name="${ph.name}">${ph.value}</ph>` : `<ph name="${ph.name}"/>`;
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitIcuPlaceholder(ph, context) {
        return `<ph icu name="${ph.name}">${ph.value.visit(this)}</ph>`;
    }
}
const serializerVisitor = new _SerializerVisitor();
/**
 * @param {?} nodes
 * @return {?}
 */
function serializeNodes(nodes) {
    return nodes.map(a => a.visit(serializerVisitor, null));
}
/**
 * Serialize the i18n ast to something xml-like in order to generate an UID.
 *
 * Ignore the ICU expressions so that message IDs stays identical if only the expression changes.
 *
 * \@internal
 */
class _SerializerIgnoreIcuExpVisitor extends _SerializerVisitor {
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    visitIcu(icu, context) {
        let /** @type {?} */ strCases = Object.keys(icu.cases).map((k) => `${k} {${icu.cases[k].visit(this)}}`);
        // Do not take the expression into account
        return `{${icu.type}, ${strCases.join(', ')}}`;
    }
}
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
    const /** @type {?} */ utf8 = utf8Encode(str);
    const /** @type {?} */ words32 = stringToWords32(utf8, Endian.Big);
    const /** @type {?} */ len = utf8.length * 8;
    const /** @type {?} */ w = new Array(80);
    let [a, b, c, d, e] = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
    words32[len >> 5] |= 0x80 << (24 - len % 32);
    words32[((len + 64 >> 9) << 4) + 15] = len;
    for (let /** @type {?} */ i = 0; i < words32.length; i += 16) {
        const [h0, h1, h2, h3, h4] = [a, b, c, d, e];
        for (let /** @type {?} */ j = 0; j < 80; j++) {
            if (j < 16) {
                w[j] = words32[i + j];
            }
            else {
                w[j] = rol32(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            }
            const [f, k] = fk(j, b, c, d);
            const /** @type {?} */ temp = [rol32(a, 5), f, e, k, w[j]].reduce(add32);
            [e, d, c, b, a] = [d, c, rol32(b, 30), a, temp];
        }
        [a, b, c, d, e] = [add32(a, h0), add32(b, h1), add32(c, h2), add32(d, h3), add32(e, h4)];
    }
    return byteStringToHexString(words32ToByteString([a, b, c, d, e]));
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
    const /** @type {?} */ utf8 = utf8Encode(str);
    let [hi, lo] = [hash32(utf8, 0), hash32(utf8, 102072)];
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
    let [hi, lo] = fingerprint(msg);
    if (meaning) {
        const [him, lom] = fingerprint(meaning);
        [hi, lo] = add64(rol64([hi, lo], 1), [him, lom]);
    }
    return byteStringToDecString(words32ToByteString([hi & 0x7fffffff, lo]));
}
/**
 * @param {?} str
 * @param {?} c
 * @return {?}
 */
function hash32(str, c) {
    let [a, b] = [0x9e3779b9, 0x9e3779b9];
    let /** @type {?} */ i;
    const /** @type {?} */ len = str.length;
    for (i = 0; i + 12 <= len; i += 12) {
        a = add32(a, wordAt(str, i, Endian.Little));
        b = add32(b, wordAt(str, i + 4, Endian.Little));
        c = add32(c, wordAt(str, i + 8, Endian.Little));
        [a, b, c] = mix([a, b, c]);
    }
    a = add32(a, wordAt(str, i, Endian.Little));
    b = add32(b, wordAt(str, i + 4, Endian.Little));
    // the first byte of c is reserved for the length
    c = add32(c, len);
    c = add32(c, wordAt(str, i + 8, Endian.Little) << 8);
    return mix([a, b, c])[2];
}
/**
 * @param {?} __0
 * @return {?}
 */
function mix([a, b, c]) {
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
let Endian = {};
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
    const /** @type {?} */ low = (a & 0xffff) + (b & 0xffff);
    const /** @type {?} */ high = (a >>> 16) + (b >>> 16) + (low >>> 16);
    return [high >>> 16, (high << 16) | (low & 0xffff)];
}
/**
 * @param {?} __0
 * @param {?} __1
 * @return {?}
 */
function add64([ah, al], [bh, bl]) {
    const [carry, l] = add32to64(al, bl);
    const /** @type {?} */ h = add32(add32(ah, bh), carry);
    return [h, l];
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function sub32(a, b) {
    const /** @type {?} */ low = (a & 0xffff) - (b & 0xffff);
    const /** @type {?} */ high = (a >> 16) - (b >> 16) + (low >> 16);
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
function rol64([hi, lo], count) {
    const /** @type {?} */ h = (hi << count) | (lo >>> (32 - count));
    const /** @type {?} */ l = (lo << count) | (hi >>> (32 - count));
    return [h, l];
}
/**
 * @param {?} str
 * @param {?} endian
 * @return {?}
 */
function stringToWords32(str, endian) {
    const /** @type {?} */ words32 = Array((str.length + 3) >>> 2);
    for (let /** @type {?} */ i = 0; i < words32.length; i++) {
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
    let /** @type {?} */ word = 0;
    if (endian === Endian.Big) {
        for (let /** @type {?} */ i = 0; i < 4; i++) {
            word += byteAt(str, index + i) << (24 - 8 * i);
        }
    }
    else {
        for (let /** @type {?} */ i = 0; i < 4; i++) {
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
    return words32.reduce((str, word) => str + word32ToByteString(word), '');
}
/**
 * @param {?} word
 * @return {?}
 */
function word32ToByteString(word) {
    let /** @type {?} */ str = '';
    for (let /** @type {?} */ i = 0; i < 4; i++) {
        str += String.fromCharCode((word >>> 8 * (3 - i)) & 0xff);
    }
    return str;
}
/**
 * @param {?} str
 * @return {?}
 */
function byteStringToHexString(str) {
    let /** @type {?} */ hex = '';
    for (let /** @type {?} */ i = 0; i < str.length; i++) {
        const /** @type {?} */ b = byteAt(str, i);
        hex += (b >>> 4).toString(16) + (b & 0x0f).toString(16);
    }
    return hex.toLowerCase();
}
/**
 * @param {?} str
 * @return {?}
 */
function byteStringToDecString(str) {
    let /** @type {?} */ decimal = '';
    let /** @type {?} */ toThePower = '1';
    for (let /** @type {?} */ i = str.length - 1; i >= 0; i--) {
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
    let /** @type {?} */ sum = '';
    const /** @type {?} */ len = Math.max(x.length, y.length);
    for (let /** @type {?} */ i = 0, /** @type {?} */ carry = 0; i < len || carry; i++) {
        const /** @type {?} */ tmpSum = carry + +(x[i] || 0) + +(y[i] || 0);
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
    let /** @type {?} */ product = '';
    let /** @type {?} */ bToThePower = b;
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
class Serializer {
    /**
     * @abstract
     * @param {?} messages
     * @param {?} locale
     * @return {?}
     */
    write(messages, locale) { }
    /**
     * @abstract
     * @param {?} content
     * @param {?} url
     * @return {?}
     */
    load(content, url) { }
    /**
     * @abstract
     * @param {?} message
     * @return {?}
     */
    digest(message) { }
    /**
     * @param {?} message
     * @return {?}
     */
    createNameMapper(message) { return null; }
}
/**
 * A simple mapper that take a function to transform an internal name to a public name
 */
class SimplePlaceholderMapper extends RecurseVisitor {
    /**
     * @param {?} message
     * @param {?} mapName
     */
    constructor(message, mapName) {
        super();
        this.mapName = mapName;
        this.internalToPublic = {};
        this.publicToNextId = {};
        this.publicToInternal = {};
        message.nodes.forEach(node => node.visit(this));
    }
    /**
     * @param {?} internalName
     * @return {?}
     */
    toPublicName(internalName) {
        return this.internalToPublic.hasOwnProperty(internalName) ?
            this.internalToPublic[internalName] :
            null;
    }
    /**
     * @param {?} publicName
     * @return {?}
     */
    toInternalName(publicName) {
        return this.publicToInternal.hasOwnProperty(publicName) ? this.publicToInternal[publicName] :
            null;
    }
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    visitText(text, context) { return null; }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitTagPlaceholder(ph, context) {
        this.visitPlaceholderName(ph.startName);
        super.visitTagPlaceholder(ph, context);
        this.visitPlaceholderName(ph.closeName);
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitPlaceholder(ph, context) { this.visitPlaceholderName(ph.name); }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitIcuPlaceholder(ph, context) {
        this.visitPlaceholderName(ph.name);
    }
    /**
     * @param {?} internalName
     * @return {?}
     */
    visitPlaceholderName(internalName) {
        if (!internalName || this.internalToPublic.hasOwnProperty(internalName)) {
            return;
        }
        let /** @type {?} */ publicName = this.mapName(internalName);
        if (this.publicToInternal.hasOwnProperty(publicName)) {
            // Create a new XMB when it has already been used
            const /** @type {?} */ nextId = this.publicToNextId[publicName];
            this.publicToNextId[publicName] = nextId + 1;
            publicName = `${publicName}_${nextId}`;
        }
        else {
            this.publicToNextId[publicName] = 1;
        }
        this.internalToPublic[internalName] = publicName;
        this.publicToInternal[publicName] = internalName;
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class _Visitor$1 {
    /**
     * @param {?} tag
     * @return {?}
     */
    visitTag(tag) {
        const /** @type {?} */ strAttrs = this._serializeAttributes(tag.attrs);
        if (tag.children.length == 0) {
            return `<${tag.name}${strAttrs}/>`;
        }
        const /** @type {?} */ strChildren = tag.children.map(node => node.visit(this));
        return `<${tag.name}${strAttrs}>${strChildren.join('')}</${tag.name}>`;
    }
    /**
     * @param {?} text
     * @return {?}
     */
    visitText(text) { return text.value; }
    /**
     * @param {?} decl
     * @return {?}
     */
    visitDeclaration(decl) {
        return `<?xml${this._serializeAttributes(decl.attrs)} ?>`;
    }
    /**
     * @param {?} attrs
     * @return {?}
     */
    _serializeAttributes(attrs) {
        const /** @type {?} */ strAttrs = Object.keys(attrs).map((name) => `${name}="${attrs[name]}"`).join(' ');
        return strAttrs.length > 0 ? ' ' + strAttrs : '';
    }
    /**
     * @param {?} doctype
     * @return {?}
     */
    visitDoctype(doctype) {
        return `<!DOCTYPE ${doctype.rootTag} [\n${doctype.dtd}\n]>`;
    }
}
const _visitor = new _Visitor$1();
/**
 * @param {?} nodes
 * @return {?}
 */
function serialize(nodes) {
    return nodes.map((node) => node.visit(_visitor)).join('');
}
class Declaration {
    /**
     * @param {?} unescapedAttrs
     */
    constructor(unescapedAttrs) {
        this.attrs = {};
        Object.keys(unescapedAttrs).forEach((k) => {
            this.attrs[k] = _escapeXml(unescapedAttrs[k]);
        });
    }
    /**
     * @param {?} visitor
     * @return {?}
     */
    visit(visitor) { return visitor.visitDeclaration(this); }
}
class Doctype {
    /**
     * @param {?} rootTag
     * @param {?} dtd
     */
    constructor(rootTag, dtd) {
        this.rootTag = rootTag;
        this.dtd = dtd;
    }
    ;
    /**
     * @param {?} visitor
     * @return {?}
     */
    visit(visitor) { return visitor.visitDoctype(this); }
}
class Tag {
    /**
     * @param {?} name
     * @param {?=} unescapedAttrs
     * @param {?=} children
     */
    constructor(name, unescapedAttrs = {}, children = []) {
        this.name = name;
        this.children = children;
        this.attrs = {};
        Object.keys(unescapedAttrs).forEach((k) => {
            this.attrs[k] = _escapeXml(unescapedAttrs[k]);
        });
    }
    /**
     * @param {?} visitor
     * @return {?}
     */
    visit(visitor) { return visitor.visitTag(this); }
}
class Text$2 {
    /**
     * @param {?} unescapedValue
     */
    constructor(unescapedValue) { this.value = _escapeXml(unescapedValue); }
    ;
    /**
     * @param {?} visitor
     * @return {?}
     */
    visit(visitor) { return visitor.visitText(this); }
}
class CR extends Text$2 {
    /**
     * @param {?=} ws
     */
    constructor(ws = 0) { super(`\n${new Array(ws + 1).join(' ')}`); }
}
const _ESCAPED_CHARS = [
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
    return _ESCAPED_CHARS.reduce((text, entry) => text.replace(entry[0], entry[1]), text);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const _VERSION = '1.2';
const _XMLNS = 'urn:oasis:names:tc:xliff:document:1.2';
// TODO(vicb): make this a param (s/_/-/)
const _DEFAULT_SOURCE_LANG = 'en';
const _PLACEHOLDER_TAG = 'x';
const _FILE_TAG = 'file';
const _SOURCE_TAG = 'source';
const _TARGET_TAG = 'target';
const _UNIT_TAG = 'trans-unit';
const _CONTEXT_GROUP_TAG = 'context-group';
const _CONTEXT_TAG = 'context';
class Xliff extends Serializer {
    /**
     * @param {?} messages
     * @param {?} locale
     * @return {?}
     */
    write(messages, locale) {
        const /** @type {?} */ visitor = new _WriteVisitor();
        const /** @type {?} */ transUnits = [];
        messages.forEach(message => {
            let /** @type {?} */ contextTags = [];
            message.sources.forEach((source) => {
                let /** @type {?} */ contextGroupTag = new Tag(_CONTEXT_GROUP_TAG, { purpose: 'location' });
                contextGroupTag.children.push(new CR(10), new Tag(_CONTEXT_TAG, { 'context-type': 'sourcefile' }, [new Text$2(source.filePath)]), new CR(10), new Tag(_CONTEXT_TAG, { 'context-type': 'linenumber' }, [new Text$2(`${source.startLine}`)]), new CR(8));
                contextTags.push(new CR(8), contextGroupTag);
            });
            const /** @type {?} */ transUnit = new Tag(_UNIT_TAG, { id: message.id, datatype: 'html' });
            transUnit.children.push(new CR(8), new Tag(_SOURCE_TAG, {}, visitor.serialize(message.nodes)), new CR(8), new Tag(_TARGET_TAG), ...contextTags);
            if (message.description) {
                transUnit.children.push(new CR(8), new Tag('note', { priority: '1', from: 'description' }, [new Text$2(message.description)]));
            }
            if (message.meaning) {
                transUnit.children.push(new CR(8), new Tag('note', { priority: '1', from: 'meaning' }, [new Text$2(message.meaning)]));
            }
            transUnit.children.push(new CR(6));
            transUnits.push(new CR(6), transUnit);
        });
        const /** @type {?} */ body = new Tag('body', {}, [...transUnits, new CR(4)]);
        const /** @type {?} */ file = new Tag('file', {
            'source-language': locale || _DEFAULT_SOURCE_LANG,
            datatype: 'plaintext',
            original: 'ng2.template',
        }, [new CR(4), body, new CR(2)]);
        const /** @type {?} */ xliff = new Tag('xliff', { version: _VERSION, xmlns: _XMLNS }, [new CR(2), file, new CR()]);
        return serialize([
            new Declaration({ version: '1.0', encoding: 'UTF-8' }), new CR(), xliff, new CR()
        ]);
    }
    /**
     * @param {?} content
     * @param {?} url
     * @return {?}
     */
    load(content, url) {
        // xliff to xml nodes
        const /** @type {?} */ xliffParser = new XliffParser();
        const { locale, msgIdToHtml, errors } = xliffParser.parse(content, url);
        // xml nodes to i18n nodes
        const /** @type {?} */ i18nNodesByMsgId = {};
        const /** @type {?} */ converter = new XmlToI18n();
        Object.keys(msgIdToHtml).forEach(msgId => {
            const { i18nNodes, errors: e } = converter.convert(msgIdToHtml[msgId], url);
            errors.push(...e);
            i18nNodesByMsgId[msgId] = i18nNodes;
        });
        if (errors.length) {
            throw new Error(`xliff parse errors:\n${errors.join('\n')}`);
        }
        return { locale: /** @type {?} */ ((locale)), i18nNodesByMsgId };
    }
    /**
     * @param {?} message
     * @return {?}
     */
    digest(message) { return digest(message); }
}
class _WriteVisitor {
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    visitText(text, context) { return [new Text$2(text.value)]; }
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    visitContainer(container, context) {
        const /** @type {?} */ nodes = [];
        container.children.forEach((node) => nodes.push(...node.visit(this)));
        return nodes;
    }
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    visitIcu(icu, context) {
        const /** @type {?} */ nodes = [new Text$2(`{${icu.expressionPlaceholder}, ${icu.type}, `)];
        Object.keys(icu.cases).forEach((c) => {
            nodes.push(new Text$2(`${c} {`), ...icu.cases[c].visit(this), new Text$2(`} `));
        });
        nodes.push(new Text$2(`}`));
        return nodes;
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitTagPlaceholder(ph, context) {
        const /** @type {?} */ ctype = getCtypeForTag(ph.tag);
        const /** @type {?} */ startTagPh = new Tag(_PLACEHOLDER_TAG, { id: ph.startName, ctype });
        if (ph.isVoid) {
            // void tags have no children nor closing tags
            return [startTagPh];
        }
        const /** @type {?} */ closeTagPh = new Tag(_PLACEHOLDER_TAG, { id: ph.closeName, ctype });
        return [startTagPh, ...this.serialize(ph.children), closeTagPh];
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitPlaceholder(ph, context) {
        return [new Tag(_PLACEHOLDER_TAG, { id: ph.name })];
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitIcuPlaceholder(ph, context) {
        return [new Tag(_PLACEHOLDER_TAG, { id: ph.name })];
    }
    /**
     * @param {?} nodes
     * @return {?}
     */
    serialize(nodes) {
        return [].concat(...nodes.map(node => node.visit(this)));
    }
}
class XliffParser {
    constructor() {
        this._locale = null;
    }
    /**
     * @param {?} xliff
     * @param {?} url
     * @return {?}
     */
    parse(xliff, url) {
        this._unitMlString = null;
        this._msgIdToHtml = {};
        const /** @type {?} */ xml = new XmlParser().parse(xliff, url, false);
        this._errors = xml.errors;
        visitAll(this, xml.rootNodes, null);
        return {
            msgIdToHtml: this._msgIdToHtml,
            errors: this._errors,
            locale: this._locale,
        };
    }
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    visitElement(element, context) {
        switch (element.name) {
            case _UNIT_TAG:
                this._unitMlString = ((null));
                const /** @type {?} */ idAttr = element.attrs.find((attr) => attr.name === 'id');
                if (!idAttr) {
                    this._addError(element, `<${_UNIT_TAG}> misses the "id" attribute`);
                }
                else {
                    const /** @type {?} */ id = idAttr.value;
                    if (this._msgIdToHtml.hasOwnProperty(id)) {
                        this._addError(element, `Duplicated translations for msg ${id}`);
                    }
                    else {
                        visitAll(this, element.children, null);
                        if (typeof this._unitMlString === 'string') {
                            this._msgIdToHtml[id] = this._unitMlString;
                        }
                        else {
                            this._addError(element, `Message ${id} misses a translation`);
                        }
                    }
                }
                break;
            case _SOURCE_TAG:
                // ignore source message
                break;
            case _TARGET_TAG:
                const /** @type {?} */ innerTextStart = ((element.startSourceSpan)).end.offset;
                const /** @type {?} */ innerTextEnd = ((element.endSourceSpan)).start.offset;
                const /** @type {?} */ content = ((element.startSourceSpan)).start.file.content;
                const /** @type {?} */ innerText = content.slice(innerTextStart, innerTextEnd);
                this._unitMlString = innerText;
                break;
            case _FILE_TAG:
                const /** @type {?} */ localeAttr = element.attrs.find((attr) => attr.name === 'target-language');
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
    }
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    visitAttribute(attribute, context) { }
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    visitText(text, context) { }
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    visitComment(comment, context) { }
    /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    visitExpansion(expansion, context) { }
    /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    visitExpansionCase(expansionCase, context) { }
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    _addError(node, message) {
        this._errors.push(new I18nError(/** @type {?} */ ((node.sourceSpan)), message));
    }
}
class XmlToI18n {
    /**
     * @param {?} message
     * @param {?} url
     * @return {?}
     */
    convert(message, url) {
        const /** @type {?} */ xmlIcu = new XmlParser().parse(message, url, true);
        this._errors = xmlIcu.errors;
        const /** @type {?} */ i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length == 0 ?
            [] :
            visitAll(this, xmlIcu.rootNodes);
        return {
            i18nNodes: i18nNodes,
            errors: this._errors,
        };
    }
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    visitText(text, context) { return new Text$1(text.value, /** @type {?} */ ((text.sourceSpan))); }
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    visitElement(el, context) {
        if (el.name === _PLACEHOLDER_TAG) {
            const /** @type {?} */ nameAttr = el.attrs.find((attr) => attr.name === 'id');
            if (nameAttr) {
                return new Placeholder('', nameAttr.value, /** @type {?} */ ((el.sourceSpan)));
            }
            this._addError(el, `<${_PLACEHOLDER_TAG}> misses the "id" attribute`);
        }
        else {
            this._addError(el, `Unexpected tag`);
        }
        return null;
    }
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    visitExpansion(icu, context) {
        const /** @type {?} */ caseMap = {};
        visitAll(this, icu.cases).forEach((c) => {
            caseMap[c.value] = new Container(c.nodes, icu.sourceSpan);
        });
        return new Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
    }
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    visitExpansionCase(icuCase, context) {
        return {
            value: icuCase.value,
            nodes: visitAll(this, icuCase.expression),
        };
    }
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    visitComment(comment, context) { }
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    visitAttribute(attribute, context) { }
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    _addError(node, message) {
        this._errors.push(new I18nError(/** @type {?} */ ((node.sourceSpan)), message));
    }
}
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
            return `x-${tag}`;
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const _VERSION$1 = '2.0';
const _XMLNS$1 = 'urn:oasis:names:tc:xliff:document:2.0';
// TODO(vicb): make this a param (s/_/-/)
const _DEFAULT_SOURCE_LANG$1 = 'en';
const _PLACEHOLDER_TAG$1 = 'ph';
const _PLACEHOLDER_SPANNING_TAG = 'pc';
const _XLIFF_TAG = 'xliff';
const _SOURCE_TAG$1 = 'source';
const _TARGET_TAG$1 = 'target';
const _UNIT_TAG$1 = 'unit';
class Xliff2 extends Serializer {
    /**
     * @param {?} messages
     * @param {?} locale
     * @return {?}
     */
    write(messages, locale) {
        const /** @type {?} */ visitor = new _WriteVisitor$1();
        const /** @type {?} */ units = [];
        messages.forEach(message => {
            const /** @type {?} */ unit = new Tag(_UNIT_TAG$1, { id: message.id });
            if (message.description || message.meaning) {
                const /** @type {?} */ notes = new Tag('notes');
                if (message.description) {
                    notes.children.push(new CR(8), new Tag('note', { category: 'description' }, [new Text$2(message.description)]));
                }
                if (message.meaning) {
                    notes.children.push(new CR(8), new Tag('note', { category: 'meaning' }, [new Text$2(message.meaning)]));
                }
                notes.children.push(new CR(6));
                unit.children.push(new CR(6), notes);
            }
            const /** @type {?} */ segment = new Tag('segment');
            segment.children.push(new CR(8), new Tag(_SOURCE_TAG$1, {}, visitor.serialize(message.nodes)), new CR(6));
            unit.children.push(new CR(6), segment, new CR(4));
            units.push(new CR(4), unit);
        });
        const /** @type {?} */ file = new Tag('file', { 'original': 'ng.template', id: 'ngi18n' }, [...units, new CR(2)]);
        const /** @type {?} */ xliff = new Tag(_XLIFF_TAG, { version: _VERSION$1, xmlns: _XMLNS$1, srcLang: locale || _DEFAULT_SOURCE_LANG$1 }, [new CR(2), file, new CR()]);
        return serialize([
            new Declaration({ version: '1.0', encoding: 'UTF-8' }), new CR(), xliff, new CR()
        ]);
    }
    /**
     * @param {?} content
     * @param {?} url
     * @return {?}
     */
    load(content, url) {
        // xliff to xml nodes
        const /** @type {?} */ xliff2Parser = new Xliff2Parser();
        const { locale, msgIdToHtml, errors } = xliff2Parser.parse(content, url);
        // xml nodes to i18n nodes
        const /** @type {?} */ i18nNodesByMsgId = {};
        const /** @type {?} */ converter = new XmlToI18n$1();
        Object.keys(msgIdToHtml).forEach(msgId => {
            const { i18nNodes, errors: e } = converter.convert(msgIdToHtml[msgId], url);
            errors.push(...e);
            i18nNodesByMsgId[msgId] = i18nNodes;
        });
        if (errors.length) {
            throw new Error(`xliff2 parse errors:\n${errors.join('\n')}`);
        }
        return { locale: /** @type {?} */ ((locale)), i18nNodesByMsgId };
    }
    /**
     * @param {?} message
     * @return {?}
     */
    digest(message) { return decimalDigest(message); }
}
class _WriteVisitor$1 {
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    visitText(text, context) { return [new Text$2(text.value)]; }
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    visitContainer(container, context) {
        const /** @type {?} */ nodes = [];
        container.children.forEach((node) => nodes.push(...node.visit(this)));
        return nodes;
    }
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    visitIcu(icu, context) {
        const /** @type {?} */ nodes = [new Text$2(`{${icu.expressionPlaceholder}, ${icu.type}, `)];
        Object.keys(icu.cases).forEach((c) => {
            nodes.push(new Text$2(`${c} {`), ...icu.cases[c].visit(this), new Text$2(`} `));
        });
        nodes.push(new Text$2(`}`));
        return nodes;
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitTagPlaceholder(ph, context) {
        const /** @type {?} */ type = getTypeForTag(ph.tag);
        if (ph.isVoid) {
            const /** @type {?} */ tagPh = new Tag(_PLACEHOLDER_TAG$1, {
                id: (this._nextPlaceholderId++).toString(),
                equiv: ph.startName,
                type: type,
                disp: `<${ph.tag}/>`,
            });
            return [tagPh];
        }
        const /** @type {?} */ tagPc = new Tag(_PLACEHOLDER_SPANNING_TAG, {
            id: (this._nextPlaceholderId++).toString(),
            equivStart: ph.startName,
            equivEnd: ph.closeName,
            type: type,
            dispStart: `<${ph.tag}>`,
            dispEnd: `</${ph.tag}>`,
        });
        const /** @type {?} */ nodes = [].concat(...ph.children.map(node => node.visit(this)));
        if (nodes.length) {
            nodes.forEach((node) => tagPc.children.push(node));
        }
        else {
            tagPc.children.push(new Text$2(''));
        }
        return [tagPc];
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitPlaceholder(ph, context) {
        return [new Tag(_PLACEHOLDER_TAG$1, {
                id: (this._nextPlaceholderId++).toString(),
                equiv: ph.name,
                disp: `{{${ph.value}}}`,
            })];
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitIcuPlaceholder(ph, context) {
        return [new Tag(_PLACEHOLDER_TAG$1, { id: (this._nextPlaceholderId++).toString() })];
    }
    /**
     * @param {?} nodes
     * @return {?}
     */
    serialize(nodes) {
        this._nextPlaceholderId = 0;
        return [].concat(...nodes.map(node => node.visit(this)));
    }
}
class Xliff2Parser {
    constructor() {
        this._locale = null;
    }
    /**
     * @param {?} xliff
     * @param {?} url
     * @return {?}
     */
    parse(xliff, url) {
        this._unitMlString = null;
        this._msgIdToHtml = {};
        const /** @type {?} */ xml = new XmlParser().parse(xliff, url, false);
        this._errors = xml.errors;
        visitAll(this, xml.rootNodes, null);
        return {
            msgIdToHtml: this._msgIdToHtml,
            errors: this._errors,
            locale: this._locale,
        };
    }
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    visitElement(element, context) {
        switch (element.name) {
            case _UNIT_TAG$1:
                this._unitMlString = null;
                const /** @type {?} */ idAttr = element.attrs.find((attr) => attr.name === 'id');
                if (!idAttr) {
                    this._addError(element, `<${_UNIT_TAG$1}> misses the "id" attribute`);
                }
                else {
                    const /** @type {?} */ id = idAttr.value;
                    if (this._msgIdToHtml.hasOwnProperty(id)) {
                        this._addError(element, `Duplicated translations for msg ${id}`);
                    }
                    else {
                        visitAll(this, element.children, null);
                        if (typeof this._unitMlString === 'string') {
                            this._msgIdToHtml[id] = this._unitMlString;
                        }
                        else {
                            this._addError(element, `Message ${id} misses a translation`);
                        }
                    }
                }
                break;
            case _SOURCE_TAG$1:
                // ignore source message
                break;
            case _TARGET_TAG$1:
                const /** @type {?} */ innerTextStart = ((element.startSourceSpan)).end.offset;
                const /** @type {?} */ innerTextEnd = ((element.endSourceSpan)).start.offset;
                const /** @type {?} */ content = ((element.startSourceSpan)).start.file.content;
                const /** @type {?} */ innerText = content.slice(innerTextStart, innerTextEnd);
                this._unitMlString = innerText;
                break;
            case _XLIFF_TAG:
                const /** @type {?} */ localeAttr = element.attrs.find((attr) => attr.name === 'trgLang');
                if (localeAttr) {
                    this._locale = localeAttr.value;
                }
                const /** @type {?} */ versionAttr = element.attrs.find((attr) => attr.name === 'version');
                if (versionAttr) {
                    const /** @type {?} */ version = versionAttr.value;
                    if (version !== '2.0') {
                        this._addError(element, `The XLIFF file version ${version} is not compatible with XLIFF 2.0 serializer`);
                    }
                    else {
                        visitAll(this, element.children, null);
                    }
                }
                break;
            default:
                visitAll(this, element.children, null);
        }
    }
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    visitAttribute(attribute, context) { }
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    visitText(text, context) { }
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    visitComment(comment, context) { }
    /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    visitExpansion(expansion, context) { }
    /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    visitExpansionCase(expansionCase, context) { }
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    _addError(node, message) {
        this._errors.push(new I18nError(node.sourceSpan, message));
    }
}
class XmlToI18n$1 {
    /**
     * @param {?} message
     * @param {?} url
     * @return {?}
     */
    convert(message, url) {
        const /** @type {?} */ xmlIcu = new XmlParser().parse(message, url, true);
        this._errors = xmlIcu.errors;
        const /** @type {?} */ i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length == 0 ?
            [] :
            [].concat(...visitAll(this, xmlIcu.rootNodes));
        return {
            i18nNodes,
            errors: this._errors,
        };
    }
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    visitText(text, context) { return new Text$1(text.value, text.sourceSpan); }
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    visitElement(el, context) {
        switch (el.name) {
            case _PLACEHOLDER_TAG$1:
                const /** @type {?} */ nameAttr = el.attrs.find((attr) => attr.name === 'equiv');
                if (nameAttr) {
                    return [new Placeholder('', nameAttr.value, el.sourceSpan)];
                }
                this._addError(el, `<${_PLACEHOLDER_TAG$1}> misses the "equiv" attribute`);
                break;
            case _PLACEHOLDER_SPANNING_TAG:
                const /** @type {?} */ startAttr = el.attrs.find((attr) => attr.name === 'equivStart');
                const /** @type {?} */ endAttr = el.attrs.find((attr) => attr.name === 'equivEnd');
                if (!startAttr) {
                    this._addError(el, `<${_PLACEHOLDER_TAG$1}> misses the "equivStart" attribute`);
                }
                else if (!endAttr) {
                    this._addError(el, `<${_PLACEHOLDER_TAG$1}> misses the "equivEnd" attribute`);
                }
                else {
                    const /** @type {?} */ startId = startAttr.value;
                    const /** @type {?} */ endId = endAttr.value;
                    const /** @type {?} */ nodes = [];
                    return nodes.concat(new Placeholder('', startId, el.sourceSpan), ...el.children.map(node => node.visit(this, null)), new Placeholder('', endId, el.sourceSpan));
                }
                break;
            default:
                this._addError(el, `Unexpected tag`);
        }
        return null;
    }
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    visitExpansion(icu, context) {
        const /** @type {?} */ caseMap = {};
        visitAll(this, icu.cases).forEach((c) => {
            caseMap[c.value] = new Container(c.nodes, icu.sourceSpan);
        });
        return new Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
    }
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    visitExpansionCase(icuCase, context) {
        return {
            value: icuCase.value,
            nodes: [].concat(...visitAll(this, icuCase.expression)),
        };
    }
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    visitComment(comment, context) { }
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    visitAttribute(attribute, context) { }
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    _addError(node, message) {
        this._errors.push(new I18nError(node.sourceSpan, message));
    }
}
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
const _MESSAGES_TAG = 'messagebundle';
const _MESSAGE_TAG = 'msg';
const _PLACEHOLDER_TAG$2 = 'ph';
const _EXEMPLE_TAG = 'ex';
const _SOURCE_TAG$2 = 'source';
const _DOCTYPE = `<!ELEMENT messagebundle (msg)*>
<!ATTLIST messagebundle class CDATA #IMPLIED>

<!ELEMENT msg (#PCDATA|ph|source)*>
<!ATTLIST msg id CDATA #IMPLIED>
<!ATTLIST msg seq CDATA #IMPLIED>
<!ATTLIST msg name CDATA #IMPLIED>
<!ATTLIST msg desc CDATA #IMPLIED>
<!ATTLIST msg meaning CDATA #IMPLIED>
<!ATTLIST msg obsolete (obsolete) #IMPLIED>
<!ATTLIST msg xml:space (default|preserve) "default">
<!ATTLIST msg is_hidden CDATA #IMPLIED>

<!ELEMENT source (#PCDATA)>

<!ELEMENT ph (#PCDATA|ex)*>
<!ATTLIST ph name CDATA #REQUIRED>

<!ELEMENT ex (#PCDATA)>`;
class Xmb extends Serializer {
    /**
     * @param {?} messages
     * @param {?} locale
     * @return {?}
     */
    write(messages, locale) {
        const /** @type {?} */ exampleVisitor = new ExampleVisitor();
        const /** @type {?} */ visitor = new _Visitor$2();
        let /** @type {?} */ rootNode = new Tag(_MESSAGES_TAG);
        messages.forEach(message => {
            const /** @type {?} */ attrs = { id: message.id };
            if (message.description) {
                attrs['desc'] = message.description;
            }
            if (message.meaning) {
                attrs['meaning'] = message.meaning;
            }
            let /** @type {?} */ sourceTags = [];
            message.sources.forEach((source) => {
                sourceTags.push(new Tag(_SOURCE_TAG$2, {}, [
                    new Text$2(`${source.filePath}:${source.startLine}${source.endLine !== source.startLine ? ',' + source.endLine : ''}`)
                ]));
            });
            rootNode.children.push(new CR(2), new Tag(_MESSAGE_TAG, attrs, [...sourceTags, ...visitor.serialize(message.nodes)]));
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
    }
    /**
     * @param {?} content
     * @param {?} url
     * @return {?}
     */
    load(content, url) {
        throw new Error('Unsupported');
    }
    /**
     * @param {?} message
     * @return {?}
     */
    digest(message) { return digest$1(message); }
    /**
     * @param {?} message
     * @return {?}
     */
    createNameMapper(message) {
        return new SimplePlaceholderMapper(message, toPublicName);
    }
}
class _Visitor$2 {
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    visitText(text, context) { return [new Text$2(text.value)]; }
    /**
     * @param {?} container
     * @param {?} context
     * @return {?}
     */
    visitContainer(container, context) {
        const /** @type {?} */ nodes = [];
        container.children.forEach((node) => nodes.push(...node.visit(this)));
        return nodes;
    }
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    visitIcu(icu, context) {
        const /** @type {?} */ nodes = [new Text$2(`{${icu.expressionPlaceholder}, ${icu.type}, `)];
        Object.keys(icu.cases).forEach((c) => {
            nodes.push(new Text$2(`${c} {`), ...icu.cases[c].visit(this), new Text$2(`} `));
        });
        nodes.push(new Text$2(`}`));
        return nodes;
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitTagPlaceholder(ph, context) {
        const /** @type {?} */ startEx = new Tag(_EXEMPLE_TAG, {}, [new Text$2(`<${ph.tag}>`)]);
        const /** @type {?} */ startTagPh = new Tag(_PLACEHOLDER_TAG$2, { name: ph.startName }, [startEx]);
        if (ph.isVoid) {
            // void tags have no children nor closing tags
            return [startTagPh];
        }
        const /** @type {?} */ closeEx = new Tag(_EXEMPLE_TAG, {}, [new Text$2(`</${ph.tag}>`)]);
        const /** @type {?} */ closeTagPh = new Tag(_PLACEHOLDER_TAG$2, { name: ph.closeName }, [closeEx]);
        return [startTagPh, ...this.serialize(ph.children), closeTagPh];
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitPlaceholder(ph, context) {
        return [new Tag(_PLACEHOLDER_TAG$2, { name: ph.name })];
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitIcuPlaceholder(ph, context) {
        return [new Tag(_PLACEHOLDER_TAG$2, { name: ph.name })];
    }
    /**
     * @param {?} nodes
     * @return {?}
     */
    serialize(nodes) {
        return [].concat(...nodes.map(node => node.visit(this)));
    }
}
/**
 * @param {?} message
 * @return {?}
 */
function digest$1(message) {
    return decimalDigest(message);
}
class ExampleVisitor {
    /**
     * @param {?} node
     * @return {?}
     */
    addDefaultExamples(node) {
        node.visit(this);
        return node;
    }
    /**
     * @param {?} tag
     * @return {?}
     */
    visitTag(tag) {
        if (tag.name === _PLACEHOLDER_TAG$2) {
            if (!tag.children || tag.children.length == 0) {
                const /** @type {?} */ exText = new Text$2(tag.attrs['name'] || '...');
                tag.children = [new Tag(_EXEMPLE_TAG, {}, [exText])];
            }
        }
        else if (tag.children) {
            tag.children.forEach(node => node.visit(this));
        }
    }
    /**
     * @param {?} text
     * @return {?}
     */
    visitText(text) { }
    /**
     * @param {?} decl
     * @return {?}
     */
    visitDeclaration(decl) { }
    /**
     * @param {?} doctype
     * @return {?}
     */
    visitDoctype(doctype) { }
}
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
const _TRANSLATIONS_TAG = 'translationbundle';
const _TRANSLATION_TAG = 'translation';
const _PLACEHOLDER_TAG$3 = 'ph';
class Xtb extends Serializer {
    /**
     * @param {?} messages
     * @param {?} locale
     * @return {?}
     */
    write(messages, locale) { throw new Error('Unsupported'); }
    /**
     * @param {?} content
     * @param {?} url
     * @return {?}
     */
    load(content, url) {
        // xtb to xml nodes
        const /** @type {?} */ xtbParser = new XtbParser();
        const { locale, msgIdToHtml, errors } = xtbParser.parse(content, url);
        // xml nodes to i18n nodes
        const /** @type {?} */ i18nNodesByMsgId = {};
        const /** @type {?} */ converter = new XmlToI18n$2();
        // Because we should be able to load xtb files that rely on features not supported by angular,
        // we need to delay the conversion of html to i18n nodes so that non angular messages are not
        // converted
        Object.keys(msgIdToHtml).forEach(msgId => {
            const /** @type {?} */ valueFn = function () {
                const { i18nNodes, errors } = converter.convert(msgIdToHtml[msgId], url);
                if (errors.length) {
                    throw new Error(`xtb parse errors:\n${errors.join('\n')}`);
                }
                return i18nNodes;
            };
            createLazyProperty(i18nNodesByMsgId, msgId, valueFn);
        });
        if (errors.length) {
            throw new Error(`xtb parse errors:\n${errors.join('\n')}`);
        }
        return { locale: /** @type {?} */ ((locale)), i18nNodesByMsgId };
    }
    /**
     * @param {?} message
     * @return {?}
     */
    digest(message) { return digest$1(message); }
    /**
     * @param {?} message
     * @return {?}
     */
    createNameMapper(message) {
        return new SimplePlaceholderMapper(message, toPublicName);
    }
}
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
            const /** @type {?} */ value = valueFn();
            Object.defineProperty(messages, id, { enumerable: true, value });
            return value;
        },
        set: _ => { throw new Error('Could not overwrite an XTB translation'); },
    });
}
class XtbParser {
    constructor() {
        this._locale = null;
    }
    /**
     * @param {?} xtb
     * @param {?} url
     * @return {?}
     */
    parse(xtb, url) {
        this._bundleDepth = 0;
        this._msgIdToHtml = {};
        // We can not parse the ICU messages at this point as some messages might not originate
        // from Angular that could not be lex'd.
        const /** @type {?} */ xml = new XmlParser().parse(xtb, url, false);
        this._errors = xml.errors;
        visitAll(this, xml.rootNodes);
        return {
            msgIdToHtml: this._msgIdToHtml,
            errors: this._errors,
            locale: this._locale,
        };
    }
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    visitElement(element, context) {
        switch (element.name) {
            case _TRANSLATIONS_TAG:
                this._bundleDepth++;
                if (this._bundleDepth > 1) {
                    this._addError(element, `<${_TRANSLATIONS_TAG}> elements can not be nested`);
                }
                const /** @type {?} */ langAttr = element.attrs.find((attr) => attr.name === 'lang');
                if (langAttr) {
                    this._locale = langAttr.value;
                }
                visitAll(this, element.children, null);
                this._bundleDepth--;
                break;
            case _TRANSLATION_TAG:
                const /** @type {?} */ idAttr = element.attrs.find((attr) => attr.name === 'id');
                if (!idAttr) {
                    this._addError(element, `<${_TRANSLATION_TAG}> misses the "id" attribute`);
                }
                else {
                    const /** @type {?} */ id = idAttr.value;
                    if (this._msgIdToHtml.hasOwnProperty(id)) {
                        this._addError(element, `Duplicated translations for msg ${id}`);
                    }
                    else {
                        const /** @type {?} */ innerTextStart = ((element.startSourceSpan)).end.offset;
                        const /** @type {?} */ innerTextEnd = ((element.endSourceSpan)).start.offset;
                        const /** @type {?} */ content = ((element.startSourceSpan)).start.file.content;
                        const /** @type {?} */ innerText = content.slice(/** @type {?} */ ((innerTextStart)), /** @type {?} */ ((innerTextEnd)));
                        this._msgIdToHtml[id] = innerText;
                    }
                }
                break;
            default:
                this._addError(element, 'Unexpected tag');
        }
    }
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    visitAttribute(attribute, context) { }
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    visitText(text, context) { }
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    visitComment(comment, context) { }
    /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    visitExpansion(expansion, context) { }
    /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    visitExpansionCase(expansionCase, context) { }
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    _addError(node, message) {
        this._errors.push(new I18nError(/** @type {?} */ ((node.sourceSpan)), message));
    }
}
class XmlToI18n$2 {
    /**
     * @param {?} message
     * @param {?} url
     * @return {?}
     */
    convert(message, url) {
        const /** @type {?} */ xmlIcu = new XmlParser().parse(message, url, true);
        this._errors = xmlIcu.errors;
        const /** @type {?} */ i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length == 0 ?
            [] :
            visitAll(this, xmlIcu.rootNodes);
        return {
            i18nNodes,
            errors: this._errors,
        };
    }
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    visitText(text, context) { return new Text$1(text.value, /** @type {?} */ ((text.sourceSpan))); }
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    visitExpansion(icu, context) {
        const /** @type {?} */ caseMap = {};
        visitAll(this, icu.cases).forEach(c => {
            caseMap[c.value] = new Container(c.nodes, icu.sourceSpan);
        });
        return new Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
    }
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    visitExpansionCase(icuCase, context) {
        return {
            value: icuCase.value,
            nodes: visitAll(this, icuCase.expression),
        };
    }
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    visitElement(el, context) {
        if (el.name === _PLACEHOLDER_TAG$3) {
            const /** @type {?} */ nameAttr = el.attrs.find((attr) => attr.name === 'name');
            if (nameAttr) {
                return new Placeholder('', nameAttr.value, /** @type {?} */ ((el.sourceSpan)));
            }
            this._addError(el, `<${_PLACEHOLDER_TAG$3}> misses the "name" attribute`);
        }
        else {
            this._addError(el, `Unexpected tag`);
        }
        return null;
    }
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    visitComment(comment, context) { }
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    visitAttribute(attribute, context) { }
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    _addError(node, message) {
        this._errors.push(new I18nError(/** @type {?} */ ((node.sourceSpan)), message));
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class HtmlParser extends Parser$1 {
    constructor() { super(getHtmlTagDefinition); }
    /**
     * @param {?} source
     * @param {?} url
     * @param {?=} parseExpansionForms
     * @param {?=} interpolationConfig
     * @return {?}
     */
    parse(source, url, parseExpansionForms = false, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        return super.parse(source, url, parseExpansionForms, interpolationConfig);
    }
}
HtmlParser.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
HtmlParser.ctorParameters = () => [];

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
class TranslationBundle {
    /**
     * @param {?=} _i18nNodesByMsgId
     * @param {?=} locale
     * @param {?=} digest
     * @param {?=} mapperFactory
     * @param {?=} missingTranslationStrategy
     * @param {?=} console
     */
    constructor(_i18nNodesByMsgId = {}, locale, digest, mapperFactory, missingTranslationStrategy = MissingTranslationStrategy.Warning, console) {
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
    static load(content, url, serializer, missingTranslationStrategy, console) {
        const { locale, i18nNodesByMsgId } = serializer.load(content, url);
        const /** @type {?} */ digestFn = (m) => serializer.digest(m);
        const /** @type {?} */ mapperFactory = (m) => ((serializer.createNameMapper(m)));
        return new TranslationBundle(i18nNodesByMsgId, locale, digestFn, mapperFactory, missingTranslationStrategy, console);
    }
    /**
     * @param {?} srcMsg
     * @return {?}
     */
    get(srcMsg) {
        const /** @type {?} */ html = this._i18nToHtml.convert(srcMsg);
        if (html.errors.length) {
            throw new Error(html.errors.join('\n'));
        }
        return html.nodes;
    }
    /**
     * @param {?} srcMsg
     * @return {?}
     */
    has(srcMsg) { return this.digest(srcMsg) in this._i18nNodesByMsgId; }
}
class I18nToHtmlVisitor {
    /**
     * @param {?=} _i18nNodesByMsgId
     * @param {?=} _locale
     * @param {?=} _digest
     * @param {?=} _mapperFactory
     * @param {?=} _missingTranslationStrategy
     * @param {?=} _console
     */
    constructor(_i18nNodesByMsgId = {}, _locale, _digest, _mapperFactory, _missingTranslationStrategy, _console) {
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
    convert(srcMsg) {
        this._contextStack.length = 0;
        this._errors.length = 0;
        // i18n to text
        const /** @type {?} */ text = this._convertToText(srcMsg);
        // text to html
        const /** @type {?} */ url = srcMsg.nodes[0].sourceSpan.start.file.url;
        const /** @type {?} */ html = new HtmlParser().parse(text, url, true);
        return {
            nodes: html.rootNodes,
            errors: [...this._errors, ...html.errors],
        };
    }
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    visitText(text, context) { return text.value; }
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    visitContainer(container, context) {
        return container.children.map(n => n.visit(this)).join('');
    }
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    visitIcu(icu, context) {
        const /** @type {?} */ cases = Object.keys(icu.cases).map(k => `${k} {${icu.cases[k].visit(this)}}`);
        // TODO(vicb): Once all format switch to using expression placeholders
        // we should throw when the placeholder is not in the source message
        const /** @type {?} */ exp = this._srcMsg.placeholders.hasOwnProperty(icu.expression) ?
            this._srcMsg.placeholders[icu.expression] :
            icu.expression;
        return `{${exp}, ${icu.type}, ${cases.join(' ')}}`;
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitPlaceholder(ph, context) {
        const /** @type {?} */ phName = this._mapper(ph.name);
        if (this._srcMsg.placeholders.hasOwnProperty(phName)) {
            return this._srcMsg.placeholders[phName];
        }
        if (this._srcMsg.placeholderToMessage.hasOwnProperty(phName)) {
            return this._convertToText(this._srcMsg.placeholderToMessage[phName]);
        }
        this._addError(ph, `Unknown placeholder "${ph.name}"`);
        return '';
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitTagPlaceholder(ph, context) {
        const /** @type {?} */ tag = `${ph.tag}`;
        const /** @type {?} */ attrs = Object.keys(ph.attrs).map(name => `${name}="${ph.attrs[name]}"`).join(' ');
        if (ph.isVoid) {
            return `<${tag} ${attrs}/>`;
        }
        const /** @type {?} */ children = ph.children.map((c) => c.visit(this)).join('');
        return `<${tag} ${attrs}>${children}</${tag}>`;
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitIcuPlaceholder(ph, context) {
        // An ICU placeholder references the source message to be serialized
        return this._convertToText(this._srcMsg.placeholderToMessage[ph.name]);
    }
    /**
     * Convert a source message to a translated text string:
     * - text nodes are replaced with their translation,
     * - placeholders are replaced with their content,
     * - ICU nodes are converted to ICU expressions.
     * @param {?} srcMsg
     * @return {?}
     */
    _convertToText(srcMsg) {
        const /** @type {?} */ id = this._digest(srcMsg);
        const /** @type {?} */ mapper = this._mapperFactory ? this._mapperFactory(srcMsg) : null;
        let /** @type {?} */ nodes;
        this._contextStack.push({ msg: this._srcMsg, mapper: this._mapper });
        this._srcMsg = srcMsg;
        if (this._i18nNodesByMsgId.hasOwnProperty(id)) {
            // When there is a translation use its nodes as the source
            // And create a mapper to convert serialized placeholder names to internal names
            nodes = this._i18nNodesByMsgId[id];
            this._mapper = (name) => mapper ? ((mapper.toInternalName(name))) : name;
        }
        else {
            // When no translation has been found
            // - report an error / a warning / nothing,
            // - use the nodes from the original message
            // - placeholders are already internal and need no mapper
            if (this._missingTranslationStrategy === MissingTranslationStrategy.Error) {
                const /** @type {?} */ ctx = this._locale ? ` for locale "${this._locale}"` : '';
                this._addError(srcMsg.nodes[0], `Missing translation for message "${id}"${ctx}`);
            }
            else if (this._console &&
                this._missingTranslationStrategy === MissingTranslationStrategy.Warning) {
                const /** @type {?} */ ctx = this._locale ? ` for locale "${this._locale}"` : '';
                this._console.warn(`Missing translation for message "${id}"${ctx}`);
            }
            nodes = srcMsg.nodes;
            this._mapper = (name) => name;
        }
        const /** @type {?} */ text = nodes.map(node => node.visit(this)).join('');
        const /** @type {?} */ context = ((this._contextStack.pop()));
        this._srcMsg = context.msg;
        this._mapper = context.mapper;
        return text;
    }
    /**
     * @param {?} el
     * @param {?} msg
     * @return {?}
     */
    _addError(el, msg) {
        this._errors.push(new I18nError(el.sourceSpan, msg));
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class I18NHtmlParser {
    /**
     * @param {?} _htmlParser
     * @param {?=} translations
     * @param {?=} translationsFormat
     * @param {?=} missingTranslation
     * @param {?=} console
     */
    constructor(_htmlParser, translations, translationsFormat, missingTranslation = MissingTranslationStrategy.Warning, console) {
        this._htmlParser = _htmlParser;
        if (translations) {
            const serializer = createSerializer(translationsFormat);
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
    parse(source, url, parseExpansionForms = false, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        const /** @type {?} */ parseResult = this._htmlParser.parse(source, url, parseExpansionForms, interpolationConfig);
        if (!this._translationBundle) {
            // Do not enable i18n when no translation bundle is provided
            return parseResult;
        }
        if (parseResult.errors.length) {
            return new ParseTreeResult(parseResult.rootNodes, parseResult.errors);
        }
        return mergeTranslations(parseResult.rootNodes, this._translationBundle, interpolationConfig, [], {});
    }
}
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
const CORE = assetUrl('core');
class Identifiers {
}
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
function assetUrl(pkg, path = null, type = 'src') {
    if (path == null) {
        return `@angular/${pkg}`;
    }
    else {
        return `@angular/${pkg}/${type}/${path}`;
    }
}
/**
 * @param {?} identifier
 * @return {?}
 */
function resolveIdentifier(identifier) {
    let /** @type {?} */ name = identifier.name;
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
const PLURAL_CASES = ['zero', 'one', 'two', 'few', 'many', 'other'];
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
    const /** @type {?} */ expander = new _Expander();
    return new ExpansionResult(visitAll(expander, nodes), expander.isExpanded, expander.errors);
}
class ExpansionResult {
    /**
     * @param {?} nodes
     * @param {?} expanded
     * @param {?} errors
     */
    constructor(nodes, expanded, errors) {
        this.nodes = nodes;
        this.expanded = expanded;
        this.errors = errors;
    }
}
class ExpansionError extends ParseError {
    /**
     * @param {?} span
     * @param {?} errorMsg
     */
    constructor(span, errorMsg) { super(span, errorMsg); }
}
/**
 * Expand expansion forms (plural, select) to directives
 *
 * \@internal
 */
class _Expander {
    constructor() {
        this.isExpanded = false;
        this.errors = [];
    }
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    visitElement(element, context) {
        return new Element(element.name, element.attrs, visitAll(this, element.children), element.sourceSpan, element.startSourceSpan, element.endSourceSpan);
    }
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    visitAttribute(attribute, context) { return attribute; }
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    visitText(text, context) { return text; }
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    visitComment(comment, context) { return comment; }
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    visitExpansion(icu, context) {
        this.isExpanded = true;
        return icu.type == 'plural' ? _expandPluralForm(icu, this.errors) :
            _expandDefaultForm(icu, this.errors);
    }
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    visitExpansionCase(icuCase, context) {
        throw new Error('Should not be reached');
    }
}
/**
 * @param {?} ast
 * @param {?} errors
 * @return {?}
 */
function _expandPluralForm(ast, errors) {
    const /** @type {?} */ children = ast.cases.map(c => {
        if (PLURAL_CASES.indexOf(c.value) == -1 && !c.value.match(/^=\d+$/)) {
            errors.push(new ExpansionError(c.valueSourceSpan, `Plural cases should be "=<number>" or one of ${PLURAL_CASES.join(", ")}`));
        }
        const /** @type {?} */ expansionResult = expandNodes(c.expression);
        errors.push(...expansionResult.errors);
        return new Element(`ng-template`, [new Attribute$1('ngPluralCase', `${c.value}`, c.valueSourceSpan)], expansionResult.nodes, c.sourceSpan, c.sourceSpan, c.sourceSpan);
    });
    const /** @type {?} */ switchAttr = new Attribute$1('[ngPlural]', ast.switchValue, ast.switchValueSourceSpan);
    return new Element('ng-container', [switchAttr], children, ast.sourceSpan, ast.sourceSpan, ast.sourceSpan);
}
/**
 * @param {?} ast
 * @param {?} errors
 * @return {?}
 */
function _expandDefaultForm(ast, errors) {
    const /** @type {?} */ children = ast.cases.map(c => {
        const /** @type {?} */ expansionResult = expandNodes(c.expression);
        errors.push(...expansionResult.errors);
        if (c.value === 'other') {
            // other is the default case when no values match
            return new Element(`ng-template`, [new Attribute$1('ngSwitchDefault', '', c.valueSourceSpan)], expansionResult.nodes, c.sourceSpan, c.sourceSpan, c.sourceSpan);
        }
        return new Element(`ng-template`, [new Attribute$1('ngSwitchCase', `${c.value}`, c.valueSourceSpan)], expansionResult.nodes, c.sourceSpan, c.sourceSpan, c.sourceSpan);
    });
    const /** @type {?} */ switchAttr = new Attribute$1('[ngSwitch]', ast.switchValue, ast.switchValueSourceSpan);
    return new Element('ng-container', [switchAttr], children, ast.sourceSpan, ast.sourceSpan, ast.sourceSpan);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class ProviderError extends ParseError {
    /**
     * @param {?} message
     * @param {?} span
     */
    constructor(message, span) { super(span, message); }
}
class ProviderViewContext {
    /**
     * @param {?} component
     */
    constructor(component) {
        this.component = component;
        this.errors = [];
        this.viewQueries = _getViewQueries(component);
        this.viewProviders = new Map();
        component.viewProviders.forEach((provider) => {
            if (this.viewProviders.get(tokenReference(provider.token)) == null) {
                this.viewProviders.set(tokenReference(provider.token), true);
            }
        });
    }
}
class ProviderElementContext {
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
    constructor(viewContext, _parent, _isViewRoot, _directiveAsts, attrs, refs, isTemplate, contentQueryStartId, _sourceSpan) {
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
        attrs.forEach((attrAst) => this._attrs[attrAst.name] = attrAst.value);
        const directivesMeta = _directiveAsts.map(directiveAst => directiveAst.directive);
        this._allProviders =
            _resolveProvidersFromDirectives(directivesMeta, _sourceSpan, viewContext.errors);
        this._contentQueries = _getContentQueries(contentQueryStartId, directivesMeta);
        Array.from(this._allProviders.values()).forEach((provider) => {
            this._addQueryReadsTo(provider.token, provider.token, this._queriedTokens);
        });
        if (isTemplate) {
            const templateRefId = createIdentifierToken(Identifiers.TemplateRef);
            this._addQueryReadsTo(templateRefId, templateRefId, this._queriedTokens);
        }
        refs.forEach((refAst) => {
            let defaultQueryValue = refAst.value || createIdentifierToken(Identifiers.ElementRef);
            this._addQueryReadsTo({ value: refAst.name }, defaultQueryValue, this._queriedTokens);
        });
        if (this._queriedTokens.get(resolveIdentifier(Identifiers.ViewContainerRef))) {
            this._hasViewContainer = true;
        }
        // create the providers that we know are eager first
        Array.from(this._allProviders.values()).forEach((provider) => {
            const eager = provider.eager || this._queriedTokens.get(tokenReference(provider.token));
            if (eager) {
                this._getOrCreateLocalProvider(provider.providerType, provider.token, true);
            }
        });
    }
    /**
     * @return {?}
     */
    afterElement() {
        // collect lazy providers
        Array.from(this._allProviders.values()).forEach((provider) => {
            this._getOrCreateLocalProvider(provider.providerType, provider.token, false);
        });
    }
    /**
     * @return {?}
     */
    get transformProviders() {
        return Array.from(this._transformedProviders.values());
    }
    /**
     * @return {?}
     */
    get transformedDirectiveAsts() {
        const /** @type {?} */ sortedProviderTypes = this.transformProviders.map(provider => provider.token.identifier);
        const /** @type {?} */ sortedDirectives = this._directiveAsts.slice();
        sortedDirectives.sort((dir1, dir2) => sortedProviderTypes.indexOf(dir1.directive.type) -
            sortedProviderTypes.indexOf(dir2.directive.type));
        return sortedDirectives;
    }
    /**
     * @return {?}
     */
    get transformedHasViewContainer() { return this._hasViewContainer; }
    /**
     * @return {?}
     */
    get queryMatches() {
        const /** @type {?} */ allMatches = [];
        this._queriedTokens.forEach((matches) => { allMatches.push(...matches); });
        return allMatches;
    }
    /**
     * @param {?} token
     * @param {?} defaultValue
     * @param {?} queryReadTokens
     * @return {?}
     */
    _addQueryReadsTo(token, defaultValue, queryReadTokens) {
        this._getQueriesFor(token).forEach((query) => {
            const /** @type {?} */ queryValue = query.meta.read || defaultValue;
            const /** @type {?} */ tokenRef = tokenReference(queryValue);
            let /** @type {?} */ queryMatches = queryReadTokens.get(tokenRef);
            if (!queryMatches) {
                queryMatches = [];
                queryReadTokens.set(tokenRef, queryMatches);
            }
            queryMatches.push({ queryId: query.queryId, value: queryValue });
        });
    }
    /**
     * @param {?} token
     * @return {?}
     */
    _getQueriesFor(token) {
        const /** @type {?} */ result = [];
        let /** @type {?} */ currentEl = this;
        let /** @type {?} */ distance = 0;
        let /** @type {?} */ queries;
        while (currentEl !== null) {
            queries = currentEl._contentQueries.get(tokenReference(token));
            if (queries) {
                result.push(...queries.filter((query) => query.meta.descendants || distance <= 1));
            }
            if (currentEl._directiveAsts.length > 0) {
                distance++;
            }
            currentEl = currentEl._parent;
        }
        queries = this.viewContext.viewQueries.get(tokenReference(token));
        if (queries) {
            result.push(...queries);
        }
        return result;
    }
    /**
     * @param {?} requestingProviderType
     * @param {?} token
     * @param {?} eager
     * @return {?}
     */
    _getOrCreateLocalProvider(requestingProviderType, token, eager) {
        const /** @type {?} */ resolvedProvider = this._allProviders.get(tokenReference(token));
        if (!resolvedProvider || ((requestingProviderType === ProviderAstType.Directive ||
            requestingProviderType === ProviderAstType.PublicService) &&
            resolvedProvider.providerType === ProviderAstType.PrivateService) ||
            ((requestingProviderType === ProviderAstType.PrivateService ||
                requestingProviderType === ProviderAstType.PublicService) &&
                resolvedProvider.providerType === ProviderAstType.Builtin)) {
            return null;
        }
        let /** @type {?} */ transformedProviderAst = this._transformedProviders.get(tokenReference(token));
        if (transformedProviderAst) {
            return transformedProviderAst;
        }
        if (this._seenProviders.get(tokenReference(token)) != null) {
            this.viewContext.errors.push(new ProviderError(`Cannot instantiate cyclic dependency! ${tokenName(token)}`, this._sourceSpan));
            return null;
        }
        this._seenProviders.set(tokenReference(token), true);
        const /** @type {?} */ transformedProviders = resolvedProvider.providers.map((provider) => {
            let /** @type {?} */ transformedUseValue = provider.useValue;
            let /** @type {?} */ transformedUseExisting = ((provider.useExisting));
            let /** @type {?} */ transformedDeps = ((undefined));
            if (provider.useExisting != null) {
                const /** @type {?} */ existingDiDep = ((this._getDependency(resolvedProvider.providerType, { token: provider.useExisting }, eager)));
                if (existingDiDep.token != null) {
                    transformedUseExisting = existingDiDep.token;
                }
                else {
                    transformedUseExisting = ((null));
                    transformedUseValue = existingDiDep.value;
                }
            }
            else if (provider.useFactory) {
                const /** @type {?} */ deps = provider.deps || provider.useFactory.diDeps;
                transformedDeps =
                    deps.map((dep) => ((this._getDependency(resolvedProvider.providerType, dep, eager))));
            }
            else if (provider.useClass) {
                const /** @type {?} */ deps = provider.deps || provider.useClass.diDeps;
                transformedDeps =
                    deps.map((dep) => ((this._getDependency(resolvedProvider.providerType, dep, eager))));
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
    }
    /**
     * @param {?} requestingProviderType
     * @param {?} dep
     * @param {?=} eager
     * @return {?}
     */
    _getLocalDependency(requestingProviderType, dep, eager = false) {
        if (dep.isAttribute) {
            const /** @type {?} */ attrValue = this._attrs[((dep.token)).value];
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
    }
    /**
     * @param {?} requestingProviderType
     * @param {?} dep
     * @param {?=} eager
     * @return {?}
     */
    _getDependency(requestingProviderType, dep, eager = false) {
        let /** @type {?} */ currElement = this;
        let /** @type {?} */ currEager = eager;
        let /** @type {?} */ result = null;
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
                const /** @type {?} */ prevElement = currElement;
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
            this.viewContext.errors.push(new ProviderError(`No provider for ${tokenName(/** @type {?} */ ((dep.token)))}`, this._sourceSpan));
        }
        return result;
    }
}
class NgModuleProviderAnalyzer {
    /**
     * @param {?} ngModule
     * @param {?} extraProviders
     * @param {?} sourceSpan
     */
    constructor(ngModule, extraProviders, sourceSpan) {
        this._transformedProviders = new Map();
        this._seenProviders = new Map();
        this._errors = [];
        this._allProviders = new Map();
        ngModule.transitiveModule.modules.forEach((ngModuleType) => {
            const ngModuleProvider = { token: { identifier: ngModuleType }, useClass: ngModuleType };
            _resolveProviders([ngModuleProvider], ProviderAstType.PublicService, true, sourceSpan, this._errors, this._allProviders);
        });
        _resolveProviders(ngModule.transitiveModule.providers.map(entry => entry.provider).concat(extraProviders), ProviderAstType.PublicService, false, sourceSpan, this._errors, this._allProviders);
    }
    /**
     * @return {?}
     */
    parse() {
        Array.from(this._allProviders.values()).forEach((provider) => {
            this._getOrCreateLocalProvider(provider.token, provider.eager);
        });
        if (this._errors.length > 0) {
            const /** @type {?} */ errorString = this._errors.join('\n');
            throw new Error(`Provider parse errors:\n${errorString}`);
        }
        return Array.from(this._transformedProviders.values());
    }
    /**
     * @param {?} token
     * @param {?} eager
     * @return {?}
     */
    _getOrCreateLocalProvider(token, eager) {
        const /** @type {?} */ resolvedProvider = this._allProviders.get(tokenReference(token));
        if (!resolvedProvider) {
            return null;
        }
        let /** @type {?} */ transformedProviderAst = this._transformedProviders.get(tokenReference(token));
        if (transformedProviderAst) {
            return transformedProviderAst;
        }
        if (this._seenProviders.get(tokenReference(token)) != null) {
            this._errors.push(new ProviderError(`Cannot instantiate cyclic dependency! ${tokenName(token)}`, resolvedProvider.sourceSpan));
            return null;
        }
        this._seenProviders.set(tokenReference(token), true);
        const /** @type {?} */ transformedProviders = resolvedProvider.providers.map((provider) => {
            let /** @type {?} */ transformedUseValue = provider.useValue;
            let /** @type {?} */ transformedUseExisting = ((provider.useExisting));
            let /** @type {?} */ transformedDeps = ((undefined));
            if (provider.useExisting != null) {
                const /** @type {?} */ existingDiDep = this._getDependency({ token: provider.useExisting }, eager, resolvedProvider.sourceSpan);
                if (existingDiDep.token != null) {
                    transformedUseExisting = existingDiDep.token;
                }
                else {
                    transformedUseExisting = ((null));
                    transformedUseValue = existingDiDep.value;
                }
            }
            else if (provider.useFactory) {
                const /** @type {?} */ deps = provider.deps || provider.useFactory.diDeps;
                transformedDeps =
                    deps.map((dep) => this._getDependency(dep, eager, resolvedProvider.sourceSpan));
            }
            else if (provider.useClass) {
                const /** @type {?} */ deps = provider.deps || provider.useClass.diDeps;
                transformedDeps =
                    deps.map((dep) => this._getDependency(dep, eager, resolvedProvider.sourceSpan));
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
    }
    /**
     * @param {?} dep
     * @param {?=} eager
     * @param {?=} requestorSourceSpan
     * @return {?}
     */
    _getDependency(dep, eager = false, requestorSourceSpan) {
        let /** @type {?} */ foundLocal = false;
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
        let /** @type {?} */ result = dep;
        if (dep.isSelf && !foundLocal) {
            if (dep.isOptional) {
                result = { isValue: true, value: null };
            }
            else {
                this._errors.push(new ProviderError(`No provider for ${tokenName(/** @type {?} */ ((dep.token)))}`, requestorSourceSpan));
            }
        }
        return result;
    }
}
/**
 * @param {?} provider
 * @param {?} __1
 * @return {?}
 */
function _transformProvider(provider, { useExisting, useValue, deps }) {
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
function _transformProviderAst(provider, { eager, providers }) {
    return new ProviderAst(provider.token, provider.multiProvider, provider.eager || eager, providers, provider.providerType, provider.lifecycleHooks, provider.sourceSpan);
}
/**
 * @param {?} directives
 * @param {?} sourceSpan
 * @param {?} targetErrors
 * @return {?}
 */
function _resolveProvidersFromDirectives(directives, sourceSpan, targetErrors) {
    const /** @type {?} */ providersByToken = new Map();
    directives.forEach((directive) => {
        const /** @type {?} */ dirProvider = { token: { identifier: directive.type }, useClass: directive.type };
        _resolveProviders([dirProvider], directive.isComponent ? ProviderAstType.Component : ProviderAstType.Directive, true, sourceSpan, targetErrors, providersByToken);
    });
    // Note: directives need to be able to overwrite providers of a component!
    const /** @type {?} */ directivesWithComponentFirst = directives.filter(dir => dir.isComponent).concat(directives.filter(dir => !dir.isComponent));
    directivesWithComponentFirst.forEach((directive) => {
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
    providers.forEach((provider) => {
        let /** @type {?} */ resolvedProvider = targetProvidersByToken.get(tokenReference(provider.token));
        if (resolvedProvider != null && !!resolvedProvider.multiProvider !== !!provider.multi) {
            targetErrors.push(new ProviderError(`Mixing multi and non multi provider is not possible for token ${tokenName(resolvedProvider.token)}`, sourceSpan));
        }
        if (!resolvedProvider) {
            const /** @type {?} */ lifecycleHooks = provider.token.identifier &&
                ((provider.token.identifier)).lifecycleHooks ?
                ((provider.token.identifier)).lifecycleHooks :
                [];
            const /** @type {?} */ isUseValue = !(provider.useClass || provider.useExisting || provider.useFactory);
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
    let /** @type {?} */ viewQueryId = 1;
    const /** @type {?} */ viewQueries = new Map();
    if (component.viewQueries) {
        component.viewQueries.forEach((query) => _addQueryToTokenMap(viewQueries, { meta: query, queryId: viewQueryId++ }));
    }
    return viewQueries;
}
/**
 * @param {?} contentQueryStartId
 * @param {?} directives
 * @return {?}
 */
function _getContentQueries(contentQueryStartId, directives) {
    let /** @type {?} */ contentQueryId = contentQueryStartId;
    const /** @type {?} */ contentQueries = new Map();
    directives.forEach((directive, directiveIndex) => {
        if (directive.queries) {
            directive.queries.forEach((query) => _addQueryToTokenMap(contentQueries, { meta: query, queryId: contentQueryId++ }));
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
    query.meta.selectors.forEach((token) => {
        let /** @type {?} */ entry = map.get(tokenReference(token));
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
class ElementSchemaRegistry {
    /**
     * @abstract
     * @param {?} tagName
     * @param {?} propName
     * @param {?} schemaMetas
     * @return {?}
     */
    hasProperty(tagName, propName, schemaMetas) { }
    /**
     * @abstract
     * @param {?} tagName
     * @param {?} schemaMetas
     * @return {?}
     */
    hasElement(tagName, schemaMetas) { }
    /**
     * @abstract
     * @param {?} elementName
     * @param {?} propName
     * @param {?} isAttribute
     * @return {?}
     */
    securityContext(elementName, propName, isAttribute) { }
    /**
     * @abstract
     * @return {?}
     */
    allKnownElementNames() { }
    /**
     * @abstract
     * @param {?} propName
     * @return {?}
     */
    getMappedPropName(propName) { }
    /**
     * @abstract
     * @return {?}
     */
    getDefaultComponentElementName() { }
    /**
     * @abstract
     * @param {?} name
     * @return {?}
     */
    validateProperty(name) { }
    /**
     * @abstract
     * @param {?} name
     * @return {?}
     */
    validateAttribute(name) { }
    /**
     * @abstract
     * @param {?} propName
     * @return {?}
     */
    normalizeAnimationStyleProperty(propName) { }
    /**
     * @abstract
     * @param {?} camelCaseProp
     * @param {?} userProvidedProp
     * @param {?} val
     * @return {?}
     */
    normalizeAnimationStyleValue(camelCaseProp, userProvidedProp, val) { }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class StyleWithImports {
    /**
     * @param {?} style
     * @param {?} styleUrls
     */
    constructor(style$$1, styleUrls) {
        this.style = style$$1;
        this.styleUrls = styleUrls;
    }
}
/**
 * @param {?} url
 * @return {?}
 */
function isStyleUrlResolvable(url) {
    if (url == null || url.length === 0 || url[0] == '/')
        return false;
    const /** @type {?} */ schemeMatch = url.match(URL_WITH_SCHEMA_REGEXP);
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
    const /** @type {?} */ foundUrls = [];
    const /** @type {?} */ modifiedCssText = cssText.replace(CSS_COMMENT_REGEXP, '').replace(CSS_IMPORT_REGEXP, (...m) => {
        const /** @type {?} */ url = m[1] || m[2];
        if (!isStyleUrlResolvable(url)) {
            // Do not attempt to resolve non-package absolute URLs with URI scheme
            return m[0];
        }
        foundUrls.push(resolver.resolve(baseUrl, url));
        return '';
    });
    return new StyleWithImports(modifiedCssText, foundUrls);
}
const CSS_IMPORT_REGEXP = /@import\s+(?:url\()?\s*(?:(?:['"]([^'"]*))|([^;\)\s]*))[^;]*;?/g;
const CSS_COMMENT_REGEXP = /\/\*.+?\*\//g;
const URL_WITH_SCHEMA_REGEXP = /^([^:/?#]+):/;

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const PROPERTY_PARTS_SEPARATOR = '.';
const ATTRIBUTE_PREFIX = 'attr';
const CLASS_PREFIX = 'class';
const STYLE_PREFIX = 'style';
const ANIMATE_PROP_PREFIX = 'animate-';
let BoundPropertyType = {};
BoundPropertyType.DEFAULT = 0;
BoundPropertyType.LITERAL_ATTR = 1;
BoundPropertyType.ANIMATION = 2;
BoundPropertyType[BoundPropertyType.DEFAULT] = "DEFAULT";
BoundPropertyType[BoundPropertyType.LITERAL_ATTR] = "LITERAL_ATTR";
BoundPropertyType[BoundPropertyType.ANIMATION] = "ANIMATION";
/**
 * Represents a parsed property.
 */
class BoundProperty {
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} type
     * @param {?} sourceSpan
     */
    constructor(name, expression, type, sourceSpan) {
        this.name = name;
        this.expression = expression;
        this.type = type;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @return {?}
     */
    get isLiteral() { return this.type === BoundPropertyType.LITERAL_ATTR; }
    /**
     * @return {?}
     */
    get isAnimation() { return this.type === BoundPropertyType.ANIMATION; }
}
/**
 * Parses bindings in templates and in the directive host area.
 */
class BindingParser {
    /**
     * @param {?} _exprParser
     * @param {?} _interpolationConfig
     * @param {?} _schemaRegistry
     * @param {?} pipes
     * @param {?} _targetErrors
     */
    constructor(_exprParser, _interpolationConfig, _schemaRegistry, pipes, _targetErrors) {
        this._exprParser = _exprParser;
        this._interpolationConfig = _interpolationConfig;
        this._schemaRegistry = _schemaRegistry;
        this._targetErrors = _targetErrors;
        this.pipesByName = new Map();
        this._usedPipes = new Map();
        pipes.forEach(pipe => this.pipesByName.set(pipe.name, pipe));
    }
    /**
     * @return {?}
     */
    getUsedPipes() { return Array.from(this._usedPipes.values()); }
    /**
     * @param {?} dirMeta
     * @param {?} elementSelector
     * @param {?} sourceSpan
     * @return {?}
     */
    createDirectiveHostPropertyAsts(dirMeta, elementSelector, sourceSpan) {
        if (dirMeta.hostProperties) {
            const /** @type {?} */ boundProps = [];
            Object.keys(dirMeta.hostProperties).forEach(propName => {
                const /** @type {?} */ expression = dirMeta.hostProperties[propName];
                if (typeof expression === 'string') {
                    this.parsePropertyBinding(propName, expression, true, sourceSpan, [], boundProps);
                }
                else {
                    this._reportError(`Value of the host property binding "${propName}" needs to be a string representing an expression but got "${expression}" (${typeof expression})`, sourceSpan);
                }
            });
            return boundProps.map((prop) => this.createElementPropertyAst(elementSelector, prop));
        }
        return null;
    }
    /**
     * @param {?} dirMeta
     * @param {?} sourceSpan
     * @return {?}
     */
    createDirectiveHostEventAsts(dirMeta, sourceSpan) {
        if (dirMeta.hostListeners) {
            const /** @type {?} */ targetEventAsts = [];
            Object.keys(dirMeta.hostListeners).forEach(propName => {
                const /** @type {?} */ expression = dirMeta.hostListeners[propName];
                if (typeof expression === 'string') {
                    this.parseEvent(propName, expression, sourceSpan, [], targetEventAsts);
                }
                else {
                    this._reportError(`Value of the host listener "${propName}" needs to be a string representing an expression but got "${expression}" (${typeof expression})`, sourceSpan);
                }
            });
            return targetEventAsts;
        }
        return null;
    }
    /**
     * @param {?} value
     * @param {?} sourceSpan
     * @return {?}
     */
    parseInterpolation(value, sourceSpan) {
        const /** @type {?} */ sourceInfo = sourceSpan.start.toString();
        try {
            const /** @type {?} */ ast = ((this._exprParser.parseInterpolation(value, sourceInfo, this._interpolationConfig)));
            if (ast)
                this._reportExpressionParserErrors(ast.errors, sourceSpan);
            this._checkPipes(ast, sourceSpan);
            return ast;
        }
        catch (e) {
            this._reportError(`${e}`, sourceSpan);
            return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
        }
    }
    /**
     * @param {?} prefixToken
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetProps
     * @param {?} targetVars
     * @return {?}
     */
    parseInlineTemplateBinding(prefixToken, value, sourceSpan, targetMatchableAttrs, targetProps, targetVars) {
        const /** @type {?} */ bindings = this._parseTemplateBindings(prefixToken, value, sourceSpan);
        for (let /** @type {?} */ i = 0; i < bindings.length; i++) {
            const /** @type {?} */ binding = bindings[i];
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
    }
    /**
     * @param {?} prefixToken
     * @param {?} value
     * @param {?} sourceSpan
     * @return {?}
     */
    _parseTemplateBindings(prefixToken, value, sourceSpan) {
        const /** @type {?} */ sourceInfo = sourceSpan.start.toString();
        try {
            const /** @type {?} */ bindingsResult = this._exprParser.parseTemplateBindings(prefixToken, value, sourceInfo);
            this._reportExpressionParserErrors(bindingsResult.errors, sourceSpan);
            bindingsResult.templateBindings.forEach((binding) => {
                if (binding.expression) {
                    this._checkPipes(binding.expression, sourceSpan);
                }
            });
            bindingsResult.warnings.forEach((warning) => { this._reportError(warning, sourceSpan, ParseErrorLevel.WARNING); });
            return bindingsResult.templateBindings;
        }
        catch (e) {
            this._reportError(`${e}`, sourceSpan);
            return [];
        }
    }
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetProps
     * @return {?}
     */
    parseLiteralAttr(name, value, sourceSpan, targetMatchableAttrs, targetProps) {
        if (_isAnimationLabel(name)) {
            name = name.substring(1);
            if (value) {
                this._reportError(`Assigning animation triggers via @prop="exp" attributes with an expression is invalid.` +
                    ` Use property bindings (e.g. [@prop]="exp") or use an attribute without a value (e.g. @prop) instead.`, sourceSpan, ParseErrorLevel.ERROR);
            }
            this._parseAnimation(name, value, sourceSpan, targetMatchableAttrs, targetProps);
        }
        else {
            targetProps.push(new BoundProperty(name, this._exprParser.wrapLiteralPrimitive(value, ''), BoundPropertyType.LITERAL_ATTR, sourceSpan));
        }
    }
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} isHost
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetProps
     * @return {?}
     */
    parsePropertyBinding(name, expression, isHost, sourceSpan, targetMatchableAttrs, targetProps) {
        let /** @type {?} */ isAnimationProp = false;
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
    }
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetProps
     * @return {?}
     */
    parsePropertyInterpolation(name, value, sourceSpan, targetMatchableAttrs, targetProps) {
        const /** @type {?} */ expr = this.parseInterpolation(value, sourceSpan);
        if (expr) {
            this._parsePropertyAst(name, expr, sourceSpan, targetMatchableAttrs, targetProps);
            return true;
        }
        return false;
    }
    /**
     * @param {?} name
     * @param {?} ast
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetProps
     * @return {?}
     */
    _parsePropertyAst(name, ast, sourceSpan, targetMatchableAttrs, targetProps) {
        targetMatchableAttrs.push([name, /** @type {?} */ ((ast.source))]);
        targetProps.push(new BoundProperty(name, ast, BoundPropertyType.DEFAULT, sourceSpan));
    }
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetProps
     * @return {?}
     */
    _parseAnimation(name, expression, sourceSpan, targetMatchableAttrs, targetProps) {
        // This will occur when a @trigger is not paired with an expression.
        // For animations it is valid to not have an expression since */void
        // states will be applied by angular when the element is attached/detached
        const /** @type {?} */ ast = this._parseBinding(expression || 'null', false, sourceSpan);
        targetMatchableAttrs.push([name, /** @type {?} */ ((ast.source))]);
        targetProps.push(new BoundProperty(name, ast, BoundPropertyType.ANIMATION, sourceSpan));
    }
    /**
     * @param {?} value
     * @param {?} isHostBinding
     * @param {?} sourceSpan
     * @return {?}
     */
    _parseBinding(value, isHostBinding, sourceSpan) {
        const /** @type {?} */ sourceInfo = sourceSpan.start.toString();
        try {
            const /** @type {?} */ ast = isHostBinding ?
                this._exprParser.parseSimpleBinding(value, sourceInfo, this._interpolationConfig) :
                this._exprParser.parseBinding(value, sourceInfo, this._interpolationConfig);
            if (ast)
                this._reportExpressionParserErrors(ast.errors, sourceSpan);
            this._checkPipes(ast, sourceSpan);
            return ast;
        }
        catch (e) {
            this._reportError(`${e}`, sourceSpan);
            return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
        }
    }
    /**
     * @param {?} elementSelector
     * @param {?} boundProp
     * @return {?}
     */
    createElementPropertyAst(elementSelector, boundProp) {
        if (boundProp.isAnimation) {
            return new BoundElementPropertyAst(boundProp.name, PropertyBindingType.Animation, SecurityContext.NONE, boundProp.expression, null, boundProp.sourceSpan);
        }
        let /** @type {?} */ unit = null;
        let /** @type {?} */ bindingType = ((undefined));
        let /** @type {?} */ boundPropertyName = null;
        const /** @type {?} */ parts = boundProp.name.split(PROPERTY_PARTS_SEPARATOR);
        let /** @type {?} */ securityContexts = ((undefined));
        // Check check for special cases (prefix style, attr, class)
        if (parts.length > 1) {
            if (parts[0] == ATTRIBUTE_PREFIX) {
                boundPropertyName = parts[1];
                this._validatePropertyOrAttributeName(boundPropertyName, boundProp.sourceSpan, true);
                securityContexts = calcPossibleSecurityContexts(this._schemaRegistry, elementSelector, boundPropertyName, true);
                const /** @type {?} */ nsSeparatorIdx = boundPropertyName.indexOf(':');
                if (nsSeparatorIdx > -1) {
                    const /** @type {?} */ ns = boundPropertyName.substring(0, nsSeparatorIdx);
                    const /** @type {?} */ name = boundPropertyName.substring(nsSeparatorIdx + 1);
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
    }
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetEvents
     * @return {?}
     */
    parseEvent(name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
        if (_isAnimationLabel(name)) {
            name = name.substr(1);
            this._parseAnimationEvent(name, expression, sourceSpan, targetEvents);
        }
        else {
            this._parseEvent(name, expression, sourceSpan, targetMatchableAttrs, targetEvents);
        }
    }
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} targetEvents
     * @return {?}
     */
    _parseAnimationEvent(name, expression, sourceSpan, targetEvents) {
        const /** @type {?} */ matches = splitAtPeriod(name, [name, '']);
        const /** @type {?} */ eventName = matches[0];
        const /** @type {?} */ phase = matches[1].toLowerCase();
        if (phase) {
            switch (phase) {
                case 'start':
                case 'done':
                    const /** @type {?} */ ast = this._parseAction(expression, sourceSpan);
                    targetEvents.push(new BoundEventAst(eventName, null, phase, ast, sourceSpan));
                    break;
                default:
                    this._reportError(`The provided animation output phase value "${phase}" for "@${eventName}" is not supported (use start or done)`, sourceSpan);
                    break;
            }
        }
        else {
            this._reportError(`The animation trigger output event (@${eventName}) is missing its phase value name (start or done are currently supported)`, sourceSpan);
        }
    }
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetEvents
     * @return {?}
     */
    _parseEvent(name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
        // long format: 'target: eventName'
        const [target, eventName] = splitAtColon(name, [/** @type {?} */ ((null)), name]);
        const /** @type {?} */ ast = this._parseAction(expression, sourceSpan);
        targetMatchableAttrs.push([/** @type {?} */ ((name)), /** @type {?} */ ((ast.source))]);
        targetEvents.push(new BoundEventAst(eventName, target, null, ast, sourceSpan));
        // Don't detect directives for event names for now,
        // so don't add the event name to the matchableAttrs
    }
    /**
     * @param {?} value
     * @param {?} sourceSpan
     * @return {?}
     */
    _parseAction(value, sourceSpan) {
        const /** @type {?} */ sourceInfo = sourceSpan.start.toString();
        try {
            const /** @type {?} */ ast = this._exprParser.parseAction(value, sourceInfo, this._interpolationConfig);
            if (ast) {
                this._reportExpressionParserErrors(ast.errors, sourceSpan);
            }
            if (!ast || ast.ast instanceof EmptyExpr) {
                this._reportError(`Empty expressions are not allowed`, sourceSpan);
                return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
            }
            this._checkPipes(ast, sourceSpan);
            return ast;
        }
        catch (e) {
            this._reportError(`${e}`, sourceSpan);
            return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
        }
    }
    /**
     * @param {?} message
     * @param {?} sourceSpan
     * @param {?=} level
     * @return {?}
     */
    _reportError(message, sourceSpan, level = ParseErrorLevel.ERROR) {
        this._targetErrors.push(new ParseError(sourceSpan, message, level));
    }
    /**
     * @param {?} errors
     * @param {?} sourceSpan
     * @return {?}
     */
    _reportExpressionParserErrors(errors, sourceSpan) {
        for (const /** @type {?} */ error of errors) {
            this._reportError(error.message, sourceSpan);
        }
    }
    /**
     * @param {?} ast
     * @param {?} sourceSpan
     * @return {?}
     */
    _checkPipes(ast, sourceSpan) {
        if (ast) {
            const /** @type {?} */ collector = new PipeCollector();
            ast.visit(collector);
            collector.pipes.forEach((ast, pipeName) => {
                const /** @type {?} */ pipeMeta = this.pipesByName.get(pipeName);
                if (!pipeMeta) {
                    this._reportError(`The pipe '${pipeName}' could not be found`, new ParseSourceSpan(sourceSpan.start.moveBy(ast.span.start), sourceSpan.start.moveBy(ast.span.end)));
                }
                else {
                    this._usedPipes.set(pipeName, pipeMeta);
                }
            });
        }
    }
    /**
     * @param {?} propName the name of the property / attribute
     * @param {?} sourceSpan
     * @param {?} isAttr true when binding to an attribute
     * @return {?}
     */
    _validatePropertyOrAttributeName(propName, sourceSpan, isAttr) {
        const /** @type {?} */ report = isAttr ? this._schemaRegistry.validateAttribute(propName) :
            this._schemaRegistry.validateProperty(propName);
        if (report.error) {
            this._reportError(/** @type {?} */ ((report.msg)), sourceSpan, ParseErrorLevel.ERROR);
        }
    }
}
class PipeCollector extends RecursiveAstVisitor {
    constructor() {
        super(...arguments);
        this.pipes = new Map();
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPipe(ast, context) {
        this.pipes.set(ast.name, ast);
        ast.exp.visit(this);
        this.visitAll(ast.args, context);
        return null;
    }
}
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
    const /** @type {?} */ ctxs = [];
    CssSelector.parse(selector).forEach((selector) => {
        const /** @type {?} */ elementNames = selector.element ? [selector.element] : registry.allKnownElementNames();
        const /** @type {?} */ notElementNames = new Set(selector.notSelectors.filter(selector => selector.isElementSelector())
            .map((selector) => selector.element));
        const /** @type {?} */ possibleElementNames = elementNames.filter(elementName => !notElementNames.has(elementName));
        ctxs.push(...possibleElementNames.map(elementName => registry.securityContext(elementName, propName, isAttribute)));
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
const NG_CONTENT_SELECT_ATTR = 'select';
const LINK_ELEMENT = 'link';
const LINK_STYLE_REL_ATTR = 'rel';
const LINK_STYLE_HREF_ATTR = 'href';
const LINK_STYLE_REL_VALUE = 'stylesheet';
const STYLE_ELEMENT = 'style';
const SCRIPT_ELEMENT = 'script';
const NG_NON_BINDABLE_ATTR = 'ngNonBindable';
const NG_PROJECT_AS = 'ngProjectAs';
/**
 * @param {?} ast
 * @return {?}
 */
function preparseElement(ast) {
    let /** @type {?} */ selectAttr = ((null));
    let /** @type {?} */ hrefAttr = ((null));
    let /** @type {?} */ relAttr = ((null));
    let /** @type {?} */ nonBindable = false;
    let /** @type {?} */ projectAs = ((null));
    ast.attrs.forEach(attr => {
        const /** @type {?} */ lcAttrName = attr.name.toLowerCase();
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
    const /** @type {?} */ nodeName = ast.name.toLowerCase();
    let /** @type {?} */ type = PreparsedElementType.OTHER;
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
let PreparsedElementType = {};
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
class PreparsedElement {
    /**
     * @param {?} type
     * @param {?} selectAttr
     * @param {?} hrefAttr
     * @param {?} nonBindable
     * @param {?} projectAs
     */
    constructor(type, selectAttr, hrefAttr, nonBindable, projectAs) {
        this.type = type;
        this.selectAttr = selectAttr;
        this.hrefAttr = hrefAttr;
        this.nonBindable = nonBindable;
        this.projectAs = projectAs;
    }
}
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
const BIND_NAME_REGEXP = /^(?:(?:(?:(bind-)|(let-)|(ref-|#)|(on-)|(bindon-)|(@))(.+))|\[\(([^\)]+)\)\]|\[([^\]]+)\]|\(([^\)]+)\))$/;
// Group 1 = "bind-"
const KW_BIND_IDX = 1;
// Group 2 = "let-"
const KW_LET_IDX = 2;
// Group 3 = "ref-/#"
const KW_REF_IDX = 3;
// Group 4 = "on-"
const KW_ON_IDX = 4;
// Group 5 = "bindon-"
const KW_BINDON_IDX = 5;
// Group 6 = "@"
const KW_AT_IDX = 6;
// Group 7 = the identifier after "bind-", "let-", "ref-/#", "on-", "bindon-" or "@"
const IDENT_KW_IDX = 7;
// Group 8 = identifier inside [()]
const IDENT_BANANA_BOX_IDX = 8;
// Group 9 = identifier inside []
const IDENT_PROPERTY_IDX = 9;
// Group 10 = identifier inside ()
const IDENT_EVENT_IDX = 10;
// deprecated in 4.x
const TEMPLATE_ELEMENT = 'template';
// deprecated in 4.x
const TEMPLATE_ATTR = 'template';
const TEMPLATE_ATTR_PREFIX = '*';
const CLASS_ATTR = 'class';
const TEXT_CSS_SELECTOR = CssSelector.parse('*')[0];
const TEMPLATE_ELEMENT_DEPRECATION_WARNING = 'The <template> element is deprecated. Use <ng-template> instead';
const TEMPLATE_ATTR_DEPRECATION_WARNING = 'The template attribute is deprecated. Use an ng-template element instead.';
let warningCounts = {};
/**
 * @param {?} warnings
 * @return {?}
 */
function warnOnlyOnce(warnings) {
    return (error) => {
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
const TEMPLATE_TRANSFORMS = new InjectionToken('TemplateTransforms');
class TemplateParseError extends ParseError {
    /**
     * @param {?} message
     * @param {?} span
     * @param {?} level
     */
    constructor(message, span, level) {
        super(span, message, level);
    }
}
class TemplateParseResult {
    /**
     * @param {?=} templateAst
     * @param {?=} usedPipes
     * @param {?=} errors
     */
    constructor(templateAst, usedPipes, errors) {
        this.templateAst = templateAst;
        this.usedPipes = usedPipes;
        this.errors = errors;
    }
}
class TemplateParser {
    /**
     * @param {?} _config
     * @param {?} _exprParser
     * @param {?} _schemaRegistry
     * @param {?} _htmlParser
     * @param {?} _console
     * @param {?} transforms
     */
    constructor(_config, _exprParser, _schemaRegistry, _htmlParser, _console, transforms) {
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
    parse(component, template, directives, pipes, schemas, templateUrl) {
        const /** @type {?} */ result = this.tryParse(component, template, directives, pipes, schemas, templateUrl);
        const /** @type {?} */ warnings = ((result.errors)).filter(error => error.level === ParseErrorLevel.WARNING)
            .filter(warnOnlyOnce([TEMPLATE_ATTR_DEPRECATION_WARNING, TEMPLATE_ELEMENT_DEPRECATION_WARNING]));
        const /** @type {?} */ errors = ((result.errors)).filter(error => error.level === ParseErrorLevel.ERROR);
        if (warnings.length > 0) {
            this._console.warn(`Template parse warnings:\n${warnings.join('\n')}`);
        }
        if (errors.length > 0) {
            const /** @type {?} */ errorString = errors.join('\n');
            throw syntaxError(`Template parse errors:\n${errorString}`);
        }
        return { template: /** @type {?} */ ((result.templateAst)), pipes: /** @type {?} */ ((result.usedPipes)) };
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
    tryParse(component, template, directives, pipes, schemas, templateUrl) {
        return this.tryParseHtml(this.expandHtml(/** @type {?} */ ((this._htmlParser)).parse(template, templateUrl, true, this.getInterpolationConfig(component))), component, directives, pipes, schemas);
    }
    /**
     * @param {?} htmlAstWithErrors
     * @param {?} component
     * @param {?} directives
     * @param {?} pipes
     * @param {?} schemas
     * @return {?}
     */
    tryParseHtml(htmlAstWithErrors, component, directives, pipes, schemas) {
        let /** @type {?} */ result;
        const /** @type {?} */ errors = htmlAstWithErrors.errors;
        const /** @type {?} */ usedPipes = [];
        if (htmlAstWithErrors.rootNodes.length > 0) {
            const /** @type {?} */ uniqDirectives = removeSummaryDuplicates(directives);
            const /** @type {?} */ uniqPipes = removeSummaryDuplicates(pipes);
            const /** @type {?} */ providerViewContext = new ProviderViewContext(component);
            let /** @type {?} */ interpolationConfig = ((undefined));
            if (component.template && component.template.interpolation) {
                interpolationConfig = {
                    start: component.template.interpolation[0],
                    end: component.template.interpolation[1]
                };
            }
            const /** @type {?} */ bindingParser = new BindingParser(this._exprParser, /** @type {?} */ ((interpolationConfig)), this._schemaRegistry, uniqPipes, errors);
            const /** @type {?} */ parseVisitor = new TemplateParseVisitor(this._config, providerViewContext, uniqDirectives, bindingParser, this._schemaRegistry, schemas, errors);
            result = visitAll(parseVisitor, htmlAstWithErrors.rootNodes, EMPTY_ELEMENT_CONTEXT);
            errors.push(...providerViewContext.errors);
            usedPipes.push(...bindingParser.getUsedPipes());
        }
        else {
            result = [];
        }
        this._assertNoReferenceDuplicationOnTemplate(result, errors);
        if (errors.length > 0) {
            return new TemplateParseResult(result, usedPipes, errors);
        }
        if (this.transforms) {
            this.transforms.forEach((transform) => { result = templateVisitAll(transform, result); });
        }
        return new TemplateParseResult(result, usedPipes, errors);
    }
    /**
     * @param {?} htmlAstWithErrors
     * @param {?=} forced
     * @return {?}
     */
    expandHtml(htmlAstWithErrors, forced = false) {
        const /** @type {?} */ errors = htmlAstWithErrors.errors;
        if (errors.length == 0 || forced) {
            // Transform ICU messages to angular directives
            const /** @type {?} */ expandedHtmlAst = expandNodes(htmlAstWithErrors.rootNodes);
            errors.push(...expandedHtmlAst.errors);
            htmlAstWithErrors = new ParseTreeResult(expandedHtmlAst.nodes, errors);
        }
        return htmlAstWithErrors;
    }
    /**
     * @param {?} component
     * @return {?}
     */
    getInterpolationConfig(component) {
        if (component.template) {
            return InterpolationConfig.fromArray(component.template.interpolation);
        }
        return undefined;
    }
    /**
     * \@internal
     * @param {?} result
     * @param {?} errors
     * @return {?}
     */
    _assertNoReferenceDuplicationOnTemplate(result, errors) {
        const /** @type {?} */ existingReferences = [];
        result.filter(element => !!((element)).references)
            .forEach(element => ((element)).references.forEach((reference) => {
            const /** @type {?} */ name = reference.name;
            if (existingReferences.indexOf(name) < 0) {
                existingReferences.push(name);
            }
            else {
                const /** @type {?} */ error = new TemplateParseError(`Reference "#${name}" is defined several times`, reference.sourceSpan, ParseErrorLevel.ERROR);
                errors.push(error);
            }
        }));
    }
}
TemplateParser.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
TemplateParser.ctorParameters = () => [
    { type: CompilerConfig, },
    { type: Parser, },
    { type: ElementSchemaRegistry, },
    { type: I18NHtmlParser, },
    { type: ɵConsole, },
    { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [TEMPLATE_TRANSFORMS,] },] },
];
class TemplateParseVisitor {
    /**
     * @param {?} config
     * @param {?} providerViewContext
     * @param {?} directives
     * @param {?} _bindingParser
     * @param {?} _schemaRegistry
     * @param {?} _schemas
     * @param {?} _targetErrors
     */
    constructor(config, providerViewContext, directives, _bindingParser, _schemaRegistry, _schemas, _targetErrors) {
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
        directives.forEach((directive, index) => {
            const selector = CssSelector.parse(directive.selector);
            this.selectorMatcher.addSelectables(selector, directive);
            this.directivesIndex.set(directive, index);
        });
    }
    /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    visitExpansion(expansion, context) { return null; }
    /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    visitExpansionCase(expansionCase, context) { return null; }
    /**
     * @param {?} text
     * @param {?} parent
     * @return {?}
     */
    visitText(text, parent) {
        const /** @type {?} */ ngContentIndex = ((parent.findNgContentIndex(TEXT_CSS_SELECTOR)));
        const /** @type {?} */ expr = this._bindingParser.parseInterpolation(text.value, /** @type {?} */ ((text.sourceSpan)));
        return expr ? new BoundTextAst(expr, ngContentIndex, /** @type {?} */ ((text.sourceSpan))) :
            new TextAst(text.value, ngContentIndex, /** @type {?} */ ((text.sourceSpan)));
    }
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    visitAttribute(attribute, context) {
        return new AttrAst(attribute.name, attribute.value, attribute.sourceSpan);
    }
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    visitComment(comment, context) { return null; }
    /**
     * @param {?} element
     * @param {?} parent
     * @return {?}
     */
    visitElement(element, parent) {
        const /** @type {?} */ queryStartIndex = this.contentQueryStartId;
        const /** @type {?} */ nodeName = element.name;
        const /** @type {?} */ preparsedElement = preparseElement(element);
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
        const /** @type {?} */ matchableAttrs = [];
        const /** @type {?} */ elementOrDirectiveProps = [];
        const /** @type {?} */ elementOrDirectiveRefs = [];
        const /** @type {?} */ elementVars = [];
        const /** @type {?} */ events = [];
        const /** @type {?} */ templateElementOrDirectiveProps = [];
        const /** @type {?} */ templateMatchableAttrs = [];
        const /** @type {?} */ templateElementVars = [];
        let /** @type {?} */ hasInlineTemplates = false;
        const /** @type {?} */ attrs = [];
        const /** @type {?} */ isTemplateElement = isTemplate(element, this.config.enableLegacyTemplate, (m, span) => this._reportError(m, span, ParseErrorLevel.WARNING));
        element.attrs.forEach(attr => {
            const /** @type {?} */ hasBinding = this._parseAttr(isTemplateElement, attr, matchableAttrs, elementOrDirectiveProps, events, elementOrDirectiveRefs, elementVars);
            let /** @type {?} */ templateBindingsSource;
            let /** @type {?} */ prefixToken;
            let /** @type {?} */ normalizedName = this._normalizeAttributeName(attr.name);
            if (this.config.enableLegacyTemplate && normalizedName == TEMPLATE_ATTR) {
                this._reportError(TEMPLATE_ATTR_DEPRECATION_WARNING, attr.sourceSpan, ParseErrorLevel.WARNING);
                templateBindingsSource = attr.value;
            }
            else if (normalizedName.startsWith(TEMPLATE_ATTR_PREFIX)) {
                templateBindingsSource = attr.value;
                prefixToken = normalizedName.substring(TEMPLATE_ATTR_PREFIX.length) + ':';
            }
            const /** @type {?} */ hasTemplateBinding = templateBindingsSource != null;
            if (hasTemplateBinding) {
                if (hasInlineTemplates) {
                    this._reportError(`Can't have multiple template bindings on one element. Use only one attribute named 'template' or prefixed with *`, attr.sourceSpan);
                }
                hasInlineTemplates = true;
                this._bindingParser.parseInlineTemplateBinding(/** @type {?} */ ((prefixToken)), /** @type {?} */ ((templateBindingsSource)), attr.sourceSpan, templateMatchableAttrs, templateElementOrDirectiveProps, templateElementVars);
            }
            if (!hasBinding && !hasTemplateBinding) {
                // don't include the bindings as attributes as well in the AST
                attrs.push(this.visitAttribute(attr, null));
                matchableAttrs.push([attr.name, attr.value]);
            }
        });
        const /** @type {?} */ elementCssSelector = createElementCssSelector(nodeName, matchableAttrs);
        const { directives: directiveMetas, matchElement } = this._parseDirectives(this.selectorMatcher, elementCssSelector);
        const /** @type {?} */ references = [];
        const /** @type {?} */ boundDirectivePropNames = new Set();
        const /** @type {?} */ directiveAsts = this._createDirectiveAsts(isTemplateElement, element.name, directiveMetas, elementOrDirectiveProps, elementOrDirectiveRefs, /** @type {?} */ ((element.sourceSpan)), references, boundDirectivePropNames);
        const /** @type {?} */ elementProps = this._createElementPropertyAsts(element.name, elementOrDirectiveProps, boundDirectivePropNames);
        const /** @type {?} */ isViewRoot = parent.isTemplateElement || hasInlineTemplates;
        const /** @type {?} */ providerContext = new ProviderElementContext(this.providerViewContext, /** @type {?} */ ((parent.providerContext)), isViewRoot, directiveAsts, attrs, references, isTemplateElement, queryStartIndex, /** @type {?} */ ((element.sourceSpan)));
        const /** @type {?} */ children = visitAll(preparsedElement.nonBindable ? NON_BINDABLE_VISITOR : this, element.children, ElementContext.create(isTemplateElement, directiveAsts, isTemplateElement ? ((parent.providerContext)) : providerContext));
        providerContext.afterElement();
        // Override the actual selector when the `ngProjectAs` attribute is provided
        const /** @type {?} */ projectionSelector = preparsedElement.projectAs != null ?
            CssSelector.parse(preparsedElement.projectAs)[0] :
            elementCssSelector;
        const /** @type {?} */ ngContentIndex = ((parent.findNgContentIndex(projectionSelector)));
        let /** @type {?} */ parsedElement;
        if (preparsedElement.type === PreparsedElementType.NG_CONTENT) {
            if (element.children && !element.children.every(_isEmptyTextNode)) {
                this._reportError(`<ng-content> element cannot have content.`, /** @type {?} */ ((element.sourceSpan)));
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
            const /** @type {?} */ ngContentIndex = hasInlineTemplates ? null : parent.findNgContentIndex(projectionSelector);
            parsedElement = new ElementAst(nodeName, attrs, elementProps, events, references, providerContext.transformedDirectiveAsts, providerContext.transformProviders, providerContext.transformedHasViewContainer, providerContext.queryMatches, children, hasInlineTemplates ? null : ngContentIndex, element.sourceSpan, element.endSourceSpan || null);
        }
        if (hasInlineTemplates) {
            const /** @type {?} */ templateQueryStartIndex = this.contentQueryStartId;
            const /** @type {?} */ templateSelector = createElementCssSelector(TEMPLATE_ELEMENT, templateMatchableAttrs);
            const { directives: templateDirectiveMetas } = this._parseDirectives(this.selectorMatcher, templateSelector);
            const /** @type {?} */ templateBoundDirectivePropNames = new Set();
            const /** @type {?} */ templateDirectiveAsts = this._createDirectiveAsts(true, element.name, templateDirectiveMetas, templateElementOrDirectiveProps, [], /** @type {?} */ ((element.sourceSpan)), [], templateBoundDirectivePropNames);
            const /** @type {?} */ templateElementProps = this._createElementPropertyAsts(element.name, templateElementOrDirectiveProps, templateBoundDirectivePropNames);
            this._assertNoComponentsNorElementBindingsOnTemplate(templateDirectiveAsts, templateElementProps, /** @type {?} */ ((element.sourceSpan)));
            const /** @type {?} */ templateProviderContext = new ProviderElementContext(this.providerViewContext, /** @type {?} */ ((parent.providerContext)), parent.isTemplateElement, templateDirectiveAsts, [], [], true, templateQueryStartIndex, /** @type {?} */ ((element.sourceSpan)));
            templateProviderContext.afterElement();
            parsedElement = new EmbeddedTemplateAst([], [], [], templateElementVars, templateProviderContext.transformedDirectiveAsts, templateProviderContext.transformProviders, templateProviderContext.transformedHasViewContainer, templateProviderContext.queryMatches, [parsedElement], ngContentIndex, /** @type {?} */ ((element.sourceSpan)));
        }
        return parsedElement;
    }
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
    _parseAttr(isTemplateElement, attr, targetMatchableAttrs, targetProps, targetEvents, targetRefs, targetVars) {
        const /** @type {?} */ name = this._normalizeAttributeName(attr.name);
        const /** @type {?} */ value = attr.value;
        const /** @type {?} */ srcSpan = attr.sourceSpan;
        const /** @type {?} */ bindParts = name.match(BIND_NAME_REGEXP);
        let /** @type {?} */ hasBinding = false;
        if (bindParts !== null) {
            hasBinding = true;
            if (bindParts[KW_BIND_IDX] != null) {
                this._bindingParser.parsePropertyBinding(bindParts[IDENT_KW_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
            }
            else if (bindParts[KW_LET_IDX]) {
                if (isTemplateElement) {
                    const /** @type {?} */ identifier = bindParts[IDENT_KW_IDX];
                    this._parseVariable(identifier, value, srcSpan, targetVars);
                }
                else {
                    this._reportError(`"let-" is only supported on template elements.`, srcSpan);
                }
            }
            else if (bindParts[KW_REF_IDX]) {
                const /** @type {?} */ identifier = bindParts[IDENT_KW_IDX];
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
    }
    /**
     * @param {?} attrName
     * @return {?}
     */
    _normalizeAttributeName(attrName) {
        return /^data-/i.test(attrName) ? attrName.substring(5) : attrName;
    }
    /**
     * @param {?} identifier
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} targetVars
     * @return {?}
     */
    _parseVariable(identifier, value, sourceSpan, targetVars) {
        if (identifier.indexOf('-') > -1) {
            this._reportError(`"-" is not allowed in variable names`, sourceSpan);
        }
        targetVars.push(new VariableAst(identifier, value, sourceSpan));
    }
    /**
     * @param {?} identifier
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?} targetRefs
     * @return {?}
     */
    _parseReference(identifier, value, sourceSpan, targetRefs) {
        if (identifier.indexOf('-') > -1) {
            this._reportError(`"-" is not allowed in reference names`, sourceSpan);
        }
        targetRefs.push(new ElementOrDirectiveRef(identifier, value, sourceSpan));
    }
    /**
     * @param {?} name
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} targetMatchableAttrs
     * @param {?} targetEvents
     * @return {?}
     */
    _parseAssignmentEvent(name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
        this._bindingParser.parseEvent(`${name}Change`, `${expression}=$event`, sourceSpan, targetMatchableAttrs, targetEvents);
    }
    /**
     * @param {?} selectorMatcher
     * @param {?} elementCssSelector
     * @return {?}
     */
    _parseDirectives(selectorMatcher, elementCssSelector) {
        // Need to sort the directives so that we get consistent results throughout,
        // as selectorMatcher uses Maps inside.
        // Also deduplicate directives as they might match more than one time!
        const /** @type {?} */ directives = new Array(this.directivesIndex.size);
        // Whether any directive selector matches on the element name
        let /** @type {?} */ matchElement = false;
        selectorMatcher.match(elementCssSelector, (selector, directive) => {
            directives[((this.directivesIndex.get(directive)))] = directive;
            matchElement = matchElement || selector.hasElementSelector();
        });
        return {
            directives: directives.filter(dir => !!dir),
            matchElement,
        };
    }
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
    _createDirectiveAsts(isTemplateElement, elementName, directives, props, elementOrDirectiveRefs, elementSourceSpan, targetReferences, targetBoundDirectivePropNames) {
        const /** @type {?} */ matchedReferences = new Set();
        let /** @type {?} */ component = ((null));
        const /** @type {?} */ directiveAsts = directives.map((directive) => {
            const /** @type {?} */ sourceSpan = new ParseSourceSpan(elementSourceSpan.start, elementSourceSpan.end, `Directive ${identifierName(directive.type)}`);
            if (directive.isComponent) {
                component = directive;
            }
            const /** @type {?} */ directiveProperties = [];
            let /** @type {?} */ hostProperties = ((this._bindingParser.createDirectiveHostPropertyAsts(directive, elementName, sourceSpan)));
            // Note: We need to check the host properties here as well,
            // as we don't know the element name in the DirectiveWrapperCompiler yet.
            hostProperties = this._checkPropertiesInSchema(elementName, hostProperties);
            const /** @type {?} */ hostEvents = ((this._bindingParser.createDirectiveHostEventAsts(directive, sourceSpan)));
            this._createDirectivePropertyAsts(directive.inputs, props, directiveProperties, targetBoundDirectivePropNames);
            elementOrDirectiveRefs.forEach((elOrDirRef) => {
                if ((elOrDirRef.value.length === 0 && directive.isComponent) ||
                    (directive.exportAs == elOrDirRef.value)) {
                    targetReferences.push(new ReferenceAst(elOrDirRef.name, identifierToken(directive.type), elOrDirRef.sourceSpan));
                    matchedReferences.add(elOrDirRef.name);
                }
            });
            const /** @type {?} */ contentQueryStartId = this.contentQueryStartId;
            this.contentQueryStartId += directive.queries.length;
            return new DirectiveAst(directive, directiveProperties, hostProperties, hostEvents, contentQueryStartId, sourceSpan);
        });
        elementOrDirectiveRefs.forEach((elOrDirRef) => {
            if (elOrDirRef.value.length > 0) {
                if (!matchedReferences.has(elOrDirRef.name)) {
                    this._reportError(`There is no directive with "exportAs" set to "${elOrDirRef.value}"`, elOrDirRef.sourceSpan);
                }
            }
            else if (!component) {
                let /** @type {?} */ refToken = ((null));
                if (isTemplateElement) {
                    refToken = createIdentifierToken(Identifiers.TemplateRef);
                }
                targetReferences.push(new ReferenceAst(elOrDirRef.name, refToken, elOrDirRef.sourceSpan));
            }
        });
        return directiveAsts;
    }
    /**
     * @param {?} directiveProperties
     * @param {?} boundProps
     * @param {?} targetBoundDirectiveProps
     * @param {?} targetBoundDirectivePropNames
     * @return {?}
     */
    _createDirectivePropertyAsts(directiveProperties, boundProps, targetBoundDirectiveProps, targetBoundDirectivePropNames) {
        if (directiveProperties) {
            const /** @type {?} */ boundPropsByName = new Map();
            boundProps.forEach(boundProp => {
                const /** @type {?} */ prevValue = boundPropsByName.get(boundProp.name);
                if (!prevValue || prevValue.isLiteral) {
                    // give [a]="b" a higher precedence than a="b" on the same element
                    boundPropsByName.set(boundProp.name, boundProp);
                }
            });
            Object.keys(directiveProperties).forEach(dirProp => {
                const /** @type {?} */ elProp = directiveProperties[dirProp];
                const /** @type {?} */ boundProp = boundPropsByName.get(elProp);
                // Bindings are optional, so this binding only needs to be set up if an expression is given.
                if (boundProp) {
                    targetBoundDirectivePropNames.add(boundProp.name);
                    if (!isEmptyExpression(boundProp.expression)) {
                        targetBoundDirectiveProps.push(new BoundDirectivePropertyAst(dirProp, boundProp.name, boundProp.expression, boundProp.sourceSpan));
                    }
                }
            });
        }
    }
    /**
     * @param {?} elementName
     * @param {?} props
     * @param {?} boundDirectivePropNames
     * @return {?}
     */
    _createElementPropertyAsts(elementName, props, boundDirectivePropNames) {
        const /** @type {?} */ boundElementProps = [];
        props.forEach((prop) => {
            if (!prop.isLiteral && !boundDirectivePropNames.has(prop.name)) {
                boundElementProps.push(this._bindingParser.createElementPropertyAst(elementName, prop));
            }
        });
        return this._checkPropertiesInSchema(elementName, boundElementProps);
    }
    /**
     * @param {?} directives
     * @return {?}
     */
    _findComponentDirectives(directives) {
        return directives.filter(directive => directive.directive.isComponent);
    }
    /**
     * @param {?} directives
     * @return {?}
     */
    _findComponentDirectiveNames(directives) {
        return this._findComponentDirectives(directives)
            .map(directive => ((identifierName(directive.directive.type))));
    }
    /**
     * @param {?} directives
     * @param {?} sourceSpan
     * @return {?}
     */
    _assertOnlyOneComponent(directives, sourceSpan) {
        const /** @type {?} */ componentTypeNames = this._findComponentDirectiveNames(directives);
        if (componentTypeNames.length > 1) {
            this._reportError(`More than one component matched on this element.\n` +
                `Make sure that only one component's selector can match a given element.\n` +
                `Conflicting components: ${componentTypeNames.join(',')}`, sourceSpan);
        }
    }
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
    _assertElementExists(matchElement, element) {
        const /** @type {?} */ elName = element.name.replace(/^:xhtml:/, '');
        if (!matchElement && !this._schemaRegistry.hasElement(elName, this._schemas)) {
            let /** @type {?} */ errorMsg = `'${elName}' is not a known element:\n`;
            errorMsg +=
                `1. If '${elName}' is an Angular component, then verify that it is part of this module.\n`;
            if (elName.indexOf('-') > -1) {
                errorMsg +=
                    `2. If '${elName}' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.`;
            }
            else {
                errorMsg +=
                    `2. To allow any element add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component.`;
            }
            this._reportError(errorMsg, /** @type {?} */ ((element.sourceSpan)));
        }
    }
    /**
     * @param {?} directives
     * @param {?} elementProps
     * @param {?} sourceSpan
     * @return {?}
     */
    _assertNoComponentsNorElementBindingsOnTemplate(directives, elementProps, sourceSpan) {
        const /** @type {?} */ componentTypeNames = this._findComponentDirectiveNames(directives);
        if (componentTypeNames.length > 0) {
            this._reportError(`Components on an embedded template: ${componentTypeNames.join(',')}`, sourceSpan);
        }
        elementProps.forEach(prop => {
            this._reportError(`Property binding ${prop.name} not used by any directive on an embedded template. Make sure that the property name is spelled correctly and all directives are listed in the "@NgModule.declarations".`, sourceSpan);
        });
    }
    /**
     * @param {?} directives
     * @param {?} events
     * @return {?}
     */
    _assertAllEventsPublishedByDirectives(directives, events) {
        const /** @type {?} */ allDirectiveEvents = new Set();
        directives.forEach(directive => {
            Object.keys(directive.directive.outputs).forEach(k => {
                const /** @type {?} */ eventName = directive.directive.outputs[k];
                allDirectiveEvents.add(eventName);
            });
        });
        events.forEach(event => {
            if (event.target != null || !allDirectiveEvents.has(event.name)) {
                this._reportError(`Event binding ${event.fullName} not emitted by any directive on an embedded template. Make sure that the event name is spelled correctly and all directives are listed in the "@NgModule.declarations".`, event.sourceSpan);
            }
        });
    }
    /**
     * @param {?} elementName
     * @param {?} boundProps
     * @return {?}
     */
    _checkPropertiesInSchema(elementName, boundProps) {
        // Note: We can't filter out empty expressions before this method,
        // as we still want to validate them!
        return boundProps.filter((boundProp) => {
            if (boundProp.type === PropertyBindingType.Property &&
                !this._schemaRegistry.hasProperty(elementName, boundProp.name, this._schemas)) {
                let /** @type {?} */ errorMsg = `Can't bind to '${boundProp.name}' since it isn't a known property of '${elementName}'.`;
                if (elementName.startsWith('ng-')) {
                    errorMsg +=
                        `\n1. If '${boundProp.name}' is an Angular directive, then add 'CommonModule' to the '@NgModule.imports' of this component.` +
                            `\n2. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component.`;
                }
                else if (elementName.indexOf('-') > -1) {
                    errorMsg +=
                        `\n1. If '${elementName}' is an Angular component and it has '${boundProp.name}' input, then verify that it is part of this module.` +
                            `\n2. If '${elementName}' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.` +
                            `\n3. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component.`;
                }
                this._reportError(errorMsg, boundProp.sourceSpan);
            }
            return !isEmptyExpression(boundProp.value);
        });
    }
    /**
     * @param {?} message
     * @param {?} sourceSpan
     * @param {?=} level
     * @return {?}
     */
    _reportError(message, sourceSpan, level = ParseErrorLevel.ERROR) {
        this._targetErrors.push(new ParseError(sourceSpan, message, level));
    }
}
class NonBindableVisitor {
    /**
     * @param {?} ast
     * @param {?} parent
     * @return {?}
     */
    visitElement(ast, parent) {
        const /** @type {?} */ preparsedElement = preparseElement(ast);
        if (preparsedElement.type === PreparsedElementType.SCRIPT ||
            preparsedElement.type === PreparsedElementType.STYLE ||
            preparsedElement.type === PreparsedElementType.STYLESHEET) {
            // Skipping <script> for security reasons
            // Skipping <style> and stylesheets as we already processed them
            // in the StyleCompiler
            return null;
        }
        const /** @type {?} */ attrNameAndValues = ast.attrs.map((attr) => [attr.name, attr.value]);
        const /** @type {?} */ selector = createElementCssSelector(ast.name, attrNameAndValues);
        const /** @type {?} */ ngContentIndex = parent.findNgContentIndex(selector);
        const /** @type {?} */ children = visitAll(this, ast.children, EMPTY_ELEMENT_CONTEXT);
        return new ElementAst(ast.name, visitAll(this, ast.attrs), [], [], [], [], [], false, [], children, ngContentIndex, ast.sourceSpan, ast.endSourceSpan);
    }
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    visitComment(comment, context) { return null; }
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    visitAttribute(attribute, context) {
        return new AttrAst(attribute.name, attribute.value, attribute.sourceSpan);
    }
    /**
     * @param {?} text
     * @param {?} parent
     * @return {?}
     */
    visitText(text, parent) {
        const /** @type {?} */ ngContentIndex = ((parent.findNgContentIndex(TEXT_CSS_SELECTOR)));
        return new TextAst(text.value, ngContentIndex, /** @type {?} */ ((text.sourceSpan)));
    }
    /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    visitExpansion(expansion, context) { return expansion; }
    /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    visitExpansionCase(expansionCase, context) { return expansionCase; }
}
class ElementOrDirectiveRef {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     */
    constructor(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
}
/**
 * @param {?} classAttrValue
 * @return {?}
 */
function splitClasses(classAttrValue) {
    return classAttrValue.trim().split(/\s+/g);
}
class ElementContext {
    /**
     * @param {?} isTemplateElement
     * @param {?} _ngContentIndexMatcher
     * @param {?} _wildcardNgContentIndex
     * @param {?} providerContext
     */
    constructor(isTemplateElement, _ngContentIndexMatcher, _wildcardNgContentIndex, providerContext) {
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
    static create(isTemplateElement, directives, providerContext) {
        const /** @type {?} */ matcher = new SelectorMatcher();
        let /** @type {?} */ wildcardNgContentIndex = ((null));
        const /** @type {?} */ component = directives.find(directive => directive.directive.isComponent);
        if (component) {
            const /** @type {?} */ ngContentSelectors = ((component.directive.template)).ngContentSelectors;
            for (let /** @type {?} */ i = 0; i < ngContentSelectors.length; i++) {
                const /** @type {?} */ selector = ngContentSelectors[i];
                if (selector === '*') {
                    wildcardNgContentIndex = i;
                }
                else {
                    matcher.addSelectables(CssSelector.parse(ngContentSelectors[i]), i);
                }
            }
        }
        return new ElementContext(isTemplateElement, matcher, wildcardNgContentIndex, providerContext);
    }
    /**
     * @param {?} selector
     * @return {?}
     */
    findNgContentIndex(selector) {
        const /** @type {?} */ ngContentIndices = [];
        this._ngContentIndexMatcher.match(selector, (selector, ngContentIndex) => { ngContentIndices.push(ngContentIndex); });
        ngContentIndices.sort();
        if (this._wildcardNgContentIndex != null) {
            ngContentIndices.push(this._wildcardNgContentIndex);
        }
        return ngContentIndices.length > 0 ? ngContentIndices[0] : null;
    }
}
/**
 * @param {?} elementName
 * @param {?} attributes
 * @return {?}
 */
function createElementCssSelector(elementName, attributes) {
    const /** @type {?} */ cssSelector = new CssSelector();
    const /** @type {?} */ elNameNoNs = splitNsName(elementName)[1];
    cssSelector.setElement(elNameNoNs);
    for (let /** @type {?} */ i = 0; i < attributes.length; i++) {
        const /** @type {?} */ attrName = attributes[i][0];
        const /** @type {?} */ attrNameNoNs = splitNsName(attrName)[1];
        const /** @type {?} */ attrValue = attributes[i][1];
        cssSelector.addAttribute(attrNameNoNs, attrValue);
        if (attrName.toLowerCase() == CLASS_ATTR) {
            const /** @type {?} */ classes = splitClasses(attrValue);
            classes.forEach(className => cssSelector.addClassName(className));
        }
    }
    return cssSelector;
}
const EMPTY_ELEMENT_CONTEXT = new ElementContext(true, new SelectorMatcher(), null, null);
const NON_BINDABLE_VISITOR = new NonBindableVisitor();
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
    const /** @type {?} */ map = new Map();
    items.forEach((item) => {
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
    const /** @type {?} */ tagNoNs = splitNsName(el.name)[1];
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
class ResourceLoader {
    /**
     * @param {?} url
     * @return {?}
     */
    get(url) { return null; }
}

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
const DEFAULT_PACKAGE_URL_PROVIDER = {
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
class UrlResolver {
    /**
     * @param {?=} _packagePrefix
     */
    constructor(_packagePrefix = null) {
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
    resolve(baseUrl, url) {
        let /** @type {?} */ resolvedUrl = url;
        if (baseUrl != null && baseUrl.length > 0) {
            resolvedUrl = _resolveUrl(baseUrl, resolvedUrl);
        }
        const /** @type {?} */ resolvedParts = _split(resolvedUrl);
        let /** @type {?} */ prefix = this._packagePrefix;
        if (prefix != null && resolvedParts != null &&
            resolvedParts[_ComponentIndex.Scheme] == 'package') {
            let /** @type {?} */ path = resolvedParts[_ComponentIndex.Path];
            prefix = prefix.replace(/\/+$/, '');
            path = path.replace(/^\/+/, '');
            return `${prefix}/${path}`;
        }
        return resolvedUrl;
    }
}
UrlResolver.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
UrlResolver.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [PACKAGE_ROOT_URL,] },] },
];
/**
 * Extract the scheme of a URL.
 * @param {?} url
 * @return {?}
 */
function getUrlScheme(url) {
    const /** @type {?} */ match = _split(url);
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
    const /** @type {?} */ out = [];
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
const _splitRe = new RegExp('^' +
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
let _ComponentIndex = {};
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
    const /** @type {?} */ leadingSlash = path[0] == '/' ? '/' : '';
    const /** @type {?} */ trailingSlash = path[path.length - 1] === '/' ? '/' : '';
    const /** @type {?} */ segments = path.split('/');
    const /** @type {?} */ out = [];
    let /** @type {?} */ up = 0;
    for (let /** @type {?} */ pos = 0; pos < segments.length; pos++) {
        const /** @type {?} */ segment = segments[pos];
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
    let /** @type {?} */ path = parts[_ComponentIndex.Path];
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
    const /** @type {?} */ parts = _split(encodeURI(url));
    const /** @type {?} */ baseParts = _split(base);
    if (parts[_ComponentIndex.Scheme] != null) {
        return _joinAndCanonicalizePath(parts);
    }
    else {
        parts[_ComponentIndex.Scheme] = baseParts[_ComponentIndex.Scheme];
    }
    for (let /** @type {?} */ i = _ComponentIndex.Scheme; i <= _ComponentIndex.Port; i++) {
        if (parts[i] == null) {
            parts[i] = baseParts[i];
        }
    }
    if (parts[_ComponentIndex.Path][0] == '/') {
        return _joinAndCanonicalizePath(parts);
    }
    let /** @type {?} */ path = baseParts[_ComponentIndex.Path];
    if (path == null)
        path = '/';
    const /** @type {?} */ index = path.lastIndexOf('/');
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
class DirectiveNormalizer {
    /**
     * @param {?} _resourceLoader
     * @param {?} _urlResolver
     * @param {?} _htmlParser
     * @param {?} _config
     */
    constructor(_resourceLoader, _urlResolver, _htmlParser, _config) {
        this._resourceLoader = _resourceLoader;
        this._urlResolver = _urlResolver;
        this._htmlParser = _htmlParser;
        this._config = _config;
        this._resourceLoaderCache = new Map();
    }
    /**
     * @return {?}
     */
    clearCache() { this._resourceLoaderCache.clear(); }
    /**
     * @param {?} normalizedDirective
     * @return {?}
     */
    clearCacheFor(normalizedDirective) {
        if (!normalizedDirective.isComponent) {
            return;
        }
        const /** @type {?} */ template = ((normalizedDirective.template));
        this._resourceLoaderCache.delete(/** @type {?} */ ((template.templateUrl)));
        template.externalStylesheets.forEach((stylesheet) => { this._resourceLoaderCache.delete(/** @type {?} */ ((stylesheet.moduleUrl))); });
    }
    /**
     * @param {?} url
     * @return {?}
     */
    _fetch(url) {
        let /** @type {?} */ result = this._resourceLoaderCache.get(url);
        if (!result) {
            result = ((this._resourceLoader.get(url)));
            this._resourceLoaderCache.set(url, result);
        }
        return result;
    }
    /**
     * @param {?} prenormData
     * @return {?}
     */
    normalizeTemplate(prenormData) {
        let /** @type {?} */ normalizedTemplateSync = ((null));
        let /** @type {?} */ normalizedTemplateAsync = ((undefined));
        if (isDefined(prenormData.template)) {
            if (isDefined(prenormData.templateUrl)) {
                throw syntaxError(`'${ɵstringify(prenormData.componentType)}' component cannot define both template and templateUrl`);
            }
            if (typeof prenormData.template !== 'string') {
                throw syntaxError(`The template specified for component ${ɵstringify(prenormData.componentType)} is not a string`);
            }
            normalizedTemplateSync = this.normalizeTemplateSync(prenormData);
            normalizedTemplateAsync = Promise.resolve(/** @type {?} */ ((normalizedTemplateSync)));
        }
        else if (isDefined(prenormData.templateUrl)) {
            if (typeof prenormData.templateUrl !== 'string') {
                throw syntaxError(`The templateUrl specified for component ${ɵstringify(prenormData.componentType)} is not a string`);
            }
            normalizedTemplateAsync = this.normalizeTemplateAsync(prenormData);
        }
        else {
            throw syntaxError(`No template specified for component ${ɵstringify(prenormData.componentType)}`);
        }
        if (normalizedTemplateSync && normalizedTemplateSync.styleUrls.length === 0) {
            // sync case
            return new SyncAsyncResult(normalizedTemplateSync);
        }
        else {
            // async case
            return new SyncAsyncResult(null, normalizedTemplateAsync.then((normalizedTemplate) => this.normalizeExternalStylesheets(normalizedTemplate)));
        }
    }
    /**
     * @param {?} prenomData
     * @return {?}
     */
    normalizeTemplateSync(prenomData) {
        return this.normalizeLoadedTemplate(prenomData, /** @type {?} */ ((prenomData.template)), prenomData.moduleUrl);
    }
    /**
     * @param {?} prenomData
     * @return {?}
     */
    normalizeTemplateAsync(prenomData) {
        const /** @type {?} */ templateUrl = this._urlResolver.resolve(prenomData.moduleUrl, /** @type {?} */ ((prenomData.templateUrl)));
        return this._fetch(templateUrl)
            .then((value) => this.normalizeLoadedTemplate(prenomData, value, templateUrl));
    }
    /**
     * @param {?} prenormData
     * @param {?} template
     * @param {?} templateAbsUrl
     * @return {?}
     */
    normalizeLoadedTemplate(prenormData, template, templateAbsUrl) {
        const /** @type {?} */ isInline = !!prenormData.template;
        const /** @type {?} */ interpolationConfig = InterpolationConfig.fromArray(/** @type {?} */ ((prenormData.interpolation)));
        const /** @type {?} */ rootNodesAndErrors = this._htmlParser.parse(template, templateSourceUrl({ reference: prenormData.ngModuleType }, { type: { reference: prenormData.componentType } }, { isInline, templateUrl: templateAbsUrl }), true, interpolationConfig);
        if (rootNodesAndErrors.errors.length > 0) {
            const /** @type {?} */ errorString = rootNodesAndErrors.errors.join('\n');
            throw syntaxError(`Template parse errors:\n${errorString}`);
        }
        const /** @type {?} */ templateMetadataStyles = this.normalizeStylesheet(new CompileStylesheetMetadata({
            styles: prenormData.styles,
            styleUrls: prenormData.styleUrls,
            moduleUrl: prenormData.moduleUrl
        }));
        const /** @type {?} */ visitor = new TemplatePreparseVisitor();
        visitAll(visitor, rootNodesAndErrors.rootNodes);
        const /** @type {?} */ templateStyles = this.normalizeStylesheet(new CompileStylesheetMetadata({ styles: visitor.styles, styleUrls: visitor.styleUrls, moduleUrl: templateAbsUrl }));
        let /** @type {?} */ encapsulation = prenormData.encapsulation;
        if (encapsulation == null) {
            encapsulation = this._config.defaultEncapsulation;
        }
        const /** @type {?} */ styles = templateMetadataStyles.styles.concat(templateStyles.styles);
        const /** @type {?} */ styleUrls = templateMetadataStyles.styleUrls.concat(templateStyles.styleUrls);
        if (encapsulation === ViewEncapsulation.Emulated && styles.length === 0 &&
            styleUrls.length === 0) {
            encapsulation = ViewEncapsulation.None;
        }
        return new CompileTemplateMetadata({
            encapsulation,
            template,
            templateUrl: templateAbsUrl, styles, styleUrls,
            ngContentSelectors: visitor.ngContentSelectors,
            animations: prenormData.animations,
            interpolation: prenormData.interpolation, isInline,
            externalStylesheets: []
        });
    }
    /**
     * @param {?} templateMeta
     * @return {?}
     */
    normalizeExternalStylesheets(templateMeta) {
        return this._loadMissingExternalStylesheets(templateMeta.styleUrls)
            .then((externalStylesheets) => new CompileTemplateMetadata({
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
        }));
    }
    /**
     * @param {?} styleUrls
     * @param {?=} loadedStylesheets
     * @return {?}
     */
    _loadMissingExternalStylesheets(styleUrls, loadedStylesheets = new Map()) {
        return Promise
            .all(styleUrls.filter((styleUrl) => !loadedStylesheets.has(styleUrl))
            .map(styleUrl => this._fetch(styleUrl).then((loadedStyle) => {
            const /** @type {?} */ stylesheet = this.normalizeStylesheet(new CompileStylesheetMetadata({ styles: [loadedStyle], moduleUrl: styleUrl }));
            loadedStylesheets.set(styleUrl, stylesheet);
            return this._loadMissingExternalStylesheets(stylesheet.styleUrls, loadedStylesheets);
        })))
            .then((_) => Array.from(loadedStylesheets.values()));
    }
    /**
     * @param {?} stylesheet
     * @return {?}
     */
    normalizeStylesheet(stylesheet) {
        const /** @type {?} */ moduleUrl = ((stylesheet.moduleUrl));
        const /** @type {?} */ allStyleUrls = stylesheet.styleUrls.filter(isStyleUrlResolvable)
            .map(url => this._urlResolver.resolve(moduleUrl, url));
        const /** @type {?} */ allStyles = stylesheet.styles.map(style$$1 => {
            const /** @type {?} */ styleWithImports = extractStyleUrls(this._urlResolver, moduleUrl, style$$1);
            allStyleUrls.push(...styleWithImports.styleUrls);
            return styleWithImports.style;
        });
        return new CompileStylesheetMetadata({ styles: allStyles, styleUrls: allStyleUrls, moduleUrl: moduleUrl });
    }
}
DirectiveNormalizer.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
DirectiveNormalizer.ctorParameters = () => [
    { type: ResourceLoader, },
    { type: UrlResolver, },
    { type: HtmlParser, },
    { type: CompilerConfig, },
];
class TemplatePreparseVisitor {
    constructor() {
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
    visitElement(ast, context) {
        const /** @type {?} */ preparsedElement = preparseElement(ast);
        switch (preparsedElement.type) {
            case PreparsedElementType.NG_CONTENT:
                if (this.ngNonBindableStackCount === 0) {
                    this.ngContentSelectors.push(preparsedElement.selectAttr);
                }
                break;
            case PreparsedElementType.STYLE:
                let /** @type {?} */ textContent = '';
                ast.children.forEach(child => {
                    if (child instanceof Text) {
                        textContent += child.value;
                    }
                });
                this.styles.push(textContent);
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
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitExpansion(ast, context) { visitAll(this, ast.cases); }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitExpansionCase(ast, context) {
        visitAll(this, ast.expression);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitComment(ast, context) { return null; }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitAttribute(ast, context) { return null; }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitText(ast, context) { return null; }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
class DirectiveResolver {
    /**
     * @param {?=} _reflector
     */
    constructor(_reflector = ɵreflector) {
        this._reflector = _reflector;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    isDirective(type) {
        const /** @type {?} */ typeMetadata = this._reflector.annotations(resolveForwardRef(type));
        return typeMetadata && typeMetadata.some(isDirectiveMetadata);
    }
    /**
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    resolve(type, throwIfNotFound = true) {
        const /** @type {?} */ typeMetadata = this._reflector.annotations(resolveForwardRef(type));
        if (typeMetadata) {
            const /** @type {?} */ metadata = findLast(typeMetadata, isDirectiveMetadata);
            if (metadata) {
                const /** @type {?} */ propertyMetadata = this._reflector.propMetadata(type);
                return this._mergeWithPropertyMetadata(metadata, propertyMetadata, type);
            }
        }
        if (throwIfNotFound) {
            throw new Error(`No Directive annotation found on ${ɵstringify(type)}`);
        }
        return null;
    }
    /**
     * @param {?} dm
     * @param {?} propertyMetadata
     * @param {?} directiveType
     * @return {?}
     */
    _mergeWithPropertyMetadata(dm, propertyMetadata, directiveType) {
        const /** @type {?} */ inputs = [];
        const /** @type {?} */ outputs = [];
        const /** @type {?} */ host = {};
        const /** @type {?} */ queries = {};
        Object.keys(propertyMetadata).forEach((propName) => {
            const /** @type {?} */ input = findLast(propertyMetadata[propName], (a) => a instanceof Input);
            if (input) {
                if (input.bindingPropertyName) {
                    inputs.push(`${propName}: ${input.bindingPropertyName}`);
                }
                else {
                    inputs.push(propName);
                }
            }
            const /** @type {?} */ output = findLast(propertyMetadata[propName], (a) => a instanceof Output);
            if (output) {
                if (output.bindingPropertyName) {
                    outputs.push(`${propName}: ${output.bindingPropertyName}`);
                }
                else {
                    outputs.push(propName);
                }
            }
            const /** @type {?} */ hostBindings = propertyMetadata[propName].filter(a => a && a instanceof HostBinding);
            hostBindings.forEach(hostBinding => {
                if (hostBinding.hostPropertyName) {
                    const /** @type {?} */ startWith = hostBinding.hostPropertyName[0];
                    if (startWith === '(') {
                        throw new Error(`@HostBinding can not bind to events. Use @HostListener instead.`);
                    }
                    else if (startWith === '[') {
                        throw new Error(`@HostBinding parameter should be a property name, 'class.<name>', or 'attr.<name>'.`);
                    }
                    host[`[${hostBinding.hostPropertyName}]`] = propName;
                }
                else {
                    host[`[${propName}]`] = propName;
                }
            });
            const /** @type {?} */ hostListeners = propertyMetadata[propName].filter(a => a && a instanceof HostListener);
            hostListeners.forEach(hostListener => {
                const /** @type {?} */ args = hostListener.args || [];
                host[`(${hostListener.eventName})`] = `${propName}(${args.join(',')})`;
            });
            const /** @type {?} */ query = findLast(propertyMetadata[propName], (a) => a instanceof Query);
            if (query) {
                queries[propName] = query;
            }
        });
        return this._merge(dm, inputs, outputs, host, queries, directiveType);
    }
    /**
     * @param {?} def
     * @return {?}
     */
    _extractPublicName(def) { return splitAtColon(def, [/** @type {?} */ ((null)), def])[1].trim(); }
    /**
     * @param {?} bindings
     * @return {?}
     */
    _dedupeBindings(bindings) {
        const /** @type {?} */ names = new Set();
        const /** @type {?} */ reversedResult = [];
        // go last to first to allow later entries to overwrite previous entries
        for (let /** @type {?} */ i = bindings.length - 1; i >= 0; i--) {
            const /** @type {?} */ binding = bindings[i];
            const /** @type {?} */ name = this._extractPublicName(binding);
            if (!names.has(name)) {
                names.add(name);
                reversedResult.push(binding);
            }
        }
        return reversedResult.reverse();
    }
    /**
     * @param {?} directive
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} host
     * @param {?} queries
     * @param {?} directiveType
     * @return {?}
     */
    _merge(directive, inputs, outputs, host, queries, directiveType) {
        const /** @type {?} */ mergedInputs = this._dedupeBindings(directive.inputs ? directive.inputs.concat(inputs) : inputs);
        const /** @type {?} */ mergedOutputs = this._dedupeBindings(directive.outputs ? directive.outputs.concat(outputs) : outputs);
        const /** @type {?} */ mergedHost = directive.host ? __assign({}, directive.host, host) : host;
        const /** @type {?} */ mergedQueries = directive.queries ? __assign({}, directive.queries, queries) : queries;
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
    }
}
DirectiveResolver.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
DirectiveResolver.ctorParameters = () => [
    { type: ɵReflectorReader, },
];
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
    for (let /** @type {?} */ i = arr.length - 1; i >= 0; i--) {
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
const STRIP_SRC_FILE_SUFFIXES = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
const NG_FACTORY = /\.ngfactory\./;
/**
 * @param {?} filePath
 * @return {?}
 */
function ngfactoryFilePath(filePath) {
    const /** @type {?} */ urlWithSuffix = splitTypescriptSuffix(filePath);
    return `${urlWithSuffix[0]}.ngfactory${urlWithSuffix[1]}`;
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
    const /** @type {?} */ lastDot = path.lastIndexOf('.');
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
    const /** @type {?} */ fileNameWithoutSuffix = fileName.replace(STRIP_SRC_FILE_SUFFIXES, '');
    return `${fileNameWithoutSuffix}.ngsummary.json`;
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
class NgModuleResolver {
    /**
     * @param {?=} _reflector
     */
    constructor(_reflector = ɵreflector) {
        this._reflector = _reflector;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    isNgModule(type) { return this._reflector.annotations(type).some(_isNgModuleMetadata); }
    /**
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    resolve(type, throwIfNotFound = true) {
        const /** @type {?} */ ngModuleMeta = findLast(this._reflector.annotations(type), _isNgModuleMetadata);
        if (ngModuleMeta) {
            return ngModuleMeta;
        }
        else {
            if (throwIfNotFound) {
                throw new Error(`No NgModule metadata found for '${ɵstringify(type)}'.`);
            }
            return null;
        }
    }
}
NgModuleResolver.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
NgModuleResolver.ctorParameters = () => [
    { type: ɵReflectorReader, },
];

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
class PipeResolver {
    /**
     * @param {?=} _reflector
     */
    constructor(_reflector = ɵreflector) {
        this._reflector = _reflector;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    isPipe(type) {
        const /** @type {?} */ typeMetadata = this._reflector.annotations(resolveForwardRef(type));
        return typeMetadata && typeMetadata.some(_isPipeMetadata);
    }
    /**
     * Return {\@link Pipe} for a given `Type`.
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    resolve(type, throwIfNotFound = true) {
        const /** @type {?} */ metas = this._reflector.annotations(resolveForwardRef(type));
        if (metas) {
            const /** @type {?} */ annotation = findLast(metas, _isPipeMetadata);
            if (annotation) {
                return annotation;
            }
        }
        if (throwIfNotFound) {
            throw new Error(`No Pipe decorator found on ${ɵstringify(type)}`);
        }
        return null;
    }
}
PipeResolver.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
PipeResolver.ctorParameters = () => [
    { type: ɵReflectorReader, },
];

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class SummaryResolver {
    /**
     * @param {?} fileName
     * @return {?}
     */
    isLibraryFile(fileName) { return false; }
    ;
    /**
     * @param {?} fileName
     * @return {?}
     */
    getLibraryFileName(fileName) { return null; }
    /**
     * @param {?} reference
     * @return {?}
     */
    resolveSummary(reference) { return null; }
    ;
    /**
     * @param {?} filePath
     * @return {?}
     */
    getSymbolsOf(filePath) { return []; }
    /**
     * @param {?} reference
     * @return {?}
     */
    getImportAs(reference) { return reference; }
}
SummaryResolver.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
SummaryResolver.ctorParameters = () => [];

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const ERROR_COLLECTOR_TOKEN = new InjectionToken('ErrorCollector');
class CompileMetadataResolver {
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
    constructor(_config, _ngModuleResolver, _directiveResolver, _pipeResolver, _summaryResolver, _schemaRegistry, _directiveNormalizer, _console, _staticSymbolCache, _reflector = ɵreflector, _errorCollector) {
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
    clearCacheFor(type) {
        const /** @type {?} */ dirMeta = this._directiveCache.get(type);
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
    }
    /**
     * @return {?}
     */
    clearCache() {
        this._directiveCache.clear();
        this._nonNormalizedDirectiveCache.clear();
        this._summaryCache.clear();
        this._pipeCache.clear();
        this._ngModuleCache.clear();
        this._ngModuleOfTypes.clear();
        this._directiveNormalizer.clearCache();
    }
    /**
     * @param {?} baseType
     * @param {?} name
     * @return {?}
     */
    _createProxyClass(baseType, name) {
        let /** @type {?} */ delegate = null;
        const /** @type {?} */ proxyClass = (function () {
            if (!delegate) {
                throw new Error(`Illegal state: Class ${name} for type ${ɵstringify(baseType)} is not compiled yet!`);
            }
            return delegate.apply(this, arguments);
        });
        proxyClass.setDelegate = (d) => {
            delegate = d;
            ((proxyClass)).prototype = d.prototype;
        };
        // Make stringify work correctly
        ((proxyClass)).overriddenName = name;
        return proxyClass;
    }
    /**
     * @param {?} dirType
     * @param {?} name
     * @return {?}
     */
    getGeneratedClass(dirType, name) {
        if (dirType instanceof StaticSymbol) {
            return this._staticSymbolCache.get(ngfactoryFilePath(dirType.filePath), name);
        }
        else {
            return this._createProxyClass(dirType, name);
        }
    }
    /**
     * @param {?} dirType
     * @return {?}
     */
    getComponentViewClass(dirType) {
        return this.getGeneratedClass(dirType, viewClassName(dirType, 0));
    }
    /**
     * @param {?} dirType
     * @return {?}
     */
    getHostComponentViewClass(dirType) {
        return this.getGeneratedClass(dirType, hostViewClassName(dirType));
    }
    /**
     * @param {?} dirType
     * @return {?}
     */
    getHostComponentType(dirType) {
        const /** @type {?} */ name = `${identifierName({ reference: dirType })}_Host`;
        if (dirType instanceof StaticSymbol) {
            return this._staticSymbolCache.get(dirType.filePath, name);
        }
        else {
            const /** @type {?} */ HostClass = (function HostClass() { });
            HostClass.overriddenName = name;
            return HostClass;
        }
    }
    /**
     * @param {?} dirType
     * @return {?}
     */
    getRendererType(dirType) {
        if (dirType instanceof StaticSymbol) {
            return this._staticSymbolCache.get(ngfactoryFilePath(dirType.filePath), rendererTypeName(dirType));
        }
        else {
            // returning an object as proxy,
            // that we fill later during runtime compilation.
            return ({});
        }
    }
    /**
     * @param {?} selector
     * @param {?} dirType
     * @param {?} inputs
     * @param {?} outputs
     * @return {?}
     */
    getComponentFactory(selector, dirType, inputs, outputs) {
        if (dirType instanceof StaticSymbol) {
            return this._staticSymbolCache.get(ngfactoryFilePath(dirType.filePath), componentFactoryName(dirType));
        }
        else {
            const /** @type {?} */ hostView = this.getHostComponentViewClass(dirType);
            // Note: ngContentSelectors will be filled later once the template is
            // loaded.
            return ɵccf(selector, dirType, /** @type {?} */ (hostView), inputs, outputs, []);
        }
    }
    /**
     * @param {?} factory
     * @param {?} ngContentSelectors
     * @return {?}
     */
    initComponentFactory(factory, ngContentSelectors) {
        if (!(factory instanceof StaticSymbol)) {
            factory.ngContentSelectors.push(...ngContentSelectors);
        }
    }
    /**
     * @param {?} type
     * @param {?} kind
     * @return {?}
     */
    _loadSummary(type, kind) {
        let /** @type {?} */ typeSummary = this._summaryCache.get(type);
        if (!typeSummary) {
            const /** @type {?} */ summary = this._summaryResolver.resolveSummary(type);
            typeSummary = summary ? summary.type : null;
            this._summaryCache.set(type, typeSummary || null);
        }
        return typeSummary && typeSummary.summaryKind === kind ? typeSummary : null;
    }
    /**
     * @param {?} ngModuleType
     * @param {?} directiveType
     * @param {?} isSync
     * @return {?}
     */
    _loadDirectiveMetadata(ngModuleType, directiveType, isSync) {
        if (this._directiveCache.has(directiveType)) {
            return null;
        }
        directiveType = resolveForwardRef(directiveType);
        const { annotation, metadata } = ((this.getNonNormalizedDirectiveMetadata(directiveType)));
        const /** @type {?} */ createDirectiveMetadata = (templateMetadata) => {
            const /** @type {?} */ normalizedDirMeta = new CompileDirectiveMetadata({
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
                this.initComponentFactory(/** @type {?} */ ((metadata.componentFactory)), templateMetadata.ngContentSelectors);
            }
            this._directiveCache.set(directiveType, normalizedDirMeta);
            this._summaryCache.set(directiveType, normalizedDirMeta.toSummary());
            return normalizedDirMeta;
        };
        if (metadata.isComponent) {
            const /** @type {?} */ template = ((metadata.template));
            const /** @type {?} */ templateMeta = this._directiveNormalizer.normalizeTemplate({
                ngModuleType,
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
    }
    /**
     * @param {?} directiveType
     * @return {?}
     */
    getNonNormalizedDirectiveMetadata(directiveType) {
        directiveType = resolveForwardRef(directiveType);
        if (!directiveType) {
            return null;
        }
        let /** @type {?} */ cacheEntry = this._nonNormalizedDirectiveCache.get(directiveType);
        if (cacheEntry) {
            return cacheEntry;
        }
        const /** @type {?} */ dirMeta = this._directiveResolver.resolve(directiveType, false);
        if (!dirMeta) {
            return null;
        }
        let /** @type {?} */ nonNormalizedTemplateMetadata = ((undefined));
        if (dirMeta instanceof Component) {
            // component
            assertArrayOfStrings('styles', dirMeta.styles);
            assertArrayOfStrings('styleUrls', dirMeta.styleUrls);
            assertInterpolationSymbols('interpolation', dirMeta.interpolation);
            const /** @type {?} */ animations = dirMeta.animations;
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
        let /** @type {?} */ changeDetectionStrategy = ((null));
        let /** @type {?} */ viewProviders = [];
        let /** @type {?} */ entryComponentMetadata = [];
        let /** @type {?} */ selector = dirMeta.selector;
        if (dirMeta instanceof Component) {
            // Component
            changeDetectionStrategy = ((dirMeta.changeDetection));
            if (dirMeta.viewProviders) {
                viewProviders = this._getProvidersMetadata(dirMeta.viewProviders, entryComponentMetadata, `viewProviders for "${stringifyType(directiveType)}"`, [], directiveType);
            }
            if (dirMeta.entryComponents) {
                entryComponentMetadata = flattenAndDedupeArray(dirMeta.entryComponents)
                    .map((type) => ((this._getEntryComponentMetadata(type))))
                    .concat(entryComponentMetadata);
            }
            if (!selector) {
                selector = this._schemaRegistry.getDefaultComponentElementName();
            }
        }
        else {
            // Directive
            if (!selector) {
                this._reportError(syntaxError(`Directive ${stringifyType(directiveType)} has no selector, please add it!`), directiveType);
                selector = 'error';
            }
        }
        let /** @type {?} */ providers = [];
        if (dirMeta.providers != null) {
            providers = this._getProvidersMetadata(dirMeta.providers, entryComponentMetadata, `providers for "${stringifyType(directiveType)}"`, [], directiveType);
        }
        let /** @type {?} */ queries = [];
        let /** @type {?} */ viewQueries = [];
        if (dirMeta.queries != null) {
            queries = this._getQueriesMetadata(dirMeta.queries, false, directiveType);
            viewQueries = this._getQueriesMetadata(dirMeta.queries, true, directiveType);
        }
        const /** @type {?} */ metadata = CompileDirectiveMetadata.create({
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
        cacheEntry = { metadata, annotation: dirMeta };
        this._nonNormalizedDirectiveCache.set(directiveType, cacheEntry);
        return cacheEntry;
    }
    /**
     * Gets the metadata for the given directive.
     * This assumes `loadNgModuleDirectiveAndPipeMetadata` has been called first.
     * @param {?} directiveType
     * @return {?}
     */
    getDirectiveMetadata(directiveType) {
        const /** @type {?} */ dirMeta = ((this._directiveCache.get(directiveType)));
        if (!dirMeta) {
            this._reportError(syntaxError(`Illegal state: getDirectiveMetadata can only be called after loadNgModuleDirectiveAndPipeMetadata for a module that declares it. Directive ${stringifyType(directiveType)}.`), directiveType);
        }
        return dirMeta;
    }
    /**
     * @param {?} dirType
     * @return {?}
     */
    getDirectiveSummary(dirType) {
        const /** @type {?} */ dirSummary = (this._loadSummary(dirType, CompileSummaryKind.Directive));
        if (!dirSummary) {
            this._reportError(syntaxError(`Illegal state: Could not load the summary for directive ${stringifyType(dirType)}.`), dirType);
        }
        return dirSummary;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    isDirective(type) { return this._directiveResolver.isDirective(type); }
    /**
     * @param {?} type
     * @return {?}
     */
    isPipe(type) { return this._pipeResolver.isPipe(type); }
    /**
     * @param {?} moduleType
     * @return {?}
     */
    getNgModuleSummary(moduleType) {
        let /** @type {?} */ moduleSummary = (this._loadSummary(moduleType, CompileSummaryKind.NgModule));
        if (!moduleSummary) {
            const /** @type {?} */ moduleMeta = this.getNgModuleMetadata(moduleType, false);
            moduleSummary = moduleMeta ? moduleMeta.toSummary() : null;
            if (moduleSummary) {
                this._summaryCache.set(moduleType, moduleSummary);
            }
        }
        return moduleSummary;
    }
    /**
     * Loads the declared directives and pipes of an NgModule.
     * @param {?} moduleType
     * @param {?} isSync
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    loadNgModuleDirectiveAndPipeMetadata(moduleType, isSync, throwIfNotFound = true) {
        const /** @type {?} */ ngModule = this.getNgModuleMetadata(moduleType, throwIfNotFound);
        const /** @type {?} */ loading = [];
        if (ngModule) {
            ngModule.declaredDirectives.forEach((id) => {
                const /** @type {?} */ promise = this._loadDirectiveMetadata(moduleType, id.reference, isSync);
                if (promise) {
                    loading.push(promise);
                }
            });
            ngModule.declaredPipes.forEach((id) => this._loadPipeMetadata(id.reference));
        }
        return Promise.all(loading);
    }
    /**
     * @param {?} moduleType
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    getNgModuleMetadata(moduleType, throwIfNotFound = true) {
        moduleType = resolveForwardRef(moduleType);
        let /** @type {?} */ compileMeta = this._ngModuleCache.get(moduleType);
        if (compileMeta) {
            return compileMeta;
        }
        const /** @type {?} */ meta = this._ngModuleResolver.resolve(moduleType, throwIfNotFound);
        if (!meta) {
            return null;
        }
        const /** @type {?} */ declaredDirectives = [];
        const /** @type {?} */ exportedNonModuleIdentifiers = [];
        const /** @type {?} */ declaredPipes = [];
        const /** @type {?} */ importedModules = [];
        const /** @type {?} */ exportedModules = [];
        const /** @type {?} */ providers = [];
        const /** @type {?} */ entryComponents = [];
        const /** @type {?} */ bootstrapComponents = [];
        const /** @type {?} */ schemas = [];
        if (meta.imports) {
            flattenAndDedupeArray(meta.imports).forEach((importedType) => {
                let /** @type {?} */ importedModuleType = ((undefined));
                if (isValidType(importedType)) {
                    importedModuleType = importedType;
                }
                else if (importedType && importedType.ngModule) {
                    const /** @type {?} */ moduleWithProviders = importedType;
                    importedModuleType = moduleWithProviders.ngModule;
                    if (moduleWithProviders.providers) {
                        providers.push(...this._getProvidersMetadata(moduleWithProviders.providers, entryComponents, `provider for the NgModule '${stringifyType(importedModuleType)}'`, [], importedType));
                    }
                }
                if (importedModuleType) {
                    if (this._checkSelfImport(moduleType, importedModuleType))
                        return;
                    const /** @type {?} */ importedModuleSummary = this.getNgModuleSummary(importedModuleType);
                    if (!importedModuleSummary) {
                        this._reportError(syntaxError(`Unexpected ${this._getTypeDescriptor(importedType)} '${stringifyType(importedType)}' imported by the module '${stringifyType(moduleType)}'. Please add a @NgModule annotation.`), moduleType);
                        return;
                    }
                    importedModules.push(importedModuleSummary);
                }
                else {
                    this._reportError(syntaxError(`Unexpected value '${stringifyType(importedType)}' imported by the module '${stringifyType(moduleType)}'`), moduleType);
                    return;
                }
            });
        }
        if (meta.exports) {
            flattenAndDedupeArray(meta.exports).forEach((exportedType) => {
                if (!isValidType(exportedType)) {
                    this._reportError(syntaxError(`Unexpected value '${stringifyType(exportedType)}' exported by the module '${stringifyType(moduleType)}'`), moduleType);
                    return;
                }
                const /** @type {?} */ exportedModuleSummary = this.getNgModuleSummary(exportedType);
                if (exportedModuleSummary) {
                    exportedModules.push(exportedModuleSummary);
                }
                else {
                    exportedNonModuleIdentifiers.push(this._getIdentifierMetadata(exportedType));
                }
            });
        }
        // Note: This will be modified later, so we rely on
        // getting a new instance every time!
        const /** @type {?} */ transitiveModule = this._getTransitiveNgModuleMetadata(importedModules, exportedModules);
        if (meta.declarations) {
            flattenAndDedupeArray(meta.declarations).forEach((declaredType) => {
                if (!isValidType(declaredType)) {
                    this._reportError(syntaxError(`Unexpected value '${stringifyType(declaredType)}' declared by the module '${stringifyType(moduleType)}'`), moduleType);
                    return;
                }
                const /** @type {?} */ declaredIdentifier = this._getIdentifierMetadata(declaredType);
                if (this._directiveResolver.isDirective(declaredType)) {
                    transitiveModule.addDirective(declaredIdentifier);
                    declaredDirectives.push(declaredIdentifier);
                    this._addTypeToModule(declaredType, moduleType);
                }
                else if (this._pipeResolver.isPipe(declaredType)) {
                    transitiveModule.addPipe(declaredIdentifier);
                    transitiveModule.pipes.push(declaredIdentifier);
                    declaredPipes.push(declaredIdentifier);
                    this._addTypeToModule(declaredType, moduleType);
                }
                else {
                    this._reportError(syntaxError(`Unexpected ${this._getTypeDescriptor(declaredType)} '${stringifyType(declaredType)}' declared by the module '${stringifyType(moduleType)}'. Please add a @Pipe/@Directive/@Component annotation.`), moduleType);
                    return;
                }
            });
        }
        const /** @type {?} */ exportedDirectives = [];
        const /** @type {?} */ exportedPipes = [];
        exportedNonModuleIdentifiers.forEach((exportedId) => {
            if (transitiveModule.directivesSet.has(exportedId.reference)) {
                exportedDirectives.push(exportedId);
                transitiveModule.addExportedDirective(exportedId);
            }
            else if (transitiveModule.pipesSet.has(exportedId.reference)) {
                exportedPipes.push(exportedId);
                transitiveModule.addExportedPipe(exportedId);
            }
            else {
                this._reportError(syntaxError(`Can't export ${this._getTypeDescriptor(exportedId.reference)} ${stringifyType(exportedId.reference)} from ${stringifyType(moduleType)} as it was neither declared nor imported!`), moduleType);
                return;
            }
        });
        // The providers of the module have to go last
        // so that they overwrite any other provider we already added.
        if (meta.providers) {
            providers.push(...this._getProvidersMetadata(meta.providers, entryComponents, `provider for the NgModule '${stringifyType(moduleType)}'`, [], moduleType));
        }
        if (meta.entryComponents) {
            entryComponents.push(...flattenAndDedupeArray(meta.entryComponents)
                .map(type => ((this._getEntryComponentMetadata(type)))));
        }
        if (meta.bootstrap) {
            flattenAndDedupeArray(meta.bootstrap).forEach(type => {
                if (!isValidType(type)) {
                    this._reportError(syntaxError(`Unexpected value '${stringifyType(type)}' used in the bootstrap property of module '${stringifyType(moduleType)}'`), moduleType);
                    return;
                }
                bootstrapComponents.push(this._getIdentifierMetadata(type));
            });
        }
        entryComponents.push(...bootstrapComponents.map(type => ((this._getEntryComponentMetadata(type.reference)))));
        if (meta.schemas) {
            schemas.push(...flattenAndDedupeArray(meta.schemas));
        }
        compileMeta = new CompileNgModuleMetadata({
            type: this._getTypeMetadata(moduleType),
            providers,
            entryComponents,
            bootstrapComponents,
            schemas,
            declaredDirectives,
            exportedDirectives,
            declaredPipes,
            exportedPipes,
            importedModules,
            exportedModules,
            transitiveModule,
            id: meta.id || null,
        });
        entryComponents.forEach((id) => transitiveModule.addEntryComponent(id));
        providers.forEach((provider) => transitiveModule.addProvider(provider, /** @type {?} */ ((compileMeta)).type));
        transitiveModule.addModule(compileMeta.type);
        this._ngModuleCache.set(moduleType, compileMeta);
        return compileMeta;
    }
    /**
     * @param {?} moduleType
     * @param {?} importedModuleType
     * @return {?}
     */
    _checkSelfImport(moduleType, importedModuleType) {
        if (moduleType === importedModuleType) {
            this._reportError(syntaxError(`'${stringifyType(moduleType)}' module can't import itself`), moduleType);
            return true;
        }
        return false;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    _getTypeDescriptor(type) {
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
    }
    /**
     * @param {?} type
     * @param {?} moduleType
     * @return {?}
     */
    _addTypeToModule(type, moduleType) {
        const /** @type {?} */ oldModule = this._ngModuleOfTypes.get(type);
        if (oldModule && oldModule !== moduleType) {
            this._reportError(syntaxError(`Type ${stringifyType(type)} is part of the declarations of 2 modules: ${stringifyType(oldModule)} and ${stringifyType(moduleType)}! ` +
                `Please consider moving ${stringifyType(type)} to a higher module that imports ${stringifyType(oldModule)} and ${stringifyType(moduleType)}. ` +
                `You can also create a new NgModule that exports and includes ${stringifyType(type)} then import that NgModule in ${stringifyType(oldModule)} and ${stringifyType(moduleType)}.`), moduleType);
            return;
        }
        this._ngModuleOfTypes.set(type, moduleType);
    }
    /**
     * @param {?} importedModules
     * @param {?} exportedModules
     * @return {?}
     */
    _getTransitiveNgModuleMetadata(importedModules, exportedModules) {
        // collect `providers` / `entryComponents` from all imported and all exported modules
        const /** @type {?} */ result = new TransitiveCompileNgModuleMetadata();
        const /** @type {?} */ modulesByToken = new Map();
        importedModules.concat(exportedModules).forEach((modSummary) => {
            modSummary.modules.forEach((mod) => result.addModule(mod));
            modSummary.entryComponents.forEach((comp) => result.addEntryComponent(comp));
            const /** @type {?} */ addedTokens = new Set();
            modSummary.providers.forEach((entry) => {
                const /** @type {?} */ tokenRef = tokenReference(entry.provider.token);
                let /** @type {?} */ prevModules = modulesByToken.get(tokenRef);
                if (!prevModules) {
                    prevModules = new Set();
                    modulesByToken.set(tokenRef, prevModules);
                }
                const /** @type {?} */ moduleRef = entry.module.reference;
                // Note: the providers of one module may still contain multiple providers
                // per token (e.g. for multi providers), and we need to preserve these.
                if (addedTokens.has(tokenRef) || !prevModules.has(moduleRef)) {
                    prevModules.add(moduleRef);
                    addedTokens.add(tokenRef);
                    result.addProvider(entry.provider, entry.module);
                }
            });
        });
        exportedModules.forEach((modSummary) => {
            modSummary.exportedDirectives.forEach((id) => result.addExportedDirective(id));
            modSummary.exportedPipes.forEach((id) => result.addExportedPipe(id));
        });
        importedModules.forEach((modSummary) => {
            modSummary.exportedDirectives.forEach((id) => result.addDirective(id));
            modSummary.exportedPipes.forEach((id) => result.addPipe(id));
        });
        return result;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    _getIdentifierMetadata(type) {
        type = resolveForwardRef(type);
        return { reference: type };
    }
    /**
     * @param {?} type
     * @return {?}
     */
    isInjectable(type) {
        const /** @type {?} */ annotations = this._reflector.annotations(type);
        // Note: We need an exact check here as @Component / @Directive / ... inherit
        // from @CompilerInjectable!
        return annotations.some(ann => ann.constructor === Injectable);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    getInjectableSummary(type) {
        return {
            summaryKind: CompileSummaryKind.Injectable,
            type: this._getTypeMetadata(type, null, false)
        };
    }
    /**
     * @param {?} type
     * @param {?=} dependencies
     * @return {?}
     */
    _getInjectableMetadata(type, dependencies = null) {
        const /** @type {?} */ typeSummary = this._loadSummary(type, CompileSummaryKind.Injectable);
        if (typeSummary) {
            return typeSummary.type;
        }
        return this._getTypeMetadata(type, dependencies);
    }
    /**
     * @param {?} type
     * @param {?=} dependencies
     * @param {?=} throwOnUnknownDeps
     * @return {?}
     */
    _getTypeMetadata(type, dependencies = null, throwOnUnknownDeps = true) {
        const /** @type {?} */ identifier = this._getIdentifierMetadata(type);
        return {
            reference: identifier.reference,
            diDeps: this._getDependenciesMetadata(identifier.reference, dependencies, throwOnUnknownDeps),
            lifecycleHooks: ɵLIFECYCLE_HOOKS_VALUES.filter(hook => hasLifecycleHook(hook, identifier.reference)),
        };
    }
    /**
     * @param {?} factory
     * @param {?=} dependencies
     * @return {?}
     */
    _getFactoryMetadata(factory, dependencies = null) {
        factory = resolveForwardRef(factory);
        return { reference: factory, diDeps: this._getDependenciesMetadata(factory, dependencies) };
    }
    /**
     * Gets the metadata for the given pipe.
     * This assumes `loadNgModuleDirectiveAndPipeMetadata` has been called first.
     * @param {?} pipeType
     * @return {?}
     */
    getPipeMetadata(pipeType) {
        const /** @type {?} */ pipeMeta = this._pipeCache.get(pipeType);
        if (!pipeMeta) {
            this._reportError(syntaxError(`Illegal state: getPipeMetadata can only be called after loadNgModuleDirectiveAndPipeMetadata for a module that declares it. Pipe ${stringifyType(pipeType)}.`), pipeType);
        }
        return pipeMeta || null;
    }
    /**
     * @param {?} pipeType
     * @return {?}
     */
    getPipeSummary(pipeType) {
        const /** @type {?} */ pipeSummary = (this._loadSummary(pipeType, CompileSummaryKind.Pipe));
        if (!pipeSummary) {
            this._reportError(syntaxError(`Illegal state: Could not load the summary for pipe ${stringifyType(pipeType)}.`), pipeType);
        }
        return pipeSummary;
    }
    /**
     * @param {?} pipeType
     * @return {?}
     */
    getOrLoadPipeMetadata(pipeType) {
        let /** @type {?} */ pipeMeta = this._pipeCache.get(pipeType);
        if (!pipeMeta) {
            pipeMeta = this._loadPipeMetadata(pipeType);
        }
        return pipeMeta;
    }
    /**
     * @param {?} pipeType
     * @return {?}
     */
    _loadPipeMetadata(pipeType) {
        pipeType = resolveForwardRef(pipeType);
        const /** @type {?} */ pipeAnnotation = ((this._pipeResolver.resolve(pipeType)));
        const /** @type {?} */ pipeMeta = new CompilePipeMetadata({
            type: this._getTypeMetadata(pipeType),
            name: pipeAnnotation.name,
            pure: !!pipeAnnotation.pure
        });
        this._pipeCache.set(pipeType, pipeMeta);
        this._summaryCache.set(pipeType, pipeMeta.toSummary());
        return pipeMeta;
    }
    /**
     * @param {?} typeOrFunc
     * @param {?} dependencies
     * @param {?=} throwOnUnknownDeps
     * @return {?}
     */
    _getDependenciesMetadata(typeOrFunc, dependencies, throwOnUnknownDeps = true) {
        let /** @type {?} */ hasUnknownDeps = false;
        const /** @type {?} */ params = dependencies || this._reflector.parameters(typeOrFunc) || [];
        const /** @type {?} */ dependenciesMetadata = params.map((param) => {
            let /** @type {?} */ isAttribute = false;
            let /** @type {?} */ isHost = false;
            let /** @type {?} */ isSelf = false;
            let /** @type {?} */ isSkipSelf = false;
            let /** @type {?} */ isOptional = false;
            let /** @type {?} */ token = null;
            if (Array.isArray(param)) {
                param.forEach((paramEntry) => {
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
                isAttribute,
                isHost,
                isSelf,
                isSkipSelf,
                isOptional,
                token: this._getTokenMetadata(token)
            };
        });
        if (hasUnknownDeps) {
            const /** @type {?} */ depsTokens = dependenciesMetadata.map((dep) => dep ? stringifyType(dep.token) : '?').join(', ');
            const /** @type {?} */ message = `Can't resolve all parameters for ${stringifyType(typeOrFunc)}: (${depsTokens}).`;
            if (throwOnUnknownDeps) {
                this._reportError(syntaxError(message), typeOrFunc);
            }
            else {
                this._console.warn(`Warning: ${message} This will become an error in Angular v5.x`);
            }
        }
        return dependenciesMetadata;
    }
    /**
     * @param {?} token
     * @return {?}
     */
    _getTokenMetadata(token) {
        token = resolveForwardRef(token);
        let /** @type {?} */ compileToken;
        if (typeof token === 'string') {
            compileToken = { value: token };
        }
        else {
            compileToken = { identifier: { reference: token } };
        }
        return compileToken;
    }
    /**
     * @param {?} providers
     * @param {?} targetEntryComponents
     * @param {?=} debugInfo
     * @param {?=} compileProviders
     * @param {?=} type
     * @return {?}
     */
    _getProvidersMetadata(providers, targetEntryComponents, debugInfo, compileProviders = [], type) {
        providers.forEach((provider, providerIdx) => {
            if (Array.isArray(provider)) {
                this._getProvidersMetadata(provider, targetEntryComponents, debugInfo, compileProviders);
            }
            else {
                provider = resolveForwardRef(provider);
                let /** @type {?} */ providerMeta = ((undefined));
                if (provider && typeof provider === 'object' && provider.hasOwnProperty('provide')) {
                    this._validateProvider(provider);
                    providerMeta = new ProviderMeta(provider.provide, provider);
                }
                else if (isValidType(provider)) {
                    providerMeta = new ProviderMeta(provider, { useClass: provider });
                }
                else if (provider === void 0) {
                    this._reportError(syntaxError(`Encountered undefined provider! Usually this means you have a circular dependencies (might be caused by using 'barrel' index.ts files.`));
                    return;
                }
                else {
                    const /** @type {?} */ providersInfo = ((providers.reduce((soFar, seenProvider, seenProviderIdx) => {
                        if (seenProviderIdx < providerIdx) {
                            soFar.push(`${stringifyType(seenProvider)}`);
                        }
                        else if (seenProviderIdx == providerIdx) {
                            soFar.push(`?${stringifyType(seenProvider)}?`);
                        }
                        else if (seenProviderIdx == providerIdx + 1) {
                            soFar.push('...');
                        }
                        return soFar;
                    }, [])))
                        .join(', ');
                    this._reportError(syntaxError(`Invalid ${debugInfo ? debugInfo : 'provider'} - only instances of Provider and Type are allowed, got: [${providersInfo}]`), type);
                    return;
                }
                if (providerMeta.token === resolveIdentifier(Identifiers.ANALYZE_FOR_ENTRY_COMPONENTS)) {
                    targetEntryComponents.push(...this._getEntryComponentsFromProvider(providerMeta, type));
                }
                else {
                    compileProviders.push(this.getProviderMetadata(providerMeta));
                }
            }
        });
        return compileProviders;
    }
    /**
     * @param {?} provider
     * @return {?}
     */
    _validateProvider(provider) {
        if (provider.hasOwnProperty('useClass') && provider.useClass == null) {
            this._reportError(syntaxError(`Invalid provider for ${stringifyType(provider.provide)}. useClass cannot be ${provider.useClass}.
           Usually it happens when:
           1. There's a circular dependency (might be caused by using index.ts (barrel) files).
           2. Class was used before it was declared. Use forwardRef in this case.`));
        }
    }
    /**
     * @param {?} provider
     * @param {?=} type
     * @return {?}
     */
    _getEntryComponentsFromProvider(provider, type) {
        const /** @type {?} */ components = [];
        const /** @type {?} */ collectedIdentifiers = [];
        if (provider.useFactory || provider.useExisting || provider.useClass) {
            this._reportError(syntaxError(`The ANALYZE_FOR_ENTRY_COMPONENTS token only supports useValue!`), type);
            return [];
        }
        if (!provider.multi) {
            this._reportError(syntaxError(`The ANALYZE_FOR_ENTRY_COMPONENTS token only supports 'multi = true'!`), type);
            return [];
        }
        extractIdentifiers(provider.useValue, collectedIdentifiers);
        collectedIdentifiers.forEach((identifier) => {
            const /** @type {?} */ entry = this._getEntryComponentMetadata(identifier.reference, false);
            if (entry) {
                components.push(entry);
            }
        });
        return components;
    }
    /**
     * @param {?} dirType
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    _getEntryComponentMetadata(dirType, throwIfNotFound = true) {
        const /** @type {?} */ dirMeta = this.getNonNormalizedDirectiveMetadata(dirType);
        if (dirMeta && dirMeta.metadata.isComponent) {
            return { componentType: dirType, componentFactory: /** @type {?} */ ((dirMeta.metadata.componentFactory)) };
        }
        const /** @type {?} */ dirSummary = (this._loadSummary(dirType, CompileSummaryKind.Directive));
        if (dirSummary && dirSummary.isComponent) {
            return { componentType: dirType, componentFactory: /** @type {?} */ ((dirSummary.componentFactory)) };
        }
        if (throwIfNotFound) {
            throw syntaxError(`${dirType.name} cannot be used as an entry component.`);
        }
        return null;
    }
    /**
     * @param {?} provider
     * @return {?}
     */
    getProviderMetadata(provider) {
        let /** @type {?} */ compileDeps = ((undefined));
        let /** @type {?} */ compileTypeMetadata = ((null));
        let /** @type {?} */ compileFactoryMetadata = ((null));
        let /** @type {?} */ token = this._getTokenMetadata(provider.token);
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
    }
    /**
     * @param {?} queries
     * @param {?} isViewQuery
     * @param {?} directiveType
     * @return {?}
     */
    _getQueriesMetadata(queries, isViewQuery, directiveType) {
        const /** @type {?} */ res = [];
        Object.keys(queries).forEach((propertyName) => {
            const /** @type {?} */ query = queries[propertyName];
            if (query.isViewQuery === isViewQuery) {
                res.push(this._getQueryMetadata(query, propertyName, directiveType));
            }
        });
        return res;
    }
    /**
     * @param {?} selector
     * @return {?}
     */
    _queryVarBindings(selector) { return selector.split(/\s*,\s*/); }
    /**
     * @param {?} q
     * @param {?} propertyName
     * @param {?} typeOrFunc
     * @return {?}
     */
    _getQueryMetadata(q, propertyName, typeOrFunc) {
        let /** @type {?} */ selectors;
        if (typeof q.selector === 'string') {
            selectors =
                this._queryVarBindings(q.selector).map(varName => this._getTokenMetadata(varName));
        }
        else {
            if (!q.selector) {
                this._reportError(syntaxError(`Can't construct a query for the property "${propertyName}" of "${stringifyType(typeOrFunc)}" since the query selector wasn't defined.`), typeOrFunc);
                selectors = [];
            }
            else {
                selectors = [this._getTokenMetadata(q.selector)];
            }
        }
        return {
            selectors,
            first: q.first,
            descendants: q.descendants, propertyName,
            read: q.read ? this._getTokenMetadata(q.read) : ((null))
        };
    }
    /**
     * @param {?} error
     * @param {?=} type
     * @param {?=} otherType
     * @return {?}
     */
    _reportError(error, type, otherType) {
        if (this._errorCollector) {
            this._errorCollector(error, type);
            if (otherType) {
                this._errorCollector(error, otherType);
            }
        }
        else {
            throw error;
        }
    }
}
CompileMetadataResolver.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
CompileMetadataResolver.ctorParameters = () => [
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
];
/**
 * @param {?} tree
 * @param {?=} out
 * @return {?}
 */
function flattenArray(tree, out = []) {
    if (tree) {
        for (let /** @type {?} */ i = 0; i < tree.length; i++) {
            const /** @type {?} */ item = resolveForwardRef(tree[i]);
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
    const /** @type {?} */ moduleId = cmpMetadata.moduleId;
    if (typeof moduleId === 'string') {
        const /** @type {?} */ scheme = getUrlScheme(moduleId);
        return scheme ? moduleId : `package:${moduleId}${MODULE_SUFFIX}`;
    }
    else if (moduleId !== null && moduleId !== void 0) {
        throw syntaxError(`moduleId should be a string in "${stringifyType(type)}". See https://goo.gl/wIDDiL for more information.\n` +
            `If you're using Webpack you should inline the template and the styles, see https://goo.gl/X2J8zc.`);
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
class _CompileValueConverter extends ValueTransformer {
    /**
     * @param {?} value
     * @param {?} targetIdentifiers
     * @return {?}
     */
    visitOther(value, targetIdentifiers) {
        targetIdentifiers.push({ reference: value });
    }
}
/**
 * @param {?} type
 * @return {?}
 */
function stringifyType(type) {
    if (type instanceof StaticSymbol) {
        return `${type.name} in ${type.filePath}`;
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
    const /** @type {?} */ error = Error(`Can't compile synchronously as ${ɵstringify(compType)} is still being loaded!`);
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
let TypeModifier = {};
TypeModifier.Const = 0;
TypeModifier[TypeModifier.Const] = "Const";
/**
 * @abstract
 */
class Type$1 {
    /**
     * @param {?=} modifiers
     */
    constructor(modifiers = null) {
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
    visitType(visitor, context) { }
    /**
     * @param {?} modifier
     * @return {?}
     */
    hasModifier(modifier) { return ((this.modifiers)).indexOf(modifier) !== -1; }
}
let BuiltinTypeName = {};
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
class BuiltinType extends Type$1 {
    /**
     * @param {?} name
     * @param {?=} modifiers
     */
    constructor(name, modifiers = null) {
        super(modifiers);
        this.name = name;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitType(visitor, context) {
        return visitor.visitBuiltintType(this, context);
    }
}
class ExpressionType extends Type$1 {
    /**
     * @param {?} value
     * @param {?=} modifiers
     */
    constructor(value, modifiers = null) {
        super(modifiers);
        this.value = value;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitType(visitor, context) {
        return visitor.visitExpressionType(this, context);
    }
}
class ArrayType extends Type$1 {
    /**
     * @param {?} of
     * @param {?=} modifiers
     */
    constructor(of, modifiers = null) {
        super(modifiers);
        this.of = of;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitType(visitor, context) {
        return visitor.visitArrayType(this, context);
    }
}
class MapType extends Type$1 {
    /**
     * @param {?} valueType
     * @param {?=} modifiers
     */
    constructor(valueType, modifiers = null) {
        super(modifiers);
        this.valueType = valueType || null;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitType(visitor, context) { return visitor.visitMapType(this, context); }
}
const DYNAMIC_TYPE = new BuiltinType(BuiltinTypeName.Dynamic);
const INFERRED_TYPE = new BuiltinType(BuiltinTypeName.Inferred);
const BOOL_TYPE = new BuiltinType(BuiltinTypeName.Bool);
const INT_TYPE = new BuiltinType(BuiltinTypeName.Int);
const NUMBER_TYPE = new BuiltinType(BuiltinTypeName.Number);
const STRING_TYPE = new BuiltinType(BuiltinTypeName.String);
const FUNCTION_TYPE = new BuiltinType(BuiltinTypeName.Function);
let BinaryOperator = {};
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
class Expression {
    /**
     * @param {?} type
     * @param {?=} sourceSpan
     */
    constructor(type, sourceSpan) {
        this.type = type || null;
        this.sourceSpan = sourceSpan || null;
    }
    /**
     * @abstract
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) { }
    /**
     * @param {?} name
     * @param {?=} sourceSpan
     * @return {?}
     */
    prop(name, sourceSpan) {
        return new ReadPropExpr(this, name, null, sourceSpan);
    }
    /**
     * @param {?} index
     * @param {?=} type
     * @param {?=} sourceSpan
     * @return {?}
     */
    key(index, type, sourceSpan) {
        return new ReadKeyExpr(this, index, type, sourceSpan);
    }
    /**
     * @param {?} name
     * @param {?} params
     * @param {?=} sourceSpan
     * @return {?}
     */
    callMethod(name, params, sourceSpan) {
        return new InvokeMethodExpr(this, name, params, null, sourceSpan);
    }
    /**
     * @param {?} params
     * @param {?=} sourceSpan
     * @return {?}
     */
    callFn(params, sourceSpan) {
        return new InvokeFunctionExpr(this, params, null, sourceSpan);
    }
    /**
     * @param {?} params
     * @param {?=} type
     * @param {?=} sourceSpan
     * @return {?}
     */
    instantiate(params, type, sourceSpan) {
        return new InstantiateExpr(this, params, type, sourceSpan);
    }
    /**
     * @param {?} trueCase
     * @param {?=} falseCase
     * @param {?=} sourceSpan
     * @return {?}
     */
    conditional(trueCase, falseCase = null, sourceSpan) {
        return new ConditionalExpr(this, trueCase, falseCase, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    equals(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Equals, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    notEquals(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.NotEquals, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    identical(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Identical, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    notIdentical(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.NotIdentical, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    minus(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Minus, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    plus(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Plus, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    divide(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Divide, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    multiply(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Multiply, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    modulo(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Modulo, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    and(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.And, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    or(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Or, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    lower(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Lower, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    lowerEquals(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.LowerEquals, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    bigger(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.Bigger, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?} rhs
     * @param {?=} sourceSpan
     * @return {?}
     */
    biggerEquals(rhs, sourceSpan) {
        return new BinaryOperatorExpr(BinaryOperator.BiggerEquals, this, rhs, null, sourceSpan);
    }
    /**
     * @param {?=} sourceSpan
     * @return {?}
     */
    isBlank(sourceSpan) {
        // Note: We use equals by purpose here to compare to null and undefined in JS.
        // We use the typed null to allow strictNullChecks to narrow types.
        return this.equals(TYPED_NULL_EXPR, sourceSpan);
    }
    /**
     * @param {?} type
     * @param {?=} sourceSpan
     * @return {?}
     */
    cast(type, sourceSpan) {
        return new CastExpr(this, type, sourceSpan);
    }
    /**
     * @return {?}
     */
    toStmt() { return new ExpressionStatement(this, null); }
}
let BuiltinVar = {};
BuiltinVar.This = 0;
BuiltinVar.Super = 1;
BuiltinVar.CatchError = 2;
BuiltinVar.CatchStack = 3;
BuiltinVar[BuiltinVar.This] = "This";
BuiltinVar[BuiltinVar.Super] = "Super";
BuiltinVar[BuiltinVar.CatchError] = "CatchError";
BuiltinVar[BuiltinVar.CatchStack] = "CatchStack";
class ReadVarExpr extends Expression {
    /**
     * @param {?} name
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(name, type, sourceSpan) {
        super(type, sourceSpan);
        if (typeof name === 'string') {
            this.name = name;
            this.builtin = null;
        }
        else {
            this.name = null;
            this.builtin = name;
        }
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitReadVarExpr(this, context);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set(value) {
        if (!this.name) {
            throw new Error(`Built in variable ${this.builtin} can not be assigned to.`);
        }
        return new WriteVarExpr(this.name, value, null, this.sourceSpan);
    }
}
class WriteVarExpr extends Expression {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(name, value, type, sourceSpan) {
        super(type || value.type, sourceSpan);
        this.name = name;
        this.value = value;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitWriteVarExpr(this, context);
    }
    /**
     * @param {?=} type
     * @param {?=} modifiers
     * @return {?}
     */
    toDeclStmt(type, modifiers) {
        return new DeclareVarStmt(this.name, this.value, type, modifiers, this.sourceSpan);
    }
}
class WriteKeyExpr extends Expression {
    /**
     * @param {?} receiver
     * @param {?} index
     * @param {?} value
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(receiver, index, value, type, sourceSpan) {
        super(type || value.type, sourceSpan);
        this.receiver = receiver;
        this.index = index;
        this.value = value;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitWriteKeyExpr(this, context);
    }
}
class WritePropExpr extends Expression {
    /**
     * @param {?} receiver
     * @param {?} name
     * @param {?} value
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(receiver, name, value, type, sourceSpan) {
        super(type || value.type, sourceSpan);
        this.receiver = receiver;
        this.name = name;
        this.value = value;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitWritePropExpr(this, context);
    }
}
let BuiltinMethod = {};
BuiltinMethod.ConcatArray = 0;
BuiltinMethod.SubscribeObservable = 1;
BuiltinMethod.Bind = 2;
BuiltinMethod[BuiltinMethod.ConcatArray] = "ConcatArray";
BuiltinMethod[BuiltinMethod.SubscribeObservable] = "SubscribeObservable";
BuiltinMethod[BuiltinMethod.Bind] = "Bind";
class InvokeMethodExpr extends Expression {
    /**
     * @param {?} receiver
     * @param {?} method
     * @param {?} args
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(receiver, method, args, type, sourceSpan) {
        super(type, sourceSpan);
        this.receiver = receiver;
        this.args = args;
        if (typeof method === 'string') {
            this.name = method;
            this.builtin = null;
        }
        else {
            this.name = null;
            this.builtin = method;
        }
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitInvokeMethodExpr(this, context);
    }
}
class InvokeFunctionExpr extends Expression {
    /**
     * @param {?} fn
     * @param {?} args
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(fn, args, type, sourceSpan) {
        super(type, sourceSpan);
        this.fn = fn;
        this.args = args;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitInvokeFunctionExpr(this, context);
    }
}
class InstantiateExpr extends Expression {
    /**
     * @param {?} classExpr
     * @param {?} args
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(classExpr, args, type, sourceSpan) {
        super(type, sourceSpan);
        this.classExpr = classExpr;
        this.args = args;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitInstantiateExpr(this, context);
    }
}
class LiteralExpr extends Expression {
    /**
     * @param {?} value
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(value, type, sourceSpan) {
        super(type, sourceSpan);
        this.value = value;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitLiteralExpr(this, context);
    }
}
class ExternalExpr extends Expression {
    /**
     * @param {?} value
     * @param {?=} type
     * @param {?=} typeParams
     * @param {?=} sourceSpan
     */
    constructor(value, type, typeParams = null, sourceSpan) {
        super(type, sourceSpan);
        this.value = value;
        this.typeParams = typeParams;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitExternalExpr(this, context);
    }
}
class ConditionalExpr extends Expression {
    /**
     * @param {?} condition
     * @param {?} trueCase
     * @param {?=} falseCase
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(condition, trueCase, falseCase = null, type, sourceSpan) {
        super(type || trueCase.type, sourceSpan);
        this.condition = condition;
        this.falseCase = falseCase;
        this.trueCase = trueCase;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitConditionalExpr(this, context);
    }
}
class NotExpr extends Expression {
    /**
     * @param {?} condition
     * @param {?=} sourceSpan
     */
    constructor(condition, sourceSpan) {
        super(BOOL_TYPE, sourceSpan);
        this.condition = condition;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitNotExpr(this, context);
    }
}
class CastExpr extends Expression {
    /**
     * @param {?} value
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(value, type, sourceSpan) {
        super(type, sourceSpan);
        this.value = value;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitCastExpr(this, context);
    }
}
class FnParam {
    /**
     * @param {?} name
     * @param {?=} type
     */
    constructor(name, type = null) {
        this.name = name;
        this.type = type;
    }
}
class FunctionExpr extends Expression {
    /**
     * @param {?} params
     * @param {?} statements
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(params, statements, type, sourceSpan) {
        super(type, sourceSpan);
        this.params = params;
        this.statements = statements;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitFunctionExpr(this, context);
    }
    /**
     * @param {?} name
     * @param {?=} modifiers
     * @return {?}
     */
    toDeclStmt(name, modifiers = null) {
        return new DeclareFunctionStmt(name, this.params, this.statements, this.type, modifiers, this.sourceSpan);
    }
}
class BinaryOperatorExpr extends Expression {
    /**
     * @param {?} operator
     * @param {?} lhs
     * @param {?} rhs
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(operator, lhs, rhs, type, sourceSpan) {
        super(type || lhs.type, sourceSpan);
        this.operator = operator;
        this.rhs = rhs;
        this.lhs = lhs;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitBinaryOperatorExpr(this, context);
    }
}
class ReadPropExpr extends Expression {
    /**
     * @param {?} receiver
     * @param {?} name
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(receiver, name, type, sourceSpan) {
        super(type, sourceSpan);
        this.receiver = receiver;
        this.name = name;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitReadPropExpr(this, context);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set(value) {
        return new WritePropExpr(this.receiver, this.name, value, null, this.sourceSpan);
    }
}
class ReadKeyExpr extends Expression {
    /**
     * @param {?} receiver
     * @param {?} index
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(receiver, index, type, sourceSpan) {
        super(type, sourceSpan);
        this.receiver = receiver;
        this.index = index;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitReadKeyExpr(this, context);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set(value) {
        return new WriteKeyExpr(this.receiver, this.index, value, null, this.sourceSpan);
    }
}
class LiteralArrayExpr extends Expression {
    /**
     * @param {?} entries
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(entries, type, sourceSpan) {
        super(type, sourceSpan);
        this.entries = entries;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitLiteralArrayExpr(this, context);
    }
}
class LiteralMapEntry {
    /**
     * @param {?} key
     * @param {?} value
     * @param {?=} quoted
     */
    constructor(key, value, quoted = false) {
        this.key = key;
        this.value = value;
        this.quoted = quoted;
    }
}
class LiteralMapExpr extends Expression {
    /**
     * @param {?} entries
     * @param {?=} type
     * @param {?=} sourceSpan
     */
    constructor(entries, type, sourceSpan) {
        super(type, sourceSpan);
        this.entries = entries;
        this.valueType = null;
        if (type) {
            this.valueType = type.valueType;
        }
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitLiteralMapExpr(this, context);
    }
}
class CommaExpr extends Expression {
    /**
     * @param {?} parts
     * @param {?=} sourceSpan
     */
    constructor(parts, sourceSpan) {
        super(parts[parts.length - 1].type, sourceSpan);
        this.parts = parts;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitExpression(visitor, context) {
        return visitor.visitCommaExpr(this, context);
    }
}
const THIS_EXPR = new ReadVarExpr(BuiltinVar.This, null, null);
const SUPER_EXPR = new ReadVarExpr(BuiltinVar.Super, null, null);
const CATCH_ERROR_VAR = new ReadVarExpr(BuiltinVar.CatchError, null, null);
const CATCH_STACK_VAR = new ReadVarExpr(BuiltinVar.CatchStack, null, null);
const NULL_EXPR = new LiteralExpr(null, null, null);
const TYPED_NULL_EXPR = new LiteralExpr(null, INFERRED_TYPE, null);
let StmtModifier = {};
StmtModifier.Final = 0;
StmtModifier.Private = 1;
StmtModifier[StmtModifier.Final] = "Final";
StmtModifier[StmtModifier.Private] = "Private";
/**
 * @abstract
 */
class Statement {
    /**
     * @param {?=} modifiers
     * @param {?=} sourceSpan
     */
    constructor(modifiers, sourceSpan) {
        this.modifiers = modifiers || [];
        this.sourceSpan = sourceSpan || null;
    }
    /**
     * @abstract
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitStatement(visitor, context) { }
    /**
     * @param {?} modifier
     * @return {?}
     */
    hasModifier(modifier) { return ((this.modifiers)).indexOf(modifier) !== -1; }
}
class DeclareVarStmt extends Statement {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?=} type
     * @param {?=} modifiers
     * @param {?=} sourceSpan
     */
    constructor(name, value, type, modifiers = null, sourceSpan) {
        super(modifiers, sourceSpan);
        this.name = name;
        this.value = value;
        this.type = type || value.type;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitStatement(visitor, context) {
        return visitor.visitDeclareVarStmt(this, context);
    }
}
class DeclareFunctionStmt extends Statement {
    /**
     * @param {?} name
     * @param {?} params
     * @param {?} statements
     * @param {?=} type
     * @param {?=} modifiers
     * @param {?=} sourceSpan
     */
    constructor(name, params, statements, type, modifiers = null, sourceSpan) {
        super(modifiers, sourceSpan);
        this.name = name;
        this.params = params;
        this.statements = statements;
        this.type = type || null;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitStatement(visitor, context) {
        return visitor.visitDeclareFunctionStmt(this, context);
    }
}
class ExpressionStatement extends Statement {
    /**
     * @param {?} expr
     * @param {?=} sourceSpan
     */
    constructor(expr, sourceSpan) {
        super(null, sourceSpan);
        this.expr = expr;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitStatement(visitor, context) {
        return visitor.visitExpressionStmt(this, context);
    }
}
class ReturnStatement extends Statement {
    /**
     * @param {?} value
     * @param {?=} sourceSpan
     */
    constructor(value, sourceSpan) {
        super(null, sourceSpan);
        this.value = value;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitStatement(visitor, context) {
        return visitor.visitReturnStmt(this, context);
    }
}
class AbstractClassPart {
    /**
     * @param {?} type
     * @param {?} modifiers
     */
    constructor(type, modifiers) {
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
    hasModifier(modifier) { return ((this.modifiers)).indexOf(modifier) !== -1; }
}
class ClassField extends AbstractClassPart {
    /**
     * @param {?} name
     * @param {?=} type
     * @param {?=} modifiers
     */
    constructor(name, type, modifiers = null) {
        super(type, modifiers);
        this.name = name;
    }
}
class ClassMethod extends AbstractClassPart {
    /**
     * @param {?} name
     * @param {?} params
     * @param {?} body
     * @param {?=} type
     * @param {?=} modifiers
     */
    constructor(name, params, body, type, modifiers = null) {
        super(type, modifiers);
        this.name = name;
        this.params = params;
        this.body = body;
    }
}
class ClassGetter extends AbstractClassPart {
    /**
     * @param {?} name
     * @param {?} body
     * @param {?=} type
     * @param {?=} modifiers
     */
    constructor(name, body, type, modifiers = null) {
        super(type, modifiers);
        this.name = name;
        this.body = body;
    }
}
class ClassStmt extends Statement {
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
    constructor(name, parent, fields, getters, constructorMethod, methods, modifiers = null, sourceSpan) {
        super(modifiers, sourceSpan);
        this.name = name;
        this.parent = parent;
        this.fields = fields;
        this.getters = getters;
        this.constructorMethod = constructorMethod;
        this.methods = methods;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitStatement(visitor, context) {
        return visitor.visitDeclareClassStmt(this, context);
    }
}
class IfStmt extends Statement {
    /**
     * @param {?} condition
     * @param {?} trueCase
     * @param {?=} falseCase
     * @param {?=} sourceSpan
     */
    constructor(condition, trueCase, falseCase = [], sourceSpan) {
        super(null, sourceSpan);
        this.condition = condition;
        this.trueCase = trueCase;
        this.falseCase = falseCase;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitStatement(visitor, context) {
        return visitor.visitIfStmt(this, context);
    }
}

class TryCatchStmt extends Statement {
    /**
     * @param {?} bodyStmts
     * @param {?} catchStmts
     * @param {?=} sourceSpan
     */
    constructor(bodyStmts, catchStmts, sourceSpan) {
        super(null, sourceSpan);
        this.bodyStmts = bodyStmts;
        this.catchStmts = catchStmts;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitStatement(visitor, context) {
        return visitor.visitTryCatchStmt(this, context);
    }
}
class ThrowStmt extends Statement {
    /**
     * @param {?} error
     * @param {?=} sourceSpan
     */
    constructor(error, sourceSpan) {
        super(null, sourceSpan);
        this.error = error;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visitStatement(visitor, context) {
        return visitor.visitThrowStmt(this, context);
    }
}
class AstTransformer$1 {
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    transformExpr(expr, context) { return expr; }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    transformStmt(stmt, context) { return stmt; }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitReadVarExpr(ast, context) { return this.transformExpr(ast, context); }
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    visitWriteVarExpr(expr, context) {
        return this.transformExpr(new WriteVarExpr(expr.name, expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
    }
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    visitWriteKeyExpr(expr, context) {
        return this.transformExpr(new WriteKeyExpr(expr.receiver.visitExpression(this, context), expr.index.visitExpression(this, context), expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
    }
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    visitWritePropExpr(expr, context) {
        return this.transformExpr(new WritePropExpr(expr.receiver.visitExpression(this, context), expr.name, expr.value.visitExpression(this, context), expr.type, expr.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitInvokeMethodExpr(ast, context) {
        const /** @type {?} */ method = ast.builtin || ast.name;
        return this.transformExpr(new InvokeMethodExpr(ast.receiver.visitExpression(this, context), /** @type {?} */ ((method)), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitInvokeFunctionExpr(ast, context) {
        return this.transformExpr(new InvokeFunctionExpr(ast.fn.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitInstantiateExpr(ast, context) {
        return this.transformExpr(new InstantiateExpr(ast.classExpr.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralExpr(ast, context) { return this.transformExpr(ast, context); }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitExternalExpr(ast, context) {
        return this.transformExpr(ast, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitConditionalExpr(ast, context) {
        return this.transformExpr(new ConditionalExpr(ast.condition.visitExpression(this, context), ast.trueCase.visitExpression(this, context), /** @type {?} */ ((ast.falseCase)).visitExpression(this, context), ast.type, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitNotExpr(ast, context) {
        return this.transformExpr(new NotExpr(ast.condition.visitExpression(this, context), ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitCastExpr(ast, context) {
        return this.transformExpr(new CastExpr(ast.value.visitExpression(this, context), ast.type, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitFunctionExpr(ast, context) {
        return this.transformExpr(new FunctionExpr(ast.params, this.visitAllStatements(ast.statements, context), ast.type, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitBinaryOperatorExpr(ast, context) {
        return this.transformExpr(new BinaryOperatorExpr(ast.operator, ast.lhs.visitExpression(this, context), ast.rhs.visitExpression(this, context), ast.type, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitReadPropExpr(ast, context) {
        return this.transformExpr(new ReadPropExpr(ast.receiver.visitExpression(this, context), ast.name, ast.type, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitReadKeyExpr(ast, context) {
        return this.transformExpr(new ReadKeyExpr(ast.receiver.visitExpression(this, context), ast.index.visitExpression(this, context), ast.type, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralArrayExpr(ast, context) {
        return this.transformExpr(new LiteralArrayExpr(this.visitAllExpressions(ast.entries, context), ast.type, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralMapExpr(ast, context) {
        const /** @type {?} */ entries = ast.entries.map((entry) => new LiteralMapEntry(entry.key, entry.value.visitExpression(this, context), entry.quoted));
        const /** @type {?} */ mapType = new MapType(ast.valueType, null);
        return this.transformExpr(new LiteralMapExpr(entries, mapType, ast.sourceSpan), context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitCommaExpr(ast, context) {
        return this.transformExpr(new CommaExpr(this.visitAllExpressions(ast.parts, context), ast.sourceSpan), context);
    }
    /**
     * @param {?} exprs
     * @param {?} context
     * @return {?}
     */
    visitAllExpressions(exprs, context) {
        return exprs.map(expr => expr.visitExpression(this, context));
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitDeclareVarStmt(stmt, context) {
        return this.transformStmt(new DeclareVarStmt(stmt.name, stmt.value.visitExpression(this, context), stmt.type, stmt.modifiers, stmt.sourceSpan), context);
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitDeclareFunctionStmt(stmt, context) {
        return this.transformStmt(new DeclareFunctionStmt(stmt.name, stmt.params, this.visitAllStatements(stmt.statements, context), stmt.type, stmt.modifiers, stmt.sourceSpan), context);
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitExpressionStmt(stmt, context) {
        return this.transformStmt(new ExpressionStatement(stmt.expr.visitExpression(this, context), stmt.sourceSpan), context);
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitReturnStmt(stmt, context) {
        return this.transformStmt(new ReturnStatement(stmt.value.visitExpression(this, context), stmt.sourceSpan), context);
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitDeclareClassStmt(stmt, context) {
        const /** @type {?} */ parent = ((stmt.parent)).visitExpression(this, context);
        const /** @type {?} */ getters = stmt.getters.map(getter => new ClassGetter(getter.name, this.visitAllStatements(getter.body, context), getter.type, getter.modifiers));
        const /** @type {?} */ ctorMethod = stmt.constructorMethod &&
            new ClassMethod(stmt.constructorMethod.name, stmt.constructorMethod.params, this.visitAllStatements(stmt.constructorMethod.body, context), stmt.constructorMethod.type, stmt.constructorMethod.modifiers);
        const /** @type {?} */ methods = stmt.methods.map(method => new ClassMethod(method.name, method.params, this.visitAllStatements(method.body, context), method.type, method.modifiers));
        return this.transformStmt(new ClassStmt(stmt.name, parent, stmt.fields, getters, ctorMethod, methods, stmt.modifiers, stmt.sourceSpan), context);
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitIfStmt(stmt, context) {
        return this.transformStmt(new IfStmt(stmt.condition.visitExpression(this, context), this.visitAllStatements(stmt.trueCase, context), this.visitAllStatements(stmt.falseCase, context), stmt.sourceSpan), context);
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitTryCatchStmt(stmt, context) {
        return this.transformStmt(new TryCatchStmt(this.visitAllStatements(stmt.bodyStmts, context), this.visitAllStatements(stmt.catchStmts, context), stmt.sourceSpan), context);
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitThrowStmt(stmt, context) {
        return this.transformStmt(new ThrowStmt(stmt.error.visitExpression(this, context), stmt.sourceSpan), context);
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitCommentStmt(stmt, context) {
        return this.transformStmt(stmt, context);
    }
    /**
     * @param {?} stmts
     * @param {?} context
     * @return {?}
     */
    visitAllStatements(stmts, context) {
        return stmts.map(stmt => stmt.visitStatement(this, context));
    }
}
class RecursiveAstVisitor$1 {
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitReadVarExpr(ast, context) { return ast; }
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    visitWriteVarExpr(expr, context) {
        expr.value.visitExpression(this, context);
        return expr;
    }
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    visitWriteKeyExpr(expr, context) {
        expr.receiver.visitExpression(this, context);
        expr.index.visitExpression(this, context);
        expr.value.visitExpression(this, context);
        return expr;
    }
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    visitWritePropExpr(expr, context) {
        expr.receiver.visitExpression(this, context);
        expr.value.visitExpression(this, context);
        return expr;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitInvokeMethodExpr(ast, context) {
        ast.receiver.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitInvokeFunctionExpr(ast, context) {
        ast.fn.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitInstantiateExpr(ast, context) {
        ast.classExpr.visitExpression(this, context);
        this.visitAllExpressions(ast.args, context);
        return ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralExpr(ast, context) { return ast; }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitExternalExpr(ast, context) { return ast; }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitConditionalExpr(ast, context) {
        ast.condition.visitExpression(this, context);
        ast.trueCase.visitExpression(this, context); /** @type {?} */
        ((ast.falseCase)).visitExpression(this, context);
        return ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitNotExpr(ast, context) {
        ast.condition.visitExpression(this, context);
        return ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitCastExpr(ast, context) {
        ast.value.visitExpression(this, context);
        return ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitFunctionExpr(ast, context) {
        this.visitAllStatements(ast.statements, context);
        return ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitBinaryOperatorExpr(ast, context) {
        ast.lhs.visitExpression(this, context);
        ast.rhs.visitExpression(this, context);
        return ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitReadPropExpr(ast, context) {
        ast.receiver.visitExpression(this, context);
        return ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitReadKeyExpr(ast, context) {
        ast.receiver.visitExpression(this, context);
        ast.index.visitExpression(this, context);
        return ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralArrayExpr(ast, context) {
        this.visitAllExpressions(ast.entries, context);
        return ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralMapExpr(ast, context) {
        ast.entries.forEach((entry) => entry.value.visitExpression(this, context));
        return ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitCommaExpr(ast, context) {
        this.visitAllExpressions(ast.parts, context);
    }
    /**
     * @param {?} exprs
     * @param {?} context
     * @return {?}
     */
    visitAllExpressions(exprs, context) {
        exprs.forEach(expr => expr.visitExpression(this, context));
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitDeclareVarStmt(stmt, context) {
        stmt.value.visitExpression(this, context);
        return stmt;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitDeclareFunctionStmt(stmt, context) {
        this.visitAllStatements(stmt.statements, context);
        return stmt;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitExpressionStmt(stmt, context) {
        stmt.expr.visitExpression(this, context);
        return stmt;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitReturnStmt(stmt, context) {
        stmt.value.visitExpression(this, context);
        return stmt;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitDeclareClassStmt(stmt, context) {
        ((stmt.parent)).visitExpression(this, context);
        stmt.getters.forEach(getter => this.visitAllStatements(getter.body, context));
        if (stmt.constructorMethod) {
            this.visitAllStatements(stmt.constructorMethod.body, context);
        }
        stmt.methods.forEach(method => this.visitAllStatements(method.body, context));
        return stmt;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitIfStmt(stmt, context) {
        stmt.condition.visitExpression(this, context);
        this.visitAllStatements(stmt.trueCase, context);
        this.visitAllStatements(stmt.falseCase, context);
        return stmt;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitTryCatchStmt(stmt, context) {
        this.visitAllStatements(stmt.bodyStmts, context);
        this.visitAllStatements(stmt.catchStmts, context);
        return stmt;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitThrowStmt(stmt, context) {
        stmt.error.visitExpression(this, context);
        return stmt;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitCommentStmt(stmt, context) { return stmt; }
    /**
     * @param {?} stmts
     * @param {?} context
     * @return {?}
     */
    visitAllStatements(stmts, context) {
        stmts.forEach(stmt => stmt.visitStatement(this, context));
    }
}
/**
 * @param {?} stmts
 * @return {?}
 */
function findReadVarNames(stmts) {
    const /** @type {?} */ visitor = new _ReadVarVisitor();
    visitor.visitAllStatements(stmts, null);
    return visitor.varNames;
}
class _ReadVarVisitor extends RecursiveAstVisitor$1 {
    constructor() {
        super(...arguments);
        this.varNames = new Set();
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitDeclareFunctionStmt(stmt, context) {
        // Don't descend into nested functions
        return stmt;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitDeclareClassStmt(stmt, context) {
        // Don't descend into nested classes
        return stmt;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitReadVarExpr(ast, context) {
        if (ast.name) {
            this.varNames.add(ast.name);
        }
        return null;
    }
}
/**
 * @param {?} stmt
 * @param {?} sourceSpan
 * @return {?}
 */
function applySourceSpanToStatementIfNeeded(stmt, sourceSpan) {
    if (!sourceSpan) {
        return stmt;
    }
    const /** @type {?} */ transformer = new _ApplySourceSpanTransformer(sourceSpan);
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
    const /** @type {?} */ transformer = new _ApplySourceSpanTransformer(sourceSpan);
    return expr.visitExpression(transformer, null);
}
class _ApplySourceSpanTransformer extends AstTransformer$1 {
    /**
     * @param {?} sourceSpan
     */
    constructor(sourceSpan) {
        super();
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} obj
     * @return {?}
     */
    _clone(obj) {
        const /** @type {?} */ clone = Object.create(obj.constructor.prototype);
        for (let /** @type {?} */ prop in obj) {
            clone[prop] = obj[prop];
        }
        return clone;
    }
    /**
     * @param {?} expr
     * @param {?} context
     * @return {?}
     */
    transformExpr(expr, context) {
        if (!expr.sourceSpan) {
            expr = this._clone(expr);
            expr.sourceSpan = this.sourceSpan;
        }
        return expr;
    }
    /**
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    transformStmt(stmt, context) {
        if (!stmt.sourceSpan) {
            stmt = this._clone(stmt);
            stmt.sourceSpan = this.sourceSpan;
        }
        return stmt;
    }
}
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
function importExpr(id, typeParams = null, sourceSpan) {
    return new ExternalExpr(id, null, typeParams, sourceSpan);
}
/**
 * @param {?} id
 * @param {?=} typeParams
 * @param {?=} typeModifiers
 * @return {?}
 */
function importType(id, typeParams = null, typeModifiers = null) {
    return id != null ? expressionType(importExpr(id, typeParams, null), typeModifiers) : null;
}
/**
 * @param {?} expr
 * @param {?=} typeModifiers
 * @return {?}
 */
function expressionType(expr, typeModifiers = null) {
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
function literalMap(values, type = null, quoted = false) {
    return new LiteralMapExpr(values.map(entry => new LiteralMapEntry(entry[0], entry[1], quoted)), type, null);
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
    const /** @type {?} */ parentArgs = config.parentArgs || [];
    const /** @type {?} */ superCtorStmts = config.parent ? [SUPER_EXPR.callFn(parentArgs).toStmt()] : [];
    const /** @type {?} */ builder = concatClassBuilderParts(Array.isArray(config.builders) ? config.builders : [config.builders]);
    const /** @type {?} */ ctor = new ClassMethod(null, config.ctorParams || [], superCtorStmts.concat(builder.ctorStmts));
    return new ClassStmt(config.name, config.parent || null, builder.fields, builder.getters, ctor, builder.methods, config.modifiers || [], config.sourceSpan);
}
/**
 * @param {?} builders
 * @return {?}
 */
function concatClassBuilderParts(builders) {
    return {
        fields: [].concat(...((builders.map((builder => builder.fields || []))))),
        methods: [].concat(...((builders.map(builder => builder.methods || [])))),
        getters: [].concat(...((builders.map(builder => builder.getters || [])))),
        ctorStmts: [].concat(...((builders.map(builder => builder.ctorStmts || [])))),
    };
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const QUOTED_KEYS = '$quoted$';
/**
 * @param {?} value
 * @param {?=} type
 * @return {?}
 */
function convertValueToOutputAst(value, type = null) {
    return visitValue(value, new _ValueOutputAstTransformer(), type);
}
class _ValueOutputAstTransformer {
    /**
     * @param {?} arr
     * @param {?} type
     * @return {?}
     */
    visitArray(arr, type) {
        return literalArr(arr.map(value => visitValue(value, this, null)), type);
    }
    /**
     * @param {?} map
     * @param {?} type
     * @return {?}
     */
    visitStringMap(map, type) {
        const /** @type {?} */ entries = [];
        const /** @type {?} */ quotedSet = new Set(map && map[QUOTED_KEYS]);
        Object.keys(map).forEach(key => {
            entries.push(new LiteralMapEntry(key, visitValue(map[key], this, null), quotedSet.has(key)));
        });
        return new LiteralMapExpr(entries, type);
    }
    /**
     * @param {?} value
     * @param {?} type
     * @return {?}
     */
    visitPrimitive(value, type) { return literal(value, type); }
    /**
     * @param {?} value
     * @param {?} type
     * @return {?}
     */
    visitOther(value, type) {
        if (value instanceof Expression) {
            return value;
        }
        else {
            return importExpr({ reference: value });
        }
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
 * This is currently not read, but will probably be used in the future.
 * We keep it as we already pass it through all the rigth places...
 */
class ComponentFactoryDependency {
    /**
     * @param {?} compType
     */
    constructor(compType) {
        this.compType = compType;
    }
}
class NgModuleCompileResult {
    /**
     * @param {?} statements
     * @param {?} ngModuleFactoryVar
     * @param {?} dependencies
     */
    constructor(statements, ngModuleFactoryVar, dependencies) {
        this.statements = statements;
        this.ngModuleFactoryVar = ngModuleFactoryVar;
        this.dependencies = dependencies;
    }
}
class NgModuleCompiler {
    /**
     * @param {?} ngModuleMeta
     * @param {?} extraProviders
     * @return {?}
     */
    compile(ngModuleMeta, extraProviders) {
        const /** @type {?} */ sourceSpan = typeSourceSpan('NgModule', ngModuleMeta.type);
        const /** @type {?} */ deps = [];
        const /** @type {?} */ bootstrapComponentFactories = [];
        const /** @type {?} */ entryComponentFactories = ngModuleMeta.transitiveModule.entryComponents.map((entryComponent) => {
            if (ngModuleMeta.bootstrapComponents.some((id) => id.reference === entryComponent.componentType)) {
                bootstrapComponentFactories.push({ reference: entryComponent.componentFactory });
            }
            deps.push(new ComponentFactoryDependency(entryComponent.componentType));
            return { reference: entryComponent.componentFactory };
        });
        const /** @type {?} */ builder = new _InjectorBuilder(ngModuleMeta, entryComponentFactories, bootstrapComponentFactories, sourceSpan);
        const /** @type {?} */ providerParser = new NgModuleProviderAnalyzer(ngModuleMeta, extraProviders, sourceSpan);
        providerParser.parse().forEach((provider) => builder.addProvider(provider));
        const /** @type {?} */ injectorClass = builder.build();
        const /** @type {?} */ ngModuleFactoryVar = `${identifierName(ngModuleMeta.type)}NgFactory`;
        const /** @type {?} */ ngModuleFactoryStmt = variable(ngModuleFactoryVar)
            .set(importExpr(createIdentifier(Identifiers.NgModuleFactory))
            .instantiate([variable(injectorClass.name), importExpr(ngModuleMeta.type)], importType(createIdentifier(Identifiers.NgModuleFactory), [/** @type {?} */ ((importType(ngModuleMeta.type)))], [TypeModifier.Const])))
            .toDeclStmt(null, [StmtModifier.Final]);
        const /** @type {?} */ stmts = [injectorClass, ngModuleFactoryStmt];
        if (ngModuleMeta.id) {
            const /** @type {?} */ registerFactoryStmt = importExpr(createIdentifier(Identifiers.RegisterModuleFactoryFn))
                .callFn([literal(ngModuleMeta.id), variable(ngModuleFactoryVar)])
                .toStmt();
            stmts.push(registerFactoryStmt);
        }
        return new NgModuleCompileResult(stmts, ngModuleFactoryVar, deps);
    }
}
NgModuleCompiler.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
NgModuleCompiler.ctorParameters = () => [];
class _InjectorBuilder {
    /**
     * @param {?} _ngModuleMeta
     * @param {?} _entryComponentFactories
     * @param {?} _bootstrapComponentFactories
     * @param {?} _sourceSpan
     */
    constructor(_ngModuleMeta, _entryComponentFactories, _bootstrapComponentFactories, _sourceSpan) {
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
    addProvider(resolvedProvider) {
        const /** @type {?} */ providerValueExpressions = resolvedProvider.providers.map((provider) => this._getProviderValue(provider));
        const /** @type {?} */ propName = `_${tokenName(resolvedProvider.token)}_${this._instances.size}`;
        const /** @type {?} */ instance = this._createProviderProperty(propName, resolvedProvider, providerValueExpressions, resolvedProvider.multiProvider, resolvedProvider.eager);
        if (resolvedProvider.lifecycleHooks.indexOf(ɵLifecycleHooks.OnDestroy) !== -1) {
            let /** @type {?} */ callNgOnDestroy = instance.callMethod('ngOnDestroy', []);
            if (!resolvedProvider.eager) {
                callNgOnDestroy = ((this._lazyProps.get(instance.name))).and(callNgOnDestroy);
            }
            this._destroyStmts.push(callNgOnDestroy.toStmt());
        }
        this._tokens.push(resolvedProvider.token);
        this._instances.set(tokenReference(resolvedProvider.token), instance);
    }
    /**
     * @return {?}
     */
    build() {
        const /** @type {?} */ getMethodStmts = this._tokens.map((token) => {
            const /** @type {?} */ providerExpr = ((this._instances.get(tokenReference(token))));
            return new IfStmt(InjectMethodVars.token.identical(createDiTokenExpression(token)), [new ReturnStatement(providerExpr)]);
        });
        const /** @type {?} */ methods = [
            new ClassMethod('createInternal', [], this._createStmts.concat(new ReturnStatement(/** @type {?} */ ((this._instances.get(this._ngModuleMeta.type.reference))))), importType(this._ngModuleMeta.type)),
            new ClassMethod('getInternal', [
                new FnParam(/** @type {?} */ ((InjectMethodVars.token.name)), DYNAMIC_TYPE),
                new FnParam(/** @type {?} */ ((InjectMethodVars.notFoundResult.name)), DYNAMIC_TYPE)
            ], getMethodStmts.concat([new ReturnStatement(InjectMethodVars.notFoundResult)]), DYNAMIC_TYPE),
            new ClassMethod('destroyInternal', [], this._destroyStmts),
        ];
        const /** @type {?} */ parentArgs = [
            variable(InjectorProps.parent.name),
            literalArr(this._entryComponentFactories.map((componentFactory) => importExpr(componentFactory))),
            literalArr(this._bootstrapComponentFactories.map((componentFactory) => importExpr(componentFactory)))
        ];
        const /** @type {?} */ injClassName = `${identifierName(this._ngModuleMeta.type)}Injector`;
        return createClassStmt({
            name: injClassName,
            ctorParams: [new FnParam(InjectorProps.parent.name, importType(createIdentifier(Identifiers.Injector)))],
            parent: importExpr(createIdentifier(Identifiers.NgModuleInjector), [/** @type {?} */ ((importType(this._ngModuleMeta.type)))]),
            parentArgs: parentArgs,
            builders: [{ methods }, this]
        });
    }
    /**
     * @param {?} provider
     * @return {?}
     */
    _getProviderValue(provider) {
        let /** @type {?} */ result;
        if (provider.useExisting != null) {
            result = this._getDependency({ token: provider.useExisting });
        }
        else if (provider.useFactory != null) {
            const /** @type {?} */ deps = provider.deps || provider.useFactory.diDeps;
            const /** @type {?} */ depsExpr = deps.map((dep) => this._getDependency(dep));
            result = importExpr(provider.useFactory).callFn(depsExpr);
        }
        else if (provider.useClass != null) {
            const /** @type {?} */ deps = provider.deps || provider.useClass.diDeps;
            const /** @type {?} */ depsExpr = deps.map((dep) => this._getDependency(dep));
            result =
                importExpr(provider.useClass).instantiate(depsExpr, importType(provider.useClass));
        }
        else {
            result = convertValueToOutputAst(provider.useValue);
        }
        return result;
    }
    /**
     * @param {?} propName
     * @param {?} provider
     * @param {?} providerValueExpressions
     * @param {?} isMulti
     * @param {?} isEager
     * @return {?}
     */
    _createProviderProperty(propName, provider, providerValueExpressions, isMulti, isEager) {
        let /** @type {?} */ resolvedProviderValueExpr;
        let /** @type {?} */ type;
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
            const /** @type {?} */ internalFieldProp = THIS_EXPR.prop(`_${propName}`);
            this.fields.push(new ClassField(internalFieldProp.name, type));
            // Note: Equals is important for JS so that it also checks the undefined case!
            const /** @type {?} */ getterStmts = [
                new IfStmt(internalFieldProp.isBlank(), [internalFieldProp.set(resolvedProviderValueExpr).toStmt()]),
                new ReturnStatement(internalFieldProp)
            ];
            this.getters.push(new ClassGetter(propName, getterStmts, type));
            this._lazyProps.set(propName, internalFieldProp);
        }
        return THIS_EXPR.prop(propName);
    }
    /**
     * @param {?} dep
     * @return {?}
     */
    _getDependency(dep) {
        let /** @type {?} */ result = ((null));
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
            const /** @type {?} */ args = [createDiTokenExpression(/** @type {?} */ ((dep.token)))];
            if (dep.isOptional) {
                args.push(NULL_EXPR);
            }
            result = InjectorProps.parent.callMethod('get', args);
        }
        return result;
    }
}
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
class InjectorProps {
}
InjectorProps.parent = THIS_EXPR.prop('parent');
class InjectMethodVars {
}
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
const VERSION$1 = 3;
const JS_B64_PREFIX = '# sourceMappingURL=data:application/json;base64,';
class SourceMapGenerator {
    /**
     * @param {?=} file
     */
    constructor(file = null) {
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
    addSource(url, content = null) {
        if (!this.sourcesContent.has(url)) {
            this.sourcesContent.set(url, content);
        }
        return this;
    }
    /**
     * @return {?}
     */
    addLine() {
        this.lines.push([]);
        this.lastCol0 = 0;
        return this;
    }
    /**
     * @param {?} col0
     * @param {?=} sourceUrl
     * @param {?=} sourceLine0
     * @param {?=} sourceCol0
     * @return {?}
     */
    addMapping(col0, sourceUrl, sourceLine0, sourceCol0) {
        if (!this.currentLine) {
            throw new Error(`A line must be added before mappings can be added`);
        }
        if (sourceUrl != null && !this.sourcesContent.has(sourceUrl)) {
            throw new Error(`Unknown source file "${sourceUrl}"`);
        }
        if (col0 == null) {
            throw new Error(`The column in the generated code must be provided`);
        }
        if (col0 < this.lastCol0) {
            throw new Error(`Mapping should be added in output order`);
        }
        if (sourceUrl && (sourceLine0 == null || sourceCol0 == null)) {
            throw new Error(`The source location must be provided when a source url is provided`);
        }
        this.hasMappings = true;
        this.lastCol0 = col0;
        this.currentLine.push({ col0, sourceUrl, sourceLine0, sourceCol0 });
        return this;
    }
    /**
     * @return {?}
     */
    get currentLine() { return this.lines.slice(-1)[0]; }
    /**
     * @return {?}
     */
    toJSON() {
        if (!this.hasMappings) {
            return null;
        }
        const /** @type {?} */ sourcesIndex = new Map();
        const /** @type {?} */ sources = [];
        const /** @type {?} */ sourcesContent = [];
        Array.from(this.sourcesContent.keys()).forEach((url, i) => {
            sourcesIndex.set(url, i);
            sources.push(url);
            sourcesContent.push(this.sourcesContent.get(url) || null);
        });
        let /** @type {?} */ mappings = '';
        let /** @type {?} */ lastCol0 = 0;
        let /** @type {?} */ lastSourceIndex = 0;
        let /** @type {?} */ lastSourceLine0 = 0;
        let /** @type {?} */ lastSourceCol0 = 0;
        this.lines.forEach(segments => {
            lastCol0 = 0;
            mappings += segments
                .map(segment => {
                // zero-based starting column of the line in the generated code
                let /** @type {?} */ segAsStr = toBase64VLQ(segment.col0 - lastCol0);
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
    }
    /**
     * @return {?}
     */
    toJsComment() {
        return this.hasMappings ? '//' + JS_B64_PREFIX + toBase64String(JSON.stringify(this, null, 0)) :
            '';
    }
}
/**
 * @param {?} value
 * @return {?}
 */
function toBase64String(value) {
    let /** @type {?} */ b64 = '';
    value = utf8Encode(value);
    for (let /** @type {?} */ i = 0; i < value.length;) {
        const /** @type {?} */ i1 = value.charCodeAt(i++);
        const /** @type {?} */ i2 = value.charCodeAt(i++);
        const /** @type {?} */ i3 = value.charCodeAt(i++);
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
    let /** @type {?} */ out = '';
    do {
        let /** @type {?} */ digit = value & 31;
        value = value >> 5;
        if (value > 0) {
            digit = digit | 32;
        }
        out += toBase64Digit(digit);
    } while (value > 0);
    return out;
}
const B64_DIGITS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
/**
 * @param {?} value
 * @return {?}
 */
function toBase64Digit(value) {
    if (value < 0 || value >= 64) {
        throw new Error(`Can only encode value in the range [0, 63]`);
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
const _SINGLE_QUOTE_ESCAPE_STRING_RE = /'|\\|\n|\r|\$/g;
const _LEGAL_IDENTIFIER_RE = /^[$A-Z_][0-9A-Z_$]*$/i;
const _INDENT_WITH = '  ';
const CATCH_ERROR_VAR$1 = variable('error', null, null);
const CATCH_STACK_VAR$1 = variable('stack', null, null);
/**
 * @abstract
 */

class _EmittedLine {
    /**
     * @param {?} indent
     */
    constructor(indent) {
        this.indent = indent;
        this.parts = [];
        this.srcSpans = [];
    }
}
class EmitterVisitorContext {
    /**
     * @param {?} _exportedVars
     * @param {?} _indent
     */
    constructor(_exportedVars, _indent) {
        this._exportedVars = _exportedVars;
        this._indent = _indent;
        this._classes = [];
        this._lines = [new _EmittedLine(_indent)];
    }
    /**
     * @param {?} exportedVars
     * @return {?}
     */
    static createRoot(exportedVars) {
        return new EmitterVisitorContext(exportedVars, 0);
    }
    /**
     * @return {?}
     */
    get _currentLine() { return this._lines[this._lines.length - 1]; }
    /**
     * @param {?} varName
     * @return {?}
     */
    isExportedVar(varName) { return this._exportedVars.indexOf(varName) !== -1; }
    /**
     * @param {?=} from
     * @param {?=} lastPart
     * @return {?}
     */
    println(from, lastPart = '') {
        this.print(from || null, lastPart, true);
    }
    /**
     * @return {?}
     */
    lineIsEmpty() { return this._currentLine.parts.length === 0; }
    /**
     * @param {?} from
     * @param {?} part
     * @param {?=} newLine
     * @return {?}
     */
    print(from, part, newLine = false) {
        if (part.length > 0) {
            this._currentLine.parts.push(part);
            this._currentLine.srcSpans.push(from && from.sourceSpan || null);
        }
        if (newLine) {
            this._lines.push(new _EmittedLine(this._indent));
        }
    }
    /**
     * @return {?}
     */
    removeEmptyLastLine() {
        if (this.lineIsEmpty()) {
            this._lines.pop();
        }
    }
    /**
     * @return {?}
     */
    incIndent() {
        this._indent++;
        this._currentLine.indent = this._indent;
    }
    /**
     * @return {?}
     */
    decIndent() {
        this._indent--;
        this._currentLine.indent = this._indent;
    }
    /**
     * @param {?} clazz
     * @return {?}
     */
    pushClass(clazz) { this._classes.push(clazz); }
    /**
     * @return {?}
     */
    popClass() { return ((this._classes.pop())); }
    /**
     * @return {?}
     */
    get currentClass() {
        return this._classes.length > 0 ? this._classes[this._classes.length - 1] : null;
    }
    /**
     * @return {?}
     */
    toSource() {
        return this.sourceLines
            .map(l => l.parts.length > 0 ? _createIndent(l.indent) + l.parts.join('') : '')
            .join('\n');
    }
    /**
     * @param {?} sourceFilePath
     * @param {?} genFilePath
     * @param {?=} startsAtLine
     * @return {?}
     */
    toSourceMapGenerator(sourceFilePath, genFilePath, startsAtLine = 0) {
        const /** @type {?} */ map = new SourceMapGenerator(genFilePath);
        let /** @type {?} */ firstOffsetMapped = false;
        const /** @type {?} */ mapFirstOffsetIfNeeded = () => {
            if (!firstOffsetMapped) {
                // Add a single space so that tools won't try to load the file from disk.
                // Note: We are using virtual urls like `ng:///`, so we have to
                // provide a content here.
                map.addSource(sourceFilePath, ' ').addMapping(0, sourceFilePath, 0, 0);
                firstOffsetMapped = true;
            }
        };
        for (let /** @type {?} */ i = 0; i < startsAtLine; i++) {
            map.addLine();
            mapFirstOffsetIfNeeded();
        }
        this.sourceLines.forEach((line, lineIdx) => {
            map.addLine();
            const /** @type {?} */ spans = line.srcSpans;
            const /** @type {?} */ parts = line.parts;
            let /** @type {?} */ col0 = line.indent * _INDENT_WITH.length;
            let /** @type {?} */ spanIdx = 0;
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
                const /** @type {?} */ span = ((spans[spanIdx]));
                const /** @type {?} */ source = span.start.file;
                const /** @type {?} */ sourceLine = span.start.line;
                const /** @type {?} */ sourceCol = span.start.col;
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
    }
    /**
     * @return {?}
     */
    get sourceLines() {
        if (this._lines.length && this._lines[this._lines.length - 1].parts.length === 0) {
            return this._lines.slice(0, -1);
        }
        return this._lines;
    }
}
/**
 * @abstract
 */
class AbstractEmitterVisitor {
    /**
     * @param {?} _escapeDollarInStrings
     */
    constructor(_escapeDollarInStrings) {
        this._escapeDollarInStrings = _escapeDollarInStrings;
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitExpressionStmt(stmt, ctx) {
        stmt.expr.visitExpression(this, ctx);
        ctx.println(stmt, ';');
        return null;
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitReturnStmt(stmt, ctx) {
        ctx.print(stmt, `return `);
        stmt.value.visitExpression(this, ctx);
        ctx.println(stmt, ';');
        return null;
    }
    /**
     * @abstract
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitCastExpr(ast, context) { }
    /**
     * @abstract
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitDeclareClassStmt(stmt, ctx) { }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitIfStmt(stmt, ctx) {
        ctx.print(stmt, `if (`);
        stmt.condition.visitExpression(this, ctx);
        ctx.print(stmt, `) {`);
        const /** @type {?} */ hasElseCase = stmt.falseCase != null && stmt.falseCase.length > 0;
        if (stmt.trueCase.length <= 1 && !hasElseCase) {
            ctx.print(stmt, ` `);
            this.visitAllStatements(stmt.trueCase, ctx);
            ctx.removeEmptyLastLine();
            ctx.print(stmt, ` `);
        }
        else {
            ctx.println();
            ctx.incIndent();
            this.visitAllStatements(stmt.trueCase, ctx);
            ctx.decIndent();
            if (hasElseCase) {
                ctx.println(stmt, `} else {`);
                ctx.incIndent();
                this.visitAllStatements(stmt.falseCase, ctx);
                ctx.decIndent();
            }
        }
        ctx.println(stmt, `}`);
        return null;
    }
    /**
     * @abstract
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitTryCatchStmt(stmt, ctx) { }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitThrowStmt(stmt, ctx) {
        ctx.print(stmt, `throw `);
        stmt.error.visitExpression(this, ctx);
        ctx.println(stmt, `;`);
        return null;
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitCommentStmt(stmt, ctx) {
        const /** @type {?} */ lines = stmt.comment.split('\n');
        lines.forEach((line) => { ctx.println(stmt, `// ${line}`); });
        return null;
    }
    /**
     * @abstract
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitDeclareVarStmt(stmt, ctx) { }
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    visitWriteVarExpr(expr, ctx) {
        const /** @type {?} */ lineWasEmpty = ctx.lineIsEmpty();
        if (!lineWasEmpty) {
            ctx.print(expr, '(');
        }
        ctx.print(expr, `${expr.name} = `);
        expr.value.visitExpression(this, ctx);
        if (!lineWasEmpty) {
            ctx.print(expr, ')');
        }
        return null;
    }
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    visitWriteKeyExpr(expr, ctx) {
        const /** @type {?} */ lineWasEmpty = ctx.lineIsEmpty();
        if (!lineWasEmpty) {
            ctx.print(expr, '(');
        }
        expr.receiver.visitExpression(this, ctx);
        ctx.print(expr, `[`);
        expr.index.visitExpression(this, ctx);
        ctx.print(expr, `] = `);
        expr.value.visitExpression(this, ctx);
        if (!lineWasEmpty) {
            ctx.print(expr, ')');
        }
        return null;
    }
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    visitWritePropExpr(expr, ctx) {
        const /** @type {?} */ lineWasEmpty = ctx.lineIsEmpty();
        if (!lineWasEmpty) {
            ctx.print(expr, '(');
        }
        expr.receiver.visitExpression(this, ctx);
        ctx.print(expr, `.${expr.name} = `);
        expr.value.visitExpression(this, ctx);
        if (!lineWasEmpty) {
            ctx.print(expr, ')');
        }
        return null;
    }
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    visitInvokeMethodExpr(expr, ctx) {
        expr.receiver.visitExpression(this, ctx);
        let /** @type {?} */ name = expr.name;
        if (expr.builtin != null) {
            name = this.getBuiltinMethodName(expr.builtin);
            if (name == null) {
                // some builtins just mean to skip the call.
                return null;
            }
        }
        ctx.print(expr, `.${name}(`);
        this.visitAllExpressions(expr.args, ctx, `,`);
        ctx.print(expr, `)`);
        return null;
    }
    /**
     * @abstract
     * @param {?} method
     * @return {?}
     */
    getBuiltinMethodName(method) { }
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    visitInvokeFunctionExpr(expr, ctx) {
        expr.fn.visitExpression(this, ctx);
        ctx.print(expr, `(`);
        this.visitAllExpressions(expr.args, ctx, ',');
        ctx.print(expr, `)`);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitReadVarExpr(ast, ctx) {
        let /** @type {?} */ varName = ((ast.name));
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
                    throw new Error(`Unknown builtin variable ${ast.builtin}`);
            }
        }
        ctx.print(ast, varName);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitInstantiateExpr(ast, ctx) {
        ctx.print(ast, `new `);
        ast.classExpr.visitExpression(this, ctx);
        ctx.print(ast, `(`);
        this.visitAllExpressions(ast.args, ctx, ',');
        ctx.print(ast, `)`);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitLiteralExpr(ast, ctx) {
        const /** @type {?} */ value = ast.value;
        if (typeof value === 'string') {
            ctx.print(ast, escapeIdentifier(value, this._escapeDollarInStrings));
        }
        else {
            ctx.print(ast, `${value}`);
        }
        return null;
    }
    /**
     * @abstract
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitExternalExpr(ast, ctx) { }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitConditionalExpr(ast, ctx) {
        ctx.print(ast, `(`);
        ast.condition.visitExpression(this, ctx);
        ctx.print(ast, '? ');
        ast.trueCase.visitExpression(this, ctx);
        ctx.print(ast, ': '); /** @type {?} */
        ((ast.falseCase)).visitExpression(this, ctx);
        ctx.print(ast, `)`);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitNotExpr(ast, ctx) {
        ctx.print(ast, '!');
        ast.condition.visitExpression(this, ctx);
        return null;
    }
    /**
     * @abstract
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitFunctionExpr(ast, ctx) { }
    /**
     * @abstract
     * @param {?} stmt
     * @param {?} context
     * @return {?}
     */
    visitDeclareFunctionStmt(stmt, context) { }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitBinaryOperatorExpr(ast, ctx) {
        let /** @type {?} */ opStr;
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
                throw new Error(`Unknown operator ${ast.operator}`);
        }
        ctx.print(ast, `(`);
        ast.lhs.visitExpression(this, ctx);
        ctx.print(ast, ` ${opStr} `);
        ast.rhs.visitExpression(this, ctx);
        ctx.print(ast, `)`);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitReadPropExpr(ast, ctx) {
        ast.receiver.visitExpression(this, ctx);
        ctx.print(ast, `.`);
        ctx.print(ast, ast.name);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitReadKeyExpr(ast, ctx) {
        ast.receiver.visitExpression(this, ctx);
        ctx.print(ast, `[`);
        ast.index.visitExpression(this, ctx);
        ctx.print(ast, `]`);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitLiteralArrayExpr(ast, ctx) {
        const /** @type {?} */ useNewLine = ast.entries.length > 1;
        ctx.print(ast, `[`, useNewLine);
        ctx.incIndent();
        this.visitAllExpressions(ast.entries, ctx, ',', useNewLine);
        ctx.decIndent();
        ctx.print(ast, `]`, useNewLine);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitLiteralMapExpr(ast, ctx) {
        const /** @type {?} */ useNewLine = ast.entries.length > 1;
        ctx.print(ast, `{`, useNewLine);
        ctx.incIndent();
        this.visitAllObjects(entry => {
            ctx.print(ast, `${escapeIdentifier(entry.key, this._escapeDollarInStrings, entry.quoted)}: `);
            entry.value.visitExpression(this, ctx);
        }, ast.entries, ctx, ',', useNewLine);
        ctx.decIndent();
        ctx.print(ast, `}`, useNewLine);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitCommaExpr(ast, ctx) {
        ctx.print(ast, '(');
        this.visitAllExpressions(ast.parts, ctx, ',');
        ctx.print(ast, ')');
        return null;
    }
    /**
     * @param {?} expressions
     * @param {?} ctx
     * @param {?} separator
     * @param {?=} newLine
     * @return {?}
     */
    visitAllExpressions(expressions, ctx, separator, newLine = false) {
        this.visitAllObjects(expr => expr.visitExpression(this, ctx), expressions, ctx, separator, newLine);
    }
    /**
     * @template T
     * @param {?} handler
     * @param {?} expressions
     * @param {?} ctx
     * @param {?} separator
     * @param {?=} newLine
     * @return {?}
     */
    visitAllObjects(handler, expressions, ctx, separator, newLine = false) {
        for (let /** @type {?} */ i = 0; i < expressions.length; i++) {
            if (i > 0) {
                ctx.print(null, separator, newLine);
            }
            handler(expressions[i]);
        }
        if (newLine) {
            ctx.println();
        }
    }
    /**
     * @param {?} statements
     * @param {?} ctx
     * @return {?}
     */
    visitAllStatements(statements, ctx) {
        statements.forEach((stmt) => stmt.visitStatement(this, ctx));
    }
}
/**
 * @param {?} input
 * @param {?} escapeDollar
 * @param {?=} alwaysQuote
 * @return {?}
 */
function escapeIdentifier(input, escapeDollar, alwaysQuote = true) {
    if (input == null) {
        return null;
    }
    const /** @type {?} */ body = input.replace(_SINGLE_QUOTE_ESCAPE_STRING_RE, (...match) => {
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
            return `\\${match[0]}`;
        }
    });
    const /** @type {?} */ requiresQuotes = alwaysQuote || !_LEGAL_IDENTIFIER_RE.test(body);
    return requiresQuotes ? `'${body}'` : body;
}
/**
 * @param {?} count
 * @return {?}
 */
function _createIndent(count) {
    let /** @type {?} */ res = '';
    for (let /** @type {?} */ i = 0; i < count; i++) {
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
const _debugFilePath = '/debug/lib';
/**
 * @param {?} ast
 * @return {?}
 */
function debugOutputAstAsTypeScript(ast) {
    const /** @type {?} */ converter = new _TsEmitterVisitor(_debugFilePath, {
        /**
         * @param {?} filePath
         * @param {?} containingFilePath
         * @return {?}
         */
        fileNameToModuleName(filePath, containingFilePath) { return filePath; },
        /**
         * @param {?} symbol
         * @return {?}
         */
        getImportAs(symbol) { return null; },
        getTypeArity: symbol => null
    });
    const /** @type {?} */ ctx = EmitterVisitorContext.createRoot([]);
    const /** @type {?} */ asts = Array.isArray(ast) ? ast : [ast];
    asts.forEach((ast) => {
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
            throw new Error(`Don't know how to print debug info for ${ast}`);
        }
    });
    return ctx.toSource();
}
class TypeScriptEmitter {
    /**
     * @param {?} _importResolver
     */
    constructor(_importResolver) {
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
    emitStatements(srcFilePath, genFilePath, stmts, exportedVars, preamble = '') {
        const /** @type {?} */ converter = new _TsEmitterVisitor(genFilePath, this._importResolver);
        const /** @type {?} */ ctx = EmitterVisitorContext.createRoot(exportedVars);
        converter.visitAllStatements(stmts, ctx);
        const /** @type {?} */ preambleLines = preamble ? preamble.split('\n') : [];
        converter.reexports.forEach((reexports, exportedFilePath) => {
            const /** @type {?} */ reexportsCode = reexports.map(reexport => `${reexport.name} as ${reexport.as}`).join(',');
            preambleLines.push(`export {${reexportsCode}} from '${this._importResolver.fileNameToModuleName(exportedFilePath, genFilePath)}';`);
        });
        converter.importsWithPrefixes.forEach((prefix, importedFilePath) => {
            // Note: can't write the real word for import as it screws up system.js auto detection...
            preambleLines.push(`imp` +
                `ort * as ${prefix} from '${this._importResolver.fileNameToModuleName(importedFilePath, genFilePath)}';`);
        });
        const /** @type {?} */ sm = ctx.toSourceMapGenerator(srcFilePath, genFilePath, preambleLines.length).toJsComment();
        const /** @type {?} */ lines = [...preambleLines, ctx.toSource(), sm];
        if (sm) {
            // always add a newline at the end, as some tools have bugs without it.
            lines.push('');
        }
        return lines.join('\n');
    }
}
class _TsEmitterVisitor extends AbstractEmitterVisitor {
    /**
     * @param {?} _genFilePath
     * @param {?} _importResolver
     */
    constructor(_genFilePath, _importResolver) {
        super(false);
        this._genFilePath = _genFilePath;
        this._importResolver = _importResolver;
        this.typeExpression = 0;
        this.importsWithPrefixes = new Map();
        this.reexports = new Map();
    }
    /**
     * @param {?} t
     * @param {?} ctx
     * @param {?=} defaultType
     * @return {?}
     */
    visitType(t, ctx, defaultType = 'any') {
        if (t) {
            this.typeExpression++;
            t.visitType(this, ctx);
            this.typeExpression--;
        }
        else {
            ctx.print(null, defaultType);
        }
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitLiteralExpr(ast, ctx) {
        const /** @type {?} */ value = ast.value;
        if (value == null && ast.type != INFERRED_TYPE) {
            ctx.print(ast, `(${value} as any)`);
            return null;
        }
        return super.visitLiteralExpr(ast, ctx);
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitLiteralArrayExpr(ast, ctx) {
        if (ast.entries.length === 0) {
            ctx.print(ast, '(');
        }
        const /** @type {?} */ result = super.visitLiteralArrayExpr(ast, ctx);
        if (ast.entries.length === 0) {
            ctx.print(ast, ' as any[])');
        }
        return result;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitExternalExpr(ast, ctx) {
        this._visitIdentifier(ast.value, ast.typeParams, ctx);
        return null;
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitDeclareVarStmt(stmt, ctx) {
        if (ctx.isExportedVar(stmt.name) && stmt.value instanceof ExternalExpr && !stmt.type) {
            // check for a reexport
            const { name, filePath, members } = this._resolveStaticSymbol(stmt.value.value);
            if (((members)).length === 0 && filePath !== this._genFilePath) {
                let /** @type {?} */ reexports = this.reexports.get(filePath);
                if (!reexports) {
                    reexports = [];
                    this.reexports.set(filePath, reexports);
                }
                reexports.push({ name, as: stmt.name });
                return null;
            }
        }
        if (ctx.isExportedVar(stmt.name)) {
            ctx.print(stmt, `export `);
        }
        if (stmt.hasModifier(StmtModifier.Final)) {
            ctx.print(stmt, `const`);
        }
        else {
            ctx.print(stmt, `var`);
        }
        ctx.print(stmt, ` ${stmt.name}`);
        this._printColonType(stmt.type, ctx);
        ctx.print(stmt, ` = `);
        stmt.value.visitExpression(this, ctx);
        ctx.println(stmt, `;`);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitCastExpr(ast, ctx) {
        ctx.print(ast, `(<`); /** @type {?} */
        ((ast.type)).visitType(this, ctx);
        ctx.print(ast, `>`);
        ast.value.visitExpression(this, ctx);
        ctx.print(ast, `)`);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitInstantiateExpr(ast, ctx) {
        ctx.print(ast, `new `);
        this.typeExpression++;
        ast.classExpr.visitExpression(this, ctx);
        this.typeExpression--;
        ctx.print(ast, `(`);
        this.visitAllExpressions(ast.args, ctx, ',');
        ctx.print(ast, `)`);
        return null;
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitDeclareClassStmt(stmt, ctx) {
        ctx.pushClass(stmt);
        if (ctx.isExportedVar(stmt.name)) {
            ctx.print(stmt, `export `);
        }
        ctx.print(stmt, `class ${stmt.name}`);
        if (stmt.parent != null) {
            ctx.print(stmt, ` extends `);
            this.typeExpression++;
            stmt.parent.visitExpression(this, ctx);
            this.typeExpression--;
        }
        ctx.println(stmt, ` {`);
        ctx.incIndent();
        stmt.fields.forEach((field) => this._visitClassField(field, ctx));
        if (stmt.constructorMethod != null) {
            this._visitClassConstructor(stmt, ctx);
        }
        stmt.getters.forEach((getter) => this._visitClassGetter(getter, ctx));
        stmt.methods.forEach((method) => this._visitClassMethod(method, ctx));
        ctx.decIndent();
        ctx.println(stmt, `}`);
        ctx.popClass();
        return null;
    }
    /**
     * @param {?} field
     * @param {?} ctx
     * @return {?}
     */
    _visitClassField(field, ctx) {
        if (field.hasModifier(StmtModifier.Private)) {
            // comment out as a workaround for #10967
            ctx.print(null, `/*private*/ `);
        }
        ctx.print(null, field.name);
        this._printColonType(field.type, ctx);
        ctx.println(null, `;`);
    }
    /**
     * @param {?} getter
     * @param {?} ctx
     * @return {?}
     */
    _visitClassGetter(getter, ctx) {
        if (getter.hasModifier(StmtModifier.Private)) {
            ctx.print(null, `private `);
        }
        ctx.print(null, `get ${getter.name}()`);
        this._printColonType(getter.type, ctx);
        ctx.println(null, ` {`);
        ctx.incIndent();
        this.visitAllStatements(getter.body, ctx);
        ctx.decIndent();
        ctx.println(null, `}`);
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    _visitClassConstructor(stmt, ctx) {
        ctx.print(stmt, `constructor(`);
        this._visitParams(stmt.constructorMethod.params, ctx);
        ctx.println(stmt, `) {`);
        ctx.incIndent();
        this.visitAllStatements(stmt.constructorMethod.body, ctx);
        ctx.decIndent();
        ctx.println(stmt, `}`);
    }
    /**
     * @param {?} method
     * @param {?} ctx
     * @return {?}
     */
    _visitClassMethod(method, ctx) {
        if (method.hasModifier(StmtModifier.Private)) {
            ctx.print(null, `private `);
        }
        ctx.print(null, `${method.name}(`);
        this._visitParams(method.params, ctx);
        ctx.print(null, `)`);
        this._printColonType(method.type, ctx, 'void');
        ctx.println(null, ` {`);
        ctx.incIndent();
        this.visitAllStatements(method.body, ctx);
        ctx.decIndent();
        ctx.println(null, `}`);
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitFunctionExpr(ast, ctx) {
        ctx.print(ast, `(`);
        this._visitParams(ast.params, ctx);
        ctx.print(ast, `)`);
        this._printColonType(ast.type, ctx, 'void');
        ctx.println(ast, ` => {`);
        ctx.incIndent();
        this.visitAllStatements(ast.statements, ctx);
        ctx.decIndent();
        ctx.print(ast, `}`);
        return null;
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitDeclareFunctionStmt(stmt, ctx) {
        if (ctx.isExportedVar(stmt.name)) {
            ctx.print(stmt, `export `);
        }
        ctx.print(stmt, `function ${stmt.name}(`);
        this._visitParams(stmt.params, ctx);
        ctx.print(stmt, `)`);
        this._printColonType(stmt.type, ctx, 'void');
        ctx.println(stmt, ` {`);
        ctx.incIndent();
        this.visitAllStatements(stmt.statements, ctx);
        ctx.decIndent();
        ctx.println(stmt, `}`);
        return null;
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitTryCatchStmt(stmt, ctx) {
        ctx.println(stmt, `try {`);
        ctx.incIndent();
        this.visitAllStatements(stmt.bodyStmts, ctx);
        ctx.decIndent();
        ctx.println(stmt, `} catch (${CATCH_ERROR_VAR$1.name}) {`);
        ctx.incIndent();
        const /** @type {?} */ catchStmts = [/** @type {?} */ (CATCH_STACK_VAR$1.set(CATCH_ERROR_VAR$1.prop('stack', null)).toDeclStmt(null, [
                StmtModifier.Final
            ]))].concat(stmt.catchStmts);
        this.visitAllStatements(catchStmts, ctx);
        ctx.decIndent();
        ctx.println(stmt, `}`);
        return null;
    }
    /**
     * @param {?} type
     * @param {?} ctx
     * @return {?}
     */
    visitBuiltintType(type, ctx) {
        let /** @type {?} */ typeStr;
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
                throw new Error(`Unsupported builtin type ${type.name}`);
        }
        ctx.print(null, typeStr);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitExpressionType(ast, ctx) {
        ast.value.visitExpression(this, ctx);
        return null;
    }
    /**
     * @param {?} type
     * @param {?} ctx
     * @return {?}
     */
    visitArrayType(type, ctx) {
        this.visitType(type.of, ctx);
        ctx.print(null, `[]`);
        return null;
    }
    /**
     * @param {?} type
     * @param {?} ctx
     * @return {?}
     */
    visitMapType(type, ctx) {
        ctx.print(null, `{[key: string]:`);
        this.visitType(type.valueType, ctx);
        ctx.print(null, `}`);
        return null;
    }
    /**
     * @param {?} method
     * @return {?}
     */
    getBuiltinMethodName(method) {
        let /** @type {?} */ name;
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
                throw new Error(`Unknown builtin method: ${method}`);
        }
        return name;
    }
    /**
     * @param {?} params
     * @param {?} ctx
     * @return {?}
     */
    _visitParams(params, ctx) {
        this.visitAllObjects(param => {
            ctx.print(null, param.name);
            this._printColonType(param.type, ctx);
        }, params, ctx, ',');
    }
    /**
     * @param {?} value
     * @return {?}
     */
    _resolveStaticSymbol(value) {
        const /** @type {?} */ reference = value.reference;
        if (!(reference instanceof StaticSymbol)) {
            throw new Error(`Internal error: unknown identifier ${JSON.stringify(value)}`);
        }
        const /** @type {?} */ arity = this._importResolver.getTypeArity(reference) || undefined;
        const /** @type {?} */ importReference = this._importResolver.getImportAs(reference) || reference;
        return {
            name: importReference.name,
            filePath: importReference.filePath,
            members: importReference.members, arity
        };
    }
    /**
     * @param {?} value
     * @param {?} typeParams
     * @param {?} ctx
     * @return {?}
     */
    _visitIdentifier(value, typeParams, ctx) {
        const { name, filePath, members, arity } = this._resolveStaticSymbol(value);
        if (filePath != this._genFilePath) {
            let /** @type {?} */ prefix = this.importsWithPrefixes.get(filePath);
            if (prefix == null) {
                prefix = `import${this.importsWithPrefixes.size}`;
                this.importsWithPrefixes.set(filePath, prefix);
            }
            ctx.print(null, `${prefix}.`);
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
            const /** @type {?} */ suppliedParameters = (typeParams && typeParams.length) || 0;
            const /** @type {?} */ additionalParameters = (arity || 0) - suppliedParameters;
            if (suppliedParameters > 0 || additionalParameters > 0) {
                ctx.print(null, `<`);
                if (suppliedParameters > 0) {
                    this.visitAllObjects(type => type.visitType(this, ctx), /** @type {?} */ ((typeParams)), ctx, ',');
                }
                if (additionalParameters > 0) {
                    for (let /** @type {?} */ i = 0; i < additionalParameters; i++) {
                        if (i > 0 || suppliedParameters > 0)
                            ctx.print(null, ',');
                        ctx.print(null, 'any');
                    }
                }
                ctx.print(null, `>`);
            }
        }
    }
    /**
     * @param {?} type
     * @param {?} ctx
     * @param {?=} defaultType
     * @return {?}
     */
    _printColonType(type, ctx, defaultType) {
        if (type !== INFERRED_TYPE) {
            ctx.print(null, ':');
            this.visitType(type, ctx, defaultType);
        }
    }
}

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
const SECURITY_SCHEMA = {};
/**
 * @param {?} ctx
 * @param {?} specs
 * @return {?}
 */
function registerContext(ctx, specs) {
    for (const /** @type {?} */ spec of specs)
        SECURITY_SCHEMA[spec.toLowerCase()] = ctx;
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
const BOOLEAN = 'boolean';
const NUMBER = 'number';
const STRING = 'string';
const OBJECT = 'object';
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
const SCHEMA = [
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
const _ATTR_TO_PROP = {
    'class': 'className',
    'for': 'htmlFor',
    'formaction': 'formAction',
    'innerHtml': 'innerHTML',
    'readonly': 'readOnly',
    'tabindex': 'tabIndex',
};
class DomElementSchemaRegistry extends ElementSchemaRegistry {
    constructor() {
        super();
        this._schema = {};
        SCHEMA.forEach(encodedType => {
            const type = {};
            const [strType, strProperties] = encodedType.split('|');
            const properties = strProperties.split(',');
            const [typeNames, superName] = strType.split('^');
            typeNames.split(',').forEach(tag => this._schema[tag.toLowerCase()] = type);
            const superType = superName && this._schema[superName.toLowerCase()];
            if (superType) {
                Object.keys(superType).forEach((prop) => { type[prop] = superType[prop]; });
            }
            properties.forEach((property) => {
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
    }
    /**
     * @param {?} tagName
     * @param {?} propName
     * @param {?} schemaMetas
     * @return {?}
     */
    hasProperty(tagName, propName, schemaMetas) {
        if (schemaMetas.some((schema) => schema.name === NO_ERRORS_SCHEMA.name)) {
            return true;
        }
        if (tagName.indexOf('-') > -1) {
            if (isNgContainer(tagName) || isNgContent(tagName)) {
                return false;
            }
            if (schemaMetas.some((schema) => schema.name === CUSTOM_ELEMENTS_SCHEMA.name)) {
                // Can't tell now as we don't know which properties a custom element will get
                // once it is instantiated
                return true;
            }
        }
        const /** @type {?} */ elementProperties = this._schema[tagName.toLowerCase()] || this._schema['unknown'];
        return !!elementProperties[propName];
    }
    /**
     * @param {?} tagName
     * @param {?} schemaMetas
     * @return {?}
     */
    hasElement(tagName, schemaMetas) {
        if (schemaMetas.some((schema) => schema.name === NO_ERRORS_SCHEMA.name)) {
            return true;
        }
        if (tagName.indexOf('-') > -1) {
            if (isNgContainer(tagName) || isNgContent(tagName)) {
                return true;
            }
            if (schemaMetas.some((schema) => schema.name === CUSTOM_ELEMENTS_SCHEMA.name)) {
                // Allow any custom elements
                return true;
            }
        }
        return !!this._schema[tagName.toLowerCase()];
    }
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
    securityContext(tagName, propName, isAttribute) {
        if (isAttribute) {
            // NB: For security purposes, use the mapped property name, not the attribute name.
            propName = this.getMappedPropName(propName);
        }
        // Make sure comparisons are case insensitive, so that case differences between attribute and
        // property names do not have a security impact.
        tagName = tagName.toLowerCase();
        propName = propName.toLowerCase();
        let /** @type {?} */ ctx = SECURITY_SCHEMA[tagName + '|' + propName];
        if (ctx) {
            return ctx;
        }
        ctx = SECURITY_SCHEMA['*|' + propName];
        return ctx ? ctx : SecurityContext.NONE;
    }
    /**
     * @param {?} propName
     * @return {?}
     */
    getMappedPropName(propName) { return _ATTR_TO_PROP[propName] || propName; }
    /**
     * @return {?}
     */
    getDefaultComponentElementName() { return 'ng-component'; }
    /**
     * @param {?} name
     * @return {?}
     */
    validateProperty(name) {
        if (name.toLowerCase().startsWith('on')) {
            const /** @type {?} */ msg = `Binding to event property '${name}' is disallowed for security reasons, ` +
                `please use (${name.slice(2)})=...` +
                `\nIf '${name}' is a directive input, make sure the directive is imported by the` +
                ` current module.`;
            return { error: true, msg: msg };
        }
        else {
            return { error: false };
        }
    }
    /**
     * @param {?} name
     * @return {?}
     */
    validateAttribute(name) {
        if (name.toLowerCase().startsWith('on')) {
            const /** @type {?} */ msg = `Binding to event attribute '${name}' is disallowed for security reasons, ` +
                `please use (${name.slice(2)})=...`;
            return { error: true, msg: msg };
        }
        else {
            return { error: false };
        }
    }
    /**
     * @return {?}
     */
    allKnownElementNames() { return Object.keys(this._schema); }
    /**
     * @param {?} propName
     * @return {?}
     */
    normalizeAnimationStyleProperty(propName) {
        return dashCaseToCamelCase(propName);
    }
    /**
     * @param {?} camelCaseProp
     * @param {?} userProvidedProp
     * @param {?} val
     * @return {?}
     */
    normalizeAnimationStyleValue(camelCaseProp, userProvidedProp, val) {
        let /** @type {?} */ unit = '';
        const /** @type {?} */ strVal = val.toString().trim();
        let /** @type {?} */ errorMsg = ((null));
        if (_isPixelDimensionStyle(camelCaseProp) && val !== 0 && val !== '0') {
            if (typeof val === 'number') {
                unit = 'px';
            }
            else {
                const /** @type {?} */ valAndSuffixMatch = val.match(/^[+-]?[\d\.]+([a-z]*)$/);
                if (valAndSuffixMatch && valAndSuffixMatch[1].length == 0) {
                    errorMsg = `Please provide a CSS unit value for ${userProvidedProp}:${val}`;
                }
            }
        }
        return { error: errorMsg, value: strVal + unit };
    }
}
DomElementSchemaRegistry.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
DomElementSchemaRegistry.ctorParameters = () => [];
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

class ShadowCss {
    constructor() {
        this.strictStyling = true;
    }
    /**
     * @param {?} cssText
     * @param {?} selector
     * @param {?=} hostSelector
     * @return {?}
     */
    shimCssText(cssText, selector, hostSelector = '') {
        const /** @type {?} */ sourceMappingUrl = extractSourceMappingUrl(cssText);
        cssText = stripComments(cssText);
        cssText = this._insertDirectives(cssText);
        return this._scopeCssText(cssText, selector, hostSelector) + sourceMappingUrl;
    }
    /**
     * @param {?} cssText
     * @return {?}
     */
    _insertDirectives(cssText) {
        cssText = this._insertPolyfillDirectivesInCssText(cssText);
        return this._insertPolyfillRulesInCssText(cssText);
    }
    /**
     * @param {?} cssText
     * @return {?}
     */
    _insertPolyfillDirectivesInCssText(cssText) {
        // Difference with webcomponents.js: does not handle comments
        return cssText.replace(_cssContentNextSelectorRe, function (...m) { return m[2] + '{'; });
    }
    /**
     * @param {?} cssText
     * @return {?}
     */
    _insertPolyfillRulesInCssText(cssText) {
        // Difference with webcomponents.js: does not handle comments
        return cssText.replace(_cssContentRuleRe, (...m) => {
            const /** @type {?} */ rule = m[0].replace(m[1], '').replace(m[2], '');
            return m[4] + rule;
        });
    }
    /**
     * @param {?} cssText
     * @param {?} scopeSelector
     * @param {?} hostSelector
     * @return {?}
     */
    _scopeCssText(cssText, scopeSelector, hostSelector) {
        const /** @type {?} */ unscopedRules = this._extractUnscopedRulesFromCssText(cssText);
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
    }
    /**
     * @param {?} cssText
     * @return {?}
     */
    _extractUnscopedRulesFromCssText(cssText) {
        // Difference with webcomponents.js: does not handle comments
        let /** @type {?} */ r = '';
        let /** @type {?} */ m;
        _cssContentUnscopedRuleRe.lastIndex = 0;
        while ((m = _cssContentUnscopedRuleRe.exec(cssText)) !== null) {
            const /** @type {?} */ rule = m[0].replace(m[2], '').replace(m[1], m[4]);
            r += rule + '\n\n';
        }
        return r;
    }
    /**
     * @param {?} cssText
     * @return {?}
     */
    _convertColonHost(cssText) {
        return this._convertColonRule(cssText, _cssColonHostRe, this._colonHostPartReplacer);
    }
    /**
     * @param {?} cssText
     * @return {?}
     */
    _convertColonHostContext(cssText) {
        return this._convertColonRule(cssText, _cssColonHostContextRe, this._colonHostContextPartReplacer);
    }
    /**
     * @param {?} cssText
     * @param {?} regExp
     * @param {?} partReplacer
     * @return {?}
     */
    _convertColonRule(cssText, regExp, partReplacer) {
        // m[1] = :host(-context), m[2] = contents of (), m[3] rest of rule
        return cssText.replace(regExp, function (...m) {
            if (m[2]) {
                const /** @type {?} */ parts = m[2].split(',');
                const /** @type {?} */ r = [];
                for (let /** @type {?} */ i = 0; i < parts.length; i++) {
                    const /** @type {?} */ p = parts[i].trim();
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
    }
    /**
     * @param {?} host
     * @param {?} part
     * @param {?} suffix
     * @return {?}
     */
    _colonHostContextPartReplacer(host, part, suffix) {
        if (part.indexOf(_polyfillHost) > -1) {
            return this._colonHostPartReplacer(host, part, suffix);
        }
        else {
            return host + part + suffix + ', ' + part + ' ' + host + suffix;
        }
    }
    /**
     * @param {?} host
     * @param {?} part
     * @param {?} suffix
     * @return {?}
     */
    _colonHostPartReplacer(host, part, suffix) {
        return host + part.replace(_polyfillHost, '') + suffix;
    }
    /**
     * @param {?} cssText
     * @return {?}
     */
    _convertShadowDOMSelectors(cssText) {
        return _shadowDOMSelectorsRe.reduce((result, pattern) => result.replace(pattern, ' '), cssText);
    }
    /**
     * @param {?} cssText
     * @param {?} scopeSelector
     * @param {?} hostSelector
     * @return {?}
     */
    _scopeSelectors(cssText, scopeSelector, hostSelector) {
        return processRules(cssText, (rule) => {
            let /** @type {?} */ selector = rule.selector;
            let /** @type {?} */ content = rule.content;
            if (rule.selector[0] != '@') {
                selector =
                    this._scopeSelector(rule.selector, scopeSelector, hostSelector, this.strictStyling);
            }
            else if (rule.selector.startsWith('@media') || rule.selector.startsWith('@supports') ||
                rule.selector.startsWith('@page') || rule.selector.startsWith('@document')) {
                content = this._scopeSelectors(rule.content, scopeSelector, hostSelector);
            }
            return new CssRule(selector, content);
        });
    }
    /**
     * @param {?} selector
     * @param {?} scopeSelector
     * @param {?} hostSelector
     * @param {?} strict
     * @return {?}
     */
    _scopeSelector(selector, scopeSelector, hostSelector, strict) {
        return selector.split(',')
            .map(part => part.trim().split(_shadowDeepSelectors))
            .map((deepParts) => {
            const [shallowPart, ...otherParts] = deepParts;
            const /** @type {?} */ applyScope = (shallowPart) => {
                if (this._selectorNeedsScoping(shallowPart, scopeSelector)) {
                    return strict ?
                        this._applyStrictSelectorScope(shallowPart, scopeSelector, hostSelector) :
                        this._applySelectorScope(shallowPart, scopeSelector, hostSelector);
                }
                else {
                    return shallowPart;
                }
            };
            return [applyScope(shallowPart), ...otherParts].join(' ');
        })
            .join(', ');
    }
    /**
     * @param {?} selector
     * @param {?} scopeSelector
     * @return {?}
     */
    _selectorNeedsScoping(selector, scopeSelector) {
        const /** @type {?} */ re = this._makeScopeMatcher(scopeSelector);
        return !re.test(selector);
    }
    /**
     * @param {?} scopeSelector
     * @return {?}
     */
    _makeScopeMatcher(scopeSelector) {
        const /** @type {?} */ lre = /\[/g;
        const /** @type {?} */ rre = /\]/g;
        scopeSelector = scopeSelector.replace(lre, '\\[').replace(rre, '\\]');
        return new RegExp('^(' + scopeSelector + ')' + _selectorReSuffix, 'm');
    }
    /**
     * @param {?} selector
     * @param {?} scopeSelector
     * @param {?} hostSelector
     * @return {?}
     */
    _applySelectorScope(selector, scopeSelector, hostSelector) {
        // Difference from webcomponents.js: scopeSelector could not be an array
        return this._applySimpleSelectorScope(selector, scopeSelector, hostSelector);
    }
    /**
     * @param {?} selector
     * @param {?} scopeSelector
     * @param {?} hostSelector
     * @return {?}
     */
    _applySimpleSelectorScope(selector, scopeSelector, hostSelector) {
        // In Android browser, the lastIndex is not reset when the regex is used in String.replace()
        _polyfillHostRe.lastIndex = 0;
        if (_polyfillHostRe.test(selector)) {
            const /** @type {?} */ replaceBy = this.strictStyling ? `[${hostSelector}]` : scopeSelector;
            return selector
                .replace(_polyfillHostNoCombinatorRe, (hnc, selector) => {
                return selector.replace(/([^:]*)(:*)(.*)/, (_, before, colon, after) => {
                    return before + replaceBy + colon + after;
                });
            })
                .replace(_polyfillHostRe, replaceBy + ' ');
        }
        return scopeSelector + ' ' + selector;
    }
    /**
     * @param {?} selector
     * @param {?} scopeSelector
     * @param {?} hostSelector
     * @return {?}
     */
    _applyStrictSelectorScope(selector, scopeSelector, hostSelector) {
        const /** @type {?} */ isRe = /\[is=([^\]]*)\]/g;
        scopeSelector = scopeSelector.replace(isRe, (_, ...parts) => parts[0]);
        const /** @type {?} */ attrName = '[' + scopeSelector + ']';
        const /** @type {?} */ _scopeSelectorPart = (p) => {
            let /** @type {?} */ scopedP = p.trim();
            if (!scopedP) {
                return '';
            }
            if (p.indexOf(_polyfillHostNoCombinator) > -1) {
                scopedP = this._applySimpleSelectorScope(p, scopeSelector, hostSelector);
            }
            else {
                // remove :host since it should be unnecessary
                const /** @type {?} */ t = p.replace(_polyfillHostRe, '');
                if (t.length > 0) {
                    const /** @type {?} */ matches = t.match(/([^:]*)(:*)(.*)/);
                    if (matches) {
                        scopedP = matches[1] + attrName + matches[2] + matches[3];
                    }
                }
            }
            return scopedP;
        };
        const /** @type {?} */ safeContent = new SafeSelector(selector);
        selector = safeContent.content();
        let /** @type {?} */ scopedSelector = '';
        let /** @type {?} */ startIndex = 0;
        let /** @type {?} */ res;
        const /** @type {?} */ sep = /( |>|\+|~(?!=))\s*/g;
        const /** @type {?} */ scopeAfter = selector.indexOf(_polyfillHostNoCombinator);
        while ((res = sep.exec(selector)) !== null) {
            const /** @type {?} */ separator = res[1];
            const /** @type {?} */ part = selector.slice(startIndex, res.index).trim();
            // if a selector appears before :host-context it should not be shimmed as it
            // matches on ancestor elements and not on elements in the host's shadow
            const /** @type {?} */ scopedPart = startIndex >= scopeAfter ? _scopeSelectorPart(part) : part;
            scopedSelector += `${scopedPart} ${separator} `;
            startIndex = sep.lastIndex;
        }
        scopedSelector += _scopeSelectorPart(selector.substring(startIndex));
        // replace the placeholders with their original values
        return safeContent.restore(scopedSelector);
    }
    /**
     * @param {?} selector
     * @return {?}
     */
    _insertPolyfillHostInCssText(selector) {
        return selector.replace(_colonHostContextRe, _polyfillHostContext)
            .replace(_colonHostRe, _polyfillHost);
    }
}
class SafeSelector {
    /**
     * @param {?} selector
     */
    constructor(selector) {
        this.placeholders = [];
        this.index = 0;
        // Replaces attribute selectors with placeholders.
        // The WS in [attr="va lue"] would otherwise be interpreted as a selector separator.
        selector = selector.replace(/(\[[^\]]*\])/g, (_, keep) => {
            const replaceBy = `__ph-${this.index}__`;
            this.placeholders.push(keep);
            this.index++;
            return replaceBy;
        });
        // Replaces the expression in `:nth-child(2n + 1)` with a placeholder.
        // WS and "+" would otherwise be interpreted as selector separators.
        this._content = selector.replace(/(:nth-[-\w]+)(\([^)]+\))/g, (_, pseudo, exp) => {
            const replaceBy = `__ph-${this.index}__`;
            this.placeholders.push(exp);
            this.index++;
            return pseudo + replaceBy;
        });
    }
    ;
    /**
     * @param {?} content
     * @return {?}
     */
    restore(content) {
        return content.replace(/__ph-(\d+)__/g, (ph, index) => this.placeholders[+index]);
    }
    /**
     * @return {?}
     */
    content() { return this._content; }
}
const _cssContentNextSelectorRe = /polyfill-next-selector[^}]*content:[\s]*?(['"])(.*?)\1[;\s]*}([^{]*?){/gim;
const _cssContentRuleRe = /(polyfill-rule)[^}]*(content:[\s]*(['"])(.*?)\3)[;\s]*[^}]*}/gim;
const _cssContentUnscopedRuleRe = /(polyfill-unscoped-rule)[^}]*(content:[\s]*(['"])(.*?)\3)[;\s]*[^}]*}/gim;
const _polyfillHost = '-shadowcsshost';
// note: :host-context pre-processed to -shadowcsshostcontext.
const _polyfillHostContext = '-shadowcsscontext';
const _parenSuffix = ')(?:\\((' +
    '(?:\\([^)(]*\\)|[^)(]*)+?' +
    ')\\))?([^,{]*)';
const _cssColonHostRe = new RegExp('(' + _polyfillHost + _parenSuffix, 'gim');
const _cssColonHostContextRe = new RegExp('(' + _polyfillHostContext + _parenSuffix, 'gim');
const _polyfillHostNoCombinator = _polyfillHost + '-no-combinator';
const _polyfillHostNoCombinatorRe = /-shadowcsshost-no-combinator([^\s]*)/;
const _shadowDOMSelectorsRe = [
    /::shadow/g,
    /::content/g,
    // Deprecated selectors
    /\/shadow-deep\//g,
    /\/shadow\//g,
];
const _shadowDeepSelectors = /(?:>>>)|(?:\/deep\/)/g;
const _selectorReSuffix = '([>\\s~+\[.,{:][\\s\\S]*)?$';
const _polyfillHostRe = /-shadowcsshost/gim;
const _colonHostRe = /:host/gim;
const _colonHostContextRe = /:host-context/gim;
const _commentRe = /\/\*\s*[\s\S]*?\*\//g;
/**
 * @param {?} input
 * @return {?}
 */
function stripComments(input) {
    return input.replace(_commentRe, '');
}
// all comments except inline source mapping
const _sourceMappingUrlRe = /\/\*\s*#\s*sourceMappingURL=[\s\S]+?\*\//;
/**
 * @param {?} input
 * @return {?}
 */
function extractSourceMappingUrl(input) {
    const /** @type {?} */ matcher = input.match(_sourceMappingUrlRe);
    return matcher ? matcher[0] : '';
}
const _ruleRe = /(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g;
const _curlyRe = /([{}])/g;
const OPEN_CURLY = '{';
const CLOSE_CURLY = '}';
const BLOCK_PLACEHOLDER = '%BLOCK%';
class CssRule {
    /**
     * @param {?} selector
     * @param {?} content
     */
    constructor(selector, content) {
        this.selector = selector;
        this.content = content;
    }
}
/**
 * @param {?} input
 * @param {?} ruleCallback
 * @return {?}
 */
function processRules(input, ruleCallback) {
    const /** @type {?} */ inputWithEscapedBlocks = escapeBlocks(input);
    let /** @type {?} */ nextBlockIndex = 0;
    return inputWithEscapedBlocks.escapedString.replace(_ruleRe, function (...m) {
        const /** @type {?} */ selector = m[2];
        let /** @type {?} */ content = '';
        let /** @type {?} */ suffix = m[4];
        let /** @type {?} */ contentPrefix = '';
        if (suffix && suffix.startsWith('{' + BLOCK_PLACEHOLDER)) {
            content = inputWithEscapedBlocks.blocks[nextBlockIndex++];
            suffix = suffix.substring(BLOCK_PLACEHOLDER.length + 1);
            contentPrefix = '{';
        }
        const /** @type {?} */ rule = ruleCallback(new CssRule(selector, content));
        return `${m[1]}${rule.selector}${m[3]}${contentPrefix}${rule.content}${suffix}`;
    });
}
class StringWithEscapedBlocks {
    /**
     * @param {?} escapedString
     * @param {?} blocks
     */
    constructor(escapedString, blocks) {
        this.escapedString = escapedString;
        this.blocks = blocks;
    }
}
/**
 * @param {?} input
 * @return {?}
 */
function escapeBlocks(input) {
    const /** @type {?} */ inputParts = input.split(_curlyRe);
    const /** @type {?} */ resultParts = [];
    const /** @type {?} */ escapedBlocks = [];
    let /** @type {?} */ bracketCount = 0;
    let /** @type {?} */ currentBlockParts = [];
    for (let /** @type {?} */ partIndex = 0; partIndex < inputParts.length; partIndex++) {
        const /** @type {?} */ part = inputParts[partIndex];
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
const COMPONENT_VARIABLE = '%COMP%';
const HOST_ATTR = `_nghost-${COMPONENT_VARIABLE}`;
const CONTENT_ATTR = `_ngcontent-${COMPONENT_VARIABLE}`;
class StylesCompileDependency {
    /**
     * @param {?} name
     * @param {?} moduleUrl
     * @param {?} isShimmed
     * @param {?} valuePlaceholder
     */
    constructor(name, moduleUrl, isShimmed, valuePlaceholder) {
        this.name = name;
        this.moduleUrl = moduleUrl;
        this.isShimmed = isShimmed;
        this.valuePlaceholder = valuePlaceholder;
    }
}
class StylesCompileResult {
    /**
     * @param {?} componentStylesheet
     * @param {?} externalStylesheets
     */
    constructor(componentStylesheet, externalStylesheets) {
        this.componentStylesheet = componentStylesheet;
        this.externalStylesheets = externalStylesheets;
    }
}
class CompiledStylesheet {
    /**
     * @param {?} statements
     * @param {?} stylesVar
     * @param {?} dependencies
     * @param {?} isShimmed
     * @param {?} meta
     */
    constructor(statements, stylesVar, dependencies, isShimmed, meta) {
        this.statements = statements;
        this.stylesVar = stylesVar;
        this.dependencies = dependencies;
        this.isShimmed = isShimmed;
        this.meta = meta;
    }
}
class StyleCompiler {
    /**
     * @param {?} _urlResolver
     */
    constructor(_urlResolver) {
        this._urlResolver = _urlResolver;
        this._shadowCss = new ShadowCss();
    }
    /**
     * @param {?} comp
     * @return {?}
     */
    compileComponent(comp) {
        const /** @type {?} */ template = ((comp.template));
        const /** @type {?} */ externalStylesheets = [];
        const /** @type {?} */ componentStylesheet = this._compileStyles(comp, new CompileStylesheetMetadata({
            styles: template.styles,
            styleUrls: template.styleUrls,
            moduleUrl: identifierModuleUrl(comp.type)
        }), true);
        template.externalStylesheets.forEach((stylesheetMeta) => {
            const /** @type {?} */ compiledStylesheet = this._compileStyles(comp, stylesheetMeta, false);
            externalStylesheets.push(compiledStylesheet);
        });
        return new StylesCompileResult(componentStylesheet, externalStylesheets);
    }
    /**
     * @param {?} comp
     * @param {?} stylesheet
     * @param {?} isComponentStylesheet
     * @return {?}
     */
    _compileStyles(comp, stylesheet, isComponentStylesheet) {
        const /** @type {?} */ shim = ((comp.template)).encapsulation === ViewEncapsulation.Emulated;
        const /** @type {?} */ styleExpressions = stylesheet.styles.map(plainStyle => literal(this._shimIfNeeded(plainStyle, shim)));
        const /** @type {?} */ dependencies = [];
        for (let /** @type {?} */ i = 0; i < stylesheet.styleUrls.length; i++) {
            const /** @type {?} */ identifier = { reference: null };
            dependencies.push(new StylesCompileDependency(getStylesVarName(null), stylesheet.styleUrls[i], shim, identifier));
            styleExpressions.push(new ExternalExpr(identifier));
        }
        // styles variable contains plain strings and arrays of other styles arrays (recursive),
        // so we set its type to dynamic.
        const /** @type {?} */ stylesVar = getStylesVarName(isComponentStylesheet ? comp : null);
        const /** @type {?} */ stmt = variable(stylesVar)
            .set(literalArr(styleExpressions, new ArrayType(DYNAMIC_TYPE, [TypeModifier.Const])))
            .toDeclStmt(null, [StmtModifier.Final]);
        return new CompiledStylesheet([stmt], stylesVar, dependencies, shim, stylesheet);
    }
    /**
     * @param {?} style
     * @param {?} shim
     * @return {?}
     */
    _shimIfNeeded(style$$1, shim) {
        return shim ? this._shadowCss.shimCssText(style$$1, CONTENT_ATTR, HOST_ATTR) : style$$1;
    }
}
StyleCompiler.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
StyleCompiler.ctorParameters = () => [
    { type: UrlResolver, },
];
/**
 * @param {?} component
 * @return {?}
 */
function getStylesVarName(component) {
    let /** @type {?} */ result = `styles`;
    if (component) {
        result += `_${identifierName(component.type)}`;
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
class EventHandlerVars {
}
EventHandlerVars.event = variable('$event');
class ConvertActionBindingResult {
    /**
     * @param {?} stmts
     * @param {?} allowDefault
     */
    constructor(stmts, allowDefault) {
        this.stmts = stmts;
        this.allowDefault = allowDefault;
    }
}
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
    const /** @type {?} */ actionWithoutBuiltins = convertPropertyBindingBuiltins({
        createLiteralArrayConverter: (argCount) => {
            // Note: no caching for literal arrays in actions.
            return (args) => literalArr(args);
        },
        createLiteralMapConverter: (keys) => {
            // Note: no caching for literal maps in actions.
            return (args) => literalMap(/** @type {?} */ (keys.map((key, i) => [key, args[i]])));
        },
        createPipeConverter: (name) => {
            throw new Error(`Illegal State: Actions are not allowed to contain pipes. Pipe: ${name}`);
        }
    }, action);
    const /** @type {?} */ visitor = new _AstToIrVisitor(localResolver, implicitReceiver, bindingId);
    const /** @type {?} */ actionStmts = [];
    flattenStatements(actionWithoutBuiltins.visit(visitor, _Mode.Statement), actionStmts);
    prependTemporaryDecls(visitor.temporaryCount, bindingId, actionStmts);
    const /** @type {?} */ lastIndex = actionStmts.length - 1;
    let /** @type {?} */ preventDefaultVar = ((null));
    if (lastIndex >= 0) {
        const /** @type {?} */ lastStatement = actionStmts[lastIndex];
        const /** @type {?} */ returnExpr = convertStmtIntoExpression(lastStatement);
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
class ConvertPropertyBindingResult {
    /**
     * @param {?} stmts
     * @param {?} currValExpr
     */
    constructor(stmts, currValExpr) {
        this.stmts = stmts;
        this.currValExpr = currValExpr;
    }
}
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
    const /** @type {?} */ currValExpr = createCurrValueExpr(bindingId);
    const /** @type {?} */ stmts = [];
    const /** @type {?} */ visitor = new _AstToIrVisitor(localResolver, implicitReceiver, bindingId);
    const /** @type {?} */ outputExpr = expressionWithoutBuiltins.visit(visitor, _Mode.Expression);
    if (visitor.temporaryCount) {
        for (let /** @type {?} */ i = 0; i < visitor.temporaryCount; i++) {
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
    const /** @type {?} */ visitor = new _BuiltinAstConverter(converterFactory);
    return ast.visit(visitor);
}
/**
 * @param {?} bindingId
 * @param {?} temporaryNumber
 * @return {?}
 */
function temporaryName(bindingId, temporaryNumber) {
    return `tmp_${bindingId}_${temporaryNumber}`;
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
    for (let /** @type {?} */ i = temporaryCount - 1; i >= 0; i--) {
        statements.unshift(temporaryDeclaration(bindingId, i));
    }
}
let _Mode = {};
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
        throw new Error(`Expected a statement, but saw ${ast}`);
    }
}
/**
 * @param {?} mode
 * @param {?} ast
 * @return {?}
 */
function ensureExpressionMode(mode, ast) {
    if (mode !== _Mode.Expression) {
        throw new Error(`Expected an expression, but saw ${ast}`);
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
class _BuiltinAstConverter extends AstTransformer {
    /**
     * @param {?} _converterFactory
     */
    constructor(_converterFactory) {
        super();
        this._converterFactory = _converterFactory;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPipe(ast, context) {
        const /** @type {?} */ args = [ast.exp, ...ast.args].map(ast => ast.visit(this, context));
        return new BuiltinFunctionCall(ast.span, args, this._converterFactory.createPipeConverter(ast.name, args.length));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralArray(ast, context) {
        const /** @type {?} */ args = ast.expressions.map(ast => ast.visit(this, context));
        return new BuiltinFunctionCall(ast.span, args, this._converterFactory.createLiteralArrayConverter(ast.expressions.length));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralMap(ast, context) {
        const /** @type {?} */ args = ast.values.map(ast => ast.visit(this, context));
        return new BuiltinFunctionCall(ast.span, args, this._converterFactory.createLiteralMapConverter(ast.keys));
    }
}
class _AstToIrVisitor {
    /**
     * @param {?} _localResolver
     * @param {?} _implicitReceiver
     * @param {?} bindingId
     */
    constructor(_localResolver, _implicitReceiver, bindingId) {
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
    visitBinary(ast, mode) {
        let /** @type {?} */ op;
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
                throw new Error(`Unsupported operation ${ast.operation}`);
        }
        return convertToStatementIfNeeded(mode, new BinaryOperatorExpr(op, this.visit(ast.left, _Mode.Expression), this.visit(ast.right, _Mode.Expression)));
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitChain(ast, mode) {
        ensureStatementMode(mode, ast);
        return this.visitAll(ast.expressions, mode);
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitConditional(ast, mode) {
        const /** @type {?} */ value = this.visit(ast.condition, _Mode.Expression);
        return convertToStatementIfNeeded(mode, value.conditional(this.visit(ast.trueExp, _Mode.Expression), this.visit(ast.falseExp, _Mode.Expression)));
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitPipe(ast, mode) {
        throw new Error(`Illegal state: Pipes should have been converted into functions. Pipe: ${ast.name}`);
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitFunctionCall(ast, mode) {
        const /** @type {?} */ convertedArgs = this.visitAll(ast.args, _Mode.Expression);
        let /** @type {?} */ fnResult;
        if (ast instanceof BuiltinFunctionCall) {
            fnResult = ast.converter(convertedArgs);
        }
        else {
            fnResult = this.visit(/** @type {?} */ ((ast.target)), _Mode.Expression).callFn(convertedArgs);
        }
        return convertToStatementIfNeeded(mode, fnResult);
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitImplicitReceiver(ast, mode) {
        ensureExpressionMode(mode, ast);
        return this._implicitReceiver;
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitInterpolation(ast, mode) {
        ensureExpressionMode(mode, ast);
        const /** @type {?} */ args = [literal(ast.expressions.length)];
        for (let /** @type {?} */ i = 0; i < ast.strings.length - 1; i++) {
            args.push(literal(ast.strings[i]));
            args.push(this.visit(ast.expressions[i], _Mode.Expression));
        }
        args.push(literal(ast.strings[ast.strings.length - 1]));
        return ast.expressions.length <= 9 ?
            importExpr(createIdentifier(Identifiers.inlineInterpolate)).callFn(args) :
            importExpr(createIdentifier(Identifiers.interpolate)).callFn([
                args[0], literalArr(args.slice(1))
            ]);
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitKeyedRead(ast, mode) {
        const /** @type {?} */ leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
            return this.convertSafeAccess(ast, leftMostSafe, mode);
        }
        else {
            return convertToStatementIfNeeded(mode, this.visit(ast.obj, _Mode.Expression).key(this.visit(ast.key, _Mode.Expression)));
        }
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitKeyedWrite(ast, mode) {
        const /** @type {?} */ obj = this.visit(ast.obj, _Mode.Expression);
        const /** @type {?} */ key = this.visit(ast.key, _Mode.Expression);
        const /** @type {?} */ value = this.visit(ast.value, _Mode.Expression);
        return convertToStatementIfNeeded(mode, obj.key(key).set(value));
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitLiteralArray(ast, mode) {
        throw new Error(`Illegal State: literal arrays should have been converted into functions`);
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitLiteralMap(ast, mode) {
        throw new Error(`Illegal State: literal maps should have been converted into functions`);
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitLiteralPrimitive(ast, mode) {
        return convertToStatementIfNeeded(mode, literal(ast.value));
    }
    /**
     * @param {?} name
     * @return {?}
     */
    _getLocal(name) { return this._localResolver.getLocal(name); }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitMethodCall(ast, mode) {
        const /** @type {?} */ leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
            return this.convertSafeAccess(ast, leftMostSafe, mode);
        }
        else {
            const /** @type {?} */ args = this.visitAll(ast.args, _Mode.Expression);
            let /** @type {?} */ result = null;
            const /** @type {?} */ receiver = this.visit(ast.receiver, _Mode.Expression);
            if (receiver === this._implicitReceiver) {
                const /** @type {?} */ varExpr = this._getLocal(ast.name);
                if (varExpr) {
                    result = varExpr.callFn(args);
                }
            }
            if (result == null) {
                result = receiver.callMethod(ast.name, args);
            }
            return convertToStatementIfNeeded(mode, result);
        }
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitPrefixNot(ast, mode) {
        return convertToStatementIfNeeded(mode, not(this.visit(ast.expression, _Mode.Expression)));
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitPropertyRead(ast, mode) {
        const /** @type {?} */ leftMostSafe = this.leftMostSafeNode(ast);
        if (leftMostSafe) {
            return this.convertSafeAccess(ast, leftMostSafe, mode);
        }
        else {
            let /** @type {?} */ result = null;
            const /** @type {?} */ receiver = this.visit(ast.receiver, _Mode.Expression);
            if (receiver === this._implicitReceiver) {
                result = this._getLocal(ast.name);
            }
            if (result == null) {
                result = receiver.prop(ast.name);
            }
            return convertToStatementIfNeeded(mode, result);
        }
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitPropertyWrite(ast, mode) {
        const /** @type {?} */ receiver = this.visit(ast.receiver, _Mode.Expression);
        if (receiver === this._implicitReceiver) {
            const /** @type {?} */ varExpr = this._getLocal(ast.name);
            if (varExpr) {
                throw new Error('Cannot assign to a reference or variable!');
            }
        }
        return convertToStatementIfNeeded(mode, receiver.prop(ast.name).set(this.visit(ast.value, _Mode.Expression)));
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitSafePropertyRead(ast, mode) {
        return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitSafeMethodCall(ast, mode) {
        return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
    }
    /**
     * @param {?} asts
     * @param {?} mode
     * @return {?}
     */
    visitAll(asts, mode) { return asts.map(ast => this.visit(ast, mode)); }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visitQuote(ast, mode) {
        throw new Error(`Quotes are not supported for evaluation!
        Statement: ${ast.uninterpretedExpression} located at ${ast.location}`);
    }
    /**
     * @param {?} ast
     * @param {?} mode
     * @return {?}
     */
    visit(ast, mode) {
        const /** @type {?} */ result = this._resultMap.get(ast);
        if (result)
            return result;
        return (this._nodeMap.get(ast) || ast).visit(this, mode);
    }
    /**
     * @param {?} ast
     * @param {?} leftMostSafe
     * @param {?} mode
     * @return {?}
     */
    convertSafeAccess(ast, leftMostSafe, mode) {
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
        let /** @type {?} */ guardedExpression = this.visit(leftMostSafe.receiver, _Mode.Expression);
        let /** @type {?} */ temporary = ((undefined));
        if (this.needsTemporary(leftMostSafe.receiver)) {
            // If the expression has method calls or pipes then we need to save the result into a
            // temporary variable to avoid calling stateful or impure code more than once.
            temporary = this.allocateTemporary();
            // Preserve the result in the temporary variable
            guardedExpression = temporary.set(guardedExpression);
            // Ensure all further references to the guarded expression refer to the temporary instead.
            this._resultMap.set(leftMostSafe.receiver, temporary);
        }
        const /** @type {?} */ condition = guardedExpression.isBlank();
        // Convert the ast to an unguarded access to the receiver's member. The map will substitute
        // leftMostNode with its unguarded version in the call to `this.visit()`.
        if (leftMostSafe instanceof SafeMethodCall) {
            this._nodeMap.set(leftMostSafe, new MethodCall(leftMostSafe.span, leftMostSafe.receiver, leftMostSafe.name, leftMostSafe.args));
        }
        else {
            this._nodeMap.set(leftMostSafe, new PropertyRead(leftMostSafe.span, leftMostSafe.receiver, leftMostSafe.name));
        }
        // Recursively convert the node now without the guarded member access.
        const /** @type {?} */ access = this.visit(ast, _Mode.Expression);
        // Remove the mapping. This is not strictly required as the converter only traverses each node
        // once but is safer if the conversion is changed to traverse the nodes more than once.
        this._nodeMap.delete(leftMostSafe);
        // If we allocated a temporary, release it.
        if (temporary) {
            this.releaseTemporary(temporary);
        }
        // Produce the conditional
        return convertToStatementIfNeeded(mode, condition.conditional(literal(null), access));
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    leftMostSafeNode(ast) {
        const /** @type {?} */ visit = (visitor, ast) => {
            return (this._nodeMap.get(ast) || ast).visit(visitor);
        };
        return ast.visit({
            /**
             * @param {?} ast
             * @return {?}
             */
            visitBinary(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitChain(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitConditional(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitFunctionCall(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitImplicitReceiver(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitInterpolation(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitKeyedRead(ast) { return visit(this, ast.obj); },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitKeyedWrite(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitLiteralArray(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitLiteralMap(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitLiteralPrimitive(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitMethodCall(ast) { return visit(this, ast.receiver); },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPipe(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPrefixNot(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPropertyRead(ast) { return visit(this, ast.receiver); },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPropertyWrite(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitQuote(ast) { return null; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitSafeMethodCall(ast) { return visit(this, ast.receiver) || ast; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitSafePropertyRead(ast) {
                return visit(this, ast.receiver) || ast;
            }
        });
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    needsTemporary(ast) {
        const /** @type {?} */ visit = (visitor, ast) => {
            return ast && (this._nodeMap.get(ast) || ast).visit(visitor);
        };
        const /** @type {?} */ visitSome = (visitor, ast) => {
            return ast.some(ast => visit(visitor, ast));
        };
        return ast.visit({
            /**
             * @param {?} ast
             * @return {?}
             */
            visitBinary(ast) { return visit(this, ast.left) || visit(this, ast.right); },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitChain(ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitConditional(ast) {
                return visit(this, ast.condition) || visit(this, ast.trueExp) ||
                    visit(this, ast.falseExp);
            },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitFunctionCall(ast) { return true; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitImplicitReceiver(ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitInterpolation(ast) { return visitSome(this, ast.expressions); },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitKeyedRead(ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitKeyedWrite(ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitLiteralArray(ast) { return true; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitLiteralMap(ast) { return true; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitLiteralPrimitive(ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitMethodCall(ast) { return true; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPipe(ast) { return true; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPrefixNot(ast) { return visit(this, ast.expression); },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPropertyRead(ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitPropertyWrite(ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitQuote(ast) { return false; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitSafeMethodCall(ast) { return true; },
            /**
             * @param {?} ast
             * @return {?}
             */
            visitSafePropertyRead(ast) { return false; }
        });
    }
    /**
     * @return {?}
     */
    allocateTemporary() {
        const /** @type {?} */ tempNumber = this._currentTemporary++;
        this.temporaryCount = Math.max(this._currentTemporary, this.temporaryCount);
        return new ReadVarExpr(temporaryName(this.bindingId, tempNumber));
    }
    /**
     * @param {?} temporary
     * @return {?}
     */
    releaseTemporary(temporary) {
        this._currentTemporary--;
        if (temporary.name != temporaryName(this.bindingId, this._currentTemporary)) {
            throw new Error(`Temporary ${temporary.name} released out of order`);
        }
    }
}
/**
 * @param {?} arg
 * @param {?} output
 * @return {?}
 */
function flattenStatements(arg, output) {
    if (Array.isArray(arg)) {
        ((arg)).forEach((entry) => flattenStatements(entry, output));
    }
    else {
        output.push(arg);
    }
}
class DefaultLocalResolver {
    /**
     * @param {?} name
     * @return {?}
     */
    getLocal(name) {
        if (name === EventHandlerVars.event.name) {
            return EventHandlerVars.event;
        }
        return null;
    }
}
/**
 * @param {?} bindingId
 * @return {?}
 */
function createCurrValueExpr(bindingId) {
    return variable(`currVal_${bindingId}`); // fix syntax highlighting: `
}
/**
 * @param {?} bindingId
 * @return {?}
 */
function createPreventDefaultVar(bindingId) {
    return variable(`pd_${bindingId}`);
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
class BuiltinFunctionCall extends FunctionCall {
    /**
     * @param {?} span
     * @param {?} args
     * @param {?} converter
     */
    constructor(span, args, converter) {
        super(span, null, args);
        this.args = args;
        this.converter = converter;
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const CLASS_ATTR$1 = 'class';
const STYLE_ATTR = 'style';
const IMPLICIT_TEMPLATE_VAR = '\$implicit';
class ViewCompileResult {
    /**
     * @param {?} statements
     * @param {?} viewClassVar
     * @param {?} rendererTypeVar
     */
    constructor(statements, viewClassVar, rendererTypeVar) {
        this.statements = statements;
        this.viewClassVar = viewClassVar;
        this.rendererTypeVar = rendererTypeVar;
    }
}
class ViewCompiler {
    /**
     * @param {?} _genConfigNext
     * @param {?} _schemaRegistry
     */
    constructor(_genConfigNext, _schemaRegistry) {
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
    compileComponent(component, template, styles, usedPipes) {
        let /** @type {?} */ embeddedViewCount = 0;
        const /** @type {?} */ staticQueryIds = findStaticQueryIds(template);
        const /** @type {?} */ statements = [];
        let /** @type {?} */ renderComponentVarName = ((undefined));
        if (!component.isHost) {
            const /** @type {?} */ template = ((component.template));
            const /** @type {?} */ customRenderData = [];
            if (template.animations && template.animations.length) {
                customRenderData.push(new LiteralMapEntry('animation', convertValueToOutputAst(template.animations), true));
            }
            const /** @type {?} */ renderComponentVar = variable(rendererTypeName(component.type.reference));
            renderComponentVarName = ((renderComponentVar.name));
            statements.push(renderComponentVar
                .set(importExpr(createIdentifier(Identifiers.createRendererType2))
                .callFn([new LiteralMapExpr([
                    new LiteralMapEntry('encapsulation', literal(template.encapsulation)),
                    new LiteralMapEntry('styles', styles),
                    new LiteralMapEntry('data', new LiteralMapExpr(customRenderData))
                ])]))
                .toDeclStmt(importType(createIdentifier(Identifiers.RendererType2)), [StmtModifier.Final]));
        }
        const /** @type {?} */ viewBuilderFactory = (parent) => {
            const /** @type {?} */ embeddedViewIndex = embeddedViewCount++;
            return new ViewBuilder(parent, component, embeddedViewIndex, usedPipes, staticQueryIds, viewBuilderFactory);
        };
        const /** @type {?} */ visitor = viewBuilderFactory(null);
        visitor.visitAll([], template);
        statements.push(...visitor.build());
        return new ViewCompileResult(statements, visitor.viewName, renderComponentVarName);
    }
}
ViewCompiler.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
ViewCompiler.ctorParameters = () => [
    { type: CompilerConfig, },
    { type: ElementSchemaRegistry, },
];
const LOG_VAR = variable('l');
const VIEW_VAR = variable('v');
const CHECK_VAR = variable('ck');
const COMP_VAR = variable('co');
const EVENT_NAME_VAR = variable('en');
const ALLOW_DEFAULT_VAR = variable(`ad`);
class ViewBuilder {
    /**
     * @param {?} parent
     * @param {?} component
     * @param {?} embeddedViewIndex
     * @param {?} usedPipes
     * @param {?} staticQueryIds
     * @param {?} viewBuilderFactory
     */
    constructor(parent, component, embeddedViewIndex, usedPipes, staticQueryIds, viewBuilderFactory) {
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
    /**
     * @return {?}
     */
    get viewName() {
        return viewClassName(this.component.type.reference, this.embeddedViewIndex);
    }
    /**
     * @param {?} variables
     * @param {?} astNodes
     * @return {?}
     */
    visitAll(variables, astNodes) {
        this.variables = variables;
        // create the pipes for the pure pipes immediately, so that we know their indices.
        if (!this.parent) {
            this.usedPipes.forEach((pipe) => {
                if (pipe.pure) {
                    this.purePipeNodeIndices[pipe.name] = this._createPipe(null, pipe);
                }
            });
        }
        if (!this.parent) {
            const /** @type {?} */ queryIds = staticViewQueryIds(this.staticQueryIds);
            this.component.viewQueries.forEach((query, queryIndex) => {
                // Note: queries start with id 1 so we can use the number in a Bloom filter!
                const /** @type {?} */ queryId = queryIndex + 1;
                const /** @type {?} */ bindingType = query.first ? 0 /* First */ : 1;
                const /** @type {?} */ flags = 134217728 /* TypeViewQuery */ | calcStaticDynamicQueryFlags(queryIds, queryId, query.first);
                this.nodes.push(() => ({
                    sourceSpan: null,
                    nodeFlags: flags,
                    nodeDef: importExpr(createIdentifier(Identifiers.queryDef)).callFn([
                        literal(flags), literal(queryId),
                        new LiteralMapExpr([new LiteralMapEntry(query.propertyName, literal(bindingType))])
                    ])
                }));
            });
        }
        templateVisitAll(this, astNodes);
        if (this.parent && (astNodes.length === 0 || needsAdditionalRootNode(astNodes))) {
            // if the view is an embedded view, then we need to add an additional root node in some cases
            this.nodes.push(() => ({
                sourceSpan: null,
                nodeFlags: 1 /* TypeElement */,
                nodeDef: importExpr(createIdentifier(Identifiers.anchorDef)).callFn([
                    literal(0 /* None */), NULL_EXPR, NULL_EXPR, literal(0)
                ])
            }));
        }
    }
    /**
     * @param {?=} targetStatements
     * @return {?}
     */
    build(targetStatements = []) {
        this.children.forEach((child) => child.build(targetStatements));
        const { updateRendererStmts, updateDirectivesStmts, nodeDefExprs } = this._createNodeExpressions();
        const /** @type {?} */ updateRendererFn = this._createUpdateFn(updateRendererStmts);
        const /** @type {?} */ updateDirectivesFn = this._createUpdateFn(updateDirectivesStmts);
        let /** @type {?} */ viewFlags = 0;
        if (!this.parent && this.component.changeDetection === ChangeDetectionStrategy.OnPush) {
            viewFlags |= 2 /* OnPush */;
        }
        const /** @type {?} */ viewFactory = new DeclareFunctionStmt(this.viewName, [new FnParam(/** @type {?} */ ((LOG_VAR.name)))], [new ReturnStatement(importExpr(createIdentifier(Identifiers.viewDef)).callFn([
                literal(viewFlags),
                literalArr(nodeDefExprs),
                updateDirectivesFn,
                updateRendererFn,
            ]))], importType(createIdentifier(Identifiers.ViewDefinition)));
        targetStatements.push(viewFactory);
        return targetStatements;
    }
    /**
     * @param {?} updateStmts
     * @return {?}
     */
    _createUpdateFn(updateStmts) {
        let /** @type {?} */ updateFn;
        if (updateStmts.length > 0) {
            const /** @type {?} */ preStmts = [];
            if (!this.component.isHost && findReadVarNames(updateStmts).has(/** @type {?} */ ((COMP_VAR.name)))) {
                preStmts.push(COMP_VAR.set(VIEW_VAR.prop('component')).toDeclStmt(this.compType));
            }
            updateFn = fn([
                new FnParam(/** @type {?} */ ((CHECK_VAR.name)), INFERRED_TYPE),
                new FnParam(/** @type {?} */ ((VIEW_VAR.name)), INFERRED_TYPE)
            ], [...preStmts, ...updateStmts], INFERRED_TYPE);
        }
        else {
            updateFn = NULL_EXPR;
        }
        return updateFn;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitNgContent(ast, context) {
        // ngContentDef(ngContentIndex: number, index: number): NodeDef;
        this.nodes.push(() => ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 8 /* TypeNgContent */,
            nodeDef: importExpr(createIdentifier(Identifiers.ngContentDef)).callFn([
                literal(ast.ngContentIndex), literal(ast.index)
            ])
        }));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitText(ast, context) {
        // textDef(ngContentIndex: number, constants: string[]): NodeDef;
        this.nodes.push(() => ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 2 /* TypeText */,
            nodeDef: importExpr(createIdentifier(Identifiers.textDef)).callFn([
                literal(ast.ngContentIndex), literalArr([literal(ast.value)])
            ])
        }));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitBoundText(ast, context) {
        const /** @type {?} */ nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array
        this.nodes.push(/** @type {?} */ ((null)));
        const /** @type {?} */ astWithSource = (ast.value);
        const /** @type {?} */ inter = (astWithSource.ast);
        const /** @type {?} */ updateRendererExpressions = inter.expressions.map((expr, bindingIndex) => this._preprocessUpdateExpression({ nodeIndex, bindingIndex, sourceSpan: ast.sourceSpan, context: COMP_VAR, value: expr }));
        // textDef(ngContentIndex: number, constants: string[]): NodeDef;
        this.nodes[nodeIndex] = () => ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 2 /* TypeText */,
            nodeDef: importExpr(createIdentifier(Identifiers.textDef)).callFn([
                literal(ast.ngContentIndex), literalArr(inter.strings.map(s => literal(s)))
            ]),
            updateRenderer: updateRendererExpressions
        });
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitEmbeddedTemplate(ast, context) {
        const /** @type {?} */ nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array
        this.nodes.push(/** @type {?} */ ((null)));
        const { flags, queryMatchesExpr, hostEvents } = this._visitElementOrTemplate(nodeIndex, ast);
        const /** @type {?} */ childVisitor = this.viewBuilderFactory(this);
        this.children.push(childVisitor);
        childVisitor.visitAll(ast.variables, ast.children);
        const /** @type {?} */ childCount = this.nodes.length - nodeIndex - 1;
        // anchorDef(
        //   flags: NodeFlags, matchedQueries: [string, QueryValueType][], ngContentIndex: number,
        //   childCount: number, handleEventFn?: ElementHandleEventFn, templateFactory?:
        //   ViewDefinitionFactory): NodeDef;
        this.nodes[nodeIndex] = () => ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 1 /* TypeElement */ | flags,
            nodeDef: importExpr(createIdentifier(Identifiers.anchorDef)).callFn([
                literal(flags),
                queryMatchesExpr,
                literal(ast.ngContentIndex),
                literal(childCount),
                this._createElementHandleEventFn(nodeIndex, hostEvents),
                variable(childVisitor.viewName),
            ])
        });
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitElement(ast, context) {
        const /** @type {?} */ nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array so we can add children
        this.nodes.push(/** @type {?} */ ((null)));
        // Using a null element name creates an anchor.
        const /** @type {?} */ elName = isNgContainer(ast.name) ? null : ast.name;
        const { flags, usedEvents, queryMatchesExpr, hostBindings: dirHostBindings, hostEvents } = this._visitElementOrTemplate(nodeIndex, ast);
        let /** @type {?} */ inputDefs = [];
        let /** @type {?} */ updateRendererExpressions = [];
        let /** @type {?} */ outputDefs = [];
        if (elName) {
            const /** @type {?} */ hostBindings = ast.inputs
                .map((inputAst) => ({
                context: /** @type {?} */ (COMP_VAR),
                inputAst,
                dirAst: /** @type {?} */ (null),
            }))
                .concat(dirHostBindings);
            if (hostBindings.length) {
                updateRendererExpressions =
                    hostBindings.map((hostBinding, bindingIndex) => this._preprocessUpdateExpression({
                        context: hostBinding.context,
                        nodeIndex,
                        bindingIndex,
                        sourceSpan: hostBinding.inputAst.sourceSpan,
                        value: hostBinding.inputAst.value
                    }));
                inputDefs = hostBindings.map(hostBinding => elementBindingDef(hostBinding.inputAst, hostBinding.dirAst));
            }
            outputDefs = usedEvents.map(([target, eventName]) => literalArr([literal(target), literal(eventName)]));
        }
        templateVisitAll(this, ast.children);
        const /** @type {?} */ childCount = this.nodes.length - nodeIndex - 1;
        const /** @type {?} */ compAst = ast.directives.find(dirAst => dirAst.directive.isComponent);
        let /** @type {?} */ compRendererType = NULL_EXPR;
        let /** @type {?} */ compView = NULL_EXPR;
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
        this.nodes[nodeIndex] = () => ({
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
                this._createElementHandleEventFn(nodeIndex, hostEvents),
                compView,
                compRendererType,
            ]),
            updateRenderer: updateRendererExpressions
        });
    }
    /**
     * @param {?} nodeIndex
     * @param {?} ast
     * @return {?}
     */
    _visitElementOrTemplate(nodeIndex, ast) {
        let /** @type {?} */ flags = 0;
        if (ast.hasViewContainer) {
            flags |= 16777216 /* EmbeddedViews */;
        }
        const /** @type {?} */ usedEvents = new Map();
        ast.outputs.forEach((event) => {
            const { name, target } = elementEventNameAndTarget(event, null);
            usedEvents.set(ɵelementEventFullName(target, name), [target, name]);
        });
        ast.directives.forEach((dirAst) => {
            dirAst.hostEvents.forEach((event) => {
                const { name, target } = elementEventNameAndTarget(event, dirAst);
                usedEvents.set(ɵelementEventFullName(target, name), [target, name]);
            });
        });
        const /** @type {?} */ hostBindings = [];
        const /** @type {?} */ hostEvents = [];
        const /** @type {?} */ componentFactoryResolverProvider = createComponentFactoryResolver(ast.directives);
        if (componentFactoryResolverProvider) {
            this._visitProvider(componentFactoryResolverProvider, ast.queryMatches);
        }
        ast.providers.forEach((providerAst, providerIndex) => {
            let /** @type {?} */ dirAst = ((undefined));
            let /** @type {?} */ dirIndex = ((undefined));
            ast.directives.forEach((localDirAst, i) => {
                if (localDirAst.directive.type.reference === tokenReference(providerAst.token)) {
                    dirAst = localDirAst;
                    dirIndex = i;
                }
            });
            if (dirAst) {
                const { hostBindings: dirHostBindings, hostEvents: dirHostEvents } = this._visitDirective(providerAst, dirAst, dirIndex, nodeIndex, ast.references, ast.queryMatches, usedEvents, /** @type {?} */ ((this.staticQueryIds.get(/** @type {?} */ (ast)))));
                hostBindings.push(...dirHostBindings);
                hostEvents.push(...dirHostEvents);
            }
            else {
                this._visitProvider(providerAst, ast.queryMatches);
            }
        });
        let /** @type {?} */ queryMatchExprs = [];
        ast.queryMatches.forEach((match) => {
            let /** @type {?} */ valueType = ((undefined));
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
        ast.references.forEach((ref) => {
            let /** @type {?} */ valueType = ((undefined));
            if (!ref.value) {
                valueType = 1 /* RenderElement */;
            }
            else if (tokenReference(ref.value) === resolveIdentifier(Identifiers.TemplateRef)) {
                valueType = 2 /* TemplateRef */;
            }
            if (valueType != null) {
                this.refNodeIndices[ref.name] = nodeIndex;
                queryMatchExprs.push(literalArr([literal(ref.name), literal(valueType)]));
            }
        });
        ast.outputs.forEach((outputAst) => {
            hostEvents.push({ context: COMP_VAR, eventAst: outputAst, dirAst: /** @type {?} */ ((null)) });
        });
        return {
            flags,
            usedEvents: Array.from(usedEvents.values()),
            queryMatchesExpr: queryMatchExprs.length ? literalArr(queryMatchExprs) : NULL_EXPR,
            hostBindings,
            hostEvents: hostEvents
        };
    }
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
    _visitDirective(providerAst, dirAst, directiveIndex, elementNodeIndex, refs, queryMatches, usedEvents, queryIds) {
        const /** @type {?} */ nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array so we can add children
        this.nodes.push(/** @type {?} */ ((null)));
        dirAst.directive.queries.forEach((query, queryIndex) => {
            const /** @type {?} */ queryId = dirAst.contentQueryStartId + queryIndex;
            const /** @type {?} */ flags = 67108864 /* TypeContentQuery */ | calcStaticDynamicQueryFlags(queryIds, queryId, query.first);
            const /** @type {?} */ bindingType = query.first ? 0 /* First */ : 1;
            this.nodes.push(() => ({
                sourceSpan: dirAst.sourceSpan,
                nodeFlags: flags,
                nodeDef: importExpr(createIdentifier(Identifiers.queryDef)).callFn([
                    literal(flags), literal(queryId),
                    new LiteralMapExpr([new LiteralMapEntry(query.propertyName, literal(bindingType))])
                ]),
            }));
        });
        // Note: the operation below might also create new nodeDefs,
        // but we don't want them to be a child of a directive,
        // as they might be a provider/pipe on their own.
        // I.e. we only allow queries as children of directives nodes.
        const /** @type {?} */ childCount = this.nodes.length - nodeIndex - 1;
        let { flags, queryMatchExprs, providerExpr, depsExpr } = this._visitProviderOrDirective(providerAst, queryMatches);
        refs.forEach((ref) => {
            if (ref.value && tokenReference(ref.value) === tokenReference(providerAst.token)) {
                this.refNodeIndices[ref.name] = nodeIndex;
                queryMatchExprs.push(literalArr([literal(ref.name), literal(4 /* Provider */)]));
            }
        });
        if (dirAst.directive.isComponent) {
            flags |= 32768 /* Component */;
        }
        const /** @type {?} */ inputDefs = dirAst.inputs.map((inputAst, inputIndex) => {
            const /** @type {?} */ mapValue = literalArr([literal(inputIndex), literal(inputAst.directiveName)]);
            // Note: it's important to not quote the key so that we can capture renames by minifiers!
            return new LiteralMapEntry(inputAst.directiveName, mapValue, false);
        });
        const /** @type {?} */ outputDefs = [];
        const /** @type {?} */ dirMeta = dirAst.directive;
        Object.keys(dirMeta.outputs).forEach((propName) => {
            const /** @type {?} */ eventName = dirMeta.outputs[propName];
            if (usedEvents.has(eventName)) {
                // Note: it's important to not quote the key so that we can capture renames by minifiers!
                outputDefs.push(new LiteralMapEntry(propName, literal(eventName), false));
            }
        });
        let /** @type {?} */ updateDirectiveExpressions = [];
        if (dirAst.inputs.length || (flags & (262144 /* DoCheck */ | 65536 /* OnInit */)) > 0) {
            updateDirectiveExpressions =
                dirAst.inputs.map((input, bindingIndex) => this._preprocessUpdateExpression({
                    nodeIndex,
                    bindingIndex,
                    sourceSpan: input.sourceSpan,
                    context: COMP_VAR,
                    value: input.value
                }));
        }
        const /** @type {?} */ dirContextExpr = importExpr(createIdentifier(Identifiers.nodeValue)).callFn([
            VIEW_VAR, literal(nodeIndex)
        ]);
        const /** @type {?} */ hostBindings = dirAst.hostProperties.map((inputAst) => ({
            context: dirContextExpr,
            dirAst,
            inputAst,
        }));
        const /** @type {?} */ hostEvents = dirAst.hostEvents.map((hostEventAst) => ({
            context: dirContextExpr,
            eventAst: hostEventAst, dirAst,
        }));
        // directiveDef(
        //   flags: NodeFlags, matchedQueries: [string, QueryValueType][], childCount: number, ctor:
        //   any,
        //   deps: ([DepFlags, any] | any)[], props?: {[name: string]: [number, string]},
        //   outputs?: {[name: string]: string}, component?: () => ViewDefinition): NodeDef;
        this.nodes[nodeIndex] = () => ({
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
        });
        return { hostBindings, hostEvents };
    }
    /**
     * @param {?} providerAst
     * @param {?} queryMatches
     * @return {?}
     */
    _visitProvider(providerAst, queryMatches) {
        const /** @type {?} */ nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array so we can add children
        this.nodes.push(/** @type {?} */ ((null)));
        const { flags, queryMatchExprs, providerExpr, depsExpr } = this._visitProviderOrDirective(providerAst, queryMatches);
        // providerDef(
        //   flags: NodeFlags, matchedQueries: [string, QueryValueType][], token:any,
        //   value: any, deps: ([DepFlags, any] | any)[]): NodeDef;
        this.nodes[nodeIndex] = () => ({
            sourceSpan: providerAst.sourceSpan,
            nodeFlags: flags,
            nodeDef: importExpr(createIdentifier(Identifiers.providerDef)).callFn([
                literal(flags), queryMatchExprs.length ? literalArr(queryMatchExprs) : NULL_EXPR,
                tokenExpr(providerAst.token), providerExpr, depsExpr
            ])
        });
    }
    /**
     * @param {?} providerAst
     * @param {?} queryMatches
     * @return {?}
     */
    _visitProviderOrDirective(providerAst, queryMatches) {
        let /** @type {?} */ flags = 0;
        if (!providerAst.eager) {
            flags |= 4096 /* LazyProvider */;
        }
        if (providerAst.providerType === ProviderAstType.PrivateService) {
            flags |= 8192 /* PrivateProvider */;
        }
        providerAst.lifecycleHooks.forEach((lifecycleHook) => {
            // for regular providers, we only support ngOnDestroy
            if (lifecycleHook === ɵLifecycleHooks.OnDestroy ||
                providerAst.providerType === ProviderAstType.Directive ||
                providerAst.providerType === ProviderAstType.Component) {
                flags |= lifecycleHookToNodeFlag(lifecycleHook);
            }
        });
        let /** @type {?} */ queryMatchExprs = [];
        queryMatches.forEach((match) => {
            if (tokenReference(match.value) === tokenReference(providerAst.token)) {
                queryMatchExprs.push(literalArr([literal(match.queryId), literal(4 /* Provider */)]));
            }
        });
        const { providerExpr, depsExpr, flags: providerType } = providerDef(providerAst);
        return { flags: flags | providerType, queryMatchExprs, providerExpr, depsExpr };
    }
    /**
     * @param {?} name
     * @return {?}
     */
    getLocal(name) {
        if (name == EventHandlerVars.event.name) {
            return EventHandlerVars.event;
        }
        let /** @type {?} */ currViewExpr = VIEW_VAR;
        for (let /** @type {?} */ currBuilder = this; currBuilder; currBuilder = currBuilder.parent,
            currViewExpr = currViewExpr.prop('parent').cast(DYNAMIC_TYPE)) {
            // check references
            const /** @type {?} */ refNodeIndex = currBuilder.refNodeIndices[name];
            if (refNodeIndex != null) {
                return importExpr(createIdentifier(Identifiers.nodeValue)).callFn([
                    currViewExpr, literal(refNodeIndex)
                ]);
            }
            // check variables
            const /** @type {?} */ varAst = currBuilder.variables.find((varAst) => varAst.name === name);
            if (varAst) {
                const /** @type {?} */ varValue = varAst.value || IMPLICIT_TEMPLATE_VAR;
                return currViewExpr.prop('context').prop(varValue);
            }
        }
        return null;
    }
    /**
     * @param {?} sourceSpan
     * @param {?} argCount
     * @return {?}
     */
    createLiteralArrayConverter(sourceSpan, argCount) {
        if (argCount === 0) {
            const /** @type {?} */ valueExpr = importExpr(createIdentifier(Identifiers.EMPTY_ARRAY));
            return () => valueExpr;
        }
        const /** @type {?} */ nodeIndex = this.nodes.length;
        // pureArrayDef(argCount: number): NodeDef;
        this.nodes.push(() => ({
            sourceSpan,
            nodeFlags: 32 /* TypePureArray */,
            nodeDef: importExpr(createIdentifier(Identifiers.pureArrayDef)).callFn([literal(argCount)])
        }));
        return (args) => callCheckStmt(nodeIndex, args);
    }
    /**
     * @param {?} sourceSpan
     * @param {?} keys
     * @return {?}
     */
    createLiteralMapConverter(sourceSpan, keys) {
        if (keys.length === 0) {
            const /** @type {?} */ valueExpr = importExpr(createIdentifier(Identifiers.EMPTY_MAP));
            return () => valueExpr;
        }
        const /** @type {?} */ nodeIndex = this.nodes.length;
        // function pureObjectDef(propertyNames: string[]): NodeDef
        this.nodes.push(() => ({
            sourceSpan,
            nodeFlags: 64 /* TypePureObject */,
            nodeDef: importExpr(createIdentifier(Identifiers.pureObjectDef))
                .callFn([literalArr(keys.map(key => literal(key)))])
        }));
        return (args) => callCheckStmt(nodeIndex, args);
    }
    /**
     * @param {?} expression
     * @param {?} name
     * @param {?} argCount
     * @return {?}
     */
    createPipeConverter(expression, name, argCount) {
        const /** @type {?} */ pipe = ((this.usedPipes.find((pipeSummary) => pipeSummary.name === name)));
        if (pipe.pure) {
            const /** @type {?} */ nodeIndex = this.nodes.length;
            // function purePipeDef(argCount: number): NodeDef;
            this.nodes.push(() => ({
                sourceSpan: expression.sourceSpan,
                nodeFlags: 128 /* TypePurePipe */,
                nodeDef: importExpr(createIdentifier(Identifiers.purePipeDef))
                    .callFn([literal(argCount)])
            }));
            // find underlying pipe in the component view
            let /** @type {?} */ compViewExpr = VIEW_VAR;
            let /** @type {?} */ compBuilder = this;
            while (compBuilder.parent) {
                compBuilder = compBuilder.parent;
                compViewExpr = compViewExpr.prop('parent').cast(DYNAMIC_TYPE);
            }
            const /** @type {?} */ pipeNodeIndex = compBuilder.purePipeNodeIndices[name];
            const /** @type {?} */ pipeValueExpr = importExpr(createIdentifier(Identifiers.nodeValue)).callFn([
                compViewExpr, literal(pipeNodeIndex)
            ]);
            return (args) => callUnwrapValue(expression.nodeIndex, expression.bindingIndex, callCheckStmt(nodeIndex, [pipeValueExpr].concat(args)));
        }
        else {
            const /** @type {?} */ nodeIndex = this._createPipe(expression.sourceSpan, pipe);
            const /** @type {?} */ nodeValueExpr = importExpr(createIdentifier(Identifiers.nodeValue)).callFn([
                VIEW_VAR, literal(nodeIndex)
            ]);
            return (args) => callUnwrapValue(expression.nodeIndex, expression.bindingIndex, nodeValueExpr.callMethod('transform', args));
        }
    }
    /**
     * @param {?} sourceSpan
     * @param {?} pipe
     * @return {?}
     */
    _createPipe(sourceSpan, pipe) {
        const /** @type {?} */ nodeIndex = this.nodes.length;
        let /** @type {?} */ flags = 0;
        pipe.type.lifecycleHooks.forEach((lifecycleHook) => {
            // for pipes, we only support ngOnDestroy
            if (lifecycleHook === ɵLifecycleHooks.OnDestroy) {
                flags |= lifecycleHookToNodeFlag(lifecycleHook);
            }
        });
        const /** @type {?} */ depExprs = pipe.type.diDeps.map(depDef);
        // function pipeDef(
        //   flags: NodeFlags, ctor: any, deps: ([DepFlags, any] | any)[]): NodeDef
        this.nodes.push(() => ({
            sourceSpan,
            nodeFlags: 16 /* TypePipe */,
            nodeDef: importExpr(createIdentifier(Identifiers.pipeDef)).callFn([
                literal(flags), importExpr(pipe.type), literalArr(depExprs)
            ])
        }));
        return nodeIndex;
    }
    /**
     * @param {?} expression
     * @return {?}
     */
    _preprocessUpdateExpression(expression) {
        return {
            nodeIndex: expression.nodeIndex,
            bindingIndex: expression.bindingIndex,
            sourceSpan: expression.sourceSpan,
            context: expression.context,
            value: convertPropertyBindingBuiltins({
                createLiteralArrayConverter: (argCount) => this.createLiteralArrayConverter(expression.sourceSpan, argCount),
                createLiteralMapConverter: (keys) => this.createLiteralMapConverter(expression.sourceSpan, keys),
                createPipeConverter: (name, argCount) => this.createPipeConverter(expression, name, argCount)
            }, expression.value)
        };
    }
    /**
     * @return {?}
     */
    _createNodeExpressions() {
        const /** @type {?} */ self = this;
        let /** @type {?} */ updateBindingCount = 0;
        const /** @type {?} */ updateRendererStmts = [];
        const /** @type {?} */ updateDirectivesStmts = [];
        const /** @type {?} */ nodeDefExprs = this.nodes.map((factory, nodeIndex) => {
            const { nodeDef, nodeFlags, updateDirectives, updateRenderer, sourceSpan } = factory();
            if (updateRenderer) {
                updateRendererStmts.push(...createUpdateStatements(nodeIndex, sourceSpan, updateRenderer, false));
            }
            if (updateDirectives) {
                updateDirectivesStmts.push(...createUpdateStatements(nodeIndex, sourceSpan, updateDirectives, (nodeFlags & (262144 /* DoCheck */ | 65536 /* OnInit */)) > 0));
            }
            // We use a comma expression to call the log function before
            // the nodeDef function, but still use the result of the nodeDef function
            // as the value.
            // Note: We only add the logger to elements / text nodes,
            // so we don't generate too much code.
            const /** @type {?} */ logWithNodeDef = nodeFlags & 3 /* CatRenderNode */ ?
                new CommaExpr([LOG_VAR.callFn([]).callFn([]), nodeDef]) :
                nodeDef;
            return applySourceSpanToExpressionIfNeeded(logWithNodeDef, sourceSpan);
        });
        return { updateRendererStmts, updateDirectivesStmts, nodeDefExprs };
        /**
         * @param {?} nodeIndex
         * @param {?} sourceSpan
         * @param {?} expressions
         * @param {?} allowEmptyExprs
         * @return {?}
         */
        function createUpdateStatements(nodeIndex, sourceSpan, expressions, allowEmptyExprs) {
            const /** @type {?} */ updateStmts = [];
            const /** @type {?} */ exprs = expressions.map(({ sourceSpan, context, value }) => {
                const /** @type {?} */ bindingId = `${updateBindingCount++}`;
                const /** @type {?} */ nameResolver = context === COMP_VAR ? self : null;
                const { stmts, currValExpr } = convertPropertyBinding(nameResolver, context, value, bindingId);
                updateStmts.push(...stmts.map((stmt) => applySourceSpanToStatementIfNeeded(stmt, sourceSpan)));
                return applySourceSpanToExpressionIfNeeded(currValExpr, sourceSpan);
            });
            if (expressions.length || allowEmptyExprs) {
                updateStmts.push(applySourceSpanToStatementIfNeeded(callCheckStmt(nodeIndex, exprs).toStmt(), sourceSpan));
            }
            return updateStmts;
        }
    }
    /**
     * @param {?} nodeIndex
     * @param {?} handlers
     * @return {?}
     */
    _createElementHandleEventFn(nodeIndex, handlers) {
        const /** @type {?} */ handleEventStmts = [];
        let /** @type {?} */ handleEventBindingCount = 0;
        handlers.forEach(({ context, eventAst, dirAst }) => {
            const /** @type {?} */ bindingId = `${handleEventBindingCount++}`;
            const /** @type {?} */ nameResolver = context === COMP_VAR ? this : null;
            const { stmts, allowDefault } = convertActionBinding(nameResolver, context, eventAst.handler, bindingId);
            const /** @type {?} */ trueStmts = stmts;
            if (allowDefault) {
                trueStmts.push(ALLOW_DEFAULT_VAR.set(allowDefault.and(ALLOW_DEFAULT_VAR)).toStmt());
            }
            const { target: eventTarget, name: eventName } = elementEventNameAndTarget(eventAst, dirAst);
            const /** @type {?} */ fullEventName = ɵelementEventFullName(eventTarget, eventName);
            handleEventStmts.push(applySourceSpanToStatementIfNeeded(new IfStmt(literal(fullEventName).identical(EVENT_NAME_VAR), trueStmts), eventAst.sourceSpan));
        });
        let /** @type {?} */ handleEventFn;
        if (handleEventStmts.length > 0) {
            const /** @type {?} */ preStmts = [ALLOW_DEFAULT_VAR.set(literal(true)).toDeclStmt(BOOL_TYPE)];
            if (!this.component.isHost && findReadVarNames(handleEventStmts).has(/** @type {?} */ ((COMP_VAR.name)))) {
                preStmts.push(COMP_VAR.set(VIEW_VAR.prop('component')).toDeclStmt(this.compType));
            }
            handleEventFn = fn([
                new FnParam(/** @type {?} */ ((VIEW_VAR.name)), INFERRED_TYPE),
                new FnParam(/** @type {?} */ ((EVENT_NAME_VAR.name)), INFERRED_TYPE),
                new FnParam(/** @type {?} */ ((EventHandlerVars.event.name)), INFERRED_TYPE)
            ], [...preStmts, ...handleEventStmts, new ReturnStatement(ALLOW_DEFAULT_VAR)], INFERRED_TYPE);
        }
        else {
            handleEventFn = NULL_EXPR;
        }
        return handleEventFn;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitDirective(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitDirectiveProperty(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitReference(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitVariable(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitEvent(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitElementProperty(ast, context) { }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitAttr(ast, context) { }
}
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
    const /** @type {?} */ allDepDefs = [];
    const /** @type {?} */ allParams = [];
    const /** @type {?} */ exprs = providers.map((provider, providerIndex) => {
        let /** @type {?} */ expr;
        if (provider.useClass) {
            const /** @type {?} */ depExprs = convertDeps(providerIndex, provider.deps || provider.useClass.diDeps);
            expr = importExpr(provider.useClass).instantiate(depExprs);
        }
        else if (provider.useFactory) {
            const /** @type {?} */ depExprs = convertDeps(providerIndex, provider.deps || provider.useFactory.diDeps);
            expr = importExpr(provider.useFactory).callFn(depExprs);
        }
        else if (provider.useExisting) {
            const /** @type {?} */ depExprs = convertDeps(providerIndex, [{ token: provider.useExisting }]);
            expr = depExprs[0];
        }
        else {
            expr = convertValueToOutputAst(provider.useValue);
        }
        return expr;
    });
    const /** @type {?} */ providerExpr = fn(allParams, [new ReturnStatement(literalArr(exprs))], INFERRED_TYPE);
    return { providerExpr, flags: 1024 /* TypeFactoryProvider */, depsExpr: literalArr(allDepDefs) };
    /**
     * @param {?} providerIndex
     * @param {?} deps
     * @return {?}
     */
    function convertDeps(providerIndex, deps) {
        return deps.map((dep, depIndex) => {
            const /** @type {?} */ paramName = `p${providerIndex}_${depIndex}`;
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
    let /** @type {?} */ providerExpr;
    let /** @type {?} */ flags;
    let /** @type {?} */ deps;
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
    const /** @type {?} */ depsExpr = literalArr(deps.map(dep => depDef(dep)));
    return { providerExpr, flags, depsExpr };
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
    const /** @type {?} */ expr = dep.isValue ? convertValueToOutputAst(dep.value) : tokenExpr(/** @type {?} */ ((dep.token)));
    let /** @type {?} */ flags = 0;
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
    const /** @type {?} */ lastAstNode = astNodes[astNodes.length - 1];
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
    let /** @type {?} */ nodeFlag = 0;
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
            const /** @type {?} */ bindingType = 8 /* TypeProperty */ |
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
    const /** @type {?} */ mapResult = Object.create(null);
    elementAst.attrs.forEach(attrAst => { mapResult[attrAst.name] = attrAst.value; });
    elementAst.directives.forEach(dirAst => {
        Object.keys(dirAst.directive.hostAttributes).forEach(name => {
            const /** @type {?} */ value = dirAst.directive.hostAttributes[name];
            const /** @type {?} */ prevValue = mapResult[name];
            mapResult[name] = prevValue != null ? mergeAttributeValue(name, prevValue, value) : value;
        });
    });
    // Note: We need to sort to get a defined output order
    // for tests and for caching generated artifacts...
    return literalArr(Object.keys(mapResult).sort().map((attrName) => literalArr([literal(attrName), literal(mapResult[attrName])])));
}
/**
 * @param {?} attrName
 * @param {?} attrValue1
 * @param {?} attrValue2
 * @return {?}
 */
function mergeAttributeValue(attrName, attrValue1, attrValue2) {
    if (attrName == CLASS_ATTR$1 || attrName == STYLE_ATTR) {
        return `${attrValue1} ${attrValue2}`;
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
        return CHECK_VAR.callFn([VIEW_VAR, literal(nodeIndex), literal(0 /* Inline */), ...exprs]);
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
function findStaticQueryIds(nodes, result = new Map()) {
    nodes.forEach((node) => {
        const /** @type {?} */ staticQueryIds = new Set();
        const /** @type {?} */ dynamicQueryIds = new Set();
        let /** @type {?} */ queryMatches = ((undefined));
        if (node instanceof ElementAst) {
            findStaticQueryIds(node.children, result);
            node.children.forEach((child) => {
                const /** @type {?} */ childData = ((result.get(child)));
                childData.staticQueryIds.forEach(queryId => staticQueryIds.add(queryId));
                childData.dynamicQueryIds.forEach(queryId => dynamicQueryIds.add(queryId));
            });
            queryMatches = node.queryMatches;
        }
        else if (node instanceof EmbeddedTemplateAst) {
            findStaticQueryIds(node.children, result);
            node.children.forEach((child) => {
                const /** @type {?} */ childData = ((result.get(child)));
                childData.staticQueryIds.forEach(queryId => dynamicQueryIds.add(queryId));
                childData.dynamicQueryIds.forEach(queryId => dynamicQueryIds.add(queryId));
            });
            queryMatches = node.queryMatches;
        }
        if (queryMatches) {
            queryMatches.forEach((match) => staticQueryIds.add(match.queryId));
        }
        dynamicQueryIds.forEach(queryId => staticQueryIds.delete(queryId));
        result.set(node, { staticQueryIds, dynamicQueryIds });
    });
    return result;
}
/**
 * @param {?} nodeStaticQueryIds
 * @return {?}
 */
function staticViewQueryIds(nodeStaticQueryIds) {
    const /** @type {?} */ staticQueryIds = new Set();
    const /** @type {?} */ dynamicQueryIds = new Set();
    Array.from(nodeStaticQueryIds.values()).forEach((entry) => {
        entry.staticQueryIds.forEach(queryId => staticQueryIds.add(queryId));
        entry.dynamicQueryIds.forEach(queryId => dynamicQueryIds.add(queryId));
    });
    dynamicQueryIds.forEach(queryId => staticQueryIds.delete(queryId));
    return { staticQueryIds, dynamicQueryIds };
}
/**
 * @param {?} directives
 * @return {?}
 */
function createComponentFactoryResolver(directives) {
    const /** @type {?} */ componentDirMeta = directives.find(dirAst => dirAst.directive.isComponent);
    if (componentDirMeta && componentDirMeta.directive.entryComponents.length) {
        const /** @type {?} */ entryComponentFactories = componentDirMeta.directive.entryComponents.map((entryComponent) => importExpr({ reference: entryComponent.componentFactory }));
        const /** @type {?} */ token = createIdentifierToken(Identifiers.ComponentFactoryResolver);
        const /** @type {?} */ classMeta = {
            diDeps: [
                { isValue: true, value: literalArr(entryComponentFactories) },
                { token: token, isSkipSelf: true, isOptional: true },
                { token: createIdentifierToken(Identifiers.NgModuleRef) },
            ],
            lifecycleHooks: [],
            reference: resolveIdentifier(Identifiers.CodegenComponentFactoryResolver)
        };
        return new ProviderAst(token, false, true, [{ token, multi: false, useClass: classMeta }], ProviderAstType.PrivateService, [], componentDirMeta.sourceSpan);
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
            name: `@${eventAst.name}.${eventAst.phase}`,
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
    let /** @type {?} */ flags = 0;
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
class GeneratedFile {
    /**
     * @param {?} srcFileUrl
     * @param {?} genFileUrl
     * @param {?} source
     */
    constructor(srcFileUrl, genFileUrl, source) {
        this.srcFileUrl = srcFileUrl;
        this.genFileUrl = genFileUrl;
        this.source = source;
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
 * @param {?} summaryResolver
 * @param {?} symbolResolver
 * @param {?} symbols
 * @param {?} types
 * @return {?}
 */
function serializeSummaries(summaryResolver, symbolResolver, symbols, types) {
    const /** @type {?} */ serializer = new Serializer$1(symbolResolver, summaryResolver);
    // for symbols, we use everything except for the class metadata itself
    // (we keep the statics though), as the class metadata is contained in the
    // CompileTypeSummary.
    symbols.forEach((resolvedSymbol) => serializer.addOrMergeSummary({ symbol: resolvedSymbol.symbol, metadata: resolvedSymbol.metadata }));
    // Add summaries that are referenced by the given symbols (transitively)
    // Note: the serializer.symbols array might be growing while
    // we execute the loop!
    for (let /** @type {?} */ processedIndex = 0; processedIndex < serializer.symbols.length; processedIndex++) {
        const /** @type {?} */ symbol = serializer.symbols[processedIndex];
        if (summaryResolver.isLibraryFile(symbol.filePath)) {
            let /** @type {?} */ summary = summaryResolver.resolveSummary(symbol);
            if (!summary) {
                // some symbols might originate from a plain typescript library
                // that just exported .d.ts and .metadata.json files, i.e. where no summary
                // files were created.
                const /** @type {?} */ resolvedSymbol = symbolResolver.resolveSymbol(symbol);
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
    types.forEach((typeSummary) => {
        serializer.addOrMergeSummary({ symbol: typeSummary.type.reference, metadata: null, type: typeSummary });
        if (typeSummary.summaryKind === CompileSummaryKind.NgModule) {
            const /** @type {?} */ ngModuleSummary = (typeSummary);
            ngModuleSummary.exportedDirectives.concat(ngModuleSummary.exportedPipes).forEach((id) => {
                const /** @type {?} */ symbol = id.reference;
                if (summaryResolver.isLibraryFile(symbol.filePath)) {
                    const /** @type {?} */ summary = summaryResolver.resolveSummary(symbol);
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
    const /** @type {?} */ deserializer = new Deserializer(symbolCache);
    return deserializer.deserialize(json);
}
class Serializer$1 extends ValueTransformer {
    /**
     * @param {?} symbolResolver
     * @param {?} summaryResolver
     */
    constructor(symbolResolver, summaryResolver) {
        super();
        this.symbolResolver = symbolResolver;
        this.summaryResolver = summaryResolver;
        // Note: This only contains symbols without members.
        this.symbols = [];
        this.indexBySymbol = new Map();
        this.processedSummaryBySymbol = new Map();
        this.processedSummaries = [];
    }
    /**
     * @param {?} summary
     * @return {?}
     */
    addOrMergeSummary(summary) {
        let /** @type {?} */ symbolMeta = summary.metadata;
        if (symbolMeta && symbolMeta.__symbolic === 'class') {
            // For classes, we keep everything except their class decorators.
            // We need to keep e.g. the ctor args, method names, method decorators
            // so that the class can be extended in another compilation unit.
            // We don't keep the class decorators as
            // 1) they refer to data
            //   that should not cause a rebuild of downstream compilation units
            //   (e.g. inline templates of @Component, or @NgModule.declarations)
            // 2) their data is already captured in TypeSummaries, e.g. DirectiveSummary.
            const /** @type {?} */ clone = {};
            Object.keys(symbolMeta).forEach((propName) => {
                if (propName !== 'decorators') {
                    clone[propName] = symbolMeta[propName];
                }
            });
            symbolMeta = clone;
        }
        let /** @type {?} */ processedSummary = this.processedSummaryBySymbol.get(summary.symbol);
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
    }
    /**
     * @return {?}
     */
    serialize() {
        const /** @type {?} */ exportAs = [];
        const /** @type {?} */ json = JSON.stringify({
            summaries: this.processedSummaries,
            symbols: this.symbols.map((symbol, index) => {
                symbol.assertNoMembers();
                let /** @type {?} */ importAs = ((undefined));
                if (this.summaryResolver.isLibraryFile(symbol.filePath)) {
                    importAs = `${symbol.name}_${index}`;
                    exportAs.push({ symbol, exportAs: importAs });
                }
                return {
                    __symbol: index,
                    name: symbol.name,
                    // We convert the source filenames tinto output filenames,
                    // as the generated summary file will be used when teh current
                    // compilation unit is used as a library
                    filePath: this.summaryResolver.getLibraryFileName(symbol.filePath),
                    importAs: importAs
                };
            })
        });
        return { json, exportAs };
    }
    /**
     * @param {?} value
     * @return {?}
     */
    processValue(value) { return visitValue(value, this, null); }
    /**
     * @param {?} value
     * @param {?} context
     * @return {?}
     */
    visitOther(value, context) {
        if (value instanceof StaticSymbol) {
            const /** @type {?} */ baseSymbol = this.symbolResolver.getStaticSymbol(value.filePath, value.name);
            let /** @type {?} */ index = this.indexBySymbol.get(baseSymbol);
            // Note: == on purpose to compare with undefined!
            if (index == null) {
                index = this.indexBySymbol.size;
                this.indexBySymbol.set(baseSymbol, index);
                this.symbols.push(baseSymbol);
            }
            return { __symbol: index, members: value.members };
        }
    }
}
class Deserializer extends ValueTransformer {
    /**
     * @param {?} symbolCache
     */
    constructor(symbolCache) {
        super();
        this.symbolCache = symbolCache;
    }
    /**
     * @param {?} json
     * @return {?}
     */
    deserialize(json) {
        const /** @type {?} */ data = JSON.parse(json);
        const /** @type {?} */ importAs = [];
        this.symbols = [];
        data.symbols.forEach((serializedSymbol) => {
            const /** @type {?} */ symbol = this.symbolCache.get(serializedSymbol.filePath, serializedSymbol.name);
            this.symbols.push(symbol);
            if (serializedSymbol.importAs) {
                importAs.push({ symbol: symbol, importAs: serializedSymbol.importAs });
            }
        });
        const /** @type {?} */ summaries = visitValue(data.summaries, this, null);
        return { summaries, importAs };
    }
    /**
     * @param {?} map
     * @param {?} context
     * @return {?}
     */
    visitStringMap(map, context) {
        if ('__symbol' in map) {
            const /** @type {?} */ baseSymbol = this.symbols[map['__symbol']];
            const /** @type {?} */ members = map['members'];
            return members.length ? this.symbolCache.get(baseSymbol.filePath, baseSymbol.name, members) :
                baseSymbol;
        }
        else {
            return super.visitStringMap(map, context);
        }
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class AotCompiler {
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
    constructor(_config, _host, _metadataResolver, _templateParser, _styleCompiler, _viewCompiler, _ngModuleCompiler, _outputEmitter, _summaryResolver, _localeId, _translationFormat, _genFilePreamble, _symbolResolver) {
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
    clearCache() { this._metadataResolver.clearCache(); }
    /**
     * @param {?} rootFiles
     * @return {?}
     */
    compileAll(rootFiles) {
        const /** @type {?} */ programSymbols = extractProgramSymbols(this._symbolResolver, rootFiles, this._host);
        const { ngModuleByPipeOrDirective, files, ngModules } = analyzeAndValidateNgModules(programSymbols, this._host, this._metadataResolver);
        return Promise
            .all(ngModules.map(ngModule => this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false)))
            .then(() => {
            const /** @type {?} */ sourceModules = files.map(file => this._compileSrcFile(file.srcUrl, ngModuleByPipeOrDirective, file.directives, file.pipes, file.ngModules, file.injectables));
            return flatten(sourceModules);
        });
    }
    /**
     * @param {?} srcFileUrl
     * @param {?} ngModuleByPipeOrDirective
     * @param {?} directives
     * @param {?} pipes
     * @param {?} ngModules
     * @param {?} injectables
     * @return {?}
     */
    _compileSrcFile(srcFileUrl, ngModuleByPipeOrDirective, directives, pipes, ngModules, injectables) {
        const /** @type {?} */ fileSuffix = splitTypescriptSuffix(srcFileUrl)[1];
        const /** @type {?} */ statements = [];
        const /** @type {?} */ exportedVars = [];
        const /** @type {?} */ generatedFiles = [];
        generatedFiles.push(this._createSummary(srcFileUrl, directives, pipes, ngModules, injectables, statements, exportedVars));
        // compile all ng modules
        exportedVars.push(...ngModules.map((ngModuleType) => this._compileModule(ngModuleType, statements)));
        // compile components
        directives.forEach((dirType) => {
            const /** @type {?} */ compMeta = this._metadataResolver.getDirectiveMetadata(/** @type {?} */ (dirType));
            if (!compMeta.isComponent) {
                return Promise.resolve(null);
            }
            const /** @type {?} */ ngModule = ngModuleByPipeOrDirective.get(dirType);
            if (!ngModule) {
                throw new Error(`Internal Error: cannot determine the module for component ${identifierName(compMeta.type)}!`);
            }
            _assertComponent(compMeta);
            // compile styles
            const /** @type {?} */ stylesCompileResults = this._styleCompiler.compileComponent(compMeta);
            stylesCompileResults.externalStylesheets.forEach((compiledStyleSheet) => {
                generatedFiles.push(this._codgenStyles(srcFileUrl, compiledStyleSheet, fileSuffix));
            });
            // compile components
            const /** @type {?} */ compViewVars = this._compileComponent(compMeta, ngModule, ngModule.transitiveModule.directives, stylesCompileResults.componentStylesheet, fileSuffix, statements);
            exportedVars.push(this._compileComponentFactory(compMeta, ngModule, fileSuffix, statements), compViewVars.viewClassVar, compViewVars.compRenderTypeVar);
        });
        if (statements.length > 0) {
            const /** @type {?} */ srcModule = this._codegenSourceModule(srcFileUrl, ngfactoryFilePath(srcFileUrl), statements, exportedVars);
            generatedFiles.unshift(srcModule);
        }
        return generatedFiles;
    }
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
    _createSummary(srcFileUrl, directives, pipes, ngModules, injectables, targetStatements, targetExportedVars) {
        const /** @type {?} */ symbolSummaries = this._symbolResolver.getSymbolsOf(srcFileUrl)
            .map(symbol => this._symbolResolver.resolveSymbol(symbol));
        const /** @type {?} */ typeSummaries = [
            ...ngModules.map(ref => ((this._metadataResolver.getNgModuleSummary(ref)))),
            ...directives.map(ref => ((this._metadataResolver.getDirectiveSummary(ref)))),
            ...pipes.map(ref => ((this._metadataResolver.getPipeSummary(ref)))),
            ...injectables.map(ref => ((this._metadataResolver.getInjectableSummary(ref))))
        ];
        const { json, exportAs } = serializeSummaries(this._summaryResolver, this._symbolResolver, symbolSummaries, typeSummaries);
        exportAs.forEach((entry) => {
            targetStatements.push(variable(entry.exportAs).set(importExpr({ reference: entry.symbol })).toDeclStmt());
            targetExportedVars.push(entry.exportAs);
        });
        return new GeneratedFile(srcFileUrl, summaryFileName(srcFileUrl), json);
    }
    /**
     * @param {?} ngModuleType
     * @param {?} targetStatements
     * @return {?}
     */
    _compileModule(ngModuleType, targetStatements) {
        const /** @type {?} */ ngModule = ((this._metadataResolver.getNgModuleMetadata(ngModuleType)));
        const /** @type {?} */ providers = [];
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
        const /** @type {?} */ appCompileResult = this._ngModuleCompiler.compile(ngModule, providers);
        targetStatements.push(...appCompileResult.statements);
        return appCompileResult.ngModuleFactoryVar;
    }
    /**
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} fileSuffix
     * @param {?} targetStatements
     * @return {?}
     */
    _compileComponentFactory(compMeta, ngModule, fileSuffix, targetStatements) {
        const /** @type {?} */ hostType = this._metadataResolver.getHostComponentType(compMeta.type.reference);
        const /** @type {?} */ hostMeta = createHostComponentMeta(hostType, compMeta, this._metadataResolver.getHostComponentViewClass(hostType));
        const /** @type {?} */ hostViewFactoryVar = this._compileComponent(hostMeta, ngModule, [compMeta.type], null, fileSuffix, targetStatements)
            .viewClassVar;
        const /** @type {?} */ compFactoryVar = componentFactoryName(compMeta.type.reference);
        const /** @type {?} */ inputsExprs = [];
        for (let /** @type {?} */ propName in compMeta.inputs) {
            const /** @type {?} */ templateName = compMeta.inputs[propName];
            // Don't quote so that the key gets minified...
            inputsExprs.push(new LiteralMapEntry(propName, literal(templateName), false));
        }
        const /** @type {?} */ outputsExprs = [];
        for (let /** @type {?} */ propName in compMeta.outputs) {
            const /** @type {?} */ templateName = compMeta.outputs[propName];
            // Don't quote so that the key gets minified...
            outputsExprs.push(new LiteralMapEntry(propName, literal(templateName), false));
        }
        targetStatements.push(variable(compFactoryVar)
            .set(importExpr(createIdentifier(Identifiers.createComponentFactory)).callFn([
            literal(compMeta.selector), importExpr(compMeta.type),
            variable(hostViewFactoryVar), new LiteralMapExpr(inputsExprs),
            new LiteralMapExpr(outputsExprs),
            literalArr(/** @type {?} */ ((compMeta.template)).ngContentSelectors.map(selector => literal(selector)))
        ]))
            .toDeclStmt(importType(createIdentifier(Identifiers.ComponentFactory), [/** @type {?} */ ((importType(compMeta.type)))], [TypeModifier.Const]), [StmtModifier.Final]));
        return compFactoryVar;
    }
    /**
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} directiveIdentifiers
     * @param {?} componentStyles
     * @param {?} fileSuffix
     * @param {?} targetStatements
     * @return {?}
     */
    _compileComponent(compMeta, ngModule, directiveIdentifiers, componentStyles, fileSuffix, targetStatements) {
        const /** @type {?} */ directives = directiveIdentifiers.map(dir => this._metadataResolver.getDirectiveSummary(dir.reference));
        const /** @type {?} */ pipes = ngModule.transitiveModule.pipes.map(pipe => this._metadataResolver.getPipeSummary(pipe.reference));
        const { template: parsedTemplate, pipes: usedPipes } = this._templateParser.parse(compMeta, /** @type {?} */ ((((compMeta.template)).template)), directives, pipes, ngModule.schemas, templateSourceUrl(ngModule.type, compMeta, /** @type {?} */ ((compMeta.template))));
        const /** @type {?} */ stylesExpr = componentStyles ? variable(componentStyles.stylesVar) : literalArr([]);
        const /** @type {?} */ viewResult = this._viewCompiler.compileComponent(compMeta, parsedTemplate, stylesExpr, usedPipes);
        if (componentStyles) {
            targetStatements.push(..._resolveStyleStatements(this._symbolResolver, componentStyles, fileSuffix));
        }
        targetStatements.push(...viewResult.statements);
        return { viewClassVar: viewResult.viewClassVar, compRenderTypeVar: viewResult.rendererTypeVar };
    }
    /**
     * @param {?} fileUrl
     * @param {?} stylesCompileResult
     * @param {?} fileSuffix
     * @return {?}
     */
    _codgenStyles(fileUrl, stylesCompileResult, fileSuffix) {
        _resolveStyleStatements(this._symbolResolver, stylesCompileResult, fileSuffix);
        return this._codegenSourceModule(fileUrl, _stylesModuleUrl(/** @type {?} */ ((stylesCompileResult.meta.moduleUrl)), stylesCompileResult.isShimmed, fileSuffix), stylesCompileResult.statements, [stylesCompileResult.stylesVar]);
    }
    /**
     * @param {?} srcFileUrl
     * @param {?} genFileUrl
     * @param {?} statements
     * @param {?} exportedVars
     * @return {?}
     */
    _codegenSourceModule(srcFileUrl, genFileUrl, statements, exportedVars) {
        return new GeneratedFile(srcFileUrl, genFileUrl, this._outputEmitter.emitStatements(sourceUrl(srcFileUrl), genFileUrl, statements, exportedVars, this._genFilePreamble));
    }
}
/**
 * @param {?} reflector
 * @param {?} compileResult
 * @param {?} fileSuffix
 * @return {?}
 */
function _resolveStyleStatements(reflector, compileResult, fileSuffix) {
    compileResult.dependencies.forEach((dep) => {
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
    return `${stylesheetUrl}${shim ? '.shim' : ''}.ngstyle${suffix}`;
}
/**
 * @param {?} meta
 * @return {?}
 */
function _assertComponent(meta) {
    if (!meta.isComponent) {
        throw new Error(`Could not compile '${identifierName(meta.type)}' because it is not a component.`);
    }
}
/**
 * @param {?} programStaticSymbols
 * @param {?} host
 * @param {?} metadataResolver
 * @return {?}
 */
function analyzeNgModules(programStaticSymbols, host, metadataResolver) {
    const { ngModules, symbolsMissingModule } = _createNgModules(programStaticSymbols, host, metadataResolver);
    return _analyzeNgModules(programStaticSymbols, ngModules, symbolsMissingModule, metadataResolver);
}
/**
 * @param {?} programStaticSymbols
 * @param {?} host
 * @param {?} metadataResolver
 * @return {?}
 */
function analyzeAndValidateNgModules(programStaticSymbols, host, metadataResolver) {
    const /** @type {?} */ result = analyzeNgModules(programStaticSymbols, host, metadataResolver);
    if (result.symbolsMissingModule && result.symbolsMissingModule.length) {
        const /** @type {?} */ messages = result.symbolsMissingModule.map(s => `Cannot determine the module for class ${s.name} in ${s.filePath}! Add ${s.name} to the NgModule to fix it.`);
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
    const /** @type {?} */ moduleMetasByRef = new Map();
    ngModuleMetas.forEach((ngModule) => moduleMetasByRef.set(ngModule.type.reference, ngModule));
    const /** @type {?} */ ngModuleByPipeOrDirective = new Map();
    const /** @type {?} */ ngModulesByFile = new Map();
    const /** @type {?} */ ngDirectivesByFile = new Map();
    const /** @type {?} */ ngPipesByFile = new Map();
    const /** @type {?} */ ngInjectablesByFile = new Map();
    const /** @type {?} */ filePaths = new Set();
    // Make sure we produce an analyzed file for each input file
    programSymbols.forEach((symbol) => {
        const /** @type {?} */ filePath = symbol.filePath;
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
    ngModuleMetas.forEach((ngModuleMeta) => {
        const /** @type {?} */ srcFileUrl = ngModuleMeta.type.reference.filePath;
        filePaths.add(srcFileUrl);
        ngModulesByFile.set(srcFileUrl, (ngModulesByFile.get(srcFileUrl) || []).concat(ngModuleMeta.type.reference));
        ngModuleMeta.declaredDirectives.forEach((dirIdentifier) => {
            const /** @type {?} */ fileUrl = dirIdentifier.reference.filePath;
            filePaths.add(fileUrl);
            ngDirectivesByFile.set(fileUrl, (ngDirectivesByFile.get(fileUrl) || []).concat(dirIdentifier.reference));
            ngModuleByPipeOrDirective.set(dirIdentifier.reference, ngModuleMeta);
        });
        ngModuleMeta.declaredPipes.forEach((pipeIdentifier) => {
            const /** @type {?} */ fileUrl = pipeIdentifier.reference.filePath;
            filePaths.add(fileUrl);
            ngPipesByFile.set(fileUrl, (ngPipesByFile.get(fileUrl) || []).concat(pipeIdentifier.reference));
            ngModuleByPipeOrDirective.set(pipeIdentifier.reference, ngModuleMeta);
        });
    });
    const /** @type {?} */ files = [];
    filePaths.forEach((srcUrl) => {
        const /** @type {?} */ directives = ngDirectivesByFile.get(srcUrl) || [];
        const /** @type {?} */ pipes = ngPipesByFile.get(srcUrl) || [];
        const /** @type {?} */ ngModules = ngModulesByFile.get(srcUrl) || [];
        const /** @type {?} */ injectables = ngInjectablesByFile.get(srcUrl) || [];
        files.push({ srcUrl, directives, pipes, ngModules, injectables });
    });
    return {
        // map directive/pipe to module
        ngModuleByPipeOrDirective,
        // list modules and directives for every source file
        files,
        ngModules: ngModuleMetas, symbolsMissingModule
    };
}
/**
 * @param {?} staticSymbolResolver
 * @param {?} files
 * @param {?} host
 * @return {?}
 */
function extractProgramSymbols(staticSymbolResolver, files, host) {
    const /** @type {?} */ staticSymbols = [];
    files.filter(fileName => host.isSourceFile(fileName)).forEach(sourceFile => {
        staticSymbolResolver.getSymbolsOf(sourceFile).forEach((symbol) => {
            const /** @type {?} */ resolvedSymbol = staticSymbolResolver.resolveSymbol(symbol);
            const /** @type {?} */ symbolMeta = resolvedSymbol.metadata;
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
    const /** @type {?} */ ngModules = new Map();
    const /** @type {?} */ programPipesAndDirectives = [];
    const /** @type {?} */ ngModulePipesAndDirective = new Set();
    const /** @type {?} */ addNgModule = (staticSymbol) => {
        if (ngModules.has(staticSymbol) || !host.isSourceFile(staticSymbol.filePath)) {
            return false;
        }
        const /** @type {?} */ ngModule = metadataResolver.getNgModuleMetadata(staticSymbol, false);
        if (ngModule) {
            ngModules.set(ngModule.type.reference, ngModule);
            ngModule.declaredDirectives.forEach((dir) => ngModulePipesAndDirective.add(dir.reference));
            ngModule.declaredPipes.forEach((pipe) => ngModulePipesAndDirective.add(pipe.reference));
            // For every input module add the list of transitively included modules
            ngModule.transitiveModule.modules.forEach(modMeta => addNgModule(modMeta.reference));
        }
        return !!ngModule;
    };
    programStaticSymbols.forEach((staticSymbol) => {
        if (!addNgModule(staticSymbol) &&
            (metadataResolver.isDirective(staticSymbol) || metadataResolver.isPipe(staticSymbol))) {
            programPipesAndDirectives.push(staticSymbol);
        }
    });
    // Throw an error if any of the program pipe or directives is not declared by a module
    const /** @type {?} */ symbolsMissingModule = programPipesAndDirectives.filter(s => !ngModulePipesAndDirective.has(s));
    return { ngModules: Array.from(ngModules.values()), symbolsMissingModule };
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class StaticAndDynamicReflectionCapabilities {
    /**
     * @param {?} staticDelegate
     */
    constructor(staticDelegate) {
        this.staticDelegate = staticDelegate;
        this.dynamicDelegate = new ɵReflectionCapabilities();
    }
    /**
     * @param {?} staticDelegate
     * @return {?}
     */
    static install(staticDelegate) {
        ɵreflector.updateCapabilities(new StaticAndDynamicReflectionCapabilities(staticDelegate));
    }
    /**
     * @return {?}
     */
    isReflectionEnabled() { return true; }
    /**
     * @param {?} type
     * @return {?}
     */
    factory(type) { return this.dynamicDelegate.factory(type); }
    /**
     * @param {?} type
     * @param {?} lcProperty
     * @return {?}
     */
    hasLifecycleHook(type, lcProperty) {
        return isStaticType(type) ? this.staticDelegate.hasLifecycleHook(type, lcProperty) :
            this.dynamicDelegate.hasLifecycleHook(type, lcProperty);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    parameters(type) {
        return isStaticType(type) ? this.staticDelegate.parameters(type) :
            this.dynamicDelegate.parameters(type);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    annotations(type) {
        return isStaticType(type) ? this.staticDelegate.annotations(type) :
            this.dynamicDelegate.annotations(type);
    }
    /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    propMetadata(typeOrFunc) {
        return isStaticType(typeOrFunc) ? this.staticDelegate.propMetadata(typeOrFunc) :
            this.dynamicDelegate.propMetadata(typeOrFunc);
    }
    /**
     * @param {?} name
     * @return {?}
     */
    getter(name) { return this.dynamicDelegate.getter(name); }
    /**
     * @param {?} name
     * @return {?}
     */
    setter(name) { return this.dynamicDelegate.setter(name); }
    /**
     * @param {?} name
     * @return {?}
     */
    method(name) { return this.dynamicDelegate.method(name); }
    /**
     * @param {?} type
     * @return {?}
     */
    importUri(type) { return ((this.staticDelegate.importUri(type))); }
    /**
     * @param {?} type
     * @return {?}
     */
    resourceUri(type) { return this.staticDelegate.resourceUri(type); }
    /**
     * @param {?} name
     * @param {?} moduleUrl
     * @param {?} members
     * @param {?} runtime
     * @return {?}
     */
    resolveIdentifier(name, moduleUrl, members, runtime) {
        return this.staticDelegate.resolveIdentifier(name, moduleUrl, members);
    }
    /**
     * @param {?} enumIdentifier
     * @param {?} name
     * @return {?}
     */
    resolveEnum(enumIdentifier, name) {
        if (isStaticType(enumIdentifier)) {
            return this.staticDelegate.resolveEnum(enumIdentifier, name);
        }
        else {
            return null;
        }
    }
}
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
const ANGULAR_CORE = '@angular/core';
const HIDDEN_KEY = /^\$.*\$$/;
const IGNORE = {
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
class StaticReflector {
    /**
     * @param {?} summaryResolver
     * @param {?} symbolResolver
     * @param {?=} knownMetadataClasses
     * @param {?=} knownMetadataFunctions
     * @param {?=} errorRecorder
     */
    constructor(summaryResolver, symbolResolver, knownMetadataClasses = [], knownMetadataFunctions = [], errorRecorder) {
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
        knownMetadataClasses.forEach((kc) => this._registerDecoratorOrConstructor(this.getStaticSymbol(kc.filePath, kc.name), kc.ctor));
        knownMetadataFunctions.forEach((kf) => this._registerFunction(this.getStaticSymbol(kf.filePath, kf.name), kf.fn));
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
    importUri(typeOrFunc) {
        const /** @type {?} */ staticSymbol = this.findSymbolDeclaration(typeOrFunc);
        return staticSymbol ? staticSymbol.filePath : null;
    }
    /**
     * @param {?} typeOrFunc
     * @return {?}
     */
    resourceUri(typeOrFunc) {
        const /** @type {?} */ staticSymbol = this.findSymbolDeclaration(typeOrFunc);
        return this.symbolResolver.getResourcePath(staticSymbol);
    }
    /**
     * @param {?} name
     * @param {?} moduleUrl
     * @param {?} members
     * @return {?}
     */
    resolveIdentifier(name, moduleUrl, members) {
        const /** @type {?} */ importSymbol = this.getStaticSymbol(moduleUrl, name);
        const /** @type {?} */ rootSymbol = this.findDeclaration(moduleUrl, name);
        if (importSymbol != rootSymbol) {
            this.symbolResolver.recordImportAs(rootSymbol, importSymbol);
        }
        if (members && members.length) {
            return this.getStaticSymbol(rootSymbol.filePath, rootSymbol.name, members);
        }
        return rootSymbol;
    }
    /**
     * @param {?} moduleUrl
     * @param {?} name
     * @param {?=} containingFile
     * @return {?}
     */
    findDeclaration(moduleUrl, name, containingFile) {
        return this.findSymbolDeclaration(this.symbolResolver.getSymbolByModule(moduleUrl, name, containingFile));
    }
    /**
     * @param {?} symbol
     * @return {?}
     */
    findSymbolDeclaration(symbol) {
        const /** @type {?} */ resolvedSymbol = this.symbolResolver.resolveSymbol(symbol);
        if (resolvedSymbol && resolvedSymbol.metadata instanceof StaticSymbol) {
            return this.findSymbolDeclaration(resolvedSymbol.metadata);
        }
        else {
            return symbol;
        }
    }
    /**
     * @param {?} enumIdentifier
     * @param {?} name
     * @return {?}
     */
    resolveEnum(enumIdentifier, name) {
        const /** @type {?} */ staticSymbol = enumIdentifier;
        const /** @type {?} */ members = (staticSymbol.members || []).concat(name);
        return this.getStaticSymbol(staticSymbol.filePath, staticSymbol.name, members);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    annotations(type) {
        let /** @type {?} */ annotations = this.annotationCache.get(type);
        if (!annotations) {
            annotations = [];
            const /** @type {?} */ classMetadata = this.getTypeMetadata(type);
            const /** @type {?} */ parentType = this.findParentType(type, classMetadata);
            if (parentType) {
                const /** @type {?} */ parentAnnotations = this.annotations(parentType);
                annotations.push(...parentAnnotations);
            }
            let /** @type {?} */ ownAnnotations = [];
            if (classMetadata['decorators']) {
                ownAnnotations = this.simplify(type, classMetadata['decorators']);
                annotations.push(...ownAnnotations);
            }
            if (parentType && !this.summaryResolver.isLibraryFile(type.filePath) &&
                this.summaryResolver.isLibraryFile(parentType.filePath)) {
                const /** @type {?} */ summary = this.summaryResolver.resolveSummary(parentType);
                if (summary && summary.type) {
                    const /** @type {?} */ requiredAnnotationTypes = ((this.annotationForParentClassWithSummaryKind.get(/** @type {?} */ ((summary.type.summaryKind)))));
                    const /** @type {?} */ typeHasRequiredAnnotation = requiredAnnotationTypes.some((requiredType) => ownAnnotations.some(ann => ann instanceof requiredType));
                    if (!typeHasRequiredAnnotation) {
                        this.reportError(syntaxError(`Class ${type.name} in ${type.filePath} extends from a ${CompileSummaryKind[((summary.type.summaryKind))]} in another compilation unit without duplicating the decorator. ` +
                            `Please add a ${requiredAnnotationTypes.map((type) => this.annotationNames.get(type)).join(' or ')} decorator to the class.`), type);
                    }
                }
            }
            this.annotationCache.set(type, annotations.filter(ann => !!ann));
        }
        return annotations;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    propMetadata(type) {
        let /** @type {?} */ propMetadata = this.propertyCache.get(type);
        if (!propMetadata) {
            const /** @type {?} */ classMetadata = this.getTypeMetadata(type);
            propMetadata = {};
            const /** @type {?} */ parentType = this.findParentType(type, classMetadata);
            if (parentType) {
                const /** @type {?} */ parentPropMetadata = this.propMetadata(parentType);
                Object.keys(parentPropMetadata).forEach((parentProp) => {
                    ((propMetadata))[parentProp] = parentPropMetadata[parentProp];
                });
            }
            const /** @type {?} */ members = classMetadata['members'] || {};
            Object.keys(members).forEach((propName) => {
                const /** @type {?} */ propData = members[propName];
                const /** @type {?} */ prop = ((propData))
                    .find(a => a['__symbolic'] == 'property' || a['__symbolic'] == 'method');
                const /** @type {?} */ decorators = [];
                if (((propMetadata))[propName]) {
                    decorators.push(...((propMetadata))[propName]);
                } /** @type {?} */
                ((propMetadata))[propName] = decorators;
                if (prop && prop['decorators']) {
                    decorators.push(...this.simplify(type, prop['decorators']));
                }
            });
            this.propertyCache.set(type, propMetadata);
        }
        return propMetadata;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    parameters(type) {
        if (!(type instanceof StaticSymbol)) {
            this.reportError(new Error(`parameters received ${JSON.stringify(type)} which is not a StaticSymbol`), type);
            return [];
        }
        try {
            let /** @type {?} */ parameters = this.parameterCache.get(type);
            if (!parameters) {
                const /** @type {?} */ classMetadata = this.getTypeMetadata(type);
                const /** @type {?} */ parentType = this.findParentType(type, classMetadata);
                const /** @type {?} */ members = classMetadata ? classMetadata['members'] : null;
                const /** @type {?} */ ctorData = members ? members['__ctor__'] : null;
                if (ctorData) {
                    const /** @type {?} */ ctor = ((ctorData)).find(a => a['__symbolic'] == 'constructor');
                    const /** @type {?} */ parameterTypes = (this.simplify(type, ctor['parameters'] || []));
                    const /** @type {?} */ parameterDecorators = (this.simplify(type, ctor['parameterDecorators'] || []));
                    parameters = [];
                    parameterTypes.forEach((paramType, index) => {
                        const /** @type {?} */ nestedResult = [];
                        if (paramType) {
                            nestedResult.push(paramType);
                        }
                        const /** @type {?} */ decorators = parameterDecorators ? parameterDecorators[index] : null;
                        if (decorators) {
                            nestedResult.push(...decorators);
                        } /** @type {?} */
                        ((parameters)).push(nestedResult);
                    });
                }
                else if (parentType) {
                    parameters = this.parameters(parentType);
                }
                if (!parameters) {
                    parameters = [];
                }
                this.parameterCache.set(type, parameters);
            }
            return parameters;
        }
        catch (e) {
            console.error(`Failed on type ${JSON.stringify(type)} with error ${e}`);
            throw e;
        }
    }
    /**
     * @param {?} type
     * @return {?}
     */
    _methodNames(type) {
        let /** @type {?} */ methodNames = this.methodCache.get(type);
        if (!methodNames) {
            const /** @type {?} */ classMetadata = this.getTypeMetadata(type);
            methodNames = {};
            const /** @type {?} */ parentType = this.findParentType(type, classMetadata);
            if (parentType) {
                const /** @type {?} */ parentMethodNames = this._methodNames(parentType);
                Object.keys(parentMethodNames).forEach((parentProp) => {
                    ((methodNames))[parentProp] = parentMethodNames[parentProp];
                });
            }
            const /** @type {?} */ members = classMetadata['members'] || {};
            Object.keys(members).forEach((propName) => {
                const /** @type {?} */ propData = members[propName];
                const /** @type {?} */ isMethod = ((propData)).some(a => a['__symbolic'] == 'method'); /** @type {?} */
                ((methodNames))[propName] = ((methodNames))[propName] || isMethod;
            });
            this.methodCache.set(type, methodNames);
        }
        return methodNames;
    }
    /**
     * @param {?} type
     * @param {?} classMetadata
     * @return {?}
     */
    findParentType(type, classMetadata) {
        const /** @type {?} */ parentType = this.trySimplify(type, classMetadata['extends']);
        if (parentType instanceof StaticSymbol) {
            return parentType;
        }
    }
    /**
     * @param {?} type
     * @param {?} lcProperty
     * @return {?}
     */
    hasLifecycleHook(type, lcProperty) {
        if (!(type instanceof StaticSymbol)) {
            this.reportError(new Error(`hasLifecycleHook received ${JSON.stringify(type)} which is not a StaticSymbol`), type);
        }
        try {
            return !!this._methodNames(type)[lcProperty];
        }
        catch (e) {
            console.error(`Failed on type ${JSON.stringify(type)} with error ${e}`);
            throw e;
        }
    }
    /**
     * @param {?} type
     * @param {?} ctor
     * @return {?}
     */
    _registerDecoratorOrConstructor(type, ctor) {
        this.conversionMap.set(type, (context, args) => new ctor(...args));
    }
    /**
     * @param {?} type
     * @param {?} fn
     * @return {?}
     */
    _registerFunction(type, fn) {
        this.conversionMap.set(type, (context, args) => fn.apply(undefined, args));
    }
    /**
     * @return {?}
     */
    initializeConversionMap() {
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
    }
    /**
     * getStaticSymbol produces a Type whose metadata is known but whose implementation is not loaded.
     * All types passed to the StaticResolver should be pseudo-types returned by this method.
     *
     * @param {?} declarationFile the absolute path of the file where the symbol is declared
     * @param {?} name the name of the type.
     * @param {?=} members
     * @return {?}
     */
    getStaticSymbol(declarationFile, name, members) {
        return this.symbolResolver.getStaticSymbol(declarationFile, name, members);
    }
    /**
     * @param {?} error
     * @param {?} context
     * @param {?=} path
     * @return {?}
     */
    reportError(error, context, path) {
        if (this.errorRecorder) {
            this.errorRecorder(error, (context && context.filePath) || path);
        }
        else {
            throw error;
        }
    }
    /**
     * Simplify but discard any errors
     * @param {?} context
     * @param {?} value
     * @return {?}
     */
    trySimplify(context, value) {
        const /** @type {?} */ originalRecorder = this.errorRecorder;
        this.errorRecorder = (error, fileName) => { };
        const /** @type {?} */ result = this.simplify(context, value);
        this.errorRecorder = originalRecorder;
        return result;
    }
    /**
     * \@internal
     * @param {?} context
     * @param {?} value
     * @return {?}
     */
    simplify(context, value) {
        const /** @type {?} */ self = this;
        let /** @type {?} */ scope = BindingScope.empty;
        const /** @type {?} */ calling = new Map();
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
                const /** @type {?} */ resolvedSymbol = self.symbolResolver.resolveSymbol(staticSymbol);
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
                        const /** @type {?} */ value = targetFunction['value'];
                        if (value && (depth != 0 || value.__symbolic != 'error')) {
                            const /** @type {?} */ parameters = targetFunction['parameters'];
                            const /** @type {?} */ defaults = targetFunction.defaults;
                            args = args.map(arg => simplifyInContext(context, arg, depth + 1))
                                .map(arg => shouldIgnore(arg) ? undefined : arg);
                            if (defaults && defaults.length > args.length) {
                                args.push(...defaults.slice(args.length).map((value) => simplify(value)));
                            }
                            const /** @type {?} */ functionScope = BindingScope.build();
                            for (let /** @type {?} */ i = 0; i < parameters.length; i++) {
                                functionScope.define(parameters[i], args[i]);
                            }
                            const /** @type {?} */ oldScope = scope;
                            let /** @type {?} */ result;
                            try {
                                scope = functionScope.done();
                                result = simplifyInContext(functionSymbol, value, depth + 1);
                            }
                            finally {
                                scope = oldScope;
                            }
                            return result;
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
                    const /** @type {?} */ result = [];
                    for (const /** @type {?} */ item of ((expression))) {
                        // Check for a spread expression
                        if (item && item.__symbolic === 'spread') {
                            const /** @type {?} */ spreadArray = simplify(item.expression);
                            if (Array.isArray(spreadArray)) {
                                for (const /** @type {?} */ spreadItem of spreadArray) {
                                    result.push(spreadItem);
                                }
                                continue;
                            }
                        }
                        const /** @type {?} */ value = simplify(item);
                        if (shouldIgnore(value)) {
                            continue;
                        }
                        result.push(value);
                    }
                    return result;
                }
                if (expression instanceof StaticSymbol) {
                    // Stop simplification at builtin symbols
                    if (expression === self.injectionToken || expression === self.opaqueToken ||
                        self.conversionMap.has(expression)) {
                        return expression;
                    }
                    else {
                        const /** @type {?} */ staticSymbol = expression;
                        const /** @type {?} */ declarationValue = resolveReferenceValue(staticSymbol);
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
                        let /** @type {?} */ staticSymbol;
                        switch (expression['__symbolic']) {
                            case 'binop':
                                let /** @type {?} */ left = simplify(expression['left']);
                                if (shouldIgnore(left))
                                    return left;
                                let /** @type {?} */ right = simplify(expression['right']);
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
                                let /** @type {?} */ condition = simplify(expression['condition']);
                                return condition ? simplify(expression['thenExpression']) :
                                    simplify(expression['elseExpression']);
                            case 'pre':
                                let /** @type {?} */ operand = simplify(expression['operand']);
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
                                let /** @type {?} */ indexTarget = simplify(expression['expression']);
                                let /** @type {?} */ index = simplify(expression['index']);
                                if (indexTarget && isPrimitive(index))
                                    return indexTarget[index];
                                return null;
                            case 'select':
                                const /** @type {?} */ member = expression['member'];
                                let /** @type {?} */ selectContext = context;
                                let /** @type {?} */ selectTarget = simplify(expression['expression']);
                                if (selectTarget instanceof StaticSymbol) {
                                    const /** @type {?} */ members = selectTarget.members.concat(member);
                                    selectContext =
                                        self.getStaticSymbol(selectTarget.filePath, selectTarget.name, members);
                                    const /** @type {?} */ declarationValue = resolveReferenceValue(selectContext);
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
                                const /** @type {?} */ name = expression['name'];
                                const /** @type {?} */ localValue = scope.resolve(name);
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
                                    const /** @type {?} */ argExpressions = expression['arguments'] || [];
                                    let /** @type {?} */ converter = self.conversionMap.get(staticSymbol);
                                    if (converter) {
                                        const /** @type {?} */ args = argExpressions.map(arg => simplifyInContext(context, arg, depth + 1))
                                            .map(arg => shouldIgnore(arg) ? undefined : arg);
                                        return converter(context, args);
                                    }
                                    else {
                                        // Determine if the function is one we can simplify.
                                        const /** @type {?} */ targetFunction = resolveReferenceValue(staticSymbol);
                                        return simplifyCall(staticSymbol, targetFunction, argExpressions);
                                    }
                                }
                                return IGNORE;
                            case 'error':
                                let /** @type {?} */ message = produceErrorMessage(expression);
                                if (expression['line']) {
                                    message =
                                        `${message} (position ${expression['line'] + 1}:${expression['character'] + 1} in the original .ts file)`;
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
                    return mapStringMap(expression, (value, name) => simplify(value));
                }
                return IGNORE;
            }
            try {
                return simplify(value);
            }
            catch (e) {
                const /** @type {?} */ members = context.members.length ? `.${context.members.join('.')}` : '';
                const /** @type {?} */ message = `${e.message}, resolving symbol ${context.name}${members} in ${context.filePath}`;
                if (e.fileName) {
                    throw positionalError(message, e.fileName, e.line, e.column);
                }
                throw syntaxError(message);
            }
        }
        const /** @type {?} */ recordedSimplifyInContext = (context, value, depth) => {
            try {
                return simplifyInContext(context, value, depth);
            }
            catch (e) {
                this.reportError(e, context);
            }
        };
        const /** @type {?} */ result = this.errorRecorder ? recordedSimplifyInContext(context, value, 0) :
            simplifyInContext(context, value, 0);
        if (shouldIgnore(result)) {
            return undefined;
        }
        return result;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    getTypeMetadata(type) {
        const /** @type {?} */ resolvedSymbol = this.symbolResolver.resolveSymbol(type);
        return resolvedSymbol && resolvedSymbol.metadata ? resolvedSymbol.metadata :
            { __symbolic: 'class' };
    }
}
/**
 * @param {?} error
 * @return {?}
 */
function expandedMessage(error) {
    switch (error.message) {
        case 'Reference to non-exported class':
            if (error.context && error.context.className) {
                return `Reference to a non-exported class ${error.context.className}. Consider exporting the class`;
            }
            break;
        case 'Variable not initialized':
            return 'Only initialized variables and constants can be referenced because the value of this variable is needed by the template compiler';
        case 'Destructuring not supported':
            return 'Referencing an exported destructured variable or constant is not supported by the template compiler. Consider simplifying this to avoid destructuring';
        case 'Could not resolve type':
            if (error.context && error.context.typeName) {
                return `Could not resolve type ${error.context.typeName}`;
            }
            break;
        case 'Function call not supported':
            let /** @type {?} */ prefix = error.context && error.context.name ? `Calling function '${error.context.name}', f` : 'F';
            return prefix +
                'unction calls are not supported. Consider replacing the function or lambda with a reference to an exported function';
        case 'Reference to a local symbol':
            if (error.context && error.context.name) {
                return `Reference to a local (non-exported) symbol '${error.context.name}'. Consider exporting the symbol`;
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
    return `Error encountered resolving symbol values statically. ${expandedMessage(error)}`;
}
/**
 * @param {?} input
 * @param {?} transform
 * @return {?}
 */
function mapStringMap(input, transform) {
    if (!input)
        return {};
    const /** @type {?} */ result = {};
    Object.keys(input).forEach((key) => {
        const /** @type {?} */ value = transform(input[key], key);
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
class BindingScope {
    /**
     * @abstract
     * @param {?} name
     * @return {?}
     */
    resolve(name) { }
    /**
     * @return {?}
     */
    static build() {
        const /** @type {?} */ current = new Map();
        return {
            define: function (name, value) {
                current.set(name, value);
                return this;
            },
            done: function () {
                return current.size > 0 ? new PopulatedScope(current) : BindingScope.empty;
            }
        };
    }
}
BindingScope.missing = {};
BindingScope.empty = { resolve: name => BindingScope.missing };
class PopulatedScope extends BindingScope {
    /**
     * @param {?} bindings
     */
    constructor(bindings) {
        super();
        this.bindings = bindings;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    resolve(name) {
        return this.bindings.has(name) ? this.bindings.get(name) : BindingScope.missing;
    }
}
/**
 * @param {?} message
 * @param {?} fileName
 * @param {?} line
 * @param {?} column
 * @return {?}
 */
function positionalError(message, fileName, line, column) {
    const /** @type {?} */ result = new Error(message);
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
class ResolvedStaticSymbol {
    /**
     * @param {?} symbol
     * @param {?} metadata
     */
    constructor(symbol, metadata) {
        this.symbol = symbol;
        this.metadata = metadata;
    }
}
const SUPPORTED_SCHEMA_VERSION = 3;
/**
 * This class is responsible for loading metadata per symbol,
 * and normalizing references between symbols.
 *
 * Internally, it only uses symbols without members,
 * and deduces the values for symbols with members based
 * on these symbols.
 */
class StaticSymbolResolver {
    /**
     * @param {?} host
     * @param {?} staticSymbolCache
     * @param {?} summaryResolver
     * @param {?=} errorRecorder
     */
    constructor(host, staticSymbolCache, summaryResolver, errorRecorder) {
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
    resolveSymbol(staticSymbol) {
        if (staticSymbol.members.length > 0) {
            return ((this._resolveSymbolMembers(staticSymbol)));
        }
        let /** @type {?} */ result = this.resolvedSymbols.get(staticSymbol);
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
    }
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
    getImportAs(staticSymbol) {
        if (staticSymbol.members.length) {
            const /** @type {?} */ baseSymbol = this.getStaticSymbol(staticSymbol.filePath, staticSymbol.name);
            const /** @type {?} */ baseImportAs = this.getImportAs(baseSymbol);
            return baseImportAs ?
                this.getStaticSymbol(baseImportAs.filePath, baseImportAs.name, staticSymbol.members) :
                null;
        }
        let /** @type {?} */ result = this.summaryResolver.getImportAs(staticSymbol);
        if (!result) {
            result = ((this.importAs.get(staticSymbol)));
        }
        return result;
    }
    /**
     * getResourcePath produces the path to the original location of the symbol and should
     * be used to determine the relative location of resource references recorded in
     * symbol metadata.
     * @param {?} staticSymbol
     * @return {?}
     */
    getResourcePath(staticSymbol) {
        return this.symbolResourcePaths.get(staticSymbol) || staticSymbol.filePath;
    }
    /**
     * getTypeArity returns the number of generic type parameters the given symbol
     * has. If the symbol is not a type the result is null.
     * @param {?} staticSymbol
     * @return {?}
     */
    getTypeArity(staticSymbol) {
        // If the file is a factory file, don't resolve the symbol as doing so would
        // cause the metadata for an factory file to be loaded which doesn't exist.
        // All references to generated classes must include the correct arity whenever
        // generating code.
        if (isNgFactoryFile(staticSymbol.filePath)) {
            return null;
        }
        let /** @type {?} */ resolvedSymbol = this.resolveSymbol(staticSymbol);
        while (resolvedSymbol && resolvedSymbol.metadata instanceof StaticSymbol) {
            resolvedSymbol = this.resolveSymbol(resolvedSymbol.metadata);
        }
        return (resolvedSymbol && resolvedSymbol.metadata && resolvedSymbol.metadata.arity) || null;
    }
    /**
     * @param {?} sourceSymbol
     * @param {?} targetSymbol
     * @return {?}
     */
    recordImportAs(sourceSymbol, targetSymbol) {
        sourceSymbol.assertNoMembers();
        targetSymbol.assertNoMembers();
        this.importAs.set(sourceSymbol, targetSymbol);
    }
    /**
     * Invalidate all information derived from the given file.
     *
     * @param {?} fileName the file to invalidate
     * @return {?}
     */
    invalidateFile(fileName) {
        this.metadataCache.delete(fileName);
        this.resolvedFilePaths.delete(fileName);
        const /** @type {?} */ symbols = this.symbolFromFile.get(fileName);
        if (symbols) {
            this.symbolFromFile.delete(fileName);
            for (const /** @type {?} */ symbol of symbols) {
                this.resolvedSymbols.delete(symbol);
                this.importAs.delete(symbol);
                this.symbolResourcePaths.delete(symbol);
            }
        }
    }
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    _resolveSymbolMembers(staticSymbol) {
        const /** @type {?} */ members = staticSymbol.members;
        const /** @type {?} */ baseResolvedSymbol = this.resolveSymbol(this.getStaticSymbol(staticSymbol.filePath, staticSymbol.name));
        if (!baseResolvedSymbol) {
            return null;
        }
        const /** @type {?} */ baseMetadata = baseResolvedSymbol.metadata;
        if (baseMetadata instanceof StaticSymbol) {
            return new ResolvedStaticSymbol(staticSymbol, this.getStaticSymbol(baseMetadata.filePath, baseMetadata.name, members));
        }
        else if (baseMetadata && baseMetadata.__symbolic === 'class') {
            if (baseMetadata.statics && members.length === 1) {
                return new ResolvedStaticSymbol(staticSymbol, baseMetadata.statics[members[0]]);
            }
        }
        else {
            let /** @type {?} */ value = baseMetadata;
            for (let /** @type {?} */ i = 0; i < members.length && value; i++) {
                value = value[members[i]];
            }
            return new ResolvedStaticSymbol(staticSymbol, value);
        }
        return null;
    }
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    _resolveSymbolFromSummary(staticSymbol) {
        const /** @type {?} */ summary = this.summaryResolver.resolveSummary(staticSymbol);
        return summary ? new ResolvedStaticSymbol(staticSymbol, summary.metadata) : null;
    }
    /**
     * getStaticSymbol produces a Type whose metadata is known but whose implementation is not loaded.
     * All types passed to the StaticResolver should be pseudo-types returned by this method.
     *
     * @param {?} declarationFile the absolute path of the file where the symbol is declared
     * @param {?} name the name of the type.
     * @param {?=} members a symbol for a static member of the named type
     * @return {?}
     */
    getStaticSymbol(declarationFile, name, members) {
        return this.staticSymbolCache.get(declarationFile, name, members);
    }
    /**
     * @param {?} filePath
     * @return {?}
     */
    getSymbolsOf(filePath) {
        // Note: Some users use libraries that were not compiled with ngc, i.e. they don't
        // have summaries, only .d.ts files. So we always need to check both, the summary
        // and metadata.
        let /** @type {?} */ symbols = new Set(this.summaryResolver.getSymbolsOf(filePath));
        this._createSymbolsOf(filePath);
        this.resolvedSymbols.forEach((resolvedSymbol) => {
            if (resolvedSymbol.symbol.filePath === filePath) {
                symbols.add(resolvedSymbol.symbol);
            }
        });
        return Array.from(symbols);
    }
    /**
     * @param {?} filePath
     * @return {?}
     */
    _createSymbolsOf(filePath) {
        if (this.resolvedFilePaths.has(filePath)) {
            return;
        }
        this.resolvedFilePaths.add(filePath);
        const /** @type {?} */ resolvedSymbols = [];
        const /** @type {?} */ metadata = this.getModuleMetadata(filePath);
        if (metadata['metadata']) {
            // handle direct declarations of the symbol
            const /** @type {?} */ topLevelSymbolNames = new Set(Object.keys(metadata['metadata']).map(unescapeIdentifier));
            const /** @type {?} */ origins = metadata['origins'] || {};
            Object.keys(metadata['metadata']).forEach((metadataKey) => {
                const /** @type {?} */ symbolMeta = metadata['metadata'][metadataKey];
                const /** @type {?} */ name = unescapeIdentifier(metadataKey);
                const /** @type {?} */ symbol = this.getStaticSymbol(filePath, name);
                let /** @type {?} */ importSymbol = undefined;
                if (metadata['importAs']) {
                    // Index bundle indexes should use the importAs module name instead of a reference
                    // to the .d.ts file directly.
                    importSymbol = this.getStaticSymbol(metadata['importAs'], name);
                    this.recordImportAs(symbol, importSymbol);
                }
                const /** @type {?} */ origin = origins.hasOwnProperty(metadataKey) && origins[metadataKey];
                if (origin) {
                    // If the symbol is from a bundled index, use the declaration location of the
                    // symbol so relative references (such as './my.html') will be calculated
                    // correctly.
                    const /** @type {?} */ originFilePath = this.resolveModule(origin, filePath);
                    if (!originFilePath) {
                        this.reportError(new Error(`Couldn't resolve original symbol for ${origin} from ${filePath}`));
                    }
                    else {
                        this.symbolResourcePaths.set(symbol, originFilePath);
                    }
                }
                resolvedSymbols.push(this.createResolvedSymbol(symbol, filePath, topLevelSymbolNames, symbolMeta));
            });
        }
        // handle the symbols in one of the re-export location
        if (metadata['exports']) {
            for (const /** @type {?} */ moduleExport of metadata['exports']) {
                // handle the symbols in the list of explicitly re-exported symbols.
                if (moduleExport.export) {
                    moduleExport.export.forEach((exportSymbol) => {
                        let /** @type {?} */ symbolName;
                        if (typeof exportSymbol === 'string') {
                            symbolName = exportSymbol;
                        }
                        else {
                            symbolName = exportSymbol.as;
                        }
                        symbolName = unescapeIdentifier(symbolName);
                        let /** @type {?} */ symName = symbolName;
                        if (typeof exportSymbol !== 'string') {
                            symName = unescapeIdentifier(exportSymbol.name);
                        }
                        const /** @type {?} */ resolvedModule = this.resolveModule(moduleExport.from, filePath);
                        if (resolvedModule) {
                            const /** @type {?} */ targetSymbol = this.getStaticSymbol(resolvedModule, symName);
                            const /** @type {?} */ sourceSymbol = this.getStaticSymbol(filePath, symbolName);
                            resolvedSymbols.push(this.createExport(sourceSymbol, targetSymbol));
                        }
                    });
                }
                else {
                    // handle the symbols via export * directives.
                    const /** @type {?} */ resolvedModule = this.resolveModule(moduleExport.from, filePath);
                    if (resolvedModule) {
                        const /** @type {?} */ nestedExports = this.getSymbolsOf(resolvedModule);
                        nestedExports.forEach((targetSymbol) => {
                            const /** @type {?} */ sourceSymbol = this.getStaticSymbol(filePath, targetSymbol.name);
                            resolvedSymbols.push(this.createExport(sourceSymbol, targetSymbol));
                        });
                    }
                }
            }
        }
        resolvedSymbols.forEach((resolvedSymbol) => this.resolvedSymbols.set(resolvedSymbol.symbol, resolvedSymbol));
        this.symbolFromFile.set(filePath, resolvedSymbols.map(resolvedSymbol => resolvedSymbol.symbol));
    }
    /**
     * @param {?} sourceSymbol
     * @param {?} topLevelPath
     * @param {?} topLevelSymbolNames
     * @param {?} metadata
     * @return {?}
     */
    createResolvedSymbol(sourceSymbol, topLevelPath, topLevelSymbolNames, metadata) {
        // For classes that don't have Angular summaries / metadata,
        // we only keep their arity, but nothing else
        // (e.g. their constructor parameters).
        // We do this to prevent introducing deep imports
        // as we didn't generate .ngfactory.ts files with proper reexports.
        if (this.summaryResolver.isLibraryFile(sourceSymbol.filePath) && metadata &&
            metadata['__symbolic'] === 'class') {
            const /** @type {?} */ transformedMeta = { __symbolic: 'class', arity: metadata.arity };
            return new ResolvedStaticSymbol(sourceSymbol, transformedMeta);
        }
        const /** @type {?} */ self = this;
        class ReferenceTransformer extends ValueTransformer {
            /**
             * @param {?} map
             * @param {?} functionParams
             * @return {?}
             */
            visitStringMap(map, functionParams) {
                const /** @type {?} */ symbolic = map['__symbolic'];
                if (symbolic === 'function') {
                    const /** @type {?} */ oldLen = functionParams.length;
                    functionParams.push(...(map['parameters'] || []));
                    const /** @type {?} */ result = super.visitStringMap(map, functionParams);
                    functionParams.length = oldLen;
                    return result;
                }
                else if (symbolic === 'reference') {
                    const /** @type {?} */ module = map['module'];
                    const /** @type {?} */ name = map['name'] ? unescapeIdentifier(map['name']) : map['name'];
                    if (!name) {
                        return null;
                    }
                    let /** @type {?} */ filePath;
                    if (module) {
                        filePath = ((self.resolveModule(module, sourceSymbol.filePath)));
                        if (!filePath) {
                            return {
                                __symbolic: 'error',
                                message: `Could not resolve ${module} relative to ${sourceSymbol.filePath}.`
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
                    return super.visitStringMap(map, functionParams);
                }
            }
        }
        const /** @type {?} */ transformedMeta = visitValue(metadata, new ReferenceTransformer(), []);
        if (transformedMeta instanceof StaticSymbol) {
            return this.createExport(sourceSymbol, transformedMeta);
        }
        return new ResolvedStaticSymbol(sourceSymbol, transformedMeta);
    }
    /**
     * @param {?} sourceSymbol
     * @param {?} targetSymbol
     * @return {?}
     */
    createExport(sourceSymbol, targetSymbol) {
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
    }
    /**
     * @param {?} error
     * @param {?=} context
     * @param {?=} path
     * @return {?}
     */
    reportError(error, context, path) {
        if (this.errorRecorder) {
            this.errorRecorder(error, (context && context.filePath) || path);
        }
        else {
            throw error;
        }
    }
    /**
     * @param {?} module an absolute path to a module file.
     * @return {?}
     */
    getModuleMetadata(module) {
        let /** @type {?} */ moduleMetadata = this.metadataCache.get(module);
        if (!moduleMetadata) {
            const /** @type {?} */ moduleMetadatas = this.host.getMetadataFor(module);
            if (moduleMetadatas) {
                let /** @type {?} */ maxVersion = -1;
                moduleMetadatas.forEach((md) => {
                    if (md['version'] > maxVersion) {
                        maxVersion = md['version'];
                        moduleMetadata = md;
                    }
                });
            }
            if (!moduleMetadata) {
                moduleMetadata =
                    { __symbolic: 'module', version: SUPPORTED_SCHEMA_VERSION, module: module, metadata: {} };
            }
            if (moduleMetadata['version'] != SUPPORTED_SCHEMA_VERSION) {
                const /** @type {?} */ errorMessage = moduleMetadata['version'] == 2 ?
                    `Unsupported metadata version ${moduleMetadata['version']} for module ${module}. This module should be compiled with a newer version of ngc` :
                    `Metadata version mismatch for module ${module}, found version ${moduleMetadata['version']}, expected ${SUPPORTED_SCHEMA_VERSION}`;
                this.reportError(new Error(errorMessage));
            }
            this.metadataCache.set(module, moduleMetadata);
        }
        return moduleMetadata;
    }
    /**
     * @param {?} module
     * @param {?} symbolName
     * @param {?=} containingFile
     * @return {?}
     */
    getSymbolByModule(module, symbolName, containingFile) {
        const /** @type {?} */ filePath = this.resolveModule(module, containingFile);
        if (!filePath) {
            this.reportError(new Error(`Could not resolve module ${module}${containingFile ? ` relative to $ {
            containingFile
          } ` : ''}`));
            return this.getStaticSymbol(`ERROR:${module}`, symbolName);
        }
        return this.getStaticSymbol(filePath, symbolName);
    }
    /**
     * @param {?} module
     * @param {?=} containingFile
     * @return {?}
     */
    resolveModule(module, containingFile) {
        try {
            return this.host.moduleNameToFileName(module, containingFile);
        }
        catch (e) {
            console.error(`Could not resolve module '${module}' relative to file ${containingFile}`);
            this.reportError(e, undefined, containingFile);
        }
        return null;
    }
}
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
class AotSummaryResolver {
    /**
     * @param {?} host
     * @param {?} staticSymbolCache
     */
    constructor(host, staticSymbolCache) {
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
    isLibraryFile(filePath) {
        // Note: We need to strip the .ngfactory. file path,
        // so this method also works for generated files
        // (for which host.isSourceFile will always return false).
        return !this.host.isSourceFile(stripNgFactory(filePath));
    }
    /**
     * @param {?} filePath
     * @return {?}
     */
    getLibraryFileName(filePath) { return this.host.getOutputFileName(filePath); }
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    resolveSummary(staticSymbol) {
        staticSymbol.assertNoMembers();
        let /** @type {?} */ summary = this.summaryCache.get(staticSymbol);
        if (!summary) {
            this._loadSummaryFile(staticSymbol.filePath);
            summary = ((this.summaryCache.get(staticSymbol)));
        }
        return summary;
    }
    /**
     * @param {?} filePath
     * @return {?}
     */
    getSymbolsOf(filePath) {
        this._loadSummaryFile(filePath);
        return Array.from(this.summaryCache.keys()).filter((symbol) => symbol.filePath === filePath);
    }
    /**
     * @param {?} staticSymbol
     * @return {?}
     */
    getImportAs(staticSymbol) {
        staticSymbol.assertNoMembers();
        return ((this.importAs.get(staticSymbol)));
    }
    /**
     * @param {?} filePath
     * @return {?}
     */
    _loadSummaryFile(filePath) {
        if (this.loadedFilePaths.has(filePath)) {
            return;
        }
        this.loadedFilePaths.add(filePath);
        if (this.isLibraryFile(filePath)) {
            const /** @type {?} */ summaryFilePath = summaryFileName(filePath);
            let /** @type {?} */ json;
            try {
                json = this.host.loadSummary(summaryFilePath);
            }
            catch (e) {
                console.error(`Error loading summary file ${summaryFilePath}`);
                throw e;
            }
            if (json) {
                const { summaries, importAs } = deserializeSummaries(this.staticSymbolCache, json);
                summaries.forEach((summary) => this.summaryCache.set(summary.symbol, summary));
                importAs.forEach((importAs) => {
                    this.importAs.set(importAs.symbol, this.staticSymbolCache.get(ngfactoryFilePath(filePath), importAs.importAs));
                });
            }
        }
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
 * Creates a new AotCompiler based on options and a host.
 * @param {?} compilerHost
 * @param {?} options
 * @return {?}
 */
function createAotCompiler(compilerHost, options) {
    let /** @type {?} */ translations = options.translations || '';
    const /** @type {?} */ urlResolver = createOfflineCompileUrlResolver();
    const /** @type {?} */ symbolCache = new StaticSymbolCache();
    const /** @type {?} */ summaryResolver = new AotSummaryResolver(compilerHost, symbolCache);
    const /** @type {?} */ symbolResolver = new StaticSymbolResolver(compilerHost, symbolCache, summaryResolver);
    const /** @type {?} */ staticReflector = new StaticReflector(summaryResolver, symbolResolver);
    StaticAndDynamicReflectionCapabilities.install(staticReflector);
    const /** @type {?} */ console = new ɵConsole();
    const /** @type {?} */ htmlParser = new I18NHtmlParser(new HtmlParser(), translations, options.i18nFormat, MissingTranslationStrategy.Warning, console);
    const /** @type {?} */ config = new CompilerConfig({
        defaultEncapsulation: ViewEncapsulation.Emulated,
        useJit: false,
        enableLegacyTemplate: options.enableLegacyTemplate !== false,
    });
    const /** @type {?} */ normalizer = new DirectiveNormalizer({ get: (url) => compilerHost.loadResource(url) }, urlResolver, htmlParser, config);
    const /** @type {?} */ expressionParser = new Parser(new Lexer());
    const /** @type {?} */ elementSchemaRegistry = new DomElementSchemaRegistry();
    const /** @type {?} */ tmplParser = new TemplateParser(config, expressionParser, elementSchemaRegistry, htmlParser, console, []);
    const /** @type {?} */ resolver = new CompileMetadataResolver(config, new NgModuleResolver(staticReflector), new DirectiveResolver(staticReflector), new PipeResolver(staticReflector), summaryResolver, elementSchemaRegistry, normalizer, console, symbolCache, staticReflector);
    // TODO(vicb): do not pass options.i18nFormat here
    const /** @type {?} */ importResolver = {
        getImportAs: (symbol) => ((symbolResolver.getImportAs(symbol))),
        fileNameToModuleName: (fileName, containingFilePath) => compilerHost.fileNameToModuleName(fileName, containingFilePath),
        getTypeArity: (symbol) => ((symbolResolver.getTypeArity(symbol)))
    };
    const /** @type {?} */ viewCompiler = new ViewCompiler(config, elementSchemaRegistry);
    const /** @type {?} */ compiler = new AotCompiler(config, compilerHost, resolver, tmplParser, new StyleCompiler(urlResolver), viewCompiler, new NgModuleCompiler(), new TypeScriptEmitter(importResolver), summaryResolver, options.locale || null, options.i18nFormat || null, options.genFilePreamble || null, symbolResolver);
    return { compiler, reflector: staticReflector };
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
    const /** @type {?} */ stmtsWithReturn = statements.concat([new ReturnStatement(literalArr(resultVars.map(resultVar => variable(resultVar))))]);
    const /** @type {?} */ ctx = new _ExecutionContext(null, null, null, new Map());
    const /** @type {?} */ visitor = new StatementInterpreter();
    const /** @type {?} */ result = visitor.visitAllStatements(stmtsWithReturn, ctx);
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
    const /** @type {?} */ childCtx = ctx.createChildWihtLocalVars();
    for (let /** @type {?} */ i = 0; i < varNames.length; i++) {
        childCtx.vars.set(varNames[i], varValues[i]);
    }
    const /** @type {?} */ result = visitor.visitAllStatements(statements, childCtx);
    return result ? result.value : null;
}
class _ExecutionContext {
    /**
     * @param {?} parent
     * @param {?} instance
     * @param {?} className
     * @param {?} vars
     */
    constructor(parent, instance, className, vars) {
        this.parent = parent;
        this.instance = instance;
        this.className = className;
        this.vars = vars;
    }
    /**
     * @return {?}
     */
    createChildWihtLocalVars() {
        return new _ExecutionContext(this, this.instance, this.className, new Map());
    }
}
class ReturnValue {
    /**
     * @param {?} value
     */
    constructor(value) {
        this.value = value;
    }
}
/**
 * @param {?} _classStmt
 * @param {?} _ctx
 * @param {?} _visitor
 * @return {?}
 */
function createDynamicClass(_classStmt, _ctx, _visitor) {
    const /** @type {?} */ propertyDescriptors = {};
    _classStmt.getters.forEach((getter) => {
        // Note: use `function` instead of arrow function to capture `this`
        propertyDescriptors[getter.name] = {
            configurable: false,
            get: function () {
                const /** @type {?} */ instanceCtx = new _ExecutionContext(_ctx, this, _classStmt.name, _ctx.vars);
                return _executeFunctionStatements([], [], getter.body, instanceCtx, _visitor);
            }
        };
    });
    _classStmt.methods.forEach(function (method) {
        const /** @type {?} */ paramNames = method.params.map(param => param.name);
        // Note: use `function` instead of arrow function to capture `this`
        propertyDescriptors[((method.name))] = {
            writable: false,
            configurable: false,
            value: function (...args) {
                const /** @type {?} */ instanceCtx = new _ExecutionContext(_ctx, this, _classStmt.name, _ctx.vars);
                return _executeFunctionStatements(paramNames, args, method.body, instanceCtx, _visitor);
            }
        };
    });
    const /** @type {?} */ ctorParamNames = _classStmt.constructorMethod.params.map(param => param.name);
    // Note: use `function` instead of arrow function to capture `this`
    const /** @type {?} */ ctor = function (...args) {
        const /** @type {?} */ instanceCtx = new _ExecutionContext(_ctx, this, _classStmt.name, _ctx.vars);
        _classStmt.fields.forEach((field) => { this[field.name] = undefined; });
        _executeFunctionStatements(ctorParamNames, args, _classStmt.constructorMethod.body, instanceCtx, _visitor);
    };
    const /** @type {?} */ superClass = _classStmt.parent ? _classStmt.parent.visitExpression(_visitor, _ctx) : Object;
    ctor.prototype = Object.create(superClass.prototype, propertyDescriptors);
    return ctor;
}
class StatementInterpreter {
    /**
     * @param {?} ast
     * @return {?}
     */
    debugAst(ast) { return debugOutputAstAsTypeScript(ast); }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitDeclareVarStmt(stmt, ctx) {
        ctx.vars.set(stmt.name, stmt.value.visitExpression(this, ctx));
        return null;
    }
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    visitWriteVarExpr(expr, ctx) {
        const /** @type {?} */ value = expr.value.visitExpression(this, ctx);
        let /** @type {?} */ currCtx = ctx;
        while (currCtx != null) {
            if (currCtx.vars.has(expr.name)) {
                currCtx.vars.set(expr.name, value);
                return value;
            }
            currCtx = ((currCtx.parent));
        }
        throw new Error(`Not declared variable ${expr.name}`);
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitReadVarExpr(ast, ctx) {
        let /** @type {?} */ varName = ((ast.name));
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
                    throw new Error(`Unknown builtin variable ${ast.builtin}`);
            }
        }
        let /** @type {?} */ currCtx = ctx;
        while (currCtx != null) {
            if (currCtx.vars.has(varName)) {
                return currCtx.vars.get(varName);
            }
            currCtx = ((currCtx.parent));
        }
        throw new Error(`Not declared variable ${varName}`);
    }
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    visitWriteKeyExpr(expr, ctx) {
        const /** @type {?} */ receiver = expr.receiver.visitExpression(this, ctx);
        const /** @type {?} */ index = expr.index.visitExpression(this, ctx);
        const /** @type {?} */ value = expr.value.visitExpression(this, ctx);
        receiver[index] = value;
        return value;
    }
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    visitWritePropExpr(expr, ctx) {
        const /** @type {?} */ receiver = expr.receiver.visitExpression(this, ctx);
        const /** @type {?} */ value = expr.value.visitExpression(this, ctx);
        receiver[expr.name] = value;
        return value;
    }
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    visitInvokeMethodExpr(expr, ctx) {
        const /** @type {?} */ receiver = expr.receiver.visitExpression(this, ctx);
        const /** @type {?} */ args = this.visitAllExpressions(expr.args, ctx);
        let /** @type {?} */ result;
        if (expr.builtin != null) {
            switch (expr.builtin) {
                case BuiltinMethod.ConcatArray:
                    result = receiver.concat(...args);
                    break;
                case BuiltinMethod.SubscribeObservable:
                    result = receiver.subscribe({ next: args[0] });
                    break;
                case BuiltinMethod.Bind:
                    result = receiver.bind(...args);
                    break;
                default:
                    throw new Error(`Unknown builtin method ${expr.builtin}`);
            }
        }
        else {
            result = receiver[((expr.name))].apply(receiver, args);
        }
        return result;
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitInvokeFunctionExpr(stmt, ctx) {
        const /** @type {?} */ args = this.visitAllExpressions(stmt.args, ctx);
        const /** @type {?} */ fnExpr = stmt.fn;
        if (fnExpr instanceof ReadVarExpr && fnExpr.builtin === BuiltinVar.Super) {
            ctx.instance.constructor.prototype.constructor.apply(ctx.instance, args);
            return null;
        }
        else {
            const /** @type {?} */ fn$$1 = stmt.fn.visitExpression(this, ctx);
            return fn$$1.apply(null, args);
        }
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitReturnStmt(stmt, ctx) {
        return new ReturnValue(stmt.value.visitExpression(this, ctx));
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitDeclareClassStmt(stmt, ctx) {
        const /** @type {?} */ clazz = createDynamicClass(stmt, ctx, this);
        ctx.vars.set(stmt.name, clazz);
        return null;
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitExpressionStmt(stmt, ctx) {
        return stmt.expr.visitExpression(this, ctx);
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitIfStmt(stmt, ctx) {
        const /** @type {?} */ condition = stmt.condition.visitExpression(this, ctx);
        if (condition) {
            return this.visitAllStatements(stmt.trueCase, ctx);
        }
        else if (stmt.falseCase != null) {
            return this.visitAllStatements(stmt.falseCase, ctx);
        }
        return null;
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitTryCatchStmt(stmt, ctx) {
        try {
            return this.visitAllStatements(stmt.bodyStmts, ctx);
        }
        catch (e) {
            const /** @type {?} */ childCtx = ctx.createChildWihtLocalVars();
            childCtx.vars.set(CATCH_ERROR_VAR$2, e);
            childCtx.vars.set(CATCH_STACK_VAR$2, e.stack);
            return this.visitAllStatements(stmt.catchStmts, childCtx);
        }
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitThrowStmt(stmt, ctx) {
        throw stmt.error.visitExpression(this, ctx);
    }
    /**
     * @param {?} stmt
     * @param {?=} context
     * @return {?}
     */
    visitCommentStmt(stmt, context) { return null; }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitInstantiateExpr(ast, ctx) {
        const /** @type {?} */ args = this.visitAllExpressions(ast.args, ctx);
        const /** @type {?} */ clazz = ast.classExpr.visitExpression(this, ctx);
        return new clazz(...args);
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitLiteralExpr(ast, ctx) { return ast.value; }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitExternalExpr(ast, ctx) {
        return ast.value.reference;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitConditionalExpr(ast, ctx) {
        if (ast.condition.visitExpression(this, ctx)) {
            return ast.trueCase.visitExpression(this, ctx);
        }
        else if (ast.falseCase != null) {
            return ast.falseCase.visitExpression(this, ctx);
        }
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitNotExpr(ast, ctx) {
        return !ast.condition.visitExpression(this, ctx);
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitCastExpr(ast, ctx) {
        return ast.value.visitExpression(this, ctx);
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitFunctionExpr(ast, ctx) {
        const /** @type {?} */ paramNames = ast.params.map((param) => param.name);
        return _declareFn(paramNames, ast.statements, ctx, this);
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitDeclareFunctionStmt(stmt, ctx) {
        const /** @type {?} */ paramNames = stmt.params.map((param) => param.name);
        ctx.vars.set(stmt.name, _declareFn(paramNames, stmt.statements, ctx, this));
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitBinaryOperatorExpr(ast, ctx) {
        const /** @type {?} */ lhs = () => ast.lhs.visitExpression(this, ctx);
        const /** @type {?} */ rhs = () => ast.rhs.visitExpression(this, ctx);
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
                throw new Error(`Unknown operator ${ast.operator}`);
        }
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitReadPropExpr(ast, ctx) {
        let /** @type {?} */ result;
        const /** @type {?} */ receiver = ast.receiver.visitExpression(this, ctx);
        result = receiver[ast.name];
        return result;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitReadKeyExpr(ast, ctx) {
        const /** @type {?} */ receiver = ast.receiver.visitExpression(this, ctx);
        const /** @type {?} */ prop = ast.index.visitExpression(this, ctx);
        return receiver[prop];
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitLiteralArrayExpr(ast, ctx) {
        return this.visitAllExpressions(ast.entries, ctx);
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitLiteralMapExpr(ast, ctx) {
        const /** @type {?} */ result = {};
        ast.entries.forEach((entry) => ((result))[entry.key] = entry.value.visitExpression(this, ctx));
        return result;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitCommaExpr(ast, context) {
        const /** @type {?} */ values = this.visitAllExpressions(ast.parts, context);
        return values[values.length - 1];
    }
    /**
     * @param {?} expressions
     * @param {?} ctx
     * @return {?}
     */
    visitAllExpressions(expressions, ctx) {
        return expressions.map((expr) => expr.visitExpression(this, ctx));
    }
    /**
     * @param {?} statements
     * @param {?} ctx
     * @return {?}
     */
    visitAllStatements(statements, ctx) {
        for (let /** @type {?} */ i = 0; i < statements.length; i++) {
            const /** @type {?} */ stmt = statements[i];
            const /** @type {?} */ val = stmt.visitStatement(this, ctx);
            if (val instanceof ReturnValue) {
                return val;
            }
        }
        return null;
    }
}
/**
 * @param {?} varNames
 * @param {?} statements
 * @param {?} ctx
 * @param {?} visitor
 * @return {?}
 */
function _declareFn(varNames, statements, ctx, visitor) {
    return (...args) => _executeFunctionStatements(varNames, args, statements, ctx, visitor);
}
const CATCH_ERROR_VAR$2 = 'error';
const CATCH_STACK_VAR$2 = 'stack';

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
class AbstractJsEmitterVisitor extends AbstractEmitterVisitor {
    constructor() { super(false); }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitDeclareClassStmt(stmt, ctx) {
        ctx.pushClass(stmt);
        this._visitClassConstructor(stmt, ctx);
        if (stmt.parent != null) {
            ctx.print(stmt, `${stmt.name}.prototype = Object.create(`);
            stmt.parent.visitExpression(this, ctx);
            ctx.println(stmt, `.prototype);`);
        }
        stmt.getters.forEach((getter) => this._visitClassGetter(stmt, getter, ctx));
        stmt.methods.forEach((method) => this._visitClassMethod(stmt, method, ctx));
        ctx.popClass();
        return null;
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    _visitClassConstructor(stmt, ctx) {
        ctx.print(stmt, `function ${stmt.name}(`);
        if (stmt.constructorMethod != null) {
            this._visitParams(stmt.constructorMethod.params, ctx);
        }
        ctx.println(stmt, `) {`);
        ctx.incIndent();
        if (stmt.constructorMethod != null) {
            if (stmt.constructorMethod.body.length > 0) {
                ctx.println(stmt, `var self = this;`);
                this.visitAllStatements(stmt.constructorMethod.body, ctx);
            }
        }
        ctx.decIndent();
        ctx.println(stmt, `}`);
    }
    /**
     * @param {?} stmt
     * @param {?} getter
     * @param {?} ctx
     * @return {?}
     */
    _visitClassGetter(stmt, getter, ctx) {
        ctx.println(stmt, `Object.defineProperty(${stmt.name}.prototype, '${getter.name}', { get: function() {`);
        ctx.incIndent();
        if (getter.body.length > 0) {
            ctx.println(stmt, `var self = this;`);
            this.visitAllStatements(getter.body, ctx);
        }
        ctx.decIndent();
        ctx.println(stmt, `}});`);
    }
    /**
     * @param {?} stmt
     * @param {?} method
     * @param {?} ctx
     * @return {?}
     */
    _visitClassMethod(stmt, method, ctx) {
        ctx.print(stmt, `${stmt.name}.prototype.${method.name} = function(`);
        this._visitParams(method.params, ctx);
        ctx.println(stmt, `) {`);
        ctx.incIndent();
        if (method.body.length > 0) {
            ctx.println(stmt, `var self = this;`);
            this.visitAllStatements(method.body, ctx);
        }
        ctx.decIndent();
        ctx.println(stmt, `};`);
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitReadVarExpr(ast, ctx) {
        if (ast.builtin === BuiltinVar.This) {
            ctx.print(ast, 'self');
        }
        else if (ast.builtin === BuiltinVar.Super) {
            throw new Error(`'super' needs to be handled at a parent ast node, not at the variable level!`);
        }
        else {
            super.visitReadVarExpr(ast, ctx);
        }
        return null;
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitDeclareVarStmt(stmt, ctx) {
        ctx.print(stmt, `var ${stmt.name} = `);
        stmt.value.visitExpression(this, ctx);
        ctx.println(stmt, `;`);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitCastExpr(ast, ctx) {
        ast.value.visitExpression(this, ctx);
        return null;
    }
    /**
     * @param {?} expr
     * @param {?} ctx
     * @return {?}
     */
    visitInvokeFunctionExpr(expr, ctx) {
        const /** @type {?} */ fnExpr = expr.fn;
        if (fnExpr instanceof ReadVarExpr && fnExpr.builtin === BuiltinVar.Super) {
            ((((ctx.currentClass)).parent)).visitExpression(this, ctx);
            ctx.print(expr, `.call(this`);
            if (expr.args.length > 0) {
                ctx.print(expr, `, `);
                this.visitAllExpressions(expr.args, ctx, ',');
            }
            ctx.print(expr, `)`);
        }
        else {
            super.visitInvokeFunctionExpr(expr, ctx);
        }
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitFunctionExpr(ast, ctx) {
        ctx.print(ast, `function(`);
        this._visitParams(ast.params, ctx);
        ctx.println(ast, `) {`);
        ctx.incIndent();
        this.visitAllStatements(ast.statements, ctx);
        ctx.decIndent();
        ctx.print(ast, `}`);
        return null;
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitDeclareFunctionStmt(stmt, ctx) {
        ctx.print(stmt, `function ${stmt.name}(`);
        this._visitParams(stmt.params, ctx);
        ctx.println(stmt, `) {`);
        ctx.incIndent();
        this.visitAllStatements(stmt.statements, ctx);
        ctx.decIndent();
        ctx.println(stmt, `}`);
        return null;
    }
    /**
     * @param {?} stmt
     * @param {?} ctx
     * @return {?}
     */
    visitTryCatchStmt(stmt, ctx) {
        ctx.println(stmt, `try {`);
        ctx.incIndent();
        this.visitAllStatements(stmt.bodyStmts, ctx);
        ctx.decIndent();
        ctx.println(stmt, `} catch (${CATCH_ERROR_VAR$1.name}) {`);
        ctx.incIndent();
        const /** @type {?} */ catchStmts = [/** @type {?} */ (CATCH_STACK_VAR$1.set(CATCH_ERROR_VAR$1.prop('stack')).toDeclStmt(null, [
                StmtModifier.Final
            ]))].concat(stmt.catchStmts);
        this.visitAllStatements(catchStmts, ctx);
        ctx.decIndent();
        ctx.println(stmt, `}`);
        return null;
    }
    /**
     * @param {?} params
     * @param {?} ctx
     * @return {?}
     */
    _visitParams(params, ctx) {
        this.visitAllObjects(param => ctx.print(null, param.name), params, ctx, ',');
    }
    /**
     * @param {?} method
     * @return {?}
     */
    getBuiltinMethodName(method) {
        let /** @type {?} */ name;
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
                throw new Error(`Unknown builtin method: ${method}`);
        }
        return name;
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
 * @param {?} sourceUrl
 * @param {?} ctx
 * @param {?} vars
 * @return {?}
 */
function evalExpression(sourceUrl$$1, ctx, vars) {
    let /** @type {?} */ fnBody = `${ctx.toSource()}\n//# sourceURL=${sourceUrl$$1}`;
    const /** @type {?} */ fnArgNames = [];
    const /** @type {?} */ fnArgValues = [];
    for (const /** @type {?} */ argName in vars) {
        fnArgNames.push(argName);
        fnArgValues.push(vars[argName]);
    }
    if (isDevMode()) {
        // using `new Function(...)` generates a header, 1 line of no arguments, 2 lines otherwise
        // E.g. ```
        // function anonymous(a,b,c
        // /**/) { ... }```
        // We don't want to hard code this fact, so we auto detect it via an empty function first.
        const /** @type {?} */ emptyFn = new Function(...fnArgNames.concat('return null;')).toString();
        const /** @type {?} */ headerLines = emptyFn.slice(0, emptyFn.indexOf('return null;')).split('\n').length - 1;
        fnBody += `\n${ctx.toSourceMapGenerator(sourceUrl$$1, sourceUrl$$1, headerLines).toJsComment()}`;
    }
    return new Function(...fnArgNames.concat(fnBody))(...fnArgValues);
}
/**
 * @param {?} sourceUrl
 * @param {?} statements
 * @param {?} resultVars
 * @return {?}
 */
function jitStatements(sourceUrl$$1, statements, resultVars) {
    const /** @type {?} */ converter = new JitEmitterVisitor();
    const /** @type {?} */ ctx = EmitterVisitorContext.createRoot(resultVars);
    const /** @type {?} */ returnStmt = new ReturnStatement(literalArr(resultVars.map(resultVar => variable(resultVar))));
    converter.visitAllStatements(statements.concat([returnStmt]), ctx);
    return evalExpression(sourceUrl$$1, ctx, converter.getArgs());
}
class JitEmitterVisitor extends AbstractJsEmitterVisitor {
    constructor() {
        super(...arguments);
        this._evalArgNames = [];
        this._evalArgValues = [];
    }
    /**
     * @return {?}
     */
    getArgs() {
        const /** @type {?} */ result = {};
        for (let /** @type {?} */ i = 0; i < this._evalArgNames.length; i++) {
            result[this._evalArgNames[i]] = this._evalArgValues[i];
        }
        return result;
    }
    /**
     * @param {?} ast
     * @param {?} ctx
     * @return {?}
     */
    visitExternalExpr(ast, ctx) {
        const /** @type {?} */ value = ast.value.reference;
        let /** @type {?} */ id = this._evalArgValues.indexOf(value);
        if (id === -1) {
            id = this._evalArgValues.length;
            this._evalArgValues.push(value);
            const /** @type {?} */ name = identifierName(ast.value) || 'val';
            this._evalArgNames.push(`jit_${name}${id}`);
        }
        ctx.print(ast, this._evalArgNames[id]);
        return null;
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
 * An internal module of the Angular compiler that begins with component types,
 * extracts templates, and eventually produces a compiled version of the component
 * ready for linking into an application.
 *
 * \@security When compiling templates at runtime, you must ensure that the entire template comes
 * from a trusted source. Attacker-controlled data introduced by a template could expose your
 * application to XSS risks.  For more detail, see the [Security Guide](http://g.co/ng/security).
 */
class JitCompiler {
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
    constructor(_injector, _metadataResolver, _templateParser, _styleCompiler, _viewCompiler, _ngModuleCompiler, _compilerConfig, _console) {
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
    /**
     * @return {?}
     */
    get injector() { return this._injector; }
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    compileModuleSync(moduleType) {
        return ((this._compileModuleAndComponents(moduleType, true).syncResult));
    }
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    compileModuleAsync(moduleType) {
        return ((this._compileModuleAndComponents(moduleType, false).asyncResult));
    }
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    compileModuleAndAllComponentsSync(moduleType) {
        return ((this._compileModuleAndAllComponents(moduleType, true).syncResult));
    }
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    compileModuleAndAllComponentsAsync(moduleType) {
        return ((this._compileModuleAndAllComponents(moduleType, false).asyncResult));
    }
    /**
     * @param {?} component
     * @return {?}
     */
    getNgContentSelectors(component) {
        this._console.warn('Compiler.getNgContentSelectors is deprecated. Use ComponentFactory.ngContentSelectors instead!');
        const /** @type {?} */ template = this._compiledTemplateCache.get(component);
        if (!template) {
            throw new Error(`The component ${ɵstringify(component)} is not yet compiled!`);
        }
        return ((template.compMeta.template)).ngContentSelectors;
    }
    /**
     * @template T
     * @param {?} moduleType
     * @param {?} isSync
     * @return {?}
     */
    _compileModuleAndComponents(moduleType, isSync) {
        const /** @type {?} */ loadingPromise = this._loadModules(moduleType, isSync);
        const /** @type {?} */ createResult = () => {
            this._compileComponents(moduleType, null);
            return this._compileModule(moduleType);
        };
        if (isSync) {
            return new SyncAsyncResult(createResult());
        }
        else {
            return new SyncAsyncResult(null, loadingPromise.then(createResult));
        }
    }
    /**
     * @template T
     * @param {?} moduleType
     * @param {?} isSync
     * @return {?}
     */
    _compileModuleAndAllComponents(moduleType, isSync) {
        const /** @type {?} */ loadingPromise = this._loadModules(moduleType, isSync);
        const /** @type {?} */ createResult = () => {
            const /** @type {?} */ componentFactories = [];
            this._compileComponents(moduleType, componentFactories);
            return new ModuleWithComponentFactories(this._compileModule(moduleType), componentFactories);
        };
        if (isSync) {
            return new SyncAsyncResult(createResult());
        }
        else {
            return new SyncAsyncResult(null, loadingPromise.then(createResult));
        }
    }
    /**
     * @param {?} mainModule
     * @param {?} isSync
     * @return {?}
     */
    _loadModules(mainModule, isSync) {
        const /** @type {?} */ loadingPromises = [];
        const /** @type {?} */ ngModule = ((this._metadataResolver.getNgModuleMetadata(mainModule)));
        // Note: the loadingPromise for a module only includes the loading of the exported directives
        // of imported modules.
        // However, for runtime compilation, we want to transitively compile all modules,
        // so we also need to call loadNgModuleDirectiveAndPipeMetadata for all nested modules.
        ngModule.transitiveModule.modules.forEach((localModuleMeta) => {
            loadingPromises.push(this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(localModuleMeta.reference, isSync));
        });
        return Promise.all(loadingPromises);
    }
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    _compileModule(moduleType) {
        let /** @type {?} */ ngModuleFactory = ((this._compiledNgModuleCache.get(moduleType)));
        if (!ngModuleFactory) {
            const /** @type {?} */ moduleMeta = ((this._metadataResolver.getNgModuleMetadata(moduleType)));
            // Always provide a bound Compiler
            const /** @type {?} */ extraProviders = [this._metadataResolver.getProviderMetadata(new ProviderMeta(Compiler, { useFactory: () => new ModuleBoundCompiler(this, moduleMeta.type.reference) }))];
            const /** @type {?} */ compileResult = this._ngModuleCompiler.compile(moduleMeta, extraProviders);
            if (!this._compilerConfig.useJit) {
                ngModuleFactory =
                    interpretStatements(compileResult.statements, [compileResult.ngModuleFactoryVar])[0];
            }
            else {
                ngModuleFactory = jitStatements(ngModuleJitUrl(moduleMeta), compileResult.statements, [compileResult.ngModuleFactoryVar])[0];
            }
            this._compiledNgModuleCache.set(moduleMeta.type.reference, ngModuleFactory);
        }
        return ngModuleFactory;
    }
    /**
     * \@internal
     * @param {?} mainModule
     * @param {?} allComponentFactories
     * @return {?}
     */
    _compileComponents(mainModule, allComponentFactories) {
        const /** @type {?} */ ngModule = ((this._metadataResolver.getNgModuleMetadata(mainModule)));
        const /** @type {?} */ moduleByDirective = new Map();
        const /** @type {?} */ templates = new Set();
        ngModule.transitiveModule.modules.forEach((localModuleSummary) => {
            const /** @type {?} */ localModuleMeta = ((this._metadataResolver.getNgModuleMetadata(localModuleSummary.reference)));
            localModuleMeta.declaredDirectives.forEach((dirIdentifier) => {
                moduleByDirective.set(dirIdentifier.reference, localModuleMeta);
                const /** @type {?} */ dirMeta = this._metadataResolver.getDirectiveMetadata(dirIdentifier.reference);
                if (dirMeta.isComponent) {
                    templates.add(this._createCompiledTemplate(dirMeta, localModuleMeta));
                    if (allComponentFactories) {
                        const /** @type {?} */ template = this._createCompiledHostTemplate(dirMeta.type.reference, localModuleMeta);
                        templates.add(template);
                        allComponentFactories.push(/** @type {?} */ (dirMeta.componentFactory));
                    }
                }
            });
        });
        ngModule.transitiveModule.modules.forEach((localModuleSummary) => {
            const /** @type {?} */ localModuleMeta = ((this._metadataResolver.getNgModuleMetadata(localModuleSummary.reference)));
            localModuleMeta.declaredDirectives.forEach((dirIdentifier) => {
                const /** @type {?} */ dirMeta = this._metadataResolver.getDirectiveMetadata(dirIdentifier.reference);
                if (dirMeta.isComponent) {
                    dirMeta.entryComponents.forEach((entryComponentType) => {
                        const /** @type {?} */ moduleMeta = ((moduleByDirective.get(entryComponentType.componentType)));
                        templates.add(this._createCompiledHostTemplate(entryComponentType.componentType, moduleMeta));
                    });
                }
            });
            localModuleMeta.entryComponents.forEach((entryComponentType) => {
                const /** @type {?} */ moduleMeta = ((moduleByDirective.get(entryComponentType.componentType)));
                templates.add(this._createCompiledHostTemplate(entryComponentType.componentType, moduleMeta));
            });
        });
        templates.forEach((template) => this._compileTemplate(template));
    }
    /**
     * @param {?} type
     * @return {?}
     */
    clearCacheFor(type) {
        this._compiledNgModuleCache.delete(type);
        this._metadataResolver.clearCacheFor(type);
        this._compiledHostTemplateCache.delete(type);
        const /** @type {?} */ compiledTemplate = this._compiledTemplateCache.get(type);
        if (compiledTemplate) {
            this._compiledTemplateCache.delete(type);
        }
    }
    /**
     * @return {?}
     */
    clearCache() {
        this._metadataResolver.clearCache();
        this._compiledTemplateCache.clear();
        this._compiledHostTemplateCache.clear();
        this._compiledNgModuleCache.clear();
    }
    /**
     * @param {?} compType
     * @param {?} ngModule
     * @return {?}
     */
    _createCompiledHostTemplate(compType, ngModule) {
        if (!ngModule) {
            throw new Error(`Component ${ɵstringify(compType)} is not part of any NgModule or the module has not been imported into your module.`);
        }
        let /** @type {?} */ compiledTemplate = this._compiledHostTemplateCache.get(compType);
        if (!compiledTemplate) {
            const /** @type {?} */ compMeta = this._metadataResolver.getDirectiveMetadata(compType);
            assertComponent(compMeta);
            const /** @type {?} */ componentFactory = (compMeta.componentFactory);
            const /** @type {?} */ hostClass = this._metadataResolver.getHostComponentType(compType);
            const /** @type {?} */ hostMeta = createHostComponentMeta(hostClass, compMeta, /** @type {?} */ (ɵgetComponentViewDefinitionFactory(componentFactory)));
            compiledTemplate =
                new CompiledTemplate(true, compMeta.type, hostMeta, ngModule, [compMeta.type]);
            this._compiledHostTemplateCache.set(compType, compiledTemplate);
        }
        return compiledTemplate;
    }
    /**
     * @param {?} compMeta
     * @param {?} ngModule
     * @return {?}
     */
    _createCompiledTemplate(compMeta, ngModule) {
        let /** @type {?} */ compiledTemplate = this._compiledTemplateCache.get(compMeta.type.reference);
        if (!compiledTemplate) {
            assertComponent(compMeta);
            compiledTemplate = new CompiledTemplate(false, compMeta.type, compMeta, ngModule, ngModule.transitiveModule.directives);
            this._compiledTemplateCache.set(compMeta.type.reference, compiledTemplate);
        }
        return compiledTemplate;
    }
    /**
     * @param {?} template
     * @return {?}
     */
    _compileTemplate(template) {
        if (template.isCompiled) {
            return;
        }
        const /** @type {?} */ compMeta = template.compMeta;
        const /** @type {?} */ externalStylesheetsByModuleUrl = new Map();
        const /** @type {?} */ stylesCompileResult = this._styleCompiler.compileComponent(compMeta);
        stylesCompileResult.externalStylesheets.forEach((r) => { externalStylesheetsByModuleUrl.set(/** @type {?} */ ((r.meta.moduleUrl)), r); });
        this._resolveStylesCompileResult(stylesCompileResult.componentStylesheet, externalStylesheetsByModuleUrl);
        const /** @type {?} */ directives = template.directives.map(dir => this._metadataResolver.getDirectiveSummary(dir.reference));
        const /** @type {?} */ pipes = template.ngModule.transitiveModule.pipes.map(pipe => this._metadataResolver.getPipeSummary(pipe.reference));
        const { template: parsedTemplate, pipes: usedPipes } = this._templateParser.parse(compMeta, /** @type {?} */ ((((compMeta.template)).template)), directives, pipes, template.ngModule.schemas, templateSourceUrl(template.ngModule.type, template.compMeta, /** @type {?} */ ((template.compMeta.template))));
        const /** @type {?} */ compileResult = this._viewCompiler.compileComponent(compMeta, parsedTemplate, variable(stylesCompileResult.componentStylesheet.stylesVar), usedPipes);
        const /** @type {?} */ statements = stylesCompileResult.componentStylesheet.statements.concat(compileResult.statements);
        let /** @type {?} */ viewClassAndRendererTypeVars = compMeta.isHost ?
            [compileResult.viewClassVar] :
            [compileResult.viewClassVar, compileResult.rendererTypeVar];
        let /** @type {?} */ viewClass;
        let /** @type {?} */ rendererType;
        if (!this._compilerConfig.useJit) {
            [viewClass, rendererType] = interpretStatements(statements, viewClassAndRendererTypeVars);
        }
        else {
            [viewClass, rendererType] = jitStatements(templateJitUrl(template.ngModule.type, template.compMeta), statements, viewClassAndRendererTypeVars);
        }
        template.compiled(viewClass, rendererType);
    }
    /**
     * @param {?} result
     * @param {?} externalStylesheetsByModuleUrl
     * @return {?}
     */
    _resolveStylesCompileResult(result, externalStylesheetsByModuleUrl) {
        result.dependencies.forEach((dep, i) => {
            const /** @type {?} */ nestedCompileResult = ((externalStylesheetsByModuleUrl.get(dep.moduleUrl)));
            const /** @type {?} */ nestedStylesArr = this._resolveAndEvalStylesCompileResult(nestedCompileResult, externalStylesheetsByModuleUrl);
            dep.valuePlaceholder.reference = nestedStylesArr;
        });
    }
    /**
     * @param {?} result
     * @param {?} externalStylesheetsByModuleUrl
     * @return {?}
     */
    _resolveAndEvalStylesCompileResult(result, externalStylesheetsByModuleUrl) {
        this._resolveStylesCompileResult(result, externalStylesheetsByModuleUrl);
        if (!this._compilerConfig.useJit) {
            return interpretStatements(result.statements, [result.stylesVar])[0];
        }
        else {
            return jitStatements(sharedStylesheetJitUrl(result.meta, this._sharedStylesheetCount++), result.statements, [result.stylesVar])[0];
        }
    }
}
JitCompiler.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
JitCompiler.ctorParameters = () => [
    { type: Injector, },
    { type: CompileMetadataResolver, },
    { type: TemplateParser, },
    { type: StyleCompiler, },
    { type: ViewCompiler, },
    { type: NgModuleCompiler, },
    { type: CompilerConfig, },
    { type: ɵConsole, },
];
class CompiledTemplate {
    /**
     * @param {?} isHost
     * @param {?} compType
     * @param {?} compMeta
     * @param {?} ngModule
     * @param {?} directives
     */
    constructor(isHost, compType, compMeta, ngModule, directives) {
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
    compiled(viewClass, rendererType) {
        this._viewClass = viewClass;
        ((this.compMeta.componentViewType)).setDelegate(viewClass);
        for (let /** @type {?} */ prop in rendererType) {
            ((this.compMeta.rendererType))[prop] = rendererType[prop];
        }
        this.isCompiled = true;
    }
}
/**
 * @param {?} meta
 * @return {?}
 */
function assertComponent(meta) {
    if (!meta.isComponent) {
        throw new Error(`Could not compile '${identifierName(meta.type)}' because it is not a component.`);
    }
}
/**
 * Implements `Compiler` by delegating to the JitCompiler using a known module.
 */
class ModuleBoundCompiler {
    /**
     * @param {?} _delegate
     * @param {?} _ngModule
     */
    constructor(_delegate, _ngModule) {
        this._delegate = _delegate;
        this._ngModule = _ngModule;
    }
    /**
     * @return {?}
     */
    get _injector() { return this._delegate.injector; }
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    compileModuleSync(moduleType) {
        return this._delegate.compileModuleSync(moduleType);
    }
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    compileModuleAsync(moduleType) {
        return this._delegate.compileModuleAsync(moduleType);
    }
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    compileModuleAndAllComponentsSync(moduleType) {
        return this._delegate.compileModuleAndAllComponentsSync(moduleType);
    }
    /**
     * @template T
     * @param {?} moduleType
     * @return {?}
     */
    compileModuleAndAllComponentsAsync(moduleType) {
        return this._delegate.compileModuleAndAllComponentsAsync(moduleType);
    }
    /**
     * @param {?} component
     * @return {?}
     */
    getNgContentSelectors(component) {
        return this._delegate.getNgContentSelectors(component);
    }
    /**
     * Clears all caches
     * @return {?}
     */
    clearCache() { this._delegate.clearCache(); }
    /**
     * Clears the cache for the given component/ngModule.
     * @param {?} type
     * @return {?}
     */
    clearCacheFor(type) { this._delegate.clearCacheFor(type); }
}

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
class MessageBundle {
    /**
     * @param {?} _htmlParser
     * @param {?} _implicitTags
     * @param {?} _implicitAttrs
     * @param {?=} _locale
     */
    constructor(_htmlParser, _implicitTags, _implicitAttrs, _locale = null) {
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
    updateFromTemplate(html, url, interpolationConfig) {
        const /** @type {?} */ htmlParserResult = this._htmlParser.parse(html, url, true, interpolationConfig);
        if (htmlParserResult.errors.length) {
            return htmlParserResult.errors;
        }
        const /** @type {?} */ i18nParserResult = extractMessages(htmlParserResult.rootNodes, interpolationConfig, this._implicitTags, this._implicitAttrs);
        if (i18nParserResult.errors.length) {
            return i18nParserResult.errors;
        }
        this._messages.push(...i18nParserResult.messages);
        return [];
    }
    /**
     * @return {?}
     */
    getMessages() { return this._messages; }
    /**
     * @param {?} serializer
     * @param {?=} filterSources
     * @return {?}
     */
    write(serializer, filterSources) {
        const /** @type {?} */ messages = {};
        const /** @type {?} */ mapperVisitor = new MapPlaceholderNames();
        // Deduplicate messages based on their ID
        this._messages.forEach(message => {
            const /** @type {?} */ id = serializer.digest(message);
            if (!messages.hasOwnProperty(id)) {
                messages[id] = message;
            }
            else {
                messages[id].sources.push(...message.sources);
            }
        });
        // Transform placeholder names using the serializer mapping
        const /** @type {?} */ msgList = Object.keys(messages).map(id => {
            const /** @type {?} */ mapper = serializer.createNameMapper(messages[id]);
            const /** @type {?} */ src = messages[id];
            const /** @type {?} */ nodes = mapper ? mapperVisitor.convert(src.nodes, mapper) : src.nodes;
            let /** @type {?} */ transformedMessage = new Message(nodes, {}, {}, src.meaning, src.description, id);
            transformedMessage.sources = src.sources;
            if (filterSources) {
                transformedMessage.sources.forEach((source) => source.filePath = filterSources(source.filePath));
            }
            return transformedMessage;
        });
        return serializer.write(msgList, this._locale);
    }
}
class MapPlaceholderNames extends CloneVisitor {
    /**
     * @param {?} nodes
     * @param {?} mapper
     * @return {?}
     */
    convert(nodes, mapper) {
        return mapper ? nodes.map(n => n.visit(this, mapper)) : nodes;
    }
    /**
     * @param {?} ph
     * @param {?} mapper
     * @return {?}
     */
    visitTagPlaceholder(ph, mapper) {
        const /** @type {?} */ startName = ((mapper.toPublicName(ph.startName)));
        const /** @type {?} */ closeName = ph.closeName ? ((mapper.toPublicName(ph.closeName))) : ph.closeName;
        const /** @type {?} */ children = ph.children.map(n => n.visit(this, mapper));
        return new TagPlaceholder(ph.tag, ph.attrs, startName, closeName, children, ph.isVoid, ph.sourceSpan);
    }
    /**
     * @param {?} ph
     * @param {?} mapper
     * @return {?}
     */
    visitPlaceholder(ph, mapper) {
        return new Placeholder(ph.value, /** @type {?} */ ((mapper.toPublicName(ph.name))), ph.sourceSpan);
    }
    /**
     * @param {?} ph
     * @param {?} mapper
     * @return {?}
     */
    visitIcuPlaceholder(ph, mapper) {
        return new IcuPlaceholder(ph.value, /** @type {?} */ ((mapper.toPublicName(ph.name))), ph.sourceSpan);
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
 * Extract i18n messages from source code
 */
class Extractor {
    /**
     * @param {?} host
     * @param {?} staticSymbolResolver
     * @param {?} messageBundle
     * @param {?} metadataResolver
     */
    constructor(host, staticSymbolResolver, messageBundle, metadataResolver) {
        this.host = host;
        this.staticSymbolResolver = staticSymbolResolver;
        this.messageBundle = messageBundle;
        this.metadataResolver = metadataResolver;
    }
    /**
     * @param {?} rootFiles
     * @return {?}
     */
    extract(rootFiles) {
        const /** @type {?} */ programSymbols = extractProgramSymbols(this.staticSymbolResolver, rootFiles, this.host);
        const { files, ngModules } = analyzeAndValidateNgModules(programSymbols, this.host, this.metadataResolver);
        return Promise
            .all(ngModules.map(ngModule => this.metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false)))
            .then(() => {
            const /** @type {?} */ errors = [];
            files.forEach(file => {
                const /** @type {?} */ compMetas = [];
                file.directives.forEach(directiveType => {
                    const /** @type {?} */ dirMeta = this.metadataResolver.getDirectiveMetadata(directiveType);
                    if (dirMeta && dirMeta.isComponent) {
                        compMetas.push(dirMeta);
                    }
                });
                compMetas.forEach(compMeta => {
                    const /** @type {?} */ html = ((((compMeta.template)).template));
                    const /** @type {?} */ interpolationConfig = InterpolationConfig.fromArray(/** @type {?} */ ((compMeta.template)).interpolation);
                    errors.push(...((this.messageBundle.updateFromTemplate(html, file.srcUrl, interpolationConfig))));
                });
            });
            if (errors.length) {
                throw new Error(errors.map(e => e.toString()).join('\n'));
            }
            return this.messageBundle;
        });
    }
    /**
     * @param {?} host
     * @param {?} locale
     * @return {?}
     */
    static create(host, locale) {
        const /** @type {?} */ htmlParser = new I18NHtmlParser(new HtmlParser());
        const /** @type {?} */ urlResolver = createOfflineCompileUrlResolver();
        const /** @type {?} */ symbolCache = new StaticSymbolCache();
        const /** @type {?} */ summaryResolver = new AotSummaryResolver(host, symbolCache);
        const /** @type {?} */ staticSymbolResolver = new StaticSymbolResolver(host, symbolCache, summaryResolver);
        const /** @type {?} */ staticReflector = new StaticReflector(summaryResolver, staticSymbolResolver);
        StaticAndDynamicReflectionCapabilities.install(staticReflector);
        const /** @type {?} */ config = new CompilerConfig({ defaultEncapsulation: ViewEncapsulation.Emulated, useJit: false });
        const /** @type {?} */ normalizer = new DirectiveNormalizer({ get: (url) => host.loadResource(url) }, urlResolver, htmlParser, config);
        const /** @type {?} */ elementSchemaRegistry = new DomElementSchemaRegistry();
        const /** @type {?} */ resolver = new CompileMetadataResolver(config, new NgModuleResolver(staticReflector), new DirectiveResolver(staticReflector), new PipeResolver(staticReflector), summaryResolver, elementSchemaRegistry, normalizer, new ɵConsole(), symbolCache, staticReflector);
        // TODO(vicb): implicit tags & attributes
        const /** @type {?} */ messageBundle = new MessageBundle(htmlParser, [], {}, locale);
        const /** @type {?} */ extractor = new Extractor(host, staticSymbolResolver, messageBundle, resolver);
        return { extractor, staticReflector };
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
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const _NO_RESOURCE_LOADER = {
    /**
     * @param {?} url
     * @return {?}
     */
    get(url) {
        throw new Error(`No ResourceLoader implementation has been provided. Can't read the url "${url}"`);
    }
};
const baseHtmlParser = new InjectionToken('HtmlParser');
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
const COMPILER_PROVIDERS = [
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
class JitCompilerFactory {
    /**
     * @param {?} defaultOptions
     */
    constructor(defaultOptions) {
        const compilerOptions = {
            useDebug: isDevMode(),
            useJit: true,
            defaultEncapsulation: ViewEncapsulation.Emulated,
            missingTranslation: MissingTranslationStrategy.Warning,
            enableLegacyTemplate: true,
        };
        this._defaultOptions = [compilerOptions, ...defaultOptions];
    }
    /**
     * @param {?=} options
     * @return {?}
     */
    createCompiler(options = []) {
        const /** @type {?} */ opts = _mergeOptions(this._defaultOptions.concat(options));
        const /** @type {?} */ injector = ReflectiveInjector.resolveAndCreate([
            COMPILER_PROVIDERS, {
                provide: CompilerConfig,
                useFactory: () => {
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
    }
}
JitCompilerFactory.decorators = [
    { type: CompilerInjectable },
];
/**
 * @nocollapse
 */
JitCompilerFactory.ctorParameters = () => [
    { type: Array, decorators: [{ type: Inject, args: [COMPILER_OPTIONS,] },] },
];
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
const platformCoreDynamic = createPlatformFactory(platformCore, 'coreDynamic', [
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
        useJit: _lastDefined(optionsArr.map(options => options.useJit)),
        defaultEncapsulation: _lastDefined(optionsArr.map(options => options.defaultEncapsulation)),
        providers: _mergeArrays(optionsArr.map(options => ((options.providers)))),
        missingTranslation: _lastDefined(optionsArr.map(options => options.missingTranslation)),
    };
}
/**
 * @template T
 * @param {?} args
 * @return {?}
 */
function _lastDefined(args) {
    for (let /** @type {?} */ i = args.length - 1; i >= 0; i--) {
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
    const /** @type {?} */ result = [];
    parts.forEach((part) => part && result.push(...part));
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
class ImportResolver {
    /**
     * Converts a file path to a module name that can be used as an `import.
     * I.e. `path/to/importedFile.ts` should be imported by `path/to/containingFile.ts`.
     * @abstract
     * @param {?} importedFilePath
     * @param {?} containingFilePath
     * @return {?}
     */
    fileNameToModuleName(importedFilePath, containingFilePath) { }
    /**
     * Converts the given StaticSymbol into another StaticSymbol that should be used
     * to generate the import from.
     * @abstract
     * @param {?} symbol
     * @return {?}
     */
    getImportAs(symbol) { }
    /**
     * Determine the arity of a type.
     * @abstract
     * @param {?} symbol
     * @return {?}
     */
    getTypeArity(symbol) { }
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
