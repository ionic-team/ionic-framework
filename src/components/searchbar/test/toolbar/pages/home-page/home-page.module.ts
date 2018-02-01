import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { HomePage } from './home-page';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage)
  ]
})
export class HomePageModule {}
