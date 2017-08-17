
export interface AlertOptions {
  title?: string;
  subTitle?: string;
  message?: string;
  cssClass?: string;
  mode?: string;
  inputs?: AlertInputOptions[];
  buttons?: (AlertButton|string)[];
  enableBackdropDismiss?: boolean;
}

export interface AlertInputOptions {
  type?: string;
  name?: string | number;
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
  text?: string;
  role?: string;
  cssClass?: string;
  handler?: (value: any) => boolean|void;
}
