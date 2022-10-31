import type { AnimationBuilder, Mode, TextFieldTypes } from '../../interface';
import type { IonicSafeString } from '../../utils/sanitization';

export interface AlertOptions {
  header?: string;
  subHeader?: string;
  message?: string | IonicSafeString;
  cssClass?: string | string[];
  inputs?: AlertInput[];
  buttons?: (AlertButton | string)[];
  backdropDismiss?: boolean;
  translucent?: boolean;
  animated?: boolean;
  htmlAttributes?: { [key: string]: any };

  mode?: Mode;
  keyboardClose?: boolean;
  id?: string;

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}

export interface AlertInput {
  type?: TextFieldTypes | 'checkbox' | 'radio' | 'textarea';
  name?: string;
  placeholder?: string;
  value?: any;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  handler?: (input: AlertInput) => void;
  min?: string | number;
  max?: string | number;
  cssClass?: string | string[];
  attributes?: { [key: string]: any };
  tabindex?: number;
}

type AlertButtonOverlayHandler = boolean | void | { [key: string]: any };

export interface AlertButton {
  text: string;
  role?: 'cancel' | 'destructive' | string;
  cssClass?: string | string[];
  id?: string;
  handler?: (value: any) => AlertButtonOverlayHandler | Promise<AlertButtonOverlayHandler>;
}
