import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { NestedNavTwoPageOne } from './nested-nav-two-page-one';

@NgModule({
  imports: [
    IonicPageModule.forChild(NestedNavTwoPageOne)
  ],
  declarations: [
    NestedNavTwoPageOne
  ]
})
export class NestedNavTwoPageOneModule { }
