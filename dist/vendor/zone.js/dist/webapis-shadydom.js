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
Zone.__load_patch('shadydom', function (global, Zone, api) {
    // https://github.com/angular/zone.js/issues/782
    // in web components, shadydom will patch addEventListener/removeEventListener of
    // Node.prototype and WindowPrototype, this will have conflict with zone.js
    // so zone.js need to patch them again.
    var windowPrototype = Object.getPrototypeOf(window);
    if (windowPrototype && windowPrototype.hasOwnProperty('addEventListener')) {
        windowPrototype[Zone.__symbol__('addEventListener')] = null;
        windowPrototype[Zone.__symbol__('removeEventListener')] = null;
        api.patchEventTargetMethods(windowPrototype);
    }
    if (Node.prototype.hasOwnProperty('addEventListener')) {
        Node.prototype[Zone.__symbol__('addEventListener')] = null;
        Node.prototype[Zone.__symbol__('removeEventListener')] = null;
        api.patchEventTargetMethods(Node.prototype);
    }
});

})));
