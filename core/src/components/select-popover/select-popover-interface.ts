
export interface SelectPopoverOption {
  text: string;
  value: string;
  disabled: boolean;
  checked: boolean;
  class?: string | { [className: string]: boolean; } | undefined;
  handler?: () => void;
}
