import { Component } from '@angular/core';

@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {

  submit(ev: any) {
    console.debug('submit', ev);
  }
}
