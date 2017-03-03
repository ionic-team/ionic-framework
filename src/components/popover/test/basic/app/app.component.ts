import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  template: '<ion-nav [root]="root"></ion-nav>',
  encapsulation: ViewEncapsulation.None
})
export class E2EApp {
  root = 'E2EPage';
}
