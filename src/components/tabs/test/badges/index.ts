import { Component, ViewEncapsulation } from '@angular/core';
import { ionicBootstrap } from '../../../../../src';

@Component({template: 'hi'})
class E2EPage {}


@Component({
  templateUrl: 'main.html',
  styleUrls: ['styles.css'],
  encapsulation: ViewEncapsulation.None
})
class E2EApp {
  root = E2EPage;
  myBadge: number = 55;
}

ionicBootstrap(E2EApp);
