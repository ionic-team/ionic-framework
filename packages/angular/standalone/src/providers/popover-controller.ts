import { Injector, inject, EnvironmentInjector } from '@angular/core';
import { AngularDelegate, OverlayBaseController } from '@ionic/angular/common';
import type { PopoverOptions } from '@ionic/core/components';
import { popoverController } from '@ionic/core/components';


export class PopoverController extends OverlayBaseController<PopoverOptions, HTMLIonPopoverElement> {
  private angularDelegate = inject(AngularDelegate);
  private injector = inject(Injector);
  private environmentInjector = inject(EnvironmentInjector);

  constructor() {
    super(popoverController);
  }

  create(opts: PopoverOptions): Promise<HTMLIonPopoverElement> {
    return super.create({
      ...opts,
      delegate: this.angularDelegate.create(this.environmentInjector, this.injector, 'popover'),
    });
  }
}
