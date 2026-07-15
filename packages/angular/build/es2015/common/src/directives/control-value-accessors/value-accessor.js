import { __decorate } from "tslib";
import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { raf } from '../../utils/util';
// TODO(FW-2827): types
let ValueAccessor = class ValueAccessor {
    constructor(injector, elementRef) {
        this.injector = injector;
        this.elementRef = elementRef;
        this.onChange = () => {
            /**/
        };
        this.onTouched = () => {
            /**/
        };
    }
    writeValue(value) {
        this.elementRef.nativeElement.value = this.lastValue = value;
        setIonicClasses(this.elementRef);
    }
    /**
     * Notifies the ControlValueAccessor of a change in the value of the control.
     *
     * This is called by each of the ValueAccessor directives when we want to update
     * the status and validity of the form control. For example with text components this
     * is called when the ionInput event is fired. For select components this is called
     * when the ionChange event is fired.
     *
     * This also updates the Ionic form status classes on the element.
     *
     * @param el The component element.
     * @param value The new value of the control.
     */
    handleValueChange(el, value) {
        if (el === this.elementRef.nativeElement) {
            if (value !== this.lastValue) {
                this.lastValue = value;
                this.onChange(value);
            }
            setIonicClasses(this.elementRef);
        }
    }
    _handleBlurEvent(el) {
        if (el === this.elementRef.nativeElement) {
            this.onTouched();
            setIonicClasses(this.elementRef);
            // When ion-radio is blurred, el and this.elementRef.nativeElement are
            // different so we need to check if the closest ion-radio-group is the same
            // as this.elementRef.nativeElement and if so, we need to mark the radio group
            // as touched
        }
        else if (el.closest('ion-radio-group') === this.elementRef.nativeElement) {
            this.onTouched();
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.elementRef.nativeElement.disabled = isDisabled;
    }
    ngOnDestroy() {
        if (this.statusChanges) {
            this.statusChanges.unsubscribe();
        }
    }
    ngAfterViewInit() {
        let ngControl;
        try {
            ngControl = this.injector.get(NgControl);
        }
        catch (_a) {
            /* No FormControl or ngModel binding */
        }
        if (!ngControl) {
            return;
        }
        // Listen for changes in validity, disabled, or pending states
        if (ngControl.statusChanges) {
            this.statusChanges = ngControl.statusChanges.subscribe(() => setIonicClasses(this.elementRef));
        }
        /**
         * TODO FW-2787: Remove this in favor of https://github.com/angular/angular/issues/10887
         * whenever it is implemented.
         */
        const formControl = ngControl.control;
        if (formControl) {
            const methodsToPatch = ['markAsTouched', 'markAllAsTouched', 'markAsUntouched', 'markAsDirty', 'markAsPristine'];
            methodsToPatch.forEach((method) => {
                if (typeof formControl[method] !== 'undefined') {
                    const oldFn = formControl[method].bind(formControl);
                    formControl[method] = (...params) => {
                        oldFn(...params);
                        setIonicClasses(this.elementRef);
                    };
                }
            });
        }
    }
};
__decorate([
    HostListener('ionBlur', ['$event.target'])
], ValueAccessor.prototype, "_handleBlurEvent", null);
ValueAccessor = __decorate([
    Directive()
], ValueAccessor);
export { ValueAccessor };
export const setIonicClasses = (element) => {
    raf(() => {
        const input = element.nativeElement;
        const hasValue = input.value != null && input.value.toString().length > 0;
        const classes = getClasses(input);
        setClasses(input, classes);
        const item = input.closest('ion-item');
        if (item) {
            if (hasValue) {
                setClasses(item, [...classes, 'item-has-value']);
            }
            else {
                setClasses(item, classes);
            }
        }
    });
};
const getClasses = (element) => {
    const classList = element.classList;
    const classes = [];
    for (let i = 0; i < classList.length; i++) {
        const item = classList.item(i);
        if (item !== null && startsWith(item, 'ng-')) {
            classes.push(`ion-${item.substring(3)}`);
        }
    }
    return classes;
};
const setClasses = (element, classes) => {
    const classList = element.classList;
    classList.remove('ion-valid', 'ion-invalid', 'ion-touched', 'ion-untouched', 'ion-dirty', 'ion-pristine');
    classList.add(...classes);
};
const startsWith = (input, search) => {
    return input.substring(0, search.length) === search;
};
