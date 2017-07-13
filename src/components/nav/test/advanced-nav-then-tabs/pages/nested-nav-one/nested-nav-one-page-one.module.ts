import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { NestedNavOnePageOne } from './nested-nav-one-page-one';

@NgModule({
  imports: [
    IonicPageModule.forChild(NestedNavOnePageOne)
  ],
  declarations: [
    NestedNavOnePageOne
  ]
})
export class NestedNavOnePageOneModule { }
