import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, HostListener, forwardRef, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-input.js';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';
const INPUT_INPUTS = [
    'accept',
    'autocapitalize',
    'autocomplete',
    'autocorrect',
    'autofocus',
    'clearInput',
    'clearOnEdit',
    'color',
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
    'max',
    'maxlength',
    'min',
    'minlength',
    'mode',
    'multiple',
    'name',
    'pattern',
    'placeholder',
    'readonly',
    'required',
    'shape',
    'size',
    'spellcheck',
    'step',
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
    useExisting: /*@__PURE__*/ forwardRef(() => IonInput),
    multi: true,
};
let IonInput = class IonInput extends ValueAccessor {
    constructor(c, r, z, injector) {
        super(injector, r);
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ['ionInput', 'ionChange', 'ionBlur', 'ionFocus']);
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
], IonInput.prototype, "handleIonInput", null);
IonInput = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineCustomElement,
        inputs: INPUT_INPUTS,
        methods: ['setFocus', 'getInputElement'],
    }),
    Component({
        selector: 'ion-input',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: INPUT_INPUTS,
        providers: [accessorProvider],
        standalone: true,
    })
], IonInput);
export { IonInput };
