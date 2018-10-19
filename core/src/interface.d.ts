// Components interfaces
export * from './components';
export * from './index';
export * from './components/animation-controller/animation-interface';
export * from './components/alert/alert-interface';
export * from './components/action-sheet/action-sheet-interface';
export * from './components/menu/menu-interface';
export * from './components/modal/modal-interface';
export * from './components/picker/picker-interface';
export * from './components/loading/loading-interface';
export * from './components/popover/popover-interface';
export * from './components/nav/nav-interface';
export * from './components/router/utils/interface';
export * from './components/range/range-interface';
export * from './components/refresher/refresher-interface';
export * from './components/reorder-group/reorder-group-interface';
export * from './components/content/content-interface';
export * from './components/select/select-interface';
export * from './components/select-popover/select-popover-interface';
export * from './components/spinner/spinner-interface';
export * from './components/tabbar/tabbar-interface';
export * from './components/toast/toast-interface';
export * from './components/virtual-scroll/virtual-scroll-interface';

// TODO: review how this types are exported
// Other types
export * from './components/nav/view-controller';

export { Gesture, GestureDetail } from './utils/gesture/gesture';

export * from './utils/input-interface';
export * from './global/config';
export * from './utils/overlays-interface';

// Global types
export type TextFieldTypes = 'date' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';
export type Side = 'start' | 'end';
export type PredefinedColors = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark';
export type Color = PredefinedColors | string;
export type Mode = 'ios' | 'md';
export type ComponentTags = keyof StencilIntrinsicElements;
export type ComponentRef = Function | HTMLElement | string | null;
export type ComponentProps<T = null> = T extends ComponentTags ? StencilIntrinsicElements[T] : {[key: string]: any};
export type CssClassMap = { [className: string]: boolean };
export interface BackButtonDetail {
  register(priority: number, handler: () => Promise<any> | void): void;
}

export type BackButtonEvent = CustomEvent<BackButtonDetail>;

export interface FrameworkDelegate {
  attachViewToDom(container: any, component: any, propsOrDataObj?: any, cssClasses?: string[]): Promise<HTMLElement>;
  removeViewFromDom(container: any, component: any): Promise<void>;
}

declare global {
  interface StencilGlobalHTMLAttributes {
    // for ion-menu and ion-split-pane
    main?: boolean;
    tappable?: boolean;
    'ion-activatable'?: boolean;

    padding?: boolean;
    ['padding-top']?: boolean;
    ['padding-bottom']?: boolean;
    ['padding-left']?: boolean;
    ['padding-right']?: boolean;
    ['padding-horizontal']?: boolean;
    ['padding-vertical']?: boolean;

    margin?: boolean;
    ['margin-top']?: boolean;
    ['margin-bottom']?: boolean;
    ['margin-left']?: boolean;
    ['margin-right']?: boolean;
    ['margin-horizontal']?: boolean;
    ['margin-vertical']?: boolean;

    ['no-padding']?: boolean;
    ['no-margin']?: boolean;
  }
}
