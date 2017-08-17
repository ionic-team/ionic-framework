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
Zone.__load_patch('cordova', function (global, Zone, api) {
    if (global.cordova) {
        var nativeExec_1 = api.patchMethod(global.cordova, 'exec', function (delegate) { return function (self, args) {
            if (args.length > 0 && typeof args[0] === 'function') {
                args[0] = Zone.current.wrap(args[0], 'cordova.exec.success');
            }
            if (args.length > 1 && typeof args[1] === 'function') {
                args[1] = Zone.current.wrap(args[1], 'cordova.exec.error');
            }
            return nativeExec_1.apply(self, args);
        }; });
    }
});

})));
