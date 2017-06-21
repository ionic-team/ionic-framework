import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { E2EPage } from './main';

@NgModule({
  declarations: [
    E2EPage,
  ],
  imports: [
    IonicPageModule.forChild(E2EPage)
  ],
  entryComponents: [
    E2EPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class E2EPageModule {}
