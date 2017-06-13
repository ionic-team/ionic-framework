import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { ModalWithInputs } from './modal-with-inputs';

@NgModule({
  declarations: [
    ModalWithInputs,
  ],
  imports: [
    IonicPageModule.forChild(ModalWithInputs)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalWithInputsModule {}
