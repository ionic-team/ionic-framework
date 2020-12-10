
import 'ionicons';
// tslint:disable-next-line
import { Components as IoniconsComponents, JSX as IoniconsJSX } from 'ionicons';

export * from './components';
export * from './components/alert/alert-interface';
export * from './components/action-sheet/action-sheet-interface';
export * from './components/content/content-interface';
export * from './components/checkbox/checkbox-interface';
export * from './components/datetime/datetime-interface';
export * from './components/input/input-interface';
export * from './components/loading/loading-interface';
export * from './components/menu/menu-interface';
export * from './components/modal/modal-interface';
export * from './components/nav/nav-interface';
export * from './components/picker/picker-interface';
export * from './components/popover/popover-interface';
export * from './components/radio-group/radio-group-interface';
export * from './components/range/range-interface';
export * from './components/router/utils/interface';
export * from './components/refresher/refresher-interface';
export * from './components/reorder-group/reorder-group-interface';
export * from './components/searchbar/searchbar-interface';
export * from './components/segment/segment-interface';
export * from './components/select/select-interface';
export * from './components/select-popover/select-popover-interface';
export * from './components/spinner/spinner-interface';
export * from './components/tab-bar/tab-bar-interface';
export * from './components/textarea/textarea-interface';
export * from './components/toast/toast-interface';
export * from './components/toggle/toggle-interface';
export * from './components/virtual-scroll/virtual-scroll-interface';

export { createAnimation } from './utils/animation/animation';
export { iosTransitionAnimation } from './utils/transition/ios.transition';
export { mdTransitionAnimation } from './utils/transition/md.transition';
export { getTimeGivenProgression } from './utils/animation/cubic-bezier';
export { createGesture } from './utils/gesture';
export { isPlatform, Platforms, getPlatforms } from './utils/platform';
export { IonicSafeString } from './utils/sanitization';
export { IonicConfig, getMode, setupConfig } from './utils/config';
export { LIFECYCLE_WILL_ENTER, LIFECYCLE_DID_ENTER, LIFECYCLE_WILL_LEAVE, LIFECYCLE_DID_LEAVE, LIFECYCLE_WILL_UNLOAD } from './components/nav/constants';
export { menuController } from './utils/menu-controller';
export { alertController, actionSheetController, modalController, loadingController, pickerController, popoverController, toastController } from './utils/overlays';

// Types from utils
export type { Animation, AnimationBuilder, AnimationCallbackOptions, AnimationDirection, AnimationFill, AnimationKeyFrames, AnimationLifecycle } from './utils/animation/animation-interface';
export type { OverlayEventDetail, OverlayInterface, OverlayController, OverlaySelect, HTMLIonOverlayElement } from './utils/overlays-interface';
export type { Gesture, GestureConfig, GestureDetail } from './utils/gesture';
export type { Config } from './global/config';

// From: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
export type AutocompleteTypes = (
| 'on' | 'off' | 'name' | 'honorific-prefix' | 'given-name' | 'additional-name' | 'family-name' | 'honorific-suffix'
| 'nickname' | 'email' | 'username' | 'new-password' | 'current-password' | 'one-time-code' | 'organization-title' | 'organization'
| 'street-address' | 'address-line1' | 'address-line2' | 'address-line3' | 'address-level4' | 'address-level3' | 'address-level2'
| 'address-level1' | 'country' | 'country-name' | 'postal-code' | 'cc-name' | 'cc-given-name' | 'cc-additional-name' | 'cc-family-name'
| 'cc-family-name' | 'cc-number' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-csc' | 'cc-type' | 'transaction-currency' | 'transaction-amount'
| 'language' | 'bday' | 'bday-day' | 'bday-month' | 'bday-year' | 'sex' | 'tel' | 'tel-country-code' | 'tel-national' | 'tel-area-code' | 'tel-local'
| 'tel-extension' | 'impp' | 'url' | 'photo');

export type TextFieldTypes = 'date' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | 'time' | 'week' | 'month' | 'datetime-local';
export type Side = 'start' | 'end';
export type PredefinedColors = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark';
export type Color = PredefinedColors | string;
export type Mode = 'ios' | 'md';
export type ComponentTags = string;
export type ComponentRef = () => {} | HTMLElement | string | null;
// @ts-ignore
export type ComponentProps<T = null> = {[key: string]: any};
export type CssClassMap = { [className: string]: boolean };
export type BackButtonEvent = CustomEvent<BackButtonEventDetail>;

export interface FrameworkDelegate {
  attachViewToDom(container: any, component: any, propsOrDataObj?: any, cssClasses?: string[]): Promise<HTMLElement>;
  removeViewFromDom(container: any, component: any): Promise<void>;
}

export interface BackButtonEventDetail {
  register(priority: number, handler: (processNextHandler: () => void) => Promise<any> | void): void;
}

export interface KeyboardEventDetail {
  keyboardHeight: number;
}

export interface StyleEventDetail {
  [styleName: string]: boolean;
}

declare module './components' {
  export namespace Components {
    export interface IonIcon extends IoniconsComponents.IonIcon{} // tslint:disable-line
  }
}

declare module './components' {
  export namespace JSX {
    export interface IonIcon extends IoniconsJSX.IonIcon{} // tslint:disable-line
  }
}
