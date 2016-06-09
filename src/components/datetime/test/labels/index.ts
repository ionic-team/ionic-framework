import {Component} from '@angular/core';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  stacked2 = '1994-12-15T13:47:20.789';
  floating2 = '1995-04-15';
  fixed2 = '2002-09-23T15:03:46.789';
  inline2 = '2005-06-17T11:06Z';
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = E2EPage;
}

ionicBootstrap(E2EApp);
