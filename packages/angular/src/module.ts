
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


import { IonNavDelegate } from './components/ion-nav';

/* Providers */
import { ActionSheetController } from './providers/action-sheet-controller';
import { AlertController } from './providers/alert-controller';
import { AngularFrameworkDelegate } from './providers/angular-framework-delegate';
import { LoadingController } from './providers/loading-controller';
import { ToastController } from './providers/toast-controller';

@NgModule({
  declarations: [
    IonNavDelegate
  ],
  exports: [
    IonNavDelegate
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    AlertController,
    ActionSheetController,
    AngularFrameworkDelegate,
    LoadingController,
    ToastController
  ]
})
export class IonicAngularModule {

}