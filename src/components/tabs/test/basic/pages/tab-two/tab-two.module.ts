import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { TabTwo } from './tab-two';

@NgModule({
  declarations: [
    TabTwo,
  ],
  imports: [
    IonicPageModule.forChild(TabTwo)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TabTwoModule {}
