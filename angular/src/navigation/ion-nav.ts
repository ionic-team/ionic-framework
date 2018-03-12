import { Component, ViewEncapsulation } from '@angular/core';
import {
  NavigationEnd,
  NavigationStart,
  Router
} from '@angular/router';


@Component({
  selector: 'ion-nav',
  template: '<ng-content></ng-content>',
  styles: [`
    ion-nav > :not(.show-page) { display: none; }
  `],
  encapsulation: ViewEncapsulation.None
})
export class IonNav {

  constructor(router: Router) {
    console.log('ion-nav');

    router.events.subscribe(ev => {
      if (ev instanceof NavigationStart) {
        console.log('NavigationStart', ev.url);

      } else if (ev instanceof NavigationEnd) {
        console.log('NavigationEnd', ev.url);
      }
    });
  }

}
