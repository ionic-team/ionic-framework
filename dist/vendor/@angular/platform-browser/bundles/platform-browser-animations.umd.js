/**
 * @license Angular v4.1.3
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/platform-browser'), require('@angular/animations/browser')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/platform-browser', '@angular/animations/browser'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.platformBrowser = global.ng.platformBrowser || {}, global.ng.platformBrowser.animations = global.ng.platformBrowser.animations || {}),global.ng.core,global.ng.platformBrowser,global.ng.animations.browser));
}(this, (function (exports,_angular_core,_angular_platformBrowser,_angular_animations_browser) { 'use strict';

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
var AnimationRendererFactory = (function () {
    /**
     * @param {?} delegate
     * @param {?} _engine
     * @param {?} _zone
     */
    function AnimationRendererFactory(delegate, _engine, _zone) {
        this.delegate = delegate;
        this._engine = _engine;
        this._zone = _zone;
    }
    /**
     * @param {?} hostElement
     * @param {?} type
     * @return {?}
     */
    AnimationRendererFactory.prototype.createRenderer = function (hostElement, type) {
        var _this = this;
        var /** @type {?} */ delegate = this.delegate.createRenderer(hostElement, type);
        if (!hostElement || !type || !type.data || !type.data['animation'])
            return delegate;
        var /** @type {?} */ namespaceId = type.id;
        var /** @type {?} */ animationTriggers = (type.data['animation']);
        animationTriggers.forEach(function (trigger) { return _this._engine.registerTrigger(trigger, namespaceify(namespaceId, trigger.name)); });
        return new AnimationRenderer(delegate, this._engine, this._zone, namespaceId);
    };
    return AnimationRendererFactory;
}());
AnimationRendererFactory.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
AnimationRendererFactory.ctorParameters = function () { return [
    { type: _angular_core.RendererFactory2, },
    { type: _angular_animations_browser.ɵAnimationEngine, },
    { type: _angular_core.NgZone, },
]; };
var AnimationRenderer = (function () {
    /**
     * @param {?} delegate
     * @param {?} _engine
     * @param {?} _zone
     * @param {?} _namespaceId
     */
    function AnimationRenderer(delegate, _engine, _zone, _namespaceId) {
        this.delegate = delegate;
        this._engine = _engine;
        this._zone = _zone;
        this._namespaceId = _namespaceId;
        this.destroyNode = null;
        this._flushPromise = null;
        this.destroyNode = this.delegate.destroyNode ? function (n) { return delegate.destroyNode(n); } : null;
    }
    Object.defineProperty(AnimationRenderer.prototype, "data", {
        /**
         * @return {?}
         */
        get: function () { return this.delegate.data; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    AnimationRenderer.prototype.destroy = function () { this.delegate.destroy(); };
    /**
     * @param {?} name
     * @param {?=} namespace
     * @return {?}
     */
    AnimationRenderer.prototype.createElement = function (name, namespace) {
        return this.delegate.createElement(name, namespace);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    AnimationRenderer.prototype.createComment = function (value) { return this.delegate.createComment(value); };
    /**
     * @param {?} value
     * @return {?}
     */
    AnimationRenderer.prototype.createText = function (value) { return this.delegate.createText(value); };
    /**
     * @param {?} selectorOrNode
     * @return {?}
     */
    AnimationRenderer.prototype.selectRootElement = function (selectorOrNode) {
        return this.delegate.selectRootElement(selectorOrNode);
    };
    /**
     * @param {?} node
     * @return {?}
     */
    AnimationRenderer.prototype.parentNode = function (node) { return this.delegate.parentNode(node); };
    /**
     * @param {?} node
     * @return {?}
     */
    AnimationRenderer.prototype.nextSibling = function (node) { return this.delegate.nextSibling(node); };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @param {?=} namespace
     * @return {?}
     */
    AnimationRenderer.prototype.setAttribute = function (el, name, value, namespace) {
        this.delegate.setAttribute(el, name, value, namespace);
    };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?=} namespace
     * @return {?}
     */
    AnimationRenderer.prototype.removeAttribute = function (el, name, namespace) {
        this.delegate.removeAttribute(el, name, namespace);
    };
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    AnimationRenderer.prototype.addClass = function (el, name) { this.delegate.addClass(el, name); };
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    AnimationRenderer.prototype.removeClass = function (el, name) { this.delegate.removeClass(el, name); };
    /**
     * @param {?} el
     * @param {?} style
     * @param {?} value
     * @param {?} flags
     * @return {?}
     */
    AnimationRenderer.prototype.setStyle = function (el, style, value, flags) {
        this.delegate.setStyle(el, style, value, flags);
    };
    /**
     * @param {?} el
     * @param {?} style
     * @param {?} flags
     * @return {?}
     */
    AnimationRenderer.prototype.removeStyle = function (el, style, flags) {
        this.delegate.removeStyle(el, style, flags);
    };
    /**
     * @param {?} node
     * @param {?} value
     * @return {?}
     */
    AnimationRenderer.prototype.setValue = function (node, value) { this.delegate.setValue(node, value); };
    /**
     * @param {?} parent
     * @param {?} newChild
     * @return {?}
     */
    AnimationRenderer.prototype.appendChild = function (parent, newChild) {
        var _this = this;
        this._engine.onInsert(newChild, function () { return _this.delegate.appendChild(parent, newChild); });
        this._queueFlush();
    };
    /**
     * @param {?} parent
     * @param {?} newChild
     * @param {?} refChild
     * @return {?}
     */
    AnimationRenderer.prototype.insertBefore = function (parent, newChild, refChild) {
        var _this = this;
        this._engine.onInsert(newChild, function () { return _this.delegate.insertBefore(parent, newChild, refChild); });
        this._queueFlush();
    };
    /**
     * @param {?} parent
     * @param {?} oldChild
     * @return {?}
     */
    AnimationRenderer.prototype.removeChild = function (parent, oldChild) {
        var _this = this;
        this._engine.onRemove(oldChild, function () {
            // Note: if an component element has a leave animation, and the component
            // a host leave animation, the view engine will call `removeChild` for the parent
            // component renderer as well as for the child component renderer.
            // Therefore, we need to check if we already removed the element.
            if (_this.delegate.parentNode(oldChild)) {
                _this.delegate.removeChild(parent, oldChild);
            }
        });
        this._queueFlush();
    };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    AnimationRenderer.prototype.setProperty = function (el, name, value) {
        if (name.charAt(0) == '@') {
            this._engine.setProperty(el, namespaceify(this._namespaceId, name.substr(1)), value);
            this._queueFlush();
        }
        else {
            this.delegate.setProperty(el, name, value);
        }
    };
    /**
     * @param {?} target
     * @param {?} eventName
     * @param {?} callback
     * @return {?}
     */
    AnimationRenderer.prototype.listen = function (target, eventName, callback) {
        var _this = this;
        if (eventName.charAt(0) == '@') {
            var /** @type {?} */ element = resolveElementFromTarget(target);
            var _a = parseTriggerCallbackName(eventName.substr(1)), name = _a[0], phase = _a[1];
            return this._engine.listen(element, namespaceify(this._namespaceId, name), phase, function (event) {
                var /** @type {?} */ e = (event);
                if (e.triggerName) {
                    e.triggerName = deNamespaceify(_this._namespaceId, e.triggerName);
                }
                _this._zone.run(function () { return callback(event); });
            });
        }
        return this.delegate.listen(target, eventName, callback);
    };
    /**
     * @return {?}
     */
    AnimationRenderer.prototype._queueFlush = function () {
        var _this = this;
        if (!this._flushPromise) {
            this._zone.runOutsideAngular(function () {
                _this._flushPromise = Promise.resolve(null).then(function () {
                    _this._flushPromise = ((null));
                    _this._engine.flush();
                });
            });
        }
    };
    return AnimationRenderer;
}());
/**
 * @param {?} target
 * @return {?}
 */
function resolveElementFromTarget(target) {
    switch (target) {
        case 'body':
            return document.body;
        case 'document':
            return document;
        case 'window':
            return window;
        default:
            return target;
    }
}
/**
 * @param {?} triggerName
 * @return {?}
 */
function parseTriggerCallbackName(triggerName) {
    var /** @type {?} */ dotIndex = triggerName.indexOf('.');
    var /** @type {?} */ trigger = triggerName.substring(0, dotIndex);
    var /** @type {?} */ phase = triggerName.substr(dotIndex + 1);
    return [trigger, phase];
}
/**
 * @param {?} namespaceId
 * @param {?} value
 * @return {?}
 */
function namespaceify(namespaceId, value) {
    return namespaceId + "#" + value;
}
/**
 * @param {?} namespaceId
 * @param {?} value
 * @return {?}
 */
function deNamespaceify(namespaceId, value) {
    return value.replace(namespaceId + '#', '');
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var InjectableAnimationEngine = (function (_super) {
    __extends(InjectableAnimationEngine, _super);
    /**
     * @param {?} driver
     * @param {?} normalizer
     */
    function InjectableAnimationEngine(driver, normalizer) {
        return _super.call(this, driver, normalizer) || this;
    }
    return InjectableAnimationEngine;
}(_angular_animations_browser.ɵDomAnimationEngine));
InjectableAnimationEngine.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
InjectableAnimationEngine.ctorParameters = function () { return [
    { type: _angular_animations_browser.AnimationDriver, },
    { type: _angular_animations_browser.ɵAnimationStyleNormalizer, },
]; };
/**
 * @return {?}
 */
function instantiateSupportedAnimationDriver() {
    if (_angular_animations_browser.ɵsupportsWebAnimations()) {
        return new _angular_animations_browser.ɵWebAnimationsDriver();
    }
    return new _angular_animations_browser.ɵNoopAnimationDriver();
}
/**
 * @return {?}
 */
function instantiateDefaultStyleNormalizer() {
    return new _angular_animations_browser.ɵWebAnimationsStyleNormalizer();
}
/**
 * @param {?} renderer
 * @param {?} engine
 * @param {?} zone
 * @return {?}
 */
function instantiateRendererFactory(renderer, engine, zone) {
    return new AnimationRendererFactory(renderer, engine, zone);
}
/**
 * Separate providers from the actual module so that we can do a local modification in Google3 to
 * include them in the BrowserModule.
 */
var BROWSER_ANIMATIONS_PROVIDERS = [
    { provide: _angular_animations_browser.AnimationDriver, useFactory: instantiateSupportedAnimationDriver },
    { provide: _angular_animations_browser.ɵAnimationStyleNormalizer, useFactory: instantiateDefaultStyleNormalizer },
    { provide: _angular_animations_browser.ɵAnimationEngine, useClass: InjectableAnimationEngine }, {
        provide: _angular_core.RendererFactory2,
        useFactory: instantiateRendererFactory,
        deps: [_angular_platformBrowser.ɵDomRendererFactory2, _angular_animations_browser.ɵAnimationEngine, _angular_core.NgZone]
    }
];
/**
 * Separate providers from the actual module so that we can do a local modification in Google3 to
 * include them in the BrowserTestingModule.
 */
var BROWSER_NOOP_ANIMATIONS_PROVIDERS = [
    { provide: _angular_animations_browser.ɵAnimationEngine, useClass: _angular_animations_browser.ɵNoopAnimationEngine }, {
        provide: _angular_core.RendererFactory2,
        useFactory: instantiateRendererFactory,
        deps: [_angular_platformBrowser.ɵDomRendererFactory2, _angular_animations_browser.ɵAnimationEngine, _angular_core.NgZone]
    }
];
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * \@experimental Animation support is experimental.
 */
var BrowserAnimationsModule = (function () {
    function BrowserAnimationsModule() {
    }
    return BrowserAnimationsModule;
}());
BrowserAnimationsModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [_angular_platformBrowser.BrowserModule],
                providers: BROWSER_ANIMATIONS_PROVIDERS,
            },] },
];
/**
 * @nocollapse
 */
BrowserAnimationsModule.ctorParameters = function () { return []; };
/**
 * \@experimental Animation support is experimental.
 */
var NoopAnimationsModule = (function () {
    function NoopAnimationsModule() {
    }
    return NoopAnimationsModule;
}());
NoopAnimationsModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [_angular_platformBrowser.BrowserModule],
                providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS,
            },] },
];
/**
 * @nocollapse
 */
NoopAnimationsModule.ctorParameters = function () { return []; };

exports.BrowserAnimationsModule = BrowserAnimationsModule;
exports.NoopAnimationsModule = NoopAnimationsModule;
exports.ɵAnimationRenderer = AnimationRenderer;
exports.ɵAnimationRendererFactory = AnimationRendererFactory;
exports.ɵe = BROWSER_ANIMATIONS_PROVIDERS;
exports.ɵf = BROWSER_NOOP_ANIMATIONS_PROVIDERS;
exports.ɵa = InjectableAnimationEngine;
exports.ɵc = instantiateDefaultStyleNormalizer;
exports.ɵd = instantiateRendererFactory;
exports.ɵb = instantiateSupportedAnimationDriver;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=platform-browser-animations.umd.js.map
