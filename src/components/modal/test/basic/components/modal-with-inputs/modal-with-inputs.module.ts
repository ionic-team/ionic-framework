import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { ModalWithInputs } from './modal-with-inputs';

@NgModule({
  declarations: [
    ModalWithInputs,
  ],
  imports: [
    DeepLinkModule.forChild(ModalWithInputs)
  ],
  entryComponents: [
    ModalWithInputs,
  ]
})
export class ModalWithInputsModule {}
