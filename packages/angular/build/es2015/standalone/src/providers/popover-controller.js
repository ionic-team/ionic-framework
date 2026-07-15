import { __rest } from "tslib";
import { Injector, inject, EnvironmentInjector } from '@angular/core';
import { AngularDelegate, OverlayBaseController } from '@ionic/angular/common';
import { popoverController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-popover.js';
export class PopoverController extends OverlayBaseController {
    constructor() {
        super(popoverController);
        this.angularDelegate = inject(AngularDelegate);
        this.injector = inject(Injector);
        this.environmentInjector = inject(EnvironmentInjector);
        defineCustomElement();
    }
    create(opts) {
        const { injector: customInjector } = opts, restOpts = __rest(opts, ["injector"]);
        return super.create(Object.assign(Object.assign({}, restOpts), { delegate: this.angularDelegate.create(this.environmentInjector, this.injector, 'popover', customInjector) }));
    }
}
