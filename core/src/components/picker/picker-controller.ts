import { createController } from "../../utils/overlays";
import type { PickerOptions } from "./picker-interface";

import { Picker } from "./picker";

export const pickerController = /*@__PURE__*/createController<PickerOptions, HTMLIonPickerElement>('ion-picker', Picker);
