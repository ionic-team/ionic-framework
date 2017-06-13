import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { SearchPage } from './search-page';

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPage)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SearchPageModule {}
