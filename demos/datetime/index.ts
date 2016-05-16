import {App, Page} from 'ionic-angular';


@Page({
  templateUrl: 'main.html'
})
class MainPage {
  wwwInvented = '1989';
  time = '13:47';
  netscapeRelease = '1994-12-15T13:47:20.789';
  operaRelease = '1995-04-15';
  firefoxRelease = '2002-09-23T15:03:46.789';
  webkitOpenSourced = '2005-06-17T11:06Z';
  chromeReleased = '2008-09-02';
  leapYearsSummerMonths = '';

  leapYearsArray = [2020, 2016, 2008, 2004, 2000, 1996];

  customShortDay = [
    'Dom',
    'Lun',
    'Mar',
    'Mié',
    'Jue',
    'Vie',
    'Sáb'
  ];

}


@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class ApiDemoApp {
  root = MainPage;

  constructor() {

  }
}
