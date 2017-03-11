import { Component } from '@angular/core';
import {HomePage} from '../pages/home-page/home-page';

@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
export class AppComponent {
  root = HomePage;
}
