import { AnimationBuilder } from '../../interface';

export { Toast } from './toast';

export interface ToastOptions {
  message?: string;
  cssClass?: string | string[];
  duration?: number;
  showCloseButton?: boolean;
  closeButtonText?: string;
  position?: string;
  translucent?: boolean;
  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}
