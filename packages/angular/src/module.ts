// import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { IonBooleanValueAccessor } from './directives/ion-boolean-value-accessor';
import { IonNavDelegate } from './directives/ion-nav';
import { IonRadioValueAccessor } from './directives/ion-radio-value-accessor';
import { IonSelectValueAccessor } from './directives/ion-select-value-accessor';
import { IonTextValueAccessor } from './directives/ion-text-value-accessor';

import { AlertController } from './providers/alert-controller';

@NgModule({
  declarations: [
    IonBooleanValueAccessor,
    IonNavDelegate,
    IonRadioValueAccessor,
    IonSelectValueAccessor,
    IonTextValueAccessor
  ],
  exports: [
    IonBooleanValueAccessor,
    IonNavDelegate,
    IonRadioValueAccessor,
    IonSelectValueAccessor,
    IonTextValueAccessor
  ],
  // NOTE: Not sure if we should be including this here or not, but...
  //  - If not included, ElementRef (and probably Renderer2) are not provided (needed by value accessors)
  //  - Even if included fixing above issue, NgZone (needed by ion-nav) is not provided for some reason
  // imports: [
  //   BrowserModule
  // ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    AlertController
  ]
})
export class IonicAngularModule {

}
