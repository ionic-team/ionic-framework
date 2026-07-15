import { __decorate } from "tslib";
import { Directive, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor, setIonicClasses } from '@ionic/angular/common';
let BooleanValueAccessorDirective = class BooleanValueAccessorDirective extends ValueAccessor {
    constructor(injector, el) {
        super(injector, el);
    }
    writeValue(value) {
        this.elementRef.nativeElement.checked = this.lastValue = value;
        setIonicClasses(this.elementRef);
    }
    // Bind `$event` and cast `.target` in the body rather than `['$event.target']`:
    // this directive's multi-element selector makes Angular 22's stricter host-binding
    // type checking infer `$event` as the DOM `Event` (target: `EventTarget | null`),
    // not the concrete element. The single-element standalone CVAs keep `['$event.target']`.
    _handleIonChange(ev) {
        const el = ev.target;
        this.handleValueChange(el, el.checked);
    }
};
__decorate([
    HostListener('ionChange', ['$event'])
], BooleanValueAccessorDirective.prototype, "_handleIonChange", null);
BooleanValueAccessorDirective = __decorate([
    Directive({
        standalone: false,
        selector: 'ion-checkbox,ion-toggle',
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: BooleanValueAccessorDirective,
                multi: true,
            },
        ],
    })
], BooleanValueAccessorDirective);
export { BooleanValueAccessorDirective };
