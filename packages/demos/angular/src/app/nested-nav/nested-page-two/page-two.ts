import { Component, ViewEncapsulation } from '@angular/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'page-two',
  template: `
  <ion-nav></ion-nav>
  <!-- <router-outlet></router-outlet> -->
  `
})
export class PageTwo {

  constructor(private navController: NavController) {
  }

  pushPageThree() {
    this.navController.push('/nested-nav/nested-page-three');
  }

  goBack() {
    window.history.back();
  }
}
