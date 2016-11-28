import { Component } from '@angular/core';

// Use the toolbar demo but pass in the demo name to change the title
@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
  demo = 'Navbar';
  favorites = 'recent';
  apps = 'free';
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class ApiDemoApp {
  root = ApiDemoPage;
}
