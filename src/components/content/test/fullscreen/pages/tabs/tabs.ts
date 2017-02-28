import { Component } from '@angular/core';

import { RootPage } from '../root-page/root-page';
import { Page1 } from '../page1/page1';
import { Page2 } from '../page2/page2';
import { Page3 } from '../page3/page3';
import { Page4 } from '../page4/page4';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  rootPage = RootPage;
  page1 = Page1;
  page2 = Page2;
  page3 = Page3;
  page4 = Page4;
}
