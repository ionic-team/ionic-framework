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


/* Directives */
import { IonNavDelegate } from './directives/ion-nav';
import { MenuToggle } from './directives/menu-toggle';

/* Providers */
import { ActionSheetController } from './providers/action-sheet-controller';
import { AlertController } from './providers/alert-controller';
import { AngularComponentMounter } from './providers/angular-component-mounter';
import { App } from './providers/app';
import { Events } from './providers/events';
import { LoadingController } from './providers/loading-controller';
import { MenuController } from './providers/menu-controller';
import { ModalController } from './providers/modal-controller';
import { PopoverController } from './providers/popover-controller';
import { ToastController } from './providers/toast-controller';

@NgModule({
  declarations: [
    BooleanValueAccessor,
    IonNavDelegate,
    MenuToggle,
    NumericValueAccessor,
    RadioValueAccessor,
    SelectValueAccessor,
    TextValueAccessor
  ],
  exports: [
    BooleanValueAccessor,
    IonNavDelegate,
    MenuToggle,
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
        App,
        Events,
        LoadingController,
        MenuController,
        ModalController,
        PopoverController,
        ToastController
      ]
    };
  }
}
