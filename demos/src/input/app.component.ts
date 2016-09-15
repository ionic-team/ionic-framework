import { Component } from '@angular/core';


@Component({
  templateUrl: 'main.html'
})
export class ApiDemoPage {}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class ApiDemoApp {
  root = ApiDemoPage;
}
