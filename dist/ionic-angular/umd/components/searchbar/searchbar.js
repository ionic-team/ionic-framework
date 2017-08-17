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
        define(["require", "exports", "@angular/core", "@angular/forms", "../../config/config", "../../util/base-input", "../../util/util", "../../util/debouncer", "../../platform/platform"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var forms_1 = require("@angular/forms");
    var config_1 = require("../../config/config");
    var base_input_1 = require("../../util/base-input");
    var util_1 = require("../../util/util");
    var debouncer_1 = require("../../util/debouncer");
    var platform_1 = require("../../platform/platform");
    /**
     * \@name Searchbar
     * \@module ionic
     * \@description
     * Manages the display of a Searchbar which can be used to search or filter items.
     *
     * \@usage
     * ```html
     * <ion-searchbar
     *   [(ngModel)]="myInput"
     *   [showCancelButton]="shouldShowCancel"
     *   (ionInput)="onInput($event)"
     *   (ionCancel)="onCancel($event)">
     * </ion-searchbar>
     * ```
     *
     * \@demo /docs/demos/src/searchbar/
     * @see {\@link /docs/components#searchbar Searchbar Component Docs}
     */
    var Searchbar = (function (_super) {
        __extends(Searchbar, _super);
        /**
         * @param {?} config
         * @param {?} _plt
         * @param {?} elementRef
         * @param {?} renderer
         * @param {?} ngControl
         */
        function Searchbar(config, _plt, elementRef, renderer, ngControl) {
            var _this = _super.call(this, config, elementRef, renderer, 'searchbar', '', null, null, ngControl) || this;
            _this._plt = _plt;
            _this._shouldBlur = true;
            _this._shouldAlignLeft = true;
            _this._isCancelVisible = false;
            _this._spellcheck = false;
            _this._autocomplete = 'off';
            _this._autocorrect = 'off';
            _this._isActive = false;
            _this._showCancelButton = false;
            _this._animated = false;
            _this._inputDebouncer = new debouncer_1.TimeoutDebouncer(0);
            /**
             * \@input {string} Set the the cancel button text. Default: `"Cancel"`.
             */
            _this.cancelButtonText = 'Cancel';
            /**
             * \@input {string} Set the input's placeholder. Default `"Search"`.
             */
            _this.placeholder = 'Search';
            /**
             * \@input {string} Set the type of the input. Values: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, `"url"`. Default `"search"`.
             */
            _this.type = 'search';
            /**
             * \@output {event} Emitted when the Searchbar input has changed, including when it's cleared.
             */
            _this.ionInput = new core_1.EventEmitter();
            /**
             * \@output {event} Emitted when the cancel button is clicked.
             */
            _this.ionCancel = new core_1.EventEmitter();
            /**
             * \@output {event} Emitted when the clear input button is clicked.
             */
            _this.ionClear = new core_1.EventEmitter();
            _this.debounce = 250;
            return _this;
        }
        Object.defineProperty(Searchbar.prototype, "showCancelButton", {
            /**
             * \@input {boolean} If true, show the cancel button. Default `false`.
             * @return {?}
             */
            get: function () {
                return this._showCancelButton;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._showCancelButton = util_1.isTrueProperty(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Searchbar.prototype, "debounce", {
            /**
             * \@input {number} How long, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `250`.
             * @return {?}
             */
            get: function () {
                return this._debouncer.wait;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._debouncer.wait = val;
                this._inputDebouncer.wait = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Searchbar.prototype, "autocomplete", {
            /**
             * \@input {string} Set the input's autocomplete property. Values: `"on"`, `"off"`. Default `"off"`.
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._autocomplete = (val === '' || val === 'on') ? 'on' : this._config.get('autocomplete', 'off');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Searchbar.prototype, "autocorrect", {
            /**
             * \@input {string} Set the input's autocorrect property. Values: `"on"`, `"off"`. Default `"off"`.
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._autocorrect = (val === '' || val === 'on') ? 'on' : this._config.get('autocorrect', 'off');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Searchbar.prototype, "spellcheck", {
            /**
             * \@input {string|boolean} Set the input's spellcheck property. Values: `true`, `false`. Default `false`.
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._spellcheck = (val === '' || val === 'true' || val === true) ? true : this._config.getBoolean('spellcheck', false);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Searchbar.prototype, "animated", {
            /**
             * \@input {boolean} If true, enable searchbar animation. Default `false`.
             * @return {?}
             */
            get: function () {
                return this._animated;
            },
            /**
             * @param {?} val
             * @return {?}
             */
            set: function (val) {
                this._animated = util_1.isTrueProperty(val);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @hidden
         * On Initialization check for attributes
         * @return {?}
         */
        Searchbar.prototype.ngOnInit = function () {
            var /** @type {?} */ showCancelButton = this.showCancelButton;
            if (typeof showCancelButton === 'string') {
                this.showCancelButton = (showCancelButton === '' || showCancelButton === 'true');
            }
        };
        /**
         * @hidden
         * @return {?}
         */
        Searchbar.prototype._inputUpdated = function () {
            var /** @type {?} */ ele = this._searchbarInput.nativeElement;
            var /** @type {?} */ value = this._value;
            // It is important not to re-assign the value if it is the same, because,
            // otherwise, the caret is moved to the end of the input
            if (ele.value !== value) {
                ele.value = value;
            }
            this.positionElements();
        };
        /**
         * @hidden
         * Positions the input search icon, placeholder, and the cancel button
         * based on the input value and if it is focused. (ios only)
         * @return {?}
         */
        Searchbar.prototype.positionElements = function () {
            var /** @type {?} */ isAnimated = this._animated;
            var /** @type {?} */ prevAlignLeft = this._shouldAlignLeft;
            var /** @type {?} */ shouldAlignLeft = (!isAnimated || (this._value && this._value.toString().trim() !== '') || this._isFocus === true);
            this._shouldAlignLeft = shouldAlignLeft;
            if (this._mode !== 'ios') {
                return;
            }
            if (prevAlignLeft !== shouldAlignLeft) {
                this.positionPlaceholder();
            }
            if (isAnimated) {
                this.positionCancelButton();
            }
        };
        /**
         * @return {?}
         */
        Searchbar.prototype.positionPlaceholder = function () {
            var /** @type {?} */ inputEle = this._searchbarInput.nativeElement;
            var /** @type {?} */ iconEle = this._searchbarIcon.nativeElement;
            if (this._shouldAlignLeft) {
                inputEle.removeAttribute('style');
                iconEle.removeAttribute('style');
            }
            else {
                // Create a dummy span to get the placeholder width
                var /** @type {?} */ doc = this._plt.doc();
                var /** @type {?} */ tempSpan = doc.createElement('span');
                tempSpan.innerHTML = this.placeholder;
                doc.body.appendChild(tempSpan);
                // Get the width of the span then remove it
                var /** @type {?} */ textWidth = tempSpan.offsetWidth;
                doc.body.removeChild(tempSpan);
                // Set the input padding start
                var /** @type {?} */ inputLeft = 'calc(50% - ' + (textWidth / 2) + 'px)';
                if (this._plt.isRTL) {
                    inputEle.style.paddingRight = inputLeft;
                }
                else {
                    inputEle.style.paddingLeft = inputLeft;
                }
                // Set the icon margin start
                var /** @type {?} */ iconLeft = 'calc(50% - ' + ((textWidth / 2) + 30) + 'px)';
                if (this._plt.isRTL) {
                    iconEle.style.marginRight = iconLeft;
                }
                else {
                    iconEle.style.marginLeft = iconLeft;
                }
            }
        };
        /**
         * @hidden
         * Show the iOS Cancel button on focus, hide it offscreen otherwise
         * @return {?}
         */
        Searchbar.prototype.positionCancelButton = function () {
            var /** @type {?} */ showShowCancel = this._isFocus;
            if (showShowCancel !== this._isCancelVisible) {
                var /** @type {?} */ cancelStyleEle = this._cancelButton.nativeElement;
                var /** @type {?} */ cancelStyle = cancelStyleEle.style;
                this._isCancelVisible = showShowCancel;
                if (showShowCancel) {
                    if (this._plt.isRTL) {
                        cancelStyle.marginLeft = '0';
                    }
                    else {
                        cancelStyle.marginRight = '0';
                    }
                }
                else {
                    var /** @type {?} */ offset = cancelStyleEle.offsetWidth;
                    if (offset > 0) {
                        if (this._plt.isRTL) {
                            cancelStyle.marginLeft = -offset + 'px';
                        }
                        else {
                            cancelStyle.marginRight = -offset + 'px';
                        }
                    }
                }
            }
        };
        /**
         * @hidden
         * Update the Searchbar input value when the input changes
         * @param {?} ev
         * @return {?}
         */
        Searchbar.prototype.inputChanged = function (ev) {
            var _this = this;
            this.value = ev.target.value;
            this._inputDebouncer.debounce(function () {
                _this.ionInput.emit(ev);
            });
        };
        /**
         * @hidden
         * Sets the Searchbar to focused and active on input focus.
         * @return {?}
         */
        Searchbar.prototype.inputFocused = function () {
            this._isActive = true;
            this._fireFocus();
            this.positionElements();
        };
        /**
         * @hidden
         * Sets the Searchbar to not focused and checks if it should align left
         * based on whether there is a value in the searchbar or not.
         * @return {?}
         */
        Searchbar.prototype.inputBlurred = function () {
            // _shouldBlur determines if it should blur
            // if we are clearing the input we still want to stay focused in the input
            if (this._shouldBlur === false) {
                this._searchbarInput.nativeElement.focus();
                this._shouldBlur = true;
                return;
            }
            this._fireBlur();
            this.positionElements();
        };
        /**
         * @hidden
         * Clears the input field and triggers the control change.
         * @param {?} ev
         * @return {?}
         */
        Searchbar.prototype.clearInput = function (ev) {
            var _this = this;
            this.ionClear.emit(ev);
            // setTimeout() fixes https://github.com/ionic-team/ionic/issues/7527
            // wait for 4 frames
            setTimeout(function () {
                var /** @type {?} */ value = _this._value;
                if (util_1.isPresent(value) && value !== '') {
                    _this.value = ''; // DOM WRITE
                    _this.ionInput.emit(ev);
                }
            }, 16 * 4);
            this._shouldBlur = false;
        };
        /**
         * @hidden
         * Clears the input field and tells the input to blur since
         * the clearInput function doesn't want the input to blur
         * then calls the custom cancel function if the user passed one in.
         * @param {?} ev
         * @return {?}
         */
        Searchbar.prototype.cancelSearchbar = function (ev) {
            this.ionCancel.emit(ev);
            this.clearInput(ev);
            this._shouldBlur = true;
            this._isActive = false;
        };
        /**
         * @return {?}
         */
        Searchbar.prototype.setFocus = function () {
            this._renderer.invokeElementMethod(this._searchbarInput.nativeElement, 'focus');
        };
        return Searchbar;
    }(base_input_1.BaseInput));
    Searchbar.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-searchbar',
                    template: '<div class="searchbar-input-container">' +
                        '<button ion-button mode="md" (click)="cancelSearchbar($event)" (mousedown)="cancelSearchbar($event)" clear color="dark" class="searchbar-md-cancel" type="button">' +
                        '<ion-icon name="md-arrow-back"></ion-icon>' +
                        '</button>' +
                        '<div #searchbarIcon class="searchbar-search-icon"></div>' +
                        '<input #searchbarInput class="searchbar-input" (input)="inputChanged($event)" (blur)="inputBlurred()" (focus)="inputFocused()" ' +
                        '[attr.placeholder]="placeholder" ' +
                        '[attr.type]="type" ' +
                        '[attr.autocomplete]="_autocomplete" ' +
                        '[attr.autocorrect]="_autocorrect" ' +
                        '[attr.spellcheck]="_spellcheck">' +
                        '<button ion-button clear class="searchbar-clear-icon" [mode]="_mode" (click)="clearInput($event)" (mousedown)="clearInput($event)" type="button"></button>' +
                        '</div>' +
                        '<button ion-button #cancelButton mode="ios" [tabindex]="_isActive ? 1 : -1" clear (click)="cancelSearchbar($event)" (mousedown)="cancelSearchbar($event)" class="searchbar-ios-cancel" type="button">{{cancelButtonText}}</button>',
                    host: {
                        '[class.searchbar-animated]': '_animated',
                        '[class.searchbar-has-value]': '_value',
                        '[class.searchbar-active]': '_isActive',
                        '[class.searchbar-show-cancel]': '_showCancelButton',
                        '[class.searchbar-left-aligned]': '_shouldAlignLeft',
                        '[class.searchbar-has-focus]': '_isFocus'
                    },
                    encapsulation: core_1.ViewEncapsulation.None
                },] },
    ];
    /**
     * @nocollapse
     */
    Searchbar.ctorParameters = function () { return [
        { type: config_1.Config, },
        { type: platform_1.Platform, },
        { type: core_1.ElementRef, },
        { type: core_1.Renderer, },
        { type: forms_1.NgControl, decorators: [{ type: core_1.Optional },] },
    ]; };
    Searchbar.propDecorators = {
        'cancelButtonText': [{ type: core_1.Input },],
        'showCancelButton': [{ type: core_1.Input },],
        'debounce': [{ type: core_1.Input },],
        'placeholder': [{ type: core_1.Input },],
        'autocomplete': [{ type: core_1.Input },],
        'autocorrect': [{ type: core_1.Input },],
        'spellcheck': [{ type: core_1.Input },],
        'type': [{ type: core_1.Input },],
        'animated': [{ type: core_1.Input },],
        'ionInput': [{ type: core_1.Output },],
        'ionCancel': [{ type: core_1.Output },],
        'ionClear': [{ type: core_1.Output },],
        '_searchbarInput': [{ type: core_1.ViewChild, args: ['searchbarInput',] },],
        '_searchbarIcon': [{ type: core_1.ViewChild, args: ['searchbarIcon',] },],
        '_cancelButton': [{ type: core_1.ViewChild, args: ['cancelButton', { read: core_1.ElementRef },] },],
    };
    exports.Searchbar = Searchbar;
    function Searchbar_tsickle_Closure_declarations() {
        /** @type {?} */
        Searchbar.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        Searchbar.ctorParameters;
        /** @type {?} */
        Searchbar.propDecorators;
        /** @type {?} */
        Searchbar.prototype._shouldBlur;
        /** @type {?} */
        Searchbar.prototype._shouldAlignLeft;
        /** @type {?} */
        Searchbar.prototype._isCancelVisible;
        /** @type {?} */
        Searchbar.prototype._spellcheck;
        /** @type {?} */
        Searchbar.prototype._autocomplete;
        /** @type {?} */
        Searchbar.prototype._autocorrect;
        /** @type {?} */
        Searchbar.prototype._isActive;
        /** @type {?} */
        Searchbar.prototype._showCancelButton;
        /** @type {?} */
        Searchbar.prototype._animated;
        /** @type {?} */
        Searchbar.prototype._inputDebouncer;
        /**
         * \@input {string} Set the the cancel button text. Default: `"Cancel"`.
         * @type {?}
         */
        Searchbar.prototype.cancelButtonText;
        /**
         * \@input {string} Set the input's placeholder. Default `"Search"`.
         * @type {?}
         */
        Searchbar.prototype.placeholder;
        /**
         * \@input {string} Set the type of the input. Values: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, `"url"`. Default `"search"`.
         * @type {?}
         */
        Searchbar.prototype.type;
        /**
         * \@output {event} Emitted when the Searchbar input has changed, including when it's cleared.
         * @type {?}
         */
        Searchbar.prototype.ionInput;
        /**
         * \@output {event} Emitted when the cancel button is clicked.
         * @type {?}
         */
        Searchbar.prototype.ionCancel;
        /**
         * \@output {event} Emitted when the clear input button is clicked.
         * @type {?}
         */
        Searchbar.prototype.ionClear;
        /** @type {?} */
        Searchbar.prototype._searchbarInput;
        /** @type {?} */
        Searchbar.prototype._searchbarIcon;
        /** @type {?} */
        Searchbar.prototype._cancelButton;
        /** @type {?} */
        Searchbar.prototype._plt;
    }
});
//# sourceMappingURL=searchbar.js.map