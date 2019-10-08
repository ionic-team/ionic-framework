export {
  actionSheetController,
  alertController,
  loadingController,
  menuController,
  toastController,
  pickerController,
} from '@ionic/core';
import { modalController as _modalController } from './modal-controller';
import { popoverController as _popoverController } from './popover-controller';

export const modalController = _modalController();
export const popoverController = _popoverController();
