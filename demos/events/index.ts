import {App, IonicApp, Page, Events} from 'ionic-angular';

@Page({templateUrl: 'login.html'})
class Login {
  constructor(events: Events) {
    this.events = events;

    this.user = {
      name: "Administrator",
      username: "admin"
    };
  }

  login() {
    this.events.publish('user:login');
  }


}

@Page({templateUrl: 'logout.html'})
class Logout {
  constructor(events: Events) {
    this.events = events;
  }

  logout() {
    this.events.publish('user:logout');
  }
}

@App({
  templateUrl: 'main.html'
})
class ApiDemoApp {
  constructor(app: IonicApp, events: Events) {
    this.app = app;
    this.events = events;

    this.rootView = Login;
    this.loggedIn = false;

    this.pages = [
      { title: 'Logout', component: Logout, showLoggedIn: true },
      { title: 'Login', component: Login, showLoggedIn: false },
    ];

    this.listenToLoginEvents();
  }

  openPage(menu, page) {
    // find the nav component and set what the root page should be
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
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
