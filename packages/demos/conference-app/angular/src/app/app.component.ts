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

  }

  checkLoginStatus() {
// vanilla promise resolve does not work
    return this.userData.isLoggedIn().then((loggedIn) => {
      this.loggedIn = true;
      // this.loggedIn = loggedIn;
      // console.log('this.loggedIn: ', this.loggedIn);
    });
  }

}

