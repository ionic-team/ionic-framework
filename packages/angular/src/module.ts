import {
  ModuleWithProviders,
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';

import { BooleanValueAccessor } from './control-value-accessors/boolean-value-accessor';
import { RadioValueAccessor } from './control-value-accessors/radio-value-accessor';
import { SelectValueAccessor } from './control-value-accessors/select-value-accessor';
import { TextValueAccessor } from './control-value-accessors/text-value-accessor';


import { IonNavDelegate } from './components/ion-nav';

/* Providers */
import { ActionSheetController } from './providers/action-sheet-controller';
import { AlertController } from './providers/alert-controller';
import { AngularFrameworkDelegate } from './providers/angular-framework-delegate';
import { LoadingController } from './providers/loading-controller';
import { ToastController } from './providers/toast-controller';

@NgModule({
  declarations: [
    BooleanValueAccessor,
    IonNavDelegate,
    RadioValueAccessor,
    SelectValueAccessor,
    TextValueAccessor
  ],
  exports: [
    BooleanValueAccessor,
    IonNavDelegate,
    RadioValueAccessor,
    SelectValueAccessor,
    TextValueAccessor
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class IonicAngularModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IonicAngularModule,
      providers: [
        AlertController,
        ActionSheetController,
        AngularFrameworkDelegate,
        LoadingController,
        ToastController
      ]
    };
  }
}
