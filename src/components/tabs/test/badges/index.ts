import {Component, ViewEncapsulation} from '@angular/core';
import {ionicBootstrap} from '../../../../../src';


@Component({
  templateUrl: 'main.html',
  styleUrls: ['styles.css'],
  encapsulation: ViewEncapsulation.None
})
class E2EApp {
  myBadge:number = 55;
}

ionicBootstrap(E2EApp);
