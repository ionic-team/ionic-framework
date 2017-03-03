import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { FirstPage } from './first-page';

@NgModule({
  declarations: [
    FirstPage,
  ],
  imports: [
    DeepLinkModule.forChild(FirstPage)
  ],
  entryComponents: [
    FirstPage,
  ]
})
export class FirstPageModule {}
