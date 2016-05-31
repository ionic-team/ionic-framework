import {Component} from '@angular/core';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  blockButton = true;

  toggleBlock() {
    this.blockButton = !this.blockButton;
  }
}

ionicBootstrap(E2EPage);
