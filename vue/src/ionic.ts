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
import IonTabs from './components/navigation/ion-tabs';
import IonPage from './components/navigation/ion-page';
import { createInputComponent } from './components/inputs';

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


function createApi(vueInstance: VueConstructor) {
  const cache: Partial<Controllers> = {};
  const vueDelegate = new VueDelegate(vueInstance);

  return {
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
  Vue.component('IonTabs', IonTabs);
  Vue.component('IonPage', IonPage);

  createInputComponent('IonCheckboxVue', 'ion-checkbox', 'ionChange', 'checked');
  createInputComponent('IonDatetimeVue', 'ion-datetime');
  createInputComponent('IonInputVue', 'ion-input', 'ionInput');
  createInputComponent('IonRadioVue', 'ion-radio');
  createInputComponent('IonRangeVue', 'ion-range');
  createInputComponent('IonSearchbarVue', 'ion-searchbar', 'ionInput');
  createInputComponent('IonSelectVue', 'ion-select');
  createInputComponent('IonTextareaVue', 'ion-textarea');
  createInputComponent('IonToggleVue', 'ion-toggle', 'ionChange', 'checked');

  appInitialize(config);

  const api = createApi(Vue);

  Object.defineProperty(Vue.prototype, '$ionic', {
    get() { return api; }
  });
};
