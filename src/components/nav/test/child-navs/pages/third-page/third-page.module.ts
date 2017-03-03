import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { ThirdPage } from './third-page';

@NgModule({
  declarations: [
    ThirdPage,
  ],
  imports: [
    DeepLinkModule.forChild(ThirdPage)
  ],
  entryComponents: [
    ThirdPage,
  ]
})
export class ThirdPageModule {}
