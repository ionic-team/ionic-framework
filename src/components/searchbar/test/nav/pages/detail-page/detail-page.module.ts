import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { DetailPage } from './detail-page';

@NgModule({
  declarations: [
    DetailPage,
  ],
  imports: [
    DeepLinkModule.forChild(DetailPage)
  ]
})
export class DetailPageModule {}
