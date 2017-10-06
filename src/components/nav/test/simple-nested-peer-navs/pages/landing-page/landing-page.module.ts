import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { LandingPage } from './landing-page';

@NgModule({
  imports: [
    IonicPageModule.forChild(LandingPage)
  ],
  declarations: [
    LandingPage
  ]
})
export class LandingPageModule { }
