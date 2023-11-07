import { Injector, inject, EnvironmentInjector } from '@angular/core';
import type { PopoverOptions } from '@ionic/core/components';

import type { ControllerShape } from '../utils/overlay';
import { OverlayBaseController } from '../utils/overlay';

import { AngularDelegate } from './angular-delegate';

export class PopoverController extends OverlayBaseController<PopoverOptions, HTMLIonPopoverElement> {
  private angularDelegate = inject(AngularDelegate);
  private injector = inject(Injector);
  private environmentInjector = inject(EnvironmentInjector);

  constructor(protected popoverController: ControllerShape<PopoverOptions, HTMLIonPopoverElement>) {
    super(popoverController);
  }

  create(opts: PopoverOptions): Promise<HTMLIonPopoverElement> {
    return super.create({
      ...opts,
      delegate: this.angularDelegate.create(this.environmentInjector, this.injector, 'popover'),
    });
  }
}
