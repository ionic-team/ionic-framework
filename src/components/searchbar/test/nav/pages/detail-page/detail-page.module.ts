import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { DetailPage } from './detail-page';

@NgModule({
  declarations: [
    DetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailPage)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DetailPageModule {}
