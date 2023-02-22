import { Injector, Injectable, inject, EnvironmentInjector } from '@angular/core';
import { PopoverOptions, popoverController } from '@ionic/core';

import { OverlayBaseController } from '../util/overlay';

import { AngularDelegate } from './angular-delegate';

@Injectable()
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
