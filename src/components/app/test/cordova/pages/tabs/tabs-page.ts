import { Component } from '@angular/core';
import { NavController } from '../../../../../..';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  tab1Root = 'tabs-page-one';
  tab2Root = 'page-two';
  tab3Root = 'page-three';

  constructor(public navCtrl: NavController) {}

  goBack() {
    this.navCtrl.pop();
  }
}
