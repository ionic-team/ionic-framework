import Vue from 'vue';
import { ModalOptions, modalController as _modalController } from '@ionic/core';
import { VueDelegate } from './vue-delegate';

export const modalController = (delegate?: VueDelegate) => {
  delegate = delegate || new VueDelegate(Vue);
  return {
    ..._modalController,
    create(options: ModalOptions) {
      return _modalController.create({
        ...options,
        delegate,
      });
    }
  };
};
