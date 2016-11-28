import { Component } from '@angular/core';

@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
  demo = 'Toolbar';
  favorites = 'recent';
  apps = 'free';
}

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class ApiDemoApp {
  root = ApiDemoPage;
}
