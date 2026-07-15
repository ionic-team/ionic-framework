import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, HostListener, forwardRef, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-datetime.js';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';
const DATETIME_INPUTS = [
    'cancelText',
    'clearText',
    'color',
    'dayValues',
    'disabled',
    'doneText',
    'firstDayOfWeek',
    'formatOptions',
    'highlightedDates',
    'hourCycle',
    'hourValues',
    'isDateEnabled',
    'locale',
    'max',
    'min',
    'minuteValues',
    'mode',
    'monthValues',
    'multiple',
    'name',
    'preferWheel',
    'presentation',
    'readonly',
    'showAdjacentDays',
    'showClearButton',
    'showDefaultButtons',
    'showDefaultTimeLabel',
    'showDefaultTitle',
    'size',
    'titleSelectedDatesFormatter',
    'value',
    'yearValues',
];
/**
 * Pulling the provider into an object and using PURE works
 * around an ng-packagr issue that causes
 * components with multiple decorators and
 * a provider to be re-assigned. This re-assignment
 * is not supported by Webpack and causes treeshaking
 * to not work on these kinds of components.

 */
const accessorProvider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: /*@__PURE__*/ forwardRef(() => IonDatetime),
    multi: true,
};
let IonDatetime = class IonDatetime extends ValueAccessor {
    constructor(c, r, z, injector) {
        super(injector, r);
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ['ionCancel', 'ionChange', 'ionFocus', 'ionBlur']);
    }
    handleIonChange(el) {
        this.handleValueChange(el, el.value);
    }
};
__decorate([
    HostListener('ionChange', ['$event.target'])
], IonDatetime.prototype, "handleIonChange", null);
IonDatetime = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineCustomElement,
        inputs: DATETIME_INPUTS,
        methods: ['confirm', 'reset', 'cancel'],
    }),
    Component({
        selector: 'ion-datetime',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: DATETIME_INPUTS,
        providers: [accessorProvider],
        standalone: true,
    })
], IonDatetime);
export { IonDatetime };
