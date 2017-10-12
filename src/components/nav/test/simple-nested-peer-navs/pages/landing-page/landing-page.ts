import { Component } from '@angular/core';
import { IonicPage, NavController, } from '../../../../../..';

@IonicPage()
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>My Super Cool, multi-pane App</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col style="height: 1000px; background-color: blue">
            <ion-nav root="FirstPage" name="left"></ion-nav>
          </ion-col>
          <ion-col style="height: 1000px; background-color: green">
            <ion-nav root="FourthPage" name="right"></ion-nav>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  `
})
export class LandingPage {
  constructor(public nav: NavController) {
  }

}
