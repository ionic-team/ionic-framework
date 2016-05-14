import {App, Page} from '../../../../../ionic';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  wwwInvented = '1989';
  time = '13:47';
  netscapeReleased = '1994-12-15T13:47:20.789';
  operaReleased = '1995-04-15';
  firefoxReleased = '2002-09-23T15:03:46.789';
  webkitOpenSourced = '2005-06-17T11:06Z';
  chromeReleased = '2008-09-02';
  leapYearsSummerMonths = '';

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
