import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { HomePage } from './home';

@NgModule({
  imports: [
    IonicPageModule.forChild(HomePage)
  ],
  declarations: [
    HomePage
  ]
})
export class HomePageModule { }
