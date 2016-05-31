import {Component} from '@angular/core';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {

  submit(ev) {
    console.debug('submit', ev);
  }
}

ionicBootstrap(E2EPage);
