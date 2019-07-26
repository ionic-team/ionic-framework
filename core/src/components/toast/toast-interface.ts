import { AnimationBuilder, Color, Mode } from '../../interface';

export interface ToastOptions {
  header?: string;
  message?: string;
  cssClass?: string | string[];
  duration?: number;
  buttons?: (ToastButton | string)[];
  showCloseButton?: boolean;
  closeButtonText?: string;
  position?: 'top' | 'bottom' | 'middle';
  translucent?: boolean;
  animated?: boolean;

  color?: Color;
  mode?: Mode;
  keyboardClose?: boolean;
  id?: string;

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}

export interface ToastButton {
  text?: string;
  icon?: string;
  side?: 'start' | 'end';
  role?: 'cancel' | string;
  cssClass?: string | string[];
  handler?: () => boolean | void | Promise<boolean>;
}
