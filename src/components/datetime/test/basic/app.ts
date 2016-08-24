import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../..';



@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  myDate: any;
  wwwInvented = '1989';
  time = '13:47:00';
  netscapeReleased = '1994-12-15T13:47:20.789';
  operaReleased = '1995-04-15';
  firefoxReleased = '2002-09-23T15:03:46.789';
  webkitOpenSourced = '2005-06-17T11:06Z';
  chromeReleased = '2008-09-02';
  leapYearsSummerMonths = '';
  convertedDate = '';

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


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class E2EApp {
  root = E2EPage;
}

@NgModule({
  declarations: [
    E2EApp,
    E2EPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EPage
  ]
})
export class AppModule {}
