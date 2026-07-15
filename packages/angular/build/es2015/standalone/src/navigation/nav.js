import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { IonNav as IonNavBase, ProxyCmp } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-nav.js';
let IonNav = class IonNav extends IonNavBase {
    constructor(ref, environmentInjector, injector, angularDelegate, z, c) {
        super(ref, environmentInjector, injector, angularDelegate, z, c);
    }
};
IonNav = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineCustomElement,
    }),
    Component({
        selector: 'ion-nav',
        template: '<ng-content></ng-content>',
        standalone: true,
    })
], IonNav);
export { IonNav };
