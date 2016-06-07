import {Component} from '@angular/core';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  testClick(ev) {
    console.log('CLICK!', ev.target.tagName, ev.target.textContent.trim());
  }
}

ionicBootstrap(E2EPage);
