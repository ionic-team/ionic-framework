import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { PopoverListPage } from './popover-list-page';

@NgModule({
  declarations: [
    PopoverListPage,
  ],
  imports: [
    DeepLinkModule.forChild(PopoverListPage)
  ],
  entryComponents: [
    PopoverListPage,
  ]
})
export class PopoverListPageModule {}
