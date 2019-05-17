// Components interfaces
import {Components as IoniconsComponents} from 'ionicons';
export * from './components';
export * from './index';
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

// Types from utils
export * from './utils/animation/animation-interface';
export * from './utils/overlays-interface';
export * from './global/config';
export { Gesture, GestureDetail } from './utils/gesture';

// Global aux types
export type TextFieldTypes = 'date' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | 'time';
export type Side = 'start' | 'end';
export type PredefinedColors = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark';
export type Color = PredefinedColors | string;
export type Mode = "ios" | "md";
export type ComponentTags = string;
export type ComponentRef = Function | HTMLElement | string | null;
export type ComponentProps<T = null> = {[key: string]: any};
export type CssClassMap = { [className: string]: boolean };
export type BackButtonEvent = CustomEvent<BackButtonEventDetail>;

export interface FrameworkDelegate {
  attachViewToDom(container: any, component: any, propsOrDataObj?: any, cssClasses?: string[]): Promise<HTMLElement>;
  removeViewFromDom(container: any, component: any): Promise<void>;
}

export interface BackButtonEventDetail {
  register(priority: number, handler: () => Promise<any> | void): void;
}

export interface StyleEventDetail {
  [styleName: string]: boolean;
}

declare module "./components" {
  export namespace Components {
    export interface IonIcon extends IoniconsComponents.IonIcon{}
  }
}

declare module "@stencil/core/internal" {
  namespace JSXBase {
    export interface HTMLAttributes {
      /** @deprecated */
      main?: boolean;

      /** @deprecated Use .ion-padding class instead */
      padding?: boolean;
      /** @deprecated Use .ion-padding-top class instead */
      ['padding-top']?: boolean;

      /** @deprecated Use .ion-padding-bottom class instead */
      ['padding-bottom']?: boolean;
      /** @deprecated Use .ion-padding-start class instead */
      ['padding-left']?: boolean;
      /** @deprecated Use .ion-padding-end class instead */
      ['padding-right']?: boolean;
      /** @deprecated Use .ion-padding-horizontal class instead */
      ['padding-horizontal']?: boolean;
      /** @deprecated Use .ion-padding-horizontal class instead */
      ['padding-vertical']?: boolean;

      /** @deprecated Use .ion-margin class instead */
      margin?: boolean;
      /** @deprecated Use .ion-margin-top class instead */
      ['margin-top']?: boolean;
      /** @deprecated Use .ion-margin-bottom class instead */
      ['margin-bottom']?: boolean;
      /** @deprecated Use .ion-margin-start class instead */
      ['margin-left']?: boolean;
      /** @deprecated Use .ion-margin-end class instead */
      ['margin-right']?: boolean;
      /** @deprecated Use .ion-margin-horizontal class instead */
      ['margin-horizontal']?: boolean;
      /** @deprecated Use .ion-margin-vertical class instead */
      ['margin-vertical']?: boolean;

      /** @deprecated Use .ion-no-padding class instead */
      ['no-padding']?: boolean;
      /** @deprecated Use .ion-no-margin class instead */
      ['no-margin']?: boolean;
    }
  }
}