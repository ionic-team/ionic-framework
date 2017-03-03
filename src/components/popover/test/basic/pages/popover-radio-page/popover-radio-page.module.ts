import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { PopoverRadioPage } from './popover-radio-page';

@NgModule({
  declarations: [
    PopoverRadioPage,
  ],
  imports: [
    DeepLinkModule.forChild(PopoverRadioPage)
  ],
  entryComponents: [
    PopoverRadioPage,
  ]
})
export class PopoverRadioPageModule {}
