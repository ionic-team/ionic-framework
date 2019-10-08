import Vue from 'vue';
import { PopoverOptions, popoverController as _popoverController } from '@ionic/core';
import { VueDelegate } from './vue-delegate';

export const popoverController = (delegate?: VueDelegate) => {
  delegate = delegate || new VueDelegate(Vue);
  return {
    ..._popoverController,
    create(options: PopoverOptions) {
      return _popoverController.create({
        ...options,
        delegate,
      });
    }
  };
};
