import { Component } from '@angular/core';
import { ionicBootstrap } from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EApp {

  buttonClick(button: any) {
    console.log(button);
  }

}

ionicBootstrap(E2EApp);
