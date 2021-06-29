import { PickerOptions, pickerController } from '@ionic/core';

import { createControllerComponent } from './createControllerComponent';

export const IonPicker = /*@__PURE__*/ createControllerComponent<
  PickerOptions,
  HTMLIonPickerElement
>('IonPicker', pickerController);
