import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { Page2 } from './page2';

@NgModule({
  declarations: [
    Page2,
  ],
  imports: [
    DeepLinkModule.forChild(Page2)
  ],
  entryComponents: [
    Page2,
  ]
})
export class Page2Module {}
