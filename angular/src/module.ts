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

/* Navigation */
import { IonNav } from './navigation/ion-nav';
import { IonRouterOutlet } from './navigation/ion-router-outlet';
import { IonTab } from './navigation/ion-tab';
import { IonTabs } from './navigation/ion-tabs';

/* Directives */
import { VirtualScroll } from './directives/virtual-scroll';
import { VirtualItem } from './directives/virtual-item';
import { VirtualHeader } from './directives/virtual-header';
import { VirtualFooter } from './directives/virtual-footer';

/* Providers */
import { AngularDelegate } from './providers/angular-delegate';
import { ActionSheetController } from './providers/action-sheet-controller';
import { AlertController } from './providers/alert-controller';
import { Events, setupProvideEvents } from './providers/events';
import { LoadingController } from './providers/loading-controller';
import { MenuController } from './providers/menu-controller';
import { ModalController } from './providers/modal-controller';
import { PickerController } from './providers/picker-controller';
import { Platform } from './providers/platform';
import { PopoverController } from './providers/popover-controller';
import { ToastController } from './providers/toast-controller';

@NgModule({
  declarations: [
    BooleanValueAccessor,
    IonNav,
    IonRouterOutlet,
    IonTab,
    IonTabs,
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
    IonRouterOutlet,
    IonTab,
    IonTabs,
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
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class IonicAngularModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IonicAngularModule,
      providers: [
        ModalController,
        PopoverController,
        AngularDelegate,
        AlertController,
        ActionSheetController,
        Events,
        LoadingController,
        PickerController,
        MenuController,
        Platform,
        ToastController,

        { provide: APP_INITIALIZER, useFactory: setupProvideEvents, multi: true },
      ]
    };
  }
}
