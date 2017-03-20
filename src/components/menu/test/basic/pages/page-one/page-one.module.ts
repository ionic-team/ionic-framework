import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { PageOne } from './page-one';
import { PageTwoModule } from '../page-two/page-two.module';

@NgModule({
  declarations: [
    PageOne,
  ],
  imports: [
    IonicPageModule.forChild(PageOne),
    PageTwoModule
  ]
})
export class PageOneModule {}
