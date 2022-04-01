import type { JSXBase } from '@stencil/core/internal';

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

export type LoadingAttributes = JSXBase.HTMLAttributes<HTMLElement>;
