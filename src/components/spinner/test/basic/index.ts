import {Component} from '@angular/core';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EApp {
  paused: boolean = false;

  toggleState() {
    this.paused = !this.paused;
  }
}

ionicBootstrap(E2EApp);
