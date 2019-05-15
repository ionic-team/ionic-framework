import { ModalOptions } from '@ionic/core';
import { OverlayBaseController } from '../util';
import { VueDelegate } from './vue-delegate';

export const CTRL = 'ion-modal-controller';
export class ModalController extends OverlayBaseController<ModalOptions, HTMLIonModalElement> {

  constructor(
    private delegate: VueDelegate
  ) {
    super(CTRL);
  }

  create(opts: ModalOptions): Promise<HTMLIonModalElement> {
    return super.create({
      ...opts,
      delegate: this.delegate
    });
  }
}
