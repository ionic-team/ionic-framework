import { Component, ViewChild } from '@angular/core';
import { IonicPage, MenuController, Nav } from '../../../../../..';

@IonicPage({
  name: 'page-one'
})
@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  rootPage: any;
  changeDetectionCount: number = 0;
  pages: Array<{title: string, component: any}>;
  @ViewChild(Nav) nav: Nav;

  constructor(private menu: MenuController) {
    this.rootPage = 'page-two';

    this.pages = [
      { title: 'Page 1', component: 'page-two' },
      { title: 'Page 2', component: 'page-two' },
      { title: 'Page 3', component: 'page-two' },
    ];
  }

  openPage(page: any) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component).then(() => {
      // wait for the root page to be completely loaded
      // then close the menu
      this.menu.close();
    });
  }
}
