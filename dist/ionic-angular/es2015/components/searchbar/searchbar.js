import { Component, ElementRef, EventEmitter, Input, Optional, Output, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Config } from '../../config/config';
import { BaseInput } from '../../util/base-input';
import { isPresent, isTrueProperty } from '../../util/util';
import { TimeoutDebouncer } from '../../util/debouncer';
import { Platform } from '../../platform/platform';
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
export class Searchbar extends BaseInput {
    /**
     * @param {?} config
     * @param {?} _plt
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} ngControl
     */
    constructor(config, _plt, elementRef, renderer, ngControl) {
        super(config, elementRef, renderer, 'searchbar', '', null, null, ngControl);
        this._plt = _plt;
        this._shouldBlur = true;
        this._shouldAlignLeft = true;
        this._isCancelVisible = false;
        this._spellcheck = false;
        this._autocomplete = 'off';
        this._autocorrect = 'off';
        this._isActive = false;
        this._showCancelButton = false;
        this._animated = false;
        this._inputDebouncer = new TimeoutDebouncer(0);
        /**
         * \@input {string} Set the the cancel button text. Default: `"Cancel"`.
         */
        this.cancelButtonText = 'Cancel';
        /**
         * \@input {string} Set the input's placeholder. Default `"Search"`.
         */
        this.placeholder = 'Search';
        /**
         * \@input {string} Set the type of the input. Values: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, `"url"`. Default `"search"`.
         */
        this.type = 'search';
        /**
         * \@output {event} Emitted when the Searchbar input has changed, including when it's cleared.
         */
        this.ionInput = new EventEmitter();
        /**
         * \@output {event} Emitted when the cancel button is clicked.
         */
        this.ionCancel = new EventEmitter();
        /**
         * \@output {event} Emitted when the clear input button is clicked.
         */
        this.ionClear = new EventEmitter();
        this.debounce = 250;
    }
    /**
     * \@input {boolean} If true, show the cancel button. Default `false`.
     * @return {?}
     */
    get showCancelButton() {
        return this._showCancelButton;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set showCancelButton(val) {
        this._showCancelButton = isTrueProperty(val);
    }
    /**
     * \@input {number} How long, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `250`.
     * @return {?}
     */
    get debounce() {
        return this._debouncer.wait;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set debounce(val) {
        this._debouncer.wait = val;
        this._inputDebouncer.wait = val;
    }
    /**
     * \@input {string} Set the input's autocomplete property. Values: `"on"`, `"off"`. Default `"off"`.
     * @param {?} val
     * @return {?}
     */
    set autocomplete(val) {
        this._autocomplete = (val === '' || val === 'on') ? 'on' : this._config.get('autocomplete', 'off');
    }
    /**
     * \@input {string} Set the input's autocorrect property. Values: `"on"`, `"off"`. Default `"off"`.
     * @param {?} val
     * @return {?}
     */
    set autocorrect(val) {
        this._autocorrect = (val === '' || val === 'on') ? 'on' : this._config.get('autocorrect', 'off');
    }
    /**
     * \@input {string|boolean} Set the input's spellcheck property. Values: `true`, `false`. Default `false`.
     * @param {?} val
     * @return {?}
     */
    set spellcheck(val) {
        this._spellcheck = (val === '' || val === 'true' || val === true) ? true : this._config.getBoolean('spellcheck', false);
    }
    /**
     * \@input {boolean} If true, enable searchbar animation. Default `false`.
     * @return {?}
     */
    get animated() {
        return this._animated;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set animated(val) {
        this._animated = isTrueProperty(val);
    }
    /**
     * @hidden
     * On Initialization check for attributes
     * @return {?}
     */
    ngOnInit() {
        const /** @type {?} */ showCancelButton = this.showCancelButton;
        if (typeof showCancelButton === 'string') {
            this.showCancelButton = (showCancelButton === '' || showCancelButton === 'true');
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    _inputUpdated() {
        const /** @type {?} */ ele = this._searchbarInput.nativeElement;
        const /** @type {?} */ value = this._value;
        // It is important not to re-assign the value if it is the same, because,
        // otherwise, the caret is moved to the end of the input
        if (ele.value !== value) {
            ele.value = value;
        }
        this.positionElements();
    }
    /**
     * @hidden
     * Positions the input search icon, placeholder, and the cancel button
     * based on the input value and if it is focused. (ios only)
     * @return {?}
     */
    positionElements() {
        const /** @type {?} */ isAnimated = this._animated;
        const /** @type {?} */ prevAlignLeft = this._shouldAlignLeft;
        const /** @type {?} */ shouldAlignLeft = (!isAnimated || (this._value && this._value.toString().trim() !== '') || this._isFocus === true);
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
    }
    /**
     * @return {?}
     */
    positionPlaceholder() {
        const /** @type {?} */ inputEle = this._searchbarInput.nativeElement;
        const /** @type {?} */ iconEle = this._searchbarIcon.nativeElement;
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
    }
    /**
     * @hidden
     * Show the iOS Cancel button on focus, hide it offscreen otherwise
     * @return {?}
     */
    positionCancelButton() {
        const /** @type {?} */ showShowCancel = this._isFocus;
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
    }
    /**
     * @hidden
     * Update the Searchbar input value when the input changes
     * @param {?} ev
     * @return {?}
     */
    inputChanged(ev) {
        this.value = ev.target.value;
        this._inputDebouncer.debounce(() => {
            this.ionInput.emit(ev);
        });
    }
    /**
     * @hidden
     * Sets the Searchbar to focused and active on input focus.
     * @return {?}
     */
    inputFocused() {
        this._isActive = true;
        this._fireFocus();
        this.positionElements();
    }
    /**
     * @hidden
     * Sets the Searchbar to not focused and checks if it should align left
     * based on whether there is a value in the searchbar or not.
     * @return {?}
     */
    inputBlurred() {
        // _shouldBlur determines if it should blur
        // if we are clearing the input we still want to stay focused in the input
        if (this._shouldBlur === false) {
            this._searchbarInput.nativeElement.focus();
            this._shouldBlur = true;
            return;
        }
        this._fireBlur();
        this.positionElements();
    }
    /**
     * @hidden
     * Clears the input field and triggers the control change.
     * @param {?} ev
     * @return {?}
     */
    clearInput(ev) {
        this.ionClear.emit(ev);
        // setTimeout() fixes https://github.com/ionic-team/ionic/issues/7527
        // wait for 4 frames
        setTimeout(() => {
            let /** @type {?} */ value = this._value;
            if (isPresent(value) && value !== '') {
                this.value = ''; // DOM WRITE
                this.ionInput.emit(ev);
            }
        }, 16 * 4);
        this._shouldBlur = false;
    }
    /**
     * @hidden
     * Clears the input field and tells the input to blur since
     * the clearInput function doesn't want the input to blur
     * then calls the custom cancel function if the user passed one in.
     * @param {?} ev
     * @return {?}
     */
    cancelSearchbar(ev) {
        this.ionCancel.emit(ev);
        this.clearInput(ev);
        this._shouldBlur = true;
        this._isActive = false;
    }
    /**
     * @return {?}
     */
    setFocus() {
        this._renderer.invokeElementMethod(this._searchbarInput.nativeElement, 'focus');
    }
}
Searchbar.decorators = [
    { type: Component, args: [{
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
                encapsulation: ViewEncapsulation.None
            },] },
];
/**
 * @nocollapse
 */
Searchbar.ctorParameters = () => [
    { type: Config, },
    { type: Platform, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: NgControl, decorators: [{ type: Optional },] },
];
Searchbar.propDecorators = {
    'cancelButtonText': [{ type: Input },],
    'showCancelButton': [{ type: Input },],
    'debounce': [{ type: Input },],
    'placeholder': [{ type: Input },],
    'autocomplete': [{ type: Input },],
    'autocorrect': [{ type: Input },],
    'spellcheck': [{ type: Input },],
    'type': [{ type: Input },],
    'animated': [{ type: Input },],
    'ionInput': [{ type: Output },],
    'ionCancel': [{ type: Output },],
    'ionClear': [{ type: Output },],
    '_searchbarInput': [{ type: ViewChild, args: ['searchbarInput',] },],
    '_searchbarIcon': [{ type: ViewChild, args: ['searchbarIcon',] },],
    '_cancelButton': [{ type: ViewChild, args: ['cancelButton', { read: ElementRef },] },],
};
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
//# sourceMappingURL=searchbar.js.map