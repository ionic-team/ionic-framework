export interface TextInputChangeEvent {
  value: string | undefined;
}

export interface CheckedInputChangeEvent extends TextInputChangeEvent {
  checked: boolean;
}

export interface InputChangeEvent {
  value: any;
}

export interface SelectInputChangeEvent {
  value: any | any[] | undefined | null;
  text: string | undefined | null;
}

export interface StyleEvent {
  [styleName: string]: boolean;
}
