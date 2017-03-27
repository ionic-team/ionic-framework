import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IonicPage } from '../../../../../..';

export interface Currency {
  symbol: string;
  code: string;
  name: string;
}

@IonicPage()
@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  notifications: any;
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

  fruitCtrl = new FormControl({value: 'grape', disabled: true});
  fruitsForm = new FormGroup({
    'fruit': this.fruitCtrl
  });

  constructor() {
    this.currency = this.currencies[0];
  }

  gamingCancel() {
    console.log('Gaming Select, Cancel');
  }

  gamingChange(selectedValue: any) {
    console.log('Gaming Select, Change value:', selectedValue);
  }

  musicSelect(selectedValue: any) {
    console.log('Music selected', selectedValue);
  }

  notificationSelect(selectedValue: any) {
    console.log('Notification select', selectedValue);
  }

  statusChange(ev: any) {
    this.status = ev.value;
  }

  resetGender() {
    this.gender = null;
  }

  selectedText() {
    return this.currency.symbol;
  }
}
