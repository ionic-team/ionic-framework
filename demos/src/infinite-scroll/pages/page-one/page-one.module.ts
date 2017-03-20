import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../src';

import { PageOne } from './page-one';
import { MockProvider } from './provider';

@NgModule({
  declarations: [
    PageOne,
  ],
  imports: [
    IonicPageModule.forChild(PageOne),
  ],
  entryComponents: [
    PageOne,
  ],
  providers: [
    MockProvider
  ]
})
export class PageOneModule {}
