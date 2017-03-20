import { Component } from '@angular/core';
import { IonicPage, NavController } from '../../../../../..';

import { SomeData } from './provider-one';
import { OtherData } from './provider-two';

@IonicPage({
  name: 'page-one'
})
@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  page2 = 'page-two';
  sort: string = 'all';

  constructor(public navCtrl: NavController, public someData: SomeData, public otherData: OtherData) {
    console.log('Got some data from', someData.getData());
    console.log('Got some data from', otherData.getData());
  }

  goToTabs() {
    this.navCtrl.push('tabs-page');
  }
}
