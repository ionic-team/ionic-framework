import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { MyModal } from './modal';

@NgModule({
  declarations: [
    MyModal,
  ],
  imports: [
    DeepLinkModule.forChild(MyModal)
  ],
  entryComponents: [
    MyModal,
  ]
})
export class MyModalModule {}
