import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { SidePage } from './side-page';

@NgModule({
  declarations: [
    SidePage,
  ],
  imports: [
    IonicPageModule.forChild(SidePage)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SidePageModule {}
