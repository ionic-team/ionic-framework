import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { FourthPage } from './fourth-page';

@NgModule({
  declarations: [
    FourthPage,
  ],
  imports: [
    IonicPageModule.forChild(FourthPage)
  ],
  entryComponents: [
    FourthPage,
  ]
})
export class FourthPageModule {}
