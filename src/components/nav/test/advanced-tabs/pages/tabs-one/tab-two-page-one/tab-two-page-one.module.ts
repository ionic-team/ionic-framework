import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../../..';
import { TabsOneTabTwoPageOne } from './tab-two-page-one';

@NgModule({
  imports: [
    IonicPageModule.forChild(TabsOneTabTwoPageOne)
  ],
  declarations: [
    TabsOneTabTwoPageOne
  ]
})
export class TabsOneTabTwoPageOneModule { }
