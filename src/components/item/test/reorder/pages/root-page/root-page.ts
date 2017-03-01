import { Component, ChangeDetectorRef } from '@angular/core';
import { reorderArray } from '../../../../../..';

@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
  items: any[] = [];
  isReordering: boolean = false;

  constructor(private d: ChangeDetectorRef) {
    let nu = 9;
    for (let i = 0; i < nu; i++) {
      this.items.push(i);
    }
  }

  clickedButton(num: number) {
    console.log('clicked', num);
  }

  toggle() {
    this.isReordering = !this.isReordering;
  }

  reorder(indexes: any) {
    this.items = reorderArray(this.items, indexes);
  }
}
