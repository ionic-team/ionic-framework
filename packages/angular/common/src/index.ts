export { DomController } from './providers/dom-controller';
export { MenuController } from './providers/menu-controller';
export { NavController } from './providers/nav-controller';

export { Config, ConfigToken } from './providers/config';
export { Platform } from './providers/platform';

export { AngularDelegate, bindLifecycleEvents, IonModalToken } from './providers/angular-delegate';

export type { IonicWindow } from './types/interfaces';
export type { ViewDidEnter, ViewDidLeave, ViewWillEnter, ViewWillLeave } from './types/ionic-lifecycle-hooks';
export type { AngularModalOptions, AngularPopoverOptions } from './types/overlay-options';

export { NavParams } from './directives/navigation/nav-params';

export { IonModal } from './overlays/modal';
export { IonPopover } from './overlays/popover';

export { IonRouterOutlet, provideComponentInputBinding } from './directives/navigation/router-outlet';

export * from './directives/control-value-accessors';
export { IonBackButton } from './directives/navigation/back-button';
export { IonNav } from './directives/navigation/nav';
export {
  RouterLinkDelegateDirective,
  RouterLinkWithHrefDelegateDirective,
} from './directives/navigation/router-link-delegate';
export { IonTabs } from './directives/navigation/tabs';

export { ProxyCmp } from './utils/proxy';

export { OverlayBaseController } from './utils/overlay';
export { IonicRouteStrategy } from './utils/routing';

export { raf } from './utils/util';
