
export interface AlertOptions {
  title?: string;
  subTitle?: string;
  message?: string;
  cssClass?: string;
  inputs?: Array<AlertInputOptions>;
  buttons?: Array<any>;
  enableBackdropDismiss?: boolean;
}

export interface AlertInputOptions {
  type?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  id?: string;
}
