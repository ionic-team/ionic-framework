import {Component} from '@angular/core';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {

  deleteClicked() {
    console.log('deleteClicked');
  }

}

ionicBootstrap(E2EPage);
