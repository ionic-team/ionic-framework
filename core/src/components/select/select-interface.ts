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
}

export interface SelectOverlayOption extends Omit<SelectPopoverOption, 'text'>, RichContentOption {
  /** The main text for the option as a string or an HTMLElement. */
  text?: string | HTMLElement;
}

interface RichContentOption {
  /** Content to display at the start of the option. */
  startContent?: HTMLElement;
  /** Content to display at the end of the option. */
  endContent?: HTMLElement;
  /** A description for the option. */
  description?: string;
}
