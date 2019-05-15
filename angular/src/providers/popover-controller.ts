import { DOCUMENT } from '@angular/common';
import { ComponentFactoryResolver, Inject, Injectable, Injector } from '@angular/core';
import { PopoverOptions } from '@ionic/core';

import { OverlayBaseController } from '../util/overlay';

import { AngularDelegate } from './angular-delegate';

@Injectable()
export class PopoverController extends OverlayBaseController<PopoverOptions, HTMLIonPopoverElement> {

  constructor(
    private angularDelegate: AngularDelegate,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    @Inject(DOCUMENT) doc: any
  ) {
    super('ion-popover-controller', doc);
  }

  create(opts: PopoverOptions): Promise<HTMLIonPopoverElement> {
    return super.create({
      ...opts,
      delegate: this.angularDelegate.create(this.resolver, this.injector)
    });
  }
}
