(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../config/config", "../../util/dom", "../../gestures/gesture-controller", "../../util/util", "../../platform/key", "../../navigation/nav-params", "../../platform/platform", "../../navigation/view-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var config_1 = require("../../config/config");
    var dom_1 = require("../../util/dom");
    var gesture_controller_1 = require("../../gestures/gesture-controller");
    var util_1 = require("../../util/util");
    var key_1 = require("../../platform/key");
    var nav_params_1 = require("../../navigation/nav-params");
    var platform_1 = require("../../platform/platform");
    var view_controller_1 = require("../../navigation/view-controller");
    /**
     * @hidden
     */
    var AlertCmp = (function () {
        /**
         * @param {?} _viewCtrl
         * @param {?} _elementRef
         * @param {?} config
         * @param {?} gestureCtrl
         * @param {?} params
         * @param {?} _renderer
         * @param {?} _plt
         */
        function AlertCmp(_viewCtrl, _elementRef, config, gestureCtrl, params, _renderer, _plt) {
            this._viewCtrl = _viewCtrl;
            this._elementRef = _elementRef;
            this._renderer = _renderer;
            this._plt = _plt;
            // gesture blocker is used to disable gestures dynamically
            this.gestureBlocker = gestureCtrl.createBlocker(gesture_controller_1.BLOCK_ALL);
            this.d = params.data;
            this.mode = this.d.mode || config.get('mode');
            this.keyboardResizes = config.getBoolean('keyboardResizes', false);
            _renderer.setElementClass(_elementRef.nativeElement, "alert-" + this.mode, true);
            if (this.d.cssClass) {
                this.d.cssClass.split(' ').forEach(function (cssClass) {
                    // Make sure the class isn't whitespace, otherwise it throws exceptions
                    if (cssClass.trim() !== '')
                        _renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
                });
            }
            this.id = (++alertIds);
            this.descId = '';
            this.hdrId = 'alert-hdr-' + this.id;
            this.subHdrId = 'alert-subhdr-' + this.id;
            this.msgId = 'alert-msg-' + this.id;
            this.activeId = '';
            this.lastClick = 0;
            if (this.d.message) {
                this.descId = this.msgId;
            }
            else if (this.d.subTitle) {
                this.descId = this.subHdrId;
            }
            if (!this.d.message) {
                this.d.message = '';
            }
        }
        /**
         * @return {?}
         */
        AlertCmp.prototype.ionViewDidLoad = function () {
            var _this = this;
            // normalize the data
            var /** @type {?} */ data = this.d;
            data.buttons = data.buttons.map(function (button) {
                if (typeof button === 'string') {
                    return { text: button };
                }
                return button;
            });
            data.inputs = data.inputs.map(function (input, index) {
                var /** @type {?} */ r = {
                    type: input.type || 'text',
                    name: util_1.isPresent(input.name) ? input.name : index + '',
                    placeholder: util_1.isPresent(input.placeholder) ? input.placeholder : '',
                    value: util_1.isPresent(input.value) ? input.value : '',
                    label: input.label,
                    checked: !!input.checked,
                    disabled: !!input.disabled,
                    id: util_1.isPresent(input.id) ? input.id : "alert-input-" + _this.id + "-" + index,
                    handler: util_1.isPresent(input.handler) ? input.handler : null,
                    min: util_1.isPresent(input.min) ? input.min : null,
                    max: util_1.isPresent(input.max) ? input.max : null
                };
                return r;
            });
            // An alert can be created with several different inputs. Radios,
            // checkboxes and inputs are all accepted, but they cannot be mixed.
            var /** @type {?} */ inputTypes = [];
            data.inputs.forEach(function (input) {
                if (inputTypes.indexOf(input.type) < 0) {
                    inputTypes.push(input.type);
                }
            });
            if (inputTypes.length > 1 && (inputTypes.indexOf('checkbox') > -1 || inputTypes.indexOf('radio') > -1)) {
                console.warn("Alert cannot mix input types: " + (inputTypes.join('/')) + ". Please see alert docs for more info.");
            }
            this.inputType = inputTypes.length ? inputTypes[0] : null;
            var /** @type {?} */ checkedInput = this.d.inputs.find(function (input) { return input.checked; });
            if (checkedInput) {
                this.activeId = checkedInput.id;
            }
            var /** @type {?} */ hasTextInput = (this.d.inputs.length && this.d.inputs.some(function (i) { return !(dom_1.NON_TEXT_INPUT_REGEX.test(i.type)); }));
            if (!this.keyboardResizes && hasTextInput && this._plt.is('mobile')) {
                // this alert has a text input and it's on a mobile device so we should align
                // the alert up high because we need to leave space for the virtual keboard
                // this also helps prevent the layout getting all messed up from
                // the browser trying to scroll the input into a safe area
                this._renderer.setElementClass(this._elementRef.nativeElement, 'alert-top', true);
            }
        };
        /**
         * @return {?}
         */
        AlertCmp.prototype.ionViewWillEnter = function () {
            this.gestureBlocker.block();
        };
        /**
         * @return {?}
         */
        AlertCmp.prototype.ionViewDidLeave = function () {
            this.gestureBlocker.unblock();
        };
        /**
         * @return {?}
         */
        AlertCmp.prototype.ionViewDidEnter = function () {
            // set focus on the first input or button in the alert
            // note that this does not always work and bring up the keyboard on
            // devices since the focus command must come from the user's touch event
            // and ionViewDidEnter is not in the same callstack as the touch event :(
            var /** @type {?} */ focusableEle = this._elementRef.nativeElement.querySelector('input,button');
            if (focusableEle) {
                focusableEle.focus();
            }
            this.enabled = true;
        };
        /**
         * @param {?} ev
         * @return {?}
         */
        AlertCmp.prototype.keyUp = function (ev) {
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
         * @param {?} button
         * @return {?}
         */
        AlertCmp.prototype.btnClick = function (button) {
            if (!this.enabled) {
                return;
            }
            // keep the time of the most recent button click
            this.lastClick = Date.now();
            var /** @type {?} */ shouldDismiss = true;
            if (button.handler) {
                // a handler has been provided, execute it
                // pass the handler the values from the inputs
                if (button.handler(this.getValues()) === false) {
                    // if the return value of the handler is false then do not dismiss
                    shouldDismiss = false;
                }
            }
            if (shouldDismiss) {
                this.dismiss(button.role);
            }
        };
        /**
         * @param {?} checkedInput
         * @return {?}
         */
        AlertCmp.prototype.rbClick = function (checkedInput) {
            if (this.enabled) {
                this.d.inputs.forEach(function (input) {
                    input.checked = (checkedInput === input);
                });
                this.activeId = checkedInput.id;
                if (checkedInput.handler) {
                    checkedInput.handler(checkedInput);
                }
            }
        };
        /**
         * @param {?} checkedInput
         * @return {?}
         */
        AlertCmp.prototype.cbClick = function (checkedInput) {
            if (this.enabled) {
                checkedInput.checked = !checkedInput.checked;
                if (checkedInput.handler) {
                    checkedInput.handler(checkedInput);
                }
            }
        };
        /**
         * @return {?}
         */
        AlertCmp.prototype.bdClick = function () {
            if (this.enabled && this.d.enableBackdropDismiss) {
                var /** @type {?} */ cancelBtn = this.d.buttons.find(function (b) { return ((b)).role === 'cancel'; });
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
        AlertCmp.prototype.dismiss = function (role) {
            var /** @type {?} */ opts = {
                minClickBlockDuration: 400
            };
            return this._viewCtrl.dismiss(this.getValues(), role, opts);
        };
        /**
         * @return {?}
         */
        AlertCmp.prototype.getValues = function () {
            if (this.inputType === 'radio') {
                // this is an alert with radio buttons (single value select)
                // return the one value which is checked, otherwise undefined
                var /** @type {?} */ checkedInput = this.d.inputs.find(function (i) { return i.checked; });
                return checkedInput ? checkedInput.value : undefined;
            }
            if (this.inputType === 'checkbox') {
                // this is an alert with checkboxes (multiple value select)
                // return an array of all the checked values
                return this.d.inputs.filter(function (i) { return i.checked; }).map(function (i) { return i.value; });
            }
            if (this.d.inputs.length === 0) {
                // this is an alert without any options/inputs at all
                return undefined;
            }
            // this is an alert with text inputs
            // return an object of all the values with the input name as the key
            var /** @type {?} */ values = {};
            this.d.inputs.forEach(function (i) {
                values[i.name] = i.value;
            });
            return values;
        };
        /**
         * @return {?}
         */
        AlertCmp.prototype.ngOnDestroy = function () {
            (void 0) /* assert */;
            this.gestureBlocker.destroy();
        };
        return AlertCmp;
    }());
    AlertCmp.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-alert',
                    template: '<ion-backdrop (click)="bdClick()" [class.backdrop-no-tappable]="!d.enableBackdropDismiss"></ion-backdrop>' +
                        '<div class="alert-wrapper">' +
                        '<div class="alert-head">' +
                        '<h2 id="{{hdrId}}" class="alert-title" *ngIf="d.title" [innerHTML]="d.title"></h2>' +
                        '<h3 id="{{subHdrId}}" class="alert-sub-title" *ngIf="d.subTitle" [innerHTML]="d.subTitle"></h3>' +
                        '</div>' +
                        '<div id="{{msgId}}" class="alert-message" [innerHTML]="d.message"></div>' +
                        '<div *ngIf="d.inputs.length" [ngSwitch]="inputType">' +
                        '<ng-template ngSwitchCase="radio">' +
                        '<div class="alert-radio-group" role="radiogroup" [attr.aria-labelledby]="hdrId" [attr.aria-activedescendant]="activeId">' +
                        '<button ion-button="alert-radio-button" *ngFor="let i of d.inputs" (click)="rbClick(i)" [attr.aria-checked]="i.checked" [disabled]="i.disabled" [attr.id]="i.id" class="alert-tappable alert-radio" role="radio">' +
                        '<div class="alert-radio-icon"><div class="alert-radio-inner"></div></div>' +
                        '<div class="alert-radio-label">' +
                        '{{i.label}}' +
                        '</div>' +
                        '</button>' +
                        '</div>' +
                        '</ng-template>' +
                        '<ng-template ngSwitchCase="checkbox">' +
                        '<div class="alert-checkbox-group">' +
                        '<button ion-button="alert-checkbox-button" *ngFor="let i of d.inputs" (click)="cbClick(i)" [attr.aria-checked]="i.checked" [attr.id]="i.id" [disabled]="i.disabled" class="alert-tappable alert-checkbox" role="checkbox">' +
                        '<div class="alert-checkbox-icon"><div class="alert-checkbox-inner"></div></div>' +
                        '<div class="alert-checkbox-label">' +
                        '{{i.label}}' +
                        '</div>' +
                        '</button>' +
                        '</div>' +
                        '</ng-template>' +
                        '<ng-template ngSwitchDefault>' +
                        '<div class="alert-input-group">' +
                        '<div *ngFor="let i of d.inputs" class="alert-input-wrapper">' +
                        '<input [placeholder]="i.placeholder" [(ngModel)]="i.value" [type]="i.type" [min]="i.min" [max]="i.max" [attr.id]="i.id" class="alert-input">' +
                        '</div>' +
                        '</div>' +
                        '</ng-template>' +
                        '</div>' +
                        '<div class="alert-button-group" [ngClass]="{\'alert-button-group-vertical\':d.buttons.length>2}">' +
                        '<button ion-button="alert-button" *ngFor="let b of d.buttons" (click)="btnClick(b)" [ngClass]="b.cssClass">' +
                        '{{b.text}}' +
                        '</button>' +
                        '</div>' +
                        '</div>',
                    host: {
                        'role': 'dialog',
                        '[attr.aria-labelledby]': 'hdrId',
                        '[attr.aria-describedby]': 'descId'
                    },
                    encapsulation: core_1.ViewEncapsulation.None,
                },] },
    ];
    /**
     * @nocollapse
     */
    AlertCmp.ctorParameters = function () { return [
        { type: view_controller_1.ViewController, },
        { type: core_1.ElementRef, },
        { type: config_1.Config, },
        { type: gesture_controller_1.GestureController, },
        { type: nav_params_1.NavParams, },
        { type: core_1.Renderer, },
        { type: platform_1.Platform, },
    ]; };
    AlertCmp.propDecorators = {
        'keyUp': [{ type: core_1.HostListener, args: ['body:keyup', ['$event'],] },],
    };
    exports.AlertCmp = AlertCmp;
    function AlertCmp_tsickle_Closure_declarations() {
        /** @type {?} */
        AlertCmp.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        AlertCmp.ctorParameters;
        /** @type {?} */
        AlertCmp.propDecorators;
        /** @type {?} */
        AlertCmp.prototype.activeId;
        /** @type {?} */
        AlertCmp.prototype.descId;
        /** @type {?} */
        AlertCmp.prototype.d;
        /** @type {?} */
        AlertCmp.prototype.enabled;
        /** @type {?} */
        AlertCmp.prototype.hdrId;
        /** @type {?} */
        AlertCmp.prototype.id;
        /** @type {?} */
        AlertCmp.prototype.inputType;
        /** @type {?} */
        AlertCmp.prototype.lastClick;
        /** @type {?} */
        AlertCmp.prototype.msgId;
        /** @type {?} */
        AlertCmp.prototype.subHdrId;
        /** @type {?} */
        AlertCmp.prototype.mode;
        /** @type {?} */
        AlertCmp.prototype.keyboardResizes;
        /** @type {?} */
        AlertCmp.prototype.gestureBlocker;
        /** @type {?} */
        AlertCmp.prototype._viewCtrl;
        /** @type {?} */
        AlertCmp.prototype._elementRef;
        /** @type {?} */
        AlertCmp.prototype._renderer;
        /** @type {?} */
        AlertCmp.prototype._plt;
    }
    var /** @type {?} */ alertIds = -1;
});
//# sourceMappingURL=alert-component.js.map