import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ToolbarModalModule {}
