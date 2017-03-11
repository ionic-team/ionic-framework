import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { SearchPage } from './search-page';

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    DeepLinkModule.forChild(SearchPage)
  ]
})
export class SearchPageModule {}
