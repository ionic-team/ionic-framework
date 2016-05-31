import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Events, Nav} from 'ionic-angular';


@Component({templateUrl: 'login.html'})
class Login {
  user = {
    name: "Administrator",
    username: "admin"
  };

  constructor(private events: Events) {}

  login() {
    this.events.publish('user:login');
  }

}

@Component({templateUrl: 'logout.html'})
class Logout {
  constructor(private events: Events) {}

  logout() {
    this.events.publish('user:logout');
  }
}

@Component({
  templateUrl: 'main.html'
})
class ApiDemoApp {
  @ViewChild(Nav) nav: Nav;

  rootView = Login;
  loggedIn = false;

  pages = [
    { title: 'Logout', component: Logout, showLoggedIn: true },
    { title: 'Login', component: Login, showLoggedIn: false },
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

ionicBootstrap(ApiDemoApp);
