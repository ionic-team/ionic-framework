import { Injectable } from '@angular/core';
import { ModalOptions } from '@ionic/core';
import { OverlayBaseController } from '../util/overlay';
import { AngularDelegate } from '..';

@Injectable()
export class ModalController extends OverlayBaseController<ModalOptions, HTMLIonModalElement> {
  constructor(
    private angularDelegate: AngularDelegate,
  ) {
    super('ion-modal-controller');
  }

  create(opts?: ModalOptions): Promise<HTMLIonModalElement> {
    return super.create({
      ...opts,
      delegate: this.angularDelegate
    });
  }
}
