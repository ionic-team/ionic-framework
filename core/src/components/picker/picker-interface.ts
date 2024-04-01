import type {
  AnimationBuilder,
  Mode,
} from '../../interface';

export interface PickerOptions {
  columns: PickerColumn[];
  buttons?: PickerButton[];
  cssClass?: string | string[];
  showBackdrop?: boolean;
  backdropDismiss?: boolean;
  animated?: boolean;

  mode?: Mode;
  keyboardClose?: boolean;
  id?: string;
  htmlAttributes?: {
    [key: string]: any;
  };

  enterAnimation?: AnimationBuilder;
  leaveAnimation?: AnimationBuilder;
}

export interface PickerButton {
  text?: string;
  role?: string;
  cssClass?: string | string[];
  handler?: (
    value: any
  ) => boolean | void;
}

export interface PickerColumn {
  name: string;
  align?: string;
  /**
   * Changing this value allows the initial value of a picker column to be set.
   */
  selectedIndex?: number;
  prevSelected?: number;
  prefix?: string;
  suffix?: string;
  options: PickerColumnOption[];
  cssClass?: string | string[];
  columnWidth?: string;
  prefixWidth?: string;
  suffixWidth?: string;
  optionsWidth?: string;
}

export interface PickerColumnOption {
  text?: string;
  value?: any;
  disabled?: boolean;
  duration?: number;
  transform?: string;
  selected?: boolean;
  /**
   * The optional text to assign as the aria-label on the picker column option.
   */
  ariaLabel?: string;
}
