import { ElementRef, EventEmitter } from '@angular/core';
/**
 * @name Option
 * @description
 * `ion-option` is a child component of `ion-select`. Similar to the native option element, `ion-option` can take a value and a selected property.
 *
 * @demo /docs/demos/src/select/
 */
export declare class Option {
    private _elementRef;
    _selected: boolean;
    _disabled: boolean;
    _value: any;
    /**
     * @input {boolean} If true, the user cannot interact with this element.
     */
    disabled: boolean;
    /**
     * @input {boolean} If true, the element is selected.
     */
    selected: boolean;
    /**
     * @input {any} The value of the option.
     */
    value: any;
    /**
     * @output {any} Event to evaluate when option is selected.
     */
    ionSelect: EventEmitter<any>;
    constructor(_elementRef: ElementRef);
    /**
     * @hidden
     */
    readonly text: any;
}
