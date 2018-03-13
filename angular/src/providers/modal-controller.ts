import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { ModalOptions } from '@ionic/core';
import { OverlayBaseController } from '../util/overlay';
import { AngularDelegate } from './angular-delegate';

@Injectable()
export class ModalController extends OverlayBaseController<ModalOptions, HTMLIonModalElement> {
  constructor(
    private cfr: ComponentFactoryResolver,
    private injector: Injector,
    private angularDelegate: AngularDelegate,
  ) {
    super('ion-modal-controller');
  }

  create(opts?: ModalOptions): Promise<HTMLIonModalElement> {
    return super.create({
      ...opts,
      delegate: this.angularDelegate.create(this.cfr, this.injector)
    });
  }
}
