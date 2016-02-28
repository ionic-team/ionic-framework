import {NgFor} from 'angular2/common';

import {App, Page} from 'ionic-angular';


@Page({
  templateUrl: 'main.html',
  directives: [NgFor]
})
class E2EPage {
  musicAlertOpts;
  gender: string;
  gaming: string;
  os: string;
  music: string;
  month: string;
  year: string;
  years: Array<number>;

  constructor() {
    this.gaming = '';
    this.os = 'win3.1';
    this.music = null;
    this.month = '12';
    this.year = '1994';

    this.years = [1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999];

    this.musicAlertOpts = {
      title: '1994 Music',
      subTitle: 'Select your favorite'
    };

    setTimeout(() => {
      this.gender = 'm';
    }, 1500);
  }

  gamingCancel() {
    console.log('Gaming Select, Cancel');
  }

  gamingChange(selectedValue) {
    console.log('Gaming Select, Change value:', selectedValue);
  }

  stpSelect() {
    console.log('STP selected')
  }

  resetGender() {
    this.gender = null;
  }
}


@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root;

  constructor() {
    this.root = E2EPage;
  }
}
