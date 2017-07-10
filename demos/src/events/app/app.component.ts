import { Component, ViewChild } from '@angular/core';
import { Events, Nav } from '../../../../src';

import { PageOne } from '../pages/page-one/page-one';
import { PageTwo } from '../pages/page-two/page-two';

@Component({
  templateUrl: 'app.component.html'
})
export class AppComponent {

  @ViewChild(Nav) nav: Nav;

  root = PageOne;
  loggedIn = false;

  loggedInPages = [
    { title: 'Logout', component: PageTwo }
  ];

  loggedOutPages = [
    { title: 'Login', component: PageOne }
  ];

  constructor(private events: Events) {
    this.listenToLoginEvents();
  }

  openPage(_: any, page: any) {
    // find the nav component and set what the root page should be
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.loggedIn = true;
    });

    this.events.subscribe('user:logout', () => {
      this.loggedIn = false;
    });
  }
}
