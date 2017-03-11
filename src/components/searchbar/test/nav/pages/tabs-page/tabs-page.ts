import { Component } from '@angular/core';
import { DeepLink } from '../../../../../..';

import { SearchPage } from '../search-page/search-page';

@DeepLink()
@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  mainPage = 'MainPage';
  searchPage = SearchPage;
}
