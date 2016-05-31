import {Component} from '@angular/core';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EApp {
  defaultToolbarSearch: string = '';
  primaryToolbarSearch: string = '';
  dangerToolbarSearch: string = '';
  lightToolbarSearch: string = '';
}

ionicBootstrap(E2EApp);
