import { ChangeDetectorRef, ContentChild, Directive, ElementRef, EventEmitter, Input, Output, Renderer } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ListHeader } from '../list/list-header';
import { isCheckedProperty, isTrueProperty } from '../../util/util';
/**
 * \@name RadioGroup
 * \@description
 * A radio group is a group of [radio buttons](../RadioButton). It allows
 * a user to select at most one radio button from a set. Checking one radio
 * button that belongs to a radio group unchecks any previous checked
 * radio button within the same group.
 *
 * See the [Angular Forms Docs](https://angular.io/docs/ts/latest/guide/forms.html)
 * for more information on forms and inputs.
 *
 * \@usage
 * ```html
 * <ion-list radio-group [(ngModel)]="autoManufacturers">
 *
 *   <ion-list-header>
 *     Auto Manufacturers
 *   </ion-list-header>
 *
 *   <ion-item>
 *     <ion-label>Cord</ion-label>
 *     <ion-radio value="cord"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Duesenberg</ion-label>
 *     <ion-radio value="duesenberg"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Hudson</ion-label>
 *     <ion-radio value="hudson"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Packard</ion-label>
 *     <ion-radio value="packard"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Studebaker</ion-label>
 *     <ion-radio value="studebaker"></ion-radio>
 *   </ion-item>
 *
 * </ion-list>
 * ```
 *
 * \@demo /docs/demos/src/radio/
 * @see {\@link /docs/components#radio Radio Component Docs}
 * @see {\@link ../RadioButton RadioButton API Docs}
 */
export class RadioGroup {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     * @param {?} _cd
     */
    constructor(_renderer, _elementRef, _cd) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._cd = _cd;
        /**
         * \@internal
         */
        this._disabled = false;
        /**
         * @hidden
         */
        this._btns = [];
        /**
         * @hidden
         */
        this._ids = -1;
        /**
         * @hidden
         */
        this._init = false;
        /**
         * \@output {any} Emitted when the selected button has changed.
         */
        this.ionChange = new EventEmitter();
        this.id = ++radioGroupIds;
    }
    /**
     * \@input {boolean} If true, the user cannot interact with any of the buttons in the group.
     * @return {?}
     */
    get disabled() {
        return this._disabled;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    set disabled(val) {
        this._disabled = isTrueProperty(val);
    }
    /**
     * @hidden
     * @return {?}
     */
    ngAfterContentInit() {
        let /** @type {?} */ activeButton = this._btns.find(b => b.checked);
        if (activeButton) {
            this._setActive(activeButton);
        }
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    writeValue(val) {
        (void 0) /* console.debug */;
        this.value = val;
        if (this._init) {
            this._update();
            this.onTouched();
            this.ionChange.emit(val);
        }
        this._init = true;
    }
    /**
     * @hidden
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this._fn = fn;
        this.onChange = (val) => {
            // onChange used when there's an formControlName
            (void 0) /* console.debug */;
            fn(val);
            this.value = val;
            this._update();
            this.onTouched();
            this.ionChange.emit(val);
        };
    }
    /**
     * @hidden
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @hidden
     * @return {?}
     */
    _update() {
        // loop through each of the radiobuttons
        let /** @type {?} */ hasChecked = false;
        this._btns.forEach(radioButton => {
            // check this radiobutton if its value is
            // the same as the radiogroups value
            radioButton.checked = isCheckedProperty(this.value, radioButton.value) && !hasChecked;
            if (radioButton.checked) {
                // if this button is checked, then set it as
                // the radiogroup's active descendant
                this._setActive(radioButton);
                hasChecked = true;
            }
        });
    }
    /**
     * @hidden
     * @param {?} radioButton
     * @return {?}
     */
    _setActive(radioButton) {
        this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-activedescendant', radioButton.id);
    }
    /**
     * @hidden
     * @param {?} button
     * @return {?}
     */
    add(button) {
        this._btns.push(button);
        // listen for radiobutton select events
        button.ionSelect.subscribe((val) => {
            // this radiobutton has been selected
            this.onChange(val);
        });
        return this.id + '-' + (++this._ids);
    }
    /**
     * @hidden
     * @param {?} button
     * @return {?}
     */
    remove(button) {
        let /** @type {?} */ index = this._btns.indexOf(button);
        if (index > -1) {
            if (button.value === this.value) {
                this.value = null;
            }
            this._btns.splice(index, 1);
        }
    }
    /**
     * @hidden
     * @param {?} header
     * @return {?}
     */
    set _header(header) {
        if (header) {
            if (!header.id) {
                header.id = 'rg-hdr-' + this.id;
            }
            this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-describedby', header.id);
        }
    }
    /**
     * @hidden
     * @param {?} val
     * @return {?}
     */
    onChange(val) {
        // onChange used when there is not an formControlName
        (void 0) /* console.debug */;
        this.value = val;
        this._update();
        this.onTouched();
        this.ionChange.emit(val);
        this._cd.detectChanges();
    }
    /**
     * @hidden
     * @return {?}
     */
    onTouched() { }
    /**
     * @hidden
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
}
RadioGroup.decorators = [
    { type: Directive, args: [{
                selector: '[radio-group]',
                host: {
                    'role': 'radiogroup'
                },
                providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: RadioGroup, multi: true }],
            },] },
];
/**
 * @nocollapse
 */
RadioGroup.ctorParameters = () => [
    { type: Renderer, },
    { type: ElementRef, },
    { type: ChangeDetectorRef, },
];
RadioGroup.propDecorators = {
    'disabled': [{ type: Input },],
    'ionChange': [{ type: Output },],
    '_header': [{ type: ContentChild, args: [ListHeader,] },],
};
function RadioGroup_tsickle_Closure_declarations() {
    /** @type {?} */
    RadioGroup.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    RadioGroup.ctorParameters;
    /** @type {?} */
    RadioGroup.propDecorators;
    /**
     * \@internal
     * @type {?}
     */
    RadioGroup.prototype._disabled;
    /**
     * @hidden
     * @type {?}
     */
    RadioGroup.prototype._btns;
    /**
     * @hidden
     * @type {?}
     */
    RadioGroup.prototype._fn;
    /**
     * @hidden
     * @type {?}
     */
    RadioGroup.prototype._ids;
    /**
     * @hidden
     * @type {?}
     */
    RadioGroup.prototype._init;
    /**
     * @hidden
     * @type {?}
     */
    RadioGroup.prototype.value;
    /**
     * @hidden
     * @type {?}
     */
    RadioGroup.prototype.id;
    /**
     * \@output {any} Emitted when the selected button has changed.
     * @type {?}
     */
    RadioGroup.prototype.ionChange;
    /** @type {?} */
    RadioGroup.prototype._renderer;
    /** @type {?} */
    RadioGroup.prototype._elementRef;
    /** @type {?} */
    RadioGroup.prototype._cd;
}
let /** @type {?} */ radioGroupIds = -1;
//# sourceMappingURL=radio-group.js.map