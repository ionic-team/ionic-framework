import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { MainPage } from './main-page';

@NgModule({
  declarations: [
    MainPage,
  ],
  imports: [
    IonicPageModule.forChild(MainPage)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainPageModule {}
