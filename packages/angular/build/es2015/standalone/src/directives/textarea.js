import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, HostListener, forwardRef, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-textarea.js';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';
const TEXTAREA_INPUTS = [
    'autoGrow',
    'autocapitalize',
    'autofocus',
    'clearOnEdit',
    'color',
    'cols',
    'counter',
    'counterFormatter',
    'debounce',
    'disabled',
    'enterkeyhint',
    'errorText',
    'fill',
    'helperText',
    'inputmode',
    'label',
    'labelPlacement',
    'maxlength',
    'minlength',
    'mode',
    'name',
    'placeholder',
    'readonly',
    'required',
    'rows',
    'shape',
    'spellcheck',
    'value',
    'wrap',
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
    useExisting: /*@__PURE__*/ forwardRef(() => IonTextarea),
    multi: true,
};
let IonTextarea = class IonTextarea extends ValueAccessor {
    constructor(c, r, z, injector) {
        super(injector, r);
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ['ionChange', 'ionInput', 'ionBlur', 'ionFocus']);
    }
    handleIonInput(el) {
        this.handleValueChange(el, el.value);
    }
};
__decorate([
    HostListener('ionInput', ['$event.target'])
], IonTextarea.prototype, "handleIonInput", null);
IonTextarea = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineCustomElement,
        inputs: TEXTAREA_INPUTS,
        methods: ['setFocus', 'getInputElement'],
    }),
    Component({
        selector: 'ion-textarea',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: TEXTAREA_INPUTS,
        providers: [accessorProvider],
        standalone: true,
    })
], IonTextarea);
export { IonTextarea };
