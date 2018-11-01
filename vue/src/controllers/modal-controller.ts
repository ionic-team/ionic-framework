import { ModalOptions } from '@ionic/core';
import { OverlayBaseController } from '../util';

export const CTRL = 'ion-modal-controller';
export class ModalController extends OverlayBaseController<ModalOptions, HTMLIonModalElement> {

  constructor(
  ) {
    super(CTRL);
  }

  create(opts: ModalOptions): Promise<HTMLIonModalElement> {
    return super.create({
      ...opts,
    });
  }
}
