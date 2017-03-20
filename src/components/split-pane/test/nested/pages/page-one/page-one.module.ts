import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { PageOne } from './page-one';

import { PageTwoModule } from '../page-two/page-two.module';
import { PageThreeModule } from '../page-three/page-three.module';
import { PageFourModule } from '../page-four/page-four.module';

@NgModule({
  declarations: [
    PageOne,
  ],
  imports: [
    IonicPageModule.forChild(PageOne),
    PageTwoModule,
    PageThreeModule,
    PageFourModule
  ]
})
export class PageOneModule {}
