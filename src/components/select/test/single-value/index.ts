import { Component } from '@angular/core';
import { ionicBootstrap } from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  musicAlertOpts: any;
  gender: string;
  gaming: string;
  os: string;
  music: string;
  month: string;
  year: string;
  years: Array<number>;
  notification: string;
  status: string;

  constructor() {
    this.gaming = '';
    this.os = 'win3.1';
    this.music = null;
    this.month = '12';
    this.year = '1994';
    this.notification = 'enable';
    this.status = 'checked';

    this.years = [1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999];

    this.musicAlertOpts = {
      title: '1994 Music',
      subTitle: 'Select your favorite',
      cssClass: 'music-select'
    };
  }

  gamingCancel() {
    console.log('Gaming Select, Cancel');
  }

  gamingChange(selectedValue: any) {
    console.log('Gaming Select, Change value:', selectedValue);
  }

  stpSelect() {
    console.log('STP selected');
  }

  resetGender() {
    this.gender = null;
  }
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = E2EPage;
}

ionicBootstrap(E2EApp);
