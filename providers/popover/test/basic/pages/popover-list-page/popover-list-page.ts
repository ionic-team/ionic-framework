import { Component } from '@angular/core';
import { IonicPage, ViewController } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'popover-list-page.html'
})
export class PopoverListPage {
  constructor(private viewCtrl: ViewController) {}

  close() {
    this.viewCtrl.dismiss();
  }
}
