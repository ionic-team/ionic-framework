import { __decorate, __param } from "tslib";
import { Optional, Component, ChangeDetectionStrategy } from '@angular/core';
import { IonBackButton as IonBackButtonBase } from '@ionic/angular/common';
let IonBackButton = class IonBackButton extends IonBackButtonBase {
    constructor(routerOutlet, navCtrl, config, r, z, c) {
        super(routerOutlet, navCtrl, config, r, z, c);
    }
};
IonBackButton = __decorate([
    Component({
        standalone: false,
        selector: 'ion-back-button',
        template: '<ng-content></ng-content>',
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __param(0, Optional())
], IonBackButton);
export { IonBackButton };
