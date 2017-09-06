import { Component, ElementRef, HostListener, Renderer, ViewChildren, ViewEncapsulation } from '@angular/core';
import { isNumber, isPresent, isString } from '../../util/util';
import { Config } from '../../config/config';
import { BLOCK_ALL, GestureController, } from '../../gestures/gesture-controller';
import { KEY_ENTER, KEY_ESCAPE } from '../../platform/key';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';
import { PickerColumnCmp } from './picker-column';
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
        this._gestureBlocker = gestureCtrl.createBlocker(BLOCK_ALL);
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
            if (isString(button)) {
                return { text: button };
            }
            if (button.role) {
                button.cssRole = "picker-toolbar-" + button.role;
            }
            return button;
        });
        // clean up dat data
        data.columns = data.columns.map(function (column) {
            if (!isPresent(column.options)) {
                column.options = [];
            }
            column.selectedIndex = column.selectedIndex || 0;
            column.options = column.options.map(function (inputOpt) {
                var /** @type {?} */ opt = {
                    text: '',
                    value: '',
                    disabled: inputOpt.disabled,
                };
                if (isPresent(inputOpt)) {
                    if (isString(inputOpt) || isNumber(inputOpt)) {
                        opt.text = inputOpt.toString();
                        opt.value = inputOpt;
                    }
                    else {
                        opt.text = isPresent(inputOpt.text) ? inputOpt.text : inputOpt.value;
                        opt.value = isPresent(inputOpt.value) ? inputOpt.value : inputOpt.text;
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
            if (ev.keyCode === KEY_ENTER) {
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
            else if (ev.keyCode === KEY_ESCAPE) {
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
export { PickerCmp };
PickerCmp.decorators = [
    { type: Component, args: [{
                selector: 'ion-picker-cmp',
                template: "\n    <ion-backdrop (click)=\"bdClick()\"></ion-backdrop>\n    <div class=\"picker-wrapper\">\n      <div class=\"picker-toolbar\">\n        <div *ngFor=\"let b of d.buttons\" class=\"picker-toolbar-button\" [ngClass]=\"b.cssRole\">\n          <button ion-button (click)=\"btnClick(b)\" [ngClass]=\"b.cssClass\" class=\"picker-button\" clear>\n            {{b.text}}\n          </button>\n        </div>\n      </div>\n      <div class=\"picker-columns\">\n        <div class=\"picker-above-highlight\"></div>\n        <div *ngFor=\"let c of d.columns\" [col]=\"c\" class=\"picker-col\" (ionChange)=\"_colChange($event)\"></div>\n        <div class=\"picker-below-highlight\"></div>\n      </div>\n    </div>\n  ",
                host: {
                    'role': 'dialog'
                },
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
PickerCmp.ctorParameters = function () { return [
    { type: ViewController, },
    { type: ElementRef, },
    { type: Config, },
    { type: GestureController, },
    { type: NavParams, },
    { type: Renderer, },
]; };
PickerCmp.propDecorators = {
    '_cols': [{ type: ViewChildren, args: [PickerColumnCmp,] },],
    '_keyUp': [{ type: HostListener, args: ['body:keyup', ['$event'],] },],
};
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
//# sourceMappingURL=picker-component.js.map