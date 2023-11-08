export { AlertController } from './providers/alert-controller';
export { LoadingController } from './providers/loading-controller';
export { MenuController } from './providers/menu-controller';
export { ModalController } from './providers/modal-controller';
export { PickerController } from './providers/picker-controller';
export { PopoverController } from './providers/popover-controller';

export { AnimationController } from './providers/animation-controller';
export { GestureController } from './providers/gesture-controller';
export { DomController } from './providers/dom-controller';
export { NavController } from './providers/nav-controller';

export { Config, ConfigToken } from './providers/config';
export { Platform } from './providers/platform';

export { bindLifecycleEvents, AngularDelegate } from './providers/angular-delegate';

export type { IonicWindow } from './types/interfaces';
export type { ViewWillEnter, ViewWillLeave, ViewDidEnter, ViewDidLeave } from './types/ionic-lifecycle-hooks';

export { NavParams } from './directives/navigation/nav-params';

export { IonPopover } from './overlays/popover';
export { IonModal } from './overlays/modal';

export { IonRouterOutlet, provideComponentInputBinding } from './directives/navigation/router-outlet';

export { IonBackButton } from './directives/navigation/back-button';
export {
  RouterLinkDelegateDirective,
  RouterLinkWithHrefDelegateDirective,
} from './directives/navigation/router-link-delegate';
export { IonNav } from './directives/navigation/nav';
export { IonTabs } from './directives/navigation/tabs';
export * from './directives/control-value-accessors';

export { ProxyCmp } from './utils/proxy';

export { IonicRouteStrategy } from './utils/routing';
export { OverlayBaseController } from './utils/overlay';

export { OverlayBaseController } from './utils/overlay';

export { raf } from './utils/util';
