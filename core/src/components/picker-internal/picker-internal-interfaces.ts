export interface PickerInternalChangeEventDetail {
  inputMode: boolean;
  inputModeColumn?: HTMLIonPickerColumnInternalElement;
}

export interface PickerInternalCustomEvent extends CustomEvent {
  target: HTMLIonPickerInternalElement;
  detail: PickerInternalChangeEventDetail;
}
