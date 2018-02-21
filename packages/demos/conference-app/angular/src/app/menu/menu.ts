import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';

import { UserData } from '../providers/user-data';

@Component({
  templateUrl: 'menu.html',
  selector: 'app-menu'
})
export class Menu implements OnInit {

  loggedIn = false;
  constructor(private router: Router,
              private events: Events,
              private userData: UserData) {

  }

  ngOnInit() {
    this.checkLoginStatus();
    this.listenForLoginEvents();
    setInterval(() => {
      this.loggedIn = !this.loggedIn;
    }, 2000);
  }

  checkLoginStatus() {
    return this.userData.isLoggedIn().then((loggedIn) => {
      this.loggedIn = loggedIn;
      console.log('this.loggedIn: ', this.loggedIn);
    });
  }

  listenForLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.loggedIn = true;
    });

    this.events.subscribe('user:signup', () => {
      this.loggedIn = true;
    });

    this.events.subscribe('user:logout', () => {
      this.loggedIn = false;
    });
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
