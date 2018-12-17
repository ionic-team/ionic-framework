import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { ModalOptions } from '@ionic/core';

import { OverlayBaseController } from '../util/overlay';

import { AngularDelegate } from './angular-delegate';

@Injectable()
export class ModalController extends OverlayBaseController<ModalOptions, HTMLIonModalElement> {

  constructor(
    private angularDelegate: AngularDelegate,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
  ) {
    super('ion-modal-controller');
  }

  create(opts: ModalOptions): Promise<HTMLIonModalElement> {
    return super.create({
      ...opts,
      delegate: this.angularDelegate.create(this.resolver, this.injector)
    });
  }
}
