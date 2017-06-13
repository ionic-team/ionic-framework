import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { TabThree } from './tab-three';

@NgModule({
  declarations: [
    TabThree,
  ],
  imports: [
    IonicPageModule.forChild(TabThree)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TabThreeModule {}
