import { Component } from '@angular/core';
import { IonicPage, Tabs } from '../../../../../..';

@IonicPage({
  name: 'tab1-page2'
})
@Component({
  templateUrl: './tab1-page2.html'
})
export class Tab1Page2 {
  tab1Page3 = 'tab1-page3';

  constructor(public tabs: Tabs) { }

  favoritesTab() {
    // TODO fix this with tabsHideOnSubPages=true
    this.tabs.select(1);
  }

  ionViewWillEnter() {
    console.log('Tab1Page2, ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('Tab1Page2, ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('Tab1Page2, ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('Tab1Page2, ionViewDidLeave');
  }

  ionViewWillUnload() {
    console.log('Tab1Page2, ionViewWillUnload');
  }
}
