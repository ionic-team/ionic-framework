import { __decorate } from "tslib";
import { Component, ChangeDetectionStrategy, } from '@angular/core';
import { IonNav as IonNavBase } from '@ionic/angular/common';
let IonNav = class IonNav extends IonNavBase {
    constructor(ref, environmentInjector, injector, angularDelegate, z, c) {
        super(ref, environmentInjector, injector, angularDelegate, z, c);
    }
};
IonNav = __decorate([
    Component({
        standalone: false,
        selector: 'ion-nav',
        template: '<ng-content></ng-content>',
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IonNav);
export { IonNav };
