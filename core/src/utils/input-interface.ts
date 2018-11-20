export interface TextInputChangeEvent {
  value: string | undefined | null;
}

export interface CheckedInputChangeEvent extends TextInputChangeEvent {
  checked: boolean;
}

export interface InputChangeEvent {
  value: any;
}

export interface SelectInputChangeEvent {
  value: any | any[] | undefined | null;
}

export interface StyleEvent {
  [styleName: string]: boolean;
}
