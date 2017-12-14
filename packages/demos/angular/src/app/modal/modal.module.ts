import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicAngularModule } from '@ionic/angular';

import { ModalPageComponent } from './modal-page.component';
import { ModalRoutingModule } from './modal-routing.module';

import { ModalPageToPresent } from './modal-page-to-present';

@NgModule({
  imports: [
    CommonModule,
    IonicAngularModule.forRoot(),
    ModalRoutingModule
  ],
  declarations: [
    ModalPageComponent,
    ModalPageToPresent
  ],
  providers: [
  ],
  entryComponents: [
    ModalPageToPresent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalModule { }
