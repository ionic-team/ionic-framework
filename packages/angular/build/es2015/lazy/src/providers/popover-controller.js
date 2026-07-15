import { __rest } from "tslib";
import { Injector, inject, EnvironmentInjector } from '@angular/core';
import { AngularDelegate, OverlayBaseController } from '@ionic/angular/common';
import { popoverController } from '@ionic/core';
export class PopoverController extends OverlayBaseController {
    constructor() {
        super(popoverController);
        this.angularDelegate = inject(AngularDelegate);
        this.injector = inject(Injector);
        this.environmentInjector = inject(EnvironmentInjector);
    }
    create(opts) {
        const { injector: customInjector } = opts, restOpts = __rest(opts, ["injector"]);
        return super.create(Object.assign(Object.assign({}, restOpts), { delegate: this.angularDelegate.create(this.environmentInjector, this.injector, 'popover', customInjector) }));
    }
}
