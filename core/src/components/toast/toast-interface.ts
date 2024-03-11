import type { OverlayOptions } from '@utils/overlays-interface';

import type { Color, LiteralUnion } from '../../interface';
import type { IonicSafeString } from '../../utils/sanitization';

export interface ToastOptions extends OverlayOptions {
  header?: string;
  message?: string | IonicSafeString;
  cssClass?: string | string[];
  duration?: number;
  buttons?: (ToastButton | string)[];
  position?: 'top' | 'bottom' | 'middle';
  positionAnchor?: HTMLElement | string;
  swipeGesture?: ToastSwipeGestureDirection;
  translucent?: boolean;
  icon?: string;
  htmlAttributes?: { [key: string]: any };
  layout?: ToastLayout;

  color?: Color;
  keyboardClose?: boolean;
}

export type ToastLayout = 'baseline' | 'stacked';

export interface ToastButton {
  text?: string;
  icon?: string;
  side?: 'start' | 'end';
  role?: LiteralUnion<'cancel', string>;
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
