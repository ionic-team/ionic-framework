import type { AnimationBuilder, ComponentProps, ComponentRef, FrameworkDelegate, Mode } from '../../interface';

export interface ModalOptions<T extends ComponentRef = ComponentRef> {
  component: T;
  componentProps?: ComponentProps<T>;
  presentingElement?: HTMLElement;
  showBackdrop?: boolean;
  backdropDismiss?: boolean;
  cssClass?: string | string[];
  delegate?: FrameworkDelegate;
  animated?: boolean;
  /**
 * If `true`, the modal can be swiped to dismiss. Only applies in iOS mode.
 * @deprecated - To prevent modals from dismissing, use canDismiss instead.
 */
  swipeToClose?: boolean;
  canDismiss?: boolean | (() => Promise<boolean>);

  mode?: Mode;
  keyboardClose?: boolean;
  id?: string;
  htmlAttributes?: ModalAttributes;

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;

  breakpoints?: number[];
  initialBreakpoint?: number;
  backdropBreakpoint?: number;
  handle?: boolean;
}

export interface ModalAnimationOptions {
  presentingEl?: HTMLElement;
  currentBreakpoint?: number;
  backdropBreakpoint?: number;
}

export interface ModalBreakpointChangeEventDetail {
  breakpoint: number;
}

export interface ModalCustomEvent extends CustomEvent {
  target: HTMLIonModalElement;
}

/**
 * @deprecated - Use { [key: string]: any } directly instead.
 */
export type ModalAttributes = { [key: string]: any };
