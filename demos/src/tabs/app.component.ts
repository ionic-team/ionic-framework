import { Component } from '@angular/core';

@Component({
  template: '<div>johnny utah</div>',
})
export class TabPage {}


@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
  root = TabPage;
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class ApiDemoApp {
  root = ApiDemoPage;
}
