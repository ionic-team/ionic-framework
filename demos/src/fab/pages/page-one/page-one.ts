import { Component } from '@angular/core';
import { FabContainer } from '../../../../../src';

@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  array: number[] = [];

  add() {
    this.array.push(1);
  }

  clickMainFAB() {
    console.log('Clicked open social menu');
  }

  openSocial(network: string, fab: FabContainer) {
    console.log('Share in ' + network);
    fab.close();
  }
}