
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
  prevSelected?: number;
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

export const PICKER_OPT_SELECTED = 'picker-opt-selected';
export const DECELERATION_FRICTION = 0.97;
export const FRAME_MS = (1000 / 60);
export const MAX_PICKER_SPEED = 60;
