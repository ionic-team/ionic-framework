import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { ModalWithInputs } from './modal-with-inputs';

@NgModule({
  declarations: [
    ModalWithInputs,
  ],
  imports: [
    IonicPageModule.forChild(ModalWithInputs)
  ]
})
export class ModalWithInputsModule {}
