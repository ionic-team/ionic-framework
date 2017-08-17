/**
 * @license Angular v4.1.3
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/common', '@angular/core'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.platformBrowser = global.ng.platformBrowser || {}),global.ng.common,global.ng.core));
}(this, (function (exports,_angular_common,_angular_core) { 'use strict';

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
var _DOM = ((null));
/**
 * @return {?}
 */
function getDOM() {
    return _DOM;
}
/**
 * @param {?} adapter
 * @return {?}
 */
/**
 * @param {?} adapter
 * @return {?}
 */
function setRootDomAdapter(adapter) {
    if (!_DOM) {
        _DOM = adapter;
    }
}
/**
 * Provides DOM operations in an environment-agnostic way.
 *
 * \@security Tread carefully! Interacting with the DOM directly is dangerous and
 * can introduce XSS risks.
 * @abstract
 */
var DomAdapter = (function () {
    function DomAdapter() {
        this.resourceLoaderType = ((null));
    }
    /**
     * @abstract
     * @param {?} element
     * @param {?} name
     * @return {?}
     */
    DomAdapter.prototype.hasProperty = function (element, name) { };
    /**
     * @abstract
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    DomAdapter.prototype.setProperty = function (el, name, value) { };
    /**
     * @abstract
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    DomAdapter.prototype.getProperty = function (el, name) { };
    /**
     * @abstract
     * @param {?} el
     * @param {?} methodName
     * @param {?} args
     * @return {?}
     */
    DomAdapter.prototype.invoke = function (el, methodName, args) { };
    /**
     * @abstract
     * @param {?} error
     * @return {?}
     */
    DomAdapter.prototype.logError = function (error) { };
    /**
     * @abstract
     * @param {?} error
     * @return {?}
     */
    DomAdapter.prototype.log = function (error) { };
    /**
     * @abstract
     * @param {?} error
     * @return {?}
     */
    DomAdapter.prototype.logGroup = function (error) { };
    /**
     * @abstract
     * @return {?}
     */
    DomAdapter.prototype.logGroupEnd = function () { };
    Object.defineProperty(DomAdapter.prototype, "attrToPropMap", {
        /**
         * Maps attribute names to their corresponding property names for cases
         * where attribute name doesn't match property name.
         * @return {?}
         */
        get: function () { return this._attrToPropMap; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._attrToPropMap = value; },
        enumerable: true,
        configurable: true
    });
    
    
    /**
     * @abstract
     * @param {?} nodeA
     * @param {?} nodeB
     * @return {?}
     */
    DomAdapter.prototype.contains = function (nodeA, nodeB) { };
    /**
     * @abstract
     * @param {?} templateHtml
     * @return {?}
     */
    DomAdapter.prototype.parse = function (templateHtml) { };
    /**
     * @abstract
     * @param {?} el
     * @param {?} selector
     * @return {?}
     */
    DomAdapter.prototype.querySelector = function (el, selector) { };
    /**
     * @abstract
     * @param {?} el
     * @param {?} selector
     * @return {?}
     */
    DomAdapter.prototype.querySelectorAll = function (el, selector) { };
    /**
     * @abstract
     * @param {?} el
     * @param {?} evt
     * @param {?} listener
     * @return {?}
     */
    DomAdapter.prototype.on = function (el, evt, listener) { };
    /**
     * @abstract
     * @param {?} el
     * @param {?} evt
     * @param {?} listener
     * @return {?}
     */
    DomAdapter.prototype.onAndCancel = function (el, evt, listener) { };
    /**
     * @abstract
     * @param {?} el
     * @param {?} evt
     * @return {?}
     */
    DomAdapter.prototype.dispatchEvent = function (el, evt) { };
    /**
     * @abstract
     * @param {?} eventType
     * @return {?}
     */
    DomAdapter.prototype.createMouseEvent = function (eventType) { };
    /**
     * @abstract
     * @param {?} eventType
     * @return {?}
     */
    DomAdapter.prototype.createEvent = function (eventType) { };
    /**
     * @abstract
     * @param {?} evt
     * @return {?}
     */
    DomAdapter.prototype.preventDefault = function (evt) { };
    /**
     * @abstract
     * @param {?} evt
     * @return {?}
     */
    DomAdapter.prototype.isPrevented = function (evt) { };
    /**
     * @abstract
     * @param {?} el
     * @return {?}
     */
    DomAdapter.prototype.getInnerHTML = function (el) { };
    /**
     * Returns content if el is a <template> element, null otherwise.
     * @abstract
     * @param {?} el
     * @return {?}
     */
    DomAdapter.prototype.getTemplateContent = function (el) { };
    /**
     * @abstract
     * @param {?} el
     * @return {?}
     */
    DomAdapter.prototype.getOuterHTML = function (el) { };
    /**
     * @abstract
     * @param {?} node
     * @return {?}
     */
    DomAdapter.prototype.nodeName = function (node) { };
    /**
     * @abstract
     * @param {?} node
     * @return {?}
     */
    DomAdapter.prototype.nodeValue = function (node) { };
    /**
     * @abstract
     * @param {?} node
     * @return {?}
     */
    DomAdapter.prototype.type = function (node) { };
    /**
     * @abstract
     * @param {?} node
     * @return {?}
     */
    DomAdapter.prototype.content = function (node) { };
    /**
     * @abstract
     * @param {?} el
     * @return {?}
     */
    DomAdapter.prototype.firstChild = function (el) { };
    /**
     * @abstract
     * @param {?} el
     * @return {?}
     */
    DomAdapter.prototype.nextSibling = function (el) { };
    /**
     * @abstract
     * @param {?} el
     * @return {?}
     */
    DomAdapter.prototype.parentElement = function (el) { };
    /**
     * @abstract
     * @param {?} el
     * @return {?}
     */
    DomAdapter.prototype.childNodes = function (el) { };
    /**
     * @abstract
     * @param {?} el
     * @return {?}
     */
    DomAdapter.prototype.childNodesAsList = function (el) { };
    /**
     * @abstract
     * @param {?} el
     * @return {?}
     */
    DomAdapter.prototype.clearNodes = function (el) { };
    /**
     * @abstract
     * @param {?} el
     * @param {?} node
     * @return {?}
     */
    DomAdapter.prototype.appendChild = function (el, node) { };
    /**
     * @abstract
     * @param {?} el
     * @param {?} node
     * @return {?}
     */
    DomAdapter.prototype.removeChild = function (el, node) { };
    /**
     * @abstract
     * @param {?} el
     * @param {?} newNode
     * @param {?} oldNode
     * @return {?}
     */
    DomAdapter.prototype.replaceChild = function (el, newNode, oldNode) { };
    /**
     * @abstract
     * @param {?} el
     * @return {?}
     */
    DomAdapter.prototype.remove = function (el) { };
    /**
     * @abstract
     * @param {?} parent
     * @param {?} ref
     * @param {?} node
     * @return {?}
     */
    DomAdapter.prototype.insertBefore = function (parent, ref, node) { };
    /**
     * @abstract
     * @param {?} parent
     * @param {?} ref
     * @param {?} nodes
     * @return {?}
     */
    DomAdapter.prototype.insertAllBefore = function (parent, ref, nodes) { };
    /**
     * @abstract
     * @param {?} parent
     * @param {?} el
     * @param {?} node
     * @return {?}
     */
    DomAdapter.prototype.insertAfter = function (parent, el, node) { };
    /**
     * @abstract
     * @param {?} el
     * @param {?} value
     * @return {?}
     */
    DomAdapter.prototype.setInnerHTML = function (el, value) { };
    /**
     * @abstract
     * @param {?} el
     * @return {?}
     */
    DomAdapter.prototype.getText = function (el) { };
    /**
     * @abstract
     * @param {?} el
     * @param {?} value
     * @return {?}
     */
    DomAdapter.prototype.setText = function (el, value) { };
    /**
     * @abstract
     * @param {?} el
     * @return {?}
     */
    DomAdapter.prototype.getValue = function (el) { };
    /**
     * @abstract
     * @param {?} el
     * @param {?} value
     * @return {?}
     */
    DomAdapter.prototype.setValue = function (el, value) { };
    /**
     * @abstract
     * @param {?} el
     * @return {?}
     */
    DomAdapter.prototype.getChecked = function (el) { };
    /**
     * @abstract
     * @param {?} el
     * @param {?} value
     * @return {?}
     */
    DomAdapter.prototype.setChecked = function (el, value) { };
    /**
     * @abstract
     * @param {?} text
     * @return {?}
     */
    DomAdapter.prototype.createComment = function (text) { };
    /**
     * @abstract
     * @param {?} html
     * @return {?}
     */
    DomAdapter.prototype.createTemplate = function (html) { };
    /**
     * @abstract
     * @param {?} tagName
     * @param {?=} doc
     * @return {?}
     */
    DomAdapter.prototype.createElement = function (tagName, doc) { };
    /**
     * @abstract
     * @param {?} ns
     * @param {?} tagName
     * @param {?=} doc
     * @return {?}
     */
    DomAdapter.prototype.createElementNS = function (ns, tagName, doc) { };
    /**
     * @abstract
     * @param {?} text
     * @param {?=} doc
     * @return {?}
     */
    DomAdapter.prototype.createTextNode = function (text, doc) { };
    /**
     * @abstract
     * @param {?} attrName
     * @param {?} attrValue
     * @param {?=} doc
     * @return {?}
     */
    DomAdapter.prototype.createScriptTag = function (attrName, attrValue, doc) { };
    /**
     * @abstract
     * @param {?} css
     * @param {?=} doc
     * @return {?}
     */
    DomAdapter.prototype.createStyleElement = function (css, doc) { };
    /**
     * @abstract
     * @param {?} el
     * @return {?}
     */
    DomAdapter.prototype.createShadowRoot = function (el) { };
    /**
     * @abstract
     * @param {?} el
     * @return {?}
     */
    DomAdapter.prototype.getShadowRoot = function (el) { };
    /**
     * @abstract
     * @param {?} el
     * @return {?}
     */
    DomAdapter.prototype.getHost = function (el) { };
    /**
     * @abstract
     * @param {?} el
     * @return {?}
     */
    DomAdapter.prototype.getDistributedNodes = function (el) { };
    /**
     * @abstract
     * @param {?} node
     * @return {?}
     */
    DomAdapter.prototype.clone /*<T extends Node>*/ = function (node) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} name
     * @return {?}
     */
    DomAdapter.prototype.getElementsByClassName = function (element, name) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} name
     * @return {?}
     */
    DomAdapter.prototype.getElementsByTagName = function (element, name) { };
    /**
     * @abstract
     * @param {?} element
     * @return {?}
     */
    DomAdapter.prototype.classList = function (element) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} className
     * @return {?}
     */
    DomAdapter.prototype.addClass = function (element, className) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} className
     * @return {?}
     */
    DomAdapter.prototype.removeClass = function (element, className) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} className
     * @return {?}
     */
    DomAdapter.prototype.hasClass = function (element, className) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} styleName
     * @param {?} styleValue
     * @return {?}
     */
    DomAdapter.prototype.setStyle = function (element, styleName, styleValue) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} styleName
     * @return {?}
     */
    DomAdapter.prototype.removeStyle = function (element, styleName) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} styleName
     * @return {?}
     */
    DomAdapter.prototype.getStyle = function (element, styleName) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} styleName
     * @param {?=} styleValue
     * @return {?}
     */
    DomAdapter.prototype.hasStyle = function (element, styleName, styleValue) { };
    /**
     * @abstract
     * @param {?} element
     * @return {?}
     */
    DomAdapter.prototype.tagName = function (element) { };
    /**
     * @abstract
     * @param {?} element
     * @return {?}
     */
    DomAdapter.prototype.attributeMap = function (element) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} attribute
     * @return {?}
     */
    DomAdapter.prototype.hasAttribute = function (element, attribute) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} ns
     * @param {?} attribute
     * @return {?}
     */
    DomAdapter.prototype.hasAttributeNS = function (element, ns, attribute) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} attribute
     * @return {?}
     */
    DomAdapter.prototype.getAttribute = function (element, attribute) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} ns
     * @param {?} attribute
     * @return {?}
     */
    DomAdapter.prototype.getAttributeNS = function (element, ns, attribute) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    DomAdapter.prototype.setAttribute = function (element, name, value) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} ns
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    DomAdapter.prototype.setAttributeNS = function (element, ns, name, value) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} attribute
     * @return {?}
     */
    DomAdapter.prototype.removeAttribute = function (element, attribute) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} ns
     * @param {?} attribute
     * @return {?}
     */
    DomAdapter.prototype.removeAttributeNS = function (element, ns, attribute) { };
    /**
     * @abstract
     * @param {?} el
     * @return {?}
     */
    DomAdapter.prototype.templateAwareRoot = function (el) { };
    /**
     * @abstract
     * @return {?}
     */
    DomAdapter.prototype.createHtmlDocument = function () { };
    /**
     * @abstract
     * @param {?} el
     * @return {?}
     */
    DomAdapter.prototype.getBoundingClientRect = function (el) { };
    /**
     * @abstract
     * @param {?} doc
     * @return {?}
     */
    DomAdapter.prototype.getTitle = function (doc) { };
    /**
     * @abstract
     * @param {?} doc
     * @param {?} newTitle
     * @return {?}
     */
    DomAdapter.prototype.setTitle = function (doc, newTitle) { };
    /**
     * @abstract
     * @param {?} n
     * @param {?} selector
     * @return {?}
     */
    DomAdapter.prototype.elementMatches = function (n, selector) { };
    /**
     * @abstract
     * @param {?} el
     * @return {?}
     */
    DomAdapter.prototype.isTemplateElement = function (el) { };
    /**
     * @abstract
     * @param {?} node
     * @return {?}
     */
    DomAdapter.prototype.isTextNode = function (node) { };
    /**
     * @abstract
     * @param {?} node
     * @return {?}
     */
    DomAdapter.prototype.isCommentNode = function (node) { };
    /**
     * @abstract
     * @param {?} node
     * @return {?}
     */
    DomAdapter.prototype.isElementNode = function (node) { };
    /**
     * @abstract
     * @param {?} node
     * @return {?}
     */
    DomAdapter.prototype.hasShadowRoot = function (node) { };
    /**
     * @abstract
     * @param {?} node
     * @return {?}
     */
    DomAdapter.prototype.isShadowRoot = function (node) { };
    /**
     * @abstract
     * @param {?} node
     * @return {?}
     */
    DomAdapter.prototype.importIntoDoc /*<T extends Node>*/ = function (node) { };
    /**
     * @abstract
     * @param {?} node
     * @return {?}
     */
    DomAdapter.prototype.adoptNode /*<T extends Node>*/ = function (node) { };
    /**
     * @abstract
     * @param {?} element
     * @return {?}
     */
    DomAdapter.prototype.getHref = function (element) { };
    /**
     * @abstract
     * @param {?} event
     * @return {?}
     */
    DomAdapter.prototype.getEventKey = function (event) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} baseUrl
     * @param {?} href
     * @return {?}
     */
    DomAdapter.prototype.resolveAndSetHref = function (element, baseUrl, href) { };
    /**
     * @abstract
     * @return {?}
     */
    DomAdapter.prototype.supportsDOMEvents = function () { };
    /**
     * @abstract
     * @return {?}
     */
    DomAdapter.prototype.supportsNativeShadowDOM = function () { };
    /**
     * @abstract
     * @param {?} doc
     * @param {?} target
     * @return {?}
     */
    DomAdapter.prototype.getGlobalEventTarget = function (doc, target) { };
    /**
     * @abstract
     * @return {?}
     */
    DomAdapter.prototype.getHistory = function () { };
    /**
     * @abstract
     * @return {?}
     */
    DomAdapter.prototype.getLocation = function () { };
    /**
     * @abstract
     * @param {?} doc
     * @return {?}
     */
    DomAdapter.prototype.getBaseHref = function (doc) { };
    /**
     * @abstract
     * @return {?}
     */
    DomAdapter.prototype.resetBaseElement = function () { };
    /**
     * @abstract
     * @return {?}
     */
    DomAdapter.prototype.getUserAgent = function () { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    DomAdapter.prototype.setData = function (element, name, value) { };
    /**
     * @abstract
     * @param {?} element
     * @return {?}
     */
    DomAdapter.prototype.getComputedStyle = function (element) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} name
     * @return {?}
     */
    DomAdapter.prototype.getData = function (element, name) { };
    /**
     * @abstract
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    DomAdapter.prototype.setGlobalVar = function (name, value) { };
    /**
     * @abstract
     * @return {?}
     */
    DomAdapter.prototype.supportsWebAnimation = function () { };
    /**
     * @abstract
     * @return {?}
     */
    DomAdapter.prototype.performanceNow = function () { };
    /**
     * @abstract
     * @return {?}
     */
    DomAdapter.prototype.getAnimationPrefix = function () { };
    /**
     * @abstract
     * @return {?}
     */
    DomAdapter.prototype.getTransitionEnd = function () { };
    /**
     * @abstract
     * @return {?}
     */
    DomAdapter.prototype.supportsAnimation = function () { };
    /**
     * @abstract
     * @return {?}
     */
    DomAdapter.prototype.supportsCookies = function () { };
    /**
     * @abstract
     * @param {?} name
     * @return {?}
     */
    DomAdapter.prototype.getCookie = function (name) { };
    /**
     * @abstract
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    DomAdapter.prototype.setCookie = function (name, value) { };
    return DomAdapter;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Provides DOM operations in any browser environment.
 *
 * \@security Tread carefully! Interacting with the DOM directly is dangerous and
 * can introduce XSS risks.
 * @abstract
 */
var GenericBrowserDomAdapter = (function (_super) {
    __extends(GenericBrowserDomAdapter, _super);
    function GenericBrowserDomAdapter() {
        var _this = _super.call(this) || this;
        _this._animationPrefix = null;
        _this._transitionEnd = null;
        try {
            var element_1 = _this.createElement('div', document);
            if (_this.getStyle(element_1, 'animationName') != null) {
                _this._animationPrefix = '';
            }
            else {
                var domPrefixes = ['Webkit', 'Moz', 'O', 'ms'];
                for (var i = 0; i < domPrefixes.length; i++) {
                    if (_this.getStyle(element_1, domPrefixes[i] + 'AnimationName') != null) {
                        _this._animationPrefix = '-' + domPrefixes[i].toLowerCase() + '-';
                        break;
                    }
                }
            }
            var transEndEventNames_1 = {
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend',
                transition: 'transitionend'
            };
            Object.keys(transEndEventNames_1).forEach(function (key) {
                if (_this.getStyle(element_1, key) != null) {
                    _this._transitionEnd = transEndEventNames_1[key];
                }
            });
        }
        catch (e) {
            _this._animationPrefix = null;
            _this._transitionEnd = null;
        }
        return _this;
    }
    /**
     * @param {?} el
     * @return {?}
     */
    GenericBrowserDomAdapter.prototype.getDistributedNodes = function (el) { return ((el)).getDistributedNodes(); };
    /**
     * @param {?} el
     * @param {?} baseUrl
     * @param {?} href
     * @return {?}
     */
    GenericBrowserDomAdapter.prototype.resolveAndSetHref = function (el, baseUrl, href) {
        el.href = href == null ? baseUrl : baseUrl + '/../' + href;
    };
    /**
     * @return {?}
     */
    GenericBrowserDomAdapter.prototype.supportsDOMEvents = function () { return true; };
    /**
     * @return {?}
     */
    GenericBrowserDomAdapter.prototype.supportsNativeShadowDOM = function () {
        return typeof ((document.body)).createShadowRoot === 'function';
    };
    /**
     * @return {?}
     */
    GenericBrowserDomAdapter.prototype.getAnimationPrefix = function () { return this._animationPrefix ? this._animationPrefix : ''; };
    /**
     * @return {?}
     */
    GenericBrowserDomAdapter.prototype.getTransitionEnd = function () { return this._transitionEnd ? this._transitionEnd : ''; };
    /**
     * @return {?}
     */
    GenericBrowserDomAdapter.prototype.supportsAnimation = function () {
        return this._animationPrefix != null && this._transitionEnd != null;
    };
    return GenericBrowserDomAdapter;
}(DomAdapter));
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var _attrToPropMap = {
    'class': 'className',
    'innerHtml': 'innerHTML',
    'readonly': 'readOnly',
    'tabindex': 'tabIndex',
};
var DOM_KEY_LOCATION_NUMPAD = 3;
// Map to convert some key or keyIdentifier values to what will be returned by getEventKey
var _keyMap = {
    // The following values are here for cross-browser compatibility and to match the W3C standard
    // cf http://www.w3.org/TR/DOM-Level-3-Events-key/
    '\b': 'Backspace',
    '\t': 'Tab',
    '\x7F': 'Delete',
    '\x1B': 'Escape',
    'Del': 'Delete',
    'Esc': 'Escape',
    'Left': 'ArrowLeft',
    'Right': 'ArrowRight',
    'Up': 'ArrowUp',
    'Down': 'ArrowDown',
    'Menu': 'ContextMenu',
    'Scroll': 'ScrollLock',
    'Win': 'OS'
};
// There is a bug in Chrome for numeric keypad keys:
// https://code.google.com/p/chromium/issues/detail?id=155654
// 1, 2, 3 ... are reported as A, B, C ...
var _chromeNumKeyPadMap = {
    'A': '1',
    'B': '2',
    'C': '3',
    'D': '4',
    'E': '5',
    'F': '6',
    'G': '7',
    'H': '8',
    'I': '9',
    'J': '*',
    'K': '+',
    'M': '-',
    'N': '.',
    'O': '/',
    '\x60': '0',
    '\x90': 'NumLock'
};
var nodeContains;
if (_angular_core.ɵglobal['Node']) {
    nodeContains = _angular_core.ɵglobal['Node'].prototype.contains || function (node) {
        return !!(this.compareDocumentPosition(node) & 16);
    };
}
var BrowserDomAdapter = (function (_super) {
    __extends(BrowserDomAdapter, _super);
    function BrowserDomAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} templateHtml
     * @return {?}
     */
    BrowserDomAdapter.prototype.parse = function (templateHtml) { throw new Error('parse not implemented'); };
    /**
     * @return {?}
     */
    BrowserDomAdapter.makeCurrent = function () { setRootDomAdapter(new BrowserDomAdapter()); };
    /**
     * @param {?} element
     * @param {?} name
     * @return {?}
     */
    BrowserDomAdapter.prototype.hasProperty = function (element, name) { return name in element; };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    BrowserDomAdapter.prototype.setProperty = function (el, name, value) { ((el))[name] = value; };
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    BrowserDomAdapter.prototype.getProperty = function (el, name) { return ((el))[name]; };
    /**
     * @param {?} el
     * @param {?} methodName
     * @param {?} args
     * @return {?}
     */
    BrowserDomAdapter.prototype.invoke = function (el, methodName, args) { ((el))[methodName].apply(((el)), args); };
    /**
     * @param {?} error
     * @return {?}
     */
    BrowserDomAdapter.prototype.logError = function (error) {
        if (window.console) {
            if (console.error) {
                console.error(error);
            }
            else {
                console.log(error);
            }
        }
    };
    /**
     * @param {?} error
     * @return {?}
     */
    BrowserDomAdapter.prototype.log = function (error) {
        if (window.console) {
            window.console.log && window.console.log(error);
        }
    };
    /**
     * @param {?} error
     * @return {?}
     */
    BrowserDomAdapter.prototype.logGroup = function (error) {
        if (window.console) {
            window.console.group && window.console.group(error);
        }
    };
    /**
     * @return {?}
     */
    BrowserDomAdapter.prototype.logGroupEnd = function () {
        if (window.console) {
            window.console.groupEnd && window.console.groupEnd();
        }
    };
    Object.defineProperty(BrowserDomAdapter.prototype, "attrToPropMap", {
        /**
         * @return {?}
         */
        get: function () { return _attrToPropMap; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} nodeA
     * @param {?} nodeB
     * @return {?}
     */
    BrowserDomAdapter.prototype.contains = function (nodeA, nodeB) { return nodeContains.call(nodeA, nodeB); };
    /**
     * @param {?} el
     * @param {?} selector
     * @return {?}
     */
    BrowserDomAdapter.prototype.querySelector = function (el, selector) { return el.querySelector(selector); };
    /**
     * @param {?} el
     * @param {?} selector
     * @return {?}
     */
    BrowserDomAdapter.prototype.querySelectorAll = function (el, selector) { return el.querySelectorAll(selector); };
    /**
     * @param {?} el
     * @param {?} evt
     * @param {?} listener
     * @return {?}
     */
    BrowserDomAdapter.prototype.on = function (el, evt, listener) { el.addEventListener(evt, listener, false); };
    /**
     * @param {?} el
     * @param {?} evt
     * @param {?} listener
     * @return {?}
     */
    BrowserDomAdapter.prototype.onAndCancel = function (el, evt, listener) {
        el.addEventListener(evt, listener, false);
        // Needed to follow Dart's subscription semantic, until fix of
        // https://code.google.com/p/dart/issues/detail?id=17406
        return function () { el.removeEventListener(evt, listener, false); };
    };
    /**
     * @param {?} el
     * @param {?} evt
     * @return {?}
     */
    BrowserDomAdapter.prototype.dispatchEvent = function (el, evt) { el.dispatchEvent(evt); };
    /**
     * @param {?} eventType
     * @return {?}
     */
    BrowserDomAdapter.prototype.createMouseEvent = function (eventType) {
        var /** @type {?} */ evt = document.createEvent('MouseEvent');
        evt.initEvent(eventType, true, true);
        return evt;
    };
    /**
     * @param {?} eventType
     * @return {?}
     */
    BrowserDomAdapter.prototype.createEvent = function (eventType) {
        var /** @type {?} */ evt = document.createEvent('Event');
        evt.initEvent(eventType, true, true);
        return evt;
    };
    /**
     * @param {?} evt
     * @return {?}
     */
    BrowserDomAdapter.prototype.preventDefault = function (evt) {
        evt.preventDefault();
        evt.returnValue = false;
    };
    /**
     * @param {?} evt
     * @return {?}
     */
    BrowserDomAdapter.prototype.isPrevented = function (evt) {
        return evt.defaultPrevented || evt.returnValue != null && !evt.returnValue;
    };
    /**
     * @param {?} el
     * @return {?}
     */
    BrowserDomAdapter.prototype.getInnerHTML = function (el) { return el.innerHTML; };
    /**
     * @param {?} el
     * @return {?}
     */
    BrowserDomAdapter.prototype.getTemplateContent = function (el) {
        return 'content' in el && el instanceof HTMLTemplateElement ? el.content : null;
    };
    /**
     * @param {?} el
     * @return {?}
     */
    BrowserDomAdapter.prototype.getOuterHTML = function (el) { return el.outerHTML; };
    /**
     * @param {?} node
     * @return {?}
     */
    BrowserDomAdapter.prototype.nodeName = function (node) { return node.nodeName; };
    /**
     * @param {?} node
     * @return {?}
     */
    BrowserDomAdapter.prototype.nodeValue = function (node) { return node.nodeValue; };
    /**
     * @param {?} node
     * @return {?}
     */
    BrowserDomAdapter.prototype.type = function (node) { return node.type; };
    /**
     * @param {?} node
     * @return {?}
     */
    BrowserDomAdapter.prototype.content = function (node) {
        if (this.hasProperty(node, 'content')) {
            return ((node)).content;
        }
        else {
            return node;
        }
    };
    /**
     * @param {?} el
     * @return {?}
     */
    BrowserDomAdapter.prototype.firstChild = function (el) { return el.firstChild; };
    /**
     * @param {?} el
     * @return {?}
     */
    BrowserDomAdapter.prototype.nextSibling = function (el) { return el.nextSibling; };
    /**
     * @param {?} el
     * @return {?}
     */
    BrowserDomAdapter.prototype.parentElement = function (el) { return el.parentNode; };
    /**
     * @param {?} el
     * @return {?}
     */
    BrowserDomAdapter.prototype.childNodes = function (el) { return el.childNodes; };
    /**
     * @param {?} el
     * @return {?}
     */
    BrowserDomAdapter.prototype.childNodesAsList = function (el) {
        var /** @type {?} */ childNodes = el.childNodes;
        var /** @type {?} */ res = new Array(childNodes.length);
        for (var /** @type {?} */ i = 0; i < childNodes.length; i++) {
            res[i] = childNodes[i];
        }
        return res;
    };
    /**
     * @param {?} el
     * @return {?}
     */
    BrowserDomAdapter.prototype.clearNodes = function (el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
    };
    /**
     * @param {?} el
     * @param {?} node
     * @return {?}
     */
    BrowserDomAdapter.prototype.appendChild = function (el, node) { el.appendChild(node); };
    /**
     * @param {?} el
     * @param {?} node
     * @return {?}
     */
    BrowserDomAdapter.prototype.removeChild = function (el, node) { el.removeChild(node); };
    /**
     * @param {?} el
     * @param {?} newChild
     * @param {?} oldChild
     * @return {?}
     */
    BrowserDomAdapter.prototype.replaceChild = function (el, newChild, oldChild) { el.replaceChild(newChild, oldChild); };
    /**
     * @param {?} node
     * @return {?}
     */
    BrowserDomAdapter.prototype.remove = function (node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
        return node;
    };
    /**
     * @param {?} parent
     * @param {?} ref
     * @param {?} node
     * @return {?}
     */
    BrowserDomAdapter.prototype.insertBefore = function (parent, ref, node) { parent.insertBefore(node, ref); };
    /**
     * @param {?} parent
     * @param {?} ref
     * @param {?} nodes
     * @return {?}
     */
    BrowserDomAdapter.prototype.insertAllBefore = function (parent, ref, nodes) {
        nodes.forEach(function (n) { return parent.insertBefore(n, ref); });
    };
    /**
     * @param {?} parent
     * @param {?} ref
     * @param {?} node
     * @return {?}
     */
    BrowserDomAdapter.prototype.insertAfter = function (parent, ref, node) { parent.insertBefore(node, ref.nextSibling); };
    /**
     * @param {?} el
     * @param {?} value
     * @return {?}
     */
    BrowserDomAdapter.prototype.setInnerHTML = function (el, value) { el.innerHTML = value; };
    /**
     * @param {?} el
     * @return {?}
     */
    BrowserDomAdapter.prototype.getText = function (el) { return el.textContent; };
    /**
     * @param {?} el
     * @param {?} value
     * @return {?}
     */
    BrowserDomAdapter.prototype.setText = function (el, value) { el.textContent = value; };
    /**
     * @param {?} el
     * @return {?}
     */
    BrowserDomAdapter.prototype.getValue = function (el) { return el.value; };
    /**
     * @param {?} el
     * @param {?} value
     * @return {?}
     */
    BrowserDomAdapter.prototype.setValue = function (el, value) { el.value = value; };
    /**
     * @param {?} el
     * @return {?}
     */
    BrowserDomAdapter.prototype.getChecked = function (el) { return el.checked; };
    /**
     * @param {?} el
     * @param {?} value
     * @return {?}
     */
    BrowserDomAdapter.prototype.setChecked = function (el, value) { el.checked = value; };
    /**
     * @param {?} text
     * @return {?}
     */
    BrowserDomAdapter.prototype.createComment = function (text) { return document.createComment(text); };
    /**
     * @param {?} html
     * @return {?}
     */
    BrowserDomAdapter.prototype.createTemplate = function (html) {
        var /** @type {?} */ t = document.createElement('template');
        t.innerHTML = html;
        return t;
    };
    /**
     * @param {?} tagName
     * @param {?=} doc
     * @return {?}
     */
    BrowserDomAdapter.prototype.createElement = function (tagName, doc) {
        if (doc === void 0) { doc = document; }
        return doc.createElement(tagName);
    };
    /**
     * @param {?} ns
     * @param {?} tagName
     * @param {?=} doc
     * @return {?}
     */
    BrowserDomAdapter.prototype.createElementNS = function (ns, tagName, doc) {
        if (doc === void 0) { doc = document; }
        return doc.createElementNS(ns, tagName);
    };
    /**
     * @param {?} text
     * @param {?=} doc
     * @return {?}
     */
    BrowserDomAdapter.prototype.createTextNode = function (text, doc) {
        if (doc === void 0) { doc = document; }
        return doc.createTextNode(text);
    };
    /**
     * @param {?} attrName
     * @param {?} attrValue
     * @param {?=} doc
     * @return {?}
     */
    BrowserDomAdapter.prototype.createScriptTag = function (attrName, attrValue, doc) {
        if (doc === void 0) { doc = document; }
        var /** @type {?} */ el = (doc.createElement('SCRIPT'));
        el.setAttribute(attrName, attrValue);
        return el;
    };
    /**
     * @param {?} css
     * @param {?=} doc
     * @return {?}
     */
    BrowserDomAdapter.prototype.createStyleElement = function (css, doc) {
        if (doc === void 0) { doc = document; }
        var /** @type {?} */ style = (doc.createElement('style'));
        this.appendChild(style, this.createTextNode(css));
        return style;
    };
    /**
     * @param {?} el
     * @return {?}
     */
    BrowserDomAdapter.prototype.createShadowRoot = function (el) { return ((el)).createShadowRoot(); };
    /**
     * @param {?} el
     * @return {?}
     */
    BrowserDomAdapter.prototype.getShadowRoot = function (el) { return ((el)).shadowRoot; };
    /**
     * @param {?} el
     * @return {?}
     */
    BrowserDomAdapter.prototype.getHost = function (el) { return ((el)).host; };
    /**
     * @param {?} node
     * @return {?}
     */
    BrowserDomAdapter.prototype.clone = function (node) { return node.cloneNode(true); };
    /**
     * @param {?} element
     * @param {?} name
     * @return {?}
     */
    BrowserDomAdapter.prototype.getElementsByClassName = function (element, name) {
        return element.getElementsByClassName(name);
    };
    /**
     * @param {?} element
     * @param {?} name
     * @return {?}
     */
    BrowserDomAdapter.prototype.getElementsByTagName = function (element, name) {
        return element.getElementsByTagName(name);
    };
    /**
     * @param {?} element
     * @return {?}
     */
    BrowserDomAdapter.prototype.classList = function (element) { return Array.prototype.slice.call(element.classList, 0); };
    /**
     * @param {?} element
     * @param {?} className
     * @return {?}
     */
    BrowserDomAdapter.prototype.addClass = function (element, className) { element.classList.add(className); };
    /**
     * @param {?} element
     * @param {?} className
     * @return {?}
     */
    BrowserDomAdapter.prototype.removeClass = function (element, className) { element.classList.remove(className); };
    /**
     * @param {?} element
     * @param {?} className
     * @return {?}
     */
    BrowserDomAdapter.prototype.hasClass = function (element, className) {
        return element.classList.contains(className);
    };
    /**
     * @param {?} element
     * @param {?} styleName
     * @param {?} styleValue
     * @return {?}
     */
    BrowserDomAdapter.prototype.setStyle = function (element, styleName, styleValue) {
        element.style[styleName] = styleValue;
    };
    /**
     * @param {?} element
     * @param {?} stylename
     * @return {?}
     */
    BrowserDomAdapter.prototype.removeStyle = function (element, stylename) {
        // IE requires '' instead of null
        // see https://github.com/angular/angular/issues/7916
        element.style[stylename] = '';
    };
    /**
     * @param {?} element
     * @param {?} stylename
     * @return {?}
     */
    BrowserDomAdapter.prototype.getStyle = function (element, stylename) { return element.style[stylename]; };
    /**
     * @param {?} element
     * @param {?} styleName
     * @param {?=} styleValue
     * @return {?}
     */
    BrowserDomAdapter.prototype.hasStyle = function (element, styleName, styleValue) {
        var /** @type {?} */ value = this.getStyle(element, styleName) || '';
        return styleValue ? value == styleValue : value.length > 0;
    };
    /**
     * @param {?} element
     * @return {?}
     */
    BrowserDomAdapter.prototype.tagName = function (element) { return element.tagName; };
    /**
     * @param {?} element
     * @return {?}
     */
    BrowserDomAdapter.prototype.attributeMap = function (element) {
        var /** @type {?} */ res = new Map();
        var /** @type {?} */ elAttrs = element.attributes;
        for (var /** @type {?} */ i = 0; i < elAttrs.length; i++) {
            var /** @type {?} */ attrib = elAttrs[i];
            res.set(attrib.name, attrib.value);
        }
        return res;
    };
    /**
     * @param {?} element
     * @param {?} attribute
     * @return {?}
     */
    BrowserDomAdapter.prototype.hasAttribute = function (element, attribute) {
        return element.hasAttribute(attribute);
    };
    /**
     * @param {?} element
     * @param {?} ns
     * @param {?} attribute
     * @return {?}
     */
    BrowserDomAdapter.prototype.hasAttributeNS = function (element, ns, attribute) {
        return element.hasAttributeNS(ns, attribute);
    };
    /**
     * @param {?} element
     * @param {?} attribute
     * @return {?}
     */
    BrowserDomAdapter.prototype.getAttribute = function (element, attribute) {
        return element.getAttribute(attribute);
    };
    /**
     * @param {?} element
     * @param {?} ns
     * @param {?} name
     * @return {?}
     */
    BrowserDomAdapter.prototype.getAttributeNS = function (element, ns, name) {
        return element.getAttributeNS(ns, name);
    };
    /**
     * @param {?} element
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    BrowserDomAdapter.prototype.setAttribute = function (element, name, value) { element.setAttribute(name, value); };
    /**
     * @param {?} element
     * @param {?} ns
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    BrowserDomAdapter.prototype.setAttributeNS = function (element, ns, name, value) {
        element.setAttributeNS(ns, name, value);
    };
    /**
     * @param {?} element
     * @param {?} attribute
     * @return {?}
     */
    BrowserDomAdapter.prototype.removeAttribute = function (element, attribute) { element.removeAttribute(attribute); };
    /**
     * @param {?} element
     * @param {?} ns
     * @param {?} name
     * @return {?}
     */
    BrowserDomAdapter.prototype.removeAttributeNS = function (element, ns, name) {
        element.removeAttributeNS(ns, name);
    };
    /**
     * @param {?} el
     * @return {?}
     */
    BrowserDomAdapter.prototype.templateAwareRoot = function (el) { return this.isTemplateElement(el) ? this.content(el) : el; };
    /**
     * @return {?}
     */
    BrowserDomAdapter.prototype.createHtmlDocument = function () {
        return document.implementation.createHTMLDocument('fakeTitle');
    };
    /**
     * @param {?} el
     * @return {?}
     */
    BrowserDomAdapter.prototype.getBoundingClientRect = function (el) {
        try {
            return el.getBoundingClientRect();
        }
        catch (e) {
            return { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
        }
    };
    /**
     * @param {?} doc
     * @return {?}
     */
    BrowserDomAdapter.prototype.getTitle = function (doc) { return document.title; };
    /**
     * @param {?} doc
     * @param {?} newTitle
     * @return {?}
     */
    BrowserDomAdapter.prototype.setTitle = function (doc, newTitle) { document.title = newTitle || ''; };
    /**
     * @param {?} n
     * @param {?} selector
     * @return {?}
     */
    BrowserDomAdapter.prototype.elementMatches = function (n, selector) {
        if (n instanceof HTMLElement) {
            return n.matches && n.matches(selector) ||
                n.msMatchesSelector && n.msMatchesSelector(selector) ||
                n.webkitMatchesSelector && n.webkitMatchesSelector(selector);
        }
        return false;
    };
    /**
     * @param {?} el
     * @return {?}
     */
    BrowserDomAdapter.prototype.isTemplateElement = function (el) {
        return el instanceof HTMLElement && el.nodeName == 'TEMPLATE';
    };
    /**
     * @param {?} node
     * @return {?}
     */
    BrowserDomAdapter.prototype.isTextNode = function (node) { return node.nodeType === Node.TEXT_NODE; };
    /**
     * @param {?} node
     * @return {?}
     */
    BrowserDomAdapter.prototype.isCommentNode = function (node) { return node.nodeType === Node.COMMENT_NODE; };
    /**
     * @param {?} node
     * @return {?}
     */
    BrowserDomAdapter.prototype.isElementNode = function (node) { return node.nodeType === Node.ELEMENT_NODE; };
    /**
     * @param {?} node
     * @return {?}
     */
    BrowserDomAdapter.prototype.hasShadowRoot = function (node) {
        return node.shadowRoot != null && node instanceof HTMLElement;
    };
    /**
     * @param {?} node
     * @return {?}
     */
    BrowserDomAdapter.prototype.isShadowRoot = function (node) { return node instanceof DocumentFragment; };
    /**
     * @param {?} node
     * @return {?}
     */
    BrowserDomAdapter.prototype.importIntoDoc = function (node) { return document.importNode(this.templateAwareRoot(node), true); };
    /**
     * @param {?} node
     * @return {?}
     */
    BrowserDomAdapter.prototype.adoptNode = function (node) { return document.adoptNode(node); };
    /**
     * @param {?} el
     * @return {?}
     */
    BrowserDomAdapter.prototype.getHref = function (el) { return ((el)).href; };
    /**
     * @param {?} event
     * @return {?}
     */
    BrowserDomAdapter.prototype.getEventKey = function (event) {
        var /** @type {?} */ key = event.key;
        if (key == null) {
            key = event.keyIdentifier;
            // keyIdentifier is defined in the old draft of DOM Level 3 Events implemented by Chrome and
            // Safari cf
            // http://www.w3.org/TR/2007/WD-DOM-Level-3-Events-20071221/events.html#Events-KeyboardEvents-Interfaces
            if (key == null) {
                return 'Unidentified';
            }
            if (key.startsWith('U+')) {
                key = String.fromCharCode(parseInt(key.substring(2), 16));
                if (event.location === DOM_KEY_LOCATION_NUMPAD && _chromeNumKeyPadMap.hasOwnProperty(key)) {
                    // There is a bug in Chrome for numeric keypad keys:
                    // https://code.google.com/p/chromium/issues/detail?id=155654
                    // 1, 2, 3 ... are reported as A, B, C ...
                    key = ((_chromeNumKeyPadMap))[key];
                }
            }
        }
        return _keyMap[key] || key;
    };
    /**
     * @param {?} doc
     * @param {?} target
     * @return {?}
     */
    BrowserDomAdapter.prototype.getGlobalEventTarget = function (doc, target) {
        if (target === 'window') {
            return window;
        }
        if (target === 'document') {
            return document;
        }
        if (target === 'body') {
            return document.body;
        }
        return null;
    };
    /**
     * @return {?}
     */
    BrowserDomAdapter.prototype.getHistory = function () { return window.history; };
    /**
     * @return {?}
     */
    BrowserDomAdapter.prototype.getLocation = function () { return window.location; };
    /**
     * @param {?} doc
     * @return {?}
     */
    BrowserDomAdapter.prototype.getBaseHref = function (doc) {
        var /** @type {?} */ href = getBaseElementHref();
        return href == null ? null : relativePath(href);
    };
    /**
     * @return {?}
     */
    BrowserDomAdapter.prototype.resetBaseElement = function () { baseElement = null; };
    /**
     * @return {?}
     */
    BrowserDomAdapter.prototype.getUserAgent = function () { return window.navigator.userAgent; };
    /**
     * @param {?} element
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    BrowserDomAdapter.prototype.setData = function (element, name, value) {
        this.setAttribute(element, 'data-' + name, value);
    };
    /**
     * @param {?} element
     * @param {?} name
     * @return {?}
     */
    BrowserDomAdapter.prototype.getData = function (element, name) {
        return this.getAttribute(element, 'data-' + name);
    };
    /**
     * @param {?} element
     * @return {?}
     */
    BrowserDomAdapter.prototype.getComputedStyle = function (element) { return getComputedStyle(element); };
    /**
     * @param {?} path
     * @param {?} value
     * @return {?}
     */
    BrowserDomAdapter.prototype.setGlobalVar = function (path, value) { setValueOnPath(_angular_core.ɵglobal, path, value); };
    /**
     * @return {?}
     */
    BrowserDomAdapter.prototype.supportsWebAnimation = function () {
        return typeof ((Element)).prototype['animate'] === 'function';
    };
    /**
     * @return {?}
     */
    BrowserDomAdapter.prototype.performanceNow = function () {
        // performance.now() is not available in all browsers, see
        // http://caniuse.com/#search=performance.now
        return window.performance && window.performance.now ? window.performance.now() :
            new Date().getTime();
    };
    /**
     * @return {?}
     */
    BrowserDomAdapter.prototype.supportsCookies = function () { return true; };
    /**
     * @param {?} name
     * @return {?}
     */
    BrowserDomAdapter.prototype.getCookie = function (name) { return parseCookieValue(document.cookie, name); };
    /**
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    BrowserDomAdapter.prototype.setCookie = function (name, value) {
        // document.cookie is magical, assigning into it assigns/overrides one cookie value, but does
        // not clear other cookies.
        document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    };
    return BrowserDomAdapter;
}(GenericBrowserDomAdapter));
var baseElement = null;
/**
 * @return {?}
 */
function getBaseElementHref() {
    if (!baseElement) {
        baseElement = ((document.querySelector('base')));
        if (!baseElement) {
            return null;
        }
    }
    return baseElement.getAttribute('href');
}
// based on urlUtils.js in AngularJS 1
var urlParsingNode;
/**
 * @param {?} url
 * @return {?}
 */
function relativePath(url) {
    if (!urlParsingNode) {
        urlParsingNode = document.createElement('a');
    }
    urlParsingNode.setAttribute('href', url);
    return (urlParsingNode.pathname.charAt(0) === '/') ? urlParsingNode.pathname :
        '/' + urlParsingNode.pathname;
}
/**
 * @param {?} cookieStr
 * @param {?} name
 * @return {?}
 */
function parseCookieValue(cookieStr, name) {
    name = encodeURIComponent(name);
    for (var _i = 0, _a = cookieStr.split(';'); _i < _a.length; _i++) {
        var cookie = _a[_i];
        var /** @type {?} */ eqIndex = cookie.indexOf('=');
        var _b = eqIndex == -1 ? [cookie, ''] : [cookie.slice(0, eqIndex), cookie.slice(eqIndex + 1)], cookieName = _b[0], cookieValue = _b[1];
        if (cookieName.trim() === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}
/**
 * @param {?} global
 * @param {?} path
 * @param {?} value
 * @return {?}
 */
function setValueOnPath(global, path, value) {
    var /** @type {?} */ parts = path.split('.');
    var /** @type {?} */ obj = global;
    while (parts.length > 1) {
        var /** @type {?} */ name = ((parts.shift()));
        if (obj.hasOwnProperty(name) && obj[name] != null) {
            obj = obj[name];
        }
        else {
            obj = obj[name] = {};
        }
    }
    if (obj === undefined || obj === null) {
        obj = {};
    }
    obj[((parts.shift()))] = value;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A DI Token representing the main rendering context. In a browser this is the DOM Document.
 *
 * Note: Document might not be available in the Application Context when Application and Rendering
 * Contexts are not the same (e.g. when running the application into a Web Worker).
 *
 * \@stable
 */
var DOCUMENT = new _angular_core.InjectionToken('DocumentToken');
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 * @return {?}
 */
function supportsState() {
    return !!window.history.pushState;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * `PlatformLocation` encapsulates all of the direct calls to platform APIs.
 * This class should not be used directly by an application developer. Instead, use
 * {\@link Location}.
 */
var BrowserPlatformLocation = (function (_super) {
    __extends(BrowserPlatformLocation, _super);
    /**
     * @param {?} _doc
     */
    function BrowserPlatformLocation(_doc) {
        var _this = _super.call(this) || this;
        _this._doc = _doc;
        _this._init();
        return _this;
    }
    /**
     * \@internal
     * @return {?}
     */
    BrowserPlatformLocation.prototype._init = function () {
        this._location = getDOM().getLocation();
        this._history = getDOM().getHistory();
    };
    Object.defineProperty(BrowserPlatformLocation.prototype, "location", {
        /**
         * @return {?}
         */
        get: function () { return this._location; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    BrowserPlatformLocation.prototype.getBaseHrefFromDOM = function () { return ((getDOM().getBaseHref(this._doc))); };
    /**
     * @param {?} fn
     * @return {?}
     */
    BrowserPlatformLocation.prototype.onPopState = function (fn) {
        getDOM().getGlobalEventTarget(this._doc, 'window').addEventListener('popstate', fn, false);
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    BrowserPlatformLocation.prototype.onHashChange = function (fn) {
        getDOM().getGlobalEventTarget(this._doc, 'window').addEventListener('hashchange', fn, false);
    };
    Object.defineProperty(BrowserPlatformLocation.prototype, "pathname", {
        /**
         * @return {?}
         */
        get: function () { return this._location.pathname; },
        /**
         * @param {?} newPath
         * @return {?}
         */
        set: function (newPath) { this._location.pathname = newPath; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserPlatformLocation.prototype, "search", {
        /**
         * @return {?}
         */
        get: function () { return this._location.search; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserPlatformLocation.prototype, "hash", {
        /**
         * @return {?}
         */
        get: function () { return this._location.hash; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} state
     * @param {?} title
     * @param {?} url
     * @return {?}
     */
    BrowserPlatformLocation.prototype.pushState = function (state, title, url) {
        if (supportsState()) {
            this._history.pushState(state, title, url);
        }
        else {
            this._location.hash = url;
        }
    };
    /**
     * @param {?} state
     * @param {?} title
     * @param {?} url
     * @return {?}
     */
    BrowserPlatformLocation.prototype.replaceState = function (state, title, url) {
        if (supportsState()) {
            this._history.replaceState(state, title, url);
        }
        else {
            this._location.hash = url;
        }
    };
    /**
     * @return {?}
     */
    BrowserPlatformLocation.prototype.forward = function () { this._history.forward(); };
    /**
     * @return {?}
     */
    BrowserPlatformLocation.prototype.back = function () { this._history.back(); };
    return BrowserPlatformLocation;
}(_angular_common.PlatformLocation));
BrowserPlatformLocation.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
BrowserPlatformLocation.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: _angular_core.Inject, args: [DOCUMENT,] },] },
]; };
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A service that can be used to get and add meta tags.
 *
 * \@experimental
 */
var Meta = (function () {
    /**
     * @param {?} _doc
     */
    function Meta(_doc) {
        this._doc = _doc;
        this._dom = getDOM();
    }
    /**
     * @param {?} tag
     * @param {?=} forceCreation
     * @return {?}
     */
    Meta.prototype.addTag = function (tag, forceCreation) {
        if (forceCreation === void 0) { forceCreation = false; }
        if (!tag)
            return null;
        return this._getOrCreateElement(tag, forceCreation);
    };
    /**
     * @param {?} tags
     * @param {?=} forceCreation
     * @return {?}
     */
    Meta.prototype.addTags = function (tags, forceCreation) {
        var _this = this;
        if (forceCreation === void 0) { forceCreation = false; }
        if (!tags)
            return [];
        return tags.reduce(function (result, tag) {
            if (tag) {
                result.push(_this._getOrCreateElement(tag, forceCreation));
            }
            return result;
        }, []);
    };
    /**
     * @param {?} attrSelector
     * @return {?}
     */
    Meta.prototype.getTag = function (attrSelector) {
        if (!attrSelector)
            return null;
        return this._dom.querySelector(this._doc, "meta[" + attrSelector + "]");
    };
    /**
     * @param {?} attrSelector
     * @return {?}
     */
    Meta.prototype.getTags = function (attrSelector) {
        if (!attrSelector)
            return [];
        var /** @type {?} */ list /*NodeList*/ = this._dom.querySelectorAll(this._doc, "meta[" + attrSelector + "]");
        return list ? [].slice.call(list) : [];
    };
    /**
     * @param {?} tag
     * @param {?=} selector
     * @return {?}
     */
    Meta.prototype.updateTag = function (tag, selector) {
        if (!tag)
            return null;
        selector = selector || this._parseSelector(tag);
        var /** @type {?} */ meta = ((this.getTag(selector)));
        if (meta) {
            return this._setMetaElementAttributes(tag, meta);
        }
        return this._getOrCreateElement(tag, true);
    };
    /**
     * @param {?} attrSelector
     * @return {?}
     */
    Meta.prototype.removeTag = function (attrSelector) { this.removeTagElement(/** @type {?} */ ((this.getTag(attrSelector)))); };
    /**
     * @param {?} meta
     * @return {?}
     */
    Meta.prototype.removeTagElement = function (meta) {
        if (meta) {
            this._dom.remove(meta);
        }
    };
    /**
     * @param {?} meta
     * @param {?=} forceCreation
     * @return {?}
     */
    Meta.prototype._getOrCreateElement = function (meta, forceCreation) {
        if (forceCreation === void 0) { forceCreation = false; }
        if (!forceCreation) {
            var /** @type {?} */ selector = this._parseSelector(meta);
            var /** @type {?} */ elem = ((this.getTag(selector)));
            // It's allowed to have multiple elements with the same name so it's not enough to
            // just check that element with the same name already present on the page. We also need to
            // check if element has tag attributes
            if (elem && this._containsAttributes(meta, elem))
                return elem;
        }
        var /** @type {?} */ element = (this._dom.createElement('meta'));
        this._setMetaElementAttributes(meta, element);
        var /** @type {?} */ head = this._dom.getElementsByTagName(this._doc, 'head')[0];
        this._dom.appendChild(head, element);
        return element;
    };
    /**
     * @param {?} tag
     * @param {?} el
     * @return {?}
     */
    Meta.prototype._setMetaElementAttributes = function (tag, el) {
        var _this = this;
        Object.keys(tag).forEach(function (prop) { return _this._dom.setAttribute(el, prop, tag[prop]); });
        return el;
    };
    /**
     * @param {?} tag
     * @return {?}
     */
    Meta.prototype._parseSelector = function (tag) {
        var /** @type {?} */ attr = tag.name ? 'name' : 'property';
        return attr + "=\"" + tag[attr] + "\"";
    };
    /**
     * @param {?} tag
     * @param {?} elem
     * @return {?}
     */
    Meta.prototype._containsAttributes = function (tag, elem) {
        var _this = this;
        return Object.keys(tag).every(function (key) { return _this._dom.getAttribute(elem, key) === tag[key]; });
    };
    return Meta;
}());
Meta.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
Meta.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: _angular_core.Inject, args: [DOCUMENT,] },] },
]; };
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * An id that identifies a particular application being bootstrapped, that should
 * match across the client/server boundary.
 */
var TRANSITION_ID = new _angular_core.InjectionToken('TRANSITION_ID');
/**
 * @param {?} transitionId
 * @param {?} document
 * @param {?} injector
 * @return {?}
 */
function appInitializerFactory(transitionId, document, injector) {
    return function () {
        // Wait for all application initializers to be completed before removing the styles set by
        // the server.
        injector.get(_angular_core.ApplicationInitStatus).donePromise.then(function () {
            var /** @type {?} */ dom = getDOM();
            var /** @type {?} */ styles = Array.prototype.slice.apply(dom.querySelectorAll(document, "style[ng-transition]"));
            styles.filter(function (el) { return dom.getAttribute(el, 'ng-transition') === transitionId; })
                .forEach(function (el) { return dom.remove(el); });
        });
    };
}
var SERVER_TRANSITION_PROVIDERS = [
    {
        provide: _angular_core.APP_INITIALIZER,
        useFactory: appInitializerFactory,
        deps: [TRANSITION_ID, DOCUMENT, _angular_core.Injector],
        multi: true
    },
];
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var BrowserGetTestability = (function () {
    function BrowserGetTestability() {
    }
    /**
     * @return {?}
     */
    BrowserGetTestability.init = function () { _angular_core.setTestabilityGetter(new BrowserGetTestability()); };
    /**
     * @param {?} registry
     * @return {?}
     */
    BrowserGetTestability.prototype.addToWindow = function (registry) {
        _angular_core.ɵglobal['getAngularTestability'] = function (elem, findInAncestors) {
            if (findInAncestors === void 0) { findInAncestors = true; }
            var /** @type {?} */ testability = registry.findTestabilityInTree(elem, findInAncestors);
            if (testability == null) {
                throw new Error('Could not find testability for element.');
            }
            return testability;
        };
        _angular_core.ɵglobal['getAllAngularTestabilities'] = function () { return registry.getAllTestabilities(); };
        _angular_core.ɵglobal['getAllAngularRootElements'] = function () { return registry.getAllRootElements(); };
        var /** @type {?} */ whenAllStable = function (callback /** TODO #9100 */) {
            var /** @type {?} */ testabilities = _angular_core.ɵglobal['getAllAngularTestabilities']();
            var /** @type {?} */ count = testabilities.length;
            var /** @type {?} */ didWork = false;
            var /** @type {?} */ decrement = function (didWork_ /** TODO #9100 */) {
                didWork = didWork || didWork_;
                count--;
                if (count == 0) {
                    callback(didWork);
                }
            };
            testabilities.forEach(function (testability /** TODO #9100 */) {
                testability.whenStable(decrement);
            });
        };
        if (!_angular_core.ɵglobal['frameworkStabilizers']) {
            _angular_core.ɵglobal['frameworkStabilizers'] = [];
        }
        _angular_core.ɵglobal['frameworkStabilizers'].push(whenAllStable);
    };
    /**
     * @param {?} registry
     * @param {?} elem
     * @param {?} findInAncestors
     * @return {?}
     */
    BrowserGetTestability.prototype.findTestabilityInTree = function (registry, elem, findInAncestors) {
        if (elem == null) {
            return null;
        }
        var /** @type {?} */ t = registry.getTestability(elem);
        if (t != null) {
            return t;
        }
        else if (!findInAncestors) {
            return null;
        }
        if (getDOM().isShadowRoot(elem)) {
            return this.findTestabilityInTree(registry, getDOM().getHost(elem), true);
        }
        return this.findTestabilityInTree(registry, getDOM().parentElement(elem), true);
    };
    return BrowserGetTestability;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A service that can be used to get and set the title of a current HTML document.
 *
 * Since an Angular application can't be bootstrapped on the entire HTML document (`<html>` tag)
 * it is not possible to bind to the `text` property of the `HTMLTitleElement` elements
 * (representing the `<title>` tag). Instead, this service can be used to set and get the current
 * title value.
 *
 * \@experimental
 */
var Title = (function () {
    /**
     * @param {?} _doc
     */
    function Title(_doc) {
        this._doc = _doc;
    }
    /**
     * Get the title of the current HTML document.
     * @return {?}
     */
    Title.prototype.getTitle = function () { return getDOM().getTitle(this._doc); };
    /**
     * Set the title of the current HTML document.
     * @param {?} newTitle
     * @return {?}
     */
    Title.prototype.setTitle = function (newTitle) { getDOM().setTitle(this._doc, newTitle); };
    return Title;
}());
Title.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
Title.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: _angular_core.Inject, args: [DOCUMENT,] },] },
]; };
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
var CORE_TOKENS = {
    'ApplicationRef': _angular_core.ApplicationRef,
    'NgZone': _angular_core.NgZone,
};
var INSPECT_GLOBAL_NAME = 'ng.probe';
var CORE_TOKENS_GLOBAL_NAME = 'ng.coreTokens';
/**
 * Returns a {\@link DebugElement} for the given native DOM element, or
 * null if the given native element does not have an Angular view associated
 * with it.
 * @param {?} element
 * @return {?}
 */
function inspectNativeElement(element) {
    return _angular_core.getDebugNode(element);
}
/**
 * Deprecated. Use the one from '\@angular/core'.
 * @deprecated
 */
var NgProbeToken$1 = (function () {
    /**
     * @param {?} name
     * @param {?} token
     */
    function NgProbeToken$1(name, token) {
        this.name = name;
        this.token = token;
    }
    return NgProbeToken$1;
}());
/**
 * @param {?} extraTokens
 * @param {?} coreTokens
 * @return {?}
 */
function _createNgProbe(extraTokens, coreTokens) {
    var /** @type {?} */ tokens = (extraTokens || []).concat(coreTokens || []);
    getDOM().setGlobalVar(INSPECT_GLOBAL_NAME, inspectNativeElement);
    getDOM().setGlobalVar(CORE_TOKENS_GLOBAL_NAME, __assign({}, CORE_TOKENS, _ngProbeTokensToMap(tokens || [])));
    return function () { return inspectNativeElement; };
}
/**
 * @param {?} tokens
 * @return {?}
 */
function _ngProbeTokensToMap(tokens) {
    return tokens.reduce(function (prev, t) { return (prev[t.name] = t.token, prev); }, {});
}
/**
 * Providers which support debugging Angular applications (e.g. via `ng.probe`).
 */
var ELEMENT_PROBE_PROVIDERS = [
    {
        provide: _angular_core.APP_INITIALIZER,
        useFactory: _createNgProbe,
        deps: [
            [NgProbeToken$1, new _angular_core.Optional()],
            [_angular_core.NgProbeToken, new _angular_core.Optional()],
        ],
        multi: true,
    },
];
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * \@stable
 */
var EVENT_MANAGER_PLUGINS = new _angular_core.InjectionToken('EventManagerPlugins');
/**
 * \@stable
 */
var EventManager = (function () {
    /**
     * @param {?} plugins
     * @param {?} _zone
     */
    function EventManager(plugins, _zone) {
        var _this = this;
        this._zone = _zone;
        this._eventNameToPlugin = new Map();
        plugins.forEach(function (p) { return p.manager = _this; });
        this._plugins = plugins.slice().reverse();
    }
    /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    EventManager.prototype.addEventListener = function (element, eventName, handler) {
        var /** @type {?} */ plugin = this._findPluginFor(eventName);
        return plugin.addEventListener(element, eventName, handler);
    };
    /**
     * @param {?} target
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    EventManager.prototype.addGlobalEventListener = function (target, eventName, handler) {
        var /** @type {?} */ plugin = this._findPluginFor(eventName);
        return plugin.addGlobalEventListener(target, eventName, handler);
    };
    /**
     * @return {?}
     */
    EventManager.prototype.getZone = function () { return this._zone; };
    /**
     * \@internal
     * @param {?} eventName
     * @return {?}
     */
    EventManager.prototype._findPluginFor = function (eventName) {
        var /** @type {?} */ plugin = this._eventNameToPlugin.get(eventName);
        if (plugin) {
            return plugin;
        }
        var /** @type {?} */ plugins = this._plugins;
        for (var /** @type {?} */ i = 0; i < plugins.length; i++) {
            var /** @type {?} */ plugin_1 = plugins[i];
            if (plugin_1.supports(eventName)) {
                this._eventNameToPlugin.set(eventName, plugin_1);
                return plugin_1;
            }
        }
        throw new Error("No event manager plugin found for event " + eventName);
    };
    return EventManager;
}());
EventManager.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
EventManager.ctorParameters = function () { return [
    { type: Array, decorators: [{ type: _angular_core.Inject, args: [EVENT_MANAGER_PLUGINS,] },] },
    { type: _angular_core.NgZone, },
]; };
/**
 * @abstract
 */
var EventManagerPlugin = (function () {
    /**
     * @param {?} _doc
     */
    function EventManagerPlugin(_doc) {
        this._doc = _doc;
    }
    /**
     * @abstract
     * @param {?} eventName
     * @return {?}
     */
    EventManagerPlugin.prototype.supports = function (eventName) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    EventManagerPlugin.prototype.addEventListener = function (element, eventName, handler) { };
    /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    EventManagerPlugin.prototype.addGlobalEventListener = function (element, eventName, handler) {
        var /** @type {?} */ target = getDOM().getGlobalEventTarget(this._doc, element);
        if (!target) {
            throw new Error("Unsupported event target " + target + " for event " + eventName);
        }
        return this.addEventListener(target, eventName, handler);
    };
    
    return EventManagerPlugin;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var SharedStylesHost = (function () {
    function SharedStylesHost() {
        /**
         * \@internal
         */
        this._stylesSet = new Set();
    }
    /**
     * @param {?} styles
     * @return {?}
     */
    SharedStylesHost.prototype.addStyles = function (styles) {
        var _this = this;
        var /** @type {?} */ additions = new Set();
        styles.forEach(function (style) {
            if (!_this._stylesSet.has(style)) {
                _this._stylesSet.add(style);
                additions.add(style);
            }
        });
        this.onStylesAdded(additions);
    };
    /**
     * @param {?} additions
     * @return {?}
     */
    SharedStylesHost.prototype.onStylesAdded = function (additions) { };
    /**
     * @return {?}
     */
    SharedStylesHost.prototype.getAllStyles = function () { return Array.from(this._stylesSet); };
    return SharedStylesHost;
}());
SharedStylesHost.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
SharedStylesHost.ctorParameters = function () { return []; };
var DomSharedStylesHost = (function (_super) {
    __extends(DomSharedStylesHost, _super);
    /**
     * @param {?} _doc
     */
    function DomSharedStylesHost(_doc) {
        var _this = _super.call(this) || this;
        _this._doc = _doc;
        _this._hostNodes = new Set();
        _this._styleNodes = new Set();
        _this._hostNodes.add(_doc.head);
        return _this;
    }
    /**
     * @param {?} styles
     * @param {?} host
     * @return {?}
     */
    DomSharedStylesHost.prototype._addStylesToHost = function (styles, host) {
        var _this = this;
        styles.forEach(function (style) {
            var /** @type {?} */ styleEl = _this._doc.createElement('style');
            styleEl.textContent = style;
            _this._styleNodes.add(host.appendChild(styleEl));
        });
    };
    /**
     * @param {?} hostNode
     * @return {?}
     */
    DomSharedStylesHost.prototype.addHost = function (hostNode) {
        this._addStylesToHost(this._stylesSet, hostNode);
        this._hostNodes.add(hostNode);
    };
    /**
     * @param {?} hostNode
     * @return {?}
     */
    DomSharedStylesHost.prototype.removeHost = function (hostNode) { this._hostNodes.delete(hostNode); };
    /**
     * @param {?} additions
     * @return {?}
     */
    DomSharedStylesHost.prototype.onStylesAdded = function (additions) {
        var _this = this;
        this._hostNodes.forEach(function (hostNode) { return _this._addStylesToHost(additions, hostNode); });
    };
    /**
     * @return {?}
     */
    DomSharedStylesHost.prototype.ngOnDestroy = function () { this._styleNodes.forEach(function (styleNode) { return getDOM().remove(styleNode); }); };
    return DomSharedStylesHost;
}(SharedStylesHost));
DomSharedStylesHost.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
DomSharedStylesHost.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: _angular_core.Inject, args: [DOCUMENT,] },] },
]; };
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var NAMESPACE_URIS = {
    'svg': 'http://www.w3.org/2000/svg',
    'xhtml': 'http://www.w3.org/1999/xhtml',
    'xlink': 'http://www.w3.org/1999/xlink',
    'xml': 'http://www.w3.org/XML/1998/namespace',
    'xmlns': 'http://www.w3.org/2000/xmlns/',
};
var COMPONENT_REGEX = /%COMP%/g;
var COMPONENT_VARIABLE = '%COMP%';
var HOST_ATTR = "_nghost-" + COMPONENT_VARIABLE;
var CONTENT_ATTR = "_ngcontent-" + COMPONENT_VARIABLE;
/**
 * @param {?} componentShortId
 * @return {?}
 */
function shimContentAttribute(componentShortId) {
    return CONTENT_ATTR.replace(COMPONENT_REGEX, componentShortId);
}
/**
 * @param {?} componentShortId
 * @return {?}
 */
function shimHostAttribute(componentShortId) {
    return HOST_ATTR.replace(COMPONENT_REGEX, componentShortId);
}
/**
 * @param {?} compId
 * @param {?} styles
 * @param {?} target
 * @return {?}
 */
function flattenStyles(compId, styles, target) {
    for (var /** @type {?} */ i = 0; i < styles.length; i++) {
        var /** @type {?} */ style = styles[i];
        if (Array.isArray(style)) {
            flattenStyles(compId, style, target);
        }
        else {
            style = style.replace(COMPONENT_REGEX, compId);
            target.push(style);
        }
    }
    return target;
}
/**
 * @param {?} eventHandler
 * @return {?}
 */
function decoratePreventDefault(eventHandler) {
    return function (event) {
        var /** @type {?} */ allowDefaultBehavior = eventHandler(event);
        if (allowDefaultBehavior === false) {
            // TODO(tbosch): move preventDefault into event plugins...
            event.preventDefault();
            event.returnValue = false;
        }
    };
}
var DomRendererFactory2 = (function () {
    /**
     * @param {?} eventManager
     * @param {?} sharedStylesHost
     */
    function DomRendererFactory2(eventManager, sharedStylesHost) {
        this.eventManager = eventManager;
        this.sharedStylesHost = sharedStylesHost;
        this.rendererByCompId = new Map();
        this.defaultRenderer = new DefaultDomRenderer2(eventManager);
    }
    
    /**
     * @param {?} element
     * @param {?} type
     * @return {?}
     */
    DomRendererFactory2.prototype.createRenderer = function (element, type) {
        if (!element || !type) {
            return this.defaultRenderer;
        }
        switch (type.encapsulation) {
            case _angular_core.ViewEncapsulation.Emulated: {
                var /** @type {?} */ renderer = this.rendererByCompId.get(type.id);
                if (!renderer) {
                    renderer =
                        new EmulatedEncapsulationDomRenderer2(this.eventManager, this.sharedStylesHost, type);
                    this.rendererByCompId.set(type.id, renderer);
                }
                ((renderer)).applyToHost(element);
                return renderer;
            }
            case _angular_core.ViewEncapsulation.Native:
                return new ShadowDomRenderer(this.eventManager, this.sharedStylesHost, element, type);
            default: {
                if (!this.rendererByCompId.has(type.id)) {
                    var /** @type {?} */ styles = flattenStyles(type.id, type.styles, []);
                    this.sharedStylesHost.addStyles(styles);
                    this.rendererByCompId.set(type.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
        }
    };
    return DomRendererFactory2;
}());
DomRendererFactory2.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
DomRendererFactory2.ctorParameters = function () { return [
    { type: EventManager, },
    { type: DomSharedStylesHost, },
]; };
var DefaultDomRenderer2 = (function () {
    /**
     * @param {?} eventManager
     */
    function DefaultDomRenderer2(eventManager) {
        this.eventManager = eventManager;
        this.data = Object.create(null);
    }
    /**
     * @return {?}
     */
    DefaultDomRenderer2.prototype.destroy = function () { };
    /**
     * @param {?} name
     * @param {?=} namespace
     * @return {?}
     */
    DefaultDomRenderer2.prototype.createElement = function (name, namespace) {
        if (namespace) {
            return document.createElementNS(NAMESPACE_URIS[namespace], name);
        }
        return document.createElement(name);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    DefaultDomRenderer2.prototype.createComment = function (value) { return document.createComment(value); };
    /**
     * @param {?} value
     * @return {?}
     */
    DefaultDomRenderer2.prototype.createText = function (value) { return document.createTextNode(value); };
    /**
     * @param {?} parent
     * @param {?} newChild
     * @return {?}
     */
    DefaultDomRenderer2.prototype.appendChild = function (parent, newChild) { parent.appendChild(newChild); };
    /**
     * @param {?} parent
     * @param {?} newChild
     * @param {?} refChild
     * @return {?}
     */
    DefaultDomRenderer2.prototype.insertBefore = function (parent, newChild, refChild) {
        if (parent) {
            parent.insertBefore(newChild, refChild);
        }
    };
    /**
     * @param {?} parent
     * @param {?} oldChild
     * @return {?}
     */
    DefaultDomRenderer2.prototype.removeChild = function (parent, oldChild) {
        if (parent) {
            parent.removeChild(oldChild);
        }
    };
    /**
     * @param {?} selectorOrNode
     * @return {?}
     */
    DefaultDomRenderer2.prototype.selectRootElement = function (selectorOrNode) {
        var /** @type {?} */ el = typeof selectorOrNode === 'string' ? document.querySelector(selectorOrNode) :
            selectorOrNode;
        if (!el) {
            throw new Error("The selector \"" + selectorOrNode + "\" did not match any elements");
        }
        el.textContent = '';
        return el;
    };
    /**
     * @param {?} node
     * @return {?}
     */
    DefaultDomRenderer2.prototype.parentNode = function (node) { return node.parentNode; };
    /**
     * @param {?} node
     * @return {?}
     */
    DefaultDomRenderer2.prototype.nextSibling = function (node) { return node.nextSibling; };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @param {?=} namespace
     * @return {?}
     */
    DefaultDomRenderer2.prototype.setAttribute = function (el, name, value, namespace) {
        if (namespace) {
            name = namespace + ":" + name;
            var /** @type {?} */ namespaceUri = NAMESPACE_URIS[namespace];
            if (namespaceUri) {
                el.setAttributeNS(namespaceUri, name, value);
            }
            else {
                el.setAttribute(name, value);
            }
        }
        else {
            el.setAttribute(name, value);
        }
    };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?=} namespace
     * @return {?}
     */
    DefaultDomRenderer2.prototype.removeAttribute = function (el, name, namespace) {
        if (namespace) {
            var /** @type {?} */ namespaceUri = NAMESPACE_URIS[namespace];
            if (namespaceUri) {
                el.removeAttributeNS(namespaceUri, name);
            }
            else {
                el.removeAttribute(namespace + ":" + name);
            }
        }
        else {
            el.removeAttribute(name);
        }
    };
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    DefaultDomRenderer2.prototype.addClass = function (el, name) { el.classList.add(name); };
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    DefaultDomRenderer2.prototype.removeClass = function (el, name) { el.classList.remove(name); };
    /**
     * @param {?} el
     * @param {?} style
     * @param {?} value
     * @param {?} flags
     * @return {?}
     */
    DefaultDomRenderer2.prototype.setStyle = function (el, style, value, flags) {
        if (flags & _angular_core.RendererStyleFlags2.DashCase) {
            el.style.setProperty(style, value, !!(flags & _angular_core.RendererStyleFlags2.Important) ? 'important' : '');
        }
        else {
            el.style[style] = value;
        }
    };
    /**
     * @param {?} el
     * @param {?} style
     * @param {?} flags
     * @return {?}
     */
    DefaultDomRenderer2.prototype.removeStyle = function (el, style, flags) {
        if (flags & _angular_core.RendererStyleFlags2.DashCase) {
            el.style.removeProperty(style);
        }
        else {
            // IE requires '' instead of null
            // see https://github.com/angular/angular/issues/7916
            el.style[style] = '';
        }
    };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    DefaultDomRenderer2.prototype.setProperty = function (el, name, value) {
        checkNoSyntheticProp(name, 'property');
        el[name] = value;
    };
    /**
     * @param {?} node
     * @param {?} value
     * @return {?}
     */
    DefaultDomRenderer2.prototype.setValue = function (node, value) { node.nodeValue = value; };
    /**
     * @param {?} target
     * @param {?} event
     * @param {?} callback
     * @return {?}
     */
    DefaultDomRenderer2.prototype.listen = function (target, event, callback) {
        checkNoSyntheticProp(event, 'listener');
        if (typeof target === 'string') {
            return (this.eventManager.addGlobalEventListener(target, event, decoratePreventDefault(callback)));
        }
        return ((this.eventManager.addEventListener(target, event, decoratePreventDefault(callback))));
    };
    return DefaultDomRenderer2;
}());
var AT_CHARCODE = '@'.charCodeAt(0);
/**
 * @param {?} name
 * @param {?} nameKind
 * @return {?}
 */
function checkNoSyntheticProp(name, nameKind) {
    if (name.charCodeAt(0) === AT_CHARCODE) {
        throw new Error("Found the synthetic " + nameKind + " " + name + ". Please include either \"BrowserAnimationsModule\" or \"NoopAnimationsModule\" in your application.");
    }
}
var EmulatedEncapsulationDomRenderer2 = (function (_super) {
    __extends(EmulatedEncapsulationDomRenderer2, _super);
    /**
     * @param {?} eventManager
     * @param {?} sharedStylesHost
     * @param {?} component
     */
    function EmulatedEncapsulationDomRenderer2(eventManager, sharedStylesHost, component) {
        var _this = _super.call(this, eventManager) || this;
        _this.component = component;
        var styles = flattenStyles(component.id, component.styles, []);
        sharedStylesHost.addStyles(styles);
        _this.contentAttr = shimContentAttribute(component.id);
        _this.hostAttr = shimHostAttribute(component.id);
        return _this;
    }
    /**
     * @param {?} element
     * @return {?}
     */
    EmulatedEncapsulationDomRenderer2.prototype.applyToHost = function (element) { _super.prototype.setAttribute.call(this, element, this.hostAttr, ''); };
    /**
     * @param {?} parent
     * @param {?} name
     * @return {?}
     */
    EmulatedEncapsulationDomRenderer2.prototype.createElement = function (parent, name) {
        var /** @type {?} */ el = _super.prototype.createElement.call(this, parent, name);
        _super.prototype.setAttribute.call(this, el, this.contentAttr, '');
        return el;
    };
    return EmulatedEncapsulationDomRenderer2;
}(DefaultDomRenderer2));
var ShadowDomRenderer = (function (_super) {
    __extends(ShadowDomRenderer, _super);
    /**
     * @param {?} eventManager
     * @param {?} sharedStylesHost
     * @param {?} hostEl
     * @param {?} component
     */
    function ShadowDomRenderer(eventManager, sharedStylesHost, hostEl, component) {
        var _this = _super.call(this, eventManager) || this;
        _this.sharedStylesHost = sharedStylesHost;
        _this.hostEl = hostEl;
        _this.component = component;
        _this.shadowRoot = hostEl.createShadowRoot();
        _this.sharedStylesHost.addHost(_this.shadowRoot);
        var styles = flattenStyles(component.id, component.styles, []);
        for (var i = 0; i < styles.length; i++) {
            var styleEl = document.createElement('style');
            styleEl.textContent = styles[i];
            _this.shadowRoot.appendChild(styleEl);
        }
        return _this;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    ShadowDomRenderer.prototype.nodeOrShadowRoot = function (node) { return node === this.hostEl ? this.shadowRoot : node; };
    /**
     * @return {?}
     */
    ShadowDomRenderer.prototype.destroy = function () { this.sharedStylesHost.removeHost(this.shadowRoot); };
    /**
     * @param {?} parent
     * @param {?} newChild
     * @return {?}
     */
    ShadowDomRenderer.prototype.appendChild = function (parent, newChild) {
        return _super.prototype.appendChild.call(this, this.nodeOrShadowRoot(parent), newChild);
    };
    /**
     * @param {?} parent
     * @param {?} newChild
     * @param {?} refChild
     * @return {?}
     */
    ShadowDomRenderer.prototype.insertBefore = function (parent, newChild, refChild) {
        return _super.prototype.insertBefore.call(this, this.nodeOrShadowRoot(parent), newChild, refChild);
    };
    /**
     * @param {?} parent
     * @param {?} oldChild
     * @return {?}
     */
    ShadowDomRenderer.prototype.removeChild = function (parent, oldChild) {
        return _super.prototype.removeChild.call(this, this.nodeOrShadowRoot(parent), oldChild);
    };
    /**
     * @param {?} node
     * @return {?}
     */
    ShadowDomRenderer.prototype.parentNode = function (node) {
        return this.nodeOrShadowRoot(_super.prototype.parentNode.call(this, this.nodeOrShadowRoot(node)));
    };
    return ShadowDomRenderer;
}(DefaultDomRenderer2));
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var DomEventsPlugin = (function (_super) {
    __extends(DomEventsPlugin, _super);
    /**
     * @param {?} doc
     */
    function DomEventsPlugin(doc) {
        return _super.call(this, doc) || this;
    }
    /**
     * @param {?} eventName
     * @return {?}
     */
    DomEventsPlugin.prototype.supports = function (eventName) { return true; };
    /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    DomEventsPlugin.prototype.addEventListener = function (element, eventName, handler) {
        element.addEventListener(eventName, /** @type {?} */ (handler), false);
        return function () { return element.removeEventListener(eventName, /** @type {?} */ (handler), false); };
    };
    return DomEventsPlugin;
}(EventManagerPlugin));
DomEventsPlugin.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
DomEventsPlugin.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: _angular_core.Inject, args: [DOCUMENT,] },] },
]; };
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var EVENT_NAMES = {
    // pan
    'pan': true,
    'panstart': true,
    'panmove': true,
    'panend': true,
    'pancancel': true,
    'panleft': true,
    'panright': true,
    'panup': true,
    'pandown': true,
    // pinch
    'pinch': true,
    'pinchstart': true,
    'pinchmove': true,
    'pinchend': true,
    'pinchcancel': true,
    'pinchin': true,
    'pinchout': true,
    // press
    'press': true,
    'pressup': true,
    // rotate
    'rotate': true,
    'rotatestart': true,
    'rotatemove': true,
    'rotateend': true,
    'rotatecancel': true,
    // swipe
    'swipe': true,
    'swipeleft': true,
    'swiperight': true,
    'swipeup': true,
    'swipedown': true,
    // tap
    'tap': true,
};
/**
 * A DI token that you can use to provide{\@link HammerGestureConfig} to Angular. Use it to configure
 * Hammer gestures.
 *
 * \@experimental
 */
var HAMMER_GESTURE_CONFIG = new _angular_core.InjectionToken('HammerGestureConfig');
/**
 * \@experimental
 */
var HammerGestureConfig = (function () {
    function HammerGestureConfig() {
        this.events = [];
        this.overrides = {};
    }
    /**
     * @param {?} element
     * @return {?}
     */
    HammerGestureConfig.prototype.buildHammer = function (element) {
        var /** @type {?} */ mc = new Hammer(element);
        mc.get('pinch').set({ enable: true });
        mc.get('rotate').set({ enable: true });
        for (var /** @type {?} */ eventName in this.overrides) {
            mc.get(eventName).set(this.overrides[eventName]);
        }
        return mc;
    };
    return HammerGestureConfig;
}());
HammerGestureConfig.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
HammerGestureConfig.ctorParameters = function () { return []; };
var HammerGesturesPlugin = (function (_super) {
    __extends(HammerGesturesPlugin, _super);
    /**
     * @param {?} doc
     * @param {?} _config
     */
    function HammerGesturesPlugin(doc, _config) {
        var _this = _super.call(this, doc) || this;
        _this._config = _config;
        return _this;
    }
    /**
     * @param {?} eventName
     * @return {?}
     */
    HammerGesturesPlugin.prototype.supports = function (eventName) {
        if (!EVENT_NAMES.hasOwnProperty(eventName.toLowerCase()) && !this.isCustomEvent(eventName)) {
            return false;
        }
        if (!((window)).Hammer) {
            throw new Error("Hammer.js is not loaded, can not bind " + eventName + " event");
        }
        return true;
    };
    /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    HammerGesturesPlugin.prototype.addEventListener = function (element, eventName, handler) {
        var _this = this;
        var /** @type {?} */ zone = this.manager.getZone();
        eventName = eventName.toLowerCase();
        return zone.runOutsideAngular(function () {
            // Creating the manager bind events, must be done outside of angular
            var /** @type {?} */ mc = _this._config.buildHammer(element);
            var /** @type {?} */ callback = function (eventObj) {
                zone.runGuarded(function () { handler(eventObj); });
            };
            mc.on(eventName, callback);
            return function () { return mc.off(eventName, callback); };
        });
    };
    /**
     * @param {?} eventName
     * @return {?}
     */
    HammerGesturesPlugin.prototype.isCustomEvent = function (eventName) { return this._config.events.indexOf(eventName) > -1; };
    return HammerGesturesPlugin;
}(EventManagerPlugin));
HammerGesturesPlugin.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
HammerGesturesPlugin.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: _angular_core.Inject, args: [DOCUMENT,] },] },
    { type: HammerGestureConfig, decorators: [{ type: _angular_core.Inject, args: [HAMMER_GESTURE_CONFIG,] },] },
]; };
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var MODIFIER_KEYS = ['alt', 'control', 'meta', 'shift'];
var MODIFIER_KEY_GETTERS = {
    'alt': function (event) { return event.altKey; },
    'control': function (event) { return event.ctrlKey; },
    'meta': function (event) { return event.metaKey; },
    'shift': function (event) { return event.shiftKey; }
};
/**
 * \@experimental
 */
var KeyEventsPlugin = (function (_super) {
    __extends(KeyEventsPlugin, _super);
    /**
     * @param {?} doc
     */
    function KeyEventsPlugin(doc) {
        return _super.call(this, doc) || this;
    }
    /**
     * @param {?} eventName
     * @return {?}
     */
    KeyEventsPlugin.prototype.supports = function (eventName) { return KeyEventsPlugin.parseEventName(eventName) != null; };
    /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} handler
     * @return {?}
     */
    KeyEventsPlugin.prototype.addEventListener = function (element, eventName, handler) {
        var /** @type {?} */ parsedEvent = ((KeyEventsPlugin.parseEventName(eventName)));
        var /** @type {?} */ outsideHandler = KeyEventsPlugin.eventCallback(parsedEvent['fullKey'], handler, this.manager.getZone());
        return this.manager.getZone().runOutsideAngular(function () {
            return getDOM().onAndCancel(element, parsedEvent['domEventName'], outsideHandler);
        });
    };
    /**
     * @param {?} eventName
     * @return {?}
     */
    KeyEventsPlugin.parseEventName = function (eventName) {
        var /** @type {?} */ parts = eventName.toLowerCase().split('.');
        var /** @type {?} */ domEventName = parts.shift();
        if ((parts.length === 0) || !(domEventName === 'keydown' || domEventName === 'keyup')) {
            return null;
        }
        var /** @type {?} */ key = KeyEventsPlugin._normalizeKey(/** @type {?} */ ((parts.pop())));
        var /** @type {?} */ fullKey = '';
        MODIFIER_KEYS.forEach(function (modifierName) {
            var /** @type {?} */ index = parts.indexOf(modifierName);
            if (index > -1) {
                parts.splice(index, 1);
                fullKey += modifierName + '.';
            }
        });
        fullKey += key;
        if (parts.length != 0 || key.length === 0) {
            // returning null instead of throwing to let another plugin process the event
            return null;
        }
        var /** @type {?} */ result = {};
        result['domEventName'] = domEventName;
        result['fullKey'] = fullKey;
        return result;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    KeyEventsPlugin.getEventFullKey = function (event) {
        var /** @type {?} */ fullKey = '';
        var /** @type {?} */ key = getDOM().getEventKey(event);
        key = key.toLowerCase();
        if (key === ' ') {
            key = 'space'; // for readability
        }
        else if (key === '.') {
            key = 'dot'; // because '.' is used as a separator in event names
        }
        MODIFIER_KEYS.forEach(function (modifierName) {
            if (modifierName != key) {
                var /** @type {?} */ modifierGetter = MODIFIER_KEY_GETTERS[modifierName];
                if (modifierGetter(event)) {
                    fullKey += modifierName + '.';
                }
            }
        });
        fullKey += key;
        return fullKey;
    };
    /**
     * @param {?} fullKey
     * @param {?} handler
     * @param {?} zone
     * @return {?}
     */
    KeyEventsPlugin.eventCallback = function (fullKey, handler, zone) {
        return function (event /** TODO #9100 */) {
            if (KeyEventsPlugin.getEventFullKey(event) === fullKey) {
                zone.runGuarded(function () { return handler(event); });
            }
        };
    };
    /**
     * \@internal
     * @param {?} keyName
     * @return {?}
     */
    KeyEventsPlugin._normalizeKey = function (keyName) {
        // TODO: switch to a Map if the mapping grows too much
        switch (keyName) {
            case 'esc':
                return 'escape';
            default:
                return keyName;
        }
    };
    return KeyEventsPlugin;
}(EventManagerPlugin));
KeyEventsPlugin.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
KeyEventsPlugin.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: _angular_core.Inject, args: [DOCUMENT,] },] },
]; };
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A pattern that recognizes a commonly useful subset of URLs that are safe.
 *
 * This regular expression matches a subset of URLs that will not cause script
 * execution if used in URL context within a HTML document. Specifically, this
 * regular expression matches if (comment from here on and regex copied from
 * Soy's EscapingConventions):
 * (1) Either a protocol in a whitelist (http, https, mailto or ftp).
 * (2) or no protocol.  A protocol must be followed by a colon. The below
 *     allows that by allowing colons only after one of the characters [/?#].
 *     A colon after a hash (#) must be in the fragment.
 *     Otherwise, a colon after a (?) must be in a query.
 *     Otherwise, a colon after a single solidus (/) must be in a path.
 *     Otherwise, a colon after a double solidus (//) must be in the authority
 *     (before port).
 *
 * The pattern disallows &, used in HTML entity declarations before
 * one of the characters in [/?#]. This disallows HTML entities used in the
 * protocol name, which should never happen, e.g. "h&#116;tp" for "http".
 * It also disallows HTML entities in the first path part of a relative path,
 * e.g. "foo&lt;bar/baz".  Our existing escaping functions should not produce
 * that. More importantly, it disallows masking of a colon,
 * e.g. "javascript&#58;...".
 *
 * This regular expression was taken from the Closure sanitization library.
 */
var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;
/** A pattern that matches safe data URLs. Only matches image, video and audio types. */
var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+\/]+=*$/i;
/**
 * @param {?} url
 * @return {?}
 */
function sanitizeUrl(url) {
    url = String(url);
    if (url.match(SAFE_URL_PATTERN) || url.match(DATA_URL_PATTERN))
        return url;
    if (_angular_core.isDevMode()) {
        getDOM().log("WARNING: sanitizing unsafe URL value " + url + " (see http://g.co/ng/security#xss)");
    }
    return 'unsafe:' + url;
}
/**
 * @param {?} srcset
 * @return {?}
 */
function sanitizeSrcset(srcset) {
    srcset = String(srcset);
    return srcset.split(',').map(function (srcset) { return sanitizeUrl(srcset.trim()); }).join(', ');
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** A <body> element that can be safely used to parse untrusted HTML. Lazily initialized below. */
var inertElement = null;
/** Lazily initialized to make sure the DOM adapter gets set before use. */
var DOM = ((null));
/**
 * Returns an HTML element that is guaranteed to not execute code when creating elements in it.
 * @return {?}
 */
function getInertElement() {
    if (inertElement)
        return inertElement;
    DOM = getDOM();
    // Prefer using <template> element if supported.
    var /** @type {?} */ templateEl = DOM.createElement('template');
    if ('content' in templateEl)
        return templateEl;
    var /** @type {?} */ doc = DOM.createHtmlDocument();
    inertElement = DOM.querySelector(doc, 'body');
    if (inertElement == null) {
        // usually there should be only one body element in the document, but IE doesn't have any, so we
        // need to create one.
        var /** @type {?} */ html = DOM.createElement('html', doc);
        inertElement = DOM.createElement('body', doc);
        DOM.appendChild(html, inertElement);
        DOM.appendChild(doc, html);
    }
    return inertElement;
}
/**
 * @param {?} tags
 * @return {?}
 */
function tagSet(tags) {
    var /** @type {?} */ res = {};
    for (var _i = 0, _a = tags.split(','); _i < _a.length; _i++) {
        var t = _a[_i];
        res[t] = true;
    }
    return res;
}
/**
 * @param {...?} sets
 * @return {?}
 */
function merge() {
    var sets = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sets[_i] = arguments[_i];
    }
    var /** @type {?} */ res = {};
    for (var _a = 0, sets_1 = sets; _a < sets_1.length; _a++) {
        var s = sets_1[_a];
        for (var /** @type {?} */ v in s) {
            if (s.hasOwnProperty(v))
                res[v] = true;
        }
    }
    return res;
}
// Good source of info about elements and attributes
// http://dev.w3.org/html5/spec/Overview.html#semantics
// http://simon.html5.org/html-elements
// Safe Void Elements - HTML5
// http://dev.w3.org/html5/spec/Overview.html#void-elements
var VOID_ELEMENTS = tagSet('area,br,col,hr,img,wbr');
// Elements that you can, intentionally, leave open (and which close themselves)
// http://dev.w3.org/html5/spec/Overview.html#optional-tags
var OPTIONAL_END_TAG_BLOCK_ELEMENTS = tagSet('colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr');
var OPTIONAL_END_TAG_INLINE_ELEMENTS = tagSet('rp,rt');
var OPTIONAL_END_TAG_ELEMENTS = merge(OPTIONAL_END_TAG_INLINE_ELEMENTS, OPTIONAL_END_TAG_BLOCK_ELEMENTS);
// Safe Block Elements - HTML5
var BLOCK_ELEMENTS = merge(OPTIONAL_END_TAG_BLOCK_ELEMENTS, tagSet('address,article,' +
    'aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,' +
    'h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul'));
// Inline Elements - HTML5
var INLINE_ELEMENTS = merge(OPTIONAL_END_TAG_INLINE_ELEMENTS, tagSet('a,abbr,acronym,audio,b,' +
    'bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,' +
    'samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video'));
var VALID_ELEMENTS = merge(VOID_ELEMENTS, BLOCK_ELEMENTS, INLINE_ELEMENTS, OPTIONAL_END_TAG_ELEMENTS);
// Attributes that have href and hence need to be sanitized
var URI_ATTRS = tagSet('background,cite,href,itemtype,longdesc,poster,src,xlink:href');
// Attributes that have special href set hence need to be sanitized
var SRCSET_ATTRS = tagSet('srcset');
var HTML_ATTRS = tagSet('abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,' +
    'compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,' +
    'ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,' +
    'scope,scrolling,shape,size,sizes,span,srclang,start,summary,tabindex,target,title,translate,type,usemap,' +
    'valign,value,vspace,width');
// NB: This currently conciously doesn't support SVG. SVG sanitization has had several security
// issues in the past, so it seems safer to leave it out if possible. If support for binding SVG via
// innerHTML is required, SVG attributes should be added here.
// NB: Sanitization does not allow <form> elements or other active elements (<button> etc). Those
// can be sanitized, but they increase security surface area without a legitimate use case, so they
// are left out here.
var VALID_ATTRS = merge(URI_ATTRS, SRCSET_ATTRS, HTML_ATTRS);
/**
 * SanitizingHtmlSerializer serializes a DOM fragment, stripping out any unsafe elements and unsafe
 * attributes.
 */
var SanitizingHtmlSerializer = (function () {
    function SanitizingHtmlSerializer() {
        this.sanitizedSomething = false;
        this.buf = [];
    }
    /**
     * @param {?} el
     * @return {?}
     */
    SanitizingHtmlSerializer.prototype.sanitizeChildren = function (el) {
        // This cannot use a TreeWalker, as it has to run on Angular's various DOM adapters.
        // However this code never accesses properties off of `document` before deleting its contents
        // again, so it shouldn't be vulnerable to DOM clobbering.
        var /** @type {?} */ current = ((el.firstChild));
        while (current) {
            if (DOM.isElementNode(current)) {
                this.startElement(/** @type {?} */ (current));
            }
            else if (DOM.isTextNode(current)) {
                this.chars(/** @type {?} */ ((DOM.nodeValue(current))));
            }
            else {
                // Strip non-element, non-text nodes.
                this.sanitizedSomething = true;
            }
            if (DOM.firstChild(current)) {
                current = ((DOM.firstChild(current)));
                continue;
            }
            while (current) {
                // Leaving the element. Walk up and to the right, closing tags as we go.
                if (DOM.isElementNode(current)) {
                    this.endElement(/** @type {?} */ (current));
                }
                var /** @type {?} */ next = checkClobberedElement(current, /** @type {?} */ ((DOM.nextSibling(current))));
                if (next) {
                    current = next;
                    break;
                }
                current = checkClobberedElement(current, /** @type {?} */ ((DOM.parentElement(current))));
            }
        }
        return this.buf.join('');
    };
    /**
     * @param {?} element
     * @return {?}
     */
    SanitizingHtmlSerializer.prototype.startElement = function (element) {
        var _this = this;
        var /** @type {?} */ tagName = DOM.nodeName(element).toLowerCase();
        if (!VALID_ELEMENTS.hasOwnProperty(tagName)) {
            this.sanitizedSomething = true;
            return;
        }
        this.buf.push('<');
        this.buf.push(tagName);
        DOM.attributeMap(element).forEach(function (value, attrName) {
            var /** @type {?} */ lower = attrName.toLowerCase();
            if (!VALID_ATTRS.hasOwnProperty(lower)) {
                _this.sanitizedSomething = true;
                return;
            }
            // TODO(martinprobst): Special case image URIs for data:image/...
            if (URI_ATTRS[lower])
                value = sanitizeUrl(value);
            if (SRCSET_ATTRS[lower])
                value = sanitizeSrcset(value);
            _this.buf.push(' ');
            _this.buf.push(attrName);
            _this.buf.push('="');
            _this.buf.push(encodeEntities(value));
            _this.buf.push('"');
        });
        this.buf.push('>');
    };
    /**
     * @param {?} current
     * @return {?}
     */
    SanitizingHtmlSerializer.prototype.endElement = function (current) {
        var /** @type {?} */ tagName = DOM.nodeName(current).toLowerCase();
        if (VALID_ELEMENTS.hasOwnProperty(tagName) && !VOID_ELEMENTS.hasOwnProperty(tagName)) {
            this.buf.push('</');
            this.buf.push(tagName);
            this.buf.push('>');
        }
    };
    /**
     * @param {?} chars
     * @return {?}
     */
    SanitizingHtmlSerializer.prototype.chars = function (chars) { this.buf.push(encodeEntities(chars)); };
    return SanitizingHtmlSerializer;
}());
/**
 * @param {?} node
 * @param {?} nextNode
 * @return {?}
 */
function checkClobberedElement(node, nextNode) {
    if (nextNode && DOM.contains(node, nextNode)) {
        throw new Error("Failed to sanitize html because the element is clobbered: " + DOM.getOuterHTML(node));
    }
    return nextNode;
}
// Regular Expressions for parsing tags and attributes
var SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
// ! to ~ is the ASCII range.
var NON_ALPHANUMERIC_REGEXP = /([^\#-~ |!])/g;
/**
 * Escapes all potentially dangerous characters, so that the
 * resulting string can be safely inserted into attribute or
 * element text.
 * @param {?} value
 * @return {?}
 */
function encodeEntities(value) {
    return value.replace(/&/g, '&amp;')
        .replace(SURROGATE_PAIR_REGEXP, function (match) {
        var /** @type {?} */ hi = match.charCodeAt(0);
        var /** @type {?} */ low = match.charCodeAt(1);
        return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
    })
        .replace(NON_ALPHANUMERIC_REGEXP, function (match) { return '&#' + match.charCodeAt(0) + ';'; })
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
/**
 * When IE9-11 comes across an unknown namespaced attribute e.g. 'xlink:foo' it adds 'xmlns:ns1'
 * attribute to declare ns1 namespace and prefixes the attribute with 'ns1' (e.g. 'ns1:xlink:foo').
 *
 * This is undesirable since we don't want to allow any of these custom attributes. This method
 * strips them all.
 * @param {?} el
 * @return {?}
 */
function stripCustomNsAttrs(el) {
    DOM.attributeMap(el).forEach(function (_, attrName) {
        if (attrName === 'xmlns:ns1' || attrName.indexOf('ns1:') === 0) {
            DOM.removeAttribute(el, attrName);
        }
    });
    for (var _i = 0, _a = DOM.childNodesAsList(el); _i < _a.length; _i++) {
        var n = _a[_i];
        if (DOM.isElementNode(n))
            stripCustomNsAttrs(/** @type {?} */ (n));
    }
}
/**
 * Sanitizes the given unsafe, untrusted HTML fragment, and returns HTML text that is safe to add to
 * the DOM in a browser environment.
 * @param {?} defaultDoc
 * @param {?} unsafeHtmlInput
 * @return {?}
 */
function sanitizeHtml(defaultDoc, unsafeHtmlInput) {
    try {
        var /** @type {?} */ containerEl = getInertElement();
        // Make sure unsafeHtml is actually a string (TypeScript types are not enforced at runtime).
        var /** @type {?} */ unsafeHtml = unsafeHtmlInput ? String(unsafeHtmlInput) : '';
        // mXSS protection. Repeatedly parse the document to make sure it stabilizes, so that a browser
        // trying to auto-correct incorrect HTML cannot cause formerly inert HTML to become dangerous.
        var /** @type {?} */ mXSSAttempts = 5;
        var /** @type {?} */ parsedHtml = unsafeHtml;
        do {
            if (mXSSAttempts === 0) {
                throw new Error('Failed to sanitize html because the input is unstable');
            }
            mXSSAttempts--;
            unsafeHtml = parsedHtml;
            DOM.setInnerHTML(containerEl, unsafeHtml);
            if (defaultDoc.documentMode) {
                // strip custom-namespaced attributes on IE<=11
                stripCustomNsAttrs(containerEl);
            }
            parsedHtml = DOM.getInnerHTML(containerEl);
        } while (unsafeHtml !== parsedHtml);
        var /** @type {?} */ sanitizer = new SanitizingHtmlSerializer();
        var /** @type {?} */ safeHtml = sanitizer.sanitizeChildren(DOM.getTemplateContent(containerEl) || containerEl);
        // Clear out the body element.
        var /** @type {?} */ parent = DOM.getTemplateContent(containerEl) || containerEl;
        for (var _i = 0, _a = DOM.childNodesAsList(parent); _i < _a.length; _i++) {
            var child = _a[_i];
            DOM.removeChild(parent, child);
        }
        if (_angular_core.isDevMode() && sanitizer.sanitizedSomething) {
            DOM.log('WARNING: sanitizing HTML stripped some content (see http://g.co/ng/security#xss).');
        }
        return safeHtml;
    }
    catch (e) {
        // In case anything goes wrong, clear out inertElement to reset the entire DOM structure.
        inertElement = null;
        throw e;
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
 * Regular expression for safe style values.
 *
 * Quotes (" and ') are allowed, but a check must be done elsewhere to ensure they're balanced.
 *
 * ',' allows multiple values to be assigned to the same property (e.g. background-attachment or
 * font-family) and hence could allow multiple values to get injected, but that should pose no risk
 * of XSS.
 *
 * The function expression checks only for XSS safety, not for CSS validity.
 *
 * This regular expression was taken from the Closure sanitization library, and augmented for
 * transformation values.
 */
var VALUES = '[-,."\'%_!# a-zA-Z0-9]+';
var TRANSFORMATION_FNS = '(?:matrix|translate|scale|rotate|skew|perspective)(?:X|Y|3d)?';
var COLOR_FNS = '(?:rgb|hsl)a?';
var GRADIENTS = '(?:repeating-)?(?:linear|radial)-gradient';
var CSS3_FNS = '(?:calc|attr)';
var FN_ARGS = '\\([-0-9.%, #a-zA-Z]+\\)';
var SAFE_STYLE_VALUE = new RegExp("^(" + VALUES + "|" +
    ("(?:" + TRANSFORMATION_FNS + "|" + COLOR_FNS + "|" + GRADIENTS + "|" + CSS3_FNS + ")") +
    (FN_ARGS + ")$"), 'g');
/**
 * Matches a `url(...)` value with an arbitrary argument as long as it does
 * not contain parentheses.
 *
 * The URL value still needs to be sanitized separately.
 *
 * `url(...)` values are a very common use case, e.g. for `background-image`. With carefully crafted
 * CSS style rules, it is possible to construct an information leak with `url` values in CSS, e.g.
 * by observing whether scroll bars are displayed, or character ranges used by a font face
 * definition.
 *
 * Angular only allows binding CSS values (as opposed to entire CSS rules), so it is unlikely that
 * binding a URL value without further cooperation from the page will cause an information leak, and
 * if so, it is just a leak, not a full blown XSS vulnerability.
 *
 * Given the common use case, low likelihood of attack vector, and low impact of an attack, this
 * code is permissive and allows URLs that sanitize otherwise.
 */
var URL_RE = /^url\(([^)]+)\)$/;
/**
 * Checks that quotes (" and ') are properly balanced inside a string. Assumes
 * that neither escape (\) nor any other character that could result in
 * breaking out of a string parsing context are allowed;
 * see http://www.w3.org/TR/css3-syntax/#string-token-diagram.
 *
 * This code was taken from the Closure sanitization library.
 * @param {?} value
 * @return {?}
 */
function hasBalancedQuotes(value) {
    var /** @type {?} */ outsideSingle = true;
    var /** @type {?} */ outsideDouble = true;
    for (var /** @type {?} */ i = 0; i < value.length; i++) {
        var /** @type {?} */ c = value.charAt(i);
        if (c === '\'' && outsideDouble) {
            outsideSingle = !outsideSingle;
        }
        else if (c === '"' && outsideSingle) {
            outsideDouble = !outsideDouble;
        }
    }
    return outsideSingle && outsideDouble;
}
/**
 * Sanitizes the given untrusted CSS style property value (i.e. not an entire object, just a single
 * value) and returns a value that is safe to use in a browser environment.
 * @param {?} value
 * @return {?}
 */
function sanitizeStyle(value) {
    value = String(value).trim(); // Make sure it's actually a string.
    if (!value)
        return '';
    // Single url(...) values are supported, but only for URLs that sanitize cleanly. See above for
    // reasoning behind this.
    var /** @type {?} */ urlMatch = value.match(URL_RE);
    if ((urlMatch && sanitizeUrl(urlMatch[1]) === urlMatch[1]) ||
        value.match(SAFE_STYLE_VALUE) && hasBalancedQuotes(value)) {
        return value; // Safe style values.
    }
    if (_angular_core.isDevMode()) {
        getDOM().log("WARNING: sanitizing unsafe style value " + value + " (see http://g.co/ng/security#xss).");
    }
    return 'unsafe';
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * DomSanitizer helps preventing Cross Site Scripting Security bugs (XSS) by sanitizing
 * values to be safe to use in the different DOM contexts.
 *
 * For example, when binding a URL in an `<a [href]="someValue">` hyperlink, `someValue` will be
 * sanitized so that an attacker cannot inject e.g. a `javascript:` URL that would execute code on
 * the website.
 *
 * In specific situations, it might be necessary to disable sanitization, for example if the
 * application genuinely needs to produce a `javascript:` style link with a dynamic value in it.
 * Users can bypass security by constructing a value with one of the `bypassSecurityTrust...`
 * methods, and then binding to that value from the template.
 *
 * These situations should be very rare, and extraordinary care must be taken to avoid creating a
 * Cross Site Scripting (XSS) security bug!
 *
 * When using `bypassSecurityTrust...`, make sure to call the method as early as possible and as
 * close as possible to the source of the value, to make it easy to verify no security bug is
 * created by its use.
 *
 * It is not required (and not recommended) to bypass security if the value is safe, e.g. a URL that
 * does not start with a suspicious protocol, or an HTML snippet that does not contain dangerous
 * code. The sanitizer leaves safe values intact.
 *
 * \@security Calling any of the `bypassSecurityTrust...` APIs disables Angular's built-in
 * sanitization for the value passed in. Carefully check and audit all values and code paths going
 * into this call. Make sure any user data is appropriately escaped for this security context.
 * For more detail, see the [Security Guide](http://g.co/ng/security).
 *
 * \@stable
 * @abstract
 */
var DomSanitizer = (function () {
    function DomSanitizer() {
    }
    /**
     * Sanitizes a value for use in the given SecurityContext.
     *
     * If value is trusted for the context, this method will unwrap the contained safe value and use
     * it directly. Otherwise, value will be sanitized to be safe in the given context, for example
     * by replacing URLs that have an unsafe protocol part (such as `javascript:`). The implementation
     * is responsible to make sure that the value can definitely be safely used in the given context.
     * @abstract
     * @param {?} context
     * @param {?} value
     * @return {?}
     */
    DomSanitizer.prototype.sanitize = function (context, value) { };
    /**
     * Bypass security and trust the given value to be safe HTML. Only use this when the bound HTML
     * is unsafe (e.g. contains `<script>` tags) and the code should be executed. The sanitizer will
     * leave safe HTML intact, so in most situations this method should not be used.
     *
     * **WARNING:** calling this method with untrusted user data exposes your application to XSS
     * security risks!
     * @abstract
     * @param {?} value
     * @return {?}
     */
    DomSanitizer.prototype.bypassSecurityTrustHtml = function (value) { };
    /**
     * Bypass security and trust the given value to be safe style value (CSS).
     *
     * **WARNING:** calling this method with untrusted user data exposes your application to XSS
     * security risks!
     * @abstract
     * @param {?} value
     * @return {?}
     */
    DomSanitizer.prototype.bypassSecurityTrustStyle = function (value) { };
    /**
     * Bypass security and trust the given value to be safe JavaScript.
     *
     * **WARNING:** calling this method with untrusted user data exposes your application to XSS
     * security risks!
     * @abstract
     * @param {?} value
     * @return {?}
     */
    DomSanitizer.prototype.bypassSecurityTrustScript = function (value) { };
    /**
     * Bypass security and trust the given value to be a safe style URL, i.e. a value that can be used
     * in hyperlinks or `<img src>`.
     *
     * **WARNING:** calling this method with untrusted user data exposes your application to XSS
     * security risks!
     * @abstract
     * @param {?} value
     * @return {?}
     */
    DomSanitizer.prototype.bypassSecurityTrustUrl = function (value) { };
    /**
     * Bypass security and trust the given value to be a safe resource URL, i.e. a location that may
     * be used to load executable code from, like `<script src>`, or `<iframe src>`.
     *
     * **WARNING:** calling this method with untrusted user data exposes your application to XSS
     * security risks!
     * @abstract
     * @param {?} value
     * @return {?}
     */
    DomSanitizer.prototype.bypassSecurityTrustResourceUrl = function (value) { };
    return DomSanitizer;
}());
var DomSanitizerImpl = (function (_super) {
    __extends(DomSanitizerImpl, _super);
    /**
     * @param {?} _doc
     */
    function DomSanitizerImpl(_doc) {
        var _this = _super.call(this) || this;
        _this._doc = _doc;
        return _this;
    }
    /**
     * @param {?} ctx
     * @param {?} value
     * @return {?}
     */
    DomSanitizerImpl.prototype.sanitize = function (ctx, value) {
        if (value == null)
            return null;
        switch (ctx) {
            case _angular_core.SecurityContext.NONE:
                return (value);
            case _angular_core.SecurityContext.HTML:
                if (value instanceof SafeHtmlImpl)
                    return value.changingThisBreaksApplicationSecurity;
                this.checkNotSafeValue(value, 'HTML');
                return sanitizeHtml(this._doc, String(value));
            case _angular_core.SecurityContext.STYLE:
                if (value instanceof SafeStyleImpl)
                    return value.changingThisBreaksApplicationSecurity;
                this.checkNotSafeValue(value, 'Style');
                return sanitizeStyle(/** @type {?} */ (value));
            case _angular_core.SecurityContext.SCRIPT:
                if (value instanceof SafeScriptImpl)
                    return value.changingThisBreaksApplicationSecurity;
                this.checkNotSafeValue(value, 'Script');
                throw new Error('unsafe value used in a script context');
            case _angular_core.SecurityContext.URL:
                if (value instanceof SafeResourceUrlImpl || value instanceof SafeUrlImpl) {
                    // Allow resource URLs in URL contexts, they are strictly more trusted.
                    return value.changingThisBreaksApplicationSecurity;
                }
                this.checkNotSafeValue(value, 'URL');
                return sanitizeUrl(String(value));
            case _angular_core.SecurityContext.RESOURCE_URL:
                if (value instanceof SafeResourceUrlImpl) {
                    return value.changingThisBreaksApplicationSecurity;
                }
                this.checkNotSafeValue(value, 'ResourceURL');
                throw new Error('unsafe value used in a resource URL context (see http://g.co/ng/security#xss)');
            default:
                throw new Error("Unexpected SecurityContext " + ctx + " (see http://g.co/ng/security#xss)");
        }
    };
    /**
     * @param {?} value
     * @param {?} expectedType
     * @return {?}
     */
    DomSanitizerImpl.prototype.checkNotSafeValue = function (value, expectedType) {
        if (value instanceof SafeValueImpl) {
            throw new Error("Required a safe " + expectedType + ", got a " + value.getTypeName() + " " +
                "(see http://g.co/ng/security#xss)");
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    DomSanitizerImpl.prototype.bypassSecurityTrustHtml = function (value) { return new SafeHtmlImpl(value); };
    /**
     * @param {?} value
     * @return {?}
     */
    DomSanitizerImpl.prototype.bypassSecurityTrustStyle = function (value) { return new SafeStyleImpl(value); };
    /**
     * @param {?} value
     * @return {?}
     */
    DomSanitizerImpl.prototype.bypassSecurityTrustScript = function (value) { return new SafeScriptImpl(value); };
    /**
     * @param {?} value
     * @return {?}
     */
    DomSanitizerImpl.prototype.bypassSecurityTrustUrl = function (value) { return new SafeUrlImpl(value); };
    /**
     * @param {?} value
     * @return {?}
     */
    DomSanitizerImpl.prototype.bypassSecurityTrustResourceUrl = function (value) {
        return new SafeResourceUrlImpl(value);
    };
    return DomSanitizerImpl;
}(DomSanitizer));
DomSanitizerImpl.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
DomSanitizerImpl.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: _angular_core.Inject, args: [DOCUMENT,] },] },
]; };
/**
 * @abstract
 */
var SafeValueImpl = (function () {
    /**
     * @param {?} changingThisBreaksApplicationSecurity
     */
    function SafeValueImpl(changingThisBreaksApplicationSecurity) {
        this.changingThisBreaksApplicationSecurity = changingThisBreaksApplicationSecurity;
        // empty
    }
    /**
     * @abstract
     * @return {?}
     */
    SafeValueImpl.prototype.getTypeName = function () { };
    /**
     * @return {?}
     */
    SafeValueImpl.prototype.toString = function () {
        return "SafeValue must use [property]=binding: " + this.changingThisBreaksApplicationSecurity +
            " (see http://g.co/ng/security#xss)";
    };
    return SafeValueImpl;
}());
var SafeHtmlImpl = (function (_super) {
    __extends(SafeHtmlImpl, _super);
    function SafeHtmlImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    SafeHtmlImpl.prototype.getTypeName = function () { return 'HTML'; };
    return SafeHtmlImpl;
}(SafeValueImpl));
var SafeStyleImpl = (function (_super) {
    __extends(SafeStyleImpl, _super);
    function SafeStyleImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    SafeStyleImpl.prototype.getTypeName = function () { return 'Style'; };
    return SafeStyleImpl;
}(SafeValueImpl));
var SafeScriptImpl = (function (_super) {
    __extends(SafeScriptImpl, _super);
    function SafeScriptImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    SafeScriptImpl.prototype.getTypeName = function () { return 'Script'; };
    return SafeScriptImpl;
}(SafeValueImpl));
var SafeUrlImpl = (function (_super) {
    __extends(SafeUrlImpl, _super);
    function SafeUrlImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    SafeUrlImpl.prototype.getTypeName = function () { return 'URL'; };
    return SafeUrlImpl;
}(SafeValueImpl));
var SafeResourceUrlImpl = (function (_super) {
    __extends(SafeResourceUrlImpl, _super);
    function SafeResourceUrlImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    SafeResourceUrlImpl.prototype.getTypeName = function () { return 'ResourceURL'; };
    return SafeResourceUrlImpl;
}(SafeValueImpl));
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var INTERNAL_BROWSER_PLATFORM_PROVIDERS = [
    { provide: _angular_core.PLATFORM_ID, useValue: _angular_common.ɵPLATFORM_BROWSER_ID },
    { provide: _angular_core.PLATFORM_INITIALIZER, useValue: initDomAdapter, multi: true },
    { provide: _angular_common.PlatformLocation, useClass: BrowserPlatformLocation },
    { provide: DOCUMENT, useFactory: _document, deps: [] },
];
/**
 * \@security Replacing built-in sanitization providers exposes the application to XSS risks.
 * Attacker-controlled data introduced by an unsanitized provider could expose your
 * application to XSS risks. For more detail, see the [Security Guide](http://g.co/ng/security).
 * \@experimental
 */
var BROWSER_SANITIZATION_PROVIDERS = [
    { provide: _angular_core.Sanitizer, useExisting: DomSanitizer },
    { provide: DomSanitizer, useClass: DomSanitizerImpl },
];
/**
 * \@stable
 */
var platformBrowser = _angular_core.createPlatformFactory(_angular_core.platformCore, 'browser', INTERNAL_BROWSER_PLATFORM_PROVIDERS);
/**
 * @return {?}
 */
function initDomAdapter() {
    BrowserDomAdapter.makeCurrent();
    BrowserGetTestability.init();
}
/**
 * @return {?}
 */
function errorHandler() {
    return new _angular_core.ErrorHandler();
}
/**
 * @return {?}
 */
function _document() {
    return document;
}
/**
 * The ng module for the browser.
 *
 * \@stable
 */
var BrowserModule = (function () {
    /**
     * @param {?} parentModule
     */
    function BrowserModule(parentModule) {
        if (parentModule) {
            throw new Error("BrowserModule has already been loaded. If you need access to common directives such as NgIf and NgFor from a lazy loaded module, import CommonModule instead.");
        }
    }
    /**
     * Configures a browser-based application to transition from a server-rendered app, if
     * one is present on the page. The specified parameters must include an application id,
     * which must match between the client and server applications.
     *
     * \@experimental
     * @param {?} params
     * @return {?}
     */
    BrowserModule.withServerTransition = function (params) {
        return {
            ngModule: BrowserModule,
            providers: [
                { provide: _angular_core.APP_ID, useValue: params.appId },
                { provide: TRANSITION_ID, useExisting: _angular_core.APP_ID },
                SERVER_TRANSITION_PROVIDERS,
            ],
        };
    };
    return BrowserModule;
}());
BrowserModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                providers: [
                    BROWSER_SANITIZATION_PROVIDERS,
                    { provide: _angular_core.ErrorHandler, useFactory: errorHandler, deps: [] },
                    { provide: EVENT_MANAGER_PLUGINS, useClass: DomEventsPlugin, multi: true },
                    { provide: EVENT_MANAGER_PLUGINS, useClass: KeyEventsPlugin, multi: true },
                    { provide: EVENT_MANAGER_PLUGINS, useClass: HammerGesturesPlugin, multi: true },
                    { provide: HAMMER_GESTURE_CONFIG, useClass: HammerGestureConfig },
                    DomRendererFactory2,
                    { provide: _angular_core.RendererFactory2, useExisting: DomRendererFactory2 },
                    { provide: SharedStylesHost, useExisting: DomSharedStylesHost },
                    DomSharedStylesHost,
                    _angular_core.Testability,
                    EventManager,
                    ELEMENT_PROBE_PROVIDERS,
                    Meta,
                    Title,
                ],
                exports: [_angular_common.CommonModule, _angular_core.ApplicationModule]
            },] },
];
/**
 * @nocollapse
 */
BrowserModule.ctorParameters = function () { return [
    { type: BrowserModule, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.SkipSelf },] },
]; };
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var win = typeof window !== 'undefined' && window || {};
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var ChangeDetectionPerfRecord = (function () {
    /**
     * @param {?} msPerTick
     * @param {?} numTicks
     */
    function ChangeDetectionPerfRecord(msPerTick, numTicks) {
        this.msPerTick = msPerTick;
        this.numTicks = numTicks;
    }
    return ChangeDetectionPerfRecord;
}());
/**
 * Entry point for all Angular profiling-related debug tools. This object
 * corresponds to the `ng.profiler` in the dev console.
 */
var AngularProfiler = (function () {
    /**
     * @param {?} ref
     */
    function AngularProfiler(ref) {
        this.appRef = ref.injector.get(_angular_core.ApplicationRef);
    }
    /**
     * Exercises change detection in a loop and then prints the average amount of
     * time in milliseconds how long a single round of change detection takes for
     * the current state of the UI. It runs a minimum of 5 rounds for a minimum
     * of 500 milliseconds.
     *
     * Optionally, a user may pass a `config` parameter containing a map of
     * options. Supported options are:
     *
     * `record` (boolean) - causes the profiler to record a CPU profile while
     * it exercises the change detector. Example:
     *
     * ```
     * ng.profiler.timeChangeDetection({record: true})
     * ```
     * @param {?} config
     * @return {?}
     */
    AngularProfiler.prototype.timeChangeDetection = function (config) {
        var /** @type {?} */ record = config && config['record'];
        var /** @type {?} */ profileName = 'Change Detection';
        // Profiler is not available in Android browsers, nor in IE 9 without dev tools opened
        var /** @type {?} */ isProfilerAvailable = win.console.profile != null;
        if (record && isProfilerAvailable) {
            win.console.profile(profileName);
        }
        var /** @type {?} */ start = getDOM().performanceNow();
        var /** @type {?} */ numTicks = 0;
        while (numTicks < 5 || (getDOM().performanceNow() - start) < 500) {
            this.appRef.tick();
            numTicks++;
        }
        var /** @type {?} */ end = getDOM().performanceNow();
        if (record && isProfilerAvailable) {
            // need to cast to <any> because type checker thinks there's no argument
            // while in fact there is:
            //
            // https://developer.mozilla.org/en-US/docs/Web/API/Console/profileEnd
            ((win.console.profileEnd))(profileName);
        }
        var /** @type {?} */ msPerTick = (end - start) / numTicks;
        win.console.log("ran " + numTicks + " change detection cycles");
        win.console.log(msPerTick.toFixed(2) + " ms per check");
        return new ChangeDetectionPerfRecord(msPerTick, numTicks);
    };
    return AngularProfiler;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var PROFILER_GLOBAL_NAME = 'ng.profiler';
/**
 * Enabled Angular debug tools that are accessible via your browser's
 * developer console.
 *
 * Usage:
 *
 * 1. Open developer console (e.g. in Chrome Ctrl + Shift + j)
 * 1. Type `ng.` (usually the console will show auto-complete suggestion)
 * 1. Try the change detection profiler `ng.profiler.timeChangeDetection()`
 *    then hit Enter.
 *
 * \@experimental All debugging apis are currently experimental.
 * @template T
 * @param {?} ref
 * @return {?}
 */
function enableDebugTools(ref) {
    getDOM().setGlobalVar(PROFILER_GLOBAL_NAME, new AngularProfiler(ref));
    return ref;
}
/**
 * Disables Angular tools.
 *
 * \@experimental All debugging apis are currently experimental.
 * @return {?}
 */
function disableDebugTools() {
    getDOM().setGlobalVar(PROFILER_GLOBAL_NAME, null);
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Predicates for use with {\@link DebugElement}'s query functions.
 *
 * \@experimental All debugging apis are currently experimental.
 */
var By = (function () {
    function By() {
    }
    /**
     * Match all elements.
     *
     * ## Example
     *
     * {\@example platform-browser/dom/debug/ts/by/by.ts region='by_all'}
     * @return {?}
     */
    By.all = function () { return function (debugElement) { return true; }; };
    /**
     * Match elements by the given CSS selector.
     *
     * ## Example
     *
     * {\@example platform-browser/dom/debug/ts/by/by.ts region='by_css'}
     * @param {?} selector
     * @return {?}
     */
    By.css = function (selector) {
        return function (debugElement) {
            return debugElement.nativeElement != null ?
                getDOM().elementMatches(debugElement.nativeElement, selector) :
                false;
        };
    };
    /**
     * Match elements that have the given directive present.
     *
     * ## Example
     *
     * {\@example platform-browser/dom/debug/ts/by/by.ts region='by_directive'}
     * @param {?} type
     * @return {?}
     */
    By.directive = function (type) {
        return function (debugElement) { return ((debugElement.providerTokens)).indexOf(type) !== -1; };
    };
    return By;
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
/**
 * @module
 * @description
 * Entry point for all public APIs of the common package.
 */
/**
 * \@stable
 */
var VERSION = new _angular_core.Version('4.1.3');

exports.BrowserModule = BrowserModule;
exports.platformBrowser = platformBrowser;
exports.Meta = Meta;
exports.Title = Title;
exports.disableDebugTools = disableDebugTools;
exports.enableDebugTools = enableDebugTools;
exports.By = By;
exports.NgProbeToken = NgProbeToken$1;
exports.DOCUMENT = DOCUMENT;
exports.EVENT_MANAGER_PLUGINS = EVENT_MANAGER_PLUGINS;
exports.EventManager = EventManager;
exports.HAMMER_GESTURE_CONFIG = HAMMER_GESTURE_CONFIG;
exports.HammerGestureConfig = HammerGestureConfig;
exports.DomSanitizer = DomSanitizer;
exports.VERSION = VERSION;
exports.ɵBROWSER_SANITIZATION_PROVIDERS = BROWSER_SANITIZATION_PROVIDERS;
exports.ɵINTERNAL_BROWSER_PLATFORM_PROVIDERS = INTERNAL_BROWSER_PLATFORM_PROVIDERS;
exports.ɵinitDomAdapter = initDomAdapter;
exports.ɵBrowserDomAdapter = BrowserDomAdapter;
exports.ɵsetValueOnPath = setValueOnPath;
exports.ɵBrowserPlatformLocation = BrowserPlatformLocation;
exports.ɵTRANSITION_ID = TRANSITION_ID;
exports.ɵBrowserGetTestability = BrowserGetTestability;
exports.ɵELEMENT_PROBE_PROVIDERS = ELEMENT_PROBE_PROVIDERS;
exports.ɵDomAdapter = DomAdapter;
exports.ɵgetDOM = getDOM;
exports.ɵsetRootDomAdapter = setRootDomAdapter;
exports.ɵDomRendererFactory2 = DomRendererFactory2;
exports.ɵNAMESPACE_URIS = NAMESPACE_URIS;
exports.ɵflattenStyles = flattenStyles;
exports.ɵshimContentAttribute = shimContentAttribute;
exports.ɵshimHostAttribute = shimHostAttribute;
exports.ɵDomEventsPlugin = DomEventsPlugin;
exports.ɵHammerGesturesPlugin = HammerGesturesPlugin;
exports.ɵKeyEventsPlugin = KeyEventsPlugin;
exports.ɵDomSharedStylesHost = DomSharedStylesHost;
exports.ɵSharedStylesHost = SharedStylesHost;
exports.ɵb = _document;
exports.ɵa = errorHandler;
exports.ɵh = GenericBrowserDomAdapter;
exports.ɵg = SERVER_TRANSITION_PROVIDERS;
exports.ɵf = appInitializerFactory;
exports.ɵc = _createNgProbe;
exports.ɵd = EventManagerPlugin;
exports.ɵe = DomSanitizerImpl;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=platform-browser.umd.js.map
