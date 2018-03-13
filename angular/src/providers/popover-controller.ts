import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { PopoverOptions } from '@ionic/core';
import { OverlayBaseController } from '../util/overlay';
import { AngularDelegate } from './angular-delegate';

@Injectable()
export class PopoverController extends OverlayBaseController<PopoverOptions, HTMLIonPopoverElement> {
  constructor(
    private cfr: ComponentFactoryResolver,
    private injector: Injector,
    private angularDelegate: AngularDelegate,
  ) {
    super('ion-popover-controller');
  }

  create(opts?: PopoverOptions): Promise<HTMLIonPopoverElement> {
    return super.create({
      ...opts,
      delegate: this.angularDelegate.create(this.cfr, this.injector)
    });
  }
}
