import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../src';

import { PageOne } from './page-one';

@NgModule({
  declarations: [
    PageOne,
  ],
  imports: [
    DeepLinkModule.forChild(PageOne),
  ],
  entryComponents: [
    PageOne,
  ]
})
export class PageOneModule {}
