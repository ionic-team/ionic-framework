
export interface AlertOptions {
  header?: string;
  subHeader?: string;
  message?: string;
  cssClass?: string | string[];
  mode?: string;
  inputs?: AlertInput[];
  buttons?: (AlertButton|string)[];
  enableBackdropDismiss?: boolean;
  translucent?: boolean;
}

export interface AlertInput {
  type: string;
  name: string | number;
  placeholder?: string;
  value?: string;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  handler?: Function;
  min?: string | number;
  max?: string | number;
}

export interface AlertButton {
  text: string;
  role?: string;
  cssClass?: string | string[];
  handler?: (value: any) => boolean|void;
}
