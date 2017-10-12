import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../../..';
import { FirstPage } from './first-page';

@NgModule({
  imports: [
    IonicPageModule.forChild(FirstPage)
  ],
  declarations: [
    FirstPage
  ]
})
export class FirstPageModule { }
