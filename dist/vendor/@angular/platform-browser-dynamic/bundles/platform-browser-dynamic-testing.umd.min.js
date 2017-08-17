/**
 * @license Angular v4.1.3
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */
!function(global,factory){"object"==typeof exports&&"undefined"!=typeof module?factory(exports,require("@angular/compiler/testing"),require("@angular/core"),require("@angular/core/testing"),require("@angular/platform-browser-dynamic"),require("@angular/platform-browser/testing"),require("@angular/platform-browser")):"function"==typeof define&&define.amd?define(["exports","@angular/compiler/testing","@angular/core","@angular/core/testing","@angular/platform-browser-dynamic","@angular/platform-browser/testing","@angular/platform-browser"],factory):factory((global.ng=global.ng||{},global.ng.platformBrowserDynamic=global.ng.platformBrowserDynamic||{},global.ng.platformBrowserDynamic.testing=global.ng.platformBrowserDynamic.testing||{}),global.ng.compiler.testing,global.ng.core,global.ng.core.testing,global.ng.platformBrowserDynamic,global.ng.platformBrowser.testing,global.ng.platformBrowser)}(this,function(exports,_angular_compiler_testing,_angular_core,_angular_core_testing,_angular_platformBrowserDynamic,_angular_platformBrowser_testing,_angular_platformBrowser){"use strict";var __extends=function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)},DOMTestComponentRenderer=function(_super){function DOMTestComponentRenderer(_doc){var _this=_super.call(this)||this;return _this._doc=_doc,_this}return __extends(DOMTestComponentRenderer,_super),DOMTestComponentRenderer.prototype.insertRootElement=function(rootElId){for(var rootEl=_angular_platformBrowser.ɵgetDOM().firstChild(_angular_platformBrowser.ɵgetDOM().content(_angular_platformBrowser.ɵgetDOM().createTemplate('<div id="'+rootElId+'"></div>'))),oldRoots=_angular_platformBrowser.ɵgetDOM().querySelectorAll(this._doc,"[id^=root]"),i=0;i<oldRoots.length;i++)_angular_platformBrowser.ɵgetDOM().remove(oldRoots[i]);_angular_platformBrowser.ɵgetDOM().appendChild(this._doc.body,rootEl)},DOMTestComponentRenderer}(_angular_core_testing.TestComponentRenderer);DOMTestComponentRenderer.decorators=[{type:_angular_core.Injectable}],DOMTestComponentRenderer.ctorParameters=function(){return[{type:void 0,decorators:[{type:_angular_core.Inject,args:[_angular_platformBrowser.DOCUMENT]}]}]};/**
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
var platformBrowserDynamicTesting=_angular_core.createPlatformFactory(_angular_compiler_testing.platformCoreDynamicTesting,"browserDynamicTesting",_angular_platformBrowserDynamic.ɵINTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS),BrowserDynamicTestingModule=function(){function BrowserDynamicTestingModule(){}return BrowserDynamicTestingModule}();BrowserDynamicTestingModule.decorators=[{type:_angular_core.NgModule,args:[{exports:[_angular_platformBrowser_testing.BrowserTestingModule],providers:[{provide:_angular_core_testing.TestComponentRenderer,useClass:DOMTestComponentRenderer}]}]}],BrowserDynamicTestingModule.ctorParameters=function(){return[]},exports.platformBrowserDynamicTesting=platformBrowserDynamicTesting,exports.BrowserDynamicTestingModule=BrowserDynamicTestingModule,exports.ɵDOMTestComponentRenderer=DOMTestComponentRenderer,Object.defineProperty(exports,"__esModule",{value:!0})});
//# sourceMappingURL=platform-browser-dynamic-testing.umd.min.js.map
