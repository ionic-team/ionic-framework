import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';

import {
  Events,
  MenuController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { ConferenceData } from './providers/conference-data';
import { UserData } from './providers/user-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  loggedIn = false;
  constructor(
    private events: Events,
    private router: Router,
    private userData: UserData) {
  }

  ngOnInit() {
    this.checkLoginStatus();
    // this.listenForLoginEvents();
    /*setInterval(() => {
      this.loggedIn = !this.loggedIn;
    }, 2000);
    */
  }

  checkLoginStatus() {

    // synchronous works
    // this.loggedIn = true;


    // from resolved promise works
    /*return Promise.resolve().then(() => {
      this.loggedIn = true;
    });
    */

    // new promise w/ set-timeout works
    /*return new Promise((resolve) => {
      this.loggedIn = true;
      setTimeout(() => {
        resolve();
      }, 0);
    });

    */

    // with set-timeout does not work
    /*return this.userData.isLoggedIn().then((loggedIn) => {
      setTimeout(() => {
        this.loggedIn = true;
      }, 0);
    });
    */


    // vanilla promise resolve does not work
    return this.userData.isLoggedIn().then((loggedIn) => {
      this.loggedIn = true;
      // this.loggedIn = loggedIn;
      // console.log('this.loggedIn: ', this.loggedIn);
    });
  }

  listenForLoginEvents() {
    /*this.events.subscribe('user:login', () => {
      this.loggedIn = true;
    });

    this.events.subscribe('user:signup', () => {
      this.loggedIn = true;
    });

    this.events.subscribe('user:logout', () => {
      this.loggedIn = false;
    });
    */
  }

  selectTab(index: number) {
    const tabs = document.querySelector('ion-tabs');
    if (tabs) {
      return tabs.componentOnReady().then(() => {
        return tabs.select(index);
      });
    }
  }

  login() {
    this.router.navigateByUrl('/login');
  }

  signup() {
    this.router.navigateByUrl('/sign-up');
  }

  openSupport() {
    this.router.navigateByUrl('/support');
  }

  openTutorial() {
    alert('todo tutorial');
  }
}

