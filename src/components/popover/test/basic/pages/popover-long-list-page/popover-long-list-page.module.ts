import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { PopoverLongListPage } from './popover-long-list-page';

@NgModule({
  declarations: [
    PopoverLongListPage,
  ],
  imports: [
    DeepLinkModule.forChild(PopoverLongListPage)
  ],
  entryComponents: [
    PopoverLongListPage,
  ]
})
export class PopoverLongListPageModule {}
