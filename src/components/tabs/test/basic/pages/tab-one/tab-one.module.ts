import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { TabOne } from './tab-one';

@NgModule({
  declarations: [
    TabOne,
  ],
  imports: [
    IonicPageModule.forChild(TabOne)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TabOneModule {}
