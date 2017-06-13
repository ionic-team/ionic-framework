import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PopoverRadioPageModule {}
