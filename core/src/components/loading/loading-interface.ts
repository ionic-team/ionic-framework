import { JSXBase } from '@stencil/core/internal';

import { AnimationBuilder, Mode, SpinnerTypes } from '../../interface';
import { IonicSafeString } from '../../utils/sanitization';

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

export interface LoadingAttributes extends JSXBase.HTMLAttributes<HTMLElement> {}
