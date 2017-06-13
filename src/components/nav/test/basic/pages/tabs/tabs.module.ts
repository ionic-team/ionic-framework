import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { TabsPage } from './tabs';


@NgModule({
  imports: [
    IonicPageModule.forChild(TabsPage)
  ],
  declarations: [
    TabsPage
  ],
  entryComponents: [
    TabsPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TabsPageModule { }
