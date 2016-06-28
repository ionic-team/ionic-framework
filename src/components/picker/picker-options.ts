
export interface PickerOptions {
  buttons?: any[];
  columns?: PickerColumn[];
  cssClass?: string;
  enableBackdropDismiss?: boolean;
}

export interface PickerColumn {
  name?: string;
  align?: string;
  selectedIndex?: number;
  prefix?: string;
  suffix?: string;
  options?: PickerColumnOption[];
  cssClass?: string;
  columnWidth?: string;
  prefixWidth?: string;
  suffixWidth?: string;
  optionsWidth?: string;
}

export interface PickerColumnOption {
  text?: string;
  value?: any;
  disabled?: boolean;
}
