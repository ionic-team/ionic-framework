import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, HostListener, forwardRef, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-input-otp.js';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';
const INPUT_OTP_INPUTS = [
    'autocapitalize',
    'color',
    'disabled',
    'fill',
    'inputmode',
    'length',
    'pattern',
    'readonly',
    'separators',
    'shape',
    'size',
    'type',
    'value',
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
    useExisting: /*@__PURE__*/ forwardRef(() => IonInputOtp),
    multi: true,
};
let IonInputOtp = class IonInputOtp extends ValueAccessor {
    constructor(c, r, z, injector) {
        super(injector, r);
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ['ionInput', 'ionChange', 'ionComplete', 'ionBlur', 'ionFocus']);
    }
    handleIonInput(el) {
        this.handleValueChange(el, el.value);
    }
    registerOnChange(fn) {
        super.registerOnChange((value) => {
            if (this.type === 'number') {
                /**
                 * If the input type is `number`, we need to convert the value to a number
                 * when the value is not empty. If the value is empty, we want to treat
                 * the value as null.
                 */
                fn(value === '' ? null : parseFloat(value));
            }
            else {
                fn(value);
            }
        });
    }
};
__decorate([
    HostListener('ionInput', ['$event.target'])
], IonInputOtp.prototype, "handleIonInput", null);
IonInputOtp = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineCustomElement,
        inputs: INPUT_OTP_INPUTS,
        methods: ['setFocus'],
    }),
    Component({
        selector: 'ion-input-otp',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: INPUT_OTP_INPUTS,
        providers: [accessorProvider],
        standalone: true,
    })
], IonInputOtp);
export { IonInputOtp };
