import {Component, ChangeDetectorRef} from '@angular/core';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  items: any[] = [];
  isReordering: boolean = false;

  constructor(private d: ChangeDetectorRef) {
    let nu = 30;
    for (let i = 0; i < nu; i++) {
      this.items.push(i);
    }
  }

  toggle() {
    this.isReordering = !this.isReordering;
  }

  reorder(indexes: any) {
    let element = this.items[indexes.from];
    this.items.splice(indexes.from, 1);
    this.items.splice(indexes.to, 0, element);
  }
}

ionicBootstrap(E2EPage);
