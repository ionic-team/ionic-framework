import { Component } from '@angular/core';

@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
export class AppComponent {
  root = 'LoginPage';
}
