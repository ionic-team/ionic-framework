
export interface SelectPopoverOption {
  text: string;
  value: string;
  disabled: boolean;
  checked: boolean;
  cssClass?: string | string[];
  handler?: () => void;
}
