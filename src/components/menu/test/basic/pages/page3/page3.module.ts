import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { Page3 } from './page3';

@NgModule({
  declarations: [
    Page3,
  ],
  imports: [
    DeepLinkModule.forChild(Page3)
  ],
  entryComponents: [
    Page3,
  ]
})
export class Page3Module {}
