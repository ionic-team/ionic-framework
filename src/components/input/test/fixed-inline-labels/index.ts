import { Component } from '@angular/core';
import { ionicBootstrap } from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class PageOne {
  url: string;
  input1: string = 'Text 1';

  onEvent(event: any) {
    console.log('Did Event:', event.type);
  }
}

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = PageOne;
}

ionicBootstrap(E2EApp);
