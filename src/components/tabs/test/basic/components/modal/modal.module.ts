import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { MyModal } from './modal';

@NgModule({
  declarations: [
    MyModal,
  ],
  imports: [
    IonicPageModule.forChild(MyModal)
  ],
  entryComponents: [
    MyModal,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MyModalModule {}
