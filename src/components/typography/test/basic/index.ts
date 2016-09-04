import { Component } from '@angular/core';
import { ionicBootstrap, App } from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  dynamicColor: string = "secondary";

  constructor(app: App) {
    app.setTitle('Basic Buttons');
  }
}

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = E2EPage;
}

ionicBootstrap(E2EApp);
