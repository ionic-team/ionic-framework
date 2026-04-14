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

export interface SelectActionSheetButton extends Omit<ActionSheetButton, 'text'> {
  text?: string | HTMLElement;
  startContent?: HTMLElement;
  endContent?: HTMLElement;
  description?: string;
}

export interface SelectAlertInput extends Omit<AlertInput, 'label'> {
  label?: string | HTMLElement;
  startContent?: HTMLElement;
  endContent?: HTMLElement;
  description?: string;
}

export interface SelectOverlayOption extends Omit<SelectPopoverOption, 'text'> {
  text?: string | HTMLElement;
  startContent?: HTMLElement;
  endContent?: HTMLElement;
  description?: string;
}
