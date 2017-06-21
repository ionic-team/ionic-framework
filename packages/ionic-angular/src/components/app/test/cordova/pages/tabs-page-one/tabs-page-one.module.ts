import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { TabsPageOne } from './tabs-page-one';

@NgModule({
  declarations: [
    TabsPageOne,
  ],
  imports: [
    IonicPageModule.forChild(TabsPageOne)
  ],
  entryComponents: [
    TabsPageOne,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TabsPageOneModule {}
