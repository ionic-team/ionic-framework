export { IonicAngularModule } from './module';

/* Directives */
export { IonNav } from './directives/ion-nav';
export { VirtualScroll } from './directives/virtual-scroll';
export { VirtualItem } from './directives/virtual-item';
export { VirtualHeader } from './directives/virtual-header';
export { VirtualFooter } from './directives/virtual-footer';

/* Router */
export { RouterOutlet } from './router/outlet';
export { AsyncActivateRoutes } from './router/async-activated-routes';
export { OutletInjector } from './router/outlet-injector';
export { IonicRouterModule } from './router/router-module';

/* Providers */
export { ActionSheetController, ActionSheetProxy } from './providers/action-sheet-controller';
export { AlertController, AlertProxy } from './providers/alert-controller';
export { AngularComponentMounter } from './providers/angular-component-mounter';
export { App } from './providers/app';
export { Events } from './providers/events';
export { LoadingController, LoadingProxy } from './providers/loading-controller';
export { MenuController } from './providers/menu-controller';
export { ModalController, ModalProxy } from './providers/modal-controller';
export { NavController } from './providers/nav-controller';
export { NavParams } from './providers/nav-params';
export { Platform } from './providers/platform';
export { PopoverController, PopoverProxy } from './providers/popover-controller';
export { ToastController, ToastProxy } from './providers/toast-controller';

export * from './types/interfaces';


import { IonicWindow } from './types/interfaces';

const win = (window as IonicWindow);
const Ionic = win.Ionic;

if (!Ionic) {
  throw new Error(`ionic.js script missing from index.html`);

} else {

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
