import { Component } from '@angular/core';
import { Page1 } from '../pages/page-one';

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class ApiDemoApp {
  root = Page1;
}