import {Component} from '@angular/core';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EApp {
  doRefresh() {
    console.log('DOREFRESH')
  }
}

ionicBootstrap(E2EApp);
