import { Component } from '@angular/core';
import {ComponentsPage} from '../pages/components/components';

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class AppComponent {
  root = ComponentsPage;
}
