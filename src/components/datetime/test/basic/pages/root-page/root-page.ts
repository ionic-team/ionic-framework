import { Component } from '@angular/core';


@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
  myDate: any;
  monthOnly = '2012-12-15T13:47:20.789';
  wwwInvented = '1989';
  time = '13:47:00';
  netscapeReleased = '1994-12-15T13:47:20.789';
  operaReleased = '1995-04-15';
  firefoxReleased = '2002-09-23T15:03:46.789';
  webkitOpenSourced = '2005-06-17T11:06Z';
  chromeReleased = '2008-09-02';
  leapYearsSummerMonths = '';
  convertedDate = '';
  specificDaysMonthsYears = '';
  defaultValue: any;

  leapYearsArray = [2020, 2016, 2008, 2004, 2000, 1996];

  customShortDay = [
    's\u00f8n',
    'man',
    'tir',
    'ons',
    'tor',
    'fre',
    'l\u00f8r'
  ];

  customOptions: any = {
    buttons: [{
      text: 'Save',
      handler: () => console.log('Clicked Save!')
    }, {
      text: 'Log',
      handler: () => console.log('Clicked Log!')
    }]
  };

  onChange(ev: any) {
    console.log('Changed', ev);
  }

  onCancel(ev: any) {
    console.log('Canceled', ev);
  }

  clearLeapYear() {
    this.leapYearsSummerMonths = null;
  }

  convertDate() {
    this.convertedDate = new Date(this.myDate).toISOString();
  }
}
