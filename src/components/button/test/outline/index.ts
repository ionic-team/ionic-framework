import {Component} from '@angular/core';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  outlineButton = true;

  toggleOutline() {
    this.outlineButton = !this.outlineButton;
  }
}

ionicBootstrap(E2EPage);
