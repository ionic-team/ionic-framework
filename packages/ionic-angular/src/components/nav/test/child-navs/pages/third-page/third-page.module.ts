import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { ThirdPage } from './third-page';

@NgModule({
  declarations: [
    ThirdPage,
  ],
  imports: [
    IonicPageModule.forChild(ThirdPage)
  ],
  entryComponents: [
    ThirdPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ThirdPageModule {}
