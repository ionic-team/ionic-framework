import { AnimationBuilder, Color, Mode } from '../../interface';

export interface ToastOptions {
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
