import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { FourthPage } from './fourth-page';

@NgModule({
  declarations: [
    FourthPage,
  ],
  imports: [
    DeepLinkModule.forChild(FourthPage)
  ],
  entryComponents: [
    FourthPage,
  ]
})
export class FourthPageModule {}
