import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-navigation-page2',
  templateUrl: './navigation-page2.component.html',
})
export class NavigationPage2Component {
  constructor(
    private navController: NavController
  ) {}

  ionViewDidEnter() {
    this.navController.navigateForward('/navigation/page1');
  }
}
