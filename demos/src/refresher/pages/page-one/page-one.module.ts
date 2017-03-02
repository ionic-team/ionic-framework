import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../src';

import { PageOne } from './page-one';
import { MockProvider } from './provider';

@NgModule({
  declarations: [
    PageOne,
  ],
  imports: [
    DeepLinkModule.forChild(PageOne),
  ],
  entryComponents: [
    PageOne,
  ],
  providers: [
    MockProvider
  ]
})
export class PageOneModule {}
