import type { AnimationBuilder, Color, LiteralUnion, Mode } from '../../interface';
import type { IonicSafeString } from '../../utils/sanitization';

export interface ToastOptions {
  header?: string;
  message?: string | IonicSafeString;
  cssClass?: string | string[];
  duration?: number;
  buttons?: (ToastButton | string)[];
  position?: 'top' | 'bottom' | 'middle';
  positionAnchor?: HTMLElement | string;
  swipeGesture?: ToastSwipeGestureDirection;
  translucent?: boolean;
  animated?: boolean;
  icon?: string;
  htmlAttributes?: { [key: string]: any };
  layout?: ToastLayout;

  color?: Color;
  mode?: Mode;
  keyboardClose?: boolean;
  id?: string;

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}

export type ToastLayout = 'baseline' | 'stacked';

// TODO FW-4923 remove cssClass property

export interface ToastButton {
  text?: string;
  icon?: string;
  side?: 'start' | 'end';
  role?: LiteralUnion<'cancel', string>;
  /**
   * @deprecated Use the toast button's CSS Shadow Parts instead.
   */
  cssClass?: string | string[];
  htmlAttributes?: { [key: string]: any };
  handler?: () => boolean | void | Promise<boolean | void>;
}

export type ToastPosition = 'top' | 'bottom' | 'middle';

interface ToastPositionAlias {
  position: ToastPosition;
}

export interface ToastAnimationPosition {
  top: string;
  bottom: string;
}

export type ToastPresentOptions = ToastPositionAlias & ToastAnimationPosition;
export type ToastDismissOptions = ToastPositionAlias & ToastAnimationPosition;
export type ToastSwipeGestureDirection = 'vertical';
