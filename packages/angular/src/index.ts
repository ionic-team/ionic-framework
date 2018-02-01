export { IonicAngularModule } from './module';

/* Directives */
export { MenuToggle } from './directives/menu-toggle';
export { VirtualScroll } from './directives/virtual-scroll';
export { VirtualItem } from './directives/virtual-item';
export { VirtualHeader } from './directives/virtual-header';
export { VirtualFooter } from './directives/virtual-footer';

/* Nav */
export { IonNav } from './nav/ion-nav';
export { AsyncActivateRoutes } from './nav/router/async-activated-routes';
export { OutletInjector } from './nav/router/outlet-injector';
export { ExtendedRouter } from './nav/router/router-extension';
export { IonicRouterModule } from './nav/nav-module';

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