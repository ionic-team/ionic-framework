import type { AnimationBuilder, Mode, Theme } from '../../interface';
import type { IonicSafeString } from '../../utils/sanitization';
import type { SpinnerTypes } from '../spinner/spinner-configs';

export interface LoadingOptions {
  spinner?: SpinnerTypes | null;
  message?: string | IonicSafeString;
  cssClass?: string | string[];
  showBackdrop?: boolean;
  duration?: number;
  translucent?: boolean;
  animated?: boolean;
  backdropDismiss?: boolean;
  /**
   * @deprecated To change the default appearance of the popover, use the `theme` option.
   * `mode` is deprecated and the ability to set the platform mode will be removed in a major release.
   */
  mode?: Mode;
  theme?: Theme;
  keyboardClose?: boolean;
  id?: string;
  htmlAttributes?: { [key: string]: any };

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}
