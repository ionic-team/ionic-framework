import { Component } from '@angular/core';

@Component({
  template: `<ion-nav [root]="root" name="default"></ion-nav>`
})
export class AppComponent {
  root = 'FirstPage';
}
