import { Component, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'page-two',
  template: `
  <ion-nav></ion-nav>
  <!-- <router-outlet></router-outlet> -->
  `
})
export class PageTwo {

  constructor(/*private navController: NavController*/private router: Router, private location: Location) {
  }

  pushPageThree() {
    this.router.navigateByUrl('/page-three');
  }

  goBack() {
    window.history.back();
  }
}
