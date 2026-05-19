import type { ActionSheetButton } from '../action-sheet/action-sheet-interface';
import type { AlertInput } from '../alert/alert-interface';
import type { SelectPopoverOption } from '../select-popover/select-popover-interface';

export type SelectInterface = 'action-sheet' | 'popover' | 'alert' | 'modal';

export type SelectCompareFn = (currentValue: any, compareValue: any) => boolean;

export interface SelectChangeEventDetail<T = any> {
  value: T;
}

export interface SelectCustomEvent<T = any> extends CustomEvent {
  detail: SelectChangeEventDetail<T>;
  target: HTMLIonSelectElement;
}

export interface SelectActionSheetButton extends Omit<ActionSheetButton, 'text'>, RichContentOption {
  /** The main text for the option as a string or an HTMLElement. */
  text?: string | HTMLElement;
}

export interface SelectAlertInput extends Omit<AlertInput, 'label'>, RichContentOption {
  /** The main label for the option as a string or an HTMLElement. */
  label?: string | HTMLElement;
  /**
   * Where to place the label relative to the radio/checkbox indicator.
   * Mirrors ion-radio/ion-checkbox's `labelPlacement` so alert options
   * render with the same layout as their standalone counterparts.
   */
  labelPlacement?: 'start' | 'end' | 'fixed' | 'stacked';
  /**
   * How to pack the label and indicator within a line.
   * Mirrors ion-radio/ion-checkbox's `justify`. Defaults to
   * `'space-between'` in the alert interface so option rows
   * fill the available width.
   */
  justify?: 'start' | 'end' | 'space-between';
}

export interface SelectOverlayOption extends Omit<SelectPopoverOption, 'text'>, RichContentOption {
  /** The main text for the option as a string or an HTMLElement. */
  text?: string | HTMLElement;
}

export interface RichContentOption {
  /** Content to display at the start of the option. */
  startContent?: HTMLElement;
  /** Content to display at the end of the option. */
  endContent?: HTMLElement;
  /** A description for the option. */
  description?: string;
}
