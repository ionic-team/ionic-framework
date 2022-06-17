export interface PickerInternalChangeEventDetail {
  useInputMode: boolean;
  inputModeColumn?: HTMLIonPickerColumnInternalElement;
}

/**
 * @deprecated
 * Use `IonPickerInternalCustomEvent` instead. This interface will be removed in the next major version of Ionic.
 */
export interface PickerInternalCustomEvent extends CustomEvent {
  target: HTMLIonPickerInternalElement;
  detail: PickerInternalChangeEventDetail;
}
