import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { SearchPage } from './search-page';

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPage)
  ]
})
export class SearchPageModule {}
