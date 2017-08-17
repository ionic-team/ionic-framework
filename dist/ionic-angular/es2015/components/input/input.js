import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Optional, Output, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { Content } from '../content/content';
import { copyInputAttributes, hasPointerMoved, pointerCoord } from '../../util/dom';
import { DomController } from '../../platform/dom-controller';
import { Form } from '../../util/form';
import { BaseInput } from '../../util/base-input';
import { isTrueProperty } from '../../util/util';
import { Item } from '../item/item';
import { Platform } from '../../platform/platform';
/**
 * \@name Input
 * \@description
 *
 * `ion-input` is meant for text type inputs only, such as `text`,
 * `password`, `email`, `number`, `search`, `tel`, and `url`. Ionic
 * still uses an actual `<input type="text">` HTML element within the
 * component, however, with Ionic wrapping the native HTML input
 * element it's better able to handle the user experience and
 * interactivity.
 *
 * Similarly, `<ion-textarea>` should be used in place of `<textarea>`.
 *
 * An `ion-input` is **not** used for non-text type inputs, such as a
 * `checkbox`, `radio`, `toggle`, `range`, `select`, etc.
 *
 * Along with the blur/focus events, `input` support all standard text input
 * events like `keyup`, `keydown`, `keypress`, `input`,etc. Any standard event
 * can be attached and will function as expected.
 *
 * \@usage
 * ```html
 * <ion-list>
 *   <ion-item>
 *     <ion-label color="primary">Inline Label</ion-label>
 *     <ion-input placeholder="Text Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" fixed>Fixed Label</ion-label>
 *     <ion-input type="tel" placeholder="Tel Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-input type="number" placeholder="Number Input with no label"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" stacked>Stacked Label</ion-label>
 *     <ion-input type="email" placeholder="Email Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" stacked>Stacked Label</ion-label>
 *     <ion-input type="password" placeholder="Password Input"></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label color="primary" floating>Floating Label</ion-label>
 *     <ion-input></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-input placeholder="Clear Input" clearInput></ion-input>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-textarea placeholder="Enter a description"></ion-textarea>
 *   </ion-item>
 * </ion-list>
 * ```
 *
 * \@demo /docs/demos/src/input/
 */
export class TextInput extends BaseInput {
    /**
     * @param {?} config
     * @param {?} _plt
     * @param {?} _form
     * @param {?} _app
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} _content
     * @param {?} _item
     * @param {?} ngControl
     * @param {?} _dom
     */
    constructor(config, _plt, _form, _app, elementRef, renderer, _content, _item, ngControl, _dom) {
        super(config, elementRef, renderer, 'input', '', _form, _item, ngControl);
        this._plt = _plt;
        this._app = _app;
        this._content = _content;
        this.ngControl = ngControl;
        this._dom = _dom;
        this._clearInput = false;
        this._readonly = false;
        this._type = 'text';
        this._isTextarea = false;
        this._onDestroy = new Subject();
        this._useAssist = false;
        this._relocated = false;
        /**
         * \@input {string} Set the input's autocomplete property. Values: `"on"`, `"off"`. Default `"off"`.
         */
        this.autocomplete = '';
        /**
         * \@input {string} Set the input's autocorrect property. Values: `"on"`, `"off"`. Default `"off"`.
         */
        this.autocorrect = '';
        /**
         * \@input {string} Instructional text that shows before the input has a value.
         */
        this.placeholder = '';
        /**
         * \@input {any} The minimum value, which must not be greater than its maximum (max attribute) value.
         */
        this.min = null;
        /**
         * \@input {any} The maximum value, which must not be less than its minimum (min attribute) value.
         */
        this.max = null;
        /**
         * \@input {any} Works with the min and max attributes to limit the increments at which a value can be set.
         */
        this.step = null;
        /**
         * @hidden
         */
        this.input = new EventEmitter();
        /**
         * @hidden
         */
        this.blur = new EventEmitter();
        /**
         * @hidden
         */
        this.focus = new EventEmitter();
        this.autocomplete = config.get('autocomplete', 'off');
        this.autocorrect = config.get('autocorrect', 'off');
        this._autoFocusAssist = config.get('autoFocusAssist', 'delay');
        this._keyboardHeight = config.getNumber('keyboardHeight');
        this._isTextarea = !!(elementRef.nativeElement.tagName === 'ION-TEXTAREA');
        if (this._isTextarea && _item) {
            _item.setElementClass('item-textarea', true);
        }
        // If not inside content, let's disable all the hacks
        if (!_content) {
            return;
        }
        const blurOnScroll = config.getBoolean('hideCaretOnScroll', false);
        if (blurOnScroll) {
            this._enableHideCaretOnScroll();
        }
        const resizeAssist = config.getBoolean('resizeAssist', false);
        if (resizeAssist) {
            this._keyboardHeight = 60;
            this._enableResizeAssist();
        }
        else {
            this._useAssist = config.getBoolean('scrollAssist', false);
            const usePadding = config.getBoolean('scrollPadding', this._useAssist);
            if (usePadding) {
                this._enableScrollPadding();
            }
        }
    }
    /**
     * \@input {boolean} If true, a clear icon will appear in the input when there is a value. Clicking it clears the input.
     * @return {?}
     */
    get clearInput() {
        return this._clearInput;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set clearInput(val) {
        this._clearInput = (!this._isTextarea && isTrueProperty(val));
    }
    /**
     * \@input {string} The type of control to display. The default type is text.
     * Possible values are: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, or `"url"`.
     * @return {?}
     */
    get type() {
        return (this._isTextarea)
            ? 'text'
            : this._type;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set type(val) {
        this._type = val;
    }
    /**
     * \@input {boolean} If true, the user cannot modify the value.
     * @return {?}
     */
    get readonly() {
        return this._readonly;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set readonly(val) {
        this._readonly = isTrueProperty(val);
    }
    /**
     * \@input {boolean} If true, the value will be cleared after focus upon edit.
     * Defaults to `true` when `type` is `"password"`, `false` for all other types.
     * @return {?}
     */
    get clearOnEdit() {
        return this._clearOnEdit;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set clearOnEdit(val) {
        this._clearOnEdit = isTrueProperty(val);
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() { }
    /**
     * @hidden
     * @return {?}
     */
    ngAfterViewInit() {
        (void 0) /* assert */;
        // By default, password inputs clear after focus when they have content
        if (this.clearOnEdit !== false && this.type === 'password') {
            this.clearOnEdit = true;
        }
        const /** @type {?} */ ionInputEle = this._elementRef.nativeElement;
        const /** @type {?} */ nativeInputEle = this._native.nativeElement;
        // Copy remaining attributes, not handled by ionic/angular
        copyInputAttributes(ionInputEle, nativeInputEle);
        // prevent having tabIndex duplicated
        if (ionInputEle.hasAttribute('tabIndex')) {
            ionInputEle.removeAttribute('tabIndex');
        }
        // handle the autofocus attribute
        if (ionInputEle.hasAttribute('autofocus')) {
            ionInputEle.removeAttribute('autofocus');
            switch (this._autoFocusAssist) {
                case 'immediate':
                    // config says to immediate focus on the input
                    // works best on android devices
                    nativeInputEle.focus();
                    break;
                case 'delay':
                    // config says to chill out a bit and focus on the input after transitions
                    // works best on desktop
                    this._plt.timeout(() => nativeInputEle.focus(), 800);
                    break;
            }
            // traditionally iOS has big issues with autofocus on actual devices
            // autoFocus is disabled by default with the iOS mode config
        }
        // Initialize the input (can start emitting events)
        this._initialize();
        if (this.focus.observers.length > 0) {
            console.warn('(focus) is deprecated in ion-input, use (ionFocus) instead');
        }
        if (this.blur.observers.length > 0) {
            console.warn('(blur) is deprecated in ion-input, use (ionBlur) instead');
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnDestroy() {
        super.ngOnDestroy();
        this._onDestroy.next();
        this._onDestroy = null;
    }
    /**
     * @hidden
     * @return {?}
     */
    initFocus() {
        this.setFocus();
    }
    /**
     * @hidden
     * @return {?}
     */
    setFocus() {
        // let's set focus to the element
        // but only if it does not already have focus
        if (!this.isFocus()) {
            this._native.nativeElement.focus();
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    setBlur() {
        if (this.isFocus()) {
            this._native.nativeElement.blur();
        }
    }
    /**
     * @hidden
     * @param {?} ev
     * @return {?}
     */
    onInput(ev) {
        this.value = ev.target.value;
        // TODO: deprecate this
        this.input.emit(ev);
    }
    /**
     * @hidden
     * @param {?} ev
     * @return {?}
     */
    onBlur(ev) {
        this._fireBlur();
        // TODO: deprecate this (06/07/2017)
        this.blur.emit(ev);
        this._scrollData = null;
        if (this._clearOnEdit && this.hasValue()) {
            this._didBlurAfterEdit = true;
        }
    }
    /**
     * @hidden
     * @param {?} ev
     * @return {?}
     */
    onFocus(ev) {
        this._fireFocus();
        // TODO: deprecate this (06/07/2017)
        this.focus.emit(ev);
    }
    /**
     * @hidden
     * @param {?} ev
     * @return {?}
     */
    onKeydown(ev) {
        if (ev && this._clearOnEdit) {
            this.checkClearOnEdit(ev.target.value);
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    _inputUpdated() {
        super._inputUpdated();
        const /** @type {?} */ inputEle = this._native.nativeElement;
        const /** @type {?} */ value = this._value;
        if (inputEle.value !== value) {
            inputEle.value = value;
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    clearTextInput() {
        this.value = '';
    }
    /**
     * Check if we need to clear the text input if clearOnEdit is enabled
     * @hidden
     * @param {?} _
     * @return {?}
     */
    checkClearOnEdit(_) {
        if (!this._clearOnEdit) {
            return;
        }
        // Did the input value change after it was blurred and edited?
        if (this._didBlurAfterEdit && this.hasValue()) {
            // Clear the input
            this.clearTextInput();
        }
        // Reset the flag
        this._didBlurAfterEdit = false;
    }
    /**
     * @return {?}
     */
    _getScrollData() {
        if (!this._content) {
            return newScrollData();
        }
        // get container of this input, probably an ion-item a few nodes up
        if (this._scrollData) {
            return this._scrollData;
        }
        let /** @type {?} */ ele = this._elementRef.nativeElement;
        ele = (ele.closest('ion-item,[ion-item]')) || ele;
        return this._scrollData = getScrollData(ele.offsetTop, ele.offsetHeight, this._content.getContentDimensions(), this._keyboardHeight, this._plt.height());
    }
    /**
     * @param {?} shouldRelocate
     * @return {?}
     */
    _relocateInput(shouldRelocate) {
        if (this._relocated === shouldRelocate) {
            return;
        }
        const /** @type {?} */ platform = this._plt;
        const /** @type {?} */ componentEle = this.getNativeElement();
        const /** @type {?} */ focusedInputEle = this._native.nativeElement;
        (void 0) /* console.debug */;
        if (shouldRelocate) {
            // this allows for the actual input to receive the focus from
            // the user's touch event, but before it receives focus, it
            // moves the actual input to a location that will not screw
            // up the app's layout, and does not allow the native browser
            // to attempt to scroll the input into place (messing up headers/footers)
            // the cloned input fills the area of where native input should be
            // while the native input fakes out the browser by relocating itself
            // before it receives the actual focus event
            // We hide the focused input (with the visible caret) invisiable by making it scale(0),
            cloneInputComponent(platform, componentEle, focusedInputEle);
            const /** @type {?} */ inputRelativeY = this._getScrollData().inputSafeY;
            // fix for #11817
            const /** @type {?} */ tx = this._plt.isRTL ? 9999 : -9999;
            focusedInputEle.style[platform.Css.transform] = `translate3d(${tx}px,${inputRelativeY}px,0)`;
            focusedInputEle.style.opacity = '0';
        }
        else {
            removeClone(platform, componentEle, focusedInputEle);
        }
        this._relocated = shouldRelocate;
    }
    /**
     * @return {?}
     */
    _enableScrollPadding() {
        (void 0) /* assert */;
        (void 0) /* console.debug */;
        this.ionFocus.subscribe(() => {
            const /** @type {?} */ content = this._content;
            // add padding to the bottom of the scroll view (if needed)
            content.addScrollPadding(this._getScrollData().scrollPadding);
            content.clearScrollPaddingFocusOut();
        });
    }
    /**
     * @return {?}
     */
    _enableHideCaretOnScroll() {
        (void 0) /* assert */;
        const /** @type {?} */ content = this._content;
        (void 0) /* console.debug */;
        content.ionScrollStart
            .takeUntil(this._onDestroy)
            .subscribe(() => scrollHideCaret(true));
        content.ionScrollEnd
            .takeUntil(this._onDestroy)
            .subscribe(() => scrollHideCaret(false));
        this.ionBlur.subscribe(() => this._relocateInput(false));
        const /** @type {?} */ self = this;
        /**
         * @param {?} shouldHideCaret
         * @return {?}
         */
        function scrollHideCaret(shouldHideCaret) {
            // if it does have focus, then do the dom write
            if (self.isFocus()) {
                self._dom.write(() => self._relocateInput(shouldHideCaret));
            }
        }
    }
    /**
     * @return {?}
     */
    _enableResizeAssist() {
        (void 0) /* assert */;
        (void 0) /* console.debug */;
        this.ionFocus.subscribe(() => {
            const /** @type {?} */ scrollData = this._getScrollData();
            if (Math.abs(scrollData.scrollAmount) > 100) {
                this._content.scrollTo(0, scrollData.scrollTo, scrollData.scrollDuration);
            }
        });
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    _pointerStart(ev) {
        (void 0) /* assert */;
        // input cover touchstart
        if (ev.type === 'touchstart') {
            this._isTouch = true;
        }
        if ((this._isTouch || (!this._isTouch && ev.type === 'mousedown')) && this._app.isEnabled()) {
            // remember where the touchstart/mousedown started
            this._coord = pointerCoord(ev);
        }
        (void 0) /* console.debug */;
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    _pointerEnd(ev) {
        (void 0) /* assert */;
        // input cover touchend/mouseup
        (void 0) /* console.debug */;
        if ((this._isTouch && ev.type === 'mouseup') || !this._app.isEnabled()) {
            // the app is actively doing something right now
            // don't try to scroll in the input
            ev.preventDefault();
            ev.stopPropagation();
        }
        else if (this._coord) {
            // get where the touchend/mouseup ended
            var /** @type {?} */ endCoord = pointerCoord(ev);
            // focus this input if the pointer hasn't moved XX pixels
            // and the input doesn't already have focus
            if (!hasPointerMoved(8, this._coord, endCoord) && !this.isFocus()) {
                ev.preventDefault();
                ev.stopPropagation();
                // begin the input focus process
                this._jsSetFocus();
            }
        }
        this._coord = null;
    }
    /**
     * @return {?}
     */
    _jsSetFocus() {
        (void 0) /* assert */;
        // begin the process of setting focus to the inner input element
        const /** @type {?} */ content = this._content;
        (void 0) /* console.debug */;
        if (!content) {
            // not inside of a scroll view, just focus it
            this.setFocus();
        }
        var /** @type {?} */ scrollData = this._getScrollData();
        if (Math.abs(scrollData.scrollAmount) < 4) {
            // the text input is in a safe position that doesn't
            // require it to be scrolled into view, just set focus now
            this.setFocus();
            return;
        }
        // temporarily move the focus to the focus holder so the browser
        // doesn't freak out while it's trying to get the input in place
        // at this point the native text input still does not have focus
        this._relocateInput(true);
        this.setFocus();
        // scroll the input into place
        content.scrollTo(0, scrollData.scrollTo, scrollData.scrollDuration, () => {
            // the scroll view is in the correct position now
            // give the native text input focus
            this._relocateInput(false);
            // ensure this is the focused input
            this.setFocus();
        });
    }
}
TextInput.decorators = [
    { type: Component, args: [{
                selector: 'ion-input,ion-textarea',
                template: '<input #textInput *ngIf="!_isTextarea" class="text-input" ' +
                    '[ngClass]="\'text-input-\' + _mode"' +
                    '(input)="onInput($event)" ' +
                    '(blur)="onBlur($event)" ' +
                    '(focus)="onFocus($event)" ' +
                    '(keydown)="onKeydown($event)" ' +
                    '[type]="_type" ' +
                    '[attr.aria-labelledby]="_labelId" ' +
                    '[attr.min]="min" ' +
                    '[attr.max]="max" ' +
                    '[attr.step]="step" ' +
                    '[attr.autocomplete]="autocomplete" ' +
                    '[attr.autocorrect]="autocorrect" ' +
                    '[placeholder]="placeholder" ' +
                    '[disabled]="_disabled" ' +
                    '[readonly]="_readonly">' +
                    '<textarea #textInput *ngIf="_isTextarea" class="text-input" ' +
                    '[ngClass]="\'text-input-\' + _mode"' +
                    '(input)="onInput($event)" ' +
                    '(blur)="onBlur($event)" ' +
                    '(focus)="onFocus($event)" ' +
                    '(keydown)="onKeydown($event)" ' +
                    '[attr.aria-labelledby]="_labelId" ' +
                    '[attr.autocomplete]="autocomplete" ' +
                    '[attr.autocorrect]="autocorrect" ' +
                    '[placeholder]="placeholder" ' +
                    '[disabled]="_disabled" ' +
                    '[readonly]="_readonly"></textarea>' +
                    '<button ion-button *ngIf="_clearInput" clear class="text-input-clear-icon" ' +
                    'type="button" ' +
                    '(click)="clearTextInput($event)" ' +
                    '(mousedown)="clearTextInput($event)" ' +
                    'tabindex="-1"></button>' +
                    '<div class="input-cover" *ngIf="_useAssist" ' +
                    '(touchstart)="_pointerStart($event)" ' +
                    '(touchend)="_pointerEnd($event)" ' +
                    '(mousedown)="_pointerStart($event)" ' +
                    '(mouseup)="_pointerEnd($event)"></div>',
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                inputs: ['value']
            },] },
];
/**
 * @nocollapse
 */
TextInput.ctorParameters = () => [
    { type: Config, },
    { type: Platform, },
    { type: Form, },
    { type: App, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: Content, decorators: [{ type: Optional },] },
    { type: Item, decorators: [{ type: Optional },] },
    { type: NgControl, decorators: [{ type: Optional },] },
    { type: DomController, },
];
TextInput.propDecorators = {
    'clearInput': [{ type: Input },],
    'type': [{ type: Input },],
    'readonly': [{ type: Input },],
    'clearOnEdit': [{ type: Input },],
    '_native': [{ type: ViewChild, args: ['textInput', { read: ElementRef },] },],
    'autocomplete': [{ type: Input },],
    'autocorrect': [{ type: Input },],
    'placeholder': [{ type: Input },],
    'min': [{ type: Input },],
    'max': [{ type: Input },],
    'step': [{ type: Input },],
    'input': [{ type: Output },],
    'blur': [{ type: Output },],
    'focus': [{ type: Output },],
};
function TextInput_tsickle_Closure_declarations() {
    /** @type {?} */
    TextInput.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    TextInput.ctorParameters;
    /** @type {?} */
    TextInput.propDecorators;
    /** @type {?} */
    TextInput.prototype._autoFocusAssist;
    /** @type {?} */
    TextInput.prototype._clearInput;
    /** @type {?} */
    TextInput.prototype._clearOnEdit;
    /** @type {?} */
    TextInput.prototype._didBlurAfterEdit;
    /** @type {?} */
    TextInput.prototype._readonly;
    /** @type {?} */
    TextInput.prototype._keyboardHeight;
    /** @type {?} */
    TextInput.prototype._type;
    /** @type {?} */
    TextInput.prototype._scrollData;
    /** @type {?} */
    TextInput.prototype._isTextarea;
    /** @type {?} */
    TextInput.prototype._onDestroy;
    /** @type {?} */
    TextInput.prototype._coord;
    /** @type {?} */
    TextInput.prototype._isTouch;
    /** @type {?} */
    TextInput.prototype._useAssist;
    /** @type {?} */
    TextInput.prototype._relocated;
    /**
     * @hidden
     * @type {?}
     */
    TextInput.prototype._native;
    /**
     * \@input {string} Set the input's autocomplete property. Values: `"on"`, `"off"`. Default `"off"`.
     * @type {?}
     */
    TextInput.prototype.autocomplete;
    /**
     * \@input {string} Set the input's autocorrect property. Values: `"on"`, `"off"`. Default `"off"`.
     * @type {?}
     */
    TextInput.prototype.autocorrect;
    /**
     * \@input {string} Instructional text that shows before the input has a value.
     * @type {?}
     */
    TextInput.prototype.placeholder;
    /**
     * \@input {any} The minimum value, which must not be greater than its maximum (max attribute) value.
     * @type {?}
     */
    TextInput.prototype.min;
    /**
     * \@input {any} The maximum value, which must not be less than its minimum (min attribute) value.
     * @type {?}
     */
    TextInput.prototype.max;
    /**
     * \@input {any} Works with the min and max attributes to limit the increments at which a value can be set.
     * @type {?}
     */
    TextInput.prototype.step;
    /**
     * @hidden
     * @type {?}
     */
    TextInput.prototype.input;
    /**
     * @hidden
     * @type {?}
     */
    TextInput.prototype.blur;
    /**
     * @hidden
     * @type {?}
     */
    TextInput.prototype.focus;
    /** @type {?} */
    TextInput.prototype._plt;
    /** @type {?} */
    TextInput.prototype._app;
    /** @type {?} */
    TextInput.prototype._content;
    /** @type {?} */
    TextInput.prototype.ngControl;
    /** @type {?} */
    TextInput.prototype._dom;
}
/**
 * \@name TextArea
 * \@description
 *
 * `ion-textarea` is used for multi-line text inputs. Ionic still
 * uses an actual `<textarea>` HTML element within the component;
 * however, with Ionic wrapping the native HTML text area element, Ionic
 * is able to better handle the user experience and interactivity.
 *
 * Note that `<ion-textarea>` must load its value from the `value` or
 * `[(ngModel)]` attribute. Unlike the native `<textarea>` element,
 * `<ion-textarea>` does not support loading its value from the
 * textarea's inner content.
 *
 * When requiring only a single-line text input, we recommend using
 * `<ion-input>` instead.
 *
 * \@usage
 * ```html
 *  <ion-item>
 *    <ion-label>Comments</ion-label>
 *    <ion-textarea></ion-textarea>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-label stacked>Message</ion-label>
 *    <ion-textarea [(ngModel)]="msg"></ion-textarea>
 *  </ion-item>
 *
 *  <ion-item>
 *    <ion-label floating>Description</ion-label>
 *    <ion-textarea></ion-textarea>
 *  </ion-item>
 *
 * <ion-item>
 *    <ion-label>Long Description</ion-label>
 *    <ion-textarea rows="6" placeholder="enter long description here..."></ion-textarea>
 *  </ion-item>
 * ```
 *
 * \@demo /docs/demos/src/textarea/
 */
const SCROLL_ASSIST_SPEED = 0.3;
/**
 * @return {?}
 */
function newScrollData() {
    return {
        scrollAmount: 0,
        scrollTo: 0,
        scrollPadding: 0,
        scrollDuration: 0,
        inputSafeY: 0
    };
}
/**
 * @hidden
 * @param {?} inputOffsetTop
 * @param {?} inputOffsetHeight
 * @param {?} scrollViewDimensions
 * @param {?} keyboardHeight
 * @param {?} plaformHeight
 * @return {?}
 */
export function getScrollData(inputOffsetTop, inputOffsetHeight, scrollViewDimensions, keyboardHeight, plaformHeight) {
    // compute input's Y values relative to the body
    const /** @type {?} */ inputTop = (inputOffsetTop + scrollViewDimensions.contentTop - scrollViewDimensions.scrollTop);
    const /** @type {?} */ inputBottom = (inputTop + inputOffsetHeight);
    // compute the safe area which is the viewable content area when the soft keyboard is up
    const /** @type {?} */ safeAreaTop = scrollViewDimensions.contentTop;
    const /** @type {?} */ safeAreaHeight = (plaformHeight - keyboardHeight - safeAreaTop) / 2;
    const /** @type {?} */ safeAreaBottom = safeAreaTop + safeAreaHeight;
    // figure out if each edge of teh input is within the safe area
    const /** @type {?} */ inputTopWithinSafeArea = (inputTop >= safeAreaTop && inputTop <= safeAreaBottom);
    const /** @type {?} */ inputTopAboveSafeArea = (inputTop < safeAreaTop);
    const /** @type {?} */ inputTopBelowSafeArea = (inputTop > safeAreaBottom);
    const /** @type {?} */ inputBottomWithinSafeArea = (inputBottom >= safeAreaTop && inputBottom <= safeAreaBottom);
    const /** @type {?} */ inputBottomBelowSafeArea = (inputBottom > safeAreaBottom);
    /*
    Text Input Scroll To Scenarios
    ---------------------------------------
    1) Input top within safe area, bottom within safe area
    2) Input top within safe area, bottom below safe area, room to scroll
    3) Input top above safe area, bottom within safe area, room to scroll
    4) Input top below safe area, no room to scroll, input smaller than safe area
    5) Input top within safe area, bottom below safe area, no room to scroll, input smaller than safe area
    6) Input top within safe area, bottom below safe area, no room to scroll, input larger than safe area
    7) Input top below safe area, no room to scroll, input larger than safe area
    */
    const /** @type {?} */ scrollData = newScrollData();
    if (inputTopWithinSafeArea && inputBottomWithinSafeArea) {
        // Input top within safe area, bottom within safe area
        // no need to scroll to a position, it's good as-is
        return scrollData;
    }
    // looks like we'll have to do some auto-scrolling
    if (inputTopBelowSafeArea || inputBottomBelowSafeArea || inputTopAboveSafeArea) {
        // Input top or bottom below safe area
        // auto scroll the input up so at least the top of it shows
        if (safeAreaHeight > inputOffsetHeight) {
            // safe area height is taller than the input height, so we
            // can bring up the input just enough to show the input bottom
            scrollData.scrollAmount = Math.round(safeAreaBottom - inputBottom);
        }
        else {
            // safe area height is smaller than the input height, so we can
            // only scroll it up so the input top is at the top of the safe area
            // however the input bottom will be below the safe area
            scrollData.scrollAmount = Math.round(safeAreaTop - inputTop);
        }
        scrollData.inputSafeY = -(inputTop - safeAreaTop) + 4;
        if (inputTopAboveSafeArea && scrollData.scrollAmount > inputOffsetHeight) {
            // the input top is above the safe area and we're already scrolling it into place
            // don't let it scroll more than the height of the input
            scrollData.scrollAmount = inputOffsetHeight;
        }
    }
    // figure out where it should scroll to for the best position to the input
    scrollData.scrollTo = (scrollViewDimensions.scrollTop - scrollData.scrollAmount);
    // when auto-scrolling, there also needs to be enough
    // content padding at the bottom of the scroll view
    // always add scroll padding when a text input has focus
    // this allows for the content to scroll above of the keyboard
    // content behind the keyboard would be blank
    // some cases may not need it, but when jumping around it's best
    // to have the padding already rendered so there's no jank
    scrollData.scrollPadding = keyboardHeight;
    // calculate animation duration
    const /** @type {?} */ distance = Math.abs(scrollData.scrollAmount);
    const /** @type {?} */ duration = distance / SCROLL_ASSIST_SPEED;
    scrollData.scrollDuration = Math.min(400, Math.max(150, duration));
    return scrollData;
}
/**
 * @param {?} plt
 * @param {?} srcComponentEle
 * @param {?} srcNativeInputEle
 * @return {?}
 */
function cloneInputComponent(plt, srcComponentEle, srcNativeInputEle) {
    // Make sure we kill all the clones before creating new ones
    // It is a defensive, removeClone() should do nothing
    // removeClone(plt, srcComponentEle, srcNativeInputEle);
    (void 0) /* assert */;
    // given a native <input> or <textarea> element
    // find its parent wrapping component like <ion-input> or <ion-textarea>
    // then clone the entire component
    if (srcComponentEle) {
        // DOM READ
        var /** @type {?} */ srcTop = srcComponentEle.offsetTop;
        var /** @type {?} */ srcLeft = srcComponentEle.offsetLeft;
        var /** @type {?} */ srcWidth = srcComponentEle.offsetWidth;
        var /** @type {?} */ srcHeight = srcComponentEle.offsetHeight;
        // DOM WRITE
        // not using deep clone so we don't pull in unnecessary nodes
        var /** @type {?} */ clonedComponentEle = (srcComponentEle.cloneNode(false));
        var /** @type {?} */ clonedStyle = clonedComponentEle.style;
        clonedComponentEle.classList.add('cloned-input');
        clonedComponentEle.setAttribute('aria-hidden', 'true');
        clonedStyle.pointerEvents = 'none';
        clonedStyle.position = 'absolute';
        clonedStyle.top = srcTop + 'px';
        clonedStyle.left = srcLeft + 'px';
        clonedStyle.width = srcWidth + 'px';
        clonedStyle.height = srcHeight + 'px';
        var /** @type {?} */ clonedNativeInputEle = (srcNativeInputEle.cloneNode(false));
        clonedNativeInputEle.value = srcNativeInputEle.value;
        clonedNativeInputEle.tabIndex = -1;
        clonedComponentEle.appendChild(clonedNativeInputEle);
        srcComponentEle.parentNode.appendChild(clonedComponentEle);
        srcComponentEle.style.pointerEvents = 'none';
    }
    ((srcNativeInputEle.style))[plt.Css.transform] = 'scale(0)';
}
/**
 * @param {?} plt
 * @param {?} srcComponentEle
 * @param {?} srcNativeInputEle
 * @return {?}
 */
function removeClone(plt, srcComponentEle, srcNativeInputEle) {
    if (srcComponentEle && srcComponentEle.parentElement) {
        var /** @type {?} */ clonedInputEles = srcComponentEle.parentElement.querySelectorAll('.cloned-input');
        for (var /** @type {?} */ i = 0; i < clonedInputEles.length; i++) {
            clonedInputEles[i].parentNode.removeChild(clonedInputEles[i]);
        }
        srcComponentEle.style.pointerEvents = '';
    }
    ((srcNativeInputEle.style))[plt.Css.transform] = '';
    srcNativeInputEle.style.opacity = '';
}
//# sourceMappingURL=input.js.map