import { Component } from '@angular/core';
import { SessionList } from '../pages/session-list/session-list';

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class AppComponent {
  root = SessionList;
}
