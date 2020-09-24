import {
  modalController,
  popoverController
} from '@ionic/core';
import { VueDelegate } from './framework-delegate';

const oldModalCreate = modalController.create.bind(modalController);
modalController.create = (options) => {
  return oldModalCreate({
    ...options,
    delegate: VueDelegate()
  });
}

const oldPopoverCreate = popoverController.create.bind(popoverController);
popoverController.create = (options) => {
  return oldPopoverCreate({
    ...options,
    delegate: VueDelegate()
  });
}

export {
  modalController,
  popoverController
}
