import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { ModalPage } from './modal-page';

@NgModule({
  declarations: [
    ModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalPage)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalPageModule {}
