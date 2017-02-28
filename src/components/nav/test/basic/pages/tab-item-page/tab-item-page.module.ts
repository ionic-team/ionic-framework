import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { TabItemPage } from './tab-item-page';


@NgModule({
  imports: [
    DeepLinkModule.forChild(TabItemPage)
  ],
  declarations: [
    TabItemPage
  ],
  entryComponents: [
    TabItemPage,
  ]
})
export class TabItemPageModule { }
