import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { MainPage } from './main-page';

@NgModule({
  declarations: [
    MainPage,
  ],
  imports: [
    IonicPageModule.forChild(MainPage)
  ]
})
export class MainPageModule {}
