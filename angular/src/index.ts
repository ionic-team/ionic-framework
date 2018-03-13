export { IonicAngularModule } from './module';

/* Navigation */
export { IonNav } from './navigation/ion-nav';
export { IonRouterOutlet } from './navigation/ion-router-outlet';
export { IonTab } from './navigation/ion-tab';
export { IonTabs } from './navigation/ion-tabs';

/* Directives */
export { VirtualScroll } from './directives/virtual-scroll';
export { VirtualItem } from './directives/virtual-item';
export { VirtualHeader } from './directives/virtual-header';
export { VirtualFooter } from './directives/virtual-footer';

/* Providers */
export { AngularDelegate } from './providers/angular-delegate';
export { ActionSheetController } from './providers/action-sheet-controller';
export { AlertController } from './providers/alert-controller';
export { Events } from './providers/events';
export { LoadingController } from './providers/loading-controller';
export { MenuController } from './providers/menu-controller';
export { PickerController } from './providers/picker-controller';
export { ModalController } from './providers/modal-controller';
export { Platform } from './providers/platform';
export { PopoverController } from './providers/popover-controller';
export { ToastController } from './providers/toast-controller';

export * from './types/interfaces';


import { IonicWindow } from './types/interfaces';

const win = (window as IonicWindow);
const Ionic = win.Ionic;

if (Ionic) {
  Ionic.ael = function ngAddEventListener(elm, eventName, cb, opts) {
    if (elm.__zone_symbol__addEventListener) {
      elm.__zone_symbol__addEventListener(eventName, cb, opts);
    } else {
      elm.addEventListener(eventName, cb, opts);
    }
  };

  Ionic.rel = function ngRemoveEventListener(elm, eventName, cb, opts) {
    if (elm.__zone_symbol__removeEventListener) {
      elm.__zone_symbol__removeEventListener(eventName, cb, opts);
    } else {
      elm.removeEventListener(eventName, cb, opts);
    }
  };

  Ionic.raf = function ngRequestAnimationFrame(cb: any) {
    if (win.__zone_symbol__requestAnimationFrame) {
      win.__zone_symbol__requestAnimationFrame(cb);
    } else {
      win.requestAnimationFrame(cb);
    }
  };
}
