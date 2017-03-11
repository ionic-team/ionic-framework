import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { PageOne } from './page-one';
import { PageTwoModule } from '../page-two/page-two.module';

@NgModule({
  declarations: [
    PageOne,
  ],
  imports: [
    DeepLinkModule.forChild(PageOne),
    PageTwoModule
  ]
})
export class PageOneModule {}
