export interface SelectModalOption {
  text: string;
  value: string;
  disabled: boolean;
  checked: boolean;
  cssClass?: string | string[];
  handler?: (value: any) => boolean | void | { [key: string]: any };
}
