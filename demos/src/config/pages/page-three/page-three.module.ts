import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../src';

import { PageThree } from './page-three';

@NgModule({
  declarations: [
    PageThree,
  ],
  imports: [
    DeepLinkModule.forChild(PageThree),
  ],
  entryComponents: [
    PageThree,
  ]
})
export class PageThreeModule {}
