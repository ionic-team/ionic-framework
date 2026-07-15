import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, HostListener, forwardRef, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-range.js';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';
const RANGE_INPUTS = [
    'activeBarStart',
    'color',
    'debounce',
    'disabled',
    'dualKnobs',
    'label',
    'labelPlacement',
    'max',
    'min',
    'mode',
    'name',
    'pin',
    'pinFormatter',
    'snaps',
    'step',
    'ticks',
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
    useExisting: /*@__PURE__*/ forwardRef(() => IonRange),
    multi: true,
};
let IonRange = class IonRange extends ValueAccessor {
    constructor(c, r, z, injector) {
        super(injector, r);
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ['ionChange', 'ionInput', 'ionFocus', 'ionBlur', 'ionKnobMoveStart', 'ionKnobMoveEnd']);
    }
    handleIonInput(el) {
        this.handleValueChange(el, el.value);
    }
};
__decorate([
    HostListener('ionInput', ['$event.target'])
], IonRange.prototype, "handleIonInput", null);
IonRange = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineCustomElement,
        inputs: RANGE_INPUTS,
    }),
    Component({
        selector: 'ion-range',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: RANGE_INPUTS,
        providers: [accessorProvider],
        standalone: true,
    })
], IonRange);
export { IonRange };
