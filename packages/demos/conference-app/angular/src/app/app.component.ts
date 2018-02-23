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
    private menu: MenuController,
    private router: Router,
    private userData: UserData) {
  }

  ngOnInit() {
    this.checkLoginStatus();
    this.listenForLoginEvents();
  }

  checkLoginStatus() {
    return this.userData.isLoggedIn().then((loggedIn) => {
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  listenForLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    this.events.subscribe('user:signup', () => {
      this.updateLoggedInStatus(true);
    });

    this.events.subscribe('user:logout', () => {
      this.updateLoggedInStatus(false);
    });
  }

  selectTab(index: number, fallbackUrl: string) {
    const tabs = document.querySelector('ion-tabs');
    let promise: Promise<any> = null;
    if (tabs) {
      promise = tabs.componentOnReady();
      promise.then(() => {
        return tabs.select(index);
      });
    } else {
      promise = this.navigate(fallbackUrl);
    }
    return promise.then(() => {
      return this.menu.toggle();
    });
  }

  navigate(url: string) {
    return this.router.navigateByUrl(url);
  }

  logout() {
    this.userData.logout().then(() => {
      return this.navigate('/app/tabs/(schedule:schedule)');
    });
  }

  openTutorial() {
    alert('todo tutorial');
  }
}

