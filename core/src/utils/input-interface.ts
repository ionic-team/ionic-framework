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
  value: any | any[] | undefined;
  text: string | undefined;
}

export interface StyleEvent {
  [styleName: string]: boolean;
}
