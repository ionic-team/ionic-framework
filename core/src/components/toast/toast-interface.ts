import type { AnimationBuilder, Color, LiteralUnion, Mode } from '../../interface';
import type { IonicSafeString } from '../../utils/sanitization';

export interface ToastOptions {
  header?: string;
  message?: string | IonicSafeString;
  cssClass?: string | string[];
  duration?: number;
  buttons?: (ToastButton | string)[];
  position?: 'top' | 'bottom' | 'middle';
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

export interface ToastButton {
  text?: string;
  icon?: string;
  side?: 'start' | 'end';
  role?: LiteralUnion<'cancel', string>;
  cssClass?: string | string[];
  htmlAttributes?: { [key: string]: any };
  handler?: () => boolean | void | Promise<boolean | void>;
}

export type ToastPosition = 'top' | 'bottom' | 'middle';
