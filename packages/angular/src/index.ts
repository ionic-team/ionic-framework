export { IonicAngularModule } from './module';

/* Directives */

export { MenuToggle } from './directives/menu-toggle';

/* Nav */
export { IonNav } from './nav/ion-nav';
export { OutletInjector } from './nav/router/outlet-injector';
export { IonicRouteReuseStrategy } from './nav/router/reuse-strategy';
export { IonicRouterModule } from './nav/router/router-module';

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
export { PopoverController, PopoverProxy } from './providers/popover-controller';
export { ToastController, ToastProxy } from './providers/toast-controller';

export * from './types/interfaces';