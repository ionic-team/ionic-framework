import { Component } from '@angular/core';
import { ComponentsPage } from '../pages/components/components';

@Component({
  template: `<assistive-touch></assistive-touch>
    <ion-nav [root]="root"></ion-nav>`
})
export class AppComponent {
  root = ComponentsPage;
}
