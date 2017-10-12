import { Component } from '@angular/core';
import { IonicPage } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'first-page.html'
})
export class FirstPage {
  pushPage: any = 'SecondPage';
  visible: boolean = false;
  buttons: number[] = [1, 2, 3, 4, 5];

  ionViewDidEnter() {
    this.visible = true;
  }
}
