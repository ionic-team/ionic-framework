import { Injector, inject, EnvironmentInjector } from '@angular/core';
import { AngularDelegate, OverlayBaseController } from '@ionic/angular/common';
import type { PopoverOptions } from '@ionic/core/components';
import { popoverController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-popover.js';

export class PopoverController extends OverlayBaseController<PopoverOptions, HTMLIonPopoverElement> {
  private angularDelegate = inject(AngularDelegate);
  private injector = inject(Injector);
  private environmentInjector = inject(EnvironmentInjector);

  constructor() {
    super(popoverController);
    defineCustomElement();
  }

  create(opts: PopoverOptions): Promise<HTMLIonPopoverElement> {
    return super.create({
      ...opts,
      delegate: this.angularDelegate.create(this.environmentInjector, this.injector, 'popover'),
    });
  }
}
