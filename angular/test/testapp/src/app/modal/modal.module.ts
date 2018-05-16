import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { ModalPageComponent } from './modal-page.component';
import { ModalRoutingModule } from './modal-routing.module';
import { ModalPageToPresent } from './modal-page-to-present';

@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    ModalRoutingModule
  ],
  declarations: [
    ModalPageComponent,
    ModalPageToPresent
  ],
  entryComponents: [
    ModalPageToPresent
  ]
})
export class ModalModule { }
