import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { TabsPage } from './tabs';


@NgModule({
  imports: [
    IonicPageModule.forChild(TabsPage)
  ],
  declarations: [
    TabsPage
  ],
  entryComponents: [
    TabsPage,
  ]
})
export class TabsPageModule { }
