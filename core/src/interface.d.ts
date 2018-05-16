// Components
export * from './components';
export * from './components/animation-controller/animation-interface';
export * from './components/alert/alert-interface';
export * from './components/action-sheet/action-sheet-interface';
export * from './components/gesture/gesture-interface';
export * from './components/gesture-controller/gesture-controller-interface';
export * from './components/menu/menu-interface';
export * from './components/modal/modal-interface';
export * from './components/picker/picker-interface';
export * from './components/loading/loading-interface';
export * from './components/popover/popover-interface';
export * from './components/nav/nav-interface';
export * from './components/router/utils/interface';
export * from './components/range/range-interface';
export * from './components/select/select-interface';
export * from './components/select-popover/select-popover-interface';
export * from './components/toast/toast-interface';

// export all of the component declarations that are dynamically created
export * from './utils/input-interface';
export * from './global/config';

export type Color = 'default'| 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark';
export type Mode = 'ios' | 'md';
export type ComponentRef = Function | HTMLElement | string;
export type ComponentProps = {[key: string]: any};
export type CssClassMap = { [className: string]: boolean };

export interface FrameworkDelegate {
  attachViewToDom(container: any, component: any, propsOrDataObj?: any, cssClasses?: string[]): Promise<HTMLElement>;
  removeViewFromDom(container: any, component: any): Promise<void>;
}

export interface QueueController {
  read: DomControllerCallback;
  write: DomControllerCallback;
}

export interface RafCallback {
  (timeStamp: number): void;
}

export interface DomControllerCallback {
  (cb: RafCallback): void;
}


declare global {

  namespace JSXElements {

    export interface DOMAttributes {
      // for ion-menu and ion-split-pane
      main?: boolean;

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
}
