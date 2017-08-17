(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../util/util", "../../config/config", "../../gestures/gesture-controller", "../../platform/key", "../../navigation/nav-params", "../../navigation/view-controller", "./picker-column"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var util_1 = require("../../util/util");
    var config_1 = require("../../config/config");
    var gesture_controller_1 = require("../../gestures/gesture-controller");
    var key_1 = require("../../platform/key");
    var nav_params_1 = require("../../navigation/nav-params");
    var view_controller_1 = require("../../navigation/view-controller");
    var picker_column_1 = require("./picker-column");
    /**
     * @hidden
     */
    var PickerCmp = (function () {
        /**
         * @param {?} _viewCtrl
         * @param {?} _elementRef
         * @param {?} config
         * @param {?} gestureCtrl
         * @param {?} params
         * @param {?} renderer
         */
        function PickerCmp(_viewCtrl, _elementRef, config, gestureCtrl, params, renderer) {
            this._viewCtrl = _viewCtrl;
            this._elementRef = _elementRef;
            this._gestureBlocker = gestureCtrl.createBlocker(gesture_controller_1.BLOCK_ALL);
            this.d = params.data;
            this.mode = config.get('mode');
            renderer.setElementClass(_elementRef.nativeElement, "picker-" + this.mode, true);
            if (this.d.cssClass) {
                this.d.cssClass.split(' ').forEach(function (cssClass) {
                    renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
                });
            }
            this.id = (++pickerIds);
            this.lastClick = 0;
        }
        /**
         * @return {?}
         */
        PickerCmp.prototype.ionViewWillLoad = function () {
            // normalize the data
            var /** @type {?} */ data = this.d;
            data.buttons = data.buttons.map(function (button) {
                if (util_1.isString(button)) {
                    return { text: button };
                }
                if (button.role) {
                    button.cssRole = "picker-toolbar-" + button.role;
                }
                return button;
            });
            // clean up dat data
            data.columns = data.columns.map(function (column) {
                if (!util_1.isPresent(column.options)) {
                    column.options = [];
                }
                column.selectedIndex = column.selectedIndex || 0;
                column.options = column.options.map(function (inputOpt) {
                    var /** @type {?} */ opt = {
                        text: '',
                        value: '',
                        disabled: inputOpt.disabled,
                    };
                    if (util_1.isPresent(inputOpt)) {
                        if (util_1.isString(inputOpt) || util_1.isNumber(inputOpt)) {
                            opt.text = inputOpt.toString();
                            opt.value = inputOpt;
                        }
                        else {
                            opt.text = util_1.isPresent(inputOpt.text) ? inputOpt.text : inputOpt.value;
                            opt.value = util_1.isPresent(inputOpt.value) ? inputOpt.value : inputOpt.text;
                        }
                    }
                    return opt;
                });
                return column;
            });
        };
        /**
         * @return {?}
         */
        PickerCmp.prototype.ionViewDidLoad = function () {
            this.refresh();
        };
        /**
         * @return {?}
         */
        PickerCmp.prototype.ionViewWillEnter = function () {
            this._gestureBlocker.block();
        };
        /**
         * @return {?}
         */
        PickerCmp.prototype.ionViewDidLeave = function () {
            this._gestureBlocker.unblock();
        };
        /**
         * @return {?}
         */
        PickerCmp.prototype.refresh = function () {
            this._cols.forEach(function (column) { return column.refresh(); });
        };
        /**
         * @return {?}
         */
        PickerCmp.prototype._colChange = function () {
            // one of the columns has changed its selected index
            var /** @type {?} */ picker = (this._viewCtrl);
            picker.ionChange.emit(this.getSelected());
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        PickerCmp.prototype._keyUp = function (ev) {
            if (this.enabled && this._viewCtrl.isLast()) {
                if (ev.keyCode === key_1.KEY_ENTER) {
                    if (this.lastClick + 1000 < Date.now()) {
                        // do not fire this click if there recently was already a click
                        // this can happen when the button has focus and used the enter
                        // key to click the button. However, both the click handler and
                        // this keyup event will fire, so only allow one of them to go.
                        (void 0) /* console.debug */;
                        var /** @type {?} */ button = this.d.buttons[this.d.buttons.length - 1];
                        this.btnClick(button);
                    }
                }
                else if (ev.keyCode === key_1.KEY_ESCAPE) {
                    (void 0) /* console.debug */;
                    this.bdClick();
                }
            }
        };
        /**
         * @return {?}
         */
        PickerCmp.prototype.ionViewDidEnter = function () {
            var /** @type {?} */ focusableEle = this._elementRef.nativeElement.querySelector('button');
            if (focusableEle) {
                focusableEle.focus();
            }
            this.enabled = true;
        };
        /**
         * @param {?} button
         * @return {?}
         */
        PickerCmp.prototype.btnClick = function (button) {
            if (!this.enabled) {
                return;
            }
            // keep the time of the most recent button click
            this.lastClick = Date.now();
            var /** @type {?} */ shouldDismiss = true;
            if (button.handler) {
                // a handler has been provided, execute it
                // pass the handler the values from the inputs
                if (button.handler(this.getSelected()) === false) {
                    // if the return value of the handler is false then do not dismiss
                    shouldDismiss = false;
                }
            }
            if (shouldDismiss) {
                this.dismiss(button.role);
            }
        };
        /**
         * @return {?}
         */
        PickerCmp.prototype.bdClick = function () {
            if (this.enabled && this.d.enableBackdropDismiss) {
                var /** @type {?} */ cancelBtn = this.d.buttons.find(function (b) { return b.role === 'cancel'; });
                if (cancelBtn) {
                    this.btnClick(cancelBtn);
                }
                else {
                    this.dismiss('backdrop');
                }
            }
        };
        /**
         * @param {?} role
         * @return {?}
         */
        PickerCmp.prototype.dismiss = function (role) {
            return this._viewCtrl.dismiss(this.getSelected(), role);
        };
        /**
         * @return {?}
         */
        PickerCmp.prototype.getSelected = function () {
            var /** @type {?} */ selected = {};
            this.d.columns.forEach(function (col, index) {
                var /** @type {?} */ selectedColumn = col.options[col.selectedIndex];
                selected[col.name] = {
                    text: selectedColumn ? selectedColumn.text : null,
                    value: selectedColumn ? selectedColumn.value : null,
                    columnIndex: index,
                };
            });
            return selected;
        };
        /**
         * @return {?}
         */
        PickerCmp.prototype.ngOnDestroy = function () {
            (void 0) /* assert */;
            this._gestureBlocker.destroy();
        };
        return PickerCmp;
    }());
    PickerCmp.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-picker-cmp',
                    template: "\n    <ion-backdrop (click)=\"bdClick()\"></ion-backdrop>\n    <div class=\"picker-wrapper\">\n      <div class=\"picker-toolbar\">\n        <div *ngFor=\"let b of d.buttons\" class=\"picker-toolbar-button\" [ngClass]=\"b.cssRole\">\n          <button ion-button (click)=\"btnClick(b)\" [ngClass]=\"b.cssClass\" class=\"picker-button\" clear>\n            {{b.text}}\n          </button>\n        </div>\n      </div>\n      <div class=\"picker-columns\">\n        <div class=\"picker-above-highlight\"></div>\n        <div *ngFor=\"let c of d.columns\" [col]=\"c\" class=\"picker-col\" (ionChange)=\"_colChange($event)\"></div>\n        <div class=\"picker-below-highlight\"></div>\n      </div>\n    </div>\n  ",
                    host: {
                        'role': 'dialog'
                    },
                    encapsulation: core_1.ViewEncapsulation.None,
                },] },
    ];
    /**
     * @nocollapse
     */
    PickerCmp.ctorParameters = function () { return [
        { type: view_controller_1.ViewController, },
        { type: core_1.ElementRef, },
        { type: config_1.Config, },
        { type: gesture_controller_1.GestureController, },
        { type: nav_params_1.NavParams, },
        { type: core_1.Renderer, },
    ]; };
    PickerCmp.propDecorators = {
        '_cols': [{ type: core_1.ViewChildren, args: [picker_column_1.PickerColumnCmp,] },],
        '_keyUp': [{ type: core_1.HostListener, args: ['body:keyup', ['$event'],] },],
    };
    exports.PickerCmp = PickerCmp;
    function PickerCmp_tsickle_Closure_declarations() {
        /** @type {?} */
        PickerCmp.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        PickerCmp.ctorParameters;
        /** @type {?} */
        PickerCmp.propDecorators;
        /** @type {?} */
        PickerCmp.prototype._cols;
        /** @type {?} */
        PickerCmp.prototype.d;
        /** @type {?} */
        PickerCmp.prototype.enabled;
        /** @type {?} */
        PickerCmp.prototype.lastClick;
        /** @type {?} */
        PickerCmp.prototype.id;
        /** @type {?} */
        PickerCmp.prototype.mode;
        /** @type {?} */
        PickerCmp.prototype._gestureBlocker;
        /** @type {?} */
        PickerCmp.prototype._viewCtrl;
        /** @type {?} */
        PickerCmp.prototype._elementRef;
    }
    var /** @type {?} */ pickerIds = -1;
});
//# sourceMappingURL=picker-component.js.map