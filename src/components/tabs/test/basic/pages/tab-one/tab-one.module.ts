import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { TabOne } from './tab-one';

@NgModule({
  declarations: [
    TabOne,
  ],
  imports: [
    IonicPageModule.forChild(TabOne)
  ]
})
export class TabOneModule {}
