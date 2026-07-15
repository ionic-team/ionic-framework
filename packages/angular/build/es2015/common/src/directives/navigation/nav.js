import { __decorate } from "tslib";
import { Directive, } from '@angular/core';
import { ProxyCmp, proxyOutputs } from '../../utils/proxy';
const NAV_INPUTS = ['animated', 'animation', 'root', 'rootParams', 'swipeGesture'];
const NAV_METHODS = [
    'push',
    'insert',
    'insertPages',
    'pop',
    'popTo',
    'popToRoot',
    'removeIndex',
    'setRoot',
    'setPages',
    'getActive',
    'getByIndex',
    'canGoBack',
    'getPrevious',
];
let IonNav = class IonNav {
    constructor(ref, environmentInjector, injector, angularDelegate, z, c) {
        this.z = z;
        c.detach();
        this.el = ref.nativeElement;
        ref.nativeElement.delegate = angularDelegate.create(environmentInjector, injector);
        proxyOutputs(this, this.el, ['ionNavDidChange', 'ionNavWillChange']);
    }
};
IonNav = __decorate([
    ProxyCmp({
        inputs: NAV_INPUTS,
        methods: NAV_METHODS,
    }),
    Directive({
        // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
        inputs: NAV_INPUTS,
    })
], IonNav);
export { IonNav };
