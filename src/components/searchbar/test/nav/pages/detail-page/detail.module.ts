import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { DetailPage } from './detail';

@NgModule({
  declarations: [
    DetailPage,
  ],
  imports: [
    DeepLinkModule.forChild(DetailPage)
  ],
  entryComponents: [
    DetailPage,
  ]
})
export class DetailPageModule {}
