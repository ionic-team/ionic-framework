import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';

export interface AlertOptions {
  /** The title for the alert. */
  title?: string;
  /** The subtitle for the alert. */
  subTitle?: string;
  /** The message for the alert. */
  message?: string;
  /** Additional classes for custom styles, separated by spaces. */
  cssClass?: string;
  mode?: string;
  /** An array of inputs for the alert. See input options. */
  inputs?: AlertInputOptions[];
  /** An array of buttons for the alert. See buttons options. */
  buttons?: AlertButton[];
  /**
   * Whether the alert should be dismissed by tapping the backdrop.
   *
   * @default true
   */
  enableBackdropDismiss?: boolean;
}

export interface AlertOptionsParam extends AlertOptions {
  /** An array of buttons for the alert. See buttons options. */
  buttons?: (AlertButton | string)[];
}

export interface AlertInputOptions {
  /** The type the input should be: text, tel, number, etc. */
  type?: string;
  /** The name for the input. */
  name?: string | number;
  /** The input's placeholder (for textual/numeric inputs) */
  placeholder?: string;
  /** The input's value. */
  value?: string | number;
  /** The input's label (only for radio/checkbox inputs) */
  label?: string;
  /** Whether or not the input is checked. */
  checked?: boolean;
  disabled?: boolean;
  /** The input's id. */
  id?: string;
  handler?: Function;
  min?: number | string;
  max?: number | string;
  validators?: ValidatorFn[];
  asyncValidators?: AsyncValidatorFn[];
  errors?: {error: string; message: string}[];
}

export interface AlertButton {
  /** The buttons displayed text. */
  text?: string;
  /** The buttons role, `null` or `'cancel'`. */
  role?: 'cancel' | 'submit' | null;
  /** An additional CSS class for the button. */
  cssClass?: string;
  /** Emitted when the button is pressed. */
  handler?: (value: any) => boolean|void;
}
