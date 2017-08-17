import { ElementRef, EventEmitter, Renderer } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Config } from '../../config/config';
import { BaseInput } from '../../util/base-input';
import { TimeoutDebouncer } from '../../util/debouncer';
import { Platform } from '../../platform/platform';
/**
 * @name Searchbar
 * @module ionic
 * @description
 * Manages the display of a Searchbar which can be used to search or filter items.
 *
 * @usage
 * ```html
 * <ion-searchbar
 *   [(ngModel)]="myInput"
 *   [showCancelButton]="shouldShowCancel"
 *   (ionInput)="onInput($event)"
 *   (ionCancel)="onCancel($event)">
 * </ion-searchbar>
 * ```
 *
 * @demo /docs/demos/src/searchbar/
 * @see {@link /docs/components#searchbar Searchbar Component Docs}
 */
export declare class Searchbar extends BaseInput<string> {
    private _plt;
    _shouldBlur: boolean;
    _shouldAlignLeft: boolean;
    _isCancelVisible: boolean;
    _spellcheck: boolean;
    _autocomplete: string;
    _autocorrect: string;
    _isActive: boolean;
    _showCancelButton: boolean;
    _animated: boolean;
    _inputDebouncer: TimeoutDebouncer;
    /**
     * @input {string} Set the the cancel button text. Default: `"Cancel"`.
     */
    cancelButtonText: string;
    /**
     * @input {boolean} If true, show the cancel button. Default `false`.
     */
    showCancelButton: boolean;
    /**
     * @input {number} How long, in milliseconds, to wait to trigger the `ionInput` event after each keystroke. Default `250`.
     */
    debounce: number;
    /**
     * @input {string} Set the input's placeholder. Default `"Search"`.
     */
    placeholder: string;
    /**
     * @input {string} Set the input's autocomplete property. Values: `"on"`, `"off"`. Default `"off"`.
     */
    autocomplete: string;
    /**
     * @input {string} Set the input's autocorrect property. Values: `"on"`, `"off"`. Default `"off"`.
     */
    autocorrect: string;
    /**
     * @input {string|boolean} Set the input's spellcheck property. Values: `true`, `false`. Default `false`.
     */
    spellcheck: string | boolean;
    /**
     * @input {string} Set the type of the input. Values: `"text"`, `"password"`, `"email"`, `"number"`, `"search"`, `"tel"`, `"url"`. Default `"search"`.
     */
    type: string;
    /**
     * @input {boolean} If true, enable searchbar animation. Default `false`.
     */
    animated: boolean;
    /**
     * @output {event} Emitted when the Searchbar input has changed, including when it's cleared.
     */
    ionInput: EventEmitter<UIEvent>;
    /**
     * @output {event} Emitted when the cancel button is clicked.
     */
    ionCancel: EventEmitter<UIEvent>;
    /**
     * @output {event} Emitted when the clear input button is clicked.
     */
    ionClear: EventEmitter<UIEvent>;
    constructor(config: Config, _plt: Platform, elementRef: ElementRef, renderer: Renderer, ngControl: NgControl);
    _searchbarInput: ElementRef;
    _searchbarIcon: ElementRef;
    _cancelButton: ElementRef;
    /**
     * @hidden
     * On Initialization check for attributes
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    _inputUpdated(): void;
    /**
     * @hidden
     * Positions the input search icon, placeholder, and the cancel button
     * based on the input value and if it is focused. (ios only)
     */
    positionElements(): void;
    positionPlaceholder(): void;
    /**
     * @hidden
     * Show the iOS Cancel button on focus, hide it offscreen otherwise
     */
    positionCancelButton(): void;
    /**
     * @hidden
     * Update the Searchbar input value when the input changes
     */
    inputChanged(ev: any): void;
    /**
     * @hidden
     * Sets the Searchbar to focused and active on input focus.
     */
    inputFocused(): void;
    /**
     * @hidden
     * Sets the Searchbar to not focused and checks if it should align left
     * based on whether there is a value in the searchbar or not.
     */
    inputBlurred(): void;
    /**
     * @hidden
     * Clears the input field and triggers the control change.
     */
    clearInput(ev: UIEvent): void;
    /**
     * @hidden
     * Clears the input field and tells the input to blur since
     * the clearInput function doesn't want the input to blur
     * then calls the custom cancel function if the user passed one in.
     */
    cancelSearchbar(ev: UIEvent): void;
    setFocus(): void;
}
