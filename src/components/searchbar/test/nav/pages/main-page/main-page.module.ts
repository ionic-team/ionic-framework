import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { MainPage } from './main-page';

@NgModule({
  declarations: [
    MainPage,
  ],
  imports: [
    DeepLinkModule.forChild(MainPage)
  ]
})
export class MainPageModule {}
