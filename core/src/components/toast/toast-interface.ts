import { AnimationBuilder, Color, Mode } from '../../interface';

export interface ToastOptions {
  header?: string;
  message?: string;
  cssClass?: string | string[];
  duration?: number;
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
  slot?: 'start' | 'end';
  role?: 'cancel' | 'destructive' | string;
  cssClass?: string | string[];
  handler?: () => boolean | void | Promise<boolean>;
}
