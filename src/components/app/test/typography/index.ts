import { Component } from '@angular/core';
import { ionicBootstrap, App } from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EApp {
  constructor(app: App) {
    app.setTitle('Basic Buttons');
  }
}

ionicBootstrap(E2EApp);
