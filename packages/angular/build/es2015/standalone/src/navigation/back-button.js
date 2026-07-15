import { __decorate, __param } from "tslib";
import { Component, Optional, ChangeDetectionStrategy } from '@angular/core';
import { IonBackButton as IonBackButtonBase, ProxyCmp } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-back-button.js';
let IonBackButton = class IonBackButton extends IonBackButtonBase {
    constructor(routerOutlet, navCtrl, config, r, z, c) {
        super(routerOutlet, navCtrl, config, r, z, c);
    }
};
IonBackButton = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineCustomElement,
    }),
    Component({
        selector: 'ion-back-button',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: '<ng-content></ng-content>',
        standalone: true,
    }),
    __param(0, Optional())
], IonBackButton);
export { IonBackButton };
