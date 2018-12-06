import { PluginFunction, VueConstructor, default as VueImport } from 'vue';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  MenuController,
  ModalController,
  PopoverController,
  ToastController
} from './controllers';
import { IonicConfig } from '@ionic/core';
import { appInitialize } from './app-initialize';
import { VueDelegate } from './controllers/vue-delegate';
import IonRouterOutlet  from './components/router-outlet';

export interface Controllers {
  actionSheetController: ActionSheetController;
  alertController: AlertController;
  loadingController: LoadingController;
  menuController: MenuController;
  modalController: ModalController;
  popoverController: PopoverController;
  toastController: ToastController;
}

declare module 'vue/types/vue' {
  interface Vue {
    $ionic: Controllers;
  }
}


function createApi(Vue: VueConstructor, $root: VueImport) {
  const cache: Partial<Controllers> = {};
  const vueDelegate = new VueDelegate(Vue, $root);
  const api: Controllers = {
    get actionSheetController() {
      if (!cache.actionSheetController) {
        cache.actionSheetController = new ActionSheetController();
      }
      return cache.actionSheetController;
    },
    get alertController() {
      if (!cache.alertController) {
        cache.alertController = new AlertController();
      }
      return cache.alertController;
    },
    get loadingController() {
      if (!cache.loadingController) {
        cache.loadingController = new LoadingController();
      }
      return cache.loadingController;
    },
    get menuController() {
      if (!cache.menuController) {
        cache.menuController = new MenuController();
      }
      return cache.menuController;
    },
    get modalController() {
      if (!cache.modalController) {
        cache.modalController = new ModalController(vueDelegate);
      }
      return cache.modalController;
    },
    get popoverController() {
      if (!cache.popoverController) {
        cache.popoverController = new PopoverController(vueDelegate);
      }
      return cache.popoverController;
    },
    get toastController() {
      if (!cache.toastController) {
        cache.toastController = new ToastController();
      }
      return cache.toastController;
    }
  };

  return api;
}

let Vue: typeof VueImport;

export const install: PluginFunction<IonicConfig> = (_Vue, config) => {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[Ionic] already installed. Vue.use(Ionic) should be called only once.'
      );
    }
    return;
  }
  Vue = _Vue;
  Vue.config.ignoredElements.push(/^ion-/);
  Vue.component('IonRouterView', IonRouterOutlet);

  appInitialize(config);

  Object.defineProperty(Vue.prototype, '$ionic', {
    get() { return createApi(Vue, this.$root); }
  });
};
