import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { FourthPage } from './fourth-page';

@NgModule({
  declarations: [
    FourthPage,
  ],
  imports: [
    IonicPageModule.forChild(FourthPage)
  ],
  entryComponents: [
    FourthPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FourthPageModule {}
