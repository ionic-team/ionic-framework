import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { TabsPage } from './tabs';


@NgModule({
  imports: [
    DeepLinkModule.forChild(TabsPage)
  ],
  declarations: [
    TabsPage
  ],
  entryComponents: [
    TabsPage,
  ]
})
export class TabsPageModule { }
