/**
 * @license Angular v4.1.3
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */
!function(global,factory){"object"==typeof exports&&"undefined"!=typeof module?factory(exports,require("@angular/core"),require("@angular/platform-browser")):"function"==typeof define&&define.amd?define(["exports","@angular/core","@angular/platform-browser"],factory):factory((global.ng=global.ng||{},global.ng.platformBrowser=global.ng.platformBrowser||{},global.ng.platformBrowser.testing=global.ng.platformBrowser.testing||{}),global.ng.core,global.ng.platformBrowser)}(this,function(exports,_angular_core,_angular_platformBrowser){"use strict";function createNgZone(){return new _angular_core.NgZone({enableLongStackTrace:!0})}/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function initBrowserTests(){_angular_platformBrowser.ɵBrowserDomAdapter.makeCurrent(),BrowserDetection.setup()}/**
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
var browserDetection,BrowserDetection=function(){function BrowserDetection(ua){this._overrideUa=ua}return Object.defineProperty(BrowserDetection.prototype,"_ua",{get:function(){return"string"==typeof this._overrideUa?this._overrideUa:_angular_platformBrowser.ɵgetDOM()?_angular_platformBrowser.ɵgetDOM().getUserAgent():""},enumerable:!0,configurable:!0}),BrowserDetection.setup=function(){browserDetection=new BrowserDetection(null)},Object.defineProperty(BrowserDetection.prototype,"isFirefox",{get:function(){return this._ua.indexOf("Firefox")>-1},enumerable:!0,configurable:!0}),Object.defineProperty(BrowserDetection.prototype,"isAndroid",{get:function(){return this._ua.indexOf("Mozilla/5.0")>-1&&this._ua.indexOf("Android")>-1&&this._ua.indexOf("AppleWebKit")>-1&&this._ua.indexOf("Chrome")==-1&&this._ua.indexOf("IEMobile")==-1},enumerable:!0,configurable:!0}),Object.defineProperty(BrowserDetection.prototype,"isEdge",{get:function(){return this._ua.indexOf("Edge")>-1},enumerable:!0,configurable:!0}),Object.defineProperty(BrowserDetection.prototype,"isIE",{get:function(){return this._ua.indexOf("Trident")>-1},enumerable:!0,configurable:!0}),Object.defineProperty(BrowserDetection.prototype,"isWebkit",{get:function(){return this._ua.indexOf("AppleWebKit")>-1&&this._ua.indexOf("Edge")==-1&&this._ua.indexOf("IEMobile")==-1},enumerable:!0,configurable:!0}),Object.defineProperty(BrowserDetection.prototype,"isIOS7",{get:function(){return(this._ua.indexOf("iPhone OS 7")>-1||this._ua.indexOf("iPad OS 7")>-1)&&this._ua.indexOf("IEMobile")==-1},enumerable:!0,configurable:!0}),Object.defineProperty(BrowserDetection.prototype,"isSlow",{get:function(){return this.isAndroid||this.isIE||this.isIOS7},enumerable:!0,configurable:!0}),Object.defineProperty(BrowserDetection.prototype,"supportsNativeIntlApi",{get:function(){return!!_angular_core.ɵglobal.Intl&&_angular_core.ɵglobal.Intl!==_angular_core.ɵglobal.IntlPolyfill},enumerable:!0,configurable:!0}),Object.defineProperty(BrowserDetection.prototype,"isChromeDesktop",{get:function(){return this._ua.indexOf("Chrome")>-1&&this._ua.indexOf("Mobile Safari")==-1&&this._ua.indexOf("Edge")==-1},enumerable:!0,configurable:!0}),Object.defineProperty(BrowserDetection.prototype,"isOldChrome",{get:function(){return this._ua.indexOf("Chrome")>-1&&this._ua.indexOf("Chrome/3")>-1&&this._ua.indexOf("Edge")==-1},enumerable:!0,configurable:!0}),BrowserDetection}();BrowserDetection.setup();var _TEST_BROWSER_PLATFORM_PROVIDERS=[{provide:_angular_core.PLATFORM_INITIALIZER,useValue:initBrowserTests,multi:!0}],platformBrowserTesting=_angular_core.createPlatformFactory(_angular_core.platformCore,"browserTesting",_TEST_BROWSER_PLATFORM_PROVIDERS),BrowserTestingModule=function(){function BrowserTestingModule(){}return BrowserTestingModule}();BrowserTestingModule.decorators=[{type:_angular_core.NgModule,args:[{exports:[_angular_platformBrowser.BrowserModule],providers:[{provide:_angular_core.APP_ID,useValue:"a"},_angular_platformBrowser.ɵELEMENT_PROBE_PROVIDERS,{provide:_angular_core.NgZone,useFactory:createNgZone}]}]}],BrowserTestingModule.ctorParameters=function(){return[]},exports.platformBrowserTesting=platformBrowserTesting,exports.BrowserTestingModule=BrowserTestingModule,Object.defineProperty(exports,"__esModule",{value:!0})});
//# sourceMappingURL=platform-browser-testing.umd.min.js.map
