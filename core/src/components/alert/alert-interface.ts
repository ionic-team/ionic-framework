import { AnimationBuilder, TextFieldTypes } from '../../interface';

export interface AlertOptions {
  header?: string;
  subHeader?: string;
  message?: string;
  cssClass?: string | string[];
  inputs?: AlertInput[];
  buttons?: (AlertButton | string)[];
  backdropDismiss?: boolean;
  translucent?: boolean;
  animated?: boolean;

  mode?: string;
  keyboardClose?: boolean;
  id?: string;

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}

export interface AlertInput {
  type?: TextFieldTypes | 'checkbox' | 'radio';
  name?: string;
  placeholder?: string;
  value?: string;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  handler?: (input: AlertInput) => void;
  min?: string | number;
  max?: string | number;
}

export interface AlertButton {
  text: string;
  role?: string;
  cssClass?: string | string[];
  handler?: (value: any) => boolean | void | {[key: string]: any};
}
