import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { TabItemPage } from './tab-item-page';


@NgModule({
  imports: [
    IonicPageModule.forChild(TabItemPage)
  ],
  declarations: [
    TabItemPage
  ],
  entryComponents: [
    TabItemPage,
  ]
})
export class TabItemPageModule { }
