import { Component } from '@angular/core';


@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
  isDisabled = true;
}

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class ApiDemoApp {
  root = ApiDemoPage;
}
