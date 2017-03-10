import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { ToolbarModal } from './toolbar';

@NgModule({
  declarations: [
    ToolbarModal,
  ],
  imports: [
    DeepLinkModule.forChild(ToolbarModal)
  ],
  entryComponents: [
    ToolbarModal,
  ]
})
export class ToolbarModalModule {}
