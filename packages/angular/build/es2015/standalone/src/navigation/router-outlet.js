import { __decorate, __param } from "tslib";
import { ViewChild, ViewContainerRef, Component, Attribute, Optional, SkipSelf, } from '@angular/core';
import { IonRouterOutlet as IonRouterOutletBase, ProxyCmp } from '@ionic/angular/common';
import { defineCustomElement } from '@ionic/core/components/ion-router-outlet.js';
let IonRouterOutlet = class IonRouterOutlet extends IonRouterOutletBase {
    /**
     * We need to pass in the correct instance of IonRouterOutlet
     * otherwise parentOutlet will be null in a nested outlet context.
     * This results in APIs such as NavController.pop not working
     * in nested outlets because the parent outlet cannot be found.
     */
    constructor(name, tabs, commonLocation, elementRef, router, zone, activatedRoute, parentOutlet) {
        super(name, tabs, commonLocation, elementRef, router, zone, activatedRoute, parentOutlet);
        this.parentOutlet = parentOutlet;
    }
};
__decorate([
    ViewChild('outletContent', { read: ViewContainerRef, static: true })
], IonRouterOutlet.prototype, "outletContent", void 0);
IonRouterOutlet = __decorate([
    ProxyCmp({
        defineCustomElementFn: defineCustomElement,
    }),
    Component({
        selector: 'ion-router-outlet',
        standalone: true,
        template: '<ng-container #outletContent><ng-content></ng-content></ng-container>',
    }),
    __param(0, Attribute('name')),
    __param(1, Optional()),
    __param(1, Attribute('tabs')),
    __param(7, SkipSelf()),
    __param(7, Optional())
], IonRouterOutlet);
export { IonRouterOutlet };
