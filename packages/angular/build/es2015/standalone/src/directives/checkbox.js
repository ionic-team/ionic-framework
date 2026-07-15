import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, HostListener, forwardRef, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor, setIonicClasses } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-checkbox.js';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';
const CHECKBOX_INPUTS = [
    'checked',
    'color',
    'disabled',
    'errorText',
    'helperText',
    'indeterminate',
    'justify',
    'labelPlacement',
    'mode',
    'name',
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
    useExisting: /*@__PURE__*/ forwardRef(() => IonCheckbox),
    multi: true,
};
let IonCheckbox = class IonCheckbox extends ValueAccessor {
    constructor(c, r, z, injector) {
        super(injector, r);
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ['ionChange', 'ionFocus', 'ionBlur']);
    }
    writeValue(value) {
        this.elementRef.nativeElement.checked = this.lastValue = value;
        setIonicClasses(this.elementRef);
    }
    handleIonChange(el) {
        this.handleValueChange(el, el.checked);
    }
};
__decorate([
    HostListener('ionChange', ['$event.target'])
], IonCheckbox.prototype, "handleIonChange", null);
IonCheckbox = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineCustomElement,
        inputs: CHECKBOX_INPUTS,
    }),
    Component({
        selector: 'ion-checkbox',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: CHECKBOX_INPUTS,
        providers: [accessorProvider],
        standalone: true,
    })
], IonCheckbox);
export { IonCheckbox };
