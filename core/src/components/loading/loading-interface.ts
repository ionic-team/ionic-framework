import type { AnimationBuilder, Mode, SpinnerTypes } from '../../interface';
import type { IonicSafeString } from '../../utils/sanitization';

export interface LoadingOptions {
  spinner?: SpinnerTypes | null;
  message?: string | IonicSafeString;
  cssClass?: string | string[];
  showBackdrop?: boolean;
  duration?: number;
  translucent?: boolean;
  animated?: boolean;
  backdropDismiss?: boolean;
  mode?: Mode;
  keyboardClose?: boolean;
  id?: string;
  htmlAttributes?: LoadingAttributes;

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}

/**
 * @deprecated - Use { [key: string]: any } directly instead.
 */
export type LoadingAttributes = { [key: string]: any };
