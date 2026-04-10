export interface SelectPopoverOption {
  text: string | HTMLElement;
  value: string;
  disabled: boolean;
  checked: boolean;
  cssClass?: string | string[];
  handler?: (value: any) => boolean | void | { [key: string]: any };
  startContent?: HTMLElement;
  endContent?: HTMLElement;
  description?: string;
}
