import { Component } from '@angular/core';
import { DeepLink, ViewController } from '../../../../../..';

@DeepLink()
@Component({
  templateUrl: 'popover-list-page.html'
})
export class PopoverListPage {
  constructor(private viewCtrl: ViewController) {}

  close() {
    this.viewCtrl.dismiss();
  }
}
