/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('mediaQuery', function (global, Zone, api) {
    if (!global['MediaQueryList']) {
        return;
    }
    api.patchEventTargetMethods(global['MediaQueryList'].prototype, 'addListener', 'removeListener', function (self, args) {
        return {
            useCapturing: false,
            eventName: 'mediaQuery',
            handler: args[0],
            target: self || global,
            name: 'mediaQuery',
            invokeAddFunc: function (addFnSymbol, delegate) {
                if (delegate && delegate.invoke) {
                    return this.target[addFnSymbol](delegate.invoke);
                }
                else {
                    return this.target[addFnSymbol](delegate);
                }
            },
            invokeRemoveFunc: function (removeFnSymbol, delegate) {
                if (delegate && delegate.invoke) {
                    return this.target[removeFnSymbol](delegate.invoke);
                }
                else {
                    return this.target[removeFnSymbol](delegate);
                }
            }
        };
    });
});

})));
