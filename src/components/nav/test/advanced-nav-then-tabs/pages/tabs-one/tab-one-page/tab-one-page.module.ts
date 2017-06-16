import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../../..';
import { TabOnePage } from './tab-one-page';

@NgModule({
  imports: [
    IonicPageModule.forChild(TabOnePage)
  ],
  declarations: [
    TabOnePage
  ]
})
export class TabOnePageModule { }
