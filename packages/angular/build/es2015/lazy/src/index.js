// DIRECTIVES
export { BooleanValueAccessorDirective as BooleanValueAccessor } from './directives/control-value-accessors/boolean-value-accessor';
export { NumericValueAccessorDirective as NumericValueAccessor } from './directives/control-value-accessors/numeric-value-accessor';
export { SelectValueAccessorDirective as SelectValueAccessor } from './directives/control-value-accessors/select-value-accessor';
export { TextValueAccessorDirective as TextValueAccessor } from './directives/control-value-accessors/text-value-accessor';
export { IonTabs } from './directives/navigation/ion-tabs';
export { IonBackButton } from './directives/navigation/ion-back-button';
export { IonNav } from './directives/navigation/ion-nav';
export { IonRouterOutlet } from './directives/navigation/ion-router-outlet';
export { RouterLinkDelegateDirective as RouterLinkDelegate, RouterLinkWithHrefDelegateDirective as RouterLinkWithHrefDelegate, } from './directives/navigation/router-link-delegate';
export { IonModal } from './directives/overlays/modal';
export { IonPopover } from './directives/overlays/popover';
export * from './directives/proxies';
export * from './directives/validators';
// PROVIDERS
export { DomController, NavController, Config, Platform, AngularDelegate, NavParams, IonicRouteStrategy, IonModalToken, } from '@ionic/angular/common';
export { AlertController } from './providers/alert-controller';
export { AnimationController } from './providers/animation-controller';
export { ActionSheetController } from './providers/action-sheet-controller';
export { GestureController } from './providers/gesture-controller';
export { LoadingController } from './providers/loading-controller';
export { MenuController } from './providers/menu-controller';
export { ModalController } from './providers/modal-controller';
export { PopoverController } from './providers/popover-controller';
export { ToastController } from './providers/toast-controller';
/*
 * PACKAGE MODULE
 * `IonicModule` is deprecated and will be removed in a future major version.
 * Use `provideIonicAngular()` from `@ionic/angular` instead. The deprecation is
 * declared on the class itself, so consumers importing it here see the notice.
 */
export { IonicModule } from './ionic-module';
export { 
// UTILS
createAnimation, createGesture, iosTransitionAnimation, mdTransitionAnimation, IonicSlides, getPlatforms, isPlatform, getTimeGivenProgression, getIonPageElement, IonicSafeString, openURL, } from '@ionic/core';
