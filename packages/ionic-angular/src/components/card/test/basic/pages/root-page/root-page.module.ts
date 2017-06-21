import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { RootPage } from './root-page';

@NgModule({
  declarations: [
    RootPage,
  ],
  imports: [
    IonicPageModule.forChild(RootPage)
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class RootPageModule {}
