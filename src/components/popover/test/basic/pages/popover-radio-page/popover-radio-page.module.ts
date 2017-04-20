import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { PopoverRadioPage } from './popover-radio-page';

@NgModule({
  declarations: [
    PopoverRadioPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverRadioPage)
  ],
  entryComponents: [
    PopoverRadioPage,
  ]
})
export class PopoverRadioPageModule {}
