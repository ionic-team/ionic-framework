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
Zone.__load_patch('bluebird', function (global, Zone, api) {
    // TODO: @JiaLiPassion, we can automatically patch bluebird
    // if global.Promise = Bluebird, but sometimes in nodejs,
    // global.Promise is not Bluebird, and Bluebird is just be
    // used by other libraries such as sequelize, so I think it is
    // safe to just expose a method to patch Bluebird explicitly
    Zone[Zone.__symbol__('bluebird')] = function patchBluebird(Bluebird) {
        Bluebird.setScheduler(function (fn) {
            Zone.current.scheduleMicroTask('bluebird', fn);
        });
    };
});

})));
