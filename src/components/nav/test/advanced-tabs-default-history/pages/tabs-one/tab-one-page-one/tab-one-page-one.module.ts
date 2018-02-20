import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../../..';
import { TabsOneTabOnePageOne } from './tab-one-page-one';

@NgModule({
  imports: [
    IonicPageModule.forChild(TabsOneTabOnePageOne)
  ],
  declarations: [
    TabsOneTabOnePageOne
  ]
})
export class TabsOneTabOnePageOneModule { }
