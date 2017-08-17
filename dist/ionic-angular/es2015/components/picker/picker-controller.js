import { Injectable } from '@angular/core';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { Picker } from './picker';
/**
 * @hidden
 * \@name PickerController
 * \@description
 *
 */
export class PickerController {
    /**
     * @param {?} _app
     * @param {?} config
     */
    constructor(_app, config) {
        this._app = _app;
        this.config = config;
    }
    /**
     * Open a picker.
     * @param {?=} opts
     * @return {?}
     */
    create(opts = {}) {
        return new Picker(this._app, opts, this.config);
    }
}
PickerController.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
PickerController.ctorParameters = () => [
    { type: App, },
    { type: Config, },
];
function PickerController_tsickle_Closure_declarations() {
    /** @type {?} */
    PickerController.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    PickerController.ctorParameters;
    /** @type {?} */
    PickerController.prototype._app;
    /** @type {?} */
    PickerController.prototype.config;
}
//# sourceMappingURL=picker-controller.js.map