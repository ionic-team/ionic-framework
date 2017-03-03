import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { Page1 } from './page1';

@NgModule({
  declarations: [
    Page1,
  ],
  imports: [
    DeepLinkModule.forChild(Page1)
  ],
  entryComponents: [
    Page1,
  ]
})
export class Page1Module {}
