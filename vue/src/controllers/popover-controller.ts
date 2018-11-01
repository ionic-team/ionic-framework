import { PopoverOptions } from '@ionic/core';
import { OverlayBaseController } from '../util';

export const CTRL = 'ion-modal-controller';
export class PopoverController extends OverlayBaseController<PopoverOptions, HTMLIonPopoverElement> {

  constructor(
  ) {
    super(CTRL);
  }

  create(opts: PopoverOptions): Promise<HTMLIonPopoverElement> {
    return super.create({
      ...opts,
    });
  }
}
