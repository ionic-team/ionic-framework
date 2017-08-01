import { Component } from '@angular/core';

import { LandingPage } from '../pages/landing-page/landing-page';

@Component({
  template: `<ion-nav [root]="root"></ion-nav>`,
})
export class AppComponent {
  root = LandingPage;
}
