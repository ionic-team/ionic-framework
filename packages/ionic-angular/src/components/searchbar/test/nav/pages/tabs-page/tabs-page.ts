import { Component } from '@angular/core';
import { IonicPage } from '../../../../../..';

import { SearchPage } from '../search-page/search-page';

@IonicPage()
@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  mainPage = 'MainPage';
  searchPage = SearchPage;
}
