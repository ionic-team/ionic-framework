import { Component } from '@angular/core';

@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  testClick(ev: UIEvent) {
    console.log(ev);
  }
}
