/**
 * @license Angular v6.0.0-beta.2-8c5c0dac1
 * (c) 2010-2018 Google, Inc. https://angular.io/
 * License: MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/router'), require('@angular/upgrade/static')) :
	typeof define === 'function' && define.amd ? define('@angular/router/upgrade', ['exports', '@angular/core', '@angular/router', '@angular/upgrade/static'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.router = global.ng.router || {}, global.ng.router.upgrade = {}),global.ng.core,global.ng.router,global.ng.upgrade.static));
}(this, (function (exports,_angular_core,_angular_router,_angular_upgrade_static) { 'use strict';

/**
 * @license Angular v6.0.0-beta.2-8c5c0dac1
 * (c) 2010-2018 Google, Inc. https://angular.io/
 * License: MIT
 */
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * \@whatItDoes Creates an initializer that in addition to setting up the Angular
 * router sets up the ngRoute integration.
 *
 * \@howToUse
 *
 * ```
 * \@NgModule({
 *  imports: [
 *   RouterModule.forRoot(SOME_ROUTES),
 *   UpgradeModule
 * ],
 * providers: [
 *   RouterUpgradeInitializer
 * ]
 * })
 * export class AppModule {
 *   ngDoBootstrap() {}
 * }
 * ```
 *
 * \@experimental
 */
var RouterUpgradeInitializer = {
    provide: _angular_core.APP_BOOTSTRAP_LISTENER,
    multi: true,
    useFactory: locationSyncBootstrapListener,
    deps: [_angular_upgrade_static.UpgradeModule]
};
/**
 * \@internal
 * @param {?} ngUpgrade
 * @return {?}
 */
function locationSyncBootstrapListener(ngUpgrade) {
    return function () { setUpLocationSync(ngUpgrade); };
}
/**
 * \@whatItDoes Sets up a location synchronization.
 *
 * History.pushState does not fire onPopState, so the Angular location
 * doesn't detect it. The workaround is to attach a location change listener
 *
 * \@experimental
 * @param {?} ngUpgrade
 * @return {?}
 */
function setUpLocationSync(ngUpgrade) {
    if (!ngUpgrade.$injector) {
        throw new Error("\n        RouterUpgradeInitializer can be used only after UpgradeModule.bootstrap has been called.\n        Remove RouterUpgradeInitializer and call setUpLocationSync after UpgradeModule.bootstrap.\n      ");
    }
    var /** @type {?} */ router = ngUpgrade.injector.get(_angular_router.Router);
    var /** @type {?} */ url = document.createElement('a');
    ngUpgrade.$injector.get('$rootScope')
        .$on('$locationChangeStart', function (_, next, __) {
        url.href = next;
        router.navigateByUrl(url.pathname + url.search + url.hash);
    });
}

exports.RouterUpgradeInitializer = RouterUpgradeInitializer;
exports.locationSyncBootstrapListener = locationSyncBootstrapListener;
exports.setUpLocationSync = setUpLocationSync;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=router-upgrade.umd.js.map
