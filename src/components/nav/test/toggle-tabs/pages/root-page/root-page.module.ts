import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { RootPage } from './root-page';

@NgModule({
  imports: [
    IonicPageModule.forChild(RootPage)
  ],
  declarations: [
    RootPage
  ]
})
export class RootPageModule { }
