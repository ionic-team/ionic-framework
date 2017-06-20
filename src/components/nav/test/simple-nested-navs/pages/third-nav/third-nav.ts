import { Component } from '@angular/core';
import { IonicPage, NavController } from '../../../../../..';

@IonicPage()
@Component({
  selector: 'page-home',
  template: `
  <ion-nav [root]="rootPage"></ion-nav>

  `
})
export class ThirdNav {

  rootPage: any = 'ThirdPage';
  constructor(public navCtrl: NavController) {

  }

}
