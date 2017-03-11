import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { HomePage } from './home-page';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    DeepLinkModule.forChild(HomePage)
  ]
})
export class HomePageModule {}
