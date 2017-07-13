import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { NonTabOne } from './non-tab-one';

@NgModule({
  imports: [
    IonicPageModule.forChild(NonTabOne)
  ],
  declarations: [
    NonTabOne
  ]
})
export class NonTabOneModule { }
