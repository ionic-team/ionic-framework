import {Component} from '@angular/core';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  clearButton = true;

  toggleClear() {
    this.clearButton = !this.clearButton;
  }
}

ionicBootstrap(E2EPage);
