import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicAngularModule } from '@ionic/angular';

import { ModalPageComponent } from './modal-page.component';
import { ModalRoutingModule } from './modal-routing.module';

import { PageOne } from './page-one';

@NgModule({
  imports: [
    CommonModule,
    IonicAngularModule,
    ModalRoutingModule
  ],
  declarations: [
    ModalPageComponent,
    PageOne
  ],
  providers: [
  ],
  entryComponents: [
    PageOne
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalModule { }
