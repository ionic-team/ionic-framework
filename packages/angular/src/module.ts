import { CommonModule } from '@angular/common';
import {
  ModuleWithProviders,
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';

import { BooleanValueAccessor } from './control-value-accessors/boolean-value-accessor';
import { NumericValueAccessor } from './control-value-accessors/numeric-value-accesssor';
import { RadioValueAccessor } from './control-value-accessors/radio-value-accessor';
import { SelectValueAccessor } from './control-value-accessors/select-value-accessor';
import { TextValueAccessor } from './control-value-accessors/text-value-accessor';


/* Components */
import { IonNavDelegate } from './components/ion-nav';

/* Providers */
import { ActionSheetController } from './providers/action-sheet-controller';
import { AlertController } from './providers/alert-controller';
import { AngularComponentMounter } from './providers/angular-component-mounter';
import { LoadingController } from './providers/loading-controller';
import { ModalController } from './providers/modal-controller';
import { PopoverController } from './providers/popover-controller';
import { ToastController } from './providers/toast-controller';

@NgModule({
  declarations: [
    BooleanValueAccessor,
    IonNavDelegate,
    NumericValueAccessor,
    RadioValueAccessor,
    SelectValueAccessor,
    TextValueAccessor
  ],
  exports: [
    BooleanValueAccessor,
    IonNavDelegate,
    NumericValueAccessor,
    RadioValueAccessor,
    SelectValueAccessor,
    TextValueAccessor
  ],
  imports: [
    CommonModule,
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
        AngularComponentMounter,
        LoadingController,
        ModalController,
        PopoverController,
        ToastController
      ]
    };
  }
}
