export interface PickerChangeEventDetail {
  useInputMode: boolean;
  inputModeColumn?: HTMLIonPickerColumnElement;
}

export interface PickerCustomEvent extends CustomEvent {
  target: HTMLIonPickerElement;
  detail: PickerChangeEventDetail;
}
