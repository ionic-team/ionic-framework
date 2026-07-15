import { __decorate, __rest } from "tslib";
import { Injector, Injectable, EnvironmentInjector, inject } from '@angular/core';
import { AngularDelegate, OverlayBaseController } from '@ionic/angular/common';
import { modalController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-modal.js';
let ModalController = class ModalController extends OverlayBaseController {
    constructor() {
        super(modalController);
        this.angularDelegate = inject(AngularDelegate);
        this.injector = inject(Injector);
        this.environmentInjector = inject(EnvironmentInjector);
        defineCustomElement();
    }
    create(opts) {
        const { injector: customInjector } = opts, restOpts = __rest(opts, ["injector"]);
        return super.create(Object.assign(Object.assign({}, restOpts), { delegate: this.angularDelegate.create(this.environmentInjector, this.injector, 'modal', customInjector) }));
    }
};
ModalController = __decorate([
    Injectable()
], ModalController);
export { ModalController };
