import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, HostListener, forwardRef, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-searchbar.js';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';
const SEARCHBAR_INPUTS = [
    'animated',
    'autocomplete',
    'autocorrect',
    'cancelButtonIcon',
    'cancelButtonText',
    'clearIcon',
    'color',
    'debounce',
    'disabled',
    'enterkeyhint',
    'inputmode',
    'mode',
    'name',
    'placeholder',
    'searchIcon',
    'showCancelButton',
    'showClearButton',
    'spellcheck',
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
    useExisting: /*@__PURE__*/ forwardRef(() => IonSearchbar),
    multi: true,
};
let IonSearchbar = class IonSearchbar extends ValueAccessor {
    constructor(c, r, z, injector) {
        super(injector, r);
        this.z = z;
        c.detach();
        this.el = r.nativeElement;
        proxyOutputs(this, this.el, ['ionInput', 'ionChange', 'ionCancel', 'ionClear', 'ionBlur', 'ionFocus']);
    }
    handleIonInput(el) {
        this.handleValueChange(el, el.value);
    }
};
__decorate([
    HostListener('ionInput', ['$event.target'])
], IonSearchbar.prototype, "handleIonInput", null);
IonSearchbar = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineCustomElement,
        inputs: SEARCHBAR_INPUTS,
        methods: ['setFocus', 'getInputElement'],
    }),
    Component({
        selector: 'ion-searchbar',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: SEARCHBAR_INPUTS,
        providers: [accessorProvider],
        standalone: true,
    })
], IonSearchbar);
export { IonSearchbar };
