import { Component, ViewChild } from '@angular/core';
import { Events, Nav } from 'ionic-angular';

@Component({
  templateUrl: 'login.html'
})
export class Login {
  user = {
    name: 'Administrator',
    username: 'admin'
  };

  constructor(private events: Events) {}

  login() {
    this.events.publish('user:login');
  }

}

@Component({
  templateUrl: 'logout.html'
})
export class Logout {
  constructor(private events: Events) {}

  logout() {
    this.events.publish('user:logout');
  }
}


@Component({
  templateUrl: 'app.html'
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

  openPage(menu, page) {
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
