import { __decorate } from "tslib";
import { Directive, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/common';
let NumericValueAccessorDirective = class NumericValueAccessorDirective extends ValueAccessor {
    constructor(injector, el) {
        super(injector, el);
        this.el = el;
    }
    // Bind `$event` and cast `.target` in the body rather than `['$event.target']`:
    // this directive's multi-element selector makes Angular 22's stricter host-binding
    // type checking infer `$event` as the DOM `Event` (target: `EventTarget | null`),
    // not the concrete element. The single-element standalone CVAs keep `['$event.target']`.
    handleInputEvent(ev) {
        const el = ev.target;
        this.handleValueChange(el, el.value);
    }
    registerOnChange(fn) {
        if (this.el.nativeElement.tagName === 'ION-INPUT' || this.el.nativeElement.tagName === 'ION-INPUT-OTP') {
            super.registerOnChange((value) => {
                fn(value === '' ? null : parseFloat(value));
            });
        }
        else {
            super.registerOnChange(fn);
        }
    }
};
__decorate([
    HostListener('ionInput', ['$event'])
], NumericValueAccessorDirective.prototype, "handleInputEvent", null);
NumericValueAccessorDirective = __decorate([
    Directive({
        standalone: false,
        selector: 'ion-input[type=number],ion-input-otp:not([type=text]),ion-range',
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: NumericValueAccessorDirective,
                multi: true,
            },
        ],
    })
], NumericValueAccessorDirective);
export { NumericValueAccessorDirective };
