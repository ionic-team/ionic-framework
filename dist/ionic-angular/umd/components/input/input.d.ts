import { ElementRef, EventEmitter, Renderer } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { Content, ContentDimensions } from '../content/content';
import { DomController } from '../../platform/dom-controller';
import { Form, IonicFormInput } from '../../util/form';
import { BaseInput } from '../../util/base-input';
import { Item } from '../item/item';
import { Platform } from '../../platform/platform';
/**
 * @name Input
 * @description
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
 * @usage
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
 * @demo /docs/demos/src/input/
 */
export declare class TextInput extends BaseInput<string> implements IonicFormInput {
    private _plt;
    private _app;
    private _content;
    ngControl: NgControl;
    private _dom;
    _autoFocusAssist: string;
    _clearInput: boolean;
    _clearOnEdit: boolean;
    _didBlurAfterEdit: boolean;
    _readonly: boolean;
    _keyboardHeight: number;
    _type: string;
    _scrollData: ScrollData;
    _isTextarea: boolean;
    _onDestroy: Subject<void>;
    _coord: any;
    _isTouch: boolean;
    _useAssist: boolean;
    _relocated: boolean;
    /**
     * @input {boolean} If true, a clear icon will appear in the input when there is a value. Clicking it clears the input.
     */
    clearInput: any;
    /**
     * @input {string} The type of control to display. The default type is text.
     * Possible values are: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, or `"url"`.
     */
    type: any;
    /**
     * @input {boolean} If true, the user cannot modify the value.
     */
    readonly: boolean;
    /**
     * @input {boolean} If true, the value will be cleared after focus upon edit.
     * Defaults to `true` when `type` is `"password"`, `false` for all other types.
     */
    clearOnEdit: any;
    /**
     * @hidden
     */
    _native: ElementRef;
    /**
     * @input {string} Set the input's autocomplete property. Values: `"on"`, `"off"`. Default `"off"`.
     */
    autocomplete: string;
    /**
     * @input {string} Set the input's autocorrect property. Values: `"on"`, `"off"`. Default `"off"`.
     */
    autocorrect: string;
    /**
     * @input {string} Instructional text that shows before the input has a value.
     */
    placeholder: string;
    /**
     * @input {any} The minimum value, which must not be greater than its maximum (max attribute) value.
     */
    min: number | string;
    /**
     * @input {any} The maximum value, which must not be less than its minimum (min attribute) value.
     */
    max: number | string;
    /**
     * @input {any} Works with the min and max attributes to limit the increments at which a value can be set.
     */
    step: number | string;
    /**
     * @hidden
     */
    input: EventEmitter<UIEvent>;
    /**
     * @hidden
     */
    blur: EventEmitter<UIEvent>;
    /**
     * @hidden
     */
    focus: EventEmitter<UIEvent>;
    constructor(config: Config, _plt: Platform, _form: Form, _app: App, elementRef: ElementRef, renderer: Renderer, _content: Content, _item: Item, ngControl: NgControl, _dom: DomController);
    ngAfterContentInit(): void;
    /**
     * @hidden
     */
    ngAfterViewInit(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    initFocus(): void;
    /**
     * @hidden
     */
    setFocus(): void;
    /**
     * @hidden
     */
    setBlur(): void;
    /**
     * @hidden
     */
    onInput(ev: any): void;
    /**
     * @hidden
     */
    onBlur(ev: UIEvent): void;
    /**
     * @hidden
     */
    onFocus(ev: UIEvent): void;
    /**
     * @hidden
     */
    onKeydown(ev: any): void;
    /**
     * @hidden
     */
    _inputUpdated(): void;
    /**
     * @hidden
     */
    clearTextInput(): void;
    /**
    * Check if we need to clear the text input if clearOnEdit is enabled
    * @hidden
    */
    checkClearOnEdit(_: string): void;
    _getScrollData(): ScrollData;
    _relocateInput(shouldRelocate: boolean): void;
    _enableScrollPadding(): void;
    _enableHideCaretOnScroll(): void;
    _enableResizeAssist(): void;
    _pointerStart(ev: UIEvent): void;
    _pointerEnd(ev: UIEvent): void;
    _jsSetFocus(): void;
}
/**
 * @hidden
 */
export declare function getScrollData(inputOffsetTop: number, inputOffsetHeight: number, scrollViewDimensions: ContentDimensions, keyboardHeight: number, plaformHeight: number): ScrollData;
export interface ScrollData {
    scrollAmount: number;
    scrollTo: number;
    scrollPadding: number;
    scrollDuration: number;
    inputSafeY: number;
}
