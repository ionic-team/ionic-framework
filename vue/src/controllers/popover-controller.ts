import { PopoverOptions } from '@ionic/core';
import { OverlayBaseController } from '../util';
import { VueDelegate } from './vue-delegate';

export const CTRL = 'ion-popover-controller';
export class PopoverController extends OverlayBaseController<PopoverOptions, HTMLIonPopoverElement> {

  constructor(
    private delegate: VueDelegate
  ) {
    super(CTRL);
  }

  create(opts: PopoverOptions): Promise<HTMLIonPopoverElement> {
    return super.create({
      ...opts,
      delegate: this.delegate
    });
  }
}
