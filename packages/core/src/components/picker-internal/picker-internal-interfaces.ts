export interface PickerInternalChangeEventDetail {
  useInputMode: boolean;
  inputModeColumn?: HTMLIonPickerColumnInternalElement;
}

export interface PickerInternalCustomEvent extends CustomEvent {
  target: HTMLIonPickerInternalElement;
  detail: PickerInternalChangeEventDetail;
}
