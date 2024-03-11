import type { OverlayOptions } from '@utils/overlays-interface';

import type { IonicSafeString } from '../../utils/sanitization';
import type { SpinnerTypes } from '../spinner/spinner-configs';

export interface LoadingOptions extends OverlayOptions {
  spinner?: SpinnerTypes | null;
  message?: string | IonicSafeString;
  cssClass?: string | string[];
  showBackdrop?: boolean;
  duration?: number;
  translucent?: boolean;
  backdropDismiss?: boolean;
  keyboardClose?: boolean;
  htmlAttributes?: { [key: string]: any };
}
