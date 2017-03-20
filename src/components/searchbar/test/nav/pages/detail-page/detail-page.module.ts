import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { DetailPage } from './detail-page';

@NgModule({
  declarations: [
    DetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailPage)
  ]
})
export class DetailPageModule {}
