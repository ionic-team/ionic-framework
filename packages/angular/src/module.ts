import { CommonModule } from '@angular/common';
import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  ModuleWithProviders,
  NgModule
} from '@angular/core';

import { BooleanValueAccessor } from './control-value-accessors/boolean-value-accessor';
import { NumericValueAccessor } from './control-value-accessors/numeric-value-accesssor';
import { RadioValueAccessor } from './control-value-accessors/radio-value-accessor';
import { SelectValueAccessor } from './control-value-accessors/select-value-accessor';
import { TextValueAccessor } from './control-value-accessors/text-value-accessor';

/* Directives */
import { IonNav } from './directives/ion-nav';
import { VirtualScroll } from './directives/virtual-scroll';
import { VirtualItem } from './directives/virtual-item';
import { VirtualHeader } from './directives/virtual-header';
import { VirtualFooter } from './directives/virtual-footer';

/* Providers */
import { ActionSheetController } from './providers/action-sheet-controller';
import { AlertController } from './providers/alert-controller';
import { AngularComponentMounter } from './providers/angular-component-mounter';
import { App } from './providers/app';
import { Events, setupProvideEvents } from './providers/events';
import { LoadingController } from './providers/loading-controller';
import { MenuController } from './providers/menu-controller';
import { ModalController } from './providers/modal-controller';
import { Platform } from './providers/platform';
import { PopoverController } from './providers/popover-controller';
import { ToastController } from './providers/toast-controller';

@NgModule({
  declarations: [
    BooleanValueAccessor,
    IonNav,
    NumericValueAccessor,
    RadioValueAccessor,
    SelectValueAccessor,
    TextValueAccessor,
    VirtualScroll,
    VirtualItem,
    VirtualHeader,
    VirtualFooter,
  ],
  exports: [
    BooleanValueAccessor,
    IonNav,
    NumericValueAccessor,
    RadioValueAccessor,
    SelectValueAccessor,
    TextValueAccessor,

    VirtualScroll,
    VirtualItem,
    VirtualHeader,
    VirtualFooter
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    ModalController,
    PopoverController,
    AngularComponentMounter
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class IonicAngularModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IonicAngularModule,
      providers: [
        AlertController,
        ActionSheetController,
        App,
        Events,
        LoadingController,
        MenuController,
        Platform,
        ToastController,

        { provide: APP_INITIALIZER, useFactory: setupProvideEvents, multi: true },
      ]
    };
  }
}
