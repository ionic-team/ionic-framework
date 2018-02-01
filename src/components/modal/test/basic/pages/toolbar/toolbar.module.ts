import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { ToolbarModal } from './toolbar';

@NgModule({
  declarations: [
    ToolbarModal,
  ],
  imports: [
    IonicPageModule.forChild(ToolbarModal)
  ],
  entryComponents: [
    ToolbarModal,
  ]
})
export class ToolbarModalModule {}
