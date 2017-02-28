import { Component, ViewChild } from '@angular/core';
import { Events, Nav } from '../../../../src';

import { Login } from '../pages/login';
import { Logout } from '../pages/logout';

@Component({
  templateUrl: 'app.component.html'
})
export class ApiDemoApp {
  @ViewChild(Nav) nav: Nav;

  root = Login;
  loggedIn = false;

  loggedInPages = [
    { title: 'Logout', component: Logout }
  ];

  loggedOutPages = [
    { title: 'Login', component: Login }
  ];

  constructor(private events: Events) {
    this.listenToLoginEvents();
  }

  openPage(menu: any, page: any) {
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
