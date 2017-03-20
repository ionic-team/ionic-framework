import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { TabsPage } from './tabs-page';

@NgModule({
  declarations: [
    TabsPage,
  ],
  imports: [
    IonicPageModule.forChild(TabsPage)
  ],
  entryComponents: [
    TabsPage,
  ]
})
export class TabsPageModule {}
