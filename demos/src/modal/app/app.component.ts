import { Component } from '@angular/core';
import { ModalFirstPage } from '../pages/page-one';

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class ApiDemoApp {
  root = ModalFirstPage;
}
