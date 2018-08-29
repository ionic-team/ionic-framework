import { SpinnerTypes } from '../../interface';

export interface LoadingOptions {
  spinner?: SpinnerTypes;
  message?: string;
  cssClass?: string | string[];
  showBackdrop?: boolean;
  duration?: number;
  translucent?: boolean;
  animated?: boolean;

  mode?: string;
  keyboardClose?: boolean;
  id?: string;
}
