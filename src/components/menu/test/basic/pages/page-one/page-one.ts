import { Component, ViewChild } from '@angular/core';
import { IonicPage, MenuController, Nav } from '../../../../../..';

import { PageTwo } from '../page-two/page-two';

@IonicPage()
@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  rootPage: any;
  changeDetectionCount: number = 0;
  pages: Array<{ title: string, component: any }>;
  @ViewChild(Nav) nav: Nav;

  constructor(public menuCtrl: MenuController) {
    this.rootPage = PageTwo;

    this.pages = [
      { title: 'Page 1', component: PageTwo },
      { title: 'Page 2', component: 'PageThree' },
      { title: 'Page 3', component: 'PageFour' },
    ];
  }

  openPage(page: any) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component).then(() => {
      // wait for the root page to be completely loaded
      // then close the menu
      this.menuCtrl.close();
    });
  }

  openRightMenu() {
    this.menuCtrl.open('right');
  }

  openLeftMenu() {
    this.menuCtrl.open('left');
  }

  onDrag(ev: any) {
    console.log('Menu is being dragged', ev);
  }

  onOpen(ev: any) {
    console.log('Menu is open', ev);
  }

  onClose(ev: any) {
    console.log('Menu is closed', ev);
  }

  isChangeDetecting() {
    console.log('Change detection', ++this.changeDetectionCount);
    return true;
  }
}
