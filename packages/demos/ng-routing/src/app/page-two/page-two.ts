import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'page-two',
  template: `
  <ion-outlet></ion-outlet>
  <!-- <router-outlet></router-outlet> -->
  `
})
export class PageTwo {

  constructor(/*private navController: NavController*/private router: Router) {
  }

}
