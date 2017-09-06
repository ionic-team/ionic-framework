var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Component, ElementRef, HostListener, Input, NgZone, Optional, Renderer, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Config } from '../../config/config';
import { DomController } from '../../platform/dom-controller';
import { Form } from '../../util/form';
import { GestureController } from '../../gestures/gesture-controller';
import { Haptic } from '../../tap-click/haptic';
import { isTrueProperty } from '../../util/util';
import { BaseInput } from '../../util/base-input';
import { Item } from '../item/item';
import { KEY_ENTER, KEY_SPACE } from '../../platform/key';
import { Platform } from '../../platform/platform';
import { ToggleGesture } from './toggle-gesture';
/**
 * \@name Toggle
 * \@description
 * A toggle technically is the same thing as an HTML checkbox input,
 * except it looks different and is easier to use on a touch device.
 * Toggles can also have colors assigned to them, by adding any color
 * attribute.
 *
 * See the [Angular Docs](https://angular.io/docs/ts/latest/guide/forms.html)
 * for more info on forms and inputs.
 *
 * \@usage
 * ```html
 *
 *  <ion-list>
 *
 *    <ion-item>
 *      <ion-label>Pepperoni</ion-label>
 *      <ion-toggle [(ngModel)]="pepperoni"></ion-toggle>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Sausage</ion-label>
 *      <ion-toggle [(ngModel)]="sausage" disabled="true"></ion-toggle>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Mushrooms</ion-label>
 *      <ion-toggle [(ngModel)]="mushrooms"></ion-toggle>
 *    </ion-item>
 *
 *  </ion-list>
 * ```
 *
 * \@demo /docs/demos/src/toggle/
 * @see {\@link /docs/components#toggle Toggle Component Docs}
 */
var Toggle = (function (_super) {
    __extends(Toggle, _super);
    /**
     * @param {?} form
     * @param {?} config
     * @param {?} _plt
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} _haptic
     * @param {?} item
     * @param {?} _gestureCtrl
     * @param {?} _domCtrl
     * @param {?} _zone
     */
    function Toggle(form, config, _plt, elementRef, renderer, _haptic, item, _gestureCtrl, _domCtrl, _zone) {
        var _this = _super.call(this, config, elementRef, renderer, 'toggle', false, form, item, null) || this;
        _this._plt = _plt;
        _this._haptic = _haptic;
        _this._gestureCtrl = _gestureCtrl;
        _this._domCtrl = _domCtrl;
        _this._zone = _zone;
        _this._activated = false;
        return _this;
    }
    Object.defineProperty(Toggle.prototype, "checked", {
        /**
         * \@input {boolean} If true, the element is selected.
         * @return {?}
         */
        get: function () {
            return this.value;
        },
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this.value = val;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     * @return {?}
     */
    Toggle.prototype.ngAfterContentInit = function () {
        this._initialize();
        this._gesture = new ToggleGesture(this._plt, this, this._gestureCtrl, this._domCtrl);
        this._gesture.listen();
    };
    /**
     * @hidden
     * @return {?}
     */
    Toggle.prototype._inputUpdated = function () { };
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    Toggle.prototype._inputNormalize = function (val) {
        return isTrueProperty(val);
    };
    /**
     * @hidden
     * @param {?} startX
     * @return {?}
     */
    Toggle.prototype._onDragStart = function (startX) {
        var _this = this;
        (void 0) /* assert */;
        (void 0) /* console.debug */;
        this._zone.run(function () {
            _this._startX = startX;
            _this._fireFocus();
            _this._activated = true;
        });
    };
    /**
     * @hidden
     * @param {?} currentX
     * @return {?}
     */
    Toggle.prototype._onDragMove = function (currentX) {
        var _this = this;
        if (!this._startX) {
            (void 0) /* assert */;
            return;
        }
        if (this._shouldToggle(currentX, -15)) {
            this._zone.run(function () {
                _this.value = !_this.value;
                _this._startX = currentX;
                _this._haptic.selection();
            });
        }
    };
    /**
     * @hidden
     * @param {?} endX
     * @return {?}
     */
    Toggle.prototype._onDragEnd = function (endX) {
        var _this = this;
        if (!this._startX) {
            (void 0) /* assert */;
            return;
        }
        (void 0) /* console.debug */;
        this._zone.run(function () {
            if (_this._shouldToggle(endX, 4)) {
                _this.value = !_this.value;
                _this._haptic.selection();
            }
            _this._activated = false;
            _this._fireBlur();
            _this._startX = null;
        });
    };
    /**
     * @hidden
     * @param {?} currentX
     * @param {?} margin
     * @return {?}
     */
    Toggle.prototype._shouldToggle = function (currentX, margin) {
        var /** @type {?} */ isLTR = !this._plt.isRTL;
        var /** @type {?} */ startX = this._startX;
        if (this._value) {
            return (isLTR && (startX + margin > currentX)) ||
                (!isLTR && (startX - margin < currentX));
        }
        else {
            return (isLTR && (startX - margin < currentX)) ||
                (!isLTR && (startX + margin > currentX));
        }
    };
    /**
     * @hidden
     * @param {?} ev
     * @return {?}
     */
    Toggle.prototype._keyup = function (ev) {
        if (ev.keyCode === KEY_SPACE || ev.keyCode === KEY_ENTER) {
            (void 0) /* console.debug */;
            ev.preventDefault();
            ev.stopPropagation();
            this.value = !this.value;
        }
    };
    /**
     * @hidden
     * @return {?}
     */
    Toggle.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        this._gesture && this._gesture.destroy();
    };
    return Toggle;
}(BaseInput));
export { Toggle };
Toggle.decorators = [
    { type: Component, args: [{
                selector: 'ion-toggle',
                template: '<div class="toggle-icon">' +
                    '<div class="toggle-inner"></div>' +
                    '</div>' +
                    '<button role="checkbox" ' +
                    'type="button" ' +
                    'ion-button="item-cover" ' +
                    '[id]="id" ' +
                    '[attr.aria-checked]="_value" ' +
                    '[attr.aria-labelledby]="_labelId" ' +
                    '[attr.aria-disabled]="_disabled" ' +
                    'class="item-cover" disable-activated>' +
                    '</button>',
                host: {
                    '[class.toggle-disabled]': '_disabled',
                    '[class.toggle-checked]': '_value',
                    '[class.toggle-activated]': '_activated',
                },
                providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: Toggle, multi: true }],
                encapsulation: ViewEncapsulation.None,
            },] },
];
/**
 * @nocollapse
 */
Toggle.ctorParameters = function () { return [
    { type: Form, },
    { type: Config, },
    { type: Platform, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: Haptic, },
    { type: Item, decorators: [{ type: Optional },] },
    { type: GestureController, },
    { type: DomController, },
    { type: NgZone, },
]; };
Toggle.propDecorators = {
    'checked': [{ type: Input },],
    '_keyup': [{ type: HostListener, args: ['keyup', ['$event'],] },],
};
function Toggle_tsickle_Closure_declarations() {
    /** @type {?} */
    Toggle.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    Toggle.ctorParameters;
    /** @type {?} */
    Toggle.propDecorators;
    /** @type {?} */
    Toggle.prototype._activated;
    /** @type {?} */
    Toggle.prototype._startX;
    /** @type {?} */
    Toggle.prototype._gesture;
    /** @type {?} */
    Toggle.prototype._plt;
    /** @type {?} */
    Toggle.prototype._haptic;
    /** @type {?} */
    Toggle.prototype._gestureCtrl;
    /** @type {?} */
    Toggle.prototype._domCtrl;
    /** @type {?} */
    Toggle.prototype._zone;
}
//# sourceMappingURL=toggle.js.map