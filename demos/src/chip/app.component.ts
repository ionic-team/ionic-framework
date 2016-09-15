import { Component } from '@angular/core';

@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
  delete(chip: Element) {
    chip.remove();
  }
}

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class ApiDemoApp {
  root = ApiDemoPage;
}

