import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { TabsPageOne } from './tabs-page-one';

@NgModule({
  declarations: [
    TabsPageOne,
  ],
  imports: [
    IonicPageModule.forChild(TabsPageOne)
  ],
  entryComponents: [
    TabsPageOne,
  ]
})
export class TabsPageOneModule {}
