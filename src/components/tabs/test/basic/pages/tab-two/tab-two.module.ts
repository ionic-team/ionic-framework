import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { TabTwo } from './tab-two';

@NgModule({
  declarations: [
    TabTwo,
  ],
  imports: [
    IonicPageModule.forChild(TabTwo)
  ]
})
export class TabTwoModule {}
