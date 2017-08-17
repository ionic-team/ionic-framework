import { EventEmitter, Output } from '@angular/core';
import { isPresent } from '../../util/util';
import { PickerCmp } from './picker-component';
import { PickerSlideIn, PickerSlideOut } from './picker-transitions';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export class Picker extends ViewController {
    /**
     * @param {?} app
     * @param {?=} opts
     * @param {?=} config
     */
    constructor(app, opts = {}, config) {
        if (!opts) {
            opts = {};
        }
        opts.columns = opts.columns || [];
        opts.buttons = opts.buttons || [];
        opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? Boolean(opts.enableBackdropDismiss) : true;
        super(PickerCmp, opts, null);
        this._app = app;
        this.isOverlay = true;
        this.ionChange = new EventEmitter();
        config.setTransition('picker-slide-in', PickerSlideIn);
        config.setTransition('picker-slide-out', PickerSlideOut);
    }
    /**
     * @hidden
     * @param {?} direction
     * @return {?}
     */
    getTransitionName(direction) {
        let /** @type {?} */ key = (direction === 'back' ? 'pickerLeave' : 'pickerEnter');
        return this._nav && this._nav.config.get(key);
    }
    /**
     * @param {?} button
     * @return {?}
     */
    addButton(button) {
        this.data.buttons.push(button);
    }
    /**
     * @param {?} column
     * @return {?}
     */
    addColumn(column) {
        this.data.columns.push(column);
    }
    /**
     * @return {?}
     */
    getColumns() {
        return this.data.columns;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    getColumn(name) {
        return this.getColumns().find(column => column.name === name);
    }
    /**
     * @return {?}
     */
    refresh() {
        (void 0) /* assert */;
        (void 0) /* assert */;
        this._cmp && this._cmp.instance.refresh && this._cmp.instance.refresh();
    }
    /**
     * @param {?} cssClass
     * @return {?}
     */
    setCssClass(cssClass) {
        this.data.cssClass = cssClass;
    }
    /**
     * Present the picker instance.
     *
     * @param {?=} navOptions
     * @return {?}
     */
    present(navOptions = {}) {
        return this._app.present(this, navOptions);
    }
}
Picker.propDecorators = {
    'ionChange': [{ type: Output },],
};
function Picker_tsickle_Closure_declarations() {
    /** @type {?} */
    Picker.propDecorators;
    /** @type {?} */
    Picker.prototype._app;
    /** @type {?} */
    Picker.prototype.ionChange;
}
//# sourceMappingURL=picker.js.map