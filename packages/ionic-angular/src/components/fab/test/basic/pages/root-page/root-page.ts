import { Component } from '@angular/core';

import { FabContainer } from '../../../../../../';


@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
  array: number[] = [];
  log: string = '';

  add() {
    this.array.push(1);
    this.log += 'add\n';
  }

  clickMainFAB() {
    let message = 'Clicked open social menu';

    console.log(message);
    this.log += message + '\n';
  }

  openSocial(network: string, fab: FabContainer) {
    let message = 'Share in ' + network;

    console.log(message);
    this.log += message + '\n';

    fab.close();
  }
}
