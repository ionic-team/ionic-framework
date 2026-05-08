import type { OverlayOptions } from '@utils/overlays-interface';

import type { ComponentProps, ComponentRef, FrameworkDelegate } from '../../interface';

export interface ModalOptions<T extends ComponentRef = ComponentRef> extends OverlayOptions {
  component: T;
  componentProps?: ComponentProps<T>;
  presentingElement?: HTMLElement;
  showBackdrop?: boolean;
  backdropDismiss?: boolean;
  cssClass?: string | string[];
  delegate?: FrameworkDelegate;
  canDismiss?: boolean | ((data?: any, role?: string) => Promise<boolean>);
  focusTrap?: boolean;

  keyboardClose?: boolean;
  htmlAttributes?: { [key: string]: any };

  breakpoints?: number[];
  initialBreakpoint?: number;
  backdropBreakpoint?: number;
  handle?: boolean;
  handleBehavior?: ModalHandleBehavior;
  expandToScroll?: boolean;
}

export interface ModalAnimationOptions {
  presentingEl?: HTMLElement;
  currentBreakpoint?: number;
  backdropBreakpoint?: number;
  expandToScroll: boolean;
  staticBackdropOpacity?: boolean;
}

export interface ModalBreakpointChangeEventDetail {
  breakpoint: number;
}

export interface ModalCustomEvent extends CustomEvent {
  target: HTMLIonModalElement;
}

/**
 * The behavior setting for modals when the handle is pressed.
 */
export type ModalHandleBehavior = 'none' | 'cycle';

export interface ModalDragEventDetail {
  /**
   * The current Y coordinate of the drag event.
   */
  currentY: number;
  /**
   * The change in Y coordinate since the last drag event.
   */
  deltaY: number;
  /**
   * The velocity of the drag event in the Y direction.
   */
  velocityY: number;
  /**
   * The progress of the drag event, represented as a value between 0 and 1.
   * A value of 0 means the modal is at its lowest point (fully closed),
   * while a value of 1 means the modal is at its highest point (fully open).
   */
  progress: number;
  /**
   * The breakpoint that the sheet will snap to if the user releases
   * the gesture.
   */
  snapBreakpoint?: number;
}
