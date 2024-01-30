// Components interfaces
import type { Components as IoniconsComponents, JSX as IoniconsJSX } from 'ionicons';

export * from './components';
export * from './index';
export { AccordionGroupCustomEvent } from './components/accordion-group/accordion-group-interface';
export { AlertOptions } from './components/alert/alert-interface';
export { ActionSheetOptions } from './components/action-sheet/action-sheet-interface';
export { BreadcrumbCustomEvent } from './components/breadcrumb/breadcrumb-interface';
export { ScrollBaseCustomEvent, ScrollCallback, ScrollCustomEvent } from './components/content/content-interface';
export { CheckboxCustomEvent } from './components/checkbox/checkbox-interface';
export { DatetimeCustomEvent, DatetimeHighlightStyle } from './components/datetime/datetime-interface';
export { InfiniteScrollCustomEvent } from './components/infinite-scroll/infinite-scroll-interface';
export { InputCustomEvent } from './components/input/input-interface';
export { CounterFormatter } from './components/item/item-interface';
export { ItemSlidingCustomEvent } from './components/item-sliding/item-sliding-interface';
export { LoadingOptions } from './components/loading/loading-interface';
export { MenuCustomEvent, MenuI, MenuControllerI } from './components/menu/menu-interface';
export { ModalOptions, ModalCustomEvent } from './components/modal/modal-interface';
export { NavDirection, NavCustomEvent } from './components/nav/nav-interface';
export { PickerOptions, PickerColumnOption } from './components/picker/picker-interface';
export { PopoverOptions } from './components/popover/popover-interface';
export { RadioGroupCustomEvent } from './components/radio-group/radio-group-interface';
export { RangeCustomEvent, PinFormatter } from './components/range/range-interface';
export { HTMLStencilElement, RouterCustomEvent } from './components/router/utils/interface';
export { RefresherCustomEvent } from './components/refresher/refresher-interface';
export { ItemReorderCustomEvent } from './components/reorder-group/reorder-group-interface';
export { SearchbarCustomEvent } from './components/searchbar/searchbar-interface';
export { SegmentCustomEvent } from './components/segment/segment-interface';
export { SelectCustomEvent, SelectCompareFn } from './components/select/select-interface';
export { TabsCustomEvent } from './components/tabs/tabs-interface';
export { TextareaCustomEvent } from './components/textarea/textarea-interface';
export { ToastOptions } from './components/toast/toast-interface';
export { ToggleCustomEvent } from './components/toggle/toggle-interface';
export { BackButtonEvent, BackButtonEventDetail } from './utils/hardware-back-button';

// Types from utils
export {
  Animation,
  AnimationBuilder,
  AnimationCallbackOptions,
  AnimationDirection,
  AnimationFill,
  AnimationKeyFrames,
  AnimationLifecycle,
} from './utils/animation/animation-interface';
export { TransitionOptions } from './utils/transition';
export { HTMLIonOverlayElement, OverlayController, OverlayInterface } from './utils/overlays-interface';
export { Config, config } from './global/config';
export { Gesture, GestureConfig, GestureDetail } from './utils/gesture';

// From: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
export type AutocompleteTypes =
  | 'on'
  | 'off'
  | 'name'
  | 'honorific-prefix'
  | 'given-name'
  | 'additional-name'
  | 'family-name'
  | 'honorific-suffix'
  | 'nickname'
  | 'email'
  | 'username'
  | 'new-password'
  | 'current-password'
  | 'one-time-code'
  | 'organization-title'
  | 'organization'
  | 'street-address'
  | 'address-line1'
  | 'address-line2'
  | 'address-line3'
  | 'address-level4'
  | 'address-level3'
  | 'address-level2'
  | 'address-level1'
  | 'country'
  | 'country-name'
  | 'postal-code'
  | 'cc-name'
  | 'cc-given-name'
  | 'cc-additional-name'
  | 'cc-family-name'
  | 'cc-family-name'
  | 'cc-number'
  | 'cc-exp'
  | 'cc-exp-month'
  | 'cc-exp-year'
  | 'cc-csc'
  | 'cc-type'
  | 'transaction-currency'
  | 'transaction-amount'
  | 'language'
  | 'bday'
  | 'bday-day'
  | 'bday-month'
  | 'bday-year'
  | 'sex'
  | 'tel'
  | 'tel-country-code'
  | 'tel-national'
  | 'tel-area-code'
  | 'tel-local'
  | 'tel-extension'
  | 'impp'
  | 'url'
  | 'photo';

export type TextFieldTypes =
  | 'date'
  | 'email'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'url'
  | 'time'
  | 'week'
  | 'month'
  | 'datetime-local';
export type PredefinedColors =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'light'
  | 'medium'
  | 'dark';

type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

export type Color = LiteralUnion<PredefinedColors, string>;
export type Mode = 'ios' | 'md';
export type ComponentTags = string;
// eslint-disable-next-line
export type ComponentRef = Function | HTMLElement | string | null;
// eslint-disable-next-line
export type ComponentProps<T = null> = { [key: string]: any };
export type CssClassMap = { [className: string]: boolean };

export interface FrameworkDelegate {
  attachViewToDom(container: any, component: any, propsOrDataObj?: any, cssClasses?: string[]): Promise<HTMLElement>;
  removeViewFromDom(container: any, component: any): Promise<void>;
}

export interface KeyboardEventDetail {
  keyboardHeight: number;
}

export interface StyleEventDetail {
  [styleName: string]: boolean;
}

export { NavComponentWithProps } from './components/nav/nav-interface';

declare module './components' {
  export namespace Components {
    export type IonIcon = IoniconsComponents.IonIcon;
  }
}

declare module './components' {
  export namespace JSX {
    export type IonIcon = IoniconsJSX.IonIcon;
  }
}
