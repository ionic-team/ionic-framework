import {
  modalController,
  popoverController
} from '@ionic/core';
import { VueDelegate } from './framework-delegate';

const oldModalCreate = modalController.create.bind(modalController);
modalController.create = (options) => {
  const delegate = (options.component instanceof HTMLElement) ? undefined : VueDelegate();
  return oldModalCreate({
    ...options,
    delegate
  });
}

const oldPopoverCreate = popoverController.create.bind(popoverController);
popoverController.create = (options) => {
  const delegate = (options.component instanceof HTMLElement) ? undefined : VueDelegate();
  return oldPopoverCreate({
    ...options,
    delegate
  });
}

export {
  modalController,
  popoverController
}
