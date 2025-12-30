import { Injector, inject, EnvironmentInjector } from '@angular/core';
import { AngularDelegate, OverlayBaseController } from '@ionic/angular/common';
import type { AngularPopoverOptions } from '@ionic/angular/common';
import { popoverController } from '@ionic/core';

export class PopoverController extends OverlayBaseController<AngularPopoverOptions, HTMLIonPopoverElement> {
  private angularDelegate = inject(AngularDelegate);
  private injector = inject(Injector);
  private environmentInjector = inject(EnvironmentInjector);

  constructor() {
    super(popoverController);
  }

  create(opts: AngularPopoverOptions): Promise<HTMLIonPopoverElement> {
    const { injector: customInjector, ...restOpts } = opts;
    return super.create({
      ...restOpts,
      delegate: this.angularDelegate.create(this.environmentInjector, this.injector, 'popover', customInjector),
    });
  }
}
