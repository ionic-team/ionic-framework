import { Component } from '@angular/core';
import { ionicBootstrap } from '../../../../../src';

export interface Currency {
  symbol: string;
  code: string;
  name: string;
}

@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  musicSelectOpts: any = {
    title: '1994 Music',
    subTitle: 'Select your favorite',
    cssClass: 'music-select'
  };
  notificationSelectOpts: any = {
    title: 'Mute notifications',
    cssClass: 'notification-select'
  };
  gender: string;
  gaming: string = '';
  os: string = 'win3.1';
  years: Array<number> = [1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999];
  music: string = null;
  month: string = '12';
  year: string = '1994';
  notification: string = 'enable';
  status: string = 'checked';

  currencies: Currency[] = [
    {
      symbol: '$',
      code: 'USD',
      name: 'US Dollar'
    },
    {
      symbol: '€',
      code: 'EUR',
      name: 'Euro'
    },
    {
      symbol: '£',
      code: 'FKP',
      name: 'Falkland Islands Pound'
    },
    {
      symbol: '¢',
      code: 'GHS',
      name: 'Ghana Cedi'
    }
  ];
  currency: Currency;

  constructor() {
    this.currency = this.currencies[0];
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

  statusChange(ev: string) {
    this.status = ev;
  }

  resetGender() {
    this.gender = null;
  }

  selectedText() {
    return this.currency.symbol;
  }
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = E2EPage;
}

ionicBootstrap(E2EApp);
