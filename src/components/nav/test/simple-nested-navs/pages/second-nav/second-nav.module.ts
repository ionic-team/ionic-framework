import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { SecondNav } from './second-nav';

@NgModule({
  imports: [
    IonicPageModule.forChild(SecondNav)
  ],
  declarations: [
    SecondNav
  ]
})
export class SecondNavModule { }
