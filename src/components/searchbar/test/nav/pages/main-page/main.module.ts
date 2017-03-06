import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { MainPage } from './main';

@NgModule({
  declarations: [
    MainPage,
  ],
  imports: [
    DeepLinkModule.forChild(MainPage)
  ],
  entryComponents: [
    MainPage,
  ]
})
export class MainPageModule {}
