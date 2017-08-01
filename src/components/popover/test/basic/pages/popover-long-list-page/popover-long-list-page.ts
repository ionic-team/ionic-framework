import { Component } from '@angular/core';
import { IonicPage } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'popover-long-list-page.html'
})
export class PopoverLongListPage {
  items: number[] = [];

  ngOnInit() {
    for (let i = 1; i < 21; i++) {
      this.items.push(i);
    }
  }
}
