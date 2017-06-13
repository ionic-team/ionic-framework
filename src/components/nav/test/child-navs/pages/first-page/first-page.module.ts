import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { FirstPage } from './first-page';

@NgModule({
  declarations: [
    FirstPage,
  ],
  imports: [
    IonicPageModule.forChild(FirstPage)
  ],
  entryComponents: [
    FirstPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FirstPageModule {}
