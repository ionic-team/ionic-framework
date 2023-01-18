import type { PickerOptions} from '@ionic/core/components';
import { pickerController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-picker.js';

import { createControllerComponent } from './createControllerComponent';

export const IonPicker = /*@__PURE__*/ createControllerComponent<
  PickerOptions,
  HTMLIonPickerElement
>('ion-picker', pickerController, defineCustomElement);
