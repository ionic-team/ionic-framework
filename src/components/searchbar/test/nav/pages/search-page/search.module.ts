import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { SearchPage } from './search';

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    DeepLinkModule.forChild(SearchPage)
  ],
  entryComponents: [
    SearchPage,
  ]
})
export class SearchPageModule {}
