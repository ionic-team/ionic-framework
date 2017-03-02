import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

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
