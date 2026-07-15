import { __decorate } from "tslib";
import { Directive, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/common';
let TextValueAccessorDirective = class TextValueAccessorDirective extends ValueAccessor {
    constructor(injector, el) {
        super(injector, el);
    }
    // Bind `$event` and cast `.target` in the body rather than `['$event.target']`:
    // this directive's multi-element selector makes Angular 22's stricter host-binding
    // type checking infer `$event` as the DOM `Event` (target: `EventTarget | null`),
    // not the concrete element. The single-element standalone CVAs keep `['$event.target']`.
    _handleInputEvent(ev) {
        const el = ev.target;
        this.handleValueChange(el, el.value);
    }
};
__decorate([
    HostListener('ionInput', ['$event'])
], TextValueAccessorDirective.prototype, "_handleInputEvent", null);
TextValueAccessorDirective = __decorate([
    Directive({
        standalone: false,
        selector: 'ion-input:not([type=number]),ion-input-otp[type=text],ion-textarea,ion-searchbar',
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: TextValueAccessorDirective,
                multi: true,
            },
        ],
    })
], TextValueAccessorDirective);
export { TextValueAccessorDirective };
