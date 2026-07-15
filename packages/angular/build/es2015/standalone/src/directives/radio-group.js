import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, HostListener, forwardRef, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-radio-group.js';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';
const RADIO_GROUP_INPUTS = ['allowEmptySelection', 'compareWith', 'errorText', 'helperText', 'name', 'value'];
/**
 * Pulling the provider into an object and using PURE  works
 * around an ng-packagr issue that causes
 * components with multiple decorators and
 * a provider to be re-assigned. This re-assignment
 * is not supported by Webpack and causes treeshaking
 * to not work on these kinds of components.
 */
const accessorProvider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: /*@__PURE__*/ forwardRef(() => IonRadioGroup),
    multi: true,
};
let IonRadioGroup = class IonRadioGroup extends ValueAccessor {
    constructor(c, r, z, injector) {
        super(injector, r);
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ['ionChange']);
    }
    handleIonChange(el) {
        this.handleValueChange(el, el.value);
    }
};
__decorate([
    HostListener('ionChange', ['$event.target'])
], IonRadioGroup.prototype, "handleIonChange", null);
IonRadioGroup = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineCustomElement,
        inputs: RADIO_GROUP_INPUTS,
    }),
    Component({
        selector: 'ion-radio-group',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: RADIO_GROUP_INPUTS,
        providers: [accessorProvider],
        standalone: true,
    })
], IonRadioGroup);
export { IonRadioGroup };
