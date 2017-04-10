import { Component } from '@angular/core';


@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
  tokyoTime = this.calculateTime(1);

  calculateTime(offset: number) {
    // create Date object for current location
    const d = new Date();

    // create new Date object for different city
    // using supplied offset
    const nd = new Date(d.getTime() + (3600000 * offset));

    return nd.toISOString();
  }
}
