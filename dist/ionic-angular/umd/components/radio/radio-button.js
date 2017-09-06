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
        define(["require", "exports", "@angular/core", "../../config/config", "../../util/form", "../ion", "../../util/util", "../item/item", "./radio-group"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var config_1 = require("../../config/config");
    var form_1 = require("../../util/form");
    var ion_1 = require("../ion");
    var util_1 = require("../../util/util");
    var item_1 = require("../item/item");
    var radio_group_1 = require("./radio-group");
    /**
     * \@description
     * A radio button is a button that can be either checked or unchecked. A user can tap
     * the button to check or uncheck it. It can also be checked from the template using
     * the `checked` property.
     *
     * Use an element with a `radio-group` attribute to group a set of radio buttons. When
     * radio buttons are inside a [radio group](../RadioGroup), exactly one radio button
     * in the group can be checked at any time. If a radio button is not placed in a group,
     * they will all have the ability to be checked at the same time.
     *
     * See the [Angular Forms Docs](https://angular.io/docs/ts/latest/guide/forms.html) for
     * more information on forms and input.
     *
     * \@usage
     * ```html
     * <ion-list radio-group [(ngModel)]="relationship">
     *   <ion-item>
     *     <ion-label>Friends</ion-label>
     *     <ion-radio value="friends" checked></ion-radio>
     *   </ion-item>
     *   <ion-item>
     *     <ion-label>Family</ion-label>
     *     <ion-radio value="family"></ion-radio>
     *   </ion-item>
     *   <ion-item>
     *     <ion-label>Enemies</ion-label>
     *     <ion-radio value="enemies" [disabled]="isDisabled"></ion-radio>
     *   </ion-item>
     * </ion-list>
     * ```
     * \@demo /docs/demos/src/radio/
     * @see {\@link /docs/components#radio Radio Component Docs}
     * @see {\@link ../RadioGroup RadioGroup API Docs}
     */
    var RadioButton = (function (_super) {
        __extends(RadioButton, _super);
        /**
         * @param {?} _form
         * @param {?} config
         * @param {?} elementRef
         * @param {?} renderer
         * @param {?} _item
         * @param {?} _group
         */
        function RadioButton(_form, config, elementRef, renderer, _item, _group) {
            var _this = _super.call(this, config, elementRef, renderer, 'radio') || this;
            _this._form = _form;
            _this._item = _item;
            _this._group = _group;
            /**
             * \@internal
             */
            _this._checked = false;
            /**
             * \@internal
             */
            _this._disabled = false;
            /**
             * \@internal
             */
            _this._value = null;
            /**
             * \@output {any} Emitted when the radio button is selected.
             */
            _this.ionSelect = new core_1.EventEmitter();
            _form.register(_this);
            if (_group) {
                // register with the radiogroup
                _this.id = 'rb-' + _group.add(_this);
            }
            if (_item) {
                // register the input inside of the item
                // reset to the item's id instead of the radiogroup id
                _this.id = 'rb-' + _item.registerInput('radio');
                _this._labelId = 'lbl-' + _item.id;
                _this._item.setElementClass('item-radio', true);
            }
            return _this;
        }
        Object.defineProperty(RadioButton.prototype, "color", {
            /**
             * \@input {string} The color to use from your Sass `$colors` map.
             * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
             * For more information, see [Theming your App](/docs/theming/theming-your-app).
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._setColor(val);
                if (this._item) {
                    this._item._updateColor(val, 'item-radio');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RadioButton.prototype, "value", {
            /**
             * \@input {any} The value of the radio button. Defaults to the generated id.
             * @return {?}
             */
            get: function () {
                // if the value is not defined then use it's unique id
                return util_1.isBlank(this._value) ? this.id : this._value;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._value = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RadioButton.prototype, "checked", {
            /**
             * \@input {boolean} If true, the element is selected, and other buttons in the group are unselected.
             * @return {?}
             */
            get: function () {
                return this._checked;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._checked = util_1.isTrueProperty(val);
                if (this._item) {
                    this._item.setElementClass('item-radio-checked', this._checked);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RadioButton.prototype, "disabled", {
            /**
             * \@input {boolean} If true, the user cannot interact with this element.
             * @return {?}
             */
            get: function () {
                return this._disabled || (this._group != null && this._group.disabled);
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._disabled = util_1.isTrueProperty(val);
                this._item && this._item.setElementClass('item-radio-disabled', this._disabled);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @hidden
         * @return {?}
         */
        RadioButton.prototype.initFocus = function () {
            this._elementRef.nativeElement.querySelector('button').focus();
        };
        /**
         * \@internal
         * @param {?} ev
         * @return {?}
         */
        RadioButton.prototype._click = function (ev) {
            (void 0) /* console.debug */;
            ev.preventDefault();
            ev.stopPropagation();
            this.checked = true;
            this.ionSelect.emit(this.value);
        };
        /**
         * \@internal
         * @return {?}
         */
        RadioButton.prototype.ngOnInit = function () {
            if (this._group && util_1.isPresent(this._group.value)) {
                this.checked = util_1.isCheckedProperty(this._group.value, this.value);
            }
            if (this._group && this._group.disabled) {
                this.disabled = this._group.disabled;
            }
        };
        /**
         * \@internal
         * @return {?}
         */
        RadioButton.prototype.ngOnDestroy = function () {
            this._form.deregister(this);
            this._group && this._group.remove(this);
        };
        return RadioButton;
    }(ion_1.Ion));
    RadioButton.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-radio',
                    template: '<div class="radio-icon" [class.radio-checked]="_checked"> ' +
                        '<div class="radio-inner"></div> ' +
                        '</div> ' +
                        '<button role="radio" ' +
                        'type="button" ' +
                        'ion-button="item-cover" ' +
                        '[id]="id" ' +
                        '[attr.aria-checked]="_checked" ' +
                        '[attr.aria-labelledby]="_labelId" ' +
                        '[attr.aria-disabled]="_disabled" ' +
                        'class="item-cover"> ' +
                        '</button>',
                    host: {
                        '[class.radio-disabled]': '_disabled'
                    },
                    encapsulation: core_1.ViewEncapsulation.None,
                },] },
    ];
    /**
     * @nocollapse
     */
    RadioButton.ctorParameters = function () { return [
        { type: form_1.Form, },
        { type: config_1.Config, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
        { type: item_1.Item, decorators: [{ type: core_1.Optional },] },
        { type: radio_group_1.RadioGroup, decorators: [{ type: core_1.Optional },] },
    ]; };
    RadioButton.propDecorators = {
        'color': [{ type: core_1.Input },],
        'ionSelect': [{ type: core_1.Output },],
        'value': [{ type: core_1.Input },],
        'checked': [{ type: core_1.Input },],
        'disabled': [{ type: core_1.Input },],
        '_click': [{ type: core_1.HostListener, args: ['click', ['$event'],] },],
    };
    exports.RadioButton = RadioButton;
    function RadioButton_tsickle_Closure_declarations() {
        /** @type {?} */
        RadioButton.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        RadioButton.ctorParameters;
        /** @type {?} */
        RadioButton.propDecorators;
        /**
         * \@internal
         * @type {?}
         */
        RadioButton.prototype._checked;
        /**
         * \@internal
         * @type {?}
         */
        RadioButton.prototype._disabled;
        /**
         * \@internal
         * @type {?}
         */
        RadioButton.prototype._labelId;
        /**
         * \@internal
         * @type {?}
         */
        RadioButton.prototype._value;
        /**
         * \@internal
         * @type {?}
         */
        RadioButton.prototype.id;
        /**
         * \@output {any} Emitted when the radio button is selected.
         * @type {?}
         */
        RadioButton.prototype.ionSelect;
        /** @type {?} */
        RadioButton.prototype._form;
        /** @type {?} */
        RadioButton.prototype._item;
        /** @type {?} */
        RadioButton.prototype._group;
    }
});
//# sourceMappingURL=radio-button.js.map