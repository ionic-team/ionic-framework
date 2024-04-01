import type {
  AnimationBuilder,
  ComponentProps,
  ComponentRef,
  FrameworkDelegate,
  Mode,
} from '../../interface';

export interface ModalOptions<
  T extends ComponentRef = ComponentRef
> {
  component: T;
  componentProps?: ComponentProps<T>;
  presentingElement?: HTMLElement;
  showBackdrop?: boolean;
  backdropDismiss?: boolean;
  cssClass?: string | string[];
  delegate?: FrameworkDelegate;
  animated?: boolean;
  canDismiss?:
    | boolean
    | ((
        data?: any,
        role?: string
      ) => Promise<boolean>);

  mode?: Mode;
  keyboardClose?: boolean;
  id?: string;
  htmlAttributes?: {
    [key: string]: any;
  };

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;

  breakpoints?: number[];
  initialBreakpoint?: number;
  backdropBreakpoint?: number;
  handle?: boolean;
  handleBehavior?: ModalHandleBehavior;
}

export interface ModalAnimationOptions {
  presentingEl?: HTMLElement;
  currentBreakpoint?: number;
  backdropBreakpoint?: number;
}

export interface ModalBreakpointChangeEventDetail {
  breakpoint: number;
}

export interface ModalCustomEvent
  extends CustomEvent {
  target: HTMLIonModalElement;
}

/**
 * The behavior setting for modals when the handle is pressed.
 */
export type ModalHandleBehavior =
  | 'none'
  | 'cycle';
