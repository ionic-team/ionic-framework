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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "@angular/forms", "../../config/config", "../../util/util", "../../util/form", "../../util/base-input", "../item/item"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var forms_1 = require("@angular/forms");
    var config_1 = require("../../config/config");
    var util_1 = require("../../util/util");
    var form_1 = require("../../util/form");
    var base_input_1 = require("../../util/base-input");
    var item_1 = require("../item/item");
    /**
     * \@name Checkbox
     * \@module ionic
     *
     * \@description
     * The Checkbox is a simple component styled based on the mode. It can be
     * placed in an `ion-item` or used as a stand-alone checkbox.
     *
     * See the [Angular Docs](https://angular.io/docs/ts/latest/guide/forms.html)
     * for more info on forms and inputs.
     *
     *
     * \@usage
     * ```html
     *
     *  <ion-list>
     *
     *    <ion-item>
     *      <ion-label>Pepperoni</ion-label>
     *      <ion-checkbox [(ngModel)]="pepperoni"></ion-checkbox>
     *    </ion-item>
     *
     *    <ion-item>
     *      <ion-label>Sausage</ion-label>
     *      <ion-checkbox [(ngModel)]="sausage" disabled="true"></ion-checkbox>
     *    </ion-item>
     *
     *    <ion-item>
     *      <ion-label>Mushrooms</ion-label>
     *      <ion-checkbox [(ngModel)]="mushrooms"></ion-checkbox>
     *    </ion-item>
     *
     *  </ion-list>
     * ```
     *
     * \@advanced
     *
     * ```html
     *
     * <!-- Call function when state changes -->
     *  <ion-list>
     *
     *    <ion-item>
     *      <ion-label>Cucumber</ion-label>
     *      <ion-checkbox [(ngModel)]="cucumber" (ionChange)="updateCucumber()"></ion-checkbox>
     *    </ion-item>
     *
     *  </ion-list>
     * ```
     *
     * ```ts
     * \@Component({
     *   templateUrl: 'main.html'
     * })
     * class SaladPage {
     *   cucumber: boolean;
     *
     *   updateCucumber() {
     *     console.log('Cucumbers new state:' + this.cucumber);
     *   }
     * }
     * ```
     *
     * \@demo /docs/demos/src/checkbox/
     * @see {\@link /docs/components#checkbox Checkbox Component Docs}
     */
    var Checkbox = (function (_super) {
        __extends(Checkbox, _super);
        /**
         * @param {?} config
         * @param {?} form
         * @param {?} item
         * @param {?} elementRef
         * @param {?} renderer
         */
        function Checkbox(config, form, item, elementRef, renderer) {
            return _super.call(this, config, elementRef, renderer, 'checkbox', false, form, item, null) || this;
        }
        Object.defineProperty(Checkbox.prototype, "checked", {
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
         * @param {?} ev
         * @return {?}
         */
        Checkbox.prototype._click = function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            this.value = !this.value;
        };
        /**
         * @hidden
         * @param {?} val
         * @return {?}
         */
        Checkbox.prototype._inputNormalize = function (val) {
            return util_1.isTrueProperty(val);
        };
        /**
         * @hidden
         * @return {?}
         */
        Checkbox.prototype._inputUpdated = function () {
            this._item && this._item.setElementClass('item-checkbox-checked', this._value);
        };
        return Checkbox;
    }(base_input_1.BaseInput));
    Checkbox.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-checkbox',
                    template: '<div class="checkbox-icon" [class.checkbox-checked]="_value">' +
                        '<div class="checkbox-inner"></div>' +
                        '</div>' +
                        '<button role="checkbox" ' +
                        'type="button" ' +
                        'ion-button="item-cover" ' +
                        '[id]="id" ' +
                        '[attr.aria-checked]="_value" ' +
                        '[attr.aria-labelledby]="_labelId" ' +
                        '[attr.aria-disabled]="_disabled" ' +
                        'class="item-cover"> ' +
                        '</button>',
                    host: {
                        '[class.checkbox-disabled]': '_disabled'
                    },
                    providers: [{ provide: forms_1.NG_VALUE_ACCESSOR, useExisting: Checkbox, multi: true }],
                    encapsulation: core_1.ViewEncapsulation.None,
                },] },
    ];
    /**
     * @nocollapse
     */
    Checkbox.ctorParameters = function () { return [
        { type: config_1.Config, },
        { type: form_1.Form, },
        { type: item_1.Item, decorators: [{ type: core_1.Optional },] },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
    ]; };
    Checkbox.propDecorators = {
        'checked': [{ type: core_1.Input },],
        '_click': [{ type: core_1.HostListener, args: ['click', ['$event'],] },],
    };
    exports.Checkbox = Checkbox;
    function Checkbox_tsickle_Closure_declarations() {
        /** @type {?} */
        Checkbox.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Checkbox.ctorParameters;
        /** @type {?} */
        Checkbox.propDecorators;
    }
});
//# sourceMappingURL=checkbox.js.map