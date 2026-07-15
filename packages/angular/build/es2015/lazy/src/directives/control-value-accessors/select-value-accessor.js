import { __decorate } from "tslib";
import { Directive, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/common';
let SelectValueAccessorDirective = class SelectValueAccessorDirective extends ValueAccessor {
    constructor(injector, el) {
        super(injector, el);
    }
    // Bind `$event` and cast `.target` in the body rather than `['$event.target']`:
    // this directive's multi-element selector makes Angular 22's stricter host-binding
    // type checking infer `$event` as the DOM `Event` (target: `EventTarget | null`),
    // not the concrete element. The single-element standalone CVAs keep `['$event.target']`.
    _handleChangeEvent(ev) {
        const el = ev.target;
        this.handleValueChange(el, el.value);
    }
};
__decorate([
    HostListener('ionChange', ['$event'])
], SelectValueAccessorDirective.prototype, "_handleChangeEvent", null);
SelectValueAccessorDirective = __decorate([
    Directive({
        standalone: false,
        /* tslint:disable-next-line:directive-selector */
        selector: 'ion-select, ion-radio-group, ion-segment, ion-datetime',
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: SelectValueAccessorDirective,
                multi: true,
            },
        ],
    })
], SelectValueAccessorDirective);
export { SelectValueAccessorDirective };
